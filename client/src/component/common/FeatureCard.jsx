import React from 'react';

const FeatureCard = ({ icon, title, description, iconBgColor }) => {
  return (
    <div className="card flex flex-col items-center text-center p-8 transition-all duration-300 hover:scale-105">
      <div 
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md`}
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard; 