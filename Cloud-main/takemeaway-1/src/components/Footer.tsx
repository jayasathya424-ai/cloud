import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0b1d36] shadow-inner border-t-2 border-white mt-8">
      <div className="flex max-w-7xl justify-center items-center mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-8">
            <div className="text-gray-300 text-center text-xs ">
              &copy; {new Date().getFullYear()} TakeMeAway. All rights reserved.
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
