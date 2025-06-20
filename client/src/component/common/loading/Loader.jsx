import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'text-[8px]',
    medium: 'text-[14px]',
    large: 'text-[20px]'
  };

  return (
    <div className="flex items-center justify-center">
      <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className={`wheel-and-hamster ${sizeClasses[size]}`}>
        <div className="wheel"></div>
        <div className="hamster">
          <div className="hamster__body">
            <div className="hamster__head">
              <div className="hamster__ear"></div>
              <div className="hamster__eye"></div>
              <div className="hamster__nose"></div>
            </div>
            <div className="hamster__limb hamster__limb--fr"></div>
            <div className="hamster__limb hamster__limb--fl"></div>
            <div className="hamster__limb hamster__limb--br"></div>
            <div className="hamster__limb hamster__limb--bl"></div>
            <div className="hamster__tail"></div>
          </div>
        </div>
        <div className="spoke"></div>
      </div>
    </div>
  );
};

export default Loader; 