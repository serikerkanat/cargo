export const mockOrders = [
  {
    id: 1,
    date: '2024-03-26T10:30:00',
    source: 't.me/K7777KZ',
    originalText: 'Алматы - Астана 20 тонн тент 150000 тг',
    from: 'Алматы',
    to: 'Астана',
    normalizedRoute: 'Алматы - Астана',
    rate: 150000,
    currency: 'KZT',
    truckType: 'тент',
    loadingType: 'зад',
    volume: 82,
    weight: 20,
    cargoDescription: 'Общий груз',
    loadingDate: '2024-03-27',
    contact: 'Иван Петров',
    phone: '+77001234567',
    telegram: '@ivan_petrov',
    company: 'Транспортная компания "Восток"',
    comments: '',
    status: 'active',
    tags: ['срочный']
  },
  {
    id: 2,
    date: '2024-03-26T11:15:00',
    source: 't.me/dellakz',
    originalText: 'Шымкент - Караганда 15 тонн реф 180000 тг',
    from: 'Шымкент',
    to: 'Караганда',
    normalizedRoute: 'Шымкент - Караганда',
    rate: 180000,
    currency: 'KZT',
    truckType: 'реф',
    loadingType: 'зад',
    volume: 65,
    weight: 15,
    cargoDescription: 'Продукты питания',
    loadingDate: '2024-03-28',
    contact: 'Айгуль Смагулова',
    phone: '+77002345678',
    telegram: '@aigul_sm',
    company: 'Кызыл-Жар Логистик',
    comments: 'Требуется поддержание температуры',
    status: 'active',
    tags: ['рефрижератор']
  },
  {
    id: 3,
    date: '2024-03-26T12:00:00',
    source: 't.me/+iSbL-__DS0s5OGIy',
    originalText: 'Атырау - Алматы 25 тонн самосвал 200000 тг',
    from: 'Атырау',
    to: 'Алматы',
    normalizedRoute: 'Атырау - Алматы',
    rate: 200000,
    currency: 'KZT',
    truckType: 'самосвал',
    loadingType: 'верх',
    volume: 15,
    weight: 25,
    cargoDescription: 'Строительные материалы',
    loadingDate: '2024-03-29',
    contact: 'Бекжан Нурмуханов',
    phone: '+77003456789',
    telegram: '@bekzhan_n',
    company: 'СтройТранс',
    comments: '',
    status: 'completed',
    tags: ['строительство']
  }
];

export const mockContacts = [
  {
    id: 1,
    name: 'Иван Петров',
    phone: '+77001234567',
    telegram: '@ivan_petrov',
    company: 'Транспортная компания "Восток"',
    role: 'перевозчик',
    notes: 'Надежный партнер, работает с 2020 года',
    reliability: 5,
    listType: 'white',
    activityHistory: 15
  },
  {
    id: 2,
    name: 'Айгуль Смагулова',
    phone: '+77002345678',
    telegram: '@aigul_sm',
    company: 'Кызыл-Жар Логистик',
    role: 'диспетчер',
    notes: 'Специализируется на рефрижераторных перевозках',
    reliability: 4,
    listType: 'white',
    activityHistory: 8
  },
  {
    id: 3,
    name: 'Бекжан Нурмуханов',
    phone: '+77003456789',
    telegram: '@bekzhan_n',
    company: 'СтройТранс',
    role: 'посредник',
    notes: 'Работает со строительными грузами',
    reliability: 3,
    listType: 'gray',
    activityHistory: 12
  }
];

export const mockRoutes = [
  {
    id: 1,
    direction: 'Алматы - Астана',
    orderCount: 45,
    averageRate: 145000,
    minRate: 120000,
    maxRate: 180000,
    medianRate: 145000,
    priceChange: '+5%',
    commonTruckTypes: ['тент', 'реф'],
    relatedContacts: ['Иван Петров', 'Айгуль Смагулова']
  },
  {
    id: 2,
    direction: 'Шымкент - Караганда',
    orderCount: 32,
    averageRate: 175000,
    minRate: 150000,
    maxRate: 200000,
    medianRate: 175000,
    priceChange: '+3%',
    commonTruckTypes: ['реф', 'тент'],
    relatedContacts: ['Айгуль Смагулова']
  },
  {
    id: 3,
    direction: 'Атырау - Алматы',
    orderCount: 28,
    averageRate: 195000,
    minRate: 170000,
    maxRate: 220000,
    medianRate: 195000,
    priceChange: '+8%',
    commonTruckTypes: ['самосвал', 'тент'],
    relatedContacts: ['Бекжан Нурмуханов']
  }
];

export const mockAnalytics = {
  totalOrders: 105,
  activeOrders: 23,
  completedOrders: 82,
  averageRate: 165000,
  topRoutes: [
    { route: 'Алматы - Астана', count: 45, avgRate: 145000 },
    { route: 'Шымкент - Караганда', count: 32, avgRate: 175000 },
    { route: 'Атырау - Алматы', count: 28, avgRate: 195000 }
  ],
  truckTypeStats: [
    { type: 'тент', count: 45, percentage: 43 },
    { type: 'реф', count: 35, percentage: 33 },
    { type: 'самосвал', count: 25, percentage: 24 }
  ],
  monthlyStats: [
    { month: 'Янв', orders: 85, avgRate: 155000 },
    { month: 'Фев', orders: 92, avgRate: 160000 },
    { month: 'Мар', orders: 105, avgRate: 165000 }
  ]
};
