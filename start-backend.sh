#!/bin/bash
echo "Starting Novito Backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
echo "Installing dependencies..."
pip install -r requirements.txt
echo "Starting FastAPI server..."
uvicorn app.main:app --reload --port 8000
