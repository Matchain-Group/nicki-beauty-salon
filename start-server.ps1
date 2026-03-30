# Start the development server
Write-Host "Starting Nicki Beauty Salon development server..."
Set-Location "c:\Users\DELL\Documents\nicki-beauty-salon"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
}

# Start the server
Write-Host "Starting server on http://localhost:3000"
npm run dev
