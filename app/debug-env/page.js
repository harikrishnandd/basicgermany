'use client';

export default function DebugEnvPage() {
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  const hasPassword = !!adminPassword;
  const passwordLength = adminPassword?.length || 0;
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variable Debug</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Admin Password Status:</h2>
        <p>Has Password: {hasPassword ? 'YES' : 'NO'}</p>
        <p>Password Length: {passwordLength}</p>
        <p>Password Value: {hasPassword ? adminPassword.substring(0, 3) + '...' : 'NOT FOUND'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Environment Variables:</h2>
        <pre>
          {JSON.stringify({
            NEXT_PUBLIC_ADMIN_PASSWORD: adminPassword ? 'SET' : 'NOT SET',
            NODE_ENV: process.env.NODE_ENV,
          }, null, 2)}
        </pre>
      </div>

      <div>
        <h2>Authentication Test:</h2>
        <button 
          onClick={() => {
            const testPassword = 'OtBsYy9RbG5L1X8X@12';
            const isAuthenticated = testPassword === adminPassword;
            alert(`Test Result: ${isAuthenticated ? 'SUCCESS' : 'FAILED'}\nExpected: OtBsYy9RbG5L1X8X@12\nActual: ${adminPassword || 'UNDEFINED'}`);
          }}
          style={{ padding: '10px 20px', background: '#007AFF', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Test Authentication
        </button>
      </div>
    </div>
  );
}
