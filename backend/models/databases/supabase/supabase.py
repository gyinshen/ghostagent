from logger import get_logger
from models.databases.supabase import (
    Reports,
    Notifications,
    UserUsage,
)

logger = get_logger(__name__)


class SupabaseDB(
    UserUsage,
    Reports,
    Notifications,
):
    def __init__(self, supabase_client):
        self.db = supabase_client
        UserUsage.__init__(self, supabase_client)
        Reports.__init__(self, supabase_client)
        Notifications.__init__(self, supabase_client)
