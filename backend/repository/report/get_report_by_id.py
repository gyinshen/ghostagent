from models import Report, get_supabase_db


def get_report_by_id(report_id: str) -> Report:
    supabase_db = get_supabase_db()

    response = supabase_db.get_report_by_id(report_id)
    return Report(response.data[0])
