// About.js
import React from "react";
import ICON from "../assets/icon.jpg";
import { Github, Linkedin, Instagram ,  Mail  } from "lucide-react";

export default function About() {
  return (
    <div className="flex items-center justify-center h-screen w-full md:w-3/4 md:fixed md:right-0 px-4">
      <div className="flex flex-col items-center text-center space-y-4 main">
        
        {/* App Icon */}
        <img
          className="w-32 h-32 rounded-full shadow-lg border-2 border-gray-700 object-cover"
          src={ICON}
          alt="App Icon"
        />

        {/* Title */}
        <h1 className="about-tit">About SmartScroll</h1>

        {/* Description */}
        <p className="text-blue-400 max-w-md leading-relaxed">
          SmartScroll is an awesome app that lets you browse content smoothly and effortlessly.
          Built with ❤️ using React and deployed on Render.
        </p>

        {/* Version */}
        <p className="text-gray-300">Version: 1.0.0</p>

        {/* Contact Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-white mb-3">Contacts</h2>

          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center justify-center gap-3">
              <Github className="w-6 h-6 hover:text-gray-400 transition" />
              <a
                href="https://github.com/Sibi-2006"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                GitHub
              </a>
            </li>

            <li className="flex items-center justify-center gap-3">
              <Linkedin className="w-6 h-6 hover:text-blue-500 transition" />
              <a
                href="https://www.linkedin.com/in/sibiraj-r-147936336?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                LinkedIn
              </a>
            </li>

            <li className="flex items-center justify-center gap-3">
              <Instagram className="w-6 h-6 hover:text-pink-500 transition" />
              <a
                href="https://www.instagram.com/_mr._.cb_?utm_source=qr&igsh=MWc1ZXQyZ3NpYXpyZQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Instagram
              </a>
            </li>

            <li className="flex items-center justify-center gap-3">
              <Mail className="w-6 h-6 hover:text-red-400 transition" />
              <a
                href="mailto:sibirajr0709@gmail.com"
                className="hover:underline"
              >
                sibirajr0709@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
