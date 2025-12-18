from sqlalchemy import Column, Integer, String, Float
from database import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    league = Column(String, index=True)
    team = Column(String)
    position = Column(String)

    # Stats Columns (Nullable as they depend on the league)
    points = Column(Integer, nullable=True)
    rebounds = Column(Integer, nullable=True)
    assists = Column(Integer, nullable=True)

    goals = Column(Integer, nullable=True)
    # assists is already defined above, shared by NBA/NHL

    touchdowns = Column(Integer, nullable=True)
    yards = Column(Integer, nullable=True)

    batting_average = Column(Float, nullable=True)
    home_runs = Column(Integer, nullable=True)
