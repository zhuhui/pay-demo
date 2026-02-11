from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = "/tmp/pdfmaster-test"
os.makedirs(TEMP_DIR, exist_ok=True)


@app.get("/")
async def root():
    return {"status": "running", "service": "PDF Master API Test"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/api/v1/pdf/merge")
async def merge_pdfs(files: list[UploadFile] = File(...)):
    """测试接口 - 直接返回第一个文件（模拟合并）"""
    print(f"Received {len(files)} files")

    if len(files) < 2:
        return {"error": "Need at least 2 files"}

    # 测试：返回第一个文件
    first_file = files[0]
    content = await first_file.read()

    output_path = os.path.join(TEMP_DIR, f"test_{uuid.uuid4()}.pdf")
    with open(output_path, "wb") as f:
        f.write(content)

    return FileResponse(
        output_path, filename="merged.pdf", media_type="application/pdf"
    )


if __name__ == "__main__":
    import uvicorn

    print("Starting test server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
