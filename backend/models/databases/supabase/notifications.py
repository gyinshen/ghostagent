from typing import Optional
from uuid import UUID

from fastapi import HTTPException
from models.databases.repository import Repository
from models.notifications import Notification, NotificationsStatusEnum
from pydantic import BaseModel


class CreateNotificationProperties(BaseModel):
    """Properties that can be received on notification creation"""

    report_id: Optional[UUID] = None
    message: Optional[str] = None
    action: str
    status: NotificationsStatusEnum = NotificationsStatusEnum.Pending

    def dict(self, *args, **kwargs):
        notification_dict = super().dict(*args, **kwargs)
        if notification_dict.get("report_id"):
            notification_dict["report_id"] = str(notification_dict.get("report_id"))
        return notification_dict


class DeleteNotificationResponse(BaseModel):
    """Response when deleting a prompt"""

    status: str = "delete"
    notification_id: UUID


class NotificationUpdatableProperties(BaseModel):
    """Properties that can be received on notification update"""

    message: Optional[str]
    status: Optional[NotificationsStatusEnum] = NotificationsStatusEnum.Done


class Notifications(Repository):
    def __init__(self, supabase_client):
        self.db = supabase_client

    def add_notification(
        self, notification: CreateNotificationProperties
    ) -> Notification:
        """
        Add a notification
        """
        response = (
            self.db.from_("notifications").insert(notification.dict()).execute()
        ).data
        return Notification(**response[0])

    def update_notification_by_id(
        self, notification_id: UUID, notification: NotificationUpdatableProperties
    ) -> Notification:
        """Update a notification by id"""
        response = (
            self.db.from_("notifications")
            .update(notification.dict(exclude_unset=True))
            .filter("id", "eq", notification_id)
            .execute()
        ).data

        if response == []:
            raise HTTPException(404, "Notification not found")

        return Notification(**response[0])

    def remove_notification_by_id(
        self, notification_id: UUID
    ) -> DeleteNotificationResponse:
        """
        Remove a notification by id
        Args:
            notification_id (UUID): The id of the notification

        Returns:
            str: Status message
        """
        response = (
            self.db.from_("notifications")
            .delete()
            .filter("id", "eq", notification_id)
            .execute()
            .data
        )

        if response == []:
            raise HTTPException(404, "Notification not found")

        return DeleteNotificationResponse(
            status="deleted", notification_id=notification_id
        )


    def remove_notifications_by_report_id(self, report_id: UUID) -> None:
        """
        Remove all notifications for a report
        Args:
            report_id (UUID): The id of the report
        """
        (
            self.db.from_("notifications")
            .delete()
            .filter("report_id", "eq", report_id)
            .execute()
        ).data

    def get_notifications_by_report_id(self, report_id: UUID) -> list[Notification]:
        """
        Get all notifications for a report
        Args:
            report_id (UUID): The id of the report

        Returns:
            list[Notification]: The notifications
        """
        notifications = (
            self.db.from_("notifications")
            .select("*")
            .filter("report_id", "eq", report_id)
            .execute()
        ).data

        return [Notification(**notification) for notification in notifications]