import React, { useState } from 'react';
import { useApiData } from '../hooks/useApiData';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  PieChart, 
  Calendar,
  Filter,
  Download,
  Truck,
  MapPin,
  DollarSign
} from 'lucide-react';

const Analytics = () => {
  const { data, loading, error } = useApiData();
  const { analytics } = data;
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('orders');

  // Показываем загрузчик
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка аналитики...</div>
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h3 className="text-red-800 font-medium">Ошибка загрузки аналитики</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const periods = [
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
    { value: 'quarter', label: 'Квартал' },
    { value: 'year', label: 'Год' }
  ];

  const metrics = [
    { value: 'orders', label: 'Количество заявок' },
    { value: 'rates', label: 'Средние ставки' },
    { value: 'routes', label: 'Маршруты' },
    { value: 'contacts', label: 'Контакты' }
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
          <p className="text-gray-600">Детальный анализ рынка грузоперевозок</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Download size={20} className="mr-2" />
          Экспорт отчета
        </button>
      </div>

      {/* Фильтры */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Период</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Метрика</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {metrics.map(metric => (
                <option key={metric.value} value={metric.value}>{metric.label}</option>
              ))}
            </select>
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} className="mr-2" />
            Дополнительные фильтры
          </button>
        </div>
      </div>

      {/* Ключевые показатели */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего заявок</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{analytics.totalOrders}</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp size={16} className="mr-1" />
                <span>+12% к прошлому периоду</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Средняя ставка</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{analytics.averageRate.toLocaleString()} ₸</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp size={16} className="mr-1" />
                <span>+3% к прошлому периоду</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Активных маршрутов</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{analytics.topRoutes.length}</p>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <TrendingUp size={16} className="mr-1" />
                <span>без изменений</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <MapPin size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Выполнено</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{analytics.completedOrders}</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <TrendingUp size={16} className="mr-1" />
                <span>+8% к прошлому периоду</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Truck size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* График динамики */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 size={20} className="mr-2 text-blue-600" />
              Динамика заявок и ставок
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.monthlyStats.map((month, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{month.month}</span>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">{month.orders} заявок</div>
                      <div className="text-sm font-medium text-gray-900">{month.avgRate.toLocaleString()} ₸</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(month.orders / 120) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Распределение по типам машин */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart size={20} className="mr-2 text-blue-600" />
              Распределение по типам машин
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.truckTypeStats.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="w-4 h-4 bg-blue-600 rounded mr-3"></div>
                    <span className="text-sm font-medium text-gray-900 w-16">{type.type}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${type.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{type.count} заявок</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 ml-4 w-12 text-right">{type.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Топ маршрутов с детальной аналитикой */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <MapPin size={20} className="mr-2 text-blue-600" />
            Топ маршрутов - детальная аналитика
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Маршрут
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Заявок
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Средняя ставка
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Мин/Макс
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Динамика
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Популярные типы
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.topRoutes.map((route, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {route.route}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {route.avgRate.toLocaleString()} ₸
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.round(route.avgRate * 0.8).toLocaleString()} - {Math.round(route.avgRate * 1.2).toLocaleString()} ₸
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp size={16} className="mr-1" />
                      +{Math.floor(Math.random() * 10 + 3)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">тент</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">реф</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Сезонность и тренды */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar size={20} className="mr-2 text-blue-600" />
            Сезонность и тренды
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Пик сезона</h3>
              <p className="text-2xl font-bold text-green-900">Июнь-Август</p>
              <p className="text-sm text-green-700 mt-2">+25% заявок к среднему</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Низкий сезон</h3>
              <p className="text-2xl font-bold text-yellow-900">Январь-Февраль</p>
              <p className="text-sm text-yellow-700 mt-2">-15% заявок к среднему</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Стабильный период</h3>
              <p className="text-2xl font-bold text-blue-900">Март-Май</p>
              <p className="text-sm text-blue-700 mt-2">Постоянный спрос</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
