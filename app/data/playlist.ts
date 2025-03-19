// This is a placeholder for your actual playlist
// You'll need to replace these URLs with your actual song files and cover images
// For MP3s, you can host them in the public folder or use external URLs

export type Song = {
  title: string
  artist: string
  coverUrl: string
  audioUrl: string
}

export const playlist: Song[] = [
  {
    title: "Dil Ibaadat",
    artist: "Pritam, KK",
    coverUrl: "/playlist/dil-ibaadat.jpg", // Place this image in public/playlist/
    audioUrl: "/playlist/dil-ibaadat.mp3" // Place this MP3 in public/playlist/
  },
  {
    title: "Tum Mile",
    artist: "Pritam, Javed Ali",
    coverUrl: "/playlist/tum-mile.jpg",
    audioUrl: "/playlist/tum-mile.mp3"
  },
  {
    title: "Ae Dil Hai Mushkil",
    artist: "Pritam, Arijit Singh",
    coverUrl: "/playlist/ae-dil-hai-mushkil.jpg",
    audioUrl: "/playlist/ae-dil-hai-mushkil.mp3"
  },
  {
    title: "Channa Mereya",
    artist: "Pritam, Arijit Singh",
    coverUrl: "/playlist/channa-mereya.jpg",
    audioUrl: "/playlist/channa-mereya.mp3"
  },
  {
    title: "Bulleya",
    artist: "Pritam, Amit Mishra",
    coverUrl: "/playlist/bulleya.jpg",
    audioUrl: "/playlist/bulleya.mp3"
  }
] 