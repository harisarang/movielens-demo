import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    const { data, status } = await axios({
      method: 'post',
      headers: {
        'X-TYPESENSE-API-KEY': process.env.TYPESENSE_API_KEY || 'xyz',
        'Content-Type': 'application/json'
      },
      url: 'http://localhost:8108/multi_search',
      data: {
        "searches": [
          {
            "collection": "movies_20m",
            "q": "*",
            "exclude_fields": "user_embedding, item_embedding",
            "personalization_user_id": userId,
            "personalization_model_id": "20m",
            "personalization_type": "recommendation",
            "personalization_user_field": "user_embedding",
            "personalization_item_field": "item_embedding",
            "personalization_event_name": "movies_20m_click",
            "personalization_n_events": 8,
            "page": 1
          }
        ]
      },
      timeout: 5000
    });

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error adding event:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: error.response?.data || null
      }, 
      { status: 500 }
    );
  }
} 