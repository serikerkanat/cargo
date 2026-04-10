import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * API utility functions
 */
const apiRequest = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
};

/**
 * Hook for loading and managing data from API
 */
export const useApiData = () => {
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
  const [isUsingApiData, setIsUsingApiData] = useState(false);

  // Function to load all data from API
  const loadFromApi = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading data from API...');
      
      // Load all data in parallel
      const [orders, contacts, routes, analytics] = await Promise.all([
        apiRequest('/orders'),
        apiRequest('/contacts'),
        apiRequest('/routes'),
        apiRequest('/analytics')
      ]);
      
      setData({
        orders,
        contacts,
        routes,
        analytics
      });
      setIsUsingApiData(true);
      console.log('Data successfully loaded from API:', { orders, contacts, routes, analytics });
    } catch (err) {
      console.error('Error loading data from API:', err);
      setError(err.message);
      // Set empty data on error
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
      setIsUsingApiData(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to refresh specific data type
  const refreshData = useCallback(async (dataType) => {
    try {
      const refreshedData = await apiRequest(`/${dataType}`);
      setData(prevData => ({
        ...prevData,
        [dataType]: refreshedData
      }));
      console.log(`${dataType} data refreshed successfully`);
    } catch (err) {
      console.error(`Error refreshing ${dataType} data:`, err);
      setError(err.message);
    }
  }, []);

  // Function to update data locally
  const updateData = useCallback((newData) => {
    setData(prevData => ({
      ...prevData,
      ...newData
    }));
  }, []);

  // Function to add new order (for future implementation)
  const addOrder = useCallback((order) => {
    // For now, just update local state
    // TODO: Implement POST request to API
    setData(prevData => ({
      ...prevData,
      orders: [...prevData.orders, { ...order, id: Date.now().toString() }]
    }));
  }, []);

  // Function to update order
  const updateOrder = useCallback((orderId, updatedOrder) => {
    // For now, just update local state
    // TODO: Implement PUT request to API
    setData(prevData => ({
      ...prevData,
      orders: prevData.orders.map(order => 
        order.id === orderId ? { ...order, ...updatedOrder } : order
      )
    }));
  }, []);

  // Function to delete order
  const deleteOrder = useCallback((orderId) => {
    // For now, just update local state
    // TODO: Implement DELETE request to API
    setData(prevData => ({
      ...prevData,
      orders: prevData.orders.filter(order => order.id !== orderId)
    }));
  }, []);

  // Function to add new contact
  const addContact = useCallback((contact) => {
    // For now, just update local state
    // TODO: Implement POST request to API
    setData(prevData => ({
      ...prevData,
      contacts: [...prevData.contacts, { ...contact, id: Date.now().toString() }]
    }));
  }, []);

  // Function to update contact
  const updateContact = useCallback((contactId, updatedContact) => {
    // For now, just update local state
    // TODO: Implement PUT request to API
    setData(prevData => ({
      ...prevData,
      contacts: prevData.contacts.map(contact => 
        contact.id === contactId ? { ...contact, ...updatedContact } : contact
      )
    }));
  }, []);

  // Function to delete contact
  const deleteContact = useCallback((contactId) => {
    // For now, just update local state
    // TODO: Implement DELETE request to API
    setData(prevData => ({
      ...prevData,
      contacts: prevData.contacts.filter(contact => contact.id !== contactId)
    }));
  }, []);

  // Auto-load data when component mounts
  useEffect(() => {
    console.log('Auto-loading data from API...');
    loadFromApi();
  }, [loadFromApi]);

  return {
    data,
    loading,
    error,
    useApiData: isUsingApiData,
    loadFromApi,
    refreshData,
    updateData,
    addOrder,
    updateOrder,
    deleteOrder,
    addContact,
    updateContact,
    deleteContact
  };
};

export default useApiData;
