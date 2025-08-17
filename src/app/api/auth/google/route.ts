// api/auth/google/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect('/cloud-storage?error=no_code')
  }

  try {
    // Intercambiar código por access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!
      })
    })

    const tokens = await tokenResponse.json()

    if (tokens.access_token) {
      // Guardar token en cookie o localStorage
      const response = NextResponse.redirect('/cloud-storage?connected=google')
      response.cookies.set('google_token', tokens.access_token, {
        httpOnly: true,
        secure: true,
        maxAge: tokens.expires_in
      })
      return response
    }

    return NextResponse.redirect('/cloud-storage?error=auth_failed')
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.redirect('/cloud-storage?error=server_error')
  }
}
