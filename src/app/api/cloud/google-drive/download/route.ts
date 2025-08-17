import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // En modo demo, simulamos la descarga
    console.log('📥 Simulating Google Drive download')
    
    // Simular delay de descarga
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // En producción, aquí buscarías el archivo más reciente en Google Drive
    // const driveService = new GoogleDriveService(config)
    // const latestBackup = await driveService.downloadLatestBackup()
    
    // Respuesta simulada
    const simulatedBackup = {
      prompts: [],
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      source: 'google-drive-demo'
    }
    
    return NextResponse.json({ 
      success: true, 
      data: simulatedBackup,
      message: 'Latest backup downloaded (demo mode)',
      filename: 'ai-prompts-backup-latest.json'
    })
    
  } catch (error) {
    console.error('Error downloading from Google Drive:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Download failed' 
    }, { status: 500 })
  }
}
