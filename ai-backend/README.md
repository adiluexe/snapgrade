# SnapGrade OpenCV Backend

A Python FastAPI service for bubble sheet processing using computer vision.

## Setup

1. Create virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the development server:

```bash
uvicorn main:app --reload --port 8000
```

## API Endpoints

- `POST /process-image` - Process uploaded bubble sheet image
- `GET /health` - Health check endpoint
- `GET /templates` - Get available bubble sheet templates

## Development

The main processing logic is in `src/bubble_detector.py`. The API routes are defined in `main.py`.

## Testing

```bash
# Test with sample image
curl -X POST "http://localhost:8000/process-image" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test_images/sample_bubble_sheet.jpg" \
  -F "answer_key=[\"A\",\"B\",\"C\",\"D\"]"
```
