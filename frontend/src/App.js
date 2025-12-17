import React, { useEffect, useState } from 'react';

function App() {
  const [leagues, setLeagues] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching root:', error));

    fetch('http://localhost:8000/leagues')
      .then(response => response.json())
      .then(data => setLeagues(data.leagues))
      .catch(error => console.error('Error fetching leagues:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sports Stats Tracker</h1>
        <p>{message}</p>
        <h2>Supported Leagues:</h2>
        <ul>
          {leagues.map((league, index) => (
            <li key={index}>{league}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
