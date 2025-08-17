import { NextRequest, NextResponse } from 'next/server'
import { GoogleDriveService } from '@/lib/google-drive'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  // Si el usuario canceló la autorización
  if (error) {
    return NextResponse.redirect(new URL('/cloud-storage?error=access_denied', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/cloud-storage?error=no_code', request.url))
  }

  try {
    // Configurar el servicio de Google Drive
    const driveService = new GoogleDriveService({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_REDIRECT_URI!
    })

    // Intercambiar código por tokens
    const tokens = await driveService.getTokensFromCode(code)

    // Verificar conexión
    driveService.setTokens(tokens)
    const connectionTest = await driveService.testConnection()

    if (connectionTest.connected) {
      // Crear respuesta de éxito
      const response = NextResponse.redirect(new URL('/cloud-storage?connected=google', request.url))
      
      // Guardar tokens en cookies seguras
      response.cookies.set('google_drive_access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600 // 1 hora
      })

      if (tokens.refresh_token) {
        response.cookies.set('google_drive_refresh_token', tokens.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30 // 30 días
        })
      }

      // También guardar info del usuario
      response.cookies.set('google_drive_user', JSON.stringify(connectionTest.userInfo), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600
      })

      return response
    } else {
      throw new Error('Failed to connect to Google Drive')
    }

  } catch (error) {
    console.error('Google Drive OAuth error:', error)
    return NextResponse.redirect(new URL('/cloud-storage?error=auth_failed', request.url))
  }
}
