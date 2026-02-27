import os
from app.core.config import settings
from app.services.ai_service import generate_ai_response
import json

async def analyze_resume_with_ai(resume_text: str):
    """
    Sends the parsed resume text to Gemini to score, extract skills, and find improvements.
    """
    mock = {
        "score": 75,
        "formatting_score": 80,
        "keyword_score": 60,
        "professional_summary": "A seasoned software engineer with foundational experience in backend development.",
        "key_strengths": ["Strong understanding of Python", "Solid API design logic"],
        "extracted_skills": ["Python", "FastAPI", "SQL"],
        "missing_skills": ["React", "Docker", "CI/CD"],
        "improvement_suggestions": ["Add more quantitative metrics to your achievements.", "Include links to active GitHub repositories."],
        "tailored_roles": ["Backend Developer", "Junior Python Engineer"]
    }
    prompt = f"""
    You are an expert technical recruiter and AI resume reviewer.
    Read the following resume and provide a deep, highly structured analysis for the user.
    
    Output strictly in valid JSON format matching this exact schema. 
    IMPORTANT: You MUST calculate ACTUAL scores based on the resume content. Do NOT just return 85 or 0.
    {{
      "score": 0,
      "formatting_score": 0,
      "keyword_score": 0,
      "professional_summary": "A brief, encouraging summary of their profile.",
      "key_strengths": ["Strength 1", "Strength 2"],
      "extracted_skills": ["Skill1", "Skill2"],
      "missing_skills": ["Skill3", "Skill4"],
      "improvement_suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
      "tailored_roles": ["Role 1", "Role 2 suitable for this resume"]
    }}
    
    Resume Text:
    {resume_text}
    """
    
    system_instruction = "You are an expert technical recruiter and resume reviewer. Always respond with valid JSON."
    return await generate_ai_response(prompt, system_instruction, mock_response=mock)
