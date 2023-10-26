from dataclasses import dataclass
from uuid import UUID

from logger import get_logger
from models import Report, get_supabase_db

logger = get_logger(__name__)


@dataclass
class CreateReportProperties:
    name: str

    def __init__(self, name: str):
        self.name = name


def create_report(user_id: UUID, report_data: CreateReportProperties) -> Report:
    supabase_db = get_supabase_db()

    # Report is created upon the user's first question asked
    logger.info(f"New report entry in reports table for user {user_id}")

    # Insert a new row into the reports table
    new_report = {
        "user_id": str(user_id),
        "report_name": report_data.name,
    }
    insert_response = supabase_db.create_report(new_report)
    logger.info(f"Insert response {insert_response.data}")

    return insert_response.data[0]
