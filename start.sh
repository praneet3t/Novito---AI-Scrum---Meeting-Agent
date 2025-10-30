#!/bin/bash

echo "Starting Novito..."

# Start backend in background
(cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python -m uvicorn app.main:app --reload --port 8000) &

sleep 5

# Start frontend in background
(cd frontend && npm install && npm run dev) &

echo ""
echo "Novito is starting..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

wait
