import { NextResponse } from 'next/server'

// Your Spotify app credentials
// You'll need to get these from the Spotify Developer Dashboard
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

// Get a new access token using refresh token
const getAccessToken = async () => {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN || '',
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to get access token')
  }

  const data = await response.json()
  return data.access_token
}

// Fetch currently playing track from Spotify
const getNowPlaying = async (accessToken: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  })

  // Handle 204 No Content - when nothing is playing
  if (response.status === 204) {
    return { isPlaying: false, track: null }
  }

  if (!response.ok) {
    throw new Error('Failed to fetch currently playing track')
  }

  const data = await response.json()
  return {
    isPlaying: data.is_playing,
    track: data.item,
  }
}

export async function GET() {
  try {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      return NextResponse.json(
        { error: 'Missing Spotify credentials. See setup instructions.' },
        { status: 500 }
      )
    }

    const accessToken = await getAccessToken()
    const nowPlaying = await getNowPlaying(accessToken)

    return NextResponse.json(nowPlaying)
  } catch (error) {
    console.error('Error in Spotify API endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from Spotify API' },
      { status: 500 }
    )
  }
} 