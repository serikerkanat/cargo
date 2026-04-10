import React, { useState } from 'react';
import { useApiData } from '../hooks/useApiData';
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  Truck,
  Users,
  DollarSign,
  BarChart3,
  Filter
} from 'lucide-react';

const Routes = () => {
  const { data, loading, error } = useApiData();
  const { routes, analytics } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Показываем загрузчик
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка маршрутов...</div>
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h3 className="text-red-800 font-medium">Ошибка загрузки маршрутов</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const filteredRoutes = routes.filter(route =>
    (route.direction || route.route || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriceChangeColor = (change) => {
    if (change && change.startsWith('+')) return 'text-green-600';
    if (change && change.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPriceChangeIcon = (change) => {
    if (change && change.startsWith('+')) return <TrendingUp size={16} />;
    if (change && change.startsWith('-')) return <TrendingDown size={16} />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Маршруты</h1>
        <p className="text-gray-600">Анализ и статистика по маршрутам грузоперевозок</p>
      </div>

      {/* Поиск и фильтры */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск маршрута..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} className="mr-2" />
            Фильтры
          </button>
        </div>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего маршрутов</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{routes.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <MapPin size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Всего заявок</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {routes.reduce((sum, route) => sum + route.orderCount, 0)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <BarChart3 size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Средняя ставка</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {Math.round(routes.reduce((sum, route) => sum + route.averageRate, 0) / routes.length).toLocaleString()} ₸
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <DollarSign size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Активные контакты</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {new Set(routes.flatMap(route => route.relatedContacts)).size}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Список маршрутов */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRoutes.map((route) => (
          <div key={route.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{route.direction}</h3>
                <div className={`flex items-center ${getPriceChangeColor(route.priceChange)}`}>
                  {getPriceChangeIcon(route.priceChange)}
                  <span className="ml-1 text-sm font-medium">{route.priceChange}</span>
                </div>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Заявок</p>
                  <p className="text-xl font-semibold text-gray-900">{route.orderCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Средняя ставка</p>
                  <p className="text-xl font-semibold text-gray-900">{route.averageRate.toLocaleString()} ₸</p>
                </div>
              </div>

              {/* Диапазон ставок */}
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-500 mb-2">Диапазон ставок</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    <span className="text-gray-600">мин:</span> {route.minRate.toLocaleString()} ₸
                  </span>
                  <span className="text-sm font-medium">{route.medianRate.toLocaleString()} ₸</span>
                  <span className="text-sm">
                    <span className="text-gray-600">макс:</span> {route.maxRate.toLocaleString()} ₸
                  </span>
                </div>
              </div>

              {/* Типы машин */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Типы машин</p>
                <div className="flex flex-wrap gap-2">
                  {route.commonTruckTypes.map((type, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Контакты */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Активные контакты</p>
                <div className="space-y-1">
                  {route.relatedContacts.slice(0, 2).map((contact, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Users size={14} className="mr-2 text-gray-400" />
                      <span className="text-gray-700">{contact}</span>
                    </div>
                  ))}
                  {route.relatedContacts.length > 2 && (
                    <p className="text-xs text-gray-500">+{route.relatedContacts.length - 2} еще</p>
                  )}
                </div>
              </div>

              {/* Кнопка деталей */}
              <button
                onClick={() => setSelectedRoute(route)}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Подробнее
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно деталей маршрута */}
      {selectedRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Детали маршрута</h2>
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedRoute.direction}</h3>
                <div className={`flex items-center ${getPriceChangeColor(selectedRoute.priceChange)}`}>
                  {getPriceChangeIcon(selectedRoute.priceChange)}
                  <span className="ml-2 text-lg font-medium">{selectedRoute.priceChange} за последний месяц</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Всего заявок</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedRoute.orderCount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Средняя ставка</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedRoute.averageRate.toLocaleString()} ₸</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Минимальная</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedRoute.minRate.toLocaleString()} ₸</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Максимальная</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedRoute.maxRate.toLocaleString()} ₸</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Типы машин</h3>
                  <div className="space-y-2">
                    {selectedRoute.commonTruckTypes.map((type, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                        <Truck size={20} className="mr-3 text-gray-600" />
                        <span className="font-medium text-gray-900">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Активные контакты</h3>
                  <div className="space-y-2">
                    {selectedRoute.relatedContacts.map((contact, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                        <Users size={20} className="mr-3 text-gray-600" />
                        <span className="font-medium text-gray-900">{contact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;
