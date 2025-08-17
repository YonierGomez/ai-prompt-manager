// lib/google-drive.ts
import { GoogleAuth } from 'google-auth-library'

interface GoogleDriveConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
}

class GoogleDriveService {
  private auth: GoogleAuth
  private accessToken: string | null = null

  constructor(config: GoogleDriveConfig) {
    this.auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/drive.file'],
      credentials: {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uris: [config.redirectUri]
      }
    })
  }

  // Autenticar usuario
  async authenticate(): Promise<string> {
    const authUrl = await this.auth.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/drive.file']
    })
    return authUrl
  }

  // Subir respaldo automáticamente
  async uploadBackup(data: any): Promise<boolean> {
    try {
      const fileName = `ai-prompts-backup-${Date.now()}.json`
      const fileContent = JSON.stringify(data, null, 2)

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: fileName,
          parents: ['AI_PROMPTS_FOLDER_ID'], // Carpeta específica
          mimeType: 'application/json'
        })
      })

      return response.ok
    } catch (error) {
      console.error('Error uploading to Google Drive:', error)
      return false
    }
  }

  // Descargar último respaldo
  async downloadLatestBackup(): Promise<any | null> {
    try {
      // Buscar archivos de respaldo
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name contains 'ai-prompts-backup'&orderBy=createdTime desc`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      )

      const files = await response.json()
      if (files.files && files.files.length > 0) {
        const latestFile = files.files[0]
        
        // Descargar contenido del archivo
        const contentResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files/${latestFile.id}?alt=media`,
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`
            }
          }
        )

        return await contentResponse.json()
      }
      
      return null
    } catch (error) {
      console.error('Error downloading from Google Drive:', error)
      return null
    }
  }
}

export { GoogleDriveService }
