import os
import time

from auth import AuthBearer, get_current_user
from fastapi import APIRouter, Depends, Request
from models import UserIdentity, UserUsage
from repository.user_identity.get_user_identity import get_user_identity
from repository.user_identity.update_user_properties import (
    UserUpdatableProperties,
    update_user_properties,
)

user_router = APIRouter()



@user_router.get("/user", dependencies=[Depends(AuthBearer())], tags=["User"])
async def get_user_endpoint(
    request: Request, current_user: UserIdentity = Depends(get_current_user)
):
    """
    Get user information and statistics.

    - `current_user`: The current authenticated user.
    """


    date = time.strftime("%Y%m%d")
    max_requests_number = os.getenv("MAX_REQUESTS_NUMBER")

    userDailyUsage = UserUsage(id=current_user.id)
    requests_stats = userDailyUsage.get_user_usage()
    

    return {
        "email": current_user.email,
        "max_requests_number": max_requests_number,
        "requests_stats": requests_stats,
        "date": date,
        "id": current_user.id,
    }


@user_router.put(
    "/user/identity",
    dependencies=[Depends(AuthBearer())],
    tags=["User"],
)
def update_user_identity_route(
    user_identity_updatable_properties: UserUpdatableProperties,
    current_user: UserIdentity = Depends(get_current_user),
) -> UserIdentity:
    """
    Update user identity.
    """
    return update_user_properties(current_user.id, user_identity_updatable_properties)


@user_router.get(
    "/user/identity",
    dependencies=[Depends(AuthBearer())],
    tags=["User"],
)
def get_user_identity_route(
    current_user: UserIdentity = Depends(get_current_user),
) -> UserIdentity:
    """
    Get user identity.
    """
    return get_user_identity(current_user.id)
