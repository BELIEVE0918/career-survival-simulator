$ErrorActionPreference = "Stop"

$envPath = Join-Path $PSScriptRoot ".env"
if (Test-Path $envPath) {
  Get-Content $envPath | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#") -or -not $line.Contains("=")) {
      return
    }
    $key, $value = $line.Split("=", 2)
    [Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim(), "Process")
  }
}

$env:COZE_BOT_ID = "7638871061970927662"

if (-not $env:COZE_API_TOKEN) {
  $secureToken = Read-Host "Paste Coze PAT token. Input is hidden" -AsSecureString
  $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
  try {
    $env:COZE_API_TOKEN = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
  }
}

Write-Host ""
Write-Host "Starting local site: http://localhost:3000"
Write-Host "In interview stage, feedback source should show: Coze Agent"
Write-Host ""

python server.py
