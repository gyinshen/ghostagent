import os
import time
import json
from fastapi.responses import StreamingResponse
import datetime
from datetime import timedelta
import asyncio
from typing import List
from uuid import UUID
from venv import logger
from repository.report.research_agent import ResearchAgent

from auth import AuthBearer, get_current_user
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from repository.notification.remove_report_notifications import (
    remove_report_notifications,
)

from models import (
    Report,
    ReportQuestion,
    UserIdentity,
    UserUsage,
    get_supabase_db,
)
from models.databases.supabase.supabase import SupabaseDB
from repository.report import (
    ReportUpdatableProperties,
    CreateReportProperties,
    create_report,
    get_report_by_id,
    get_user_reports,
    update_report,
)
from repository.report.get_report_history_with_notifications import (
    ReportItem,
    get_report_history_with_notifications,
)

from repository.report.update_report_history import update_report_history
from models.databases.supabase.reports import CreateReportHistory

from repository.user_identity import get_user_identity
import asyncio
from dotenv import load_dotenv

load_dotenv()

report_router = APIRouter()


BACKEND_URL = os.environ.get("BACKEND_URL")

class NullableUUID(UUID):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v) -> UUID | None:
        if v == "":
            return None
        try:
            return UUID(v)
        except ValueError:
            return None


def delete_report_from_db(supabase_db: SupabaseDB, report_id):
    try:
        supabase_db.delete_report_history(report_id)
    except Exception as e:
        print(e)
        pass
    try:
        supabase_db.delete_report(report_id)
    except Exception as e:
        print(e)
        pass


def check_user_requests_limit(
    user: UserIdentity,
):
    userDailyUsage = UserUsage(
        id=user.id, email=user.email, openai_api_key=user.openai_api_key
    )

    date = time.strftime("%Y%m%d")
    userDailyUsage.handle_increment_user_request_count(date)

    if user.openai_api_key is None:
        max_requests_number = int(os.getenv("MAX_REQUESTS_NUMBER", 1))
        if int(userDailyUsage.daily_requests_count) >= int(max_requests_number):
            raise HTTPException(
                status_code=429,  # pyright: ignore reportPrivateUsage=none
                detail="You have reached the maximum number of requests for today.",  # pyright: ignore reportPrivateUsage=none
            )
    else:
        pass


@report_router.get("/report/healthz", tags=["Health"])
async def healthz():
    return {"status": "ok"}


# get all reports
@report_router.get("/report", dependencies=[Depends(AuthBearer())], tags=["Report"])
async def get_reports(current_user: UserIdentity = Depends(get_current_user)):
    reports = get_user_reports(str(current_user.id))
    return {"reports": reports}


# delete one report
@report_router.delete(
    "/report/{report_id}", dependencies=[Depends(AuthBearer())], tags=["Report"]
)
async def delete_report(report_id: UUID):
    """
    Delete a specific report by report ID.
    """
    supabase_db = get_supabase_db()
    remove_report_notifications(report_id)

    delete_report_from_db(supabase_db=supabase_db, report_id=report_id)
    return {"message": f"{report_id}  has been deleted."}


# update existing report metadata
@report_router.put(
    "/report/{report_id}/metadata", dependencies=[Depends(AuthBearer())], tags=["Report"]
)
async def update_report_metadata_handler(
    report_data: ReportUpdatableProperties,
    report_id: UUID,
    current_user: UserIdentity = Depends(get_current_user),
) -> Report:
    """
    Update report attributes
    """

    report = get_report_by_id(report_id)  # pyright: ignore reportPrivateUsage=none
    if str(current_user.id) != report.user_id:
        raise HTTPException(
            status_code=403,  # pyright: ignore reportPrivateUsage=none
            detail="You should be the owner of the report to update it.",  # pyright: ignore reportPrivateUsage=none
        )
    return update_report(report_id=report_id, report_data=report_data)


