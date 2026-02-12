#!/usr/bin/env python3
import os
import sys

# Get port from environment variable
port = os.environ.get('PORT', '8000')
print(f"[START.PY] PORT environment variable: {port}")
print(f"[START.PY] All environment variables: {dict(os.environ)}")

# Ensure port is a valid integer
try:
    port_int = int(port)
    print(f"[START.PY] Converted port to integer: {port_int}")
except ValueError:
    print(f"[START.PY] Invalid PORT value: {port}, using default 8000")
    port_int = 8000

# Run uvicorn with the port
cmd = [
    sys.executable, '-m', 'uvicorn',
    'main:app',
    '--host', '0.0.0.0',
    '--port', str(port_int)
]

print(f"[START.PY] Starting uvicorn on port {port_int}...")
print(f"[START.PY] Command: {' '.join(cmd)}")
sys.stdout.flush()
sys.stderr.flush()

os.execvp(cmd[0], cmd)
