import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logger } from "@/lib/logger";

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
    logger.info('Fetching leads');
    
    const leads = await prisma.lead.findMany({ 
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        message: true,
        createdAt: true,
        status: true,
      }
    });
    
    logger.info(`Successfully fetched ${leads.length} leads`);
    return NextResponse.json(leads);
  } catch (error) {
    logger.apiError('/api/leads GET', error as Error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Получаем IP адрес (в продакшене лучше использовать заголовки от прокси)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = (forwarded ? forwarded.split(",")[0] : "unknown") || "unknown";
    
    // Проверяем rate limit
    if (!checkRateLimit(ip)) {
      logger.securityEvent('Rate limit exceeded', { ip, endpoint: '/api/leads' });
      return NextResponse.json(
        { error: "Слишком много запросов. Попробуйте позже." }, 
        { status: 429 }
      );
    }
    
    const body = await req.json();
    
    // Валидация данных
    const validationResult = leadSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message);
      logger.warn('Lead validation failed', { errors, ip });
      return NextResponse.json(
        { error: "Ошибка валидации", details: errors }, 
        { status: 400 }
      );
    }
    
    const { name, phone, message } = validationResult.data;
    
    // Создаем лид
    const lead = await prisma.lead.create({ 
      data: { 
        name: name.trim(), 
        phone: phone.trim(), 
        message: message?.trim() || "",
        status: "new"
      } 
    });
    
    // Логируем создание лида
    logger.leadCreated(lead.id, { name, phone, message: message?.trim() || "", ip });
    
    // В продакшене здесь можно добавить отправку уведомлений
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Заявка успешно отправлена",
        id: lead.id 
      }, 
      { status: 201 }
    );
  } catch (error) {
    logger.apiError('/api/leads POST', error as Error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Ошибка обработки запроса" }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
}