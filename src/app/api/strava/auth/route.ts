import { NextResponse } from 'next/server';

// Helper route to initiate Strava OAuth flow
// Visit /api/strava/auth to start authorization
export async function GET() {
  const clientId = process.env.STRAVA_CLIENT_ID;

  if (!clientId) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Strava Setup Required</title>
          <style>
            body { font-family: system-ui; padding: 2rem; max-width: 600px; margin: 0 auto; }
            pre { background: #f5f5f5; padding: 1rem; border-radius: 8px; }
            .error { color: #ef4444; }
            ol { line-height: 1.8; }
          </style>
        </head>
        <body>
          <h1 class="error">⚠️ Strava API Not Configured</h1>
          <h2>Setup Steps:</h2>
          <ol>
            <li>Go to <a href="https://www.strava.com/settings/api" target="_blank">strava.com/settings/api</a></li>
            <li>Create an application with callback domain: <code>localhost</code></li>
            <li>Create a <code>.env.local</code> file in your project root:</li>
          </ol>
          <pre>STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_CLUB_ID=1458920</pre>
          <p>Then restart your dev server and visit this page again.</p>
        </body>
      </html>
      `,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Build the authorization URL
  const redirectUri = 'http://localhost:3000/api/strava/callback';
  const scope = 'read,profile:read_all';
  
  const authUrl = new URL('https://www.strava.com/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('approval_prompt', 'auto');

  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authorize Strava</title>
        <style>
          body { 
            font-family: system-ui; 
            padding: 2rem; 
            max-width: 600px; 
            margin: 0 auto; 
            text-align: center;
          }
          .btn {
            display: inline-block;
            background: #FC4C02;
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            margin: 1rem 0;
          }
          .btn:hover { background: #e04400; }
          .info { background: #f0fdf4; padding: 1rem; border-radius: 8px; text-align: left; margin: 2rem 0; }
        </style>
      </head>
      <body>
        <h1>🏃 Connect to Strava</h1>
        <p>Click below to authorize the Silk Stride website to access your Strava club data.</p>
        
        <a href="${authUrl.toString()}" class="btn">
          Connect with Strava
        </a>
        
        <div class="info">
          <h3>What this does:</h3>
          <ul>
            <li>Allows fetching Silk Stride club member list</li>
            <li>Accesses public profile pictures of members</li>
            <li>Only reads data - no write access</li>
          </ul>
        </div>
        
        <p><strong>Client ID:</strong> ${clientId}</p>
        <p><strong>Redirect URI:</strong> ${redirectUri}</p>
      </body>
    </html>
    `,
    { headers: { 'Content-Type': 'text/html' } }
  );
}

