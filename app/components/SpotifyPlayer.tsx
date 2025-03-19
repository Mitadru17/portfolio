'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMusic, FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi'

type Song = {
  title: string
  artist: string
  coverUrl: string
  audioUrl: string
}

const SpotifyPlayer = ({ playlist }: { playlist: Song[] }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  const currentSong = playlist[currentSongIndex]

  // Initialize audio player
  useEffect(() => {
    const audioElement = new Audio(playlist[0].audioUrl)
    audioElement.loop = false
    audioElement.volume = 0.3
    setAudio(audioElement)

    return () => {
      audioElement.pause()
      audioElement.src = ''
    }
  }, [playlist])

  // Handle end of song
  useEffect(() => {
    if (!audio) return

    const handleSongEnd = () => {
      const nextIndex = (currentSongIndex + 1) % playlist.length
      setCurrentSongIndex(nextIndex)
      audio.src = playlist[nextIndex].audioUrl
      if (isPlaying) audio.play()
    }

    audio.addEventListener('ended', handleSongEnd)
    return () => {
      audio.removeEventListener('ended', handleSongEnd)
    }
  }, [audio, currentSongIndex, isPlaying, playlist])

  // Update audio src when song changes
  useEffect(() => {
    if (!audio) return
    audio.src = currentSong.audioUrl
    if (isPlaying) audio.play()
  }, [currentSongIndex, currentSong, audio])

  // Play/pause functionality
  useEffect(() => {
    if (!audio) return
    
    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Playback failed:', error)
        setIsPlaying(false)
      })
    } else {
      audio.pause()
    }
  }, [isPlaying, audio])

  // Mute/unmute functionality
  useEffect(() => {
    if (!audio) return
    audio.muted = isMuted
  }, [isMuted, audio])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const nextSong = () => {
    setCurrentSongIndex((currentSongIndex + 1) % playlist.length)
  }

  const prevSong = () => {
    setCurrentSongIndex((currentSongIndex - 1 + playlist.length) % playlist.length)
  }

  const togglePlayerVisibility = () => {
    setShowPlayer(!showPlayer)
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {/* Toggle button */}
      <button
        onClick={togglePlayerVisibility}
        className="bg-surface/80 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center shadow-lg mb-4 border border-primary/30 hover:border-primary/80 transition-colors duration-300"
        aria-label="Toggle music player"
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
                src={currentSong.coverUrl} 
                alt={`${currentSong.title} cover`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Song info */}
            <div className="flex-1 px-3 py-2 truncate">
              <h3 className="font-medium text-text-primary truncate text-sm">{currentSong.title}</h3>
              <p className="text-text-secondary text-xs truncate">{currentSong.artist}</p>
              
              {/* Controls */}
              <div className="flex items-center mt-1">
                <button 
                  onClick={togglePlay} 
                  className="text-primary mr-3 hover:text-accent transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
                </button>
                <button 
                  onClick={toggleMute} 
                  className="text-primary hover:text-accent transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SpotifyPlayer 