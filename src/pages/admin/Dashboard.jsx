import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold">24</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-gray-500">Customers</p>
                <p className="text-2xl font-semibold">89</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-gray-500">Revenue</p>
                <p className="text-2xl font-semibold">$4,289</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/products" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
            <p className="text-gray-600">Add, edit, or remove products from your store</p>
          </Link>
          
          <Link to="/admin/orders" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
            <p className="text-gray-600">View and manage customer orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;