'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCode, FiLayout, FiDatabase, FiSmartphone } from 'react-icons/fi'

const AboutSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const skills = [
    { name: 'HTML/CSS', level: 90 },
    { name: 'JavaScript', level: 85 },
    { name: 'React', level: 80 },
    { name: 'Node.js', level: 75 },
    { name: 'TypeScript', level: 70 },
    { name: 'Python', level: 65 },
  ]

  const services = [
    {
      icon: <FiCode size={30} />,
      title: 'Web Development',
      description: 'Building responsive and performant websites and web applications using modern technologies.',
    },
    {
      icon: <FiLayout size={30} />,
      title: 'UI/UX Design',
      description: 'Creating intuitive and beautiful user interfaces with a focus on user experience.',
    },
    {
      icon: <FiDatabase size={30} />,
      title: 'Backend Development',
      description: 'Developing robust backend systems and APIs to power your applications.',
    },
    {
      icon: <FiSmartphone size={30} />,
      title: 'Mobile Development',
      description: 'Building cross-platform mobile applications using React Native.',
    },
  ]

  return (
    <section className="section-padding bg-secondary" ref={ref}>
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-6 inline-block relative">
            About Me
            <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-accent"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <p className="text-text-secondary text-lg mb-6">
                I&apos;m a passionate web developer with over 5 years of experience in creating
                beautiful, functional, and user-centered digital experiences. I enjoy
                turning complex problems into simple, elegant solutions.
              </p>
              <p className="text-text-secondary text-lg mb-6">
                My goal is to build products that are not just visually appealing but also
                practical and efficient. I constantly keep up with the latest trends and
                technologies to deliver cutting-edge solutions.
              </p>
              <p className="text-text-secondary text-lg">
                When I&apos;m not coding, you&apos;ll find me exploring new technologies,
                contributing to open-source projects, or enjoying outdoor activities.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-text mb-4">My Skills</h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-text">{skill.name}</span>
                      <span className="text-text-secondary">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-primary/50 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className="bg-accent h-2 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-2xl font-bold text-text mb-10 inline-block relative">
            Services I Offer
            <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-accent"></span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-primary p-6 rounded-lg shadow-lg"
              >
                <div className="text-accent mb-4">{service.icon}</div>
                <h4 className="text-xl font-semibold text-text mb-2">{service.title}</h4>
                <p className="text-text-secondary">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection 