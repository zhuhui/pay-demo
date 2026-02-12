#!/usr/bin/env python3
import os
import subprocess
import sys

# Get port from environment variable, default to 8000
port = os.environ.get('PORT', '8000')

# Ensure port is a valid integer
try:
    port = int(port)
except ValueError:
    print(f"Invalid PORT value: {port}, using default 8000")
    port = 8000

# Run uvicorn with the port
cmd = [
    sys.executable, '-m', 'uvicorn',
    'main:app',
    '--host', '0.0.0.0',
    '--port', str(port)
]

print(f"Starting uvicorn on port {port}...")
print(f"Command: {' '.join(cmd)}")
os.execvp(cmd[0], cmd)
