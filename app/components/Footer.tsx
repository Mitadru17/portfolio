'use client'

import React from 'react'
import Link from 'next/link'
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  const navLinks = [
    { title: 'Home', href: '#home' },
    { title: 'About', href: '#about' },
    { title: 'Projects', href: '#projects' },
    { title: 'Blog', href: '#blog' },
    { title: 'Contact', href: '#contact' },
  ]

  const socialLinks = [
    { icon: <FiGithub size={20} />, href: 'https://github.com/', label: 'GitHub' },
    { icon: <FiLinkedin size={20} />, href: 'https://linkedin.com/', label: 'LinkedIn' },
    { icon: <FiTwitter size={20} />, href: 'https://twitter.com/', label: 'Twitter' },
    { icon: <FiInstagram size={20} />, href: 'https://instagram.com/', label: 'Instagram' },
  ]

  return (
    <footer className="bg-secondary text-text-secondary">
      <div className="container-width py-16 px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link href="#home" className="text-text text-xl font-bold mb-4 block">
              <span className="text-accent">Portfolio</span>
            </Link>
            <p className="mb-6">
              A passionate web developer creating beautiful and functional websites
              with modern technologies.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent transition-colors duration-300"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-text font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-accent transition-colors duration-300"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-text font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-text-secondary hover:text-accent transition-colors duration-300">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="#" className="text-text-secondary hover:text-accent transition-colors duration-300">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link href="#" className="text-text-secondary hover:text-accent transition-colors duration-300">
                  Backend Development
                </Link>
              </li>
              <li>
                <Link href="#" className="text-text-secondary hover:text-accent transition-colors duration-300">
                  Mobile Development
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-text font-semibold text-lg mb-4">Newsletter</h3>
            <p className="mb-4">
              Subscribe to receive updates on new projects and blog posts.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-primary px-4 py-2 rounded-l-md focus:outline-none w-full"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-r-md transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="border-t border-primary/30">
        <div className="container-width py-6 px-6 mx-auto text-center">
          <p>
            &copy; {currentYear} Your Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 