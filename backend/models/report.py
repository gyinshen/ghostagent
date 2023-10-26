from dataclasses import asdict, dataclass
from typing import Optional
from uuid import UUID


@dataclass
class Report:
    report_id: str
    user_id: str
    creation_time: str
    report_name: str

    def __init__(self, report_dict: dict):
        self.report_id = report_dict.get("report_id", "")
        self.user_id = report_dict.get("user_id", "")
        self.creation_time = report_dict.get("creation_time", "")
        self.report_name = report_dict.get("report_name", "")


@dataclass
class ReportHistory:
    report_id: str
    message_id: str
    user_message: str
    assistant: str
    message_time: str
    start_time: Optional[str]
    report_link: Optional[str]
    end_time: Optional[str]

    def __init__(self, report_dict: dict):
        self.report_id = report_dict.get("report_id", "")
        self.message_id = report_dict.get("message_id", "")
        self.user_message = report_dict.get("user_message", "")
        self.assistant = report_dict.get("assistant", "")
        self.message_time = report_dict.get("message_time", "")
        self.start_time = report_dict.get("start_time", "")
        self.report_link = report_dict.get("report_link", "")
        self.end_time = report_dict.get("end_time", "")

    def to_dict(self):
        return asdict(self)
