'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowDown } from 'react-icons/fi'

const HeroSection = () => {
  const roles = ['Software Developer', 'Web Designer', 'UI/UX Enthusiast', 'Problem Solver']

  return (
    <section className="relative h-screen flex items-center justify-center section-padding bg-gradient-to-b from-primary to-secondary">
      <div className="container-width text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text mb-4">
            Hi, I&apos;m <span className="text-accent">Your Name</span>
          </h1>
          
          <div className="h-16 md:h-20 mb-6 overflow-hidden">
            <div className="relative h-full whitespace-nowrap inline-flex flex-col animate-text-slide">
              {roles.map((role, index) => (
                <div key={index} className="text-xl md:text-3xl lg:text-4xl text-text-secondary font-light h-1/4 flex items-center justify-center">
                  {role}
                </div>
              ))}
              {/* Duplicate the first item to make the animation loop seamlessly */}
              <div className="text-xl md:text-3xl lg:text-4xl text-text-secondary font-light h-1/4 flex items-center justify-center">
                {roles[0]}
              </div>
            </div>
          </div>
          
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            A passionate developer who loves creating beautiful and functional websites. 
            I specialize in modern web technologies that deliver exceptional user experiences.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link href="#projects" className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300">
              View Projects
            </Link>
            <Link href="#contact" className="border border-accent text-accent hover:bg-accent/10 font-medium py-3 px-8 rounded-md transition-colors duration-300">
              Contact Me
            </Link>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 w-full flex justify-center animate-bounce">
        <Link href="#about" className="text-text-secondary hover:text-accent transition-colors duration-300">
          <FiArrowDown size={30} />
        </Link>
      </div>
    </section>
  )
}

export default HeroSection 