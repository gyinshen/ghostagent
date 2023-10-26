from abc import ABC, abstractmethod
from datetime import datetime
from uuid import UUID


class Repository(ABC):
    @abstractmethod

    @abstractmethod
    def create_user_daily_usage(self, user_id: UUID, user_email: str, date: datetime):
        pass

    @abstractmethod
    def get_user_usage(self, user_id: UUID):
        pass

    @abstractmethod
    def get_user_requests_count_for_day(self, user_id: UUID, date: datetime):
        pass

    @abstractmethod
    def update_user_request_count(self, user_id: UUID, date: str):
        pass

    @abstractmethod
    def increment_user_request_count(
        self, user_id: UUID, date: str, current_request_count
    ):
        pass

    @abstractmethod
    def get_user_email(self, user_id: UUID):
        pass

    @abstractmethod
    def create_report(self, new_report):
        pass

    @abstractmethod
    def get_report_by_id(self, report_id: str):
        pass

    @abstractmethod
    def get_report_history(self, report_id: str):
        pass

    @abstractmethod
    def get_user_reports(self, user_id: str):
        pass

    @abstractmethod
    def update_report_history(self, report_id: str, user_message: str, assistant: str):
        pass

    @abstractmethod
    def update_report(self, report_id: UUID, updates):
        pass

    @abstractmethod
    def update_message_by_id(self, message_id: UUID, updates):
        pass

    @abstractmethod
    def get_report_details(self, report_id: UUID):
        pass

    @abstractmethod
    def delete_report(self, report_id: UUID):
        pass

    @abstractmethod
    def delete_report_history(self, report_id: UUID):
        pass


    @abstractmethod
    def add_notification(self, notification):
        pass

    @abstractmethod
    def update_notification_by_id(self, id: UUID):
        pass

    @abstractmethod
    def remove_notification_by_id(self, id: UUID):
        pass

    
    @abstractmethod
    def remove_notifications_by_report_id(self, report_id: UUID):
        pass

    @abstractmethod
    def get_notifications_by_report_id(self, report_id: UUID):
        pass
