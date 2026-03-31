import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Простая демонстрационная авторизация
    if (formData.username === 'admin' && formData.password === 'admin') {
      login({
        id: 1,
        name: 'Администратор',
        username: 'admin',
        role: 'admin'
      });
    } else if (formData.username === 'operator' && formData.password === 'operator') {
      login({
        id: 2,
        name: 'Оператор',
        username: 'operator',
        role: 'operator'
      });
    } else if (formData.username === 'viewer' && formData.password === 'viewer') {
      login({
        id: 3,
        name: 'Наблюдатель',
        username: 'viewer',
        role: 'viewer'
      });
    } else {
      setError('Неверный логин или пароль');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Система анализа рынка грузоперевозок
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Введите данные для входа в систему
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Логин
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите логин"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Введите пароль"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Войти
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 font-medium mb-2">Демо доступ:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p><strong>admin/admin</strong> - полный доступ</p>
              <p><strong>operator/operator</strong> - добавление и редактирование</p>
              <p><strong>viewer/viewer</strong> - только просмотр</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
