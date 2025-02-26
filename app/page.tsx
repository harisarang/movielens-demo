"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"

// Mock data for demonstration
const mockData = [
  {
    id: 1,
    name: "The Shawshank Redemption",
    genres: ["Drama", "Crime"],
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    director: "Frank Darabont",
    image: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 2,
    name: "The Godfather",
    genres: ["Crime", "Drama"],
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    director: "Francis Ford Coppola",
    image: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 3,
    name: "The Dark Knight",
    genres: ["Action", "Crime", "Drama"],
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    director: "Christopher Nolan",
    image: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 4,
    name: "Pulp Fiction",
    genres: ["Crime", "Drama"],
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    director: "Quentin Tarantino",
    image: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 5,
    name: "Fight Club",
    genres: ["Drama", "Thriller"],
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
    director: "David Fincher",
    image: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 6,
    name: "Inception",
    genres: ["Action", "Adventure", "Sci-Fi"],
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    director: "Christopher Nolan",
    image: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 7,
    name: "The Matrix",
    genres: ["Action", "Sci-Fi"],
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    director: "The Wachowskis",
    image: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 8,
    name: "Goodfellas",
    genres: ["Crime", "Drama", "Biography"],
    cast: ["Robert De Niro", "Ray Liotta", "Joe Pesci"],
    director: "Martin Scorsese",
    image: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 9,
    name: "The Silence of the Lambs",
    genres: ["Crime", "Drama", "Thriller"],
    cast: ["Jodie Foster", "Anthony Hopkins", "Scott Glenn"],
    director: "Jonathan Demme",
    image: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 10,
    name: "Forrest Gump",
    genres: ["Drama", "Romance"],
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
    director: "Robert Zemeckis",
    image: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 11,
    name: "The Lord of the Rings: The Fellowship of the Ring",
    genres: ["Adventure", "Drama", "Fantasy"],
    cast: ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"],
    director: "Peter Jackson",
    image: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 12,
    name: "Interstellar",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    director: "Christopher Nolan",
    image: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 15,
    name: "The Prestige",
    genres: ["Drama", "Mystery", "Sci-Fi"],
    cast: ["Christian Bale", "Hugh Jackman", "Scarlett Johansson"],
    director: "Christopher Nolan",
    image: "/placeholder.svg?height=150&width=100",
  },
]

// Find movie by name
const findMovieByName = (name: string) => {
  return (
    mockData.find((movie) => movie.name === name) || {
      name,
      genres: ["Unknown"],
      director: "Unknown",
      image: "/placeholder.svg?height=150&width=100",
    }
  )
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  // Recommendations data
  const recommendedMovies = [
    "The Godfather",
    "Fight Club",
    "Inception",
    "The Matrix",
    "Goodfellas",
    "The Silence of the Lambs",
    "Forrest Gump",
    "The Lord of the Rings: The Fellowship of the Ring",
    "Interstellar",
    "The Prestige",
  ]

  const [watchHistory, setWatchHistory] = useState([
    { name: "The Dark Knight", date: "Yesterday" },
    { name: "Inception", date: "3 days ago" },
    { name: "Pulp Fiction", date: "Last week" },
    { name: "The Shawshank Redemption", date: "2 weeks ago" },
  ])

  const resetWatchHistory = () => {
    setWatchHistory([])
  }

  const addToWatchHistory = (movieName: string) => {
    // Check if movie is already in watch history
    const existingIndex = watchHistory.findIndex((item) => item.name === movieName)

    if (existingIndex !== -1) {
      // If movie exists, update the date
      const updatedHistory = [...watchHistory]
      updatedHistory[existingIndex] = { ...updatedHistory[existingIndex], date: "Just now" }
      setWatchHistory(updatedHistory)
    } else {
      // Add new movie to watch history
      setWatchHistory([{ name: movieName, date: "Just now" }, ...watchHistory])
    }
  }

  // Filter data based on search query
  const filteredData = mockData.filter(
    (item) =>
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genres.some((genre) => genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.cast.some((actor) => actor.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <main className="h-screen overflow-hidden fixed inset-0 p-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4 h-full">
        {/* Left side with vertical split */}
        <div className="grid grid-rows-2 gap-4 h-full max-h-[calc(100vh-2rem)]">
          {/* Top left section - Recommendations */}
          <div className="rounded-lg border bg-card shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Recommendations</h2>
              <p className="text-sm text-muted-foreground">
                Movies and shows recommended for you based on your watch history.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pt-2">
              <div className="grid grid-cols-1 gap-4">
                {recommendedMovies.map((movieName) => {
                  const movie = findMovieByName(movieName)
                  return (
                    <div
                      key={movieName}
                      className="flex gap-4 p-3 rounded-md border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <Image
                          src={movie.image || "/placeholder.svg"}
                          alt={movie.name}
                          width={60}
                          height={90}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium">{movie.name}</h3>
                          <p className="text-xs text-muted-foreground">{movie.genres.join(", ")}</p>
                        </div>
                        <p className="text-xs">Dir: {movie.director}</p>
                      </div>
                    </div>
                  )
                })}
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
                  const movie = findMovieByName(item.name)
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
                          <p className="text-xs">Dir: {movie.director}</p>
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

            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, genre, cast or director..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Search results */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredData.map((item) => (
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
                          onClick={() => addToWatchHistory(item.name)}
                          className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          Add to History
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Genres</p>
                          <p>{item.genres.join(", ")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Cast</p>
                          <p>{item.cast.join(", ")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Director</p>
                          <p>{item.director}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredData.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No results found for "{searchQuery}"</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

