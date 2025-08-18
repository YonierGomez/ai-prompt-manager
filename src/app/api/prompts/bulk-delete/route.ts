import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { promptIds } = body

    if (!promptIds || !Array.isArray(promptIds) || promptIds.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de IDs de prompts' },
        { status: 400 }
      )
    }

    // Validar que todos los IDs sean strings válidos
    const validIds = promptIds.filter(id => typeof id === 'string' && id.trim().length > 0)
    
    if (validIds.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron IDs válidos' },
        { status: 400 }
      )
    }

    // Eliminar los prompts de la base de datos
    const deleteResult = await prisma.prompt.deleteMany({
      where: {
        id: {
          in: validIds
        }
      }
    })

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.count,
      message: `${deleteResult.count} prompt${deleteResult.count > 1 ? 's' : ''} eliminado${deleteResult.count > 1 ? 's' : ''} exitosamente`
    })

  } catch (error) {
    console.error('Error deleting prompts:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor al eliminar prompts' },
      { status: 500 }
    )
  }
}
