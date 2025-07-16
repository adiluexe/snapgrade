import cv2
import numpy as np
import time
from typing import List, Tuple, Optional
import math

from .models import ProcessingResult, ImageQuality, ErrorResult

class ImprovedBubbleSheetProcessor:
    """
    Improved OpenCV-based bubble sheet processor with better debugging
    """
    
    def __init__(self):
        self.debug_mode = True
        
        # More flexible template configurations
        self.templates = {
            "simple_5": {
                "questions": 5,
                "choices": ["A", "B", "C", "D"],
                "bubble_size_range": (10, 50),
                "expected_bubbles_per_row": 4,
                "layout": "vertical"  # Questions arranged vertically
            },
            "standard_25": {
                "questions": 25,
                "choices": ["A", "B", "C", "D"],
                "bubble_size_range": (15, 45),
                "expected_bubbles_per_row": 4,
                "layout": "grid"
            }
        }
    
    def process_image(self, image: np.ndarray, correct_answers: List[str], 
                     template_id: str = "simple_5", student_id: Optional[str] = None) -> ProcessingResult:
        """
        Main processing pipeline with improved debugging
        """
        start_time = time.time()
        
        try:
            print(f"🔍 Processing image with template: {template_id}")
            print(f"📝 Correct answers: {correct_answers}")
            
            # Get template configuration
            template = self.templates.get(template_id, self.templates["simple_5"])
            print(f"📋 Using template: {template}")
            
            # Step 1: Preprocess image
            processed_image = self._preprocess_image(image)
            print(f"✅ Image preprocessed: {processed_image.shape}")
            
            # Step 2: Detect bubbles with improved method
            bubbles = self._detect_bubbles_improved(processed_image, template)
            print(f"🎯 Found {len(bubbles)} bubbles")
            
            # Step 3: Analyze which bubbles are filled
            student_answers = self._analyze_bubbles_improved(processed_image, bubbles, template)
            print(f"📊 Student answers detected: {student_answers}")
            
            # Step 4: Grade the answers
            score, incorrect_questions = self._grade_answers(student_answers, correct_answers)
            print(f"🎓 Score: {score}/{len(correct_answers)}")
            
            # Step 5: Calculate metrics
            confidence_scores = [0.85] * len(student_answers)  # Simplified for now
            image_quality = self._assess_image_quality(image, processed_image)
            
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
            print(f"❌ Error processing image: {str(e)}")
            import traceback
            traceback.print_exc()
            
            return ErrorResult(
                error=str(e),
                error_code="PROCESSING_FAILED"
            )
    
    def _preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """
        Enhanced image preprocessing for better bubble detection
        """
        # Convert to grayscale
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image.copy()
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Apply adaptive thresholding for better bubble detection
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 11, 2
        )
        
        return thresh
    
    def _detect_bubbles_improved(self, image: np.ndarray, template: dict) -> List[dict]:
        """
        Improved bubble detection using both HoughCircles and contour detection
        """
        bubbles = []
        height, width = image.shape
        
        print(f"🔍 Image dimensions: {width}x{height}")
        
        # Method 1: HoughCircles detection
        circles = cv2.HoughCircles(
            image,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=30,  # Increased minimum distance
            param1=50,
            param2=30,
            minRadius=template["bubble_size_range"][0],
            maxRadius=template["bubble_size_range"][1]
        )
        
        if circles is not None:
            circles = np.round(circles[0, :]).astype("int")
            print(f"🎯 HoughCircles found: {len(circles)} circles")
            
            # Sort circles by position (top to bottom, left to right)
            circles = sorted(circles, key=lambda c: (c[1], c[0]))
            
            for i, (x, y, r) in enumerate(circles):
                bubbles.append({
                    "id": i,
                    "x": int(x),
                    "y": int(y), 
                    "radius": int(r),
                    "method": "hough"
                })
        else:
            print("⚠️ No circles found with HoughCircles, trying contour detection...")
        
        # Method 2: Contour detection as backup
        if len(bubbles) < template["questions"] * len(template["choices"]):
            contour_bubbles = self._detect_bubbles_by_contours(image, template)
            bubbles.extend(contour_bubbles)
            print(f"🔍 Added {len(contour_bubbles)} bubbles from contour detection")
        
        print(f"📊 Total bubbles detected: {len(bubbles)}")
        return bubbles
    
    def _detect_bubbles_by_contours(self, image: np.ndarray, template: dict) -> List[dict]:
        """
        Alternative bubble detection using contour analysis
        """
        bubbles = []
        
        # Find contours
        contours, _ = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        min_area = 3.14 * (template["bubble_size_range"][0] ** 2)
        max_area = 3.14 * (template["bubble_size_range"][1] ** 2)
        
        for i, contour in enumerate(contours):
            area = cv2.contourArea(contour)
            
            if min_area <= area <= max_area:
                # Check if contour is roughly circular
                perimeter = cv2.arcLength(contour, True)
                if perimeter > 0:
                    circularity = 4 * 3.14 * area / (perimeter * perimeter)
                    
                    if circularity > 0.5:  # Reasonably circular
                        # Get centroid
                        M = cv2.moments(contour)
                        if M["m00"] != 0:
                            cx = int(M["m10"] / M["m00"])
                            cy = int(M["m01"] / M["m00"])
                            radius = int(math.sqrt(area / 3.14))
                            
                            bubbles.append({
                                "id": len(bubbles),
                                "x": cx,
                                "y": cy,
                                "radius": radius,
                                "method": "contour",
                                "area": area,
                                "circularity": circularity
                            })
        
        return bubbles
    
    def _analyze_bubbles_improved(self, image: np.ndarray, bubbles: List[dict], template: dict) -> List[str]:
        """
        Improved bubble analysis with better fill detection
        """
        if not bubbles:
            print("⚠️ No bubbles to analyze!")
            return [""] * template["questions"]
        
        choices = template["choices"]
        expected_bubbles = template["questions"] * len(choices)
        
        print(f"📋 Expected bubbles: {expected_bubbles}, Found: {len(bubbles)}")
        
        # If we don't have enough bubbles, use a simplified approach
        if len(bubbles) < expected_bubbles:
            return self._simple_bubble_analysis(image, bubbles, template)
        
        # Group bubbles by rows (questions)
        bubbles_per_row = len(choices)
        student_answers = []
        
        # Sort bubbles by Y coordinate first, then X coordinate
        sorted_bubbles = sorted(bubbles, key=lambda b: (b["y"], b["x"]))
        
        for question_idx in range(template["questions"]):
            start_idx = question_idx * bubbles_per_row
            end_idx = start_idx + bubbles_per_row
            
            if end_idx <= len(sorted_bubbles):
                question_bubbles = sorted_bubbles[start_idx:end_idx]
                
                # Sort by X coordinate to get A, B, C, D order
                question_bubbles = sorted(question_bubbles, key=lambda b: b["x"])
                
                filled_choices = []
                fill_values = []
                
                for choice_idx, bubble in enumerate(question_bubbles):
                    if choice_idx < len(choices):
                        fill_ratio = self._calculate_fill_ratio(image, bubble)
                        fill_values.append(fill_ratio)
                        
                        print(f"Q{question_idx+1}{choices[choice_idx]}: fill_ratio={fill_ratio:.3f}")
                        
                        if fill_ratio > 0.3:  # Threshold for considering a bubble filled
                            filled_choices.append(choices[choice_idx])
                
                # Determine the answer for this question
                if len(filled_choices) == 1:
                    student_answers.append(filled_choices[0])
                elif len(filled_choices) == 0:
                    # No clear answer, but check if any bubble has higher fill than others
                    if fill_values:
                        max_fill_idx = fill_values.index(max(fill_values))
                        if max(fill_values) > 0.15:  # Lower threshold for detection
                            student_answers.append(choices[max_fill_idx])
                            print(f"📝 Q{question_idx+1}: Using highest fill ({max(fill_values):.3f}) -> {choices[max_fill_idx]}")
                        else:
                            student_answers.append("")
                    else:
                        student_answers.append("")
                else:
                    # Multiple answers - take the first one
                    student_answers.append(filled_choices[0])
                    print(f"⚠️ Q{question_idx+1}: Multiple answers detected: {filled_choices}")
            else:
                student_answers.append("")
        
        return student_answers
    
    def _simple_bubble_analysis(self, image: np.ndarray, bubbles: List[dict], template: dict) -> List[str]:
        """
        Simplified analysis when we don't have perfect bubble detection
        """
        print("🔧 Using simplified bubble analysis...")
        
        choices = template["choices"]
        student_answers = []
        
        # Group bubbles by approximate rows
        height = image.shape[0]
        rows_per_question = height // template["questions"]
        
        for question_idx in range(template["questions"]):
            question_y_start = question_idx * rows_per_question
            question_y_end = (question_idx + 1) * rows_per_question
            
            # Find bubbles in this question's Y range
            question_bubbles = [
                b for b in bubbles 
                if question_y_start <= b["y"] <= question_y_end
            ]
            
            if question_bubbles:
                # Sort by X coordinate
                question_bubbles = sorted(question_bubbles, key=lambda b: b["x"])
                
                # Analyze fills
                best_choice = ""
                best_fill = 0
                
                for i, bubble in enumerate(question_bubbles[:len(choices)]):
                    fill_ratio = self._calculate_fill_ratio(image, bubble)
                    
                    if i < len(choices):
                        print(f"Q{question_idx+1}{choices[i]}: fill_ratio={fill_ratio:.3f}")
                        
                        if fill_ratio > best_fill and fill_ratio > 0.2:
                            best_fill = fill_ratio
                            best_choice = choices[i]
                
                student_answers.append(best_choice)
            else:
                student_answers.append("")
        
        return student_answers
    
    def _calculate_fill_ratio(self, image: np.ndarray, bubble: dict) -> float:
        """
        Calculate how much of a bubble is filled (0.0 to 1.0)
        """
        x, y, r = bubble["x"], bubble["y"], bubble["radius"]
        
        # Create a mask for the bubble area
        mask = np.zeros(image.shape, dtype=np.uint8)
        cv2.circle(mask, (x, y), r, 255, -1)
        
        # Count filled pixels in the bubble area
        bubble_area = cv2.bitwise_and(image, mask)
        filled_pixels = cv2.countNonZero(bubble_area)
        total_pixels = cv2.countNonZero(mask)
        
        if total_pixels == 0:
            return 0.0
            
        fill_ratio = filled_pixels / total_pixels
        return fill_ratio
    
    def _grade_answers(self, student_answers: List[str], correct_answers: List[str]) -> Tuple[int, List[int]]:
        """
        Grade the student answers against the correct answers
        """
        score = 0
        incorrect_questions = []
        
        for i, (student, correct) in enumerate(zip(student_answers, correct_answers)):
            if student == correct:
                score += 1
                print(f"✅ Q{i+1}: {student} == {correct}")
            else:
                incorrect_questions.append(i + 1)
                print(f"❌ Q{i+1}: {student} != {correct}")
        
        return score, incorrect_questions
    
    def _assess_image_quality(self, original: np.ndarray, processed: np.ndarray) -> ImageQuality:
        """
        Assess the quality of the input image
        """
        height, width = original.shape[:2]
        
        resolution = "Good" if width > 800 and height > 600 else "Poor"
        
        # Analyze lighting
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
        
        # Simple blur detection
        blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
        blur_score = min(blur_score / 1000, 1.0)
        
        return ImageQuality(
            resolution=resolution,
            lighting=lighting,
            skew_angle=0.0,
            blur_score=round(blur_score, 2)
        )
