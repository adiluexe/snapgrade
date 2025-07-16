from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import cv2
import numpy as np
from PIL import Image
import io
import json
from typing import List, Optional
from pydantic import BaseModel

from src.bubble_detector import BubbleSheetProcessor
from src.improved_bubble_detector import ImprovedBubbleSheetProcessor
from src.models import ProcessingResult, BubbleSheetTemplate

app = FastAPI(
    title="SnapGrade AI Backend",
    description="OpenCV-powered bubble sheet processing API",
    version="1.0.0"
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize both processors
processor = BubbleSheetProcessor()
improved_processor = ImprovedBubbleSheetProcessor()

@app.get("/")
async def root():
    return {"message": "SnapGrade AI Backend is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "bubble-detection"}

@app.get("/templates")
async def get_templates():
    """Get available bubble sheet templates"""
    templates = [
        {
            "id": "simple_5",
            "name": "Simple 5 Questions",
            "questions": 5,
            "choices": ["A", "B", "C", "D"],
            "description": "5-question bubble sheet with A-D choices (optimized detection)"
        },
        {
            "id": "standard_25",
            "name": "Standard 25 Questions",
            "questions": 25,
            "choices": ["A", "B", "C", "D"],
            "description": "Standard 25-question bubble sheet with A-D choices"
        },
        {
            "id": "standard_50", 
            "name": "Standard 50 Questions",
            "questions": 50,
            "choices": ["A", "B", "C", "D"],
            "description": "Standard 50-question bubble sheet with A-D choices"
        },
        {
            "id": "extended_100",
            "name": "Extended 100 Questions", 
            "questions": 100,
            "choices": ["A", "B", "C", "D", "E"],
            "description": "Extended 100-question bubble sheet with A-E choices"
        }
    ]
    return {"templates": templates}

@app.post("/process-image")
async def process_bubble_sheet(
    file: UploadFile = File(...),
    answer_key: str = Form(...),
    template_id: str = Form(default="standard_25"),
    student_id: Optional[str] = Form(default=None)
):
    """
    Process an uploaded bubble sheet image
    
    Args:
        file: The bubble sheet image file
        answer_key: JSON string of correct answers e.g. ["A","B","C","D"]
        template_id: Template to use for processing
        student_id: Optional student identifier
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Parse answer key
        try:
            correct_answers = json.loads(answer_key)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid answer_key format")
        
        # Read and process image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert PIL image to OpenCV format
        cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Use improved processor for 5-question template
        if template_id == "simple_5":
            print(f"🎯 Using improved processor for {template_id}")
            result = improved_processor.process_image(
                cv_image, 
                correct_answers, 
                template_id,
                student_id
            )
        else:
            print(f"🎯 Using standard processor for {template_id}")
            result = processor.process_image(
                cv_image, 
                correct_answers, 
                template_id,
                student_id
            )
        
        # Check if processing was successful
        if hasattr(result, 'success') and not result.success:
            # Return error result
            return JSONResponse(content=result.model_dump(), status_code=400)
        
        return JSONResponse(content=result.model_dump())
        
    except Exception as e:
        import traceback
        print(f"Error processing image: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.post("/process-demo")
async def process_demo_image():
    """
    Process a demo image for testing (returns mock data)
    """
    # Return realistic demo data
    demo_result = {
        "success": True,
        "student_answers": ["A", "B", "C", "D", "A", "B", "C", "D", "A", "B"],
        "correct_answers": ["A", "B", "C", "D", "A", "C", "C", "D", "B", "B"],
        "score": 8,
        "total_questions": 10,
        "percentage": 80.0,
        "incorrect_questions": [6, 9, 10],
        "processing_time": 0.85,
        "confidence_scores": [0.95, 0.92, 0.88, 0.94, 0.90, 0.87, 0.93, 0.91, 0.89, 0.86],
        "image_quality": {
            "resolution": "Good",
            "lighting": "Excellent", 
            "skew_angle": 2.3,
            "blur_score": 0.92
        }
    }
    
    return JSONResponse(content=demo_result)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
