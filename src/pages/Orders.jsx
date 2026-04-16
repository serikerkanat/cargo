import React, { useState } from 'react';
import { useApiData } from '../hooks/useApiData';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  MapPin,
  Truck,
  DollarSign,
  Phone,
  User
} from 'lucide-react';

const Orders = () => {
  const { data, loading, error } = useApiData();
  const { orders } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    truckType: '',
    dateFrom: '',
    dateTo: ''
  });

  // Показываем загрузчик
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка заявок...</div>
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h3 className="text-red-800 font-medium">Ошибка загрузки заявок</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.originalText.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filters.status || order.status === filters.status;
    const matchesTruckType = !filters.truckType || order.truckType === filters.truckType;
    
    return matchesSearch && matchesStatus && matchesTruckType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'completed': return 'Выполнена';
      case 'cancelled': return 'Отменена';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Заявки</h1>
          <p className="text-gray-600">Управление заявками на грузоперевозки</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} className="mr-2" />
          Добавить заявку
        </button>
      </div>

      {/* Поиск и фильтры */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск по маршруту, контакту или тексту..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} className="mr-2" />
            Фильтры
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Все статусы</option>
              <option value="active">Активные</option>
              <option value="completed">Выполненные</option>
              <option value="cancelled">Отмененные</option>
            </select>
            <select
              value={filters.truckType}
              onChange={(e) => setFilters({...filters, truckType: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Все типы машин</option>
              <option value="тент">Тент</option>
              <option value="реф">Рефрижератор</option>
              <option value="самосвал">Самосвал</option>
            </select>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Таблица заявок */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Маршрут
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Груз
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ставка
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Контакт
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      {order.date ? new Date(order.date).toLocaleDateString('ru-RU') : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.from || 'N/A'} - {order.to || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">{order.truckType || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Truck size={16} className="mr-2 text-gray-400" />
                      <div>
                        <div>{order.weight || 0} т / {order.volume || 0} м³</div>
                        <div className="text-xs text-gray-500">{order.loadingType || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign size={16} className="mr-2 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {order.rate ? order.rate.toLocaleString() : '0'} {order.currency || 'KZT'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.contact || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{order.company || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Просмотр"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Редактировать"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно просмотра заявки */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Детали заявки</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Маршрут</h3>
                  <p className="text-gray-900">{selectedOrder.from || 'N/A'} - {selectedOrder.to || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Дата загрузки</h3>
                  <p className="text-gray-900">{selectedOrder.loadingDate ? new Date(selectedOrder.loadingDate).toLocaleDateString('ru-RU') : 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Груз</h3>
                  <p className="text-gray-900">{selectedOrder.weight || 0} т / {selectedOrder.volume || 0} м³</p>
                  <p className="text-sm text-gray-600">{selectedOrder.cargoDescription || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Тип машины</h3>
                  <p className="text-gray-900">{selectedOrder.truckType || 'N/A'} ({selectedOrder.loadingType || 'N/A'})</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Ставка</h3>
                  <p className="text-gray-900">{selectedOrder.rate ? selectedOrder.rate.toLocaleString() : '0'} {selectedOrder.currency || 'KZT'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Контакт</h3>
                  <p className="text-gray-900">{selectedOrder.contact || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.phone || 'N/A'}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.telegram || 'N/A'}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Исходный текст</h3>
                <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedOrder.originalText || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
