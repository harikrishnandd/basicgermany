// Loading component for News page - provides immediate visual feedback
export default function NewsLoading() {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Loading skeleton for page header */}
      <div style={{
        marginBottom: '48px'
      }}>
        <div style={{
          width: '200px',
          height: '48px',
          background: 'var(--systemQuaternary)',
          borderRadius: '8px',
          marginBottom: '16px',
          animation: 'pulse 1.5s ease-in-out infinite'
        }} />
        <div style={{
          width: '400px',
          height: '20px',
          background: 'var(--systemQuaternary)',
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: '0.2s'
        }} />
      </div>

      {/* Loading skeleton for tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '48px',
        borderBottom: '1px solid var(--systemQuinary)',
        paddingBottom: '0'
      }}>
        <div style={{
          width: '100px',
          height: '40px',
          background: 'var(--systemQuaternary)',
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: '0.3s'
        }} />
        <div style={{
          width: '80px',
          height: '40px',
          background: 'var(--systemQuaternary)',
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: '0.4s'
        }} />
        <div style={{
          width: '80px',
          height: '40px',
          background: 'var(--systemQuaternary)',
          borderRadius: '4px',
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: '0.5s'
        }} />
      </div>

      {/* Loading skeleton for news cards */}
      <div style={{
        display: 'grid',
        gap: '32px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'
      }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{
            background: 'var(--cardBg)',
            border: 'var(--keylineBorder)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            {/* Image skeleton */}
            <div style={{
              width: '100%',
              paddingBottom: '56.25%', // 16:9 ratio
              background: 'var(--systemQuaternary)',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`
            }} />
            
            {/* Content skeleton */}
            <div style={{ padding: '24px' }}>
              {/* Metadata skeleton */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--systemQuaternary)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${i * 0.1 + 0.1}s`
                }} />
                <div style={{
                  width: '120px',
                  height: '14px',
                  background: 'var(--systemQuaternary)',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${i * 0.1 + 0.2}s`
                }} />
              </div>
              
              {/* Headline skeleton */}
              <div style={{
                width: '100%',
                height: '28px',
                background: 'var(--systemQuaternary)',
                borderRadius: '4px',
                marginBottom: '12px',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1 + 0.3}s`
              }} />
              
              {/* Summary skeleton */}
              <div style={{
                width: '100%',
                height: '14px',
                background: 'var(--systemQuaternary)',
                borderRadius: '4px',
                marginBottom: '8px',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1 + 0.4}s`
              }} />
              <div style={{
                width: '85%',
                height: '14px',
                background: 'var(--systemQuaternary)',
                borderRadius: '4px',
                marginBottom: '8px',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1 + 0.5}s`
              }} />
              <div style={{
                width: '70%',
                height: '14px',
                background: 'var(--systemQuaternary)',
                borderRadius: '4px',
                marginBottom: '20px',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1 + 0.6}s`
              }} />
              
              {/* CTA skeleton */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end'
              }}>
                <div style={{
                  width: '100px',
                  height: '14px',
                  background: 'var(--systemQuaternary)',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${i * 0.1 + 0.7}s`
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pulse animation using global styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0%, 100% {
              opacity: 0.6;
            }
            50% {
              opacity: 1;
            }
          }
        `
      }} />
    </div>
  );
}
