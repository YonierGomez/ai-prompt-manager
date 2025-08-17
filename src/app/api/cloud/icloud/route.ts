import { NextRequest, NextResponse } from 'next/server'
import { createiCloudService } from '@/lib/icloud-drive'

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

    // Crear servicio de iCloud
    const icloudService = createiCloudService()
    
    if (!icloudService) {
      return NextResponse.json({ 
        success: false, 
        error: 'iCloud service not configured' 
      }, { status: 501 })
    }

    // Verificar conexión
    const connectionTest = await icloudService.testConnection()
    if (!connectionTest.connected) {
      return NextResponse.json({ 
        success: false, 
        error: 'iCloud connection failed' 
      }, { status: 401 })
    }

    // Subir el respaldo
    const uploadResult = await icloudService.uploadBackup(data)

    return NextResponse.json({ 
      success: true,
      message: 'Backup uploaded successfully to iCloud Drive',
      file: {
        recordName: uploadResult.recordName,
        fileName: uploadResult.fileName
      },
      stats: {
        prompts: data.prompts.length,
        size: JSON.stringify(data).length,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error: any) {
    console.error('Error uploading to iCloud:', error)
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload to iCloud Drive' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Crear servicio de iCloud
    const icloudService = createiCloudService()
    
    if (!icloudService) {
      return NextResponse.json({ 
        success: false, 
        error: 'iCloud service not configured' 
      }, { status: 501 })
    }

    // Verificar conexión
    const connectionTest = await icloudService.testConnection()
    if (!connectionTest.connected) {
      return NextResponse.json({ 
        success: false, 
        error: 'iCloud connection failed' 
      }, { status: 401 })
    }

    // Descargar el respaldo más reciente
    const backupData = await icloudService.downloadLatestBackup()

    return NextResponse.json({ 
      success: true,
      message: 'Latest backup downloaded from iCloud Drive',
      data: backupData,
      stats: {
        prompts: backupData.prompts?.length || 0,
        version: backupData.version || 'unknown',
        exportDate: backupData.exportDate || 'unknown'
      }
    })
    
  } catch (error: any) {
    console.error('Error downloading from iCloud:', error)
    
    if (error.message.includes('No backups found')) {
      return NextResponse.json({ 
        success: false, 
        error: 'No backups found in iCloud Drive' 
      }, { status: 404 })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Failed to download from iCloud Drive' 
    }, { status: 500 })
  }
}
