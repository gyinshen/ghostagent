from typing import List

from models import Report, get_supabase_db


def get_user_reports(user_id: str) -> List[Report]:
    supabase_db = get_supabase_db()
    response = supabase_db.get_user_reports(user_id)
    reports = [Report(report_dict) for report_dict in response.data]
    return reports
