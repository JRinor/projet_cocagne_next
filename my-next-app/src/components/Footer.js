import routes from '../config/routes';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex justify-between">
        {/* Footer Links */}
        <div className="space-x-6">
          {routes.map(route => (
            <a key={route.path} href={route.path} className="hover:text-blue-300">{route.name}</a>
          ))}
        </div>

        {/* Social Media Links */}
        <div className="space-x-6">
          <a href="https://facebook.com" className="hover:text-blue-300">Facebook</a>
          <a href="https://twitter.com" className="hover:text-blue-300">Twitter</a>
          <a href="https://instagram.com" className="hover:text-blue-300">Instagram</a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-4">
        <p>&copy; 2025 Mon Projet. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;