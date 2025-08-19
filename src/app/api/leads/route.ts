import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Rate limiting store (в продакшене лучше использовать Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const leadSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(100, "Имя слишком длинное"),
  phone: z.string().regex(/^\+?[0-9\s\-\(\)]{10,20}$/, "Неверный формат телефона"),
  message: z.string().max(1000, "Сообщение слишком длинное").optional(),
});

const RATE_LIMIT = {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 минут
};

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userData = rateLimitStore.get(ip);
  
  if (!userData || now > userData.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return true;
  }
  
  if (userData.count >= RATE_LIMIT.maxRequests) {
    return false;
  }
  
  userData.count++;
  return true;
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении заявок' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте позже.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    const lead = await prisma.lead.create({
      data: validatedData
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Неверные данные', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании заявки' },
      { status: 500 }
    );
  }
}
