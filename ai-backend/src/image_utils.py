import base64
import io
from PIL import Image
import numpy as np
import cv2
from typing import Union

def base64_to_opencv(base64_string: str) -> np.ndarray:
    """
    Convert base64 encoded image to OpenCV format
    
    Args:
        base64_string: Base64 encoded image data
        
    Returns:
        OpenCV image array (BGR format)
    """
    # Remove data URL prefix if present
    if base64_string.startswith('data:image'):
        base64_string = base64_string.split(',')[1]
    
    # Decode base64
    image_data = base64.b64decode(base64_string)
    
    # Convert to PIL Image
    pil_image = Image.open(io.BytesIO(image_data))
    
    # Convert to RGB if necessary
    if pil_image.mode != 'RGB':
        pil_image = pil_image.convert('RGB')
    
    # Convert PIL to OpenCV (BGR)
    opencv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    
    return opencv_image

def opencv_to_base64(image: np.ndarray, format: str = 'PNG') -> str:
    """
    Convert OpenCV image to base64 string
    
    Args:
        image: OpenCV image array
        format: Image format (PNG, JPEG)
        
    Returns:
        Base64 encoded image string
    """
    # Encode image to bytes
    _, buffer = cv2.imencode(f'.{format.lower()}', image)
    
    # Convert to base64
    base64_string = base64.b64encode(buffer).decode('utf-8')
    
    return f"data:image/{format.lower()};base64,{base64_string}"

def resize_image(image: np.ndarray, max_width: int = 1200, max_height: int = 1600) -> np.ndarray:
    """
    Resize image while maintaining aspect ratio
    
    Args:
        image: OpenCV image array
        max_width: Maximum width
        max_height: Maximum height
        
    Returns:
        Resized image
    """
    height, width = image.shape[:2]
    
    # Calculate scaling factor
    width_scale = max_width / width
    height_scale = max_height / height
    scale = min(width_scale, height_scale, 1.0)  # Don't upscale
    
    if scale < 1.0:
        new_width = int(width * scale)
        new_height = int(height * scale)
        resized = cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)
        return resized
    
    return image

def validate_image(image: np.ndarray) -> tuple[bool, str]:
    """
    Validate if image is suitable for processing
    
    Args:
        image: OpenCV image array
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if image is None:
        return False, "Invalid image data"
    
    if len(image.shape) not in [2, 3]:
        return False, "Image must be grayscale or color"
    
    height, width = image.shape[:2]
    
    if width < 300 or height < 400:
        return False, "Image resolution too low (minimum 300x400)"
    
    if width > 4000 or height > 6000:
        return False, "Image resolution too high (maximum 4000x6000)"
    
    return True, "Valid image"

def enhance_image_quality(image: np.ndarray) -> np.ndarray:
    """
    Apply image enhancement techniques for better bubble detection
    
    Args:
        image: OpenCV image array
        
    Returns:
        Enhanced image
    """
    # Convert to grayscale if needed
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image.copy()
    
    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    
    # Apply slight denoising
    denoised = cv2.fastNlMeansDenoising(enhanced)
    
    return denoised
