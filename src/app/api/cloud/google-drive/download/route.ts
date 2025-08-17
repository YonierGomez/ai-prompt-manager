import { NextRequest, NextResponse } from 'next/server'
import { GoogleDriveService } from '@/lib/google-drive'

export async function GET(request: NextRequest) {
  try {
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

    // Verificar conexión
    const connectionTest = await driveService.testConnection()
    if (!connectionTest.connected) {
      return NextResponse.json({ 
        success: false, 
        error: 'Google Drive connection failed' 
      }, { status: 401 })
    }

    // Descargar el respaldo más reciente
    const backupData = await driveService.downloadLatestBackup()

    return NextResponse.json({ 
      success: true,
      message: 'Latest backup downloaded from Google Drive',
      data: backupData,
      stats: {
        prompts: backupData.prompts?.length || 0,
        version: backupData.version || 'unknown',
        exportDate: backupData.exportDate || 'unknown'
      }
    })
    
  } catch (error: any) {
    console.error('Error downloading from Google Drive:', error)
    
    // Manejar errores específicos
    if (error.message.includes('No backups found')) {
      return NextResponse.json({ 
        success: false, 
        error: 'No backups found in Google Drive' 
      }, { status: 404 })
    }

    if (error.message.includes('Invalid Credentials')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Google Drive authentication expired' 
      }, { status: 401 })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Failed to download from Google Drive' 
    }, { status: 500 })
  }
}
