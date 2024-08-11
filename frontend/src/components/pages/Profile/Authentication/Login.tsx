import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  const URL = import.meta.env.VITE_SERVER_BASE_URL;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(`${URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User logged in:', data);
        navigate('/home');
      } else {
        const error = await response.text();
        console.error('Error logging in:', error);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="flex justify-center font-bold text-2xl">Login</h2>
      <div className="flex justify-center">
        <form onSubmit={handleLogin} className="flex flex-col gap-2 items-center">
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="text-black"/>
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="text-black"/>
          </label>
          <button type="submit" className="bg-slate-700 rounded hover:scale-105 px-2">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;