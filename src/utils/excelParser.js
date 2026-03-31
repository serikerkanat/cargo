import * as XLSX from 'xlsx';

/**
 * Утилита для парсинга Excel файлов с данными о транспортных заявках
 */

// Функция для чтения Excel файла
export const readExcelFile = async (filePath) => {
  try {
    const response = await fetch('/data/transport_data.xlsx');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    return workbook;
  } catch (error) {
    console.error('Ошибка чтения Excel файла:', error);
    throw error;
  }
};

// Функция для преобразования данных из Excel в формат заявок
export const parseOrdersFromExcel = (workbook) => {
  const orders = [];
  
  // Предполагаем, что данные находятся на первом листе
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  
  // Преобразуем лист в JSON
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  data.forEach((row, index) => {
    try {
      const order = {
        id: row.id || index + 1,
        date: parseDate(row.date || row.Дата || row['Дата и время']),
        source: row.source || row.Источник || row['Источник данных'] || 'Excel импорт',
        originalText: row.originalText || row.text || row['Исходный текст'] || row['Текст сообщения'] || '',
        from: row.from || row.fromCity || row.Откуда || row['Город отправления'] || '',
        to: row.to || row.toCity || row.Куда || row['Город назначения'] || '',
        normalizedRoute: row.normalizedRoute || row.route || row.Маршрут || `${row.from || ''} - ${row.to || ''}`,
        rate: parseNumber(row.rate || row.Ставка || row['Ставка (₸)'] || 0),
        currency: row.currency || row.Валюта || 'KZT',
        truckType: row.truckType || row.truck || row['Тип машины'] || row['Тип транспорта'] || '',
        loadingType: row.loadingType || row.loading || row['Тип загрузки'] || '',
        volume: parseNumber(row.volume || row.Объем || row['Объем (м³)'] || 0),
        weight: parseNumber(row.weight || row.Вес || row['Вес (т)'] || 0),
        cargoDescription: row.cargoDescription || row.cargo || row.Груз || row['Описание груза'] || '',
        loadingDate: parseDate(row.loadingDate || row['Дата загрузки'] || row['Дата погрузки']),
        contact: row.contact || row.contactPerson || row.Контакт || row['Контактное лицо'] || '',
        phone: row.phone || row.Телефон || '',
        telegram: row.telegram || row.Telegram || row.Username || '',
        company: row.company || row.Компания || row['Название компании'] || '',
        comments: row.comments || row.comment || row.Комментарии || '',
        status: row.status || row.Статус || 'active',
        tags: parseTags(row.tags || row.Теги || row['Теги (через запятую)'] || '')
      };
      
      orders.push(order);
    } catch (error) {
      console.warn(`Ошибка парсинга строки ${index + 1}:`, error);
    }
  });
  
  return orders;
};

