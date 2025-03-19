'use client'

import dynamic from 'next/dynamic'

// Dynamically import the Three.js component with no SSR to avoid hydration issues
const CyberpunkScene = dynamic(() => import('../components/AngelStatue'), { 
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'black',
      color: '#ff0033',
      fontFamily: 'monospace'
    }}>
      <div>
        <p style={{ textAlign: 'center' }}>Loading Cyberpunk Scene...</p>
        <div style={{ 
          width: '150px',
          height: '3px',
          background: '#222',
          margin: '10px auto',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '30%',
            background: 'linear-gradient(90deg, transparent, #ff0033, transparent)',
            animation: 'loading 1.5s infinite'
          }}></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes loading {
          0% { left: -30%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  )
})

export default function CyberpunkPage() {
  return <CyberpunkScene />
} 