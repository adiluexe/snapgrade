"""
Simple test script to reproduce the JSON serialization error
"""
import requests
import json
from pathlib import Path

# Test with a simple image processing request
def test_image_processing():
    url = "http://localhost:8000/process-image"
    
    # Create a simple test file
    test_data = {
        'answer_key': json.dumps(["A", "B", "C", "D", "A"]),
        'template_id': 'standard_25',
        'student_id': 'test-student'
    }
    
    # Create a dummy file for testing
    files = {
        'file': ('test.jpg', b'dummy_image_data', 'image/jpeg')
    }
    
    try:
        response = requests.post(url, data=test_data, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Success!")
            print(json.dumps(result, indent=2))
        else:
            print("❌ Error occurred")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_image_processing()
