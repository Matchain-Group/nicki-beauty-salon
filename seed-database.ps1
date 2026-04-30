# Seed the database
Write-Host "Seeding database with products and portfolio items..."
Set-Location "c:\Users\DELL\Documents\nicki-beauty-salon"

# Make sure server is running first
Write-Host "Make sure the server is running on http://localhost:3000"
Write-Host "Then run: curl http://localhost:3000/api/seed"
Write-Host "Or visit: http://localhost:3000/api/seed in your browser"

# Try to seed if server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/seed" -Method GET -UseBasicParsing
    Write-Host "Database seeded successfully!"
    Write-Host $response.Content
} catch {
    Write-Host "Error: Server is not running. Please start the server first."
    Write-Host "Run: .\start-server.ps1"
}
