@echo off
cd /d "%~dp0"
echo Site de resultados rodando em http://127.0.0.1:8788
echo Feche esta janela somente quando terminar de usar o site.
start "" "http://127.0.0.1:8788"
"C:\Users\joaog\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.js
pause
