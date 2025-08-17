import { NextRequest, NextResponse } from 'next/server'
import { GoogleDriveService } from '@/lib/google-drive'

export async function POST(request: NextRequest) {
  try {
    const { data } = await request.json()

    // Verificar que hay datos para subir
    if (!data || !data.prompts) {
      return NextResponse.json({ 
        success: false, 
        error: 'No data provided' 
      }, { status: 400 })
    }

    // Obtener tokens de las cookies
    const accessToken = request.cookies.get('google_drive_access_token')?.value
    const refreshToken = request.cookies.get('google_drive_refresh_token')?.value

    if (!accessToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated with Google Drive' 
      }, { status: 401 })
    }

    // Configurar el servicio de Google Drive
    const driveService = new GoogleDriveService({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUri: process.env.GOOGLE_REDIRECT_URI!
    })

    // Configurar tokens
    driveService.setTokens({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    // Verificar conexión antes de subir
    const connectionTest = await driveService.testConnection()
    if (!connectionTest.connected) {
      return NextResponse.json({ 
        success: false, 
        error: 'Google Drive connection failed' 
      }, { status: 401 })
    }

    // Subir el respaldo
    const uploadResult = await driveService.uploadBackup(data)

    return NextResponse.json({ 
      success: true,
      message: 'Backup uploaded successfully to Google Drive',
      file: {
        id: uploadResult.id,
        name: uploadResult.name,
        webViewLink: uploadResult.webViewLink
      },
      stats: {
        prompts: data.prompts.length,
        size: JSON.stringify(data).length,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error: any) {
    console.error('Error uploading to Google Drive:', error)
    
    // Manejar errores específicos
    if (error.message.includes('Invalid Credentials')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Google Drive authentication expired' 
      }, { status: 401 })
    }

    if (error.message.includes('Quota')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Google Drive storage quota exceeded' 
      }, { status: 507 })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload to Google Drive' 
    }, { status: 500 })
  }
}
