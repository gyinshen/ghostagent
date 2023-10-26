from typing import List, Optional
from uuid import UUID

from models import ReportHistory, get_supabase_db
from pydantic import BaseModel

class GetReportHistoryOutput(BaseModel):
    report_id: UUID
    message_id: UUID
    user_message: str
    assistant: str
    message_time: str

    def dict(self, *args, **kwargs):
        report_history = super().dict(*args, **kwargs)
        report_history["report_id"] = str(report_history.get("report_id"))
        report_history["message_id"] = str(report_history.get("message_id"))

        return report_history


def get_report_history(report_id: str) -> List[GetReportHistoryOutput]:
    supabase_db = get_supabase_db()
    history: List[dict] = supabase_db.get_report_history(report_id).data
    if history is None:
        return []
    else:
        enriched_history: List[GetReportHistoryOutput] = []
        for message in history:
            message = ReportHistory(message)
            


            enriched_history.append(
                GetReportHistoryOutput(
                    report_id=(UUID(message.report_id)),
                    message_id=(UUID(message.message_id)),
                    user_message=message.user_message,
                    assistant=message.assistant,
                    message_time=message.message_time,
                )
            )
        return enriched_history
