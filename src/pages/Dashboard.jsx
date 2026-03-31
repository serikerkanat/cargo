import React from 'react';
import { useExcelData } from '../hooks/useExcelData';
import { 
  FileText, 
  TrendingUp, 
  Users, 
  Truck,
  Activity,
  DollarSign,
  MapPin,
  BarChart3
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change, changeType }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        {change && (
          <div className={`flex items-center mt-2 text-sm ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp size={16} className="mr-1" />
            {change}
          </div>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon size={24} className="text-blue-600" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  console.log('Dashboard рендерится');
  const { data, loading, error } = useExcelData();
  const { analytics } = data;

  // Показываем загрузчик
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка данных из Excel...</div>
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h3 className="text-red-800 font-medium">Ошибка загрузки Excel</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Всего заявок',
      value: analytics?.totalOrders || 0,
      icon: FileText,
      change: analytics?.totalOrders > 0 ? '+12%' : '0%',
      changeType: 'positive'
    },
    {
      title: 'Активные заявки',
      value: analytics?.activeOrders || 0,
      icon: Activity,
      change: analytics?.activeOrders > 0 ? '+5%' : '0%',
      changeType: 'positive'
    },
    {
      title: 'Средняя ставка',
      value: `${(analytics?.averageRate || 0).toLocaleString()} ₸`,
      icon: DollarSign,
      change: analytics?.averageRate > 0 ? '+3%' : '0%',
      changeType: 'positive'
    },
    {
      title: 'Контакты',
      value: data?.contacts?.length || 0,
      icon: Users,
      change: data?.contacts?.length > 0 ? '+8%' : '0%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
        <p className="text-gray-600">Обзор состояния системы анализа рынка грузоперевозок</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Информация о данных */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Данные из Excel</h2>
        <div className="space-y-3">
          <p className="text-gray-600">
            <strong>Загружено заявок:</strong> {analytics?.totalOrders || 0}
          </p>
          <p className="text-gray-600">
            <strong>Контактов в базе:</strong> {data?.contacts?.length || 0}
          </p>
          <p className="text-gray-600">
            <strong>Маршрутов:</strong> {data?.routes?.length || 0}
          </p>
          {analytics?.totalOrders > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded">
              <p className="text-sm text-green-800">✅ Данные из Excel успешно загружены и отображаются</p>
            </div>
          )}
        </div>
      </div>

      {/* Топ маршруты */}
      {analytics?.topRoutes && analytics.topRoutes.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin size={20} className="mr-2 text-blue-600" />
              Топ маршруты из Excel
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.topRoutes.slice(0, 5).map((route, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{route.route}</p>
                    <p className="text-sm text-gray-500">{route.count} заявок</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{route.avgRate.toLocaleString()} ₸</p>
                    <p className="text-sm text-gray-500">средняя ставка</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Статистика по типам машин */}
      {analytics?.truckTypeStats && analytics.truckTypeStats.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Truck size={20} className="mr-2 text-blue-600" />
              Типы машин из Excel
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.truckTypeStats.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <span className="text-sm font-medium text-gray-900 w-16">{type.type}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${type.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{type.count} заявок</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 ml-4">{type.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
