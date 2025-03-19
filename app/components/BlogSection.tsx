'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi'
import Link from 'next/link'

const BlogSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const blogPosts = [
    {
      id: 1,
      title: 'How to Build a Modern Portfolio with Next.js',
      excerpt:
        'Learn how to create a sleek, responsive portfolio website using Next.js and Tailwind CSS.',
      date: 'March 15, 2023',
      author: 'Your Name',
      category: 'Web Development',
      image: '/blog1.jpg',
      slug: 'how-to-build-portfolio-nextjs',
    },
    {
      id: 2,
      title: 'The Future of Web Development in 2023',
      excerpt:
        'Exploring upcoming trends and technologies that will shape web development in the coming year.',
      date: 'February 28, 2023',
      author: 'Your Name',
      category: 'Tech Trends',
      image: '/blog2.jpg',
      slug: 'future-web-development-2023',
    },
    {
      id: 3,
      title: 'Optimizing Performance in React Applications',
      excerpt:
        'Practical tips and techniques to improve the performance of your React.js applications.',
      date: 'January 18, 2023',
      author: 'Your Name',
      category: 'React',
      image: '/blog3.jpg',
      slug: 'optimizing-performance-react',
    },
  ]

  return (
    <section className="section-padding bg-secondary" ref={ref}>
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-6 inline-block relative">
            Latest Blog Posts
            <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-accent"></span>
          </h2>
          <p className="text-text-secondary text-lg max-w-3xl">
            Insights, tutorials, and thoughts on web development, design, and technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-primary rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="h-48 bg-gray-300 relative">
                <div className="absolute bottom-0 left-0 bg-accent text-white text-xs py-1 px-3">
                  {post.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-text-secondary text-sm mb-3">
                  <FiCalendar className="mr-2" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <FiUser className="mr-2" />
                  <span>{post.author}</span>
                </div>

                <h3 className="text-xl font-semibold text-text mb-3">{post.title}</h3>
                <p className="text-text-secondary mb-4">{post.excerpt}</p>

                <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-accent hover:text-accent/80 transition-colors">
                  Read More <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <Link href="/blog" className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300">
            View All Posts
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default BlogSection 