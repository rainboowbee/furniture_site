'use client';

import { useState, useEffect } from 'react';
import type { Lead } from '@/types/lead';

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leads');
      if (!response.ok) throw new Error('Ошибка загрузки');
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'new' | 'contacted' | 'converted' | 'rejected') => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        setLeads(leads.map(lead => 
          lead.id === id ? { ...lead, status } : lead
        ));
      }
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
    }
  };

  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(lead => lead.status === filter);

  const statusColors = {
    new: 'bg-blue-900/20 text-blue-300 border-blue-500/30',
    contacted: 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30',
    converted: 'bg-green-900/20 text-green-300 border-green-500/30',
    rejected: 'bg-red-900/20 text-red-300 border-red-500/30'
  };

  const statusLabels = {
    new: 'Новая',
    contacted: 'Связались',
    converted: 'Конвертирована',
    rejected: 'Отклонена'
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
        <p className="text-gray-300">Загрузка...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center text-red-400">
        <p className="text-xl mb-2">Ошибка загрузки</p>
        <p className="text-gray-400">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-4">
              Админ-панель GardenFab
            </h1>
            <p className="text-gray-300 text-lg">
              Управление заявками от клиентов
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">{leads.length}</div>
            <div className="text-gray-400 text-sm">Всего заявок</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {leads.filter(l => l.status === 'new').length}
            </div>
            <div className="text-gray-400 text-sm">Новые</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {leads.filter(l => l.status === 'contacted').length}
            </div>
            <div className="text-gray-400 text-sm">Связались</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {leads.filter(l => l.status === 'converted').length}
            </div>
            <div className="text-gray-400 text-sm">Конвертированы</div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {[
            { key: 'all', label: 'Все', count: leads.length },
            { key: 'new', label: 'Новые', count: leads.filter(l => l.status === 'new').length },
            { key: 'contacted', label: 'Связались', count: leads.filter(l => l.status === 'contacted').length },
            { key: 'converted', label: 'Конвертированы', count: leads.filter(l => l.status === 'converted').length },
            { key: 'rejected', label: 'Отклонены', count: leads.filter(l => l.status === 'rejected').length }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === key 
                  ? 'bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/25' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Таблица заявок */}
        {isMobile ? (
          // Мобильная версия - карточки
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{lead.name}</h3>
                    <p className="text-amber-400">{lead.phone}</p>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                    statusColors[lead.status as keyof typeof statusColors]
                  }`}>
                    {statusLabels[lead.status as keyof typeof statusLabels]}
                  </span>
                </div>
                
                {lead.message && (
                  <p className="text-gray-300 mb-3 text-sm">{lead.message}</p>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">
                    {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                  <select
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value as 'new' | 'contacted' | 'converted' | 'rejected')}
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="new">Новая</option>
                    <option value="contacted">Связались</option>
                    <option value="converted">Конвертирована</option>
                    <option value="rejected">Отклонена</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Десктопная версия - таблица
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Клиент
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Контакты
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Сообщение
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-gray-800">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-800/30 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {lead.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-amber-400">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 max-w-xs truncate">
                          {lead.message || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${
                          statusColors[lead.status as keyof typeof statusColors]
                        }`}>
                          {statusLabels[lead.status as keyof typeof statusLabels]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(lead.id, e.target.value as 'new' | 'contacted' | 'converted' | 'rejected')}
                          className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors duration-200"
                        >
                          <option value="new">Новая</option>
                          <option value="contacted">Связались</option>
                          <option value="converted">Конвертирована</option>
                          <option value="rejected">Отклонена</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredLeads.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-2">Заявок не найдено</div>
            <div className="text-gray-500 text-sm">
              {filter === 'all' ? 'Пока нет заявок' : `Нет заявок со статусом "${statusLabels[filter as keyof typeof statusLabels]}"`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
