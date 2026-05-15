@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$url='http://127.0.0.1:8788'; try { Invoke-WebRequest -Uri ($url + '/api/status') -UseBasicParsing -TimeoutSec 2 | Out-Null } catch { Start-Process -WindowStyle Hidden -FilePath 'C:\Users\joaog\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' -ArgumentList 'server.js' -WorkingDirectory (Get-Location).Path; Start-Sleep -Seconds 2 }; Start-Process $url"
