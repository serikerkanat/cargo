import { useState, useEffect, useCallback } from 'react';
import { loadExcelData } from '../utils/excelParser';
import { mockOrders, mockContacts, mockRoutes, mockAnalytics } from '../data/mockData';

/**
 * Хук для загрузки и управления данными из Excel файла
 */
export const useExcelData = () => {
  const [data, setData] = useState({
    orders: [],
    contacts: [],
    routes: [],
    analytics: {
      totalOrders: 0,
      activeOrders: 0,
      completedOrders: 0,
      averageRate: 0,
      topRoutes: [],
      truckTypeStats: [],
      monthlyStats: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingExcelData, setIsUsingExcelData] = useState(false);

  // Функция загрузки данных из Excel
  const loadFromExcel = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const excelData = await loadExcelData();
      setData(excelData);
      setIsUsingExcelData(true);
      console.log('Данные успешно загружены из Excel:', excelData);
    } catch (err) {
      console.error('Ошибка загрузки данных из Excel:', err);
      setError(err.message);
      // При ошибке оставляем пустые данные
      setData({
        orders: [],
        contacts: [],
        routes: [],
        analytics: {
          totalOrders: 0,
          activeOrders: 0,
          completedOrders: 0,
          averageRate: 0,
          topRoutes: [],
          truckTypeStats: [],
          monthlyStats: []
        }
      });
      setIsUsingExcelData(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Функция переключения на моковые данные (оставляем для совместимости, но не используем)
  const useMockData = useCallback(() => {
    console.log('Моковые данные отключены');
    setError('Моковые данные отключены');
  }, []);

  // Функция обновления данных
  const updateData = useCallback((newData) => {
    setData(prevData => ({
      ...prevData,
      ...newData
    }));
  }, []);

  // Функция добавления новой заявки
  const addOrder = useCallback((order) => {
    setData(prevData => ({
      ...prevData,
      orders: [...prevData.orders, { ...order, id: Date.now() }]
    }));
  }, []);

  // Функция обновления заявки
  const updateOrder = useCallback((orderId, updatedOrder) => {
    setData(prevData => ({
      ...prevData,
      orders: prevData.orders.map(order => 
        order.id === orderId ? { ...order, ...updatedOrder } : order
      )
    }));
  }, []);

  // Функция удаления заявки
  const deleteOrder = useCallback((orderId) => {
    setData(prevData => ({
      ...prevData,
      orders: prevData.orders.filter(order => order.id !== orderId)
    }));
  }, []);

  // Функция добавления нового контакта
  const addContact = useCallback((contact) => {
    setData(prevData => ({
      ...prevData,
      contacts: [...prevData.contacts, { ...contact, id: Date.now() }]
    }));
  }, []);

  // Функция обновления контакта
  const updateContact = useCallback((contactId, updatedContact) => {
    setData(prevData => ({
      ...prevData,
      contacts: prevData.contacts.map(contact => 
        contact.id === contactId ? { ...contact, ...updatedContact } : contact
      )
    }));
  }, []);

  // Функция удаления контакта
  const deleteContact = useCallback((contactId) => {
    setData(prevData => ({
      ...prevData,
      contacts: prevData.contacts.filter(contact => contact.id !== contactId)
    }));
  }, []);

  // Автоматическая загрузка данных при монтировании компонента
  useEffect(() => {
    // Автоматически загружаем данные из Excel при инициализации
    console.log('Автоматическая загрузка данных из Excel...');
    loadFromExcel();
  }, [loadFromExcel]);

  return {
    data,
    loading,
    error,
    useExcelData: isUsingExcelData,
    loadFromExcel,
    useMockData,
    updateData,
    addOrder,
    updateOrder,
    deleteOrder,
    addContact,
    updateContact,
    deleteContact
  };
};

export default useExcelData;
