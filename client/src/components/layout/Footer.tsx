import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-100 py-6 text-center text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} ShopSync Microservices Client. Built for backend endpoint verification.</p>
      </div>
    </footer>
  );
};

export default Footer;
