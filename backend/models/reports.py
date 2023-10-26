from typing import List, Optional, Tuple
from uuid import UUID

from pydantic import BaseModel


class ReportMessage(BaseModel):
    model: str = "gpt-3.5-turbo-16k"
    question: str
    # A list of tuples where each tuple is (speaker, text)
    history: List[Tuple[str, str]]
    temperature: float = 0.0
    max_tokens: int = 256
    use_summarization: bool = False
    report_id: Optional[UUID] = None
    report_name: Optional[str] = None


class ReportQuestion(BaseModel):
    question: str
    model: Optional[str]
    temperature: Optional[float]
    max_tokens: Optional[int]
