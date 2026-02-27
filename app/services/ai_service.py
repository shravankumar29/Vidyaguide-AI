import google.generativeai as genai
from app.core.config import settings
import json
import re

# We will try to use Gemini API. If the user provides a key, we configure it.
if getattr(settings, "GEMINI_API_KEY", None):
    genai.configure(api_key=settings.GEMINI_API_KEY)

def clean_json_response(text: str) -> str:
    """Removes markdown code blocks to safely parse JSON from Gemini."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

async def generate_ai_response(prompt: str, system_instruction: str = None, mock_response: dict = None) -> dict:
    """
    Centralized function to call Gemini AI.
    Falls back to mock_response if no API key is set.
    """
    # Try fetching the GEMINI_API_KEY dynamically just in case it was added
    import os
    from dotenv import load_dotenv
    load_dotenv(override=True)
    
    gemini_key = os.getenv("GEMINI_API_KEY") or getattr(settings, "GEMINI_API_KEY", None)
    
    if not gemini_key:
        if mock_response:
            return mock_response
        return {"error": "No AI API key configured"}

    genai.configure(api_key=gemini_key)
    # Using gemini-2.5-flash which is fast and supports JSON instructions well
    model = genai.GenerativeModel('gemini-2.5-flash', 
                                  system_instruction=system_instruction)
    
    try:
        # Prompting it strictly for JSON
        full_prompt = prompt + "\n\nRETURN STRICTLY VALID JSON ONLY WITHOUT MARKDOWN FORMATTING."
        response = model.generate_content(full_prompt)
        
        cleaned_text = clean_json_response(response.text)
        return json.loads(cleaned_text)
    except Exception as e:
        import traceback
        with open("ai_error_log.txt", "a") as f:
            f.write(f"Gemini AI error: {e}\n{traceback.format_exc()}\n")
        print(f"Gemini AI error: {e}")
        if mock_response:
            return mock_response
        raise e
