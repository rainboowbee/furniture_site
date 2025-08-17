"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Lead {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  status: "new" | "contacted" | "completed" | "rejected";
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "completed" | "rejected">("all");

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      setLoading(true);
      const response = await fetch("/api/leads");
      if (!response.ok) throw new Error("Ошибка загрузки");
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }

  async function updateLeadStatus(id: string, status: Lead["status"]) {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) throw new Error("Ошибка обновления");
      
      setLeads(prev => prev.map(lead => 
        lead.id === id ? { ...lead, status } : lead
      ));
    } catch (err) {
      console.error("Error updating lead:", err);
    }
  }

  const filteredLeads = leads.filter(lead => 
    filter === "all" ? true : lead.status === filter
  );

  const statusColors = {
    new: "bg-blue-500",
    contacted: "bg-yellow-500",
    completed: "bg-green-500",
    rejected: "bg-red-500",
  };

  const statusLabels = {
    new: "Новая",
    contacted: "Связались",
    completed: "Завершена",
    rejected: "Отклонена",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl text-gold">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 sm:pt-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0B0B0B] rounded-xl border border-white/10 p-4 sm:p-6 backdrop-blur"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gold">Панель управления</h1>
              <p className="text-white/70 mt-2">Управление заявками и аналитика</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Link 
                href="/" 
                className="text-white/70 hover:text-white transition-colors text-sm"
              >
                ← На главный сайт
              </Link>
              <button
                onClick={fetchLeads}
                className="button-primary rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm font-semibold shadow-gold-glow hover:scale-105 transition-transform"
              >
                Обновить
              </button>
            </div>
          </div>

          {/* Фильтры */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
            {(["all", "new", "contacted", "completed", "rejected"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 sm:px-4 py-2 rounded-full transition-all text-sm sm:text-base ${
                  filter === status
                    ? "bg-gold text-black font-semibold shadow-gold-glow"
                    : "bg-white/[0.05] text-white/80 hover:bg-white/[0.1] hover:text-white border border-white/10"
                }`}
              >
                {status === "all" ? "Все" : statusLabels[status]}
              </button>
            ))}
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {(["new", "contacted", "completed", "rejected"] as const).map((status) => (
              <div key={status} className="bg-white/[0.02] p-4 sm:p-6 rounded-xl border border-white/10 backdrop-blur">
                <div className="text-2xl sm:text-3xl font-bold text-gold">
                  {leads.filter(lead => lead.status === status).length}
                </div>
                <div className="text-xs sm:text-sm text-white/70 mt-1">{statusLabels[status]}</div>
              </div>
            ))}
          </div>

          {/* Список заявок */}
          {/* Десктопная таблица */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/70 font-medium">Дата</th>
                  <th className="text-left py-4 px-4 text-white/70 font-medium">Имя</th>
                  <th className="text-left py-4 px-4 text-white/70 font-medium">Телефон</th>
                  <th className="text-left py-4 px-4 text-white/70 font-medium">Сообщение</th>
                  <th className="text-left py-4 px-4 text-white/70 font-medium">Статус</th>
                  <th className="text-left py-4 px-4 text-white/70 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 text-sm text-white/60">
                      {new Date(lead.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="py-4 px-4 font-medium text-white">{lead.name}</td>
                    <td className="py-4 px-4">
                      <a href={`tel:${lead.phone}`} className="text-gold hover:text-gold/80 transition-colors">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="py-4 px-4 text-sm text-white/70 max-w-xs truncate">
                      {lead.message || "—"}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs text-white font-medium ${statusColors[lead.status]}`}>
                        {statusLabels[lead.status]}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead["status"])}
                        className="text-sm bg-white/[0.05] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-gold/50 focus:outline-none transition-colors"
                      >
                        {(["new", "contacted", "completed", "rejected"] as const).map((status) => (
                          <option key={status} value={status} className="bg-[#0B0B0B] text-white">
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Мобильные карточки */}
          <div className="lg:hidden space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="bg-white/[0.02] rounded-xl border border-white/10 p-4 backdrop-blur">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-white text-lg">{lead.name}</h3>
                    <p className="text-sm text-white/60 mt-1">
                      {new Date(lead.createdAt).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs text-white font-medium ${statusColors[lead.status]}`}>
                    {statusLabels[lead.status]}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-white/70 text-sm">📞</span>
                    <a href={`tel:${lead.phone}`} className="text-gold hover:text-gold/80 transition-colors text-sm">
                      {lead.phone}
                    </a>
                  </div>
                  
                  {lead.message && (
                    <div className="flex items-start gap-2">
                      <span className="text-white/70 text-sm mt-0.5">💬</span>
                      <p className="text-sm text-white/70 flex-1">{lead.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead["status"])}
                    className="flex-1 text-sm bg-white/[0.05] border border-white/20 rounded-lg px-3 py-2 text-white focus:border-gold/50 focus:outline-none transition-colors"
                  >
                    {(["new", "contacted", "completed", "rejected"] as const).map((status) => (
                      <option key={status} value={status} className="bg-[#0B0B0B] text-white">
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12 text-white/50">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-lg">Заявок не найдено</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}