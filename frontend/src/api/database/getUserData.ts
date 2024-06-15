const getUserData = async () => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;

  try {
    const response = await fetch(`${URL}/users/me`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const error = await response.text();
      console.error('Error getting user data:', error);
    }
  } catch (error) {
    console.error('Error getting user data:', error);
  }
};

export default getUserData;