import { NextRequest, NextResponse } from 'next/server';

// This route handles the OAuth callback from Strava
// It exchanges the authorization code for access/refresh tokens
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.json({ error: `Authorization failed: ${error}` }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
  }

  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Missing Strava API credentials' }, { status: 500 });
  }

  try {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ error: `Token exchange failed: ${errorData}` }, { status: 400 });
    }

    const data = await response.json();

    // In development, show the tokens so you can save them
    // In production, you'd want to store these securely
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Strava Authorization Complete</title>
          <style>
            body { font-family: system-ui; padding: 2rem; max-width: 600px; margin: 0 auto; }
            pre { background: #f5f5f5; padding: 1rem; border-radius: 8px; overflow-x: auto; }
            .success { color: #22c55e; }
            .important { background: #fef3c7; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
          </style>
        </head>
        <body>
          <h1 class="success">✅ Authorization Successful!</h1>
          <div class="important">
            <strong>⚠️ Important:</strong> Save the <code>refresh_token</code> below to your <code>.env.local</code> file
          </div>
          <h2>Add this to your .env.local:</h2>
          <pre>STRAVA_REFRESH_TOKEN=${data.refresh_token}</pre>
          <h2>Full Response:</h2>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </body>
      </html>
      `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Token exchange failed' },
      { status: 500 }
    );
  }
}