# create new report
@report_router.post("/report", dependencies=[Depends(AuthBearer())], tags=["Report"])
async def create_report_handler(
    report_data: CreateReportProperties,
    current_user: UserIdentity = Depends(get_current_user),
):
    """
    Create a new report with initial report messages.
    """

    return create_report(user_id=current_user.id, report_data=report_data)


# add new question to report
@report_router.post(
    "/report/{report_id}/question/stream",
    dependencies=[
        Depends(
            AuthBearer(),
        ),
    ],
    tags=["Report"],
)
async def create_question_handler(
    request: Request,
    report_question: ReportQuestion,
    report_id: UUID,
    current_user: UserIdentity = Depends(get_current_user),
) -> StreamingResponse:

    async def create_new_report_and_yield_data(assistant_message, report_link=None, end_time=None):
        new_report = update_report_history(
            CreateReportHistory(
                **{
                    "report_id": report_id,
                    "user_message": report_question.question,
                    "assistant": assistant_message,
                    "report_link": report_link,
                    "end_time": str(end_time) if end_time else None
                }
            )
        )
        sse_data = json.dumps({
            "report_id": str(report_id),
            "user_message": report_question.question,
            "assistant": assistant_message,
            "report_link": str(report_link) if report_link else None,
            "message_time": new_report.message_time,
            "message_id": new_report.message_id,
            "end_time": str(end_time) if end_time else None
        })
        return f"data: {sse_data}\n\n"
    

    try:
        start_time = datetime.datetime.now()
        check_user_requests_limit(current_user)
        

        async def stream_results():
            yield await create_new_report_and_yield_data(f"Subject: {report_question.question}" )
            yield await create_new_report_and_yield_data("Agent initialized. Please do not refresh this page when the timer is running.")

            research_agent = ResearchAgent(report_question.question, 'research_report', None, create_new_report_and_yield_data)

            search_queries, message_search_queries = await research_agent.create_search_queries()
            yield await create_new_report_and_yield_data(message_search_queries)

            # create a coroutine for each query
            tasks = [research_agent.run_search_summary(query) for query in search_queries]

            # run all the tasks concurrently and yield as soon as they're ready
            for future in asyncio.as_completed(tasks):
                research_result, message_research_result, message_get_new_urls, message_async_search = await future
                yield await create_new_report_and_yield_data(message_async_search)
                yield await create_new_report_and_yield_data(message_get_new_urls)
                yield await create_new_report_and_yield_data(message_research_result)
                research_agent.research_summary += "\n\n" + research_result
                yield await create_new_report_and_yield_data(research_result)

            yield await create_new_report_and_yield_data(f"Total research words: {len(research_agent.research_summary.split(' '))}. 🚧 Writing report... Please wait.")

            report, path = await research_agent.write_report(report_type="research_report")

            end_time = datetime.datetime.now()
            time_diff = end_time - start_time
            total_seconds = time_diff.total_seconds()
            minutes, seconds = divmod(total_seconds, 60)

            yield await create_new_report_and_yield_data(report, path, end_time)

            yield await create_new_report_and_yield_data(f"⏬[Click here to download PDF report.]({BACKEND_URL}/{path})", path, end_time)
            
            yield await create_new_report_and_yield_data(f"⏱️Total run time: {int(minutes)}:{int(seconds)}", path, end_time)
            
            # yield await create_new_report_and_yield_data(f"Research is complete. Please [click 'New research'](myresearchghost.com/report) to start a new session.", path, end_time)
            yield await create_new_report_and_yield_data(f"✔️Research is complete. Please click 'New Report' to start a new session.", path, end_time)


        return StreamingResponse(stream_results(), media_type="text/event-stream")
    except HTTPException as e:
        raise e
        
# get report history
@report_router.get(
    "/report/{report_id}/history", tags=["Report"]
)
async def get_report_history_handler(
    report_id: UUID,
) -> List[ReportItem]:
    # TODO: RBAC with current_user
    return get_report_history_with_notifications(report_id)
