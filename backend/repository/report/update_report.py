from dataclasses import dataclass
from typing import Optional

from logger import get_logger
from models import Report, get_supabase_db

logger = get_logger(__name__)


@dataclass
class ReportUpdatableProperties:
    report_name: Optional[str] = None

    def __init__(self, report_name: Optional[str]):
        self.report_name = report_name


def update_report(report_id, report_data: ReportUpdatableProperties) -> Report:
    supabase_db = get_supabase_db()

    if not report_id:
        logger.error("No report_id provided")
        return  # pyright: ignore reportPrivateUsage=none

    updates = {}

    if report_data.report_name is not None:
        updates["report_name"] = report_data.report_name

    updated_report = None

    if updates:
        updated_report = (supabase_db.update_report(report_id, updates)).data[0]
        logger.info(f"Report {report_id} updated")
    else:
        logger.info(f"No updates to apply for report {report_id}")
    return updated_report  # pyright: ignore reportPrivateUsage=none
