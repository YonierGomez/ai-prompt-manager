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

    // Listar respaldos
    const backups = await driveService.listBackups()

    return NextResponse.json({ 
      success: true,
      backups: backups.map(backup => ({
        id: backup.id,
        name: backup.name,
        createdTime: backup.createdTime,
        modifiedTime: backup.modifiedTime,
        size: backup.size
      })),
      count: backups.length
    })
    
  } catch (error: any) {
    console.error('Error listing Google Drive backups:', error)
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to list backups' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return NextResponse.json({ 
        success: false, 
        error: 'File ID is required' 
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

    // Eliminar respaldo
    await driveService.deleteBackup(fileId)

    return NextResponse.json({ 
      success: true,
      message: 'Backup deleted successfully'
    })
    
  } catch (error: any) {
    console.error('Error deleting Google Drive backup:', error)
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete backup' 
    }, { status: 500 })
  }
}
