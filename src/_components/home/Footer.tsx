'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { BsFillPinMapFill } from 'react-icons/bs';
import { FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Footer() {
  const [openCard, setOpenCard] = useState<number | null>(null);

  const toggleCard = (index: number) => {
    setOpenCard(openCard === index ? null : index);
  };

  const collapseVariants = {
    open: { opacity: 1, height: 'auto' },
    closed: { opacity: 0, height: 0, overflow: 'hidden' }
  };

  const sectionHeaders = [
    { icon: <FiShoppingBag className="text-green-500" />, label: "About Us" },
    { icon: <BsFillPinMapFill className="text-green-500" />, label: "Useful Links" },
    { icon: <FaEnvelope className="text-green-500" />, label: "Become a Seller" }
  ];

  return (
    <footer className="bg-gray-100 text-gray-800 dark:bg-[#0e1f33] dark:text-white py-10 px-6 transition-colors duration-300">
      {/* Newsletter */}
      <div className="mb-12">
        <div className="bg-white dark:bg-[#112b45] border border-gray-300 dark:border-gray-700 rounded-2xl px-6 py-8 shadow-xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6">
          <h2 className="text-xl sm:text-2xl font-bold dark:text-white">
            Subscribe to <span className="text-green-500">Newsletter</span>
          </h2>
          <form className="flex w-full sm:w-auto items-center rounded-full overflow-hidden bg-gray-200 dark:bg-white shadow-md">
            <input
              type="email"
              placeholder="Enter your email …"
              className="flex-1 px-4 py-2 text-sm text-gray-700 outline-none"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-5 py-2 text-sm font-semibold flex items-center hover:bg-green-600 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Grid with cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {sectionHeaders.map((header, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#132b45]/80 rounded-2xl p-6 shadow-lg border border-gray-300 dark:border-gray-700 hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300"
          >
            <button
              className="md:hidden w-full text-left text-lg font-semibold mb-4"
              onClick={() => toggleCard(index)}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {header.icon}
                  <span className="text-green-500">{header.label}</span>
                </span>
                <span>{openCard === index ? '−' : '+'}</span>
              </div>
            </button>

            {/* Desktop Content */}
            <div className="hidden md:block">
              {index === 0 && (
                <>
                  <div className="flex items-center space-x-3 mb-4">
                    <FiShoppingBag className="text-green-500 text-3xl" />
                    <h2 className="text-2xl font-bold text-green-500">
                      HAMRO<span className="text-gray-800 dark:text-white">MART</span>
                    </h2>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                    “Be who you are and say what you feel, because those who mind don't matter, and those who matter don't mind.”
                  </p>
                  <div className="flex space-x-3 mt-5">
                    <a href="#" className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full hover:scale-110 transition transform duration-300 animate-bounce delay-100"><FaFacebookF /></a>
                    <a href="#" className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full hover:scale-110 transition transform duration-300 animate-bounce delay-200"><FaTwitter /></a>
                    <a href="#" className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full hover:scale-110 transition transform duration-300 animate-bounce delay-300"><FaInstagram /></a>
                  </div>
                </>
              )}
              {index === 1 && (
                <>
                  <h3 className="text-xl font-semibold mb-4 border-b border-gray-400 dark:border-gray-600 w-fit pb-1">Useful Links</h3>
                  <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2"><BsFillPinMapFill className="text-green-500" /> Help Center</li>
                    <li className="flex items-center gap-2"><BsFillPinMapFill className="text-green-500" /> Terms & Conditions</li>
                    <li className="flex items-center gap-2"><BsFillPinMapFill className="text-green-500" /> Privacy Policy</li>
                    <li className="flex items-center gap-2"><BsFillPinMapFill className="text-green-500" /> Refund Policy</li>
                    <li className="flex items-center gap-2"><FaPhoneAlt className="text-green-500" /> +977 9814149723</li>
                    <li className="flex items-center gap-2"><FaEnvelope className="text-green-500" /> info@hamromart.com</li>
                  </ul>
                </>
              )}
              {index === 2 && (
                <>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                    Interested in a Great Way<br />
                    <span className="text-green-500">Make Money?</span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                    A supermarket is a self-service shop offering a wide variety of food, beverages and household products.
                  </p>
                  <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-full transition">
                    Become a Seller
                  </button>
                </>
              )}
            </div>

            {/* Mobile content with animation */}
            <AnimatePresence initial={false}>
              {openCard === index && (
                <motion.div
                  key="content-mobile"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={collapseVariants}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="md:hidden"
                >
                  {index === 0 && (
                    <>
                      <div className="flex items-center space-x-3 mb-4">
                        <FiShoppingBag className="text-green-500 text-3xl" />
                        <h2 className="text-2xl font-bold text-green-500">
                          HAMRO<span className="text-gray-800 dark:text-white">MART</span>
                        </h2>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                        “Be who you are and say what you feel, because those who mind don't matter, and those who matter don't mind.”
                      </p>
                      <div className="flex space-x-3 mt-5">
                        <a href="#" className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full hover:scale-110 transition transform duration-300 animate-bounce delay-100"><FaFacebookF /></a>
                        <a href="#" className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full hover:scale-110 transition transform duration-300 animate-bounce delay-200"><FaTwitter /></a>
                        <a href="#" className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full hover:scale-110 transition transform duration-300 animate-bounce delay-300"><FaInstagram /></a>
                      </div>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <h3 className="text-xl font-semibold mb-4 border-b border-gray-400 dark:border-gray-600 w-fit pb-1">Useful Links</h3>
                      <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-center gap-2"><BsFillPinMapFill className="text-green-500" /> Help Center</li>
                        <li className="flex items-center gap-2"><BsFillPinMapFill className="text-green-500" /> Terms & Conditions</li>
                        <li className="flex items-center gap-2"><BsFillPinMapFill className="text-green-500" /> Privacy Policy</li>
                        <li className="flex items-center gap-2"><BsFillPinMapFill className="text-green-500" /> Refund Policy</li>
                        <li className="flex items-center gap-2"><FaPhoneAlt className="text-green-500" /> +977 9814149723</li>
                        <li className="flex items-center gap-2"><FaEnvelope className="text-green-500" /> info@hamromart.com</li>
                      </ul>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                        Interested in a Great Way<br />
                        <span className="text-green-500">Make Money?</span>
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
                        A supermarket is a self-service shop offering a wide variety of food, beverages and household products.
                      </p>
                      <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-full transition">
                        Become a Seller
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400 max-w-7xl mx-auto">
        <p>Made with ❤️ by hamrotheme. Copyright © 2025 Hamro Theme.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Image
            src=""
            alt="Visa Electron"
            width={100}
            height={24}
            className="h-6 w-auto"
          />
        </div>
      </div>
    </footer>
  );
}
