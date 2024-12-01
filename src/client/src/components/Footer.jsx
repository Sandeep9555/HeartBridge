import React from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer bg-gray-200 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Social Media Section */}
        <div className="social-media flex space-x-6 mb-4 md:mb-0">
          <a
            href="#"
            aria-label="Facebook"
            className="text-gray-700 hover:text-blue-500"
          >
            <FaFacebook size={30} />
          </a>
          <a
            href="https://www.instagram.com/"
            aria-label="Instagram"
            className="text-gray-700 hover:text-pink-500"
          >
            <FaInstagram size={30} />
          </a>
          <a
            href="https://www.youtube.com/"
            aria-label="YouTube"
            className="text-gray-700 hover:text-red-500"
          >
            <FaYoutube size={30} />
          </a>
          <a
            href="mailto:sandeepsingg6392@gmail.com"
            aria-label="Email"
            className="text-gray-700 hover:text-green-500"
          >
            <FaEnvelope size={30} />
          </a>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter">
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              aria-label="Email for newsletter"
              className="px-4 py-2 rounded-l-md border border-gray-300 focus:ring focus:ring-blue-300"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-700 mt-4">
        <p>&copy; 2024 HeartBridge. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
