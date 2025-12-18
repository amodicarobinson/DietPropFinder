import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import {
  AppBar, Toolbar, Typography, Container, Grid, Card, CardContent,
  CardActions, Button, TextField, Select, MenuItem, InputLabel,
  FormControl, Box, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Chip, Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

function App() {
  const [leagues, setLeagues] = useState([]);
  const [players, setPlayers] = useState([]);

  // Form State
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleFetchStats = () => {
    if (!formData.name || !formData.league) {
        alert("Please enter a name and select a league first.");
        return;
    }

    setLoadingStats(true);
    fetch(`http://localhost:8000/scrape-stats?name=${encodeURIComponent(formData.name)}&league=${formData.league}`)
      .then(response => {
        if (!response.ok) throw new Error("Stats not found");
        return response.json();
      })
      .then(data => {
        setFormData(prev => ({
            ...prev,
            ...data
        }));
      })
      .catch(error => {
          console.error(error);
          alert("Could not fetch stats. Please check the name or try manually.");
      })
      .finally(() => setLoadingStats(false));
  };

  const handleSubmit = () => {
    const payload = { ...formData };

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

  const filteredPlayers = players.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {/* Header / Search Area */}
        <Box sx={{
          background: 'linear-gradient(180deg, rgba(21,21,26,0) 0%, rgba(21,21,26,1) 100%), url(https://www.transparenttextures.com/patterns/cubes.png), #15151a',
          padding: { xs: 4, md: 8 },
          textAlign: 'center',
          borderBottom: '1px solid #333'
        }}>
          <Typography variant="h1" sx={{ color: 'primary.main', mb: 2, fontSize: { xs: '2.5rem', md: '4rem' } }}>
            STAT TRACKER
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            Access player stats instantly.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, maxWidth: 600, mx: 'auto' }}>
            <TextField
                placeholder="Search players..."
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                    sx: { backgroundColor: 'background.paper' }
                }}
            />
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
                sx={{ minWidth: 140 }}
            >
                New Player
            </Button>
          </Box>
        </Box>

        {/* Content Area */}
        <Container sx={{ marginTop: 6, paddingBottom: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ borderLeft: '4px solid #F5D547', pl: 2 }}>
                    Trending Players
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {filteredPlayers.length} results
                </Typography>
            </Box>

          <Grid container spacing={3}>
            {filteredPlayers.map((player) => (
              <Grid item key={player.id} xs={12} sm={6} md={4} lg={3}>
                <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.8)'
                    }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Chip label={player.league} size="small" color="secondary" variant="filled" sx={{ fontWeight: 'bold' }} />
                        <Typography variant="caption" color="text.secondary">{player.team}</Typography>
                    </Box>
                    <Typography variant="h5" component="div" sx={{ mb: 0.5, fontWeight: 900 }}>
                        {player.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                      {player.position}
                    </Typography>

                    {/* Stats Grid */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        {player.league === 'NBA' && (
                            <>
                                <Box>
                                    <Typography variant="h6" color="primary">{player.points || 0}</Typography>
                                    <Typography variant="caption" color="text.secondary">PTS</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h6">{player.rebounds || 0}</Typography>
                                    <Typography variant="caption" color="text.secondary">REB</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h6">{player.assists || 0}</Typography>
                                    <Typography variant="caption" color="text.secondary">AST</Typography>
                                </Box>
                            </>
                        )}
                        {player.league === 'NHL' && (
                             <>
                                <Box>
                                    <Typography variant="h6" color="primary">{player.goals || 0}</Typography>
                                    <Typography variant="caption" color="text.secondary">G</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h6">{player.assists || 0}</Typography>
                                    <Typography variant="caption" color="text.secondary">A</Typography>
                                </Box>
                            </>
                        )}
                        {player.league === 'NFL' && (
                             <>
                                <Box>
                                    <Typography variant="h6" color="primary">{player.touchdowns || 0}</Typography>
                                    <Typography variant="caption" color="text.secondary">TD</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h6">{player.yards || 0}</Typography>
                                    <Typography variant="caption" color="text.secondary">YDS</Typography>
                                </Box>
                            </>
                        )}
                        {player.league === 'MLB' && (
                             <>
                                <Box>
                                    <Typography variant="h6" color="primary">{player.batting_average || 0}</Typography>
                                    <Typography variant="caption" color="text.secondary">AVG</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h6">{player.home_runs || 0}</Typography>
                                    <Typography variant="caption" color="text.secondary">HR</Typography>
                                </Box>
                            </>
                        )}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', opacity: 0.6 }}>
                    <IconButton size="small" onClick={() => handleOpen(player)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => handleDelete(player.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: 900, borderBottom: '1px solid #333' }}>
            {editId ? 'EDIT PLAYER' : 'ADD PLAYER'}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TextField autoFocus margin="dense" name="name" label="Name" fullWidth value={formData.name} onChange={handleInputChange} />
              <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ height: 56, borderRadius: 3 }}
                  onClick={handleFetchStats}
                  disabled={loadingStats}
              >
                  {loadingStats ? <CircularProgress size={24} /> : <AutoFixHighIcon />}
              </Button>
            </Box>
            <FormControl fullWidth margin="dense">
              <InputLabel>League</InputLabel>
              <Select name="league" value={formData.league} label="League" onChange={handleInputChange}>
                {leagues.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField margin="dense" name="team" label="Team" fullWidth value={formData.team} onChange={handleInputChange} />
                <TextField margin="dense" name="position" label="Position" fullWidth value={formData.position} onChange={handleInputChange} />
            </Box>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                STATISTICS
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {renderStatInputs()}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose} color="inherit">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disableElevation>Save Player</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default App;
