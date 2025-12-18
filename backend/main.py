from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

import models
import schemas
import scraper
from database import SessionLocal, engine

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Sports Stats Tracker API"}

@app.get("/leagues")
def get_leagues():
    return {
        "leagues": ["NBA", "NHL", "NFL", "MLB"]
    }

@app.post("/players/", response_model=schemas.Player)
def create_player(player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    db_player = models.Player(
        name=player.name,
        league=player.league,
        team=player.team,
        position=player.position,
        points=player.points,
        rebounds=player.rebounds,
        assists=player.assists,
        goals=player.goals,
        touchdowns=player.touchdowns,
        yards=player.yards,
        batting_average=player.batting_average,
        home_runs=player.home_runs
    )
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

@app.get("/players/", response_model=List[schemas.Player])
def read_players(league: str = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.Player)
    if league:
        query = query.filter(models.Player.league == league)
    return query.offset(skip).limit(limit).all()

@app.put("/players/{player_id}", response_model=schemas.Player)
def update_player(player_id: int, player_update: schemas.PlayerUpdate, db: Session = Depends(get_db)):
    db_player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if db_player is None:
        raise HTTPException(status_code=404, detail="Player not found")

    # Update fields
    for var, value in vars(player_update).items():
        if value is not None:
             setattr(db_player, var, value)

    db.commit()
    db.refresh(db_player)
    return db_player

@app.delete("/players/{player_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_player(player_id: int, db: Session = Depends(get_db)):
    db_player = db.query(models.Player).filter(models.Player.id == player_id).first()
    if db_player is None:
        raise HTTPException(status_code=404, detail="Player not found")

    db.delete(db_player)
    db.commit()
    return None

@app.get("/scrape-stats")
def scrape_stats(name: str, league: str):
    stats = scraper.scrape_player_stats(league, name)
    if not stats:
        raise HTTPException(status_code=404, detail="Stats not found for player")
    return stats
