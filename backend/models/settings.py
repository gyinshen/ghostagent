from models.databases.supabase.supabase import SupabaseDB
from pydantic import BaseSettings
from supabase.client import Client, create_client



class ResearchSettings(BaseSettings):

    supabase_url: str
    supabase_service_key: str


def get_supabase_client() -> Client:
    settings = ResearchSettings()  # pyright: ignore reportPrivateUsage=none
    supabase_client: Client = create_client(
        settings.supabase_url, settings.supabase_service_key
    )
    return supabase_client


def get_supabase_db() -> SupabaseDB:
    supabase_client = get_supabase_client()
    return SupabaseDB(supabase_client)

