import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export default function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            padding: '60px',
            background: 'radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
              }}
            >
              🎯
            </div>
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Academy ∞
            </div>
          </div>
          
          <div
            style={{
              fontSize: '32px',
              color: '#9ca3af',
              marginBottom: '40px',
              textAlign: 'center',
            }}
          >
            Living Cyber Range — Browser-Native Linux Simulator
          </div>
          
          <div
            style={{
              display: 'flex',
              gap: '60px',
              fontSize: '24px',
              color: '#6b7280',
            }}
          >
            <div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ef4444' }}>80+</div>
              <div>Missions</div>
            </div>
            <div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#dc2626' }}>15</div>
              <div>Tools</div>
            </div>
            <div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f87171' }}>AI</div>
              <div>Tutor</div>
            </div>
          </div>
          
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              right: '60px',
              fontSize: '20px',
              color: '#4b5563',
            }}
          >
            clawguru.org
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
