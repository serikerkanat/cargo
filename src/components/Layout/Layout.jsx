import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  Map, 
  Users, 
  BarChart3, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Дашборд', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Заявки', href: '/orders', icon: FileText },
    { name: 'Маршруты', href: '/routes', icon: Map },
    { name: 'Контакты', href: '/contacts', icon: Users },
    { name: 'Аналитика', href: '/analytics', icon: BarChart3 },
  ];

  const isActive = (href) => location.pathname === href;

  console.log('Layout рендерится, текущий путь:', location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Мобильный меню бургер */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">Система анализа</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Сайдбар */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900">Система анализа</h1>
              <p className="text-sm text-gray-500 mt-1">рынка грузоперевозок</p>
            </div>

            {/* Навигация */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive(item.href)
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon size={18} className="mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Пользователь и выход */}
            <div className="p-4 border-t border-gray-200">
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-900">Администратор</p>
                <p className="text-xs text-gray-500 capitalize">admin</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <LogOut size={18} className="mr-3" />
                Выйти
              </button>
            </div>
          </div>
        </div>

        {/* Затемнение для мобильного */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Основной контент */}
        <div className="flex-1 lg:ml-0">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
