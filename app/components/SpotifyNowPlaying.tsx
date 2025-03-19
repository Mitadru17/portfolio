'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMusic, FiExternalLink } from 'react-icons/fi'

// Types for Spotify API responses
type SpotifyImage = {
  url: string
  height: number
  width: number
}

type SpotifyArtist = {
  name: string
  external_urls: {
    spotify: string
  }
}

type SpotifyTrack = {
  name: string
  album: {
    name: string
    images: SpotifyImage[]
    external_urls: {
      spotify: string
    }
  }
  artists: SpotifyArtist[]
  external_urls: {
    spotify: string
  }
  preview_url: string | null
}

type NowPlayingResponse = {
  is_playing: boolean
  item: SpotifyTrack
}

const SpotifyNowPlaying = () => {
  const [showPlayer, setShowPlayer] = useState(false)
  const [nowPlaying, setNowPlaying] = useState<SpotifyTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch currently playing track from your server endpoint
  const fetchNowPlaying = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Replace with your actual server endpoint that handles Spotify API auth
      const response = await fetch('/api/spotify/now-playing')
      
      if (!response.ok) {
        throw new Error('Failed to fetch currently playing track')
      }
      
      const data = await response.json()
      
      if (data.isPlaying && data.track) {
        setNowPlaying(data.track)
        setIsPlaying(data.isPlaying)
      } else {
        // No track playing - you can set a default or show a message
        setNowPlaying(null)
        setIsPlaying(false)
      }
    } catch (err) {
      console.error('Error fetching now playing:', err)
      setError('Could not connect to Spotify')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch on initial load and set up refresh interval
  useEffect(() => {
    fetchNowPlaying()
    
    // Refresh every 30 seconds to keep current
    const intervalId = setInterval(() => {
      fetchNowPlaying()
    }, 30000)
    
    return () => clearInterval(intervalId)
  }, [])

  // For demo/fallback when no connection to Spotify
  const fallbackTrack = {
    name: "Dil Ibaadat",
    album: {
      name: "Tum Mile",
      images: [{ url: "/playlist/dil-ibaadat.jpg", height: 300, width: 300 }],
      external_urls: { spotify: "https://open.spotify.com/album/5ZCo1wqpAvjgHieipwTXTv" }
    },
    artists: [{ 
      name: "Pritam, KK", 
      external_urls: { spotify: "https://open.spotify.com/artist/3pzP9HJienQwUchfxSYylM" } 
    }],
    external_urls: { spotify: "https://open.spotify.com/track/7dFgZXD1MqrTFM86XlKUnj" }
  }

  // Use fallback if there's an error or no track is playing
  const displayTrack = nowPlaying || fallbackTrack
  
  const togglePlayerVisibility = () => {
    setShowPlayer(!showPlayer)
  }

  const openInSpotify = () => {
    if (displayTrack?.external_urls?.spotify) {
      window.open(displayTrack.external_urls.spotify, '_blank')
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Toggle button */}
      <button
        onClick={togglePlayerVisibility}
        className="bg-surface/80 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center shadow-lg mb-4 border border-primary/30 hover:border-primary/80 transition-colors duration-300"
        aria-label="Toggle Spotify now playing"
      >
        <FiMusic className="text-primary" size={20} />
      </button>

      {/* Player container */}
      <AnimatePresence>
        {showPlayer && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="flex items-center bg-surface/90 backdrop-blur-lg border border-primary/20 rounded-lg overflow-hidden shadow-xl w-72"
          >
            {/* Album art */}
            <div className="w-16 h-16 relative flex-shrink-0">
              <img 
                src={displayTrack.album.images[0]?.url || '/playlist/default-cover.jpg'} 
                alt={`${displayTrack.album.name} cover`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Song info */}
            <div className="flex-1 px-3 py-2 truncate">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-text-primary truncate text-sm">{displayTrack.name}</h3>
                <div className="flex-shrink-0 ml-1">
                  <button
                    onClick={openInSpotify}
                    className="text-primary hover:text-accent transition-colors"
                    aria-label="Open in Spotify"
                  >
                    <FiExternalLink size={14} />
                  </button>
                </div>
              </div>
              <p className="text-text-secondary text-xs truncate">{displayTrack.artists.map(a => a.name).join(', ')}</p>
              
              {/* Status indicator */}
              <div className="flex items-center mt-1">
                {isLoading ? (
                  <span className="text-xs text-text-secondary">Connecting to Spotify...</span>
                ) : error ? (
                  <span className="text-xs text-red-400">{error}</span>
                ) : (
                  <div className="flex items-center">
                    {isPlaying ? (
                      <>
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-xs text-green-400">Playing on Spotify</span>
                      </>
                    ) : (
                      <>
                        <span className="inline-block w-2 h-2 rounded-full bg-text-secondary mr-2"></span>
                        <span className="text-xs text-text-secondary">Not currently playing</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SpotifyNowPlaying 