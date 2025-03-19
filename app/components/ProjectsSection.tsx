'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiExternalLink, FiGithub } from 'react-icons/fi'

const ProjectsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [filter, setFilter] = useState('all')

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Website',
      description: 'A full-stack e-commerce platform with payment processing and admin dashboard.',
      image: '/project1.jpg',
      tags: ['react', 'node', 'mongodb'],
      liveLink: '#',
      githubLink: 'https://github.com/Mitadru17/UpFeet',
      category: 'web',
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A productivity app to manage tasks and track progress with a clean UI.',
      image: '/project2.jpg',
      tags: ['react', 'firebase', 'tailwind'],
      liveLink: '#',
      githubLink: 'https://github.com/Mitadru17/Green-Grow-Tech',
      category: 'mobile',
    },
    {
      id: 3,
      title: 'Portfolio Website',
      description: 'A sleek dark-themed portfolio website built with Next.js and Tailwind CSS.',
      image: '/project3.jpg',
      tags: ['nextjs', 'typescript', 'tailwind'],
      liveLink: '#',
      githubLink: 'https://github.com/Mitadru17/Swiggy-Clone-',
      category: 'web',
    },
    {
      id: 4,
      title: 'Weather App',
      description: 'A weather application that provides real-time forecasts based on location.',
      image: '/project4.jpg',
      tags: ['react', 'api', 'css'],
      liveLink: '#',
      githubLink: 'https://github.com/Mitadru17/Myntra-Clone-',
      category: 'mobile',
    },
    {
      id: 5,
      title: 'Blog Platform',
      description: 'A content management system for creating and managing blog posts.',
      image: '/project5.jpg',
      tags: ['nextjs', 'mongodb', 'tailwind'],
      liveLink: '#',
      githubLink: 'https://github.com/Mitadru17/Spotify-clone-',
      category: 'web',
    },
    {
      id: 6,
      title: 'Chat Application',
      description: 'Real-time chat application with private messaging and group chats.',
      image: '/project6.jpg',
      tags: ['react', 'socket.io', 'express'],
      liveLink: '#',
      githubLink: '#',
      category: 'web',
    },
  ]

  const filteredProjects = 
    filter === 'all' 
      ? projects 
      : projects.filter(project => project.category === filter)

  return (
    <section className="section-padding bg-primary" ref={ref}>
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-6 inline-block relative">
            My Projects
            <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-accent"></span>
          </h2>
          <p className="text-text-secondary text-lg max-w-3xl">
            Here are some of my recent projects. Each project represents a unique challenge
            and solution, showcasing different skills and technologies.
          </p>
        </motion.div>

        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                filter === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-secondary text-text-secondary hover:bg-secondary/80'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('web')}
              className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                filter === 'web'
                  ? 'bg-accent text-white'
                  : 'bg-secondary text-text-secondary hover:bg-secondary/80'
              }`}
            >
              Web
            </button>
            <button
              onClick={() => setFilter('mobile')}
              className={`px-4 py-2 rounded-md transition-colors duration-300 ${
                filter === 'mobile'
                  ? 'bg-accent text-white'
                  : 'bg-secondary text-text-secondary hover:bg-secondary/80'
              }`}
            >
              Mobile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-secondary rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="h-48 bg-gray-300 relative">
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-4">
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white bg-accent p-2 rounded-full hover:bg-accent/80 transition-colors duration-300"
                    >
                      <FiExternalLink size={20} />
                    </a>
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white bg-primary p-2 rounded-full hover:bg-primary/80 transition-colors duration-300"
                    >
                      <FiGithub size={20} />
                    </a>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-text mb-2">{project.title}</h3>
                <p className="text-text-secondary mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs bg-primary/50 text-text-secondary py-1 px-2 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection 