'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi'

const ContactSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitStatus, setSubmitStatus] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setSubmitMessage('Thank you! Your message has been sent successfully.')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitMessage('')
        setSubmitStatus('')
      }, 5000)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: <FiMail size={24} />,
      title: 'Email',
      info: 'youremail@example.com',
      link: 'mailto:youremail@example.com',
    },
    {
      icon: <FiPhone size={24} />,
      title: 'Phone',
      info: '+1 (123) 456-7890',
      link: 'tel:+11234567890',
    },
    {
      icon: <FiMapPin size={24} />,
      title: 'Location',
      info: 'San Francisco, CA',
      link: 'https://maps.google.com/?q=San+Francisco,+CA',
    },
  ]

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
            Get In Touch
            <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-accent"></span>
          </h2>
          <p className="text-text-secondary text-lg max-w-3xl">
            Have a project in mind or want to collaborate? Feel free to reach out using the form below
            or through my contact information.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-secondary p-8 rounded-lg shadow-lg h-full">
              <h3 className="text-2xl font-semibold text-text mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-accent mt-1 mr-4">{item.icon}</div>
                    <div>
                      <h4 className="text-text font-medium">{item.title}</h4>
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-text-secondary hover:text-accent transition-colors duration-300"
                      >
                        {item.info}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <h4 className="text-text font-medium mb-4">Follow Me</h4>
                <div className="flex space-x-4">
                  {/* Social media links would go here */}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-secondary p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-text mb-6">Send Me a Message</h3>
              
              {submitMessage && (
                <div className={`p-4 rounded-md mb-6 ${submitStatus === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                  {submitMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-text-secondary mb-2">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-primary border border-primary/50 rounded-md py-3 px-4 text-text focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-text-secondary mb-2">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-primary border border-primary/50 rounded-md py-3 px-4 text-text focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-text-secondary mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-primary border border-primary/50 rounded-md py-3 px-4 text-text focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-text-secondary mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="w-full bg-primary border border-primary/50 rounded-md py-3 px-4 text-text focus:outline-none focus:border-accent resize-none"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300 inline-flex items-center"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>
                      Send Message <FiSend className="ml-2" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection 