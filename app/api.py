from datetime import datetime
from pydantic import BaseModel
from pydantic import BaseModel, EmailStr
from typing import List
from typing import List, Dict
from typing import List, Optional
from typing import Optional


class SkillGapRequest(BaseModel):
    user_skills: List[str]
    target_role: str

class SkillGapResponse(BaseModel):
    target_role: str
    matching_skills: List[str]
    missing_skills: List[str]
    learning_priorities: List[str]
    recommended_courses: List[Dict[str, str]]  # e.g., [{"title": "React for Beginners", "url": "..."}]

class CareerPathRequest(BaseModel):
    extracted_skills: List[str]
    domain: str

class CareerPathResponse(BaseModel):
    domain: str
    roadmap_steps: List[str]
    certifications: List[str]
    estimated_timeline: str



class InterviewQuestionRequest(BaseModel):
    domain: str
    difficulty: str = "intermediate"

class InterviewAnswerRequest(BaseModel):
    question: str
    user_answer: str
    domain: str

class InterviewEvaluationResponse(BaseModel):
    score: int  # out of 100
    feedback: str
    improved_answer: str

class QuizRequest(BaseModel):
    domain: str
    difficulty: str
    num_questions: int = 5

class QuizQuestion(BaseModel):
    question_text: str
    options: List[str]
    correct_option_index: int
    explanation: str

class QuizResponse(BaseModel):
    domain: str
    questions: List[QuizQuestion]



class ProgressRecord(BaseModel):
    module_name: str
    score: int

class ProgressLogRequest(BaseModel):
    module_name: str
    score: int

class UserProgress(BaseModel):
    user_id: str
    records: List[ProgressRecord]



class ResumeUploadResponse(BaseModel):
    id: str
    message: str
    file_url: str

class ResumeAnalysisRequest(BaseModel):
    resume_text: str

class ResumeAnalysisResponse(BaseModel):
    score: int
    formatting_score: int
    keyword_score: int
    professional_summary: str
    key_strengths: List[str]
    extracted_skills: List[str]
    missing_skills: List[str]
    improvement_suggestions: List[str]
    tailored_roles: List[str]



class YouTubeVideo(BaseModel):
    title: str
    url: str
    thumbnail: str

class TrainingPlanRequest(BaseModel):
    skill: str
    focus_area: str

class TrainingPlanResponse(BaseModel):
    skill: str
    videos: List[YouTubeVideo]
    timeline_weeks: int



class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    created_at: str




