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
            background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
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
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
              }}
            >
              🤖
            </div>
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Copilot
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
            AI-Powered Security Intelligence
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
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6' }}>4.2M+</div>
              <div>Runbooks</div>
            </div>
            <div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#8b5cf6' }}>30s</div>
              <div>Fix Time</div>
            </div>
            <div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981' }}>24/7</div>
              <div>Active</div>
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
