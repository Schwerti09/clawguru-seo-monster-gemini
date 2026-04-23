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
            background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
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
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 'bold',
              }}
            >
              🧪
            </div>
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sandbox
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
            LiveFixSandbox — Test Your Config
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
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981' }}>Nginx</div>
              <div>Config</div>
            </div>
            <div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#059669' }}>Docker</div>
              <div>Compose</div>
            </div>
            <div>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#34d399' }}>K8s</div>
              <div>Manifest</div>
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