// Функция для преобразования данных в формат контактов
export const parseContactsFromExcel = (workbook) => {
  const contacts = [];
  
  // Ищем лист с контактами или используем первый лист
  let worksheetName = workbook.SheetNames.find(name => 
    name.toLowerCase().includes('contact') || 
    name.toLowerCase().includes('контакт')
  ) || workbook.SheetNames[0];
  
  const worksheet = workbook.Sheets[worksheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  data.forEach((row, index) => {
    try {
      const contact = {
        id: row.id || index + 1,
        name: row.name || row.Имя || row['Имя контакта'] || row['Контактное лицо'] || '',
        phone: row.phone || row.Телефон || '',
        telegram: row.telegram || row.Telegram || row.Username || '',
        company: row.company || row.Компания || row['Название компании'] || '',
        role: row.role || row.Роль || row['Тип роли'] || 'неизвестно',
        notes: row.notes || row.note || row.Заметки || row.Комментарии || '',
        reliability: parseNumber(row.reliability || row.Надежность || row.Рейтинг || 3),
        listType: row.listType || row.list || row['Тип списка'] || row['Белый/серый/черный'] || 'white',
        activityHistory: parseNumber(row.activityHistory || row.activity || row.Активность || row['История активности'] || 0)
      };
      
      contacts.push(contact);
    } catch (error) {
      console.warn(`Ошибка парсинга контакта ${index + 1}:`, error);
    }
  });
  
  return contacts;
};

// Функция для преобразования данных в формат маршрутов
export const parseRoutesFromExcel = (workbook) => {
  const routes = [];
  
  // Ищем лист с маршрутами
  let worksheetName = workbook.SheetNames.find(name => 
    name.toLowerCase().includes('route') || 
    name.toLowerCase().includes('маршрут')
  ) || workbook.SheetNames[0];
  
  const worksheet = workbook.Sheets[worksheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  data.forEach((row, index) => {
    try {
      const route = {
        id: row.id || index + 1,
        direction: row.direction || row.route || row.Маршрут || row.Направление || '',
        orderCount: parseNumber(row.orderCount || row.orders || row['Количество заявок'] || 0),
        averageRate: parseNumber(row.averageRate || row.avgRate || row['Средняя ставка'] || 0),
        minRate: parseNumber(row.minRate || row.min || row['Минимальная ставка'] || 0),
        maxRate: parseNumber(row.maxRate || row.max || row['Максимальная ставка'] || 0),
        medianRate: parseNumber(row.medianRate || row.median || row['Медианная ставка'] || 0),
        priceChange: row.priceChange || row.change || row['Изменение цены'] || '+0%',
        commonTruckTypes: parseArray(row.commonTruckTypes || row.truckTypes || row['Типы машин'] || ''),
        relatedContacts: parseArray(row.relatedContacts || row.contacts || row['Контакты'] || '')
      };
      
      routes.push(route);
    } catch (error) {
      console.warn(`Ошибка парсинга маршрута ${index + 1}:`, error);
    }
  });
  
  return routes;
};

// Вспомогательные функции
const parseDate = (dateValue) => {
  if (!dateValue) return new Date().toISOString();
  
  // Если это число (Excel дата)
  if (typeof dateValue === 'number') {
    const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
    return excelDate.toISOString();
  }
  
  // Если это строка
  const date = new Date(dateValue);
  return isNaN(date) ? new Date().toISOString() : date.toISOString();
};

const parseNumber = (value) => {
  if (!value && value !== 0) return 0;
  // Если это уже число
  if (typeof value === 'number') return value;
  // Убираем все символы кроме цифр, точки и минуса
  const cleaned = String(value).replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

const parseArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value).split(',').map(item => item.trim()).filter(item => item);
};

const parseTags = (value) => {
  if (!value) return [];
  return parseArray(value);
};

// Основная функция для загрузки всех данных
export const loadExcelData = async () => {
  try {
    const workbook = await readExcelFile('/data/transport_data.xlsx');
    
    const orders = parseOrdersFromExcel(workbook);
    const contacts = parseContactsFromExcel(workbook);
    const routes = parseRoutesFromExcel(workbook);
    
    return {
      orders,
      contacts,
      routes,
      analytics: generateAnalytics(orders, contacts, routes)
    };
  } catch (error) {
    console.error('Ошибка загрузки данных из Excel:', error);
    throw error;
  }
};

// Генерация аналитики на основе загруженных данных
const generateAnalytics = (orders, contacts, routes) => {
  const totalOrders = orders.length;
  const activeOrders = orders.filter(order => order.status === 'active').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  
  const averageRate = orders.length > 0 
    ? Math.round(orders.reduce((sum, order) => sum + order.rate, 0) / orders.length)
    : 0;
  
  // Топ маршруты
  const routeStats = {};
  orders.forEach(order => {
    const route = order.normalizedRoute;
    if (!routeStats[route]) {
      routeStats[route] = { count: 0, totalRate: 0 };
    }
    routeStats[route].count++;
    routeStats[route].totalRate += order.rate;
  });
  
  const topRoutes = Object.entries(routeStats)
    .map(([route, stats]) => ({
      route,
      count: stats.count,
      avgRate: Math.round(stats.totalRate / stats.count)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Статистика по типам машин
  const truckTypeStats = {};
  orders.forEach(order => {
    const type = order.truckType || 'неизвестно';
    if (!truckTypeStats[type]) {
      truckTypeStats[type] = 0;
    }
    truckTypeStats[type]++;
  });
  
  const totalOrdersWithTruckType = Object.values(truckTypeStats).reduce((sum, count) => sum + count, 0);
  
  const truckTypeStatsArray = Object.entries(truckTypeStats)
    .map(([type, count]) => ({
      type,
      count,
      percentage: totalOrdersWithTruckType > 0 ? Math.round((count / totalOrdersWithTruckType) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);
  
  return {
    totalOrders,
    activeOrders,
    completedOrders,
    averageRate,
    topRoutes,
    truckTypeStats: truckTypeStatsArray,
    monthlyStats: generateMonthlyStats(orders)
  };
};

const generateMonthlyStats = (orders) => {
  const monthlyData = {};
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  
  orders.forEach(order => {
    const date = new Date(order.date);
    const monthKey = months[date.getMonth()];
    const yearKey = date.getFullYear();
    const key = `${yearKey}-${monthKey}`;
    
    if (!monthlyData[key]) {
      monthlyData[key] = { orders: 0, totalRate: 0 };
    }
    monthlyData[key].orders++;
    monthlyData[key].totalRate += order.rate;
  });
  
  return Object.entries(monthlyData)
    .slice(-6) // Последние 6 месяцев
    .map(([key, data]) => ({
      month: key.split('-')[1],
      orders: data.orders,
      avgRate: Math.round(data.totalRate / data.orders)
    }));
};

export default {
  readExcelFile,
  parseOrdersFromExcel,
  parseContactsFromExcel,
  parseRoutesFromExcel,
  loadExcelData
};
