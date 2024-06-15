const checkAuth = async () => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  
  try {
    const response = await fetch(`${URL}/users/check-auth`, {
      method: 'GET',
      credentials: 'include', // Include credentials (cookies)
    });

    if (response.ok) {
      const data = await response.json();
      return data.username;
    } else {
      console.error('User Not Authenticated');
      return null;
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export default checkAuth;