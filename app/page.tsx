"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw } from "lucide-react"
import Image from "next/image"
import { searchMovies, addEvent, getRecommendations } from "@/lib/typesense"
import { toast } from "sonner"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([]);
  const [watchHistory, setWatchHistory] = useState<any[]>([]);

  function generateUserId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  useEffect(() => {
    setUserId(generateUserId())
  }, [])

  const refreshRecommendations = async () => {
    try {
      const recommendations = await getRecommendations(userId)
      setRecommendedMovies(recommendations)
    } catch (error: any) {
      setRecommendedMovies([])
      toast.error("Failed to refresh recommendations: " + error.message)
    }
  }


  const resetWatchHistory = () => {
    setWatchHistory([])
    setUserId(generateUserId())
  }

  const addToWatchHistory = async (movieId: string, movieDocument: any) => {
    const existingIndex = watchHistory.findIndex((item) => item?.id === movieId)

    try {
      await addEvent(movieId.toString(), userId);
      if (existingIndex !== -1) {
        const updatedHistory = [...watchHistory]
        setWatchHistory(updatedHistory)
      } else {
        setWatchHistory([movieDocument, ...watchHistory])
      }
      console.log(watchHistory);
    } catch (error) {
      console.error("Failed to track event:", error)
      toast.error("Failed to track event: " + error)
    }
  }

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true)
      let query = searchQuery
      if (query.trim() === "") {
        query = "*"
      }
      try {
        const results = await searchMovies(query)
        const hits = (results.results[0] as any)?.hits || []
        const formattedResults = hits.map((hit: any) => ({
          id: hit.document.id,
          name: hit.document.title || "Unknown",
          genres: hit.document.genres || ["Unknown"],
          cast: hit.document.cast || ["Unknown"],
          directors: hit.document.directors || "Unknown",
          image: hit.document.image || "/placeholder.svg?height=150&width=100",
        }))
        setSearchResults(formattedResults)
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimeout = setTimeout(fetchSearchResults, 300)
    return () => clearTimeout(debounceTimeout)
  }, [searchQuery])

  return (
    <main className="h-screen overflow-hidden fixed inset-0 p-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 h-full">
        {/* Left side with vertical split */}
        <div className="grid grid-rows-2 gap-4 h-full max-h-[calc(100vh-2rem)]">
          {/* Top left section - Recommendations */}
          <div className="rounded-lg border bg-card shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Recommendations</h2>
                <p className="text-sm text-muted-foreground">
                  Movies and shows recommended for you based on your watch history.
                </p>
              </div>
              <button
                onClick={refreshRecommendations}
                className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pt-2">
              <div className="grid grid-cols-1 gap-4">
                {recommendedMovies.map((movieDocument: any) => {
                  const movie = movieDocument
                  return (
                    <div
                      key={movie.id}
                      className="flex gap-4 p-3 rounded-md border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <Image
                          src={movie.image || "/placeholder.svg"}
                          alt={movie.title}
                          width={60}
                          height={90}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium">{movie.title}</h3>
                          <p className="text-xs text-muted-foreground">{movie.genres.join(", ")}</p>
                        </div>
                        <p className="text-xs">Dir: {movie.directors.join(", ")}</p>
                      </div>
                    </div>
                  )
                })}

                {recommendedMovies.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No recommendations available. Try adding some movies to your watch history.</p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom left section - Watch History */}
          <div className="rounded-lg border bg-card shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Watch History</h2>
              <p className="text-sm text-muted-foreground">Movies and shows you've recently watched.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pt-2">
              <div className="grid grid-cols-1 gap-4">
                {watchHistory.map((item, index) => {
                  const movie = item
                  return (
                    <div key={index} className="flex gap-4 p-3 rounded-md border hover:bg-accent/50 transition-colors">
                      <div className="flex-shrink-0">
                        <Image
                          src={movie.image || "/placeholder.svg"}
                          alt={movie.name}
                          width={60}
                          height={90}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-grow">
                        <div>
                          <h3 className="font-medium">{movie.name}</h3>
                          <p className="text-xs text-muted-foreground">{movie.genres.join(", ")}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <p className="text-xs">Dir: {movie.directors.join(", ")}</p>
                          <span className="text-xs text-muted-foreground">{item.date}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {watchHistory.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No watch history available.</p>
                )}
              </div>
            </div>

            <div className="p-2 border-t">
              <button
                onClick={resetWatchHistory}
                className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right side (full height) */}
        <div className="h-full rounded-lg border bg-card shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Search Movies</h2>
            {userId && <p className="text-xs text-muted-foreground mb-4">User ID: {userId}</p>}

            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, genre, cast or directors..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Search results */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading results...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {searchResults.map((item) => (
                  <div key={item.id} className="rounded-md border p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={120}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <button
                            onClick={() => addToWatchHistory(item.id, item)}
                            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            Add to History
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Genres</p>
                            <p>{Array.isArray(item.genres) ? item.genres.join(", ") : item.genres}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Cast</p>
                            <p>{Array.isArray(item.cast) ? item.cast.join(", ") : item.cast}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Directors</p>
                            <p>{item.directors.join(", ")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {searchResults.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-muted-foreground">No results found for "{searchQuery}"</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

