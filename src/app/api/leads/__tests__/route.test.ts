import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { POST, GET } from '../route';
import { NextRequest } from 'next/server';

// Мокаем Prisma
const mockPrisma = {
  lead: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
};

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

// Мокаем logger
const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  apiError: vi.fn(),
  securityEvent: vi.fn(),
  leadCreated: vi.fn(),
};

vi.mock('@/lib/logger', () => ({
  logger: mockLogger,
}));

describe('Leads API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('POST /api/leads', () => {
    it('should create a new lead with valid data', async () => {
      const mockLead = {
        id: 'test-id',
        name: 'Test User',
        phone: '+7 (999) 123-45-67',
        message: 'Test message',
        status: 'new',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.lead.create.mockResolvedValue(mockLead);

      const request = new NextRequest('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '127.0.0.1',
        },
        body: JSON.stringify({
          name: 'Test User',
          phone: '+7 (999) 123-45-67',
          message: 'Test message',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Заявка успешно отправлена');
      expect(data.id).toBe('test-id');
      expect(mockPrisma.lead.create).toHaveBeenCalledWith({
        data: {
          name: 'Test User',
          phone: '+7 (999) 123-45-67',
          message: 'Test message',
          status: 'new',
        },
      });
    });

    it('should return error for invalid phone format', async () => {
      const request = new NextRequest('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '127.0.0.1',
        },
        body: JSON.stringify({
          name: 'Test User',
          phone: 'invalid-phone',
          message: 'Test message',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Ошибка валидации');
      expect(data.details).toContain('Неверный формат телефона');
    });

    it('should return error for missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '127.0.0.1',
        },
        body: JSON.stringify({
          name: '',
          phone: '',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Ошибка валидации');
      expect(data.details).toContain('Имя должно содержать минимум 2 символа');
      expect(data.details).toContain('Неверный формат телефона');
    });

    it('should return error for rate limit exceeded', async () => {
      // Создаем несколько запросов подряд
      const request = new NextRequest('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '127.0.0.1',
        },
        body: JSON.stringify({
          name: 'Test User',
          phone: '+7 (999) 123-45-67',
        }),
      });

      // Первые 5 запросов должны пройти
      for (let i = 0; i < 5; i++) {
        const response = await POST(request);
        expect(response.status).toBe(201);
      }

      // 6-й запрос должен быть заблокирован
      const blockedResponse = await POST(request);
      const blockedData = await blockedResponse.json();

      expect(blockedResponse.status).toBe(429);
      expect(blockedData.error).toBe('Слишком много запросов. Попробуйте позже.');
    });
  });

  describe('GET /api/leads', () => {
    it('should return all leads', async () => {
      const mockLeads = [
        {
          id: 'lead-1',
          name: 'User 1',
          phone: '+7 (999) 111-11-11',
          message: 'Message 1',
          createdAt: new Date(),
          status: 'new',
        },
        {
          id: 'lead-2',
          name: 'User 2',
          phone: '+7 (999) 222-22-22',
          message: 'Message 2',
          createdAt: new Date(),
          status: 'contacted',
        },
      ];

      mockPrisma.lead.findMany.mockResolvedValue(mockLeads);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].id).toBe('lead-1');
      expect(data[1].id).toBe('lead-2');
      expect(mockPrisma.lead.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          phone: true,
          message: true,
          createdAt: true,
          status: true,
        },
      });
    });

    it('should handle database errors gracefully', async () => {
      mockPrisma.lead.findMany.mockRejectedValue(new Error('Database error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Внутренняя ошибка сервера');
      expect(mockLogger.apiError).toHaveBeenCalled();
    });
  });
});
