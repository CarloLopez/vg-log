import Signup from "./Authentication/Signup";
import Login from "./Authentication/Login";
import { useContext, useState } from "react";
import { LoginContext } from "../../../App";

const ProfilePage = () => {
  
  const {username, setUsername} = useContext(LoginContext);
  const [selection, setSelection] = useState('logIn');
  const [error, setError] = useState('');

  const handleButtonClick = () => {
    if (selection === 'signUp') {
      setSelection('logIn');
    } else {
      setSelection('signUp');
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/users/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials to ensure cookies are sent
      });

      if (response.ok) {
        console.log('Logged out successfully');
      } else {
        setError('Error logging out');
      }
      setUsername('');
    } catch (error) {
      setError('Error logging out');
    }
  };

  if (error) {
    return <>{error}</>
  }

  if (username) {
    handleLogout();
  }

  if (!username) {
    return (
      <>
        {selection === 'signUp' ? <Signup /> : <Login />}
        <button onClick={handleButtonClick}>{selection === 'signUp' ? 'Login Page' : 'Sign Up Page'}</button>
      </>
    )
  }
  
}

export default ProfilePage;