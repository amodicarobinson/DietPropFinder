import React, { useEffect, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent,
  CardActions, Button, TextField, Select, MenuItem, InputLabel,
  FormControl, Box, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function App() {
  const [leagues, setLeagues] = useState([]);
  const [players, setPlayers] = useState([]);

  // Form State
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    league: 'NBA',
    team: '',
    position: '',
    points: '',
    rebounds: '',
    assists: '',
    goals: '',
    touchdowns: '',
    yards: '',
    batting_average: '',
    home_runs: ''
  });

  useEffect(() => {
    fetch('http://localhost:8000/leagues')
      .then(response => response.json())
      .then(data => setLeagues(data.leagues))
      .catch(error => console.error('Error fetching leagues:', error));

    fetchPlayers();
  }, []);

  const fetchPlayers = () => {
    fetch('http://localhost:8000/players/')
      .then(response => response.json())
      .then(data => setPlayers(data))
      .catch(error => console.error('Error fetching players:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpen = (player = null) => {
    if (player) {
      setEditId(player.id);
      setFormData({
        name: player.name,
        league: player.league,
        team: player.team,
        position: player.position,
        points: player.points || '',
        rebounds: player.rebounds || '',
        assists: player.assists || '',
        goals: player.goals || '',
        touchdowns: player.touchdowns || '',
        yards: player.yards || '',
        batting_average: player.batting_average || '',
        home_runs: player.home_runs || ''
      });
    } else {
      setEditId(null);
      setFormData({
        name: '',
        league: 'NBA',
        team: '',
        position: '',
        points: '',
        rebounds: '',
        assists: '',
        goals: '',
        touchdowns: '',
        yards: '',
        batting_average: '',
        home_runs: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const payload = { ...formData };

    // Convert numerical strings to numbers or null
    ['points', 'rebounds', 'assists', 'goals', 'touchdowns', 'yards', 'home_runs'].forEach(field => {
       payload[field] = payload[field] === '' ? null : parseInt(payload[field]);
    });
    payload['batting_average'] = payload['batting_average'] === '' ? null : parseFloat(payload['batting_average']);

    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `http://localhost:8000/players/${editId}` : 'http://localhost:8000/players/';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(() => {
        fetchPlayers();
        handleClose();
      })
      .catch(error => console.error('Error saving player:', error));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      fetch(`http://localhost:8000/players/${id}`, { method: 'DELETE' })
        .then(() => fetchPlayers())
        .catch(error => console.error('Error deleting player:', error));
    }
  };

  const renderStatInputs = () => {
    switch(formData.league) {
      case 'NBA':
        return (
          <>
            <TextField margin="dense" name="points" label="Points" type="number" fullWidth value={formData.points} onChange={handleInputChange} />
            <TextField margin="dense" name="rebounds" label="Rebounds" type="number" fullWidth value={formData.rebounds} onChange={handleInputChange} />
            <TextField margin="dense" name="assists" label="Assists" type="number" fullWidth value={formData.assists} onChange={handleInputChange} />
          </>
        );
      case 'NHL':
        return (
          <>
            <TextField margin="dense" name="goals" label="Goals" type="number" fullWidth value={formData.goals} onChange={handleInputChange} />
            <TextField margin="dense" name="assists" label="Assists" type="number" fullWidth value={formData.assists} onChange={handleInputChange} />
          </>
        );
      case 'NFL':
        return (
          <>
            <TextField margin="dense" name="touchdowns" label="Touchdowns" type="number" fullWidth value={formData.touchdowns} onChange={handleInputChange} />
            <TextField margin="dense" name="yards" label="Yards" type="number" fullWidth value={formData.yards} onChange={handleInputChange} />
          </>
        );
      case 'MLB':
        return (
          <>
            <TextField margin="dense" name="batting_average" label="Batting Average" type="number" inputProps={{ step: "0.001" }} fullWidth value={formData.batting_average} onChange={handleInputChange} />
            <TextField margin="dense" name="home_runs" label="Home Runs" type="number" fullWidth value={formData.home_runs} onChange={handleInputChange} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sports Stats Tracker
          </Typography>
          <Button color="inherit" onClick={() => handleOpen()}>Add Player</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 4 }}>
        <Grid container spacing={4}>
          {players.map((player) => (
            <Grid item key={player.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">{player.name}</Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {player.league} - {player.team} ({player.position})
                  </Typography>
                  <Typography variant="body2">
                    {player.league === 'NBA' && `Pts: ${player.points || 0}, Reb: ${player.rebounds || 0}, Ast: ${player.assists || 0}`}
                    {player.league === 'NHL' && `Goals: ${player.goals || 0}, Ast: ${player.assists || 0}`}
                    {player.league === 'NFL' && `TDs: ${player.touchdowns || 0}, Yds: ${player.yards || 0}`}
                    {player.league === 'MLB' && `AVG: ${player.batting_average || 0}, HR: ${player.home_runs || 0}`}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => handleOpen(player)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(player.id)}><DeleteIcon /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? 'Edit Player' : 'Add Player'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" name="name" label="Name" fullWidth value={formData.name} onChange={handleInputChange} />
          <FormControl fullWidth margin="dense">
            <InputLabel>League</InputLabel>
            <Select name="league" value={formData.league} label="League" onChange={handleInputChange}>
              {leagues.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField margin="dense" name="team" label="Team" fullWidth value={formData.team} onChange={handleInputChange} />
          <TextField margin="dense" name="position" label="Position" fullWidth value={formData.position} onChange={handleInputChange} />
          {renderStatInputs()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
