import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import routes from '../config/routes';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-semibold">
          <a href="/" className="hover:text-blue-300">MonLogo</a>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-6">
            {routes.map(route => (
              <li key={route.path}>
                <a href={route.path} className="hover:text-blue-300">{route.name}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Account */}
        <div className="relative">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Mon compte
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                  <a
                    href="/mon-espace"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Mon espace
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Se connecter
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;