# Spotify Integration Guide

This guide explains how to set up Spotify integration for your portfolio to display both your currently playing track and provide background music.

## Features

### Currently Playing Track Display

- Real-time display of your currently playing track from Spotify
- Album artwork, song title, and artist information
- Auto-updates every 30 seconds
- Direct link to the song on Spotify
- Visual indicator of playing status that matches your portfolio's cyberpunk theme

### Background Music Player

- Embedded Spotify playlist that provides ambient background music
- Simplified playback experience with just mute/unmute functionality
- Minimalistic UI that matches your portfolio's design
- Non-intrusive toggle button with tooltip
- Positioned to avoid overlapping with other interface elements

## Setting Up Spotify API Integration

### For the Currently Playing Track Feature

1. **Create a Spotify Developer Application**

   - Visit the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
   - Log in with your Spotify account
   - Click "Create an App"
   - Fill in the application details:
     - Name: "Your Portfolio"
     - Description: "Integration for my portfolio website"
     - Redirect URI: "http://localhost:3000" (for development)
   - Accept the terms and click "Create"

2. **Get Your Credentials**

   - Once your app is created, you'll see your Client ID on the dashboard
   - Click "Show Client Secret" to reveal your Client Secret
   - Save both the Client ID and Client Secret for later use

3. **Get a Refresh Token**
   - To get a refresh token, you'll need to perform the OAuth flow
   - Create a simple Node.js script to obtain the token:

```javascript
const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

// Replace with your actual client ID and secret
const CLIENT_ID = "your_client_id";
const CLIENT_SECRET = "your_client_secret";
const REDIRECT_URI = "http://localhost:3000/callback";
const SCOPES = "user-read-currently-playing user-read-playback-state";

app.get("/", (req, res) => {
  res.redirect(
    `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPES)}`
  );
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      params: {
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      },
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, refresh_token } = response.data;

    res.send(`
      <h1>Success!</h1>
      <p>Here's your refresh token (save this somewhere safe):</p>
      <pre>${refresh_token}</pre>
    `);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
```

4. **Configure Environment Variables**
   - Create or update your `.env.local` file with your Spotify credentials:

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
```

- Make sure your `.env.local` file is included in your `.gitignore` to keep your credentials secure

5. **Deploying with Vercel or Similar Platform**
   - When deploying, add your environment variables in the Vercel dashboard
   - Update your redirect URI in the Spotify Developer Dashboard to match your production domain
   - Ensure your production domain is added to the allowed domains in your Spotify app settings

### For the Background Music Player Feature

1. **Set Playlist in the Code**

   - The 'venting core' playlist is already set up in your portfolio
   - If you want to change it, update the `playlistUrl` prop in `app/page.tsx`:

```jsx
<SpotifyBackgroundPlayer playlistUrl="https://open.spotify.com/playlist/4qLhCfXrcHH3diL0Yxd0Sz" />
```

## How It Works

### Currently Playing Track

- The `SpotifyNowPlaying` component fetches data from your `/api/spotify/now-playing` endpoint
- The endpoint uses your refresh token to obtain a temporary access token
- With the access token, it calls the Spotify API to get your currently playing track
- The component displays this information in a stylish card that matches your portfolio

### Background Music Player

- The `SpotifyBackgroundPlayer` component uses a hidden Spotify embedded player iframe
- The player is tucked away in the corner with just a simple icon button
- When clicked, it shows a minimal interface that displays the playlist name
- Users can mute or unmute the audio with a single button
- The player is positioned on the left side to avoid overlapping with the voice navigation

## Troubleshooting

### Currently Playing Track Issues

- **Connection Error**: Check that your Spotify API credentials are correct
- **No Song Information**: Make sure you're playing a song on Spotify when testing
- **Refresh Token Expired**: Obtain a new refresh token using the method described above

### Background Music Player Issues

- **Player Not Loading**: Check your internet connection and that the playlist URL is valid
- **No Sound**: Due to browser policies, autoplay with sound is often blocked. Users need to interact with the page first
- **Volume Control Not Working**: Some browsers may limit the effectiveness of the volume control API

## Privacy Considerations

- The Currently Playing Track feature only accesses your currently playing track and does not modify your Spotify account in any way
- No listening history or private information is stored
- The Background Music Player is a standard Spotify embed and subject to Spotify's privacy policy

## Customizing the Display

You can customize both Spotify components by editing:

- `app/components/SpotifyNowPlaying.tsx` for the currently playing display
- `app/components/SpotifyBackgroundPlayer.tsx` for the background music player

Both components use your portfolio's existing theme variables and Tailwind CSS classes for consistent styling.
