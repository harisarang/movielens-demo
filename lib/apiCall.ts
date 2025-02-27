export const searchMovies = async (query: string = "*") => {
  try {
    const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
}

export const addEvent = async (id: string, userId: string) => {
  try {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, userId }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to add event');
    }
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error calling events API:', error);
    throw error;
  }
}

export const getRecommendations = async (userId: string) => {
  const response = await fetch(`/api/recommendations?userId=${userId}`);
  const data = await response.json();
  console.log(data);
  const recommendations = [];
  if (data?.code === 400) {
    throw new Error(data?.message);
  }
  if (data.results[0]?.hits.length === 0) {
    throw new Error("No recommendations found");
  }
  for (const hit of data.results[0]?.hits) {
    recommendations.push(hit.document);
  }
  return recommendations;
}