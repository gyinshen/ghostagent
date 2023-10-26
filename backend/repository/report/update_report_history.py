from typing import List

from fastapi import HTTPException
from models.databases.supabase.reports import CreateReportHistory
from models import ReportHistory, get_supabase_db


def update_report_history(report_history: CreateReportHistory) -> ReportHistory:
    supabase_db = get_supabase_db()
    response: List[ReportHistory] = (supabase_db.update_report_history(report_history)).data
    if len(response) == 0:
        raise HTTPException(
            status_code=500, detail="An exception occurred while updating report history."
        )
    return ReportHistory(response[0])  # pyright: ignore reportPrivateUsage=none
