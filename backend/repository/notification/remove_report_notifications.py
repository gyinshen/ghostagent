from uuid import UUID
from models.settings import get_supabase_db


def remove_report_notifications(report_id: UUID) -> None:
    """
    Remove all notifications for a report
    """
    supabase_db = get_supabase_db()

    supabase_db.remove_notifications_by_report_id(report_id)
