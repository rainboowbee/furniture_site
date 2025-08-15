import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateLeadSchema = z.object({
  status: z.enum(["new", "contacted", "completed", "rejected"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: "ID заявки обязателен" }, 
        { status: 400 }
      );
    }

    const body = await req.json();
    const validationResult = updateLeadSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Неверный статус" }, 
        { status: 400 }
      );
    }

    const { status } = validationResult.data;

    // Проверяем существование заявки
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: "Заявка не найдена" }, 
        { status: 404 }
      );
    }

    // Обновляем статус
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: "ID заявки обязателен" }, 
        { status: 400 }
      );
    }

    // Проверяем существование заявки
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: "Заявка не найдена" }, 
        { status: 404 }
      );
    }

    // Удаляем заявку
    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Заявка успешно удалена" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting lead:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
}
