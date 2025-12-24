
import React from 'react';

const Header: React.FC = () => (
  <header className="bg-white shadow-md no-print">
    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Seal_of_Tamil_Nadu.svg/1200px-Seal_of_Tamil_Nadu.svg.png" alt="TamilNadu Logo" className="h-16 w-auto mx-auto mb-2"/>
      <h1 className="text-xl md:text-3xl font-bold text-blue-800">
        புரட்சித் தலைவர் எம்.ஜி.ஆர் சத்துணவுத் திட்டம்
      </h1>
      <p className="text-md md:text-lg text-slate-600 mt-1">
        உணவுப் பொருள் வரவு செலவு இருப்புப் பதிவேடு (ஒரு பள்ளி)
      </p>
    </div>
  </header>
);

export default Header;
