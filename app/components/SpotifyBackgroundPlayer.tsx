'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMusic, FiVolumeX, FiAlertCircle } from 'react-icons/fi'

// Multiple audio sources for better fallback options
const AUDIO_SOURCES = [
  '/lofi-background.mp3', // Local file that should be added to the public folder
  'https://file-examples.com/storage/fe19e15eac6560f8c936254/2017/11/file_example_MP3_700KB.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Another reliable test source
]

type SpotifyBackgroundPlayerProps = {
  playlistUrl: string
}

const SpotifyBackgroundPlayer = ({ playlistUrl }: SpotifyBackgroundPlayerProps) => {
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0)

  // Try the next audio source if available
  const tryNextSource = () => {
    if (currentSourceIndex < AUDIO_SOURCES.length - 1) {
      setCurrentSourceIndex(currentSourceIndex + 1)
      setHasError(false)
      // The useEffect will handle updating the audio source
    } else {
      setHasError(true)
      console.error("All audio sources failed")
    }
  }

  // Update audio source when index changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = AUDIO_SOURCES[currentSourceIndex]
      
      // If we were already playing or trying to play, attempt playback with new source
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error('Failed to play with new source:', e)
          tryNextSource()
        })
      }
    }
  }, [currentSourceIndex])

  // Handle initial setup
  useEffect(() => {
    // Only add event handlers if audioRef exists
    if (audioRef.current) {
      // Set up audio properties
      audioRef.current.volume = 0.3 // Set volume to 80%
      audioRef.current.loop = true
      
      // Add play event handler to track successful playback
      const handlePlay = () => {
        setIsPlaying(true)
        setHasError(false)
      }
      
      // Add error event handler
      const handleError = (e: Event) => {
        console.error('Audio error:', e)
        setIsPlaying(false)
        tryNextSource()
      }
      
      // Add event listeners
      audioRef.current.addEventListener('play', handlePlay)
      audioRef.current.addEventListener('error', handleError)
      
      // Clean up
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('play', handlePlay)
          audioRef.current.removeEventListener('error', handleError)
        }
      }
    }
  }, [])

  // Start playback as soon as possible
  useEffect(() => {
    const attemptAutoplay = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
            setIsMuted(false)
          })
          .catch(error => {
            console.error('Auto-play failed, waiting for user interaction:', error)
          })
      }
    }

    // Try to play immediately
    attemptAutoplay()

    // Try again after a short delay (sometimes helps with certain browsers)
    const timeoutId = setTimeout(attemptAutoplay, 1000)

    // Setup event listeners for user interaction
    const userInteractionEvents = ['click', 'touchstart', 'keydown', 'scroll']
    
    const handleUserInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
            setIsMuted(false)
            // Remove event listeners after successful playback
            userInteractionEvents.forEach(event => {
              document.removeEventListener(event, handleUserInteraction)
            })
          })
          .catch(error => {
            console.error('Failed to play after user interaction:', error)
            tryNextSource()
          })
      }
    }

    // Add event listeners for user interaction
    userInteractionEvents.forEach(event => {
      document.addEventListener(event, handleUserInteraction)
    })

    return () => {
      clearTimeout(timeoutId)
      userInteractionEvents.forEach(event => {
        document.removeEventListener(event, handleUserInteraction)
      })
    }
  }, [isPlaying])

  // Toggle mute/unmute and start playing if not yet started
  const toggleMute = () => {
    if (audioRef.current) {
      // Reset error state on new attempt
      setHasError(false)
      
      // If not playing, try to play
      if (!isPlaying) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true)
            setIsMuted(false)
          })
          .catch(error => {
            console.error('Failed to play audio:', error)
            tryNextSource()
          })
      } else {
        // If already playing, just toggle mute
        if (isMuted) {
          audioRef.current.volume = 0.8 // Set volume to 80% when unmuting
        } else {
          audioRef.current.volume = 0
        }
        setIsMuted(!isMuted)
      }
    }
  }

  return (
    <div className="fixed top-16 left-8 z-50">
      {/* Audio element without controls (hidden) */}
      <audio 
        ref={audioRef}
        src={AUDIO_SOURCES[currentSourceIndex]}
        controls={false} 
        preload="auto"
        style={{ 
          display: 'none' // Hide the audio element
        }}
      />

      {/* Status indicator */}
      {hasError && (
        <div className="bg-red-100 text-red-700 p-2 rounded-md mb-2 text-xs flex items-center">
          <FiAlertCircle className="mr-1" />
          Audio playback failed. Try clicking again or check browser settings.
        </div>
      )}
      
      {/* Mute/unmute button */}
      <button
        onClick={toggleMute}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          hasError 
            ? 'bg-red-500 border border-red-700' 
            : isMuted || !isPlaying 
              ? 'bg-surface/80 backdrop-blur-md border border-primary/30' 
              : 'bg-accent border border-accent/80'
        }`}
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {hasError ? (
          <FiAlertCircle className="text-white" size={20} />
        ) : isMuted || !isPlaying ? (
          <FiVolumeX className="text-primary" size={20} />
        ) : (
          <FiMusic className="text-white" size={20} />
        )}
        
        {isPlaying && !isMuted && !hasError && (
          <motion.span 
            className="absolute inset-0 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0.2, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </button>
    </div>
  )
}

export default SpotifyBackgroundPlayer 