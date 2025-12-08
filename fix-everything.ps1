Write-Host "========================================="
Write-Host " STARTING FULL PROJECT AUTO FIX (WINDOWS) "
Write-Host "========================================="

# 1. CLEAN ROOT DEPS
Write-Host "[1/10] Cleaning root dependencies..."
Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "package-lock.json" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue

# Clean nested node_modules
Get-ChildItem -Recurse -Directory -Filter "node_modules" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

# 2. INSTALL ROOT DEPS
Write-Host "[2/10] Installing root dependencies..."
npm install --legacy-peer-deps

# 3. FRONTEND FIXES
if (Test-Path "./frontend") {
    Write-Host "[3/10] Fixing frontend..."

    Set-Location "./frontend"

    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force "package-lock.json" -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue

    npm install --legacy-peer-deps

    # Fix Tailwind config
    Write-Host "[4/10] Fixing Tailwind paths..."
    if (Test-Path "tailwind.config.js") {
        (Get-Content tailwind.config.js) |
            ForEach-Object { $_ -replace 'content: \[', 'content: ["./app/**/*.{js,ts,jsx,tsx}","./components/**/*.{js,ts,jsx,tsx}","./src/**/*.{js,ts,jsx,tsx}",' } |
            Set-Content tailwind.config.js
    }

    # ESLint
    Write-Host "[5/10] Running ESLint..."
    npx eslint . --ext .js,.jsx,.ts,.tsx --fix

    # Prettier
    Write-Host "[6/10] Running Prettier..."
    npx prettier --write "**/*.{js,jsx,tsx,ts,json,md}"

    # ENV CHECK
    if (!(Test-Path ".env.local")) {
        Write-Host "[7/10] Creating .env.local..."
        "NEXT_PUBLIC_API_URL=http://localhost:5000" | Out-File -FilePath ".env.local"
    }

    # Build test
    Write-Host "[8/10] Testing frontend build..."
    npm run build

    Set-Location ".."
}

# 4. BACKEND FIXES
if (Test-Path "./backend") {
    Write-Host "[9/10] Fixing backend..."

    Set-Location "./backend"

    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force "package-lock.json" -ErrorAction SilentlyContinue

    npm install --legacy-peer-deps

    # ENV CHECK
    if (!(Test-Path ".env")) {
        Write-Host "[10/10] Creating backend .env..."
        "MONGO_URI=mongodb://localhost:27017/projectdb" | Out-File -FilePath ".env"
        "JWT_SECRET=secret123" | Out-File -Append -FilePath ".env"
    }

    # Test backend
    Write-Host "Testing backend..."
    Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru | Out-Null
    Start-Sleep -Seconds 5
    Get-Process node | Stop-Process -Force

    Set-Location ".."
}

Write-Host "========================================="
Write-Host " PROJECT AUTO FIX COMPLETE "
Write-Host "========================================="
