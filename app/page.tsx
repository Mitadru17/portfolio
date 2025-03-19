'use client'

import React, { useState, useEffect, Suspense, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import CyberpunkNavbar from './components/CyberpunkNavbar'
import VoiceNavigation from './components/VoiceNavigation'
import dynamic from 'next/dynamic'
import SpotifyBackgroundPlayer from './components/SpotifyBackgroundPlayer'

// Dynamic import the 3D component with no SSR to avoid hydration issues
const CyberpunkHero = dynamic(() => import('./components/CyberpunkHero'), {
  ssr: false,
  loading: () => (
    <section id="home" className="min-h-screen flex items-center justify-center relative">
      <div className="font-mono text-primary text-xl">
        <span className="inline-block animate-pulse">[</span> Loading... <span className="inline-block animate-pulse">]</span>
      </div>
    </section>
  )
})

// Add the GitHub repository modal component and repository types right before the DraggableSkillNode definition
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  created_at: string;
  homepage: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

// GitHub repo modal component
const GitHubRepoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  repoUrl: string;
  projectName: string;
  demoUrl: string;
}> = ({ isOpen, onClose, repoUrl, projectName, demoUrl }) => {
  const [repo, setRepo] = useState<GitHubRepo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Convert GitHub URL to API URL
  // Example: https://github.com/username/repo -> https://api.github.com/repos/username/repo
  const getApiUrlFromGitHubUrl = (url: string) => {
    try {
      const urlParts = url.replace('https://github.com/', '').split('/');
      const username = urlParts[0];
      const repoName = urlParts[1];
      return `https://api.github.com/repos/${username}/${repoName}`;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchRepoData = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiUrl = getApiUrlFromGitHubUrl(repoUrl);

        if (!apiUrl) {
          throw new Error('Invalid GitHub URL');
        }

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        setRepo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch repository data');
        console.error('Error fetching GitHub repo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoData();
  }, [isOpen, repoUrl]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        ref={modalRef}
        className="bg-surface border-2 border-primary/50 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {/* Header */}
        <div className="border-b border-primary/30 p-4 flex justify-between items-center bg-dark/80">
          <h3 className="font-mono text-xl text-primary flex items-center">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </span>
            {projectName}
          </h3>
          <motion.button
            className="text-primary hover:text-white"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="font-mono text-primary text-xl">
                <span className="inline-block animate-pulse">[</span> Loading Repository Data... <span className="inline-block animate-pulse">]</span>
              </div>
              <motion.div
                className="mt-4 w-12 h-12 border-t-2 border-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-red-500 font-mono">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {error}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-primary/20 border border-primary text-primary hover:bg-primary/30"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          )}

          {!loading && !error && repo && (
            <div className="space-y-6">
              {/* Repository Header Info */}
              <div>
                <motion.a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-bold text-primary hover:underline inline-flex items-center"
                  whileHover={{ x: 5 }}
                >
                  {repo.name}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </motion.a>
                <div className="text-text-secondary mt-1 flex items-center text-sm">
                  <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-5 h-5 rounded-full mr-2" />
                  {repo.owner.login}
                </div>
              </div>

              {/* Description */}
              {repo.description && (
                <div>
                  <h4 className="text-md font-mono text-primary mb-2">Description</h4>
                  <p className="text-text-secondary">{repo.description}</p>
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-yellow-400">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{repo.stargazers_count} stars</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-400">
                    <path d="M7 18l6-6-6-6"></path>
                    <path d="M17 6v12"></path>
                  </svg>
                  <span>{repo.forks_count} forks</span>
                </div>
                {repo.language && (
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-primary mr-2"></span>
                    <span>{repo.language}</span>
                  </div>
                )}
              </div>

              {/* Topics/Tags */}
              {repo.topics && repo.topics.length > 0 && (
                <div>
                  <h4 className="text-md font-mono text-primary mb-2">Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {repo.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="tech-tag"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="text-xs font-mono text-primary mb-1">Created</h4>
                  <p className="text-text-secondary">{formatDate(repo.created_at)}</p>
                </div>
                <div>
                  <h4 className="text-xs font-mono text-primary mb-1">Last Updated</h4>
                  <p className="text-text-secondary">{formatDate(repo.updated_at)}</p>
                </div>
              </div>

              {/* Homepage link if available */}
              {(repo.homepage || demoUrl) && (
                <div>
                  <h4 className="text-md font-mono text-primary mb-2">Live Demo</h4>
                  <motion.a
                    href={demoUrl || repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                    whileHover={{ x: 5 }}
                  >
                    Visit Project
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </motion.a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with action buttons */}
        {!loading && !error && repo && (
          <div className="border-t border-primary/30 p-4 flex justify-between bg-dark/80">
            <div className="flex gap-3">
              <motion.a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="cyberpunk-button text-sm py-2 px-4 flex items-center"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(255,41,87,0.6)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                View on GitHub
              </motion.a>

              {demoUrl && (
                <motion.a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyberpunk-button text-sm py-2 px-4 flex items-center"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(255,41,87,0.6)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Live Demo
                </motion.a>
              )}
            </div>

            <motion.button
              onClick={onClose}
              className="border border-primary/50 bg-transparent text-primary hover:bg-primary/20 text-sm py-2 px-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const ExpertiseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  color: string;
  skills: string[];
  details: {
    experience: string;
    tools: string[];
    projects: string[];
    achievements: string[];
  };
}> = ({ isOpen, onClose, title, color, skills, details }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modalRef}
        className="bg-surface border-2 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        style={{ borderColor: `${color}50` }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center bg-dark/80" style={{ borderBottomColor: `${color}30`, borderBottomWidth: '1px' }}>
          <h3 className="font-mono text-xl flex items-center" style={{ color }}>
            <span className="mr-2">
              {title === "Frontend" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              )}
              {title === "Backend" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
              )}
              {title === "Others" && (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              )}
            </span>
            {title} Expertise
          </h3>
          <motion.button
            className="hover:text-white"
            style={{ color }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Skills section */}
            <div>
              <h4 className="text-md font-mono mb-3" style={{ color }}>Core Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span
                    key={i}
                    className="tech-tag"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    style={{ backgroundColor: `${color}20`, borderColor: `${color}50` }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Experience section */}
            <div>
              <h4 className="text-md font-mono mb-3" style={{ color }}>Experience</h4>
              <p className="text-text-secondary">{details.experience}</p>
            </div>

            {/* Tools & Technologies */}
            <div>
              <h4 className="text-md font-mono mb-3" style={{ color }}>Tools & Technologies</h4>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {details.tools.map((tool, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <motion.span
                      style={{ color }}
                      className="mr-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                    >
                      •
                    </motion.span>
                    <span>{tool}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Projects section */}
            <div>
              <h4 className="text-md font-mono mb-3" style={{ color }}>Related Projects</h4>
              <ul className="space-y-2">
                {details.projects.map((project, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                  >
                    <motion.span
                      style={{ color }}
                      className="mr-2"
                    >
                      →
                    </motion.span>
                    <span>{project}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Achievements & Certifications */}
            <div>
              <h4 className="text-md font-mono mb-3" style={{ color }}>Achievements & Certifications</h4>
              <ul className="space-y-2">
                {details.achievements.map((achievement, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                  >
                    <motion.span
                      style={{ color }}
                      className="mr-2"
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    >
                      🏆
                    </motion.span>
                    <span>{achievement}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer with action buttons */}
        <div className="p-4 flex justify-end bg-dark/80" style={{ borderTopColor: `${color}30`, borderTopWidth: '1px' }}>
          <motion.button
            onClick={onClose}
            className="border bg-transparent text-sm py-2 px-4"
            style={{ borderColor: `${color}50`, color }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 15px ${color}60`
            }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const shouldReduceMotion = useReducedMotion()
  const [isLoaded, setIsLoaded] = useState(false)
  // Add new state for GitHub repo modal
  const [selectedRepo, setSelectedRepo] = useState<{ url: string; name: string; demoUrl: string } | null>(null);
  // Add new state for expertise modal
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);

  // Define expertise data
  const expertiseData = {
    "Frontend": {
      color: "#ff2957",
      skills: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Framer Motion"],
      details: {
        experience: "I specialize in building dynamic, responsive, and accessible web applications using modern frameworks. I focus on creating intuitive user interfaces with clean architecture and optimized performance while continuously learning new frontend technologies.",
        tools: [
          "React & React Native",
          "Next.js & Vercel",
          "TypeScript & JavaScript",
          "Tailwind CSS",
          "Framer Motion",
          "Redux & Context API",
          "Jest & React Testing Library",
          "Webpack & Vite",
          "Storybook",
          "Figma & Adobe XD"
        ],
        projects: [
          "Myntra Clone - E-commerce platform with responsive design",
          "Spotify Clone - Music streaming app with dynamic UI",
          "Portfolio Website - Interactive showcase with animations",
          "UpFeet - Modern e-commerce experience"
        ],
        achievements: [
          "Completed multiple frontend projects with exceptional user experiences",
          "Implemented performance optimization techniques for faster loading times",
          "Designed responsive layouts that work seamlessly across all devices",
          "Developed reusable component libraries for efficient development"
        ]
      }
    },
    "Backend": {
      color: "#08f7fe",
      skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "GraphQL", "REST API", "Authentication", "Cloud Services"],
      details: {
        experience: "My backend development focus is on creating robust, scalable server-side applications and APIs. I design efficient database schemas, implement secure authentication systems, and ensure optimal performance for my applications.",
        tools: [
          "Node.js & Express",
          "MongoDB & Mongoose",
          "PostgreSQL & Sequelize",
          "GraphQL & Apollo",
          "REST API Design",
          "JWT Authentication",
          "Redis Caching",
          "Docker & Kubernetes",
          "AWS & Azure Services",
          "Serverless Functions"
        ],
        projects: [
          "Swiggy Clone - Food delivery service with complex backend logic",
          "E-commerce API - Scalable backend for online retail platform",
          "Authentication Service - Secure user management system",
          "Real-time Chat API - WebSocket-based messaging backend"
        ],
        achievements: [
          "Designed efficient database schemas for optimal query performance",
          "Built applications that can handle concurrent users effectively",
          "Implemented security best practices to protect user data",
          "Optimized API response times through caching and efficient code"
        ]
      }
    },
    "Others": {
      color: "#fe53bb",
      skills: ["DevOps", "Cloud Architecture", "CI/CD", "Machine Learning", "Data Analysis", "UI/UX Design", "Mobile Development"],
      details: {
        experience: "Beyond frontend and backend development, I'm developing a diverse skill set spanning DevOps, cloud services, machine learning, and UI/UX design. This multidisciplinary approach allows me to contribute to all aspects of the development lifecycle.",
        tools: [
          "Docker & Docker Compose",
          "GitHub Actions & CI/CD",
          "AWS (EC2, S3, Lambda)",
          "Firebase Services",
          "TensorFlow & PyTorch",
          "Python Data Science Stack",
          "Figma & Design Systems",
          "React Native & Mobile Design",
          "Agile Methodologies",
          "Project Management Tools"
        ],
        projects: [
          "Automated Deployment Pipeline - CI/CD workflow for web applications",
          "Machine Learning Project - Predictive analytics implementation",
          "Mobile App Design System - Consistent UI components for native apps",
          "Cloud Architecture - Scalable infrastructure for web applications"
        ],
        achievements: [
          "Implemented automated deployment workflows for faster releases",
          "Developed machine learning models for practical applications",
          "Created intuitive user interfaces that enhance user engagement",
          "Architected cloud solutions that balance performance and cost"
        ]
      }
    }
  };

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Animation variants for sections - adaptive based on user preferences
  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        staggerChildren: shouldReduceMotion ? 0.1 : 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 15
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 }
    }
  }

  // Page transition effects - simplified for mobile
  const pageVariants = {
    initial: { opacity: 0 },
    in: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" }
    },
    out: {
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  }

  // Define GitHub repository URLs for each project
  const projectRepos = {
    "UpFeet": "https://github.com/Mitadru17/UpFeet",
    "GreenGrow Tech": "https://github.com/Mitadru17/UpFeet",
    "Myntra Clone": "https://github.com/Mitadru17/Myntra-Clone-",
    "Spotify Clone": "https://github.com/Mitadru17/Spotify-clone-",
    "Swiggy Clone": "https://github.com/Mitadru17/Swiggy-Clone-"
  };

  // Define Live Demo URLs for each project
  const projectDemoUrls = {
    "UpFeet": "https://up-feet.vercel.app/",
    "GreenGrow Tech": "https://hdv6zn5c1adm79a3b.lite.vusercontent.net/?i=1",
    "Myntra Clone": "https://mitadru17.github.io/Myntra-Clone-/",
    "Spotify Clone": "https://mitadru17.github.io/Spotify-clone-/",
    "Swiggy Clone": "https://mitadru17.github.io/Swiggy-Clone-/#"
  };

  // Function to open GitHub repo modal
  const openRepoModal = (projectName: string) => {
    // Replace with your actual GitHub username and repositories
    const repoUrl = projectRepos[projectName as keyof typeof projectRepos];
    const demoUrl = projectDemoUrls[projectName as keyof typeof projectDemoUrls];
    if (repoUrl) {
      setSelectedRepo({ url: repoUrl, name: projectName, demoUrl });
    } else {
      console.error(`No GitHub repository configured for ${projectName}`);
    }
  };

  // Function to close GitHub repo modal
  const closeRepoModal = () => {
    setSelectedRepo(null);
  };

  // Function to open expertise modal
  const openExpertiseModal = (expertiseTitle: string) => {
    setSelectedExpertise(expertiseTitle);
  };

  // Function to close expertise modal
  const closeExpertiseModal = () => {
    setSelectedExpertise(null);
  };

  if (!isLoaded) {
    return null // Prevent flickering during hydration
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        className="min-h-screen bg-background text-text-primary overflow-hidden"
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
      >
        {/* Navigation */}
        <CyberpunkNavbar />

        {/* Hero Section with 3D Model */}
        <Suspense fallback={
          <section id="home" className="min-h-screen flex items-center justify-center relative">
            <div className="font-mono text-primary text-xl">
              <span className="inline-block animate-pulse">[</span> Loading... <span className="inline-block animate-pulse">]</span>
            </div>
          </section>
        }>
          <CyberpunkHero />
        </Suspense>

        {/* About Section */}
        <motion.section
          id="about"
          className="min-h-screen relative py-16 px-4 sm:py-24 sm:px-8 md:px-16 bg-surface/50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15, margin: "-50px" }}
          variants={sectionVariants}
        >
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold mb-8 sm:mb-12 text-text-primary"
              variants={itemVariants}
            >
              <span className="text-primary neon-text-pulse">_</span>ABOUT
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
              {/* Profile Picture Column */}
              <motion.div
                className="order-2 md:order-1 flex items-center justify-center"
                variants={itemVariants}
              >
                {/* Interactive Profile Picture */}
                <motion.div
                  className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 overflow-hidden rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotate: [0, 2, 0, -2, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    rotate: {
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 30px rgba(255, 41, 87, 0.6)',
                    rotate: 0
                  }}
                >
                  {/* Cyberpunk border effect */}
                  <motion.div
                    className="absolute -inset-0.5 rounded-xl z-0"
                    style={{
                      background: 'linear-gradient(45deg, #ff2957, transparent, #08f7fe, transparent, #ff2957)',
                      backgroundSize: '400% 400%'
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                    }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />

                  {/* Profile image */}
                  <div className="relative z-10 w-full h-full rounded-lg overflow-hidden border-2 border-primary/20">
                    {/* Using img tag for simplicity */}
                    <motion.img
                      src="/profile-image.jpg"
                      alt="Mitadru Roy"
                      className="w-full h-full object-cover"
                      whileHover={{
                        scale: 1.1,
                        filter: "brightness(1.1)",
                        transition: { duration: 0.4 }
                      }}
                    />

                    {/* Scanline effect */}
                    <motion.div
                      className="absolute inset-0 z-20 opacity-20 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.8) 50%)',
                        backgroundSize: '100% 4px'
                      }}
                      whileHover={{
                        opacity: 0.4,
                        backgroundSize: '100% 2px'
                      }}
                    />

                    {/* Glowing overlay on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent z-10 opacity-0"
                      whileHover={{
                        opacity: 0.6,
                        background: 'radial-gradient(circle at center, rgba(255,41,87,0.4) 0%, transparent 70%)'
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Cyberpunk corner accents - only visible on hover */}
                    <motion.div
                      className="absolute top-0 left-0 w-10 h-10 opacity-0 pointer-events-none z-30"
                      style={{
                        borderTop: '2px solid #08f7fe',
                        borderLeft: '2px solid #08f7fe'
                      }}
                      whileHover={{
                        opacity: 1,
                        width: 20,
                        height: 20,
                        transition: { duration: 0.3 }
                      }}
                    />
                    <motion.div
                      className="absolute top-0 right-0 w-10 h-10 opacity-0 pointer-events-none z-30"
                      style={{
                        borderTop: '2px solid #ff2957',
                        borderRight: '2px solid #ff2957'
                      }}
                      whileHover={{
                        opacity: 1,
                        width: 20,
                        height: 20,
                        transition: { duration: 0.3 }
                      }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 w-10 h-10 opacity-0 pointer-events-none z-30"
                      style={{
                        borderBottom: '2px solid #ff2957',
                        borderLeft: '2px solid #ff2957'
                      }}
                      whileHover={{
                        opacity: 1,
                        width: 20,
                        height: 20,
                        transition: { duration: 0.3 }
                      }}
                    />
                    <motion.div
                      className="absolute bottom-0 right-0 w-10 h-10 opacity-0 pointer-events-none z-30"
                      style={{
                        borderBottom: '2px solid #08f7fe',
                        borderRight: '2px solid #08f7fe'
                      }}
                      whileHover={{
                        opacity: 1,
                        width: 20,
                        height: 20,
                        transition: { duration: 0.3 }
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Text Content Column */}
              <motion.div className="order-1 md:order-2" variants={itemVariants}>
                <motion.h3
                  className="text-xl sm:text-2xl text-primary font-mono mb-4"
                  variants={itemVariants}
                >
                  🚀 About Me
                </motion.h3>
                <motion.p
                  className="text-base sm:text-lg mb-4 sm:mb-6 text-text-secondary"
                  variants={itemVariants}
                >
                  Hey, I&apos;m <span className="text-primary font-semibold">Mitadru Roy</span>, a passionate computer science student with an insatiable curiosity for technology and innovation. I blend creativity with technical expertise to build solutions that not only function flawlessly but also deliver exceptional user experiences.
                </motion.p>
                <motion.p
                  className="text-base sm:text-lg mb-4 sm:mb-6 text-text-secondary"
                  variants={itemVariants}
                >
                  My journey in tech has been fueled by continuous learning and hands-on project development. From architecting full-stack web applications to optimizing algorithms, I thrive on challenges that push my boundaries and expand my technical repertoire.
                </motion.p>
                <motion.p
                  className="text-base sm:text-lg mb-4 sm:mb-6 text-text-secondary"
                  variants={itemVariants}
                >
                  Beyond coding, I actively contribute to open-source initiatives like Hacktoberfest and serve as a Campus Ambassador, bridging the gap between academic learning and industry practices. My commitment to community extends to mentoring fellow students and organizing tech workshops.
                </motion.p>
                <motion.p
                  className="text-base sm:text-lg mb-4 sm:mb-6 text-text-secondary"
                  variants={itemVariants}
                >
                  Let&apos;s connect and collaborate on transforming innovative ideas into impactful solutions! 🚀
                </motion.p>
                <motion.div
                  className="neon-outline-pulse inline-block p-4 sm:p-6 mt-4"
                  variants={itemVariants}
                >
                  <div className="font-mono text-primary text-sm sm:text-base">
                    <span className="font-bold">{'>'} Voice Command:</span> Say &quot;Home&quot; to return to top
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          id="skills"
          className="min-h-screen relative py-16 px-4 sm:py-24 sm:px-8 md:px-16 bg-background"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15, margin: "-50px" }}
          variants={sectionVariants}
        >
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold mb-8 sm:mb-12 text-text-primary"
              variants={itemVariants}
            >
              <span className="text-primary neon-text-pulse">_</span>SKILLS
            </motion.h2>

            {/* NETWORK GLOBE VISUALIZATION */}
            <motion.div
              className="relative w-full h-[700px] mt-4 mb-16 overflow-hidden"
              variants={itemVariants}
            >
              {/* Minimal Interactive Skill Visualization */}
              <motion.div
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Dark backdrop with grid */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm">
                  {/* Grid lines - subtle background effect */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #ff2957 1px, transparent 1px), linear-gradient(to bottom, #08f7fe 1px, transparent 1px)',
                      backgroundSize: '80px 80px'
                    }}
                  />
                </div>

                {/* Use the new SkillsSection component */}
                <SkillsSection />

                {/* Particle effects */}
                {Array.from({ length: 40 }).map((_, i) => {
                  const size = 1 + Math.random() * 2;

                  return (
                    <motion.div
                      key={`star-${i}`}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: size,
                        height: size,
                        backgroundColor: i % 2 === 0 ? "#ff2957" : "#08f7fe",
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        filter: "blur(0.5px)",
                      }}
                      animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  );
                })}
              </motion.div>

              {/* Legend */}
              <motion.div
                className="absolute bottom-16 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-black/70 backdrop-blur-sm border border-primary/30 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="flex items-center justify-center space-x-8 text-sm font-mono">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#ff2957] mr-2"></div>
                    <span>Frontend & ML</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#08f7fe] mr-2"></div>
                    <span>Backend & Infrastructure</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.h3
              className="text-xl sm:text-2xl text-primary font-mono mb-6"
              variants={itemVariants}
            >
              🧠 Expertise Areas
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Skill Category Card - Frontend Development */}
              <motion.div
                className="bg-surface p-6 border border-[#ff2957]/30 rounded-lg relative overflow-hidden group"
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  boxShadow: '0 0 25px rgba(255,41,87,0.3)',
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated background pattern */}
                <motion.div
                  className="absolute inset-0 opacity-10 pointer-events-none z-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #ff2957 1px, transparent 1px)',
                    backgroundSize: '15px 15px'
                  }}
                  animate={{
                    backgroundPosition: ['0px 0px', '15px 15px'],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                {/* Animated corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-[#ff2957]/20 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{
                    scale: 1.2,
                    borderRightColor: "rgba(255,41,87,0.4)",
                    transition: { duration: 0.2 }
                  }}
                />

                <div className="relative z-20">
                  <motion.h4
                    className="text-lg font-mono text-[#ff2957] mb-4 flex items-center"
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <span className="mr-2">01.</span> Frontend
                    <motion.span
                      className="ml-2 text-xs opacity-0 group-hover:opacity-100"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 0 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      &lt;expand&gt;
                    </motion.span>
                  </motion.h4>

                  <ul className="space-y-2 text-text-secondary">
                    {[
                      "React, Next.js, TypeScript",
                      "Tailwind, CSS-in-JS, Animation",
                      "Responsive Design, Accessibility",
                      "State Management, Performance"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        whileHover={{
                          x: 5,
                          color: "#ff2957",
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.span
                          className="text-[#ff2957] mr-2"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, delay: index * 0.5, repeat: Infinity }}
                        >
                          •
                        </motion.span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* View More Button */}
                  <motion.button
                    onClick={() => openExpertiseModal("Frontend")}
                    className="mt-5 px-4 py-2 border border-[#ff2957]/50 text-[#ff2957] text-sm font-mono flex items-center bg-[#ff2957]/5 hover:bg-[#ff2957]/10 w-full justify-center"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 0 15px rgba(255,41,87,0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </motion.button>
                </div>
              </motion.div>

              {/* Skill Category Card - Backend Development */}
              <motion.div
                className="bg-surface p-6 border border-[#08f7fe]/30 rounded-lg relative overflow-hidden group"
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  boxShadow: '0 0 25px rgba(8,247,254,0.3)',
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated background pattern */}
                <motion.div
                  className="absolute inset-0 opacity-10 pointer-events-none z-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #08f7fe 1px, transparent 1px)',
                    backgroundSize: '15px 15px'
                  }}
                  animate={{
                    backgroundPosition: ['0px 0px', '15px 15px'],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                {/* Animated corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-[#08f7fe]/20 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{
                    scale: 1.2,
                    borderRightColor: "rgba(8,247,254,0.4)",
                    transition: { duration: 0.2 }
                  }}
                />

                <div className="relative z-20">
                  <motion.h4
                    className="text-lg font-mono text-[#08f7fe] mb-4 flex items-center"
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <span className="mr-2">02.</span> Backend
                    <motion.span
                      className="ml-2 text-xs opacity-0 group-hover:opacity-100"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 0 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      &lt;expand&gt;
                    </motion.span>
                  </motion.h4>

                  <ul className="space-y-2 text-text-secondary">
                    {[
                      "Node.js, Express, GraphQL",
                      "MongoDB, PostgreSQL, Redis",
                      "API Development, Authentication",
                      "Server Optimization, Caching"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        whileHover={{
                          x: 5,
                          color: "#08f7fe",
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.span
                          className="text-[#08f7fe] mr-2"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, delay: index * 0.5, repeat: Infinity }}
                        >
                          •
                        </motion.span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* View More Button */}
                  <motion.button
                    onClick={() => openExpertiseModal("Backend")}
                    className="mt-5 px-4 py-2 border border-[#08f7fe]/50 text-[#08f7fe] text-sm font-mono flex items-center bg-[#08f7fe]/5 hover:bg-[#08f7fe]/10 w-full justify-center"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 0 15px rgba(8,247,254,0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </motion.button>
                </div>
              </motion.div>

              {/* Skill Category Card - DevOps & ML */}
              <motion.div
                className="bg-surface p-6 border border-primary/30 rounded-lg relative overflow-hidden group"
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  boxShadow: '0 0 25px rgba(255,41,87,0.3)',
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated background pattern */}
                <motion.div
                  className="absolute inset-0 opacity-10 pointer-events-none z-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #ff2957 1px, transparent 1px)',
                    backgroundSize: '15px 15px'
                  }}
                  animate={{
                    backgroundPosition: ['0px 0px', '15px 15px'],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                {/* Animated corner accent */}
                <motion.div
                  className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-primary/20 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{
                    scale: 1.2,
                    borderRightColor: "rgba(255,41,87,0.4)",
                    transition: { duration: 0.2 }
                  }}
                />

                <div className="relative z-20">
                  <motion.h4
                    className="text-lg font-mono text-primary mb-4 flex items-center"
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <span className="mr-2">03.</span> Specialized
                    <motion.span
                      className="ml-2 text-xs opacity-0 group-hover:opacity-100"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 0 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      &lt;expand&gt;
                    </motion.span>
                  </motion.h4>

                  <ul className="space-y-2 text-text-secondary">
                    {[
                      "Docker, CI/CD, Cloud Services",
                      "Machine Learning, Data Analysis",
                      "Web Security, Performance Tuning",
                      "System Design, Scalability"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        whileHover={{
                          x: 5,
                          color: "#ff2957",
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.span
                          className="text-primary mr-2"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, delay: index * 0.5, repeat: Infinity }}
                        >
                          •
                        </motion.span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* View More Button */}
                  <motion.button
                    onClick={() => openExpertiseModal("Others")}
                    className="mt-5 px-4 py-2 border border-primary/50 text-primary text-sm font-mono flex items-center bg-primary/5 hover:bg-primary/10 w-full justify-center"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 0 15px rgba(255,41,87,0.4)"
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="neon-outline-pulse inline-block p-4 sm:p-6 mt-8 sm:mt-12 mx-auto text-center"
              variants={itemVariants}
            >
              <div className="font-mono text-primary text-sm sm:text-base">
                <span className="font-bold">{'>'} Voice Command:</span> Say &quot;Projects&quot; to navigate to my work
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          id="projects"
          className="min-h-screen relative py-16 px-4 sm:py-24 sm:px-8 md:px-16 bg-background"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15, margin: "-50px" }}
          variants={sectionVariants}
        >
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold mb-8 sm:mb-12 text-text-primary"
              variants={itemVariants}
            >
              <span className="text-primary neon-text-pulse">_</span>PROJECTS
            </motion.h2>

            <motion.h3
              className="text-xl sm:text-2xl text-primary font-mono mb-6"
              variants={itemVariants}
            >
              🔥 Projects
            </motion.h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Project 1 - UpFeet - Enhanced */}
              <motion.div
                className="bg-surface border border-primary/30 hover:border-primary transition-all duration-300 group will-change-transform relative overflow-hidden"
                variants={itemVariants}
                custom={0}
                transition={{ delay: 0.05 }}
                whileHover={{
                  y: shouldReduceMotion ? 0 : -10,
                  boxShadow: '0 0 25px rgba(255, 41, 87, 0.4)',
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Enhanced project preview area */}
                <div className="h-36 sm:h-48 bg-dark relative overflow-hidden group-hover:shadow-inner">
                  {/* Project image container with perspective effect */}
                  <div className="absolute inset-0 perspective">
                    {/* Animated background overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-[#ff2957]/20 to-black/40 z-10"
                      whileHover={{
                        opacity: 0.6,
                        backgroundPosition: ["0% 0%", "100% 100%"]
                      }}
                      transition={{ duration: 1 }}
                    />

                    {/* Animated project preview - replace with actual project image */}
                    <motion.div
                      className="absolute inset-0 bg-cover bg-center transform"
                      style={{
                        backgroundImage: 'url("/project-previews/upfeet-preview.jpg"), linear-gradient(135deg, #111 25%, #222 25%, #222 50%, #111 50%, #111 75%, #222 75%, #222 100%)',
                        backgroundSize: 'cover, 4px 4px',
                        backgroundPosition: 'center',
                        backgroundBlendMode: 'overlay'
                      }}
                      initial={{ scale: 1 }}
                      whileHover={{
                        scale: 1.1,
                        rotateX: 5,
                        rotateY: 5
                      }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Cyberpunk scanning line effect */}
                    <motion.div
                      className="absolute inset-0 z-20 opacity-0 group-hover:opacity-30 pointer-events-none overflow-hidden"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.3 }}
                    >
                      <motion.div
                        className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary to-transparent"
                        animate={{
                          top: ['0%', '100%', '0%']
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  </div>

                  <div className="absolute top-4 left-4 z-30">
                    <motion.span
                      className="font-mono text-xs text-primary px-2 py-1 bg-black/50 backdrop-blur-sm rounded-sm"
                      whileHover={{
                        letterSpacing: "0.1em",
                        backgroundColor: "rgba(0,0,0,0.7)"
                      }}
                    >
                      Project_1
                    </motion.span>
                  </div>

                  {/* View project overlay indicator */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300 cursor-pointer"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    onClick={() => window.open("https://up-feet.vercel.app/", "_blank", "noopener,noreferrer")}
                  >
                    <motion.span
                      className="px-3 py-2 bg-primary text-black font-mono text-sm font-bold rounded-sm"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileHover={{
                        scale: 1,
                        opacity: 1,
                        boxShadow: "0 0 20px rgba(255,41,87,0.7)"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      PREVIEW PROJECT
                    </motion.span>
                  </motion.div>
                </div>

                <div className="p-4 sm:p-6 relative">
                  {/* Enhanced title with "glitch" effect on hover */}
                  <motion.h3
                    className="text-lg sm:text-xl font-mono mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300 relative overflow-hidden"
                  >
                    <motion.span
                      className="inline-block relative z-10"
                      whileHover={{
                        x: [0, -2, 3, -1, 0],
                        transition: { duration: 0.5, repeat: Infinity, repeatType: "mirror" }
                      }}
                    >
                      1️⃣ UpFeet 🛒
                    </motion.span>
                    <motion.span
                      className="absolute top-0 left-0 text-primary opacity-0 group-hover:opacity-20 z-0"
                      animate={{
                        x: [0, -4, 5, -3, 0],
                      }}
                      transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
                    >
                      1️⃣ UpFeet 🛒
                    </motion.span>
                  </motion.h3>

                  {/* Description with animated highlight */}
                  <div className="relative mb-3 sm:mb-4">
                    <p className="text-text-secondary mb-3 sm:mb-4 text-sm sm:text-base relative z-10">
                      🚀 A next-gen sneaker eCommerce platform with dynamic product displays and a sleek, modern interface for an engaging shopping experience.
                    </p>
                    <motion.div
                      className="absolute inset-0 bg-primary/5 rounded-md opacity-0 z-0"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Enhanced tech tags */}
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    {["React", "Next.js", "Tailwind CSS"].map((tech, i) => (
                      <motion.span
                        key={i}
                        className="tech-tag relative overflow-hidden"
                        whileHover={{
                          scale: 1.1,
                          color: "#fff",
                          backgroundColor: "#ff2957",
                          transition: { duration: 0.2 }
                        }}
                      >
                        <motion.span className="relative z-10">{tech}</motion.span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-0"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "0%" }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.span>
                    ))}
                  </div>

                  {/* Enhanced CTA button - UPDATED with onClick handler */}
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      className="cyberpunk-button text-xs sm:text-sm py-1 px-2 sm:px-3 mt-1 sm:mt-2 relative overflow-hidden"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(255,41,87,0.6)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openRepoModal("UpFeet")}
                    >
                      <motion.span className="relative z-10">View Project</motion.span>
                      <motion.div
                        className="absolute inset-0 bg-primary opacity-0 z-0"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.2 }}
                        whileTap={{ opacity: 0.3 }}
                      />
                      <motion.div
                        className="absolute -inset-1 opacity-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent z-0"
                        initial={{ opacity: 0, x: '-100%' }}
                        whileHover={{
                          opacity: 1,
                          x: ['100%', '-100%'],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.button>
                    <motion.a
                      href="https://up-feet.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cyberpunk-button text-xs sm:text-sm py-1 px-2 sm:px-3 mt-1 sm:mt-2 inline-flex items-center relative overflow-hidden"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(255,41,87,0.6)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.span className="relative z-10">Live Demo</motion.span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 relative z-10">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      <motion.div
                        className="absolute inset-0 bg-primary opacity-0 z-0"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.2 }}
                        whileTap={{ opacity: 0.3 }}
                      />
                      <motion.div
                        className="absolute -inset-1 opacity-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent z-0"
                        initial={{ opacity: 0, x: '-100%' }}
                        whileHover={{
                          opacity: 1,
                          x: ['100%', '-100%'],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.a>
                  </div>
                </div>
              </motion.div>

              {/* Project 2 - GreenGrow Tech */}
              <motion.div
                className="bg-surface border border-primary/30 hover:border-primary transition-all duration-300 group will-change-transform"
                variants={itemVariants}
                custom={1}
                transition={{ delay: 0.1 }}
                whileHover={{
                  y: shouldReduceMotion ? 0 : -5,
                  boxShadow: '0 0 15px rgba(255, 41, 87, 0.3)',
                  transition: { duration: 0.3 }
                }}
              >
                <div className="h-36 sm:h-48 bg-dark relative overflow-hidden">
                  {/* Project image background */}
                  <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                      backgroundImage: 'url("/project-previews/greengrow-preview.jpg"), linear-gradient(135deg, #111 25%, #222 25%, #222 50%, #111 50%, #111 75%, #222 75%, #222 100%)',
                      backgroundSize: 'cover, 4px 4px',
                      backgroundPosition: 'center',
                      backgroundBlendMode: 'overlay'
                    }}
                  />

                  <div className="absolute top-4 left-4">
                    <span className="font-mono text-xs text-primary">Project_2</span>
                  </div>

                  {/* View project overlay indicator */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300 cursor-pointer"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    onClick={() => window.open("https://hdv6zn5c1adm79a3b.lite.vusercontent.net/?i=1", "_blank", "noopener,noreferrer")}
                  >
                    <motion.span
                      className="px-3 py-2 bg-primary text-black font-mono text-sm font-bold rounded-sm"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileHover={{
                        scale: 1,
                        opacity: 1,
                        boxShadow: "0 0 20px rgba(255,41,87,0.7)"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      PREVIEW PROJECT
                    </motion.span>
                  </motion.div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-mono mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                    2️⃣ GreenGrow Tech 🌱
                  </h3>
                  <p className="text-text-secondary mb-3 sm:mb-4 text-sm sm:text-base">
                    🚀 An AI-powered greenhouse farming solution providing smart irrigation, adaptive lighting, climate control, and crop monitoring to enhance agricultural productivity.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    <span className="tech-tag">Python</span>
                    <span className="tech-tag">IoT</span>
                    <span className="tech-tag">AI/ML</span>
                  </div>
                  {/* Project buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="cyberpunk-button text-xs sm:text-sm py-1 px-2 sm:px-3 mt-1 sm:mt-2"
                      onClick={() => openRepoModal("GreenGrow Tech")}
                    >
                      View Project
                    </button>
                    <motion.a
                      href="https://hdv6zn5c1adm79a3b.lite.vusercontent.net/?i=1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cyberpunk-button text-xs sm:text-sm py-1 px-2 sm:px-3 mt-1 sm:mt-2 inline-flex items-center"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(255,41,87,0.6)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Live Demo
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </motion.div>

              {/* Project 3 - Myntra Clone */}
              <motion.div
                className="bg-surface border border-primary/30 hover:border-primary transition-all duration-300 group will-change-transform"
                variants={itemVariants}
                custom={2}
                transition={{ delay: 0.15 }}
                whileHover={{
                  y: shouldReduceMotion ? 0 : -5,
                  boxShadow: '0 0 15px rgba(255, 41, 87, 0.3)',
                  transition: { duration: 0.3 }
                }}
              >
                <div className="h-36 sm:h-48 bg-dark relative overflow-hidden">
                  {/* Project image background */}
                  <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                      backgroundImage: 'url("/project-previews/myntra-preview.jpg"), linear-gradient(135deg, #111 25%, #222 25%, #222 50%, #111 50%, #111 75%, #222 75%, #222 100%)',
                      backgroundSize: 'cover, 4px 4px',
                      backgroundPosition: 'center',
                      backgroundBlendMode: 'overlay'
                    }}
                  />

                  <div className="absolute top-4 left-4">
                    <span className="font-mono text-xs text-primary">Project_3</span>
                  </div>

                  {/* View project overlay indicator */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300 cursor-pointer"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    onClick={() => window.open("https://mitadru17.github.io/Myntra-Clone-/", "_blank", "noopener,noreferrer")}
                  >
                    <motion.span
                      className="px-3 py-2 bg-primary text-black font-mono text-sm font-bold rounded-sm"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileHover={{
                        scale: 1,
                        opacity: 1,
                        boxShadow: "0 0 20px rgba(255,41,87,0.7)"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      PREVIEW PROJECT
                    </motion.span>
                  </motion.div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-mono mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                    3️⃣ Myntra Clone 🛍️
                  </h3>
                  <p className="text-text-secondary mb-3 sm:mb-4 text-sm sm:text-base">
                    🚀 A responsive eCommerce website inspired by Myntra, designed for a seamless shopping experience.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    <span className="tech-tag">React</span>
                    <span className="tech-tag">CSS</span>
                    <span className="tech-tag">JavaScript</span>
                  </div>
                  {/* Updated button with onClick handler */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="cyberpunk-button text-xs sm:text-sm py-1 px-2 sm:px-3 mt-1 sm:mt-2"
                      onClick={() => openRepoModal("Myntra Clone")}
                    >
                      View Project
                    </button>
                    <motion.a
                      href="https://mitadru17.github.io/Myntra-Clone-/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cyberpunk-button text-xs sm:text-sm py-1 px-2 sm:px-3 mt-1 sm:mt-2 inline-flex items-center"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(255,41,87,0.6)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Live Demo
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </motion.div>

              {/* Project 4 - Spotify Clone */}
              <motion.div
                className="bg-surface border border-primary/30 hover:border-primary transition-all duration-300 group will-change-transform"
                variants={itemVariants}
                custom={3}
                transition={{ delay: 0.2 }}
                whileHover={{
                  y: shouldReduceMotion ? 0 : -5,
                  boxShadow: '0 0 15px rgba(255, 41, 87, 0.3)',
                  transition: { duration: 0.3 }
                }}
              >
                <div className="h-36 sm:h-48 bg-dark relative overflow-hidden">
                  {/* Project image background */}
                  <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                      backgroundImage: 'url("/project-previews/spotify-preview.jpg"), linear-gradient(135deg, #111 25%, #222 25%, #222 50%, #111 50%, #111 75%, #222 75%, #222 100%)',
                      backgroundSize: 'cover, 4px 4px',
                      backgroundPosition: 'center',
                      backgroundBlendMode: 'overlay'
                    }}
                  />

                  <div className="absolute top-4 left-4">
                    <span className="font-mono text-xs text-primary">Project_4</span>
                  </div>

                  {/* View project overlay indicator */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300 cursor-pointer"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    onClick={() => window.open("https://mitadru17.github.io/Spotify-clone-/", "_blank", "noopener,noreferrer")}
                  >
                    <motion.span
                      className="px-3 py-2 bg-primary text-black font-mono text-sm font-bold rounded-sm"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileHover={{
                        scale: 1,
                        opacity: 1,
                        boxShadow: "0 0 20px rgba(255,41,87,0.7)"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      PREVIEW PROJECT
                    </motion.span>
                  </motion.div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-mono mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                    4️⃣ Spotify Clone 🎵
                  </h3>
                  <p className="text-text-secondary mb-3 sm:mb-4 text-sm sm:text-base">
                    🚀 A modernized version of Spotify for music streaming, with responsive design, clean UI, and a user-friendly experience.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    <span className="tech-tag">React</span>
                    <span className="tech-tag">Node.js</span>
                    <span className="tech-tag">Web Audio API</span>
                  </div>
                  {/* Updated buttons with container */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="cyberpunk-button text-xs sm:text-sm py-1 px-2 sm:px-3 mt-1 sm:mt-2"
                      onClick={() => openRepoModal("Spotify Clone")}
                    >
                      View Project
                    </button>
                    <motion.a
                      href="https://mitadru17.github.io/Spotify-clone-/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cyberpunk-button text-xs sm:text-sm py-1 px-2 sm:px-3 mt-1 sm:mt-2 inline-flex items-center"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(255,41,87,0.6)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Live Demo
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </motion.div>

              {/* Project 5 - Swiggy Clone */}
              <motion.div
                className="bg-surface border border-primary/30 hover:border-primary transition-all duration-300 group will-change-transform"
                variants={itemVariants}
                custom={4}
                transition={{ delay: 0.25 }}
                whileHover={{
                  y: shouldReduceMotion ? 0 : -5,
                  boxShadow: '0 0 15px rgba(255, 41, 87, 0.3)',
                  transition: { duration: 0.3 }
                }}
              >
                <div className="h-36 sm:h-48 bg-dark relative overflow-hidden">
                  {/* Project image background */}
                  <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                      backgroundImage: 'url("/project-previews/swiggy-preview.jpg"), linear-gradient(135deg, #111 25%, #222 25%, #222 50%, #111 50%, #111 75%, #222 75%, #222 100%)',
                      backgroundSize: 'cover, 4px 4px',
                      backgroundPosition: 'center',
                      backgroundBlendMode: 'overlay'
                    }}
                  />

                  <div className="absolute top-4 left-4">
                    <span className="font-mono text-xs text-primary">Project_5</span>
                  </div>

                  {/* View project overlay indicator */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300 cursor-pointer"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    onClick={() => window.open("https://mitadru17.github.io/Swiggy-Clone-/#", "_blank", "noopener,noreferrer")}
                  >
                    <motion.span
                      className="px-3 py-2 bg-primary text-black font-mono text-sm font-bold rounded-sm"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileHover={{
                        scale: 1,
                        opacity: 1,
                        boxShadow: "0 0 20px rgba(255,41,87,0.7)"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      PREVIEW PROJECT
                    </motion.span>
                  </motion.div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-mono mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                    5️⃣ Swiggy Clone 🍔
                  </h3>
                  <p className="text-text-secondary mb-3 sm:mb-4 text-sm sm:text-base">
                    🚀 A responsive food delivery platform inspired by Swiggy, built using HTML and CSS.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    <span className="tech-tag">HTML</span>
                    <span className="tech-tag">CSS</span>
                    <span className="tech-tag">JavaScript</span>
                  </div>
                  {/* Updated button with onClick handler */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="cyberpunk-button text-xs sm:text-sm py-1 px-2 sm:px-3 mt-1 sm:mt-2"
                      onClick={() => openRepoModal("Swiggy Clone")}
                    >
                      View Project
                    </button>
                    <motion.a
                      href="https://mitadru17.github.io/Swiggy-Clone-/#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cyberpunk-button text-xs sm:text-sm py-1 px-2 sm:px-3 mt-1 sm:mt-2 inline-flex items-center"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 15px rgba(255,41,87,0.6)"
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Live Demo
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="neon-outline-pulse inline-block p-4 sm:p-6 mt-8 sm:mt-12 mx-auto text-center"
              variants={itemVariants}
            >
              <div className="font-mono text-primary text-sm sm:text-base">
                <span className="font-bold">{'>'} Voice Command:</span> Say &quot;Contact&quot; to navigate to contact section
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          id="contact"
          className="min-h-screen relative py-16 px-4 sm:py-24 sm:px-8 md:px-16 bg-surface/50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15, margin: "-50px" }}
          variants={sectionVariants}
        >
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold mb-8 sm:mb-12 text-text-primary"
              variants={itemVariants}
            >
              <span className="text-primary neon-text-pulse">_</span>CONTACT
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16">
              <motion.div variants={itemVariants}>
                <motion.p
                  className="text-base sm:text-lg mb-6 sm:mb-8 text-text-secondary"
                  variants={itemVariants}
                >
                  Interested in working together? Feel free to reach out through the contact form or directly via email.
                </motion.p>

                <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
                  <motion.div
                    className="flex items-center"
                    variants={itemVariants}
                    whileHover={{ x: shouldReduceMotion ? 0 : 5, transition: { duration: 0.2 } }}
                  >
                    <div className="w-8 h-8 bg-primary/20 border border-primary flex items-center justify-center mr-4">
                      <span className="text-primary">@</span>
                    </div>
                    <a href="mailto:mitadruroy006@gmail.com" className="font-mono text-text-primary text-sm sm:text-base hover:text-primary transition-colors duration-300">mitadruroy006@gmail.com</a>
                  </motion.div>

                  {/* GitHub */}
                  <motion.div
                    className="flex items-center"
                    variants={itemVariants}
                    whileHover={{ x: shouldReduceMotion ? 0 : 5, transition: { duration: 0.2 } }}
                  >
                    <div className="w-8 h-8 bg-primary/20 border border-primary flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </div>
                    <a href="https://github.com/mitadru17" className="font-mono text-text-primary text-sm sm:text-base hover:text-primary transition-colors duration-300" target="_blank" rel="noopener noreferrer">github.com/mitadru17</a>
                  </motion.div>

                  {/* LinkedIn */}
                  <motion.div
                    className="flex items-center"
                    variants={itemVariants}
                    whileHover={{ x: shouldReduceMotion ? 0 : 5, transition: { duration: 0.2 } }}
                  >
                    <div className="w-8 h-8 bg-primary/20 border border-primary flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </div>
                    <a href="https://www.linkedin.com/in/mitadruroy/" className="font-mono text-text-primary text-sm sm:text-base hover:text-primary transition-colors duration-300" target="_blank" rel="noopener noreferrer">linkedin.com/in/mitadruroy</a>
                  </motion.div>

                  {/* Instagram */}
                  <motion.div
                    className="flex items-center"
                    variants={itemVariants}
                    whileHover={{ x: shouldReduceMotion ? 0 : 5, transition: { duration: 0.2 } }}
                  >
                    <div className="w-8 h-8 bg-primary/20 border border-primary flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </div>
                    <a href="https://www.instagram.com/mitadru_roy/" className="font-mono text-text-primary text-sm sm:text-base hover:text-primary transition-colors duration-300" target="_blank" rel="noopener noreferrer">instagram.com/mitadru_roy</a>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <form className="space-y-4 sm:space-y-6">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="name" className="block font-mono text-text-secondary mb-1 sm:mb-2 text-sm">NAME</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full bg-dark border border-primary/30 focus:border-primary text-text-primary p-2 sm:p-3 font-mono focus:outline-none transition-colors duration-300 text-sm sm:text-base"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block font-mono text-text-secondary mb-1 sm:mb-2 text-sm">EMAIL</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full bg-dark border border-primary/30 focus:border-primary text-text-primary p-2 sm:p-3 font-mono focus:outline-none transition-colors duration-300 text-sm sm:text-base"
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label htmlFor="message" className="block font-mono text-text-secondary mb-1 sm:mb-2 text-sm">MESSAGE</label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full bg-dark border border-primary/30 focus:border-primary text-text-primary p-2 sm:p-3 font-mono focus:outline-none transition-colors duration-300 resize-none text-sm sm:text-base"
                    ></textarea>
                  </motion.div>
                  <motion.button
                    type="button"
                    className="cyberpunk-button text-sm"
                    variants={itemVariants}
                    whileHover={{
                      scale: shouldReduceMotion ? 1 : 1.03,
                      boxShadow: '0 0 20px rgba(255, 41, 87, 0.5)'
                    }}
                    whileTap={{ scale: shouldReduceMotion ? 1 : 0.98 }}
                  >
                    SEND MESSAGE
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* GitHub Repository Modal */}
        <AnimatePresence>
          {selectedRepo && (
            <GitHubRepoModal
              isOpen={true}
              onClose={closeRepoModal}
              repoUrl={selectedRepo.url}
              projectName={selectedRepo.name}
              demoUrl={selectedRepo.demoUrl}
            />
          )}
        </AnimatePresence>

        {/* Render expertise modal when an expertise is selected */}
        {selectedExpertise && expertiseData[selectedExpertise as keyof typeof expertiseData] && (
          <ExpertiseModal
            isOpen={true}
            onClose={closeExpertiseModal}
            title={selectedExpertise}
            color={expertiseData[selectedExpertise as keyof typeof expertiseData].color}
            skills={expertiseData[selectedExpertise as keyof typeof expertiseData].skills}
            details={expertiseData[selectedExpertise as keyof typeof expertiseData].details}
          />
        )}

        {/* Voice Navigation Component */}
        <VoiceNavigation />
        
        {/* Background Music Player */}
        <SpotifyBackgroundPlayer playlistUrl="https://open.spotify.com/playlist/4qLhCfXrcHH3diL0Yxd0Sz" />
      </motion.main>
    </AnimatePresence>
  )
}

// Add DraggableSkillNode component at the bottom of the file
interface DraggableSkillNodeProps {
  name: string;
  icon: string;
  initialPosition: {
    x: number;
    y: number;
  };
  color: string;
  delay: number;
  shouldReduceMotion: boolean | null;
  onPop: () => void;
  containerSize: {
    width: number;
    height: number;
  };
  gameReset: boolean;
}

const DraggableSkillNode: React.FC<DraggableSkillNodeProps> = ({
  name,
  icon,
  initialPosition,
  color,
  delay,
  shouldReduceMotion,
  onPop,
  containerSize,
  gameReset
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPopped, setIsPopped] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const reducedMotion = shouldReduceMotion === true;

  // Reset state when game is reset
  useEffect(() => {
    if (gameReset) {
      setIsPopped(false);
      setIsPopping(false);
      setIsVisible(false);
    }
  }, [gameReset]);

  // Calculate max safe distance for orbits to use full container
  const maxOrbitRadius = Math.min(containerSize.width, containerSize.height) * 0.45;

  useEffect(() => {
    // Only show if delay is reasonable (meaning reveal has been triggered)
    if (delay < 999999) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    } else {
      // Hide node when delay is set very high (game reset or node popped)
      setIsVisible(false);
    }
  }, [delay]);

  // Handle node click for the game
  const handleNodeClick = () => {
    if (!isPopped && !isPopping) {
      setIsPopping(true);

      // Play pop sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Create a more interesting pop sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.15);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (error) {
        console.error('Audio error:', error);
      }

      // Wait for pop animation to complete before hiding
      setTimeout(() => {
        setIsPopped(true);
        onPop();
        setTimeout(() => {
          setIsVisible(false);
        }, 200);
      }, 300);
    }
  };

  if (!isVisible) return null;

  // Calculate initial angle from center (more accurate)
  const initialAngle = Math.atan2(initialPosition.y, initialPosition.x);

  // Distribute skills across the entire container more effectively
  // Create orbital rings that are spread out to fill the entire container
  let orbitScale = 1.0; // How much of the container to use

  // Create more balanced orbital rings that span the entire container
  let orbitRing;
  if (initialPosition.x * initialPosition.x + initialPosition.y * initialPosition.y < 1600) {
    // Inner ring
    orbitRing = maxOrbitRadius * 0.4;
  } else if (initialPosition.x * initialPosition.x + initialPosition.y * initialPosition.y < 4000) {
    // Middle ring
    orbitRing = maxOrbitRadius * 0.65;
  } else {
    // Outer ring
    orbitRing = maxOrbitRadius * 0.9;
  }

  // Apply a slight oval shape to the orbits to fit viewport better
  const horizontalScale = 1.0;
  const verticalScale = 0.95;

  // Create more distinct angles for each node
  const angleDegrees = ((initialAngle * 180 / Math.PI) + 360) % 360;
  // Spread nodes more evenly
  const angleOffset = (Math.floor(angleDegrees / 36) * 36) * Math.PI / 180;

  // Set rotation speed based on ring (slower for outer rings)
  const orbitDuration = 40 + (orbitRing / 10);

  // Pre-calculate orbital positions for animation with slightly oval orbits
  const numPoints = 360;
  const orbitPathX = Array.from({ length: numPoints }, (_, i) => {
    const angle = angleOffset + (i / numPoints) * Math.PI * 2;
    return Math.cos(angle) * orbitRing * horizontalScale;
  });

  const orbitPathY = Array.from({ length: numPoints }, (_, i) => {
    const angle = angleOffset + (i / numPoints) * Math.PI * 2;
    return Math.sin(angle) * orbitRing * verticalScale;
  });

  // Z-index based on orbital ring (inner rings appear above outer ones)
  const baseZIndex = Math.max(30, 35 - Math.floor(orbitRing / 70));

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 touch-manipulation"
      style={{
        transformOrigin: "center center",
        zIndex: isDragging ? 50 : isHovered ? 40 : baseZIndex,
      }}
      initial={{
        opacity: 0,
        scale: 0,
        x: 0,
        y: 0
      }}
      animate={{
        opacity: isPopping ? [1, 1, 0] : 1,
        scale: isPopping ? [1, 1.5, 0] : 1,
        x: isDragging ? undefined : orbitPathX,
        y: isDragging ? undefined : orbitPathY,
        transition: {
          opacity: isPopping ? {
            duration: 0.5,
            times: [0, 0.6, 1]
          } : {
            duration: 0.8,
            delay: delay
          },
          scale: isPopping ? {
            duration: 0.5,
            times: [0, 0.3, 1],
            ease: "easeOut"
          } : {
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.8,
            delay: delay
          },
          x: {
            duration: orbitDuration,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
            delay: delay
          },
          y: {
            duration: orbitDuration,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
            delay: delay
          }
        }
      }}
      onClick={handleNodeClick}
      drag={!isPopping}
      dragSnapToOrigin
      dragConstraints={{
        left: -containerSize.width / 2 + 50,
        right: containerSize.width / 2 - 50,
        top: -containerSize.height / 2 + 50,
        bottom: containerSize.height / 2 - 50
      }}
      dragElastic={0.7}
      dragMomentum={true}
      dragTransition={{
        power: 0.2,
        timeConstant: 200,
        restDelta: 0.5,
        bounceStiffness: 200,
        bounceDamping: 40
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(event, info) => {
        setIsDragging(false);
        const velocity = Math.sqrt(info.velocity.x ** 2 + info.velocity.y ** 2);
        if (velocity > 500) {
          const element = event.target as HTMLElement;
          element.style.transition = "transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)";
        }
      }}
      whileDrag={{
        scale: 1.1,
        filter: "brightness(1.3)",
        zIndex: 50,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 200
        }
      }}
      whileHover={{
        scale: 1.1,
        zIndex: isDragging ? 50 : 40,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 300
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Connection line to center */}
      <motion.div
        className="absolute top-1/2 left-1/2 h-px w-0 origin-left z-0 pointer-events-none"
        style={{
          background: `linear-gradient(to right, transparent, ${color})`,
          transformOrigin: 'center left',
        }}
        animate={{
          width: isHovered ? orbitRing * horizontalScale : orbitRing * horizontalScale * 0.9,
          opacity: isDragging ? 0.1 : isHovered ? 0.7 : 0.2,
          scale: isPopping ? [1, 0] : 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />

      {/* Node */}
      <motion.div
        className="relative cursor-pointer"
        animate={{
          rotate: isDragging ? 0 : 0,
          scale: isPopping ? [1, 1.5, 0] : 1
        }}
        transition={{
          duration: isPopping ? 0.5 : 0.3,
          ease: isPopping ? "easeOut" : "easeInOut"
        }}
      >
        {/* Node glow */}
        <motion.div
          className="absolute -inset-3 rounded-full blur-md pointer-events-none"
          style={{ backgroundColor: `${color}40` }}
          animate={isPopping ? {
            scale: [1, 3],
            opacity: [0.7, 0],
            backgroundColor: [color + "40", color + "90", color + "00"]
          } : isHovered || isDragging ? {
            scale: [1, 1.05, 1],
            opacity: isDragging ? 0.9 : 0.7
          } : {
            scale: 1,
            opacity: 0.3
          }}
          transition={{
            duration: isPopping ? 0.5 : 2,
            repeat: (isHovered || isDragging) && !isPopping ? Infinity : 0,
            ease: "easeInOut"
          }}
        />

        {/* Enhanced pop effect particles */}
        {isPopping && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const distance = 20 + Math.random() * 60;

              return (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: color,
                    left: '50%',
                    top: '50%',
                    opacity: 0.8 + Math.random() * 0.2,
                    rotate: Math.random() * 180
                  }}
                  initial={{ x: 0, y: 0, scale: 1 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                    scale: Math.random() * 0.8
                  }}
                  transition={{
                    duration: 0.3 + Math.random() * 0.3,
                    ease: "easeOut"
                  }}
                />
              );
            })}

            {/* Add burst circle */}
            <motion.div
              className="absolute rounded-full w-full h-full"
              style={{
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: color,
                top: 0,
                left: 0
              }}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </motion.div>
        )}

        {/* Node container */}
        <motion.div
          className="relative flex items-center justify-center rounded-full bg-black/80 border-2 z-30"
          style={{
            width: '52px',
            height: '52px',
            borderColor: color,
            boxShadow: isDragging ? `0 0 20px ${color}` : isHovered ? `0 0 12px ${color}` : `0 0 5px ${color}80`
          }}
        >
          {/* Node icon */}
          <div className="text-lg font-bold" style={{ color }}>
            {icon}
          </div>

          {/* Scanning effect on hover/drag */}
          {(isHovered || isDragging) && !isPopping && (
            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden opacity-50 pointer-events-none"
            >
              <motion.div
                className="absolute left-0 w-full h-0.5"
                style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }}
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          )}

          {/* Pulse effect when popping */}
          {isPopping && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.4, times: [0, 0.2, 1] }}
            />
          )}
        </motion.div>

        {/* Skill name */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: isDragging ? 1 : isHovered ? 1 : 0.8,
            scale: isDragging ? 1.1 : 1,
            y: isPopping ? [0, -30] : 0
          }}
          transition={{
            duration: isPopping ? 0.5 : 0.2,
            ease: isPopping ? "easeOut" : "easeInOut"
          }}
          className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-center border border-transparent whitespace-nowrap"
          style={{
            top: '100%',
            borderColor: `${color}40`,
            boxShadow: isDragging ? `0 0 8px ${color}60` : `0 0 5px ${color}40`,
            zIndex: 60
          }}
        >
          <span className="text-sm font-medium" style={{ color }}>
            {name}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Add CentralSkillNode component
const CentralSkillNode = ({ onReveal, isRestart = false }: { onReveal: () => void, isRestart?: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (!isClicked) {
      setIsClicked(true);
      
      // Call onReveal with a slight delay for better animation
      setTimeout(() => {
        onReveal();
      }, 400);
      
      // Play reveal sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create a more complex reveal sound
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.type = 'sine';
        oscillator1.frequency.setValueAtTime(300, audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.3);
        
        oscillator2.type = 'triangle';
        oscillator2.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator1.start();
        oscillator1.stop(audioContext.currentTime + 0.5);
        
        oscillator2.start();
        oscillator2.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.error('Audio error:', error);
      }
    }
  };
  
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-40"
      initial={{ scale: 0 }}
      animate={{ 
        scale: 1,
        rotate: isClicked ? [0, 180, 360] : isRestart ? [0, 20, -20, 10, -10, 0] : 0
      }}
      transition={{
        scale: { type: "spring", stiffness: 260, damping: 20 },
        rotate: isClicked 
          ? { duration: 1, ease: "easeInOut" }
          : isRestart 
            ? { duration: 1, repeat: Infinity, repeatType: "loop", repeatDelay: 1 } 
            : { duration: 1, ease: "easeInOut" }
      }}
      whileHover={{ scale: 1.1 }}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="relative flex items-center justify-center w-20 h-20 rounded-full bg-black/80 border-2 border-primary"
        animate={isRestart ? {
          boxShadow: ["0 0 30px #ff2957", "0 0 50px #08f7fe", "0 0 30px #ff2957"],
          borderColor: ["#ff2957", "#08f7fe", "#ff2957"]
        } : isClicked ? {
          boxShadow: ["0 0 20px #ff2957", "0 0 40px #08f7fe", "0 0 20px #ff2957"]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div 
          className="text-2xl font-bold text-primary"
          animate={isRestart ? { 
            scale: [1, 1.2, 1],
            color: ["#ff2957", "#08f7fe", "#ff2957"]
          } : isClicked ? { 
            scale: [1, 1.2, 1] 
          } : {}}
          transition={{ duration: isRestart ? 2 : 0.5, repeat: isRestart ? Infinity : 0 }}
        >
          {isRestart ? "RESTART" : "SKILLS"}
        </motion.div>
        
        {/* Ripple effect on hover - larger for restart */}
        {isHovered && !isClicked && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary pointer-events-none"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: isRestart ? 2 : 1.5, opacity: 0 }}
            transition={{ duration: isRestart ? 1.5 : 1, repeat: Infinity }}
          />
        )}
        
        {/* Enhanced scanning effect */}
        <motion.div 
          className="absolute inset-0 rounded-full overflow-hidden opacity-50 pointer-events-none"
        >
          <motion.div 
            className="absolute left-0 w-full h-1"
            style={{ background: 'linear-gradient(to right, transparent, #ff2957, #08f7fe, transparent)' }}
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: isRestart ? 1.5 : 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        
        {/* Additional effect for restart button */}
        {isRestart && (
          <motion.div
            className="absolute -inset-4 rounded-full opacity-30 pointer-events-none"
            style={{ 
              background: 'radial-gradient(circle, rgba(255,41,87,0.6) 0%, rgba(8,247,254,0.3) 70%, transparent 100%)'
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

// Modify the skills section to use the central node
const SkillsSection = () => {
  const [showSkills, setShowSkills] = useState(false);
  const [poppedSkills, setPoppedSkills] = useState<string[]>([]);
  const [showRestart, setShowRestart] = useState(false);
  const [isGameReset, setIsGameReset] = useState(false);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  
  // Update container dimensions when it renders
  useEffect(() => {
    if (containerRef) {
      const updateSize = () => {
        setContainerSize({
          width: containerRef.offsetWidth || 800,
          height: containerRef.offsetHeight || 600
        });
      };
      
      // Initial measurement
      updateSize();
      
      // Add resize listener
      window.addEventListener('resize', updateSize);
      
      return () => {
        window.removeEventListener('resize', updateSize);
      };
    }
  }, [containerRef]);
  
  // Define all skills here so we can access them in multiple places
  const allSkills = [
    { name: "JavaScript", icon: "</>", initialPosition: { x: -40, y: -50 }, color: "#ff2957" },
    { name: "React", icon: "⚛️", initialPosition: { x: 60, y: -25 }, color: "#08f7fe" },
    { name: "HTML/CSS", icon: "🌐", initialPosition: { x: -65, y: 10 }, color: "#08f7fe" },
    { name: "TypeScript", icon: "TS", initialPosition: { x: 25, y: 60 }, color: "#ff2957" },
    { name: "Node.js", icon: "🔗", initialPosition: { x: 70, y: 40 }, color: "#ff2957" },
    { name: "Python", icon: "🐍", initialPosition: { x: -50, y: 45 }, color: "#08f7fe" },
    { name: "MongoDB", icon: "🍃", initialPosition: { x: 35, y: -60 }, color: "#08f7fe" },
    { name: "NextJS", icon: "N", initialPosition: { x: 75, y: -45 }, color: "#ff2957" },
    { name: "Tailwind", icon: "🎨", initialPosition: { x: -30, y: 25 }, color: "#ff2957" },
    { name: "Git", icon: "🔄", initialPosition: { x: -70, y: -30 }, color: "#08f7fe" },
    { name: "Docker", icon: "🐳", initialPosition: { x: 40, y: 25 }, color: "#08f7fe" },
    { name: "GraphQL", icon: "◢", initialPosition: { x: 0, y: -70 }, color: "#ff2957" },
    { name: "PostgreSQL", icon: "🐘", initialPosition: { x: -10, y: 60 }, color: "#08f7fe" }
  ];
  
  // Handle when a skill is popped
  const handleSkillPopped = (skillName: string) => {
    const newPoppedSkills = [...poppedSkills, skillName];
    setPoppedSkills(newPoppedSkills);
    
    // Check if all skills are popped
    if (newPoppedSkills.length === allSkills.length) {
      setTimeout(() => {
        setShowRestart(true);
      }, 1000);
    }
  };
  
  // Handle initial reveal
  const handleReveal = () => {
    setShowSkills(true);
  };
  
  // Handle restart button click with improved state handling
  const handleRestart = () => {
    // First, indicate that we're in reset mode
    setIsGameReset(true);
    
    // Set restart flag to false to remove the restart button
    setShowRestart(false);
    
    // Hide all skills
    setShowSkills(false);
    
    // Reset popped skills
    setPoppedSkills([]);
    
    // After a delay, allow showing skills again
    setTimeout(() => {
      setIsGameReset(false);
      setShowSkills(true);
    }, 800);
  };
  
  return (
    <div 
      ref={ref => setContainerRef(ref)}
      className="relative w-full h-[700px] overflow-hidden border-2 border-red-900/20"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(255, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 0, 0, 0.1) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }}
    >
      {/* Score indicator */}
      <motion.div 
        className="absolute top-4 left-4 z-50 bg-black/70 backdrop-blur-sm border border-primary/30 rounded-lg px-4 py-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-primary font-mono text-sm">
          Popped: {poppedSkills.length}/{allSkills.length}
        </p>
      </motion.div>
      
      {/* Central node - conditionally render based on state */}
      {(!showSkills || showRestart) && (
        <CentralSkillNode 
          onReveal={showRestart ? handleRestart : handleReveal} 
          isRestart={showRestart}
          key={`central-node-${showRestart ? 'restart' : 'start'}`}
        />
      )}
      
      {/* Skill nodes with key that includes game reset state to force remounting */}
      {allSkills.map((skill, index) => (
        <DraggableSkillNode
          key={`${skill.name}-${isGameReset ? 'reset' : 'normal'}`}
          {...skill}
          delay={showSkills && !poppedSkills.includes(skill.name) ? index * 0.15 : 999999}
          shouldReduceMotion={false}
          onPop={() => handleSkillPopped(skill.name)}
          containerSize={containerSize}
          gameReset={isGameReset}
        />
      ))}

      {/* Instruction overlay */}
      <motion.div 
        className="absolute bottom-6 right-6 px-6 py-3 bg-black/70 backdrop-blur-sm border border-primary/30 rounded-lg z-50 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-primary font-mono text-sm">
          {showRestart 
            ? "All skills popped! Click RESTART to play again" 
            : showSkills 
              ? "Pop the skill bubbles or drag them around!" 
              : "Click the SKILLS node to reveal skills"}
        </p>
      </motion.div>
      
      {/* Confetti effect when all skills are popped */}
      {showRestart && (
        <div className="absolute inset-0 pointer-events-none z-30">
          {Array.from({ length: 50 }).map((_, i) => {
            const size = 5 + Math.random() * 10;
            const startX = Math.random() * 100;
            const delay = Math.random() * 3;
            
            return (
              <motion.div
                key={`confetti-${i}`}
                className="absolute rounded-sm"
                style={{
                  width: size,
                  height: size * 0.6,
                  backgroundColor: i % 2 === 0 ? "#ff2957" : "#08f7fe",
                  left: `${startX}%`,
                  top: -20,
                  zIndex: 1000,
                  rotate: Math.random() * 360
                }}
                initial={{ y: -20, rotate: 0 }}
                animate={{ 
                  y: containerSize.height + 50,
                  rotate: 360,
                  opacity: [0, 1, 1, 0.8, 0]
                }}
                transition={{
                  duration: 5 + Math.random() * 2,
                  delay: delay,
                  ease: [0.1, 0.4, 0.6, 0.9]
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};