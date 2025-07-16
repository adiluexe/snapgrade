"""
Test script for SnapGrade AI Backend
Run this to verify the backend is working correctly
"""

import requests
import json
import time
from pathlib import Path

# Configuration
BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
            print(f"   Response: {response.json()}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.ConnectionError:
        print("❌ Cannot connect to backend. Is the server running?")
        return False

def test_templates():
    """Test the templates endpoint"""
    print("\n🔍 Testing templates endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/templates")
        if response.status_code == 200:
            templates = response.json()["templates"]
            print(f"✅ Templates endpoint works - found {len(templates)} templates")
            for template in templates:
                print(f"   - {template['name']} ({template['questions']} questions)")
            return True
        else:
            print(f"❌ Templates endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Templates test failed: {e}")
        return False

def test_demo_processing():
    """Test the demo processing endpoint"""
    print("\n🔍 Testing demo processing...")
    try:
        response = requests.post(f"{BASE_URL}/process-demo")
        if response.status_code == 200:
            result = response.json()
            print("✅ Demo processing works")
            print(f"   Score: {result['score']}/{result['total_questions']} ({result['percentage']}%)")
            print(f"   Processing time: {result['processing_time']}s")
            return True
        else:
            print(f"❌ Demo processing failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Demo processing test failed: {e}")
        return False

def test_opencv_import():
    """Test if OpenCV and dependencies are properly installed"""
    print("\n🔍 Testing OpenCV and dependencies...")
    try:
        import cv2
        import numpy as np
        from PIL import Image
        
        print(f"✅ OpenCV version: {cv2.__version__}")
        print(f"✅ NumPy version: {np.__version__}")
        print(f"✅ PIL (Pillow) imported successfully")
        
        # Test basic OpenCV functionality
        test_image = np.zeros((100, 100, 3), dtype=np.uint8)
        gray = cv2.cvtColor(test_image, cv2.COLOR_BGR2GRAY)
        print("✅ OpenCV basic operations work")
        
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ OpenCV test failed: {e}")
        return False

def run_all_tests():
    """Run all tests"""
    print("🎯 SnapGrade AI Backend Test Suite")
    print("=" * 50)
    
    # Test dependencies first
    opencv_ok = test_opencv_import()
    
    if not opencv_ok:
        print("\n❌ Dependency tests failed. Please run setup script first.")
        return False
    
    # Test API endpoints
    health_ok = test_health_check()
    templates_ok = test_templates()
    demo_ok = test_demo_processing()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"   Dependencies: {'✅' if opencv_ok else '❌'}")
    print(f"   Health Check: {'✅' if health_ok else '❌'}")
    print(f"   Templates: {'✅' if templates_ok else '❌'}")
    print(f"   Demo Processing: {'✅' if demo_ok else '❌'}")
    
    all_passed = all([opencv_ok, health_ok, templates_ok, demo_ok])
    
    if all_passed:
        print("\n🎉 All tests passed! The backend is ready to use.")
    else:
        print("\n❌ Some tests failed. Check the error messages above.")
        if not health_ok:
            print("   💡 Make sure the backend server is running: python main.py")
    
    return all_passed

if __name__ == "__main__":
    run_all_tests()
