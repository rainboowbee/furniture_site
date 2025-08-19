import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'converted', 'rejected'])
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Добавляем await здесь!
    
    const body = await request.json();
    const validatedData = updateLeadSchema.parse(body);

    const lead = await prisma.lead.update({
      where: { id },
      data: { status: validatedData.status }
    });

    return NextResponse.json(lead);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Неверные данные', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении заявки' },
      { status: 500 }
    );
  }
}
