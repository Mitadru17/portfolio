'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'

const CyberpunkNavbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navLinks = [
    { title: 'HOME', href: '#home', delay: 0.1 },
    { title: 'ABOUT', href: '#about', delay: 0.2 },
    { title: 'SKILLS', href: '#skills', delay: 0.3 },
    { title: 'PROJECTS', href: '#projects', delay: 0.4 },
    { title: 'CONTACT', href: '#contact', delay: 0.5 },
  ]

  const sidebarVariants = {
    closed: {
      opacity: 0,
      x: '-100%',
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  }

  return (
    <>
      {/* Desktop vertical navbar */}
      <nav className="fixed top-0 left-0 h-full z-50 hidden lg:flex">
        <div className={`h-full px-6 flex flex-col items-center justify-center ${scrolled ? 'bg-dark/30 backdrop-blur-md' : ''} transition-all duration-300`}>
          <div className="absolute top-10 left-0 w-px h-[30vh] bg-gradient-to-b from-transparent via-primary to-transparent"></div>
          <div className="absolute bottom-10 left-0 w-px h-[30vh] bg-gradient-to-t from-transparent via-primary to-transparent"></div>

          <div className="flex flex-col items-center space-y-16">
            {navLinks.map((link) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: link.delay }}
              >
                <Link href={link.href} className="vertical-text vertical-nav-link font-mono text-sm tracking-widest">
                  {link.title}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-6 left-6 z-50 text-white bg-surface/80 backdrop-blur-md p-3 rounded-full"
        aria-label="Toggle Menu"
      >
        {isOpen ? 
          <FiX size={24} className="text-primary" /> : 
          <FiMenu size={24} className="text-primary" />
        }
      </button>

      {/* Mobile Menu */}
      <motion.nav
        className="lg:hidden fixed inset-0 z-40 bg-dark/95 backdrop-blur-md"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
      >
        <div className="h-full flex flex-col items-center justify-center">
          <div className="relative z-10">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="my-8"
              >
                <Link
                  href={link.href}
                  onClick={toggleMenu}
                  className="text-2xl font-mono text-text-primary hover:text-primary transition-colors duration-300 tracking-wider"
                >
                  <span className="text-primary">// </span>{link.title}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.nav>
    </>
  )
}

export default CyberpunkNavbar 