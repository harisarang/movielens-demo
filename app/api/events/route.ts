import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId } = body;
    
    const { data, status } = await axios({
      method: 'post',
      headers: {
        'X-TYPESENSE-API-KEY': process.env.TYPESENSE_API_KEY || 'xyz',
        'Content-Type': 'application/json'
      },
      url: 'http://localhost:8108/analytics/events',
      data: {
        type: "click",
        name: "movies_20m_click",
        data: {
          doc_id: id,
          user_id: userId,
        }
      },
      timeout: 5000
    });

    if (status === 201 && data.ok == true) {
      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json({ success: false, data });
    }
  } catch (error: any) {
    console.error("Error adding event:", error.response?.data);
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