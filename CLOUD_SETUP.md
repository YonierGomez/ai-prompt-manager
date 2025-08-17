# 🌩️ Configuración de Cloud Storage

Esta guía te explica cómo configurar la integración real con Google Drive e iCloud Drive.

## 📋 Requisitos Previos

- Cuenta de Google (Google Drive)
- Apple Developer Account para iCloud ($99/año)
- Conocimientos básicos de APIs

## 🚀 Configuración de Google Drive

### 1. Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google Drive API**

### 2. Configurar OAuth 2.0

1. Ve a **Credenciales** > **Crear credenciales** > **ID de cliente OAuth 2.0**
2. Tipo de aplicación: **Aplicación web**
3. URIs de redireccionamiento autorizados:
   - `http://localhost:3000/api/auth/google/callback` (desarrollo)
   - `https://tudominio.com/api/auth/google/callback` (producción)

### 3. Variables de Entorno

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcdef123456"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

### 4. Permisos Requeridos

- `https://www.googleapis.com/auth/drive.file`
- `https://www.googleapis.com/auth/drive.metadata.readonly`

## 🍎 Configuración de iCloud Drive (CloudKit)

### 1. Apple Developer Account

1. Regístrate en [Apple Developer](https://developer.apple.com/)
2. Crea un **App ID** con CloudKit capability
3. Configura el **CloudKit Dashboard**

### 2. Configurar CloudKit

1. Ve al [CloudKit Dashboard](https://icloud.developer.apple.com/)
2. Crea un nuevo contenedor
3. Define el esquema de datos:
   ```
   Record Type: AIPromptsBackup
   Fields:
   - fileName (String)
   - fileContent (String)
   - createdAt (Int64)
   - modifiedAt (Int64)
   ```

### 3. Generar API Token

1. En CloudKit Dashboard > API Access
2. Genera un **Server-to-Server Key**
3. Descarga el token

### 4. Variables de Entorno

```bash
ICLOUD_CONTAINER_ID="iCloud.com.tucompania.ai-prompt-manager"
ICLOUD_API_TOKEN="tu-cloudkit-api-token"
ICLOUD_ENVIRONMENT="development"
```

## 🔧 Configuración del Proyecto

### 1. Instalar Dependencias

```bash
npm install googleapis google-auth-library
```

### 2. Configurar Variables de Entorno

Copia las variables del archivo `.env` y reemplaza con tus valores reales.

### 3. Probar Conexiones

```bash
npm run dev
```

Ve a `/cloud-storage` y prueba las conexiones.

## 🛠️ Desarrollo y Testing

### Modo de Desarrollo

- Google Drive: Usa `http://localhost:3000` como dominio
- iCloud: Usa environment `development`

### Modo de Producción

- Google Drive: Actualiza URIs de redirección
- iCloud: Cambia a environment `production`

## 🔒 Seguridad

### Tokens de Acceso

- Los tokens se almacenan en cookies HTTP-only
- Expiración automática configurada
- Refresh tokens para renovación automática

### Permisos Mínimos

- Google Drive: Solo acceso a archivos creados por la app
- iCloud: Solo acceso al contenedor específico

## 📊 Monitoreo

### Google Drive

- Cuota de API: 1,000,000,000 requests/día
- Límite de almacenamiento: 15GB gratuito

### iCloud Drive

- Límite de requests: Según plan de Apple Developer
- Límite de almacenamiento: Según plan de iCloud del usuario

## 🚨 Solución de Problemas

### Error: "Invalid Credentials"

1. Verifica las variables de entorno
2. Regenera las credenciales
3. Revisa permisos de la API

### Error: "Quota Exceeded"

1. Revisa límites de la API
2. Implementa rate limiting
3. Considera plan de pago

### Error: "CloudKit Unavailable"

1. Verifica Apple Developer Account
2. Revisa configuración de CloudKit
3. Confirma API Token válido

## 🎯 Próximos Pasos

1. **Configurar credenciales reales**
2. **Probar en desarrollo**
3. **Configurar producción**
4. **Implementar monitoreo**
5. **Documentar para usuarios**

## 📞 Soporte

- Google Drive API: [Documentación oficial](https://developers.google.com/drive/api)
- CloudKit: [Documentación de Apple](https://developer.apple.com/icloud/cloudkit/)
