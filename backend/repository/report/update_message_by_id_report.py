from logger import get_logger
from models import ReportHistory, get_supabase_db

logger = get_logger(__name__)


def update_message_by_id_report(
    message_id: str,
    user_message: str = None,  # pyright: ignore reportPrivateUsage=none
    assistant: str = None,  # pyright: ignore reportPrivateUsage=none
) -> ReportHistory:
    supabase_db = get_supabase_db()

    if not message_id:
        logger.error("No message_id provided")
        return  # pyright: ignore reportPrivateUsage=none

    updates = {}

    if user_message is not None:
        updates["user_message"] = user_message

    if assistant is not None:
        updates["assistant"] = assistant

    updated_message = None

    if updates:
        updated_message = (supabase_db.update_message_by_id_report(message_id, updates)).data[  # type: ignore
            0
        ]
        logger.info(f"Message {message_id} updated")
    else:
        logger.info(f"No updates to apply for message {message_id}")
    return ReportHistory(updated_message)  # pyright: ignore reportPrivateUsage=none
