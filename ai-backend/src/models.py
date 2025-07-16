from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class BubbleSheetTemplate(BaseModel):
    id: str
    name: str
    questions: int
    choices: List[str]
    description: str

class ImageQuality(BaseModel):
    resolution: str
    lighting: str
    skew_angle: float
    blur_score: float

class ProcessingResult(BaseModel):
    success: bool
    student_answers: List[str]
    correct_answers: List[str]
    score: int
    total_questions: int
    percentage: float
    incorrect_questions: List[int]
    processing_time: float
    confidence_scores: List[float]
    image_quality: ImageQuality
    student_id: Optional[str] = None
    processed_at: datetime = datetime.now()
    
class ErrorResult(BaseModel):
    success: bool = False
    error: str
    error_code: str
