import React, { useEffect, useState } from 'react';

function App() {
  const [leagues, setLeagues] = useState([]);
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [league, setLeague] = useState('NBA');
  const [team, setTeam] = useState('');
  const [position, setPosition] = useState('');

  const fetchPlayers = () => {
    fetch('http://localhost:8000/players/')
      .then(response => response.json())
      .then(data => setPlayers(data))
      .catch(error => console.error('Error fetching players:', error));
  };

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching root:', error));

    fetch('http://localhost:8000/leagues')
      .then(response => response.json())
      .then(data => setLeagues(data.leagues))
      .catch(error => console.error('Error fetching leagues:', error));

    fetchPlayers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPlayer = { name, league, team, position };

    fetch('http://localhost:8000/players/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlayer),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Player added:', data);
        fetchPlayers(); // Refresh list
        // Reset form
        setName('');
        setTeam('');
        setPosition('');
      })
      .catch(error => console.error('Error adding player:', error));
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <header>
        <h1>Sports Stats Tracker</h1>
        <p>{message}</p>
      </header>

      <section>
        <h2>Add a Player</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select value={league} onChange={(e) => setLeague(e.target.value)}>
            {leagues.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <input
            type="text"
            placeholder="Team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
          <button type="submit">Add Player</button>
        </form>
      </section>

      <section>
        <h2>Player List</h2>
        {players.length === 0 ? <p>No players added yet.</p> : (
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                <strong>{player.name}</strong> ({player.league}) - {player.team}, {player.position}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
