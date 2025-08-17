// lib/google-drive.ts - Integración real con Google Drive API
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

interface GoogleDriveConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
}

interface DriveFile {
  id: string
  name: string
  createdTime: string
  modifiedTime: string
  size?: string
}

export class GoogleDriveService {
  private oauth2Client: OAuth2Client
  private drive: any

  constructor(config: GoogleDriveConfig) {
    this.oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    )

    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client })
  }

  // Generar URL de autorización OAuth2
  generateAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata.readonly'
    ]

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    })
  }

  // Intercambiar código por tokens
  async getTokensFromCode(code: string): Promise<{ access_token: string; refresh_token?: string }> {
    const { tokens } = await this.oauth2Client.getToken(code)
    this.oauth2Client.setCredentials(tokens)
    
    // Validar que tenemos access_token
    if (!tokens.access_token) {
      throw new Error('No access token received from Google')
    }
    
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || undefined
    }
  }

  // Configurar tokens existentes
  setTokens(tokens: { access_token: string; refresh_token?: string }) {
    this.oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    })
  }

  // Crear carpeta AI Prompts si no existe
  async ensureAIPromptsFolder(): Promise<string> {
    try {
      // Buscar la carpeta
      const response = await this.drive.files.list({
        q: "name='AI Prompts' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        spaces: 'drive'
      })

      if (response.data.files && response.data.files.length > 0) {
        return response.data.files[0].id
      }

      // Crear la carpeta si no existe
      const folderResponse = await this.drive.files.create({
        requestBody: {
          name: 'AI Prompts',
          mimeType: 'application/vnd.google-apps.folder'
        }
      })

      return folderResponse.data.id
    } catch (error) {
      console.error('Error ensuring AI Prompts folder:', error)
      throw new Error('Failed to create/find AI Prompts folder')
    }
  }

  // Subir archivo de respaldo
  async uploadBackup(data: any): Promise<{ id: string; name: string; webViewLink: string }> {
    try {
      const folderId = await this.ensureAIPromptsFolder()
      const fileName = `ai-prompts-backup-${new Date().toISOString().split('T')[0]}-${Date.now()}.json`
      const fileContent = JSON.stringify(data, null, 2)

      const response = await this.drive.files.create({
        requestBody: {
          name: fileName,
          parents: [folderId]
        },
        media: {
          mimeType: 'application/json',
          body: fileContent
        }
      })

      // Obtener el enlace del archivo
      const fileInfo = await this.drive.files.get({
        fileId: response.data.id,
        fields: 'webViewLink,webContentLink'
      })

      return {
        id: response.data.id,
        name: fileName,
        webViewLink: fileInfo.data.webViewLink
      }
    } catch (error) {
      console.error('Error uploading backup to Google Drive:', error)
      throw new Error('Failed to upload backup to Google Drive')
    }
  }

  // Listar archivos de respaldo
  async listBackups(): Promise<DriveFile[]> {
    try {
      const folderId = await this.ensureAIPromptsFolder()
      
      const response = await this.drive.files.list({
        q: `parents in '${folderId}' and name contains 'ai-prompts-backup' and trashed=false`,
        orderBy: 'createdTime desc',
        fields: 'files(id,name,createdTime,modifiedTime,size)'
      })

      return response.data.files || []
    } catch (error) {
      console.error('Error listing backups:', error)
      throw new Error('Failed to list backups')
    }
  }

  // Descargar archivo de respaldo específico
  async downloadBackup(fileId: string): Promise<any> {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        alt: 'media'
      })

      return JSON.parse(response.data)
    } catch (error) {
      console.error('Error downloading backup:', error)
      throw new Error('Failed to download backup')
    }
  }

  // Descargar el respaldo más reciente
  async downloadLatestBackup(): Promise<any> {
    try {
      const backups = await this.listBackups()
      
      if (backups.length === 0) {
        throw new Error('No backups found')
      }

      const latestBackup = backups[0]
      return await this.downloadBackup(latestBackup.id)
    } catch (error) {
      console.error('Error downloading latest backup:', error)
      throw new Error('Failed to download latest backup')
    }
  }

  // Eliminar archivo de respaldo
  async deleteBackup(fileId: string): Promise<void> {
    try {
      await this.drive.files.delete({
        fileId: fileId
      })
    } catch (error) {
      console.error('Error deleting backup:', error)
      throw new Error('Failed to delete backup')
    }
  }

  // Verificar conexión
  async testConnection(): Promise<{ connected: boolean; userInfo?: any }> {
    try {
      const response = await this.drive.about.get({
        fields: 'user(displayName,emailAddress),storageQuota'
      })

      return {
        connected: true,
        userInfo: {
          name: response.data.user.displayName,
          email: response.data.user.emailAddress,
          storage: response.data.storageQuota
        }
      }
    } catch (error) {
      return { connected: false }
    }
  }
}
