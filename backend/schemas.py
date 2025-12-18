from pydantic import BaseModel
from typing import Optional

class PlayerBase(BaseModel):
    name: str
    league: str
    team: str
    position: str

    # Optional stats
    points: Optional[int] = None
    rebounds: Optional[int] = None
    assists: Optional[int] = None
    goals: Optional[int] = None
    touchdowns: Optional[int] = None
    yards: Optional[int] = None
    batting_average: Optional[float] = None
    home_runs: Optional[int] = None

class PlayerCreate(PlayerBase):
    pass

class PlayerUpdate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int

    class Config:
        from_attributes = True
