from pydantic import BaseModel

class PlayerBase(BaseModel):
    name: str
    league: str
    team: str
    position: str

class PlayerCreate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int

    class Config:
        from_attributes = True
