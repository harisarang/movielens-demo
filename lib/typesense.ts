import axios from "axios"
import { Client } from "typesense"

export const client = new Client({
  nodes: [{ host: "localhost", port: 8108, protocol: "http" }],
  apiKey: process.env.TYPESENSE_API_KEY || "xyz",
  connectionTimeoutSeconds: 10,
})


export const searchMovies = async (query: string = "*") => {
  const result = await client.multiSearch.perform({
    searches: [{
        collection: "movies_20m",
        query_by: "title,genres,directors,cast",
        query_by_weights: "2,2,1,1",
        per_page: 20,
        q: query,
    }],
  })
  console.log(result)
  return result
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