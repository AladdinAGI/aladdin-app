'use client';

import { useEffect, useState } from 'react';

export default function ComingSoon() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple animation on mount
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-white px-4">
      <div
        className={`max-w-2xl w-full bg-gradient-to-br from-blue-900 to-purple-900 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20 transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-4">
            Coming Soon
          </h1>

          <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto my-8 rounded-full"></div>

          <p className="text-l  mb-12 max-w-2xl mx-auto text-gray-200">
            We&apos;re working hard to bring you an amazing experience.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:translate-y-1 transition duration-300 w-full md:w-auto">
              Notify Me
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white font-semibold py-3 px-8 rounded-full border border-white/20 hover:bg-white/20 transition duration-300 w-full md:w-auto">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="fixed top-20 left-10 w-20 h-20 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 rounded-full bg-purple-500/20 blur-xl animate-pulse"></div>
      <div className="fixed top-1/3 right-1/4 w-16 h-16 rounded-full bg-pink-500/20 blur-xl animate-pulse"></div>

      {/* Additional decoration */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white/10 animate-ping opacity-20"></div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/5 animate-ping opacity-20"
        style={{ animationDelay: '0.5s' }}
      ></div>
    </div>
  );
}
