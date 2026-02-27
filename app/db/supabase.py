from supabase import create_client, Client
from app.core.config import settings

# Initialize Supabase client
# Ensure that SUPABASE_URL and SUPABASE_KEY are provided in the environment
if settings.SUPABASE_URL and settings.SUPABASE_KEY and settings.SUPABASE_URL.startswith("http"):
    try:
        supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    except Exception as e:
        print(f"Failed to initialize Supabase client: {e}")
        supabase = None
else:
    # Fallback to a mock or None if not set properly (useful for local testing without keys)
    supabase = None
