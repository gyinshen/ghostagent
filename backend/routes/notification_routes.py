from uuid import UUID

from auth import AuthBearer
from fastapi import APIRouter, Depends
from repository.notification.get_report_notifications import (
    get_report_notifications,
)

notification_router = APIRouter()


@notification_router.get(
    "/notifications/{report_id}",
    dependencies=[Depends(AuthBearer())],
    tags=["Notification"],
)
async def get_notifications(
    report_id: UUID,
):
    """
    Get notifications by report_id
    """

    return get_report_notifications(report_id)
