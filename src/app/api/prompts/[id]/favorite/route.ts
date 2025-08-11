import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Obtener el prompt actual
    const currentPrompt = await prisma.prompt.findUnique({
      where: { id },
      select: { isFavorite: true }
    })

    if (!currentPrompt) {
      return NextResponse.json(
        { error: 'Prompt no encontrado' },
        { status: 404 }
      )
    }

    // Alternar el estado de favorito
    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: { isFavorite: !currentPrompt.isFavorite },
      select: {
        id: true,
        title: true,
        isFavorite: true
      }
    })

    return NextResponse.json(updatedPrompt)
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
