import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { items } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Store className="h-6 w-6" />
          <span className="text-xl font-bold">EcoStore</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/products" className="hover:text-gray-300">Products</Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="hover:text-gray-300">
                <User className="h-6 w-6" />
              </Link>
              <button onClick={handleLogout} className="hover:text-gray-300">
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <Link to="/admin/login" className="hover:text-gray-300">
              <User className="h-6 w-6" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;