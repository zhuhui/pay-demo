FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and startup script
COPY main.py .
COPY start.py .

# Create temp directory
RUN mkdir -p /tmp/pdfmaster && chmod +x start.py

# Expose port
EXPOSE 8000

# Run application with dynamic port from environment variable
CMD ["python3", "start.py"]
