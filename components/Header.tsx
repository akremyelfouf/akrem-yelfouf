import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          ملخص بحوث
        </h1>
      </div>
    </header>
  );
};

export default Header;