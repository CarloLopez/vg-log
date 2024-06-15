const apiRequest = async (body: string, endpoint: string = "games") => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${URL}/api/games`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ endpoint, body }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw new Error('API request failed');
  }
};

export default apiRequest;
