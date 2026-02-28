from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader, PdfWriter
from PIL import Image
from io import BytesIO
import os
import uuid
from datetime import datetime
from typing import List, Optional
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="PDF Master API",
    description="Professional PDF processing API for developers",
    version="1.0.0",
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境需要限制
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=[
        "X-Original-Size",
        "X-Compressed-Size",
        "X-Reduction-Percent",
        "X-Original-Width",
        "X-Original-Height",
        "X-New-Width",
        "X-New-Height",
    ],
)

# 临时文件目录
TEMP_DIR = "/tmp/pdfmaster"
os.makedirs(TEMP_DIR, exist_ok=True)


@app.get("/")
async def root():
    return {
        "service": "PDF Master API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "pdf": {
                "merge": "/api/v1/pdf/merge",
                "split": "/api/v1/pdf/split",
                "info": "/api/v1/pdf/info",
            }
        },
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.post("/api/v1/pdf/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    """
    Merge multiple PDF files into one

    - **files**: List of PDF files to merge (2-20 files)
    - Returns: Merged PDF file
    """
    try:
        logger.info(f"Merging {len(files)} PDF files")

        if len(files) < 2:
            raise HTTPException(
                status_code=400, detail="At least 2 PDF files are required"
            )

        if len(files) > 20:
            raise HTTPException(status_code=400, detail="Maximum 20 PDF files allowed")

        # 验证所有文件都是 PDF
        for file in files:
            if not file.content_type or "pdf" not in file.content_type:
                raise HTTPException(
                    status_code=400, detail=f"File {file.filename} is not a PDF"
                )

        # 创建 PDF Writer
        writer = PdfWriter()
        total_pages = 0

        # 处理每个文件
        for file in files:
            content = await file.read()
            try:
                reader = PdfReader(BytesIO(content))
                for page in reader.pages:
                    writer.add_page(page)
                total_pages += len(reader.pages)
                logger.info(f"Added {len(reader.pages)} pages from {file.filename}")
            except Exception as e:
                logger.error(f"Error reading {file.filename}: {str(e)}")
                raise HTTPException(
                    status_code=400, detail=f"Invalid PDF file: {file.filename}"
                )

        # 生成输出文件
        output_id = str(uuid.uuid4())
        output_path = os.path.join(TEMP_DIR, f"merged_{output_id}.pdf")

        with open(output_path, "wb") as output_file:
            writer.write(output_file)

        file_size = os.path.getsize(output_path)
        logger.info(
            f"Merged PDF created: {output_path}, size: {file_size} bytes, pages: {total_pages}"
        )

        # 返回文件
        response = FileResponse(
            output_path,
            filename="merged.pdf",
            media_type="application/pdf",
            headers={
                "X-Total-Pages": str(total_pages),
                "X-File-Size": str(file_size),
            },
        )

        # 清理任务（异步）
        # TODO: 添加定时清理或上传到 R2

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error merging PDFs: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.post("/api/v1/pdf/split")
async def split_pdf(
    file: UploadFile = File(...),
    pages: Optional[str] = Form(None),  # 例如: "1,3,5-10"
    split_mode: Optional[str] = Form("single"),  # single, all, range
):
    """
    Split PDF by pages

    - **file**: PDF file to split
    - **pages**: Page ranges (e.g., "1,3,5-10"). Only for 'range' mode
    - **split_mode**: 'single' (extract specific pages), 'all' (each page separate), 'range' (custom ranges)
    - Returns: ZIP file containing split PDFs
    """
    try:
        logger.info(
            f"Splitting PDF: {file.filename}, mode: {split_mode}, pages: {pages}"
        )

        if not file.content_type or "pdf" not in file.content_type:
            raise HTTPException(status_code=400, detail="File must be a PDF")

        content = await file.read()
        reader = PdfReader(BytesIO(content))
        total_pages = len(reader.pages)

        if total_pages == 0:
            raise HTTPException(status_code=400, detail="PDF has no pages")

        writer = PdfWriter()
        output_files = []

        def parse_pages(page_str: str, total: int) -> List[int]:
            result = []
            parts = page_str.split(",")
            for part in parts:
                part = part.strip()
                if "-" in part:
                    start, end = part.split("-")
                    result.extend(range(int(start) - 1, int(end)))
                else:
                    result.append(int(part) - 1)
            return [p for p in result if 0 <= p < total]

        if split_mode == "all":
            for i in range(total_pages):
                writer = PdfWriter()
                writer.add_page(reader.pages[i])
                output_id = str(uuid.uuid4())
                output_path = os.path.join(TEMP_DIR, f"page_{i + 1}_{output_id}.pdf")
                with open(output_path, "wb") as f:
                    writer.write(f)
                output_files.append((f"page_{i + 1}.pdf", output_path))

        elif split_mode == "range" and pages:
            parsed_pages = parse_pages(pages, total_pages)
            if not parsed_pages:
                raise HTTPException(status_code=400, detail="Invalid page range")

            writer = PdfWriter()
            for page_num in parsed_pages:
                writer.add_page(reader.pages[page_num])

            output_id = str(uuid.uuid4())
            output_path = os.path.join(TEMP_DIR, f"split_{output_id}.pdf")
            with open(output_path, "wb") as f:
                writer.write(f)
            output_files.append((f"split_pages_{pages}.pdf", output_path))

        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid mode. Use 'all' to split all pages, or 'range' with pages parameter",
            )

        if not output_files:
            raise HTTPException(status_code=400, detail="No pages to export")

        if len(output_files) == 1:
            return FileResponse(
                output_files[0][1],
                filename=output_files[0][0],
                media_type="application/pdf",
            )

        import zipfile

        zip_id = str(uuid.uuid4())
        zip_path = os.path.join(TEMP_DIR, f"split_{zip_id}.zip")

        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for filename, filepath in output_files:
                zipf.write(filepath, filename)

        return FileResponse(
            zip_path,
            filename="split_pages.zip",
            media_type="application/zip",
            headers={"X-Total-Files": str(len(output_files))},
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error splitting PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Split failed: {str(e)}")


@app.post("/api/v1/pdf/compress")
async def compress_pdf(
    file: UploadFile = File(...),
    quality: int = 50,  # 压缩质量 1-100
):
    """
    Compress PDF file to reduce size

    - **file**: PDF file to compress
    - **quality**: Compression level 1-100 (default: 50, higher = better quality but larger size)
    - Returns: Compressed PDF file
    """
    try:
        logger.info(f"Compressing PDF: {file.filename}, quality: {quality}")

        if not file.content_type or "pdf" not in file.content_type:
            raise HTTPException(status_code=400, detail="File must be a PDF")

        # 读取文件
        content = await file.read()
        original_size = len(content)

        # 创建 reader 和 writer
        reader = PdfReader(BytesIO(content))
        writer = PdfWriter()

        # 添加所有页面
        for page in reader.pages:
            writer.add_page(page)

        # 压缩内容流
        for page in writer.pages:
            page.compress_content_streams()

        # 生成输出文件
        output_id = str(uuid.uuid4())
        output_path = os.path.join(TEMP_DIR, f"compressed_{output_id}.pdf")

        with open(output_path, "wb") as output_file:
            writer.write(output_file)

        compressed_size = os.path.getsize(output_path)
        reduction = ((original_size - compressed_size) / original_size) * 100

        logger.info(
            f"PDF compressed: {original_size} -> {compressed_size} bytes "
            f"({reduction:.1f}% reduction)"
        )

        return FileResponse(
            output_path,
            filename=f"compressed_{file.filename}",
            media_type="application/pdf",
            headers={
                "X-Original-Size": str(original_size),
                "X-Compressed-Size": str(compressed_size),
                "X-Reduction-Percent": f"{reduction:.1f}",
            },
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error compressing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")


@app.post("/api/v1/pdf/info")
async def get_pdf_info(file: UploadFile = File(...)):
    """
    Get PDF metadata and information

    - **file**: PDF file to analyze
    - Returns: JSON with PDF info
    """
    try:
        content = await file.read()
        reader = PdfReader(BytesIO(content))

        info = {
            "filename": file.filename,
            "pages": len(reader.pages),
            "file_size": len(content),
            "metadata": {},
        }

        if reader.metadata:
            info["metadata"] = {
                "title": reader.metadata.get("/Title", ""),
                "author": reader.metadata.get("/Author", ""),
                "subject": reader.metadata.get("/Subject", ""),
                "creator": reader.metadata.get("/Creator", ""),
                "producer": reader.metadata.get("/Producer", ""),
            }

        return JSONResponse(content=info)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid PDF file: {str(e)}")


# ==================== 图片处理 API ====================


@app.post("/api/v1/image/compress")
async def compress_image(
    file: UploadFile = File(...),
    quality: int = 85,
    format: Optional[str] = None,
):
    """
    Compress image file

    - **file**: Image file (JPG, PNG, WebP, etc.)
    - **quality**: Compression quality 1-100 (default: 85)
    - **format**: Output format (jpg, png, webp). If not specified, keeps original
    - Returns: Compressed image
    """
    try:
        logger.info(f"Compressing image: {file.filename}, quality: {quality}")

        # 读取图片
        content = await file.read()
        image = Image.open(BytesIO(content))
        original_size = len(content)

        # 确定输出格式 - 默认转为JPEG以获得更好的压缩效果
        if format:
            output_format = format.upper()
        else:
            # 如果原图是PNG且需要压缩，转为JPEG以获得更好的压缩率
            original_format = (image.format or "JPEG").upper()
            if original_format == "PNG":
                output_format = "JPEG"  # PNG转为JPEG以支持质量压缩
            else:
                output_format = original_format

        if output_format == "JPG":
            output_format = "JPEG"

        # 转换 RGBA 到 RGB（如果是 JPEG）
        if output_format == "JPEG" and image.mode in ("RGBA", "P"):
            background = Image.new("RGB", image.size, (255, 255, 255))
            background.paste(
                image, mask=image.split()[-1] if image.mode == "RGBA" else None
            )
            image = background

        # 压缩并保存
        output_id = str(uuid.uuid4())
        ext = output_format.lower().replace("jpeg", "jpg")
        output_path = os.path.join(TEMP_DIR, f"compressed_{output_id}.{ext}")

        save_kwargs = {"format": output_format}
        if output_format in ("JPEG", "WEBP"):
            save_kwargs["quality"] = quality
            save_kwargs["optimize"] = True
        elif output_format == "PNG":
            save_kwargs["optimize"] = True

        image.save(output_path, **save_kwargs)

        compressed_size = os.path.getsize(output_path)
        reduction = ((original_size - compressed_size) / original_size) * 100

        logger.info(
            f"Image compressed: {original_size} -> {compressed_size} bytes "
            f"({reduction:.1f}% reduction)"
        )

        media_type = f"image/{output_format.lower().replace('jpeg', 'jpg')}"

        return FileResponse(
            output_path,
            filename=f"compressed_{os.path.splitext(file.filename)[0]}.{ext}",
            media_type=media_type,
            headers={
                "X-Original-Size": str(original_size),
                "X-Compressed-Size": str(compressed_size),
                "X-Reduction-Percent": f"{reduction:.1f}",
            },
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error compressing image: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Image compression failed: {str(e)}"
        )


@app.post("/api/v1/image/resize")
async def resize_image(
    file: UploadFile = File(...),
    width: Optional[str] = Form(None),
    height: Optional[str] = Form(None),
    maintain_aspect: bool = Form(True),
):
    """
    Resize image to specified dimensions

    - **file**: Image file
    - **width**: Target width in pixels
    - **height**: Target height in pixels
    - **maintain_aspect**: Keep aspect ratio (default: True)
    - Returns: Resized image
    """
    try:
        # 转换字符串为整数（处理 "auto" 或空字符串的情况）
        width_int = int(width) if width and width != "auto" and width.strip() else None
        height_int = (
            int(height) if height and height != "auto" and height.strip() else None
        )

        logger.info(
            f"Resizing image: {file.filename}, width={width_int}, height={height_int}"
        )

        if not width_int and not height_int:
            raise HTTPException(status_code=400, detail="Must specify width or height")

        # 读取图片
        content = await file.read()
        image = Image.open(BytesIO(content))
        original_width, original_height = image.size

        # 计算新尺寸
        new_width = width_int
        new_height = height_int

        if maintain_aspect:
            if width_int and not height_int:
                ratio = width_int / original_width
                new_height = int(original_height * ratio)
                new_width = width_int
            elif height_int and not width_int:
                ratio = height_int / original_height
                new_width = int(original_width * ratio)
                new_height = height_int
            elif width_int and height_int:
                # 保持比例，适应指定框
                ratio = min(width_int / original_width, height_int / original_height)
                new_width = int(original_width * ratio)
                new_height = int(original_height * ratio)
        else:
            new_width = width_int or original_width
            new_height = height_int or original_height

        # 调整大小
        # 确保 new_width 和 new_height 不为 None
        final_width = new_width if new_width is not None else original_width
        final_height = new_height if new_height is not None else original_height
        resized_image = image.resize(
            (final_width, final_height), Image.Resampling.LANCZOS
        )

        # 保存
        output_id = str(uuid.uuid4())
        ext = image.format.lower() if image.format else "jpg"
        if ext == "jpeg":
            ext = "jpg"
        output_path = os.path.join(TEMP_DIR, f"resized_{output_id}.{ext}")

        save_kwargs = {"format": image.format or "JPEG"}
        if save_kwargs["format"] in ("JPEG", "WEBP"):
            save_kwargs["quality"] = 95

        resized_image.save(output_path, **save_kwargs)

        logger.info(
            f"Image resized: {original_width}x{original_height} -> {final_width}x{final_height}"
        )

        media_type = (
            f"image/{image.format.lower().replace('jpeg', 'jpg')}"
            if image.format
            else "image/jpeg"
        )

        return FileResponse(
            output_path,
            filename=f"resized_{final_width}x{final_height}_{file.filename}",
            media_type=media_type,
            headers={
                "X-Original-Width": str(original_width),
                "X-Original-Height": str(original_height),
                "X-New-Width": str(final_width),
                "X-New-Height": str(final_height),
            },
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error resizing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Image resize failed: {str(e)}")


@app.post("/api/v1/image/convert")
async def convert_image(
    file: UploadFile = File(...),
    target_format: str = "png",
):
    """
    Convert image to different format

    - **file**: Image file
    - **target_format**: Target format (jpg, png, webp, gif, bmp, tiff)
    - Returns: Converted image
    """
    try:
        logger.info(f"Converting image: {file.filename} to {target_format}")

        # 验证格式
        valid_formats = ["jpg", "jpeg", "png", "webp", "gif", "bmp", "tiff"]
        target_format = target_format.lower()
        if target_format not in valid_formats:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid format. Supported: {', '.join(valid_formats)}",
            )

        # 读取图片
        content = await file.read()
        image = Image.open(BytesIO(content))

        # 处理格式转换
        output_format = target_format.upper()
        if output_format == "JPG":
            output_format = "JPEG"

        # 转换 RGBA 到 RGB（如果是 JPEG）
        if output_format == "JPEG" and image.mode in ("RGBA", "P"):
            background = Image.new("RGB", image.size, (255, 255, 255))
            background.paste(
                image, mask=image.split()[-1] if image.mode == "RGBA" else None
            )
            image = background

        # 保存
        output_id = str(uuid.uuid4())
        ext = target_format.replace("jpeg", "jpg")
        output_path = os.path.join(TEMP_DIR, f"converted_{output_id}.{ext}")

        save_kwargs = {"format": output_format}
        if output_format in ("JPEG", "WEBP"):
            save_kwargs["quality"] = 95
            save_kwargs["optimize"] = True

        image.save(output_path, **save_kwargs)

        logger.info(f"Image converted to {target_format}")

        media_type = f"image/{target_format.replace('jpg', 'jpeg')}"

        return FileResponse(
            output_path,
            filename=f"converted_{os.path.splitext(file.filename)[0]}.{ext}",
            media_type=media_type,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting image: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Image conversion failed: {str(e)}"
        )


@app.post("/api/v1/pdf/to-jpg")
async def pdf_to_jpg(
    file: UploadFile = File(...),
    dpi: Optional[int] = Form(150),
    format: Optional[str] = Form("jpg"),
):
    """
    Convert PDF pages to images

    - **file**: PDF file to convert
    - **dpi**: Image resolution (default: 150)
    - **format**: Output format (jpg, png)
    - Returns: ZIP file containing images
    """
    try:
        try:
            from pdf2image import convert_from_bytes
        except ImportError:
            raise HTTPException(
                status_code=500,
                detail="PDF to image conversion not available. Please install pdf2image and poppler.",
            )

        logger.info(f"Converting PDF to JPG: {file.filename}, DPI: {dpi}")

        if not file.content_type or "pdf" not in file.content_type:
            raise HTTPException(status_code=400, detail="File must be a PDF")

        content = await file.read()
        images = convert_from_bytes(content, dpi=dpi)

        if not images:
            raise HTTPException(
                status_code=400, detail="Could not extract pages from PDF"
            )

        import zipfile
        import io

        zip_id = str(uuid.uuid4())
        zip_path = os.path.join(TEMP_DIR, f"pdf_images_{zip_id}.zip")

        output_format = format.lower() if format else "jpg"
        if output_format not in ["jpg", "jpeg", "png"]:
            output_format = "jpg"

        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
            for i, image in enumerate(images):
                img_buffer = io.BytesIO()
                if output_format in ["jpg", "jpeg"]:
                    image = image.convert("RGB")
                    image.save(img_buffer, format="JPEG", quality=95)
                    ext = "jpg"
                else:
                    image.save(img_buffer, format="PNG")
                    ext = "png"

                img_buffer.seek(0)
                zipf.writestr(f"page_{i + 1}.{ext}", img_buffer.read())

        logger.info(f"PDF converted to {len(images)} images")

        return FileResponse(
            zip_path,
            filename="pdf_images.zip",
            media_type="application/zip",
            headers={"X-Total-Pages": str(len(images))},
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting PDF to JPG: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")


@app.post("/api/v1/pdf/from-jpg")
async def jpg_to_pdf(
    files: List[UploadFile] = File(...),
):
    """
    Convert images to PDF

    - **files**: List of image files (JPG, PNG, etc.)
    - Returns: Combined PDF file
    """
    try:
        logger.info(f"Converting {len(files)} images to PDF")

        if len(files) < 1:
            raise HTTPException(status_code=400, detail="At least 1 image required")

        images = []
        for file in files:
            content = await file.read()
            img = Image.open(BytesIO(content))
            if img.mode == "RGBA":
                background = Image.new("RGB", img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3])
                img = background
            elif img.mode != "RGB":
                img = img.convert("RGB")
            images.append(img)

        if not images:
            raise HTTPException(status_code=400, detail="Could not process images")

        output_id = str(uuid.uuid4())
        output_path = os.path.join(TEMP_DIR, f"images_{output_id}.pdf")

        images[0].save(
            output_path,
            save_all=True,
            append_images=images[1:],
            resolution=100.0,
            quality=95,
        )

        logger.info(f"PDF created with {len(images)} pages")

        return FileResponse(
            output_path,
            filename="converted.pdf",
            media_type="application/pdf",
            headers={"X-Total-Pages": str(len(images))},
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting JPG to PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")


@app.post("/api/v1/pdf/to-word")
async def pdf_to_word(
    file: UploadFile = File(...),
):
    """
    Convert PDF to Word document

    - **file**: PDF file to convert
    - Returns: Word document (.docx)
    """
    try:
        try:
            from pdf2docx import Converter
        except ImportError:
            raise HTTPException(
                status_code=500,
                detail="PDF to Word conversion not available. Please install pdf2docx.",
            )

        logger.info(f"Converting PDF to Word: {file.filename}")

        if not file.content_type or "pdf" not in file.content_type:
            raise HTTPException(status_code=400, detail="File must be a PDF")

        content = await file.read()
        input_path = os.path.join(TEMP_DIR, f"input_{uuid.uuid4()}.pdf")
        output_path = os.path.join(TEMP_DIR, f"output_{uuid.uuid4()}.docx")

        with open(input_path, "wb") as f:
            f.write(content)

        cv = Converter(input_path)
        cv.convert(output_path)
        cv.close()

        os.remove(input_path)

        logger.info("PDF converted to Word")

        return FileResponse(
            output_path,
            filename=f"{os.path.splitext(file.filename)[0]}.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting PDF to Word: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
