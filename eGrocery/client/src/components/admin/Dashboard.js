import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiShoppingCart, FiUsers, FiPackage, FiTrendingUp, FiDollarSign, FiAlertTriangle } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: []
  });
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        axios.get('/orders', config),
        axios.get('/products', config),
        axios.get('/users', config)
      ]);

      const orders = ordersRes.data.data || [];
      const products = productsRes.data.data || [];
      const users = usersRes.data.data || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const lowStockProducts = products.filter(product => product.stock <= 5);

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        totalRevenue,
        recentOrders: orders.slice(0, 5),
        lowStockProducts
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={FiShoppingCart}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={FiPackage}
          color="bg-green-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={FiDollarSign}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No orders found</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">{order.user?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${order.total?.toFixed(2)}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiAlertTriangle className="text-red-500 mr-2" />
            Low Stock Alert
          </h2>
          <div className="space-y-4">
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">All products are well stocked</p>
            ) : (
              stats.lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div className="flex items-center">
                    <img
                      src={product.primaryImage || 'https://via.placeholder.com/40x40?text=Product'}
                      alt={product.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Low Stock
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
