# Spotify-Style Music Player for Your Portfolio

This portfolio includes a custom Spotify-style music player that displays currently playing tracks with album artwork, similar to what you'd see on Spotify.

## Features

- Displays currently playing track with album artwork
- Play/pause and mute/unmute controls
- Auto-advances to the next song when one finishes
- Toggle visibility with a music icon button
- Clean, modern UI that matches your portfolio theme

## Setting Up Your Music

### 1. Add Your Music Files

Place your MP3 files and cover images in the `public/playlist` folder:

```
public/
  playlist/
    dil-ibaadat.mp3
    dil-ibaadat.jpg
    tum-mile.mp3
    tum-mile.jpg
    ...etc
```

### 2. Customize Your Playlist

Edit the playlist configuration in `app/data/playlist.ts`:

```typescript
export const playlist: Song[] = [
  {
    title: "Your Song Title",
    artist: "Artist Name",
    coverUrl: "/playlist/your-song-cover.jpg",
    audioUrl: "/playlist/your-song-file.mp3",
  },
  // Add more songs...
];
```

## How It Works

- The player appears as a small music icon button in the bottom-right corner of your portfolio
- Click the button to show/hide the player
- When visible, it displays the current song's artwork, title, and artist
- Controls allow you to play/pause and mute/unmute
- The playlist loops automatically when it reaches the end

## Using External Audio Files

If you prefer to use external audio links instead of hosting the files yourself:

1. Update the `audioUrl` in the playlist to point to an external URL:

```typescript
{
  title: "Song Title",
  artist: "Artist Name",
  coverUrl: "/playlist/local-cover.jpg", // Can still use local image
  audioUrl: "https://example.com/path/to/audio.mp3" // External audio URL
}
```

2. Make sure the external server provides proper CORS headers to allow playing the audio

## Customizing the Player

### Styling

The player is styled using Tailwind CSS classes. You can modify its appearance by editing the classes in `app/components/SpotifyPlayer.tsx`.

### Behavior

You can adjust the player's behavior by modifying the React component in `app/components/SpotifyPlayer.tsx`:

- Change the default volume by modifying the `audioElement.volume` value
- Adjust animation timing by changing the transition parameters
- Modify the player's position by changing the position CSS classes

## Technical Details

The player is built with:

- React hooks for state management
- Framer Motion for animations
- HTML5 Audio API for playback
- Tailwind CSS for styling

## Troubleshooting

If you encounter issues with the music player:

1. **Audio doesn't play**: Check browser console for errors - most likely CORS issues if using external audio
2. **Images don't appear**: Verify the paths in the playlist match your actual file locations
3. **Player doesn't appear**: Ensure the SpotifyPlayer component is properly imported and added to your main page
