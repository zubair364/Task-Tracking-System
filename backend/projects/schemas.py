from ninja import Schema
from typing import List, Optional
from datetime import datetime

# Input Schemas
class ProjectCreateIn(Schema):
    """Schema for project creation input"""
    name: str
    description: Optional[str] = None
    status: Optional[str] = 'active'  # Default to active

class ProjectUpdateIn(Schema):
    """Schema for project update input"""
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class ProjectMemberIn(Schema):
    """Schema for adding/removing project members"""
    user_id: int

# Output Schemas
class ProjectMemberOut(Schema):
    """Schema for project member output"""
    id: int
    username: str

class ProjectOut(Schema):
    """Schema for project output"""
    id: int
    name: str
    description: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    created_by_id: int
    created_by_username: str
    
    @staticmethod
    def resolve_created_by_username(project):
        return project.created_by.username

class ProjectDetailOut(ProjectOut):
    """Schema for detailed project output"""
    members: List[ProjectMemberOut]
    
    @staticmethod
    def resolve_members(project):
        return project.members.all()
    


class ProjectStatsOut(Schema):
    """Schema for project statistics output"""
    total: int
    active: int
    onHold: int
    completed: int
    archived: int
    cancelled: int