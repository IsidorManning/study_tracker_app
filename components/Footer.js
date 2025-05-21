import React from 'react';

const Footer = () => {
  return (
    <footer className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Large STYDIS text */}
      <div className="flex inset-0 flex w-screen flex-col md:flex-row items-center justify-center">
        <h1 className="text-[20vw] tracking-widest font-black text-pink select-none">
          STYDIS
        </h1>
        <div className="mr-2 text-white text-sm">
          © 2025 Stydis. 
        </div>
      </div>
      
      {/* Copyright text */}

    </footer>
  );
};

export default Footer;