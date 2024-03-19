
const apiRequest = async (body: string) => {

  const url = 'https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games';
  const headers = {
    'Accept': 'application/json',
    'Client-ID': '7700pxy9nm01xjre1zxrn8pfk0eaqy',
    'Authorization': 'Bearer 6dhvah2trquct9fss21son34vcpzz1',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
      mode: 'cors',
    });

    // throw error with HTTP code if API request failed
    if (!response.ok) {
      throw new Error(`HTTP error: Status ${response.status}`);
    }

    const data = await response.json();
    return data;
    
  } catch(error) {
    // verify error type before throwing new error
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error ('Unknown Error Has Occurred');
    }
  }

}

export default apiRequest;