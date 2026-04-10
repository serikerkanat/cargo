import React, { useState } from 'react';
import { useApiData } from '../hooks/useApiData';
import { 
  Search, 
  Plus, 
  Phone, 
  User,
  Building,
  Star,
  Shield,
  MessageCircle,
  Edit,
  Trash2
} from 'lucide-react';

const Contacts = () => {
  const { data, loading, error } = useApiData();
  const { contacts } = data;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  // Показываем загрузчик
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Загрузка контактов...</div>
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h3 className="text-red-800 font-medium">Ошибка загрузки контактов</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const filteredContacts = contacts.filter(contact =>
    (contact.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.phone || '').includes(searchTerm) ||
    (contact.telegram || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getListTypeColor = (type) => {
    switch (type) {
      case 'white': return 'bg-green-100 text-green-800';
      case 'gray': return 'bg-yellow-100 text-yellow-800';
      case 'black': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getListTypeText = (type) => {
    switch (type) {
      case 'white': return 'Белый список';
      case 'gray': return 'Серый список';
      case 'black': return 'Черный список';
      default: return 'Неизвестно';
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'перевозчик': return 'Перевозчик';
      case 'диспетчер': return 'Диспетчер';
      case 'посредник': return 'Посредник';
      case 'заказчик': return 'Заказчик';
      default: return role;
    }
  };

  const getReliabilityStars = (reliability) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < reliability ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Контакты</h1>
          <p className="text-gray-600">База контактов и компаний</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} className="mr-2" />
          Добавить контакт
        </button>
      </div>

      {/* Поиск */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Поиск по имени, компании, телефону или Telegram..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Список контактов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-500">{getRoleText(contact.role)}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getListTypeColor(contact.listType)}`}>
                  {getListTypeText(contact.listType)}
                </span>
              </div>

              {/* Рейтинг надежности */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Надежность</span>
                  <div className="flex items-center">
                    {getReliabilityStars(contact.reliability)}
                    <span className="ml-2 text-sm text-gray-600">{contact.reliability}/5</span>
                  </div>
                </div>
              </div>

              {/* Контактная информация */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Building size={16} className="mr-2 text-gray-400" />
                  <span className="text-gray-900">{contact.company}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  <span className="text-gray-900">{contact.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MessageCircle size={16} className="mr-2 text-gray-400" />
                  <span className="text-gray-900">{contact.telegram}</span>
                </div>
              </div>

              {/* Статистика */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Активность: {contact.activityHistory} заявок</span>
              </div>

              {/* Заметки */}
              {contact.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">{contact.notes}</p>
                </div>
              )}

              {/* Действия */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedContact(contact)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  Подробнее
                </button>
                <div className="flex items-center space-x-2">
                  <button className="text-green-600 hover:text-green-900">
                    <Edit size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно просмотра контакта */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Детали контакта</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={32} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedContact.name}</h3>
                  <p className="text-gray-500">{getRoleText(selectedContact.role)}</p>
                  <div className="flex items-center mt-2">
                    {getReliabilityStars(selectedContact.reliability)}
                    <span className="ml-2 text-sm text-gray-600">{selectedContact.reliability}/5</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Компания</h3>
                  <p className="text-gray-900">{selectedContact.company}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Статус</h3>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getListTypeColor(selectedContact.listType)}`}>
                    {getListTypeText(selectedContact.listType)}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Телефон</h3>
                  <p className="text-gray-900">{selectedContact.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Telegram</h3>
                  <p className="text-gray-900">{selectedContact.telegram}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Активность</h3>
                  <p className="text-gray-900">{selectedContact.activityHistory} заявок</p>
                </div>
              </div>

              {selectedContact.notes && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Заметки</h3>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedContact.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