from app.core.config import settings
from app.db.supabase import supabase
from app.services.ai_service import generate_ai_response
from app.services.resume_service import analyze_resume_with_ai
from fastapi import APIRouter, Depends, HTTPException
from fastapi import APIRouter, HTTPException, status
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from googleapiclient.discovery import build
import PyPDF2
import io
import json
import uuid

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Very basic mock token verification for testing endpoints without frontend"""
    return credentials.credentials
router_auth = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router_auth.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    if not supabase:
        import uuid
        import datetime
        return UserResponse(
            id=str(uuid.uuid4()),
            email=user.email,
            name=user.name or "Mock User",
            created_at=datetime.datetime.now().isoformat()
        )
    # Use Supabase Auth for registration
    try:
        response = supabase.auth.signUp({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "name": user.name
                }
            }
        })
        # If successfully registered, return the user info
        user_data = response.user
        if not user_data:
            raise HTTPException(status_code=400, detail="Registration failed")
            
        return UserResponse(
            id=user_data.id,
            email=user_data.email,
            name=user_data.user_metadata.get("name") if user_data.user_metadata else user.name,
            created_at=user_data.created_at
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router_auth.post("/login", response_model=Token)
async def login(user: UserLogin):
    if not supabase:
        return Token(
            access_token="mock_jwt_token_for_local_testing",
            token_type="bearer"
        )
    try:
        response = supabase.auth.signInWithPassword({
            "email": user.email,
            "password": user.password
        })
        
        session = response.session
        if not session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
            
        return Token(
            access_token=session.access_token,
            token_type="bearer"
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))



router_career = APIRouter(
    prefix="/career",
    tags=["Career & Skills"]
)

@router_career.post("/skill-gap", response_model=SkillGapResponse)
async def analyze_skill_gap(request: SkillGapRequest, token: str = Depends(verify_token)):
    try:
        mock = {
            "target_role": request.target_role,
            "matching_skills": request.user_skills,
            "missing_skills": ["Advanced System Design", "Kubernetes"],
            "learning_priorities": ["Learn Kubernetes concepts", "Practice System Design"],
            "recommended_courses": [{"title": "Course Preview", "url": "https://example.com"}]
        }
        prompt = f"""
        Analyze the skill gap for a user aiming for the role of '{request.target_role}'.
        Their current skills are: {', '.join(request.user_skills)}.
        
        Provide a JSON response matching this schema exactly:
        {{
            "matching_skills": ["skill1", "skill2"],
            "missing_skills": ["skill3", "skill4"],
            "learning_priorities": ["priority 1", "priority 2"],
            "recommended_courses": [
                {{"title": "Course Name", "url": "https://example.com/course"}}
            ]
        }}
        """
        system_instruction = "You are a career counselor AI. Always respond with valid JSON."
        data = await generate_ai_response(prompt, system_instruction, mock_response=mock)
        data['target_role'] = request.target_role
        return SkillGapResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router_career.post("/roadmap", response_model=CareerPathResponse)
async def recommend_roadmap(request: CareerPathRequest, token: str = Depends(verify_token)):
    try:
        mock = {
            "domain": request.domain,
            "roadmap_steps": ["Learn Basics", "Build Projects", "Apply for Jobs"],
            "certifications": ["AWS Practitioner"],
            "estimated_timeline": "6 Months"
        }
        prompt = f"""
        Generate a career progression roadmap for the domain: '{request.domain}'.
        The user's current underlying skills are: {', '.join(request.extracted_skills)}.
        
        Provide a JSON response matching this schema exactly:
        {{
            "roadmap_steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
            "certifications": ["Cert 1", "Cert 2"],
            "estimated_timeline": "e.g., 6 Months or 1 Year"
        }}
        """
        system_instruction = "You are a senior career mentor. Return valid JSON only."
        data = await generate_ai_response(prompt, system_instruction, mock_response=mock)
        data['domain'] = request.domain
        return CareerPathResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



router_interactive = APIRouter(
    prefix="/interactive",
    tags=["Interviews & Quizzes"]
)

@router_interactive.post("/interview/generate", response_model=dict)
async def generate_interview_question(request: InterviewQuestionRequest, token: str = Depends(verify_token)):
    prompt = f"""
    Generate a challenging {request.difficulty} level technical interview question for a {request.domain} role. Output just the question text in JSON.
    Format: {{"question": "your question here"}}
    """
    try:
        mock = {"question": f"Can you explain a complex problem you solved in {request.domain}?"}
        data = await generate_ai_response(prompt, "You are a technical interviewer.", mock_response=mock)
        return {"question": data.get("question", "Could not generate question")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router_interactive.post("/interview/evaluate", response_model=InterviewEvaluationResponse)
async def evaluate_interview_answer(request: InterviewAnswerRequest, token: str = Depends(verify_token)):
    try:
        mock = {
            "score": 80,
            "feedback": "Good answer, but could use more technical depth.",
            "improved_answer": "I utilized X and Y to achieve Z with 20% performance gain."
        }
        prompt = f"""
        Evaluate the following answer to this technical interview question:
        Question: {request.question_text}
        User Answer: {request.user_answer}
        
        Provide a JSON response with:
        "score": integer between 0 and 100
        "feedback": concise constructive feedback
        "improved_answer": a better version of the answer
        """
        system_instruction = "You are an expert technical interviewer evaluating a candidate. Always respond with valid JSON."
        data = await generate_ai_response(prompt, system_instruction, mock_response=mock)
        return InterviewEvaluationResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router_interactive.post("/quiz/generate", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest, token: str = Depends(verify_token)):
    try:
        mock = {
            "questions": [
                {
                    "question_text": "What is 1+1?",
                    "options": ["1", "2", "3", "4"],
                    "correct_option_index": 1,
                    "explanation": "Basic math."
                }
            ]
        }
        prompt = f"""
        Generate a multiple-choice quiz about {request.domain} at a {request.difficulty} level.
        The quiz should have exactly {request.num_questions} questions.
        
        Output strictly valid JSON matching this schema:
        {{
            "questions": [
                {{
                    "question_text": "The question?",
                    "options": ["A", "B", "C", "D"],
                    "correct_option_index": 0,
                    "explanation": "Why this is correct."
                }}
            ]
        }}
        """
        system_instruction = "You are an expert quiz creator. Return strictly valid JSON."
        data = await generate_ai_response(prompt, system_instruction, mock_response=mock)
        
        # Parse into QuizQuestion objects 
        parsed_questions = []
        for q in data.get("questions", []):
             parsed_questions.append(QuizQuestion(
                 question_text=q.get("question_text", "Sample Question?"),
                 options=q.get("options", ["A", "B", "C", "D"]),
                 correct_option_index=q.get("correct_option_index", 0),
                 explanation=q.get("explanation", "Sample Explanation")
             ))
        return QuizResponse(domain=request.domain, questions=parsed_questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



router_progress = APIRouter(
    prefix="/progress",
    tags=["Progress Tracking"]
)

mock_db = []

@router_progress.post("/log")
async def log_progress(request: ProgressLogRequest, token: str = Depends(verify_token)):
    if not supabase:
        # In-memory storage for mock when Supabase isn't configured
        for record in mock_db:
            if record["module_name"] == request.module_name:
                record["score"] = request.score
                return {"status": "success", "message": "Progress updated (mock)"}
        mock_db.append({"module_name": request.module_name, "score": request.score})
        return {"status": "success", "message": "Progress recorded (mock)"}
        
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
             raise HTTPException(status_code=401, detail="Unauthorized")
             
        user_id = user_response.user.id
        
        # Insert into progress table (or update if exists)
        data = supabase.table("progress").upsert({
            "user_id": user_id,
            "module_name": request.module_name,
            "score": request.score
        }).execute()
        
        return {"status": "success", "data": data.data}
    except Exception as e:
        return {"status": "success", "message": "Progress recorded (mock via exception)", "error": str(e)}

@router_progress.get("/", response_model=UserProgress)
async def get_progress(token: str = Depends(verify_token)):
    if not supabase:
        records = [ProgressRecord(module_name=r["module_name"], score=r["score"]) for r in mock_db]
        return UserProgress(user_id="mock-id", records=records)
        
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
             raise HTTPException(status_code=401, detail="Unauthorized")
             
        user_id = user_response.user.id
        data = supabase.table("progress").select("*").eq("user_id", user_id).execute()
        
        records = [ProgressRecord(module_name=r["module_name"], score=r["score"]) for r in data.data]
        return UserProgress(user_id=user_id, records=records)
    except Exception as e:
        records = [ProgressRecord(module_name=r["module_name"], score=r["score"]) for r in mock_db]
        return UserProgress(user_id="mock-id", records=records)



router_resume = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


@router_resume.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    token: str = Depends(verify_token)
):
    """
    Uploads a resume file (PDF/DOCX) to Supabase Storage and returns the file URL.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
        
    try:
        file_ext = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        file_bytes = await file.read()
        
        # Uploading to Supabase bucket called "resumes"
        # In a real environment, ensure the bucket exists and RLS allows upload.
        res = supabase.storage.from_("resumes").upload(
            path=unique_filename,
            file=file_bytes,
            file_options={"content-type": file.content_type}
        )
        
        # Get public URL
        file_url = supabase.storage.from_("resumes").get_public_url(unique_filename)
        
        return ResumeUploadResponse(
            id=str(uuid.uuid4()),
            message="Resume uploaded successfully",
            file_url=file_url
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router_resume.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(request: ResumeAnalysisRequest, token: str = Depends(verify_token)):
    """
    Analyzes raw resume text utilizing GPT-4.
    """
    try:
        analysis = await analyze_resume_with_ai(request.resume_text)
        return ResumeAnalysisResponse(**analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Analysis failed: {str(e)}")

@router_resume.post("/analyze-pdf", response_model=ResumeAnalysisResponse)
async def analyze_resume_pdf(
    file: UploadFile = File(...),
    token: str = Depends(verify_token)
):
    """
    Reads a PDF, extracts text, and sends it to the AI for analysis.
    """
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are currently supported for direct extraction.")
            
        file_bytes = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        
        extracted_text = ""
        for page in pdf_reader.pages:
            extracted_text += page.extract_text() + "\n"
            
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF. It may be an image-only PDF.")
            
        analysis = await analyze_resume_with_ai(extracted_text)
        return ResumeAnalysisResponse(**analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF Analysis failed: {str(e)}")



router_training = APIRouter(
    prefix="/training",
    tags=["Training Plan"]
)

@router_training.post("/plan", response_model=TrainingPlanResponse)
async def generate_training_plan(request: TrainingPlanRequest, token: str = Depends(verify_token)):
    videos = []
    
    if settings.YOUTUBE_API_KEY:
        try:
            youtube = build('youtube', 'v3', developerKey=settings.YOUTUBE_API_KEY)
            search_response = youtube.search().list(
                q=f"{request.skill} {request.focus_area} tutorial course",
                part='id,snippet',
                maxResults=5,
                type='video'
            ).execute()
            
            for search_result in search_response.get('items', []):
                videos.append(YouTubeVideo(
                    title=search_result['snippet']['title'],
                    url=f"https://www.youtube.com/watch?v={search_result['id']['videoId']}",
                    thumbnail=search_result['snippet']['thumbnails']['high']['url']
                ))
        except Exception as e:
            # Fall back to mock data if quota exceeded or error
            print(f"YouTube API Error: {e}")
            pass

    # If YouTube API key missing, or error occurred, provide mock
    if not videos:
        videos = [
            YouTubeVideo(
                title=f"Learn {request.skill} in 100 Seconds",
                url=f"https://www.youtube.com/results?search_query=Learn+{request.skill}",
                thumbnail="https://via.placeholder.com/320x180"
            ),
            YouTubeVideo(
                title=f"{request.skill} Full Course",
                url=f"https://www.youtube.com/results?search_query={request.skill}+full+course",
                thumbnail="https://via.placeholder.com/320x180"
            )
        ]

    return TrainingPlanResponse(
        skill=request.skill,
        videos=videos,
        timeline_weeks=4
    )


