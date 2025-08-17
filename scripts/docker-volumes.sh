#!/bin/bash

# Script de utilidades para gestionar volúmenes de Docker de AI Prompt Manager

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${BLUE}AI Prompt Manager - Gestión de Volúmenes Docker${NC}"
    echo ""
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  backup          Crear backup de los datos"
    echo "  restore         Restaurar backup de los datos"
    echo "  list            Listar volúmenes existentes"
    echo "  clean           Limpiar volúmenes no utilizados"
    echo "  reset           Resetear completamente los datos (¡PELIGROSO!)"
    echo "  status          Mostrar estado de los volúmenes"
    echo "  help            Mostrar esta ayuda"
    echo ""
}

# Función para crear backup
backup_data() {
    echo -e "${YELLOW}📦 Creando backup de los datos...${NC}"
    
    BACKUP_NAME="ai-prompt-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    # Verificar que el volumen existe
    if ! docker volume inspect ai_prompt_data > /dev/null 2>&1; then
        echo -e "${RED}❌ El volumen ai_prompt_data no existe${NC}"
        exit 1
    fi
    
    # Crear backup
    docker run --rm \
        -v ai_prompt_data:/data \
        -v "$(pwd)":/backup \
        alpine tar czf "/backup/$BACKUP_NAME" -C /data .
    
    echo -e "${GREEN}✅ Backup creado: $BACKUP_NAME${NC}"
}

# Función para restaurar backup
restore_data() {
    if [ -z "$1" ]; then
        echo -e "${RED}❌ Debes especificar el archivo de backup${NC}"
        echo "Uso: $0 restore <archivo-backup.tar.gz>"
        exit 1
    fi
    
    if [ ! -f "$1" ]; then
        echo -e "${RED}❌ El archivo de backup no existe: $1${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}📥 Restaurando backup: $1${NC}"
    echo -e "${RED}⚠️  Esto sobrescribirá todos los datos existentes. ¿Continuar? (y/N)${NC}"
    read -r response
    
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Operación cancelada"
        exit 0
    fi
    
    # Restaurar backup
    docker run --rm \
        -v ai_prompt_data:/data \
        -v "$(pwd)":/backup \
        alpine tar xzf "/backup/$1" -C /data
    
    echo -e "${GREEN}✅ Backup restaurado exitosamente${NC}"
}

# Función para listar volúmenes
list_volumes() {
    echo -e "${BLUE}📋 Volúmenes de AI Prompt Manager:${NC}"
    docker volume ls | grep ai_prompt || echo "No se encontraron volúmenes"
}

# Función para limpiar volúmenes no utilizados
clean_volumes() {
    echo -e "${YELLOW}🧹 Limpiando volúmenes no utilizados...${NC}"
    docker volume prune -f
    echo -e "${GREEN}✅ Volúmenes limpiados${NC}"
}

# Función para resetear datos
reset_data() {
    echo -e "${RED}⚠️  PELIGRO: Esto eliminará TODOS los datos permanentemente${NC}"
    echo -e "${RED}¿Estás seguro que quieres continuar? (escriba 'SI' para confirmar)${NC}"
    read -r response
    
    if [ "$response" != "SI" ]; then
        echo "Operación cancelada"
        exit 0
    fi
    
    echo -e "${YELLOW}🗑️  Eliminando volúmenes...${NC}"
    docker-compose down -v 2>/dev/null || true
    docker volume rm ai_prompt_data ai_prompt_uploads 2>/dev/null || true
    echo -e "${GREEN}✅ Datos reseteados${NC}"
}

# Función para mostrar estado
show_status() {
    echo -e "${BLUE}📊 Estado de los volúmenes:${NC}"
    echo ""
    
    # Verificar volúmenes
    for volume in ai_prompt_data ai_prompt_uploads; do
        if docker volume inspect "$volume" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $volume: Existe${NC}"
            # Mostrar tamaño aproximado
            size=$(docker run --rm -v "$volume":/data alpine du -sh /data 2>/dev/null | cut -f1)
            echo -e "   📦 Tamaño: $size"
        else
            echo -e "${YELLOW}⚠️  $volume: No existe${NC}"
        fi
    done
    
    echo ""
    echo -e "${BLUE}🐳 Estado del contenedor:${NC}"
    docker-compose ps 2>/dev/null || echo "Docker Compose no está ejecutándose"
}

# Procesamiento de argumentos
case "${1:-help}" in
    backup)
        backup_data
        ;;
    restore)
        restore_data "$2"
        ;;
    list)
        list_volumes
        ;;
    clean)
        clean_volumes
        ;;
    reset)
        reset_data
        ;;
    status)
        show_status
        ;;
    help|*)
        show_help
        ;;
esac
