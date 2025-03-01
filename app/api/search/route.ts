import { client } from "@/lib/typesense";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "*";

    const result = await client.multiSearch.perform({
      searches: [{
        collection: "movies_20m",
        query_by: "title,genres,directors,cast",
        query_by_weights: "2,2,1,1",
        per_page: 20,
        q: query,
        exclude_fields: "user_embedding, item_embedding",
      }],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error searching movies:", error);
    return NextResponse.json(
      { error: "Failed to search movies" },
      { status: 500 }
    );
  }
} 