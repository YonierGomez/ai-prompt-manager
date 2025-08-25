# ai-prompt-manager (Docker)

Imagen oficial para desplegar el gestor de prompts de IA en Docker.

## Versiones soportadas

- **x86_64 (AMD/Intel):**
  - Tag principal: `latest` o versión específica (ej. `v2.2`)
  - Ejemplo:
    ```sh
    docker pull neytor/ai-prompt-manager:latest
    docker run -p 3000:3000 neytor/ai-prompt-manager:latest
    ```

- **ARM (Apple Silicon, Raspberry Pi, etc):**
  - Tag: `:arm` (ej. `v2.2-arm`)
  - Ejemplo:
    ```sh
    docker pull neytor/ai-prompt-manager:v2.2-arm
    docker run -p 3000:3000 neytor/ai-prompt-manager:v2.2-arm
    ```

## Variables de entorno
- `NODE_ENV`: production
- `DATABASE_URL`: file:/app/data/prod.db
- `NODE_OPTIONS`: --max-old-space-size=2048

## Volúmenes recomendados
- Persistencia de base de datos:
  ```sh
  -v ./data:/app/data
  ```
- Archivos de usuario:
  ```sh
  -v ./uploads:/app/uploads
  ```

## Ejemplo con docker-compose
```yaml
services:
  ai-prompt-manager:
    image: neytor/ai-prompt-manager:latest
    ports:
      - "8102:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: file:/app/data/prod.db
      NODE_OPTIONS: --max-old-space-size=2048
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
    restart: unless-stopped
```

## Standalone
La imagen usa el modo `standalone` de Next.js para máxima compatibilidad y rendimiento.

---
Más información y soporte en: [GitHub](https://github.com/YonierGomez/ai-prompt-manager)
