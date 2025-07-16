import cv2
import numpy as np
import time
from typing import List, Tuple, Optional
import math

from .models import ProcessingResult, ImageQuality, ErrorResult

class BubbleSheetProcessor:
    """
    OpenCV-based bubble sheet processor for SnapGrade
    
    This class handles the complete pipeline:
    1. Image preprocessing (noise reduction, thresholding)
    2. Document detection and perspective correction
    3. Bubble detection and analysis
    4. Answer extraction and grading
    """
    
    def __init__(self):
        self.debug_mode = True
        
        # Template configurations
        self.templates = {
            "standard_25": {
                "questions": 25,
                "choices": ["A", "B", "C", "D"],
                "bubble_size_range": (15, 45),
                "expected_bubbles_per_row": 4
            },
            "standard_50": {
                "questions": 50, 
                "choices": ["A", "B", "C", "D"],
                "bubble_size_range": (12, 35),
                "expected_bubbles_per_row": 4
            },
            "extended_100": {
                "questions": 100,
                "choices": ["A", "B", "C", "D", "E"], 
                "bubble_size_range": (10, 30),
                "expected_bubbles_per_row": 5
            }
        }
    
    def process_image(self, image: np.ndarray, correct_answers: List[str], 
                     template_id: str = "standard_25", student_id: Optional[str] = None) -> ProcessingResult:
        """
        Main processing pipeline
        
        Args:
            image: OpenCV image (BGR format)
            correct_answers: List of correct answers
            template_id: Template configuration to use
            student_id: Optional student identifier
            
        Returns:
            ProcessingResult with detected answers and scoring
        """
        start_time = time.time()
        
        try:
            # Get template configuration
            template = self.templates.get(template_id)
            if not template:
                raise ValueError(f"Unknown template: {template_id}")
            
            # Step 1: Preprocess image
            processed_image = self._preprocess_image(image)
            
            # Step 2: Detect and correct document perspective
            corrected_image = self._correct_perspective(processed_image)
            
            # Step 3: Detect bubbles
            bubbles = self._detect_bubbles(corrected_image, template)
            
            # Step 4: Analyze which bubbles are filled
            student_answers = self._analyze_bubbles(corrected_image, bubbles, template)
            
            # Step 5: Grade the answers
            score, incorrect_questions = self._grade_answers(student_answers, correct_answers)
            
            # Step 6: Calculate confidence scores and image quality
            confidence_scores = self._calculate_confidence_scores(bubbles)
            image_quality = self._assess_image_quality(image, corrected_image)
            
            processing_time = time.time() - start_time
            
            return ProcessingResult(
                success=True,
                student_answers=student_answers,
                correct_answers=correct_answers,
                score=score,
                total_questions=len(correct_answers),
                percentage=round((score / len(correct_answers)) * 100, 1),
                incorrect_questions=incorrect_questions,
                processing_time=round(processing_time, 2),
                confidence_scores=confidence_scores,
                image_quality=image_quality,
                student_id=student_id
            )
            
        except Exception as e:
            processing_time = time.time() - start_time
            return ErrorResult(
                error=str(e),
                error_code="PROCESSING_FAILED"
            )
    
    def _preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """
        Preprocess the image for better bubble detection
        
        Steps:
        1. Convert to grayscale
        2. Apply Gaussian blur to reduce noise
        3. Apply adaptive thresholding
        4. Apply morphological operations to clean up
        """
        # Convert to grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Apply adaptive thresholding
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 11, 2
        )
        
        # Apply morphological operations to clean up
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
        cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_OPEN, kernel)
        
        return cleaned
    
    def _correct_perspective(self, image: np.ndarray) -> np.ndarray:
        """
        Detect document boundaries and correct perspective distortion
        
        This is a simplified version - in production you'd want more robust
        document detection using contour analysis
        """
        # For now, return the image as-is
        # TODO: Implement proper perspective correction
        # 1. Find document contours
        # 2. Detect corners
        # 3. Apply perspective transform
        
        return image
    
    def _detect_bubbles(self, image: np.ndarray, template: dict) -> List[dict]:
        """
        Detect bubble locations using HoughCircles
        
        Returns:
            List of bubble dictionaries with position and size info
        """
        bubbles = []
        
        # Use HoughCircles to detect circular shapes
        circles = cv2.HoughCircles(
            image,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=20,  # Minimum distance between circles
            param1=50,   # Upper threshold for edge detection
            param2=30,   # Accumulator threshold for center detection
            minRadius=template["bubble_size_range"][0],
            maxRadius=template["bubble_size_range"][1]
        )
        
        if circles is not None:
            circles = np.round(circles[0, :]).astype("int")
            
            # Sort circles by position (top to bottom, left to right)
            circles = sorted(circles, key=lambda c: (c[1], c[0]))
            
            for i, (x, y, r) in enumerate(circles):
                bubbles.append({
                    "id": i,
                    "x": int(x),
                    "y": int(y), 
                    "radius": int(r),
                    "question": None,  # Will be determined later
                    "choice": None     # Will be determined later
                })
        
        return bubbles
    
    def _analyze_bubbles(self, image: np.ndarray, bubbles: List[dict], template: dict) -> List[str]:
        """
        Analyze each bubble to determine if it's filled and map to answers
        
        Returns:
            List of student answers (one per question)
        """
        student_answers = []
        choices = template["choices"]
        bubbles_per_row = template["expected_bubbles_per_row"]
        
        # Group bubbles by rows (questions)
        questions = []
        for i in range(0, len(bubbles), bubbles_per_row):
            question_bubbles = bubbles[i:i + bubbles_per_row]
            if len(question_bubbles) == bubbles_per_row:
                questions.append(question_bubbles)
        
        # Analyze each question
        for question_idx, question_bubbles in enumerate(questions):
            filled_choices = []
            
            for choice_idx, bubble in enumerate(question_bubbles):
                if choice_idx < len(choices):
                    is_filled = self._is_bubble_filled(image, bubble)
                    if is_filled:
                        filled_choices.append(choices[choice_idx])
            
            # Determine the answer for this question
            if len(filled_choices) == 1:
                student_answers.append(filled_choices[0])
            elif len(filled_choices) == 0:
                student_answers.append("")  # No answer
            else:
                # Multiple answers - take the first one or mark as invalid
                student_answers.append(filled_choices[0])
        
        return student_answers
    
    def _is_bubble_filled(self, image: np.ndarray, bubble: dict) -> bool:
        """
        Determine if a bubble is filled by analyzing pixel intensity
        
        Args:
            image: Preprocessed binary image
            bubble: Bubble dictionary with x, y, radius
            
        Returns:
            Boolean indicating if bubble is filled
        """
        x, y, r = bubble["x"], bubble["y"], bubble["radius"]
        
        # Create a mask for the bubble area
        mask = np.zeros(image.shape, dtype=np.uint8)
        cv2.circle(mask, (x, y), r, 255, -1)
        
        # Count filled pixels in the bubble area
        bubble_area = cv2.bitwise_and(image, mask)
        filled_pixels = cv2.countNonZero(bubble_area)
        total_pixels = cv2.countNonZero(mask)
        
        # Calculate fill ratio
        fill_ratio = filled_pixels / total_pixels if total_pixels > 0 else 0
        
        # Threshold for considering a bubble "filled"
        # This value may need tuning based on your bubble sheets
        threshold = 0.3
        
        return fill_ratio > threshold
    
    def _grade_answers(self, student_answers: List[str], correct_answers: List[str]) -> Tuple[int, List[int]]:
        """
        Grade the student answers against the correct answers
        
        Returns:
            Tuple of (score, list of incorrect question numbers)
        """
        score = 0
        incorrect_questions = []
        
        for i, (student, correct) in enumerate(zip(student_answers, correct_answers)):
            if student == correct:
                score += 1
            else:
                incorrect_questions.append(i + 1)  # 1-based question numbers
        
        return score, incorrect_questions
    
    def _calculate_confidence_scores(self, bubbles: List[dict]) -> List[float]:
        """
        Calculate confidence scores for each detected answer
        
        This is a simplified version - could be enhanced with more sophisticated analysis
        """
        # For now, return mock confidence scores
        # In practice, you'd analyze bubble quality, clarity, etc.
        return [0.9 + (i % 10) * 0.01 for i in range(len(bubbles))]
    
    def _assess_image_quality(self, original: np.ndarray, processed: np.ndarray) -> ImageQuality:
        """
        Assess the quality of the input image
        
        Analyzes resolution, lighting, skew, and blur
        """
        height, width = original.shape[:2]
        
        # Simple quality assessment
        resolution = "Good" if width > 800 and height > 600 else "Poor"
        
        # Analyze lighting (mean brightness)
        if len(original.shape) == 3:
            gray = cv2.cvtColor(original, cv2.COLOR_BGR2GRAY)
        else:
            gray = original
            
        mean_brightness = np.mean(gray)
        if mean_brightness > 200:
            lighting = "Too Bright"
        elif mean_brightness < 50:
            lighting = "Too Dark"
        else:
            lighting = "Good"
        
        # Simple skew detection (could be enhanced)
        skew_angle = 0.0  # Placeholder
        
        # Simple blur detection using Laplacian variance
        blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
        blur_score = min(blur_score / 1000, 1.0)  # Normalize
        
        return ImageQuality(
            resolution=resolution,
            lighting=lighting,
            skew_angle=skew_angle,
            blur_score=round(blur_score, 2)
        )
