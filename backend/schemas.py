from pydantic import BaseModel
from typing import Optional

class PlayerBase(BaseModel):
    name: str
    league: str
    team: str
    position: str

    # Optional stats - using float to support averages
    points: Optional[float] = None
    rebounds: Optional[float] = None
    assists: Optional[float] = None
    goals: Optional[float] = None
    touchdowns: Optional[float] = None
    yards: Optional[float] = None
    batting_average: Optional[float] = None
    home_runs: Optional[float] = None

class PlayerCreate(PlayerBase):
    pass

class PlayerUpdate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int

    class Config:
        from_attributes = True
