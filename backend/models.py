from sqlalchemy import Column, Integer, String, Float
from database import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    league = Column(String, index=True)
    team = Column(String)
    position = Column(String)

    # Stats Columns
    # Changed to Float to support averages (PPG, RPG, APG, Batting Avg)
    points = Column(Float, nullable=True)
    rebounds = Column(Float, nullable=True)
    assists = Column(Float, nullable=True)

    # NHL/NFL usually track totals, but averages are possible.
    # Let's use Float for flexibility or Integer for strict totals.
    # Scraper fetches totals for NFL (TDs) and NHL (Goals).
    # But to be safe and consistent, Float is safer if user enters "24.5".
    goals = Column(Float, nullable=True)
    touchdowns = Column(Float, nullable=True)
    yards = Column(Float, nullable=True)

    batting_average = Column(Float, nullable=True)
    home_runs = Column(Float, nullable=True)
