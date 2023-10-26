from enum import Enum
from typing import List, Union
from uuid import UUID

from models.notifications import Notification
from pydantic import BaseModel
from utils.parse_message_time import (
    parse_message_time,
)

from repository.report.get_report_history import GetReportHistoryOutput, get_report_history
from repository.notification.get_report_notifications import (
    get_report_notifications,
)


class ReportItemType(Enum):
    MESSAGE = "MESSAGE"
    NOTIFICATION = "NOTIFICATION"


class ReportItem(BaseModel):
    item_type: ReportItemType
    body: Union[GetReportHistoryOutput, Notification]


def merge_report_history_and_notifications(
    report_history: List[GetReportHistoryOutput], notifications: List[Notification]
) -> List[ReportItem]:
    report_history_and_notifications = report_history + notifications

    report_history_and_notifications.sort(
        key=lambda x: parse_message_time(x.message_time)
        if isinstance(x, GetReportHistoryOutput)
        else parse_message_time(x.datetime)
    )

    transformed_data = []
    for item in report_history_and_notifications:
        if isinstance(item, GetReportHistoryOutput):
            item_type = ReportItemType.MESSAGE
            body = item
        else:
            item_type = ReportItemType.NOTIFICATION
            body = item
        transformed_item = ReportItem(item_type=item_type, body=body)
        transformed_data.append(transformed_item)

    return transformed_data


def get_report_history_with_notifications(
    report_id: UUID,
) -> List[ReportItem]:
    report_history = get_report_history(str(report_id))
    report_notifications = get_report_notifications(report_id)
    return merge_report_history_and_notifications(report_history, report_notifications)
