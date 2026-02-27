print("APP STARTED")

import gradio as gr
import PyPDF2
import os
from dotenv import load_dotenv
from pdf2image import convert_from_bytes
import pytesseract
from transformers import pipeline

# -------------------------------
# SETUP
# -------------------------------
load_dotenv()

# Load local Hugging Face model
generator = pipeline("text-generation", model="distilgpt2")

# Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# -------------------------------
# TEXT EXTRACTION (PDF + OCR)
# -------------------------------
def extract_text_advanced(file):
    try:
        file.seek(0)

        # Try normal PDF extraction
        reader = PyPDF2.PdfReader(file)
        text = ""

        for page in reader.pages:
            content = page.extract_text()
            if content:
                text += content

        if text.strip():
            return text

        # OCR fallback
        file.seek(0)
        images = convert_from_bytes(file.read())

        ocr_text = ""
        for img in images:
            ocr_text += pytesseract.image_to_string(img)

        return ocr_text

    except Exception as e:
        return f"❌ Text extraction failed: {str(e)}"

# -------------------------------
# AI ANALYSIS FUNCTION (HF MODEL)
# -------------------------------
def analyze_resume(file):
    try:
        if file is None:
            return "❌ No file uploaded."

        if not file.name.lower().endswith(".pdf"):
            return "❌ Please upload a PDF file only."

        text = extract_text_advanced(file)

        print("Extracted text preview:", text[:200])

        if not text or not text.strip():
            return "❌ Could not extract text from this PDF."

        prompt = f"""
        Analyze this resume and provide:

        - Key Skills
        - Missing Skills
        - Resume Score out of 100
        - Suggestions for improvement

        Resume:
        {text[:1000]}
        """

        result = generator(prompt, max_length=300, num_return_sequences=1)

        return result[0]['generated_text']

    except Exception as e:
        return f"❌ Error: {str(e)}"

# -------------------------------
# GRADIO UI
# -------------------------------
interface = gr.Interface(
    fn=analyze_resume,
    inputs=gr.File(label="Upload Resume (PDF only)"),
    outputs="text",
    title="🚀 VidyaMitra AI Career Agent",
    description="Upload your resume and get AI-powered analysis."
)

# -------------------------------
# LAUNCH APP
# -------------------------------
if __name__ == "__main__":
    print("LAUNCHING UI...")
    interface.launch(inbrowser=True, share=True)