from typing import Optional
from uuid import UUID

from models.databases.repository import Repository
from pydantic import BaseModel


class CreateReportHistory(BaseModel):
    report_id: UUID
    user_message: str
    assistant: str
    prompt_id: Optional[UUID]
    end_time: Optional[str]
    start_time: Optional[str]
    report_link: Optional[str]


class Reports(Repository):
    def __init__(self, supabase_client):
        self.db = supabase_client

    def create_report(self, new_report):
        response = self.db.table("reports").insert(new_report).execute()
        return response

    def get_report_by_id(self, report_id: str):
        response = (
            self.db.from_("reports")
            .select("*")
            .filter("report_id", "eq", report_id)
            .execute()
        )
        return response

    def get_report_history(self, report_id: str):
        reponse = (
            self.db.from_("report_history")
            .select("*")
            .filter("report_id", "eq", report_id)
            .order("message_time", desc=False)  # Add the ORDER BY clause
            .execute()
        )

        return reponse

    def get_user_reports(self, user_id: str):
        response = (
            self.db.from_("reports")
            .select("report_id,user_id,creation_time,report_name")
            .filter("user_id", "eq", user_id)
            .execute()
        )
        return response

    def update_report_history(self, report_history: CreateReportHistory):
        response = (
            self.db.table("report_history")
            .insert(
                {
                    "report_id": str(report_history.report_id),
                    "user_message": report_history.user_message,
                    "assistant": report_history.assistant,
                    "prompt_id": str(report_history.prompt_id)
                    if report_history.prompt_id
                    else None,
                    "start_time": report_history.start_time,
                    "report_link": report_history.report_link,
                    "end_time": report_history.end_time,
                }
            )
            .execute()
        )

        return response

    def update_report(self, report_id, updates):
        response = (
            self.db.table("reports").update(updates).match({"report_id": report_id}).execute()
        )

        return response

    def update_message_by_id(self, message_id, updates):
        response = (
            self.db.table("report_history")
            .update(updates)
            .match({"message_id": message_id})
            .execute()
        )

        return response

    def get_report_details(self, report_id):
        response = (
            self.db.from_("reports")
            .select("*")
            .filter("report_id", "eq", report_id)
            .execute()
        )
        return response

    def delete_report(self, report_id):
        self.db.table("reports").delete().match({"report_id": report_id}).execute()

    def delete_report_history(self, report_id):
        self.db.table("report_history").delete().match({"report_id": report_id}).execute()
