const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to handle database errors
const handleDatabaseError = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({ error: message, details: error.message });
};

// GET all offers/orders
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, source_message_date as date, source_sender as source, cleaned_text as original_text,
             route_from as "from", route_to as "to", 
             CONCAT(route_from, ' - ', route_to) as normalized_route,
             price as rate, currency, vehicle_type as truck_type, loading_type,
             volume_m3 as volume, weight_tons as weight,
             loading_date, contact_name as contact, phone, telegram_username as telegram,
             company_name as company, comment as comments, status
      FROM offers 
      WHERE status = 'clean'
      ORDER BY source_message_date DESC
    `);
    
    const orders = result.rows.map(row => ({
      ...row,
      id: row.id.toString(),
      date: row.date ? new Date(row.date).toISOString() : new Date().toISOString(),
      loadingDate: row.loading_date ? new Date(row.loading_date).toISOString() : null,
      status: row.status === 'clean' ? 'active' : row.status
    }));
    
    res.json(orders);
  } catch (error) {
    handleDatabaseError(res, error, 'Error fetching orders');
  }
});

// GET all contacts (extracted from offers)
app.get('/api/contacts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT 
        contact_name as name, 
        phone, 
        telegram_username as telegram, 
        company_name as company,
        COUNT(*) as activity_history,
        AVG(price) as average_rate
      FROM offers 
      WHERE status = 'clean' AND contact_name IS NOT NULL AND contact_name != ''
      GROUP BY contact_name, phone, telegram_username, company_name
      ORDER BY activity_history DESC
    `);
    
    const contacts = result.rows.map((row, index) => ({
      id: (index + 1).toString(),
      name: row.name,
      phone: row.phone || '',
      telegram: row.telegram || '',
      company: row.company || '',
      role: 'client',
      notes: '',
      reliability: 3,
      listType: 'white',
      activityHistory: parseInt(row.activity_history) || 0
    }));
    
    res.json(contacts);
  } catch (error) {
    handleDatabaseError(res, error, 'Error fetching contacts');
  }
});

// GET all routes (aggregated from offers)
app.get('/api/routes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        CONCAT(route_from, ' - ', route_to) as direction,
        COUNT(*) as order_count,
        AVG(price) as average_rate,
        MIN(price) as min_rate,
        MAX(price) as max_rate,
        array_agg(DISTINCT vehicle_type) as common_truck_types
      FROM offers 
      WHERE status = 'clean' AND route_from IS NOT NULL AND route_to IS NOT NULL
      GROUP BY route_from, route_to
      ORDER BY order_count DESC
    `);
    
    const routes = result.rows.map((row, index) => ({
      id: (index + 1).toString(),
      direction: row.direction,
      orderCount: parseInt(row.order_count) || 0,
      averageRate: Math.round(row.average_rate) || 0,
      minRate: Math.round(row.min_rate) || 0,
      maxRate: Math.round(row.max_rate) || 0,
      medianRate: Math.round(row.average_rate) || 0,
      priceChange: '+0%',
      commonTruckTypes: row.common_truck_types.filter(type => type != null),
      relatedContacts: []
    }));
    
    res.json(routes);
  } catch (error) {
    handleDatabaseError(res, error, 'Error fetching routes');
  }
});

// GET analytics
app.get('/api/analytics', async (req, res) => {
  try {
    // Total orders
    const totalOrdersResult = await pool.query('SELECT COUNT(*) as count FROM offers WHERE status = \'clean\'');
    const totalOrders = parseInt(totalOrdersResult.rows[0].count);
    
    // Active orders (recent)
    const activeOrdersResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM offers 
      WHERE status = 'clean' AND source_message_date > NOW() - INTERVAL '30 days'
    `);
    const activeOrders = parseInt(activeOrdersResult.rows[0].count);
    
    // Completed orders (older than 30 days)
    const completedOrders = totalOrders - activeOrders;
    
    // Average rate
    const avgRateResult = await pool.query('SELECT AVG(price) as avg FROM offers WHERE status = \'clean\' AND price IS NOT NULL');
    const averageRate = Math.round(avgRateResult.rows[0].avg) || 0;
    
    // Top routes
    const topRoutesResult = await pool.query(`
      SELECT 
        CONCAT(route_from, ' - ', route_to) as route,
        COUNT(*) as count,
        AVG(price) as avg_rate
      FROM offers 
      WHERE status = 'clean' AND route_from IS NOT NULL AND route_to IS NOT NULL
      GROUP BY route_from, route_to
      ORDER BY count DESC
      LIMIT 10
    `);
    
    const topRoutes = topRoutesResult.rows.map(row => ({
      route: row.route,
      count: parseInt(row.count),
      avgRate: Math.round(row.avg_rate)
    }));
    
    // Truck type statistics
    const truckTypesResult = await pool.query(`
      SELECT 
        vehicle_type as type,
        COUNT(*) as count
      FROM offers 
      WHERE status = 'clean' AND vehicle_type IS NOT NULL
      GROUP BY vehicle_type
      ORDER BY count DESC
    `);
    
    const totalOrdersWithTruckType = truckTypesResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
    
    const truckTypeStats = truckTypesResult.rows.map(row => ({
      type: row.type || 'unknown',
      count: parseInt(row.count),
      percentage: totalOrdersWithTruckType > 0 ? Math.round((parseInt(row.count) / totalOrdersWithTruckType) * 100) : 0
    }));
    
    // Monthly statistics
    const monthlyStatsResult = await pool.query(`
      SELECT 
        TO_CHAR(source_message_date, 'YYYY-MM') as month,
        COUNT(*) as orders,
        AVG(price) as avg_rate
      FROM offers 
      WHERE status = 'clean' AND source_message_date >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(source_message_date, 'YYYY-MM'), EXTRACT(MONTH FROM source_message_date)
      ORDER BY month
      LIMIT 6
    `);
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyStats = monthlyStatsResult.rows.map(row => {
      const [year, month] = row.month.split('-');
      return {
        month: monthNames[parseInt(month) - 1],
        orders: parseInt(row.orders),
        avgRate: Math.round(row.avg_rate)
      };
    });
    
    const analytics = {
      totalOrders,
      activeOrders,
      completedOrders,
      averageRate,
      topRoutes,
      truckTypeStats,
      monthlyStats
    };
    
    res.json(analytics);
  } catch (error) {
    handleDatabaseError(res, error, 'Error fetching analytics');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at:`);
  console.log(`  GET /api/orders`);
  console.log(`  GET /api/contacts`);
  console.log(`  GET /api/routes`);
  console.log(`  GET /api/analytics`);
  console.log(`  GET /api/health`);
});
