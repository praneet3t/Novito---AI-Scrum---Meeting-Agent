#!/bin/bash
echo "Starting Novito Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi
echo "Starting Vite dev server..."
npm run dev
