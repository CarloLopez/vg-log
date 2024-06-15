import React, { useState } from "react";

const Signup = () => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  
  const checkButtonDisabled = () => {
    if (!username || !password || !passwordAgain) {
      return true;
    }

    return (password !== passwordAgain);
  }

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const response = await fetch(`${URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User registered:', data);
        // TODO: redirect to login page or log the user in automatically
      } else {
        const error = await response.text();
        console.error('Error registering user:', error);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };
  
  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Password Again:
          <input type="password" value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} required />
        </label>
        <button type="submit" disabled={checkButtonDisabled()}>Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;