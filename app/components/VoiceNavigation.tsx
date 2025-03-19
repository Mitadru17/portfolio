'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMic, FiMicOff, FiAlertTriangle, FiMessageSquare, FiSend } from 'react-icons/fi'

// Import Google Generative AI
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

// Define AI agent states
type AIAgentState = 'inactive' | 'listening' | 'thinking' | 'speaking'
type AIMessage = {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

// Define navigation commands and their corresponding section IDs
const VOICE_COMMANDS: Record<string, string> = {
  // Section navigation commands
  'home': 'home',
  'about': 'about',
  'skills': 'skills',
  'project': 'projects',
  'projects': 'projects',
  'blog': 'blog',
  'contact': 'contact',
}

// Define action commands for other website interactions
const ACTION_COMMANDS: Record<string, string> = {
  // Scroll commands
  'scroll up': 'scrollUp',
  'scroll down': 'scrollDown',
  'scroll top': 'scrollTop',
  'scroll bottom': 'scrollBottom',
  
  // Social media commands
  'open linkedin': 'openLinkedIn',
  'open instagram': 'openInstagram',
  'open github': 'openGitHub',
  'open email': 'openEmail',
  
  // Project commands
  'open live project': 'openLiveProject',
  'view project': 'viewProject',
  'view demo': 'viewDemo',
  'view source': 'viewSource',
  
  // Project-specific commands
  'open upfeet': 'openProjectUpFeet',
  'open myntra': 'openProjectMyntra', 
  'open myntra clone': 'openProjectMyntra',
  'open spotify': 'openProjectSpotify',
  'open spotify clone': 'openProjectSpotify', 
  'open swiggy': 'openProjectSwiggy',
  'open swiggy clone': 'openProjectSwiggy',
  'open greengrow': 'openProjectGreenGrow',
  'open greengrow tech': 'openProjectGreenGrow',
  
  // Project-specific view project commands
  'view project of upfeet': 'viewProjectUpFeet',
  'view project of myntra': 'viewProjectMyntra',
  'view project of myntra clone': 'viewProjectMyntra',
  'view project of spotify': 'viewProjectSpotify',
  'view project of spotify clone': 'viewProjectSpotify',
  'view project of swiggy': 'viewProjectSwiggy',
  'view project of swiggy clone': 'viewProjectSwiggy',
  'view project of greengrow': 'viewProjectGreenGrow',
  'view project of greengrow tech': 'viewProjectGreenGrow',
  
  // Project-specific live demo commands
  'open demo of upfeet': 'viewDemoUpFeet',
  'view demo of upfeet': 'viewDemoUpFeet',
  'open live demo of upfeet': 'viewDemoUpFeet',
  'open demo of myntra': 'viewDemoMyntra',
  'view demo of myntra': 'viewDemoMyntra',
  'open live demo of myntra': 'viewDemoMyntra',
  'open demo of myntra clone': 'viewDemoMyntra',
  'view demo of myntra clone': 'viewDemoMyntra',
  'open live demo of myntra clone': 'viewDemoMyntra',
  'open demo of spotify': 'viewDemoSpotify',
  'view demo of spotify': 'viewDemoSpotify',
  'open live demo of spotify': 'viewDemoSpotify',
  'open demo of spotify clone': 'viewDemoSpotify',
  'view demo of spotify clone': 'viewDemoSpotify',
  'open live demo of spotify clone': 'viewDemoSpotify',
  'open demo of swiggy': 'viewDemoSwiggy',
  'view demo of swiggy': 'viewDemoSwiggy',
  'open live demo of swiggy': 'viewDemoSwiggy',
  'open demo of swiggy clone': 'viewDemoSwiggy',
  'view demo of swiggy clone': 'viewDemoSwiggy',
  'open live demo of swiggy clone': 'viewDemoSwiggy',
  'open demo of greengrow': 'viewDemoGreenGrow',
  'view demo of greengrow': 'viewDemoGreenGrow',
  'open live demo of greengrow': 'viewDemoGreenGrow',
  'open demo of greengrow tech': 'viewDemoGreenGrow',
  'view demo of greengrow tech': 'viewDemoGreenGrow',
  'open live demo of greengrow tech': 'viewDemoGreenGrow',
  
  // Modal commands
  'view more': 'viewMore',
  'close': 'closeModal',
  'back': 'closeModal',
}

// Initialize Google Generative AI
const initializeGeminiAI = () => {
  if (typeof window !== 'undefined') {
    // This can be replaced with environment variable in production
    // For demo purposes, you can hardcode your API key here, but make sure to use environment variables in production
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
    
    try {
      const genAI = new GoogleGenerativeAI(API_KEY)
      
      // Create a model instance
      const geminiModel = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash', // or 'gemini-pro' depending on your needs
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      })
      
      return geminiModel
    } catch (error) {
      console.error("Failed to initialize Gemini AI:", error)
      return null
    }
  }
  return null
}

const VoiceNavigation = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognizedCommand, setRecognizedCommand] = useState<string | null>(null)
  const [showCommandNotification, setShowCommandNotification] = useState(false)
  const [isBrowserSupported, setIsBrowserSupported] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown')
  const [showDebugPanel, setShowDebugPanel] = useState(false)
  
  // AI Agent state - removed aiMode since all voice interactions will now be AI-based
  const [aiState, setAIState] = useState<AIAgentState>('inactive')
  
  // Remove showAIChat state and related chat state variables
  const [isAITyping, setIsAITyping] = useState(false)
  
  // Store recognition instance in a ref to avoid recreation on each render
  const recognitionRef = useRef<any>(null)
  // Track whether we want to maintain continuous listening
  const continuousListeningRef = useRef<boolean>(false)
  
  const [geminiModel, setGeminiModel] = useState<any>(null)
  const [fallbackMode, setFallbackMode] = useState<boolean>(false)
  
  // Function to check microphone permission status
  const checkMicrophonePermission = useCallback(async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permissionResult = await navigator.permissions.query({ name: 'microphone' as PermissionName })
        setPermissionStatus(permissionResult.state)
        
        permissionResult.onchange = () => {
          setPermissionStatus(permissionResult.state)
          setDebugInfo(`Permission status changed to: ${permissionResult.state}`)
          
          if (permissionResult.state === 'granted') {
            setErrorMessage(null)
          }
        }
        
        return permissionResult.state
      } else {
        setDebugInfo('navigator.permissions API not supported')
        return 'unknown'
      }
    } catch (error) {
      console.error('Error checking microphone permission:', error)
      setDebugInfo(`Error checking permission: ${error}`)
      return 'unknown'
    }
  }, [])

  // Function to directly request microphone access
  const requestMicrophoneAccess = useCallback(async () => {
    try {
      setDebugInfo('Requesting microphone access...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // We got access, so update our state
      setPermissionStatus('granted')
      setErrorMessage(null)
      setDebugInfo('Microphone access granted')
      
      // Stop the stream right away, we just needed the permission
      stream.getTracks().forEach(track => track.stop())
      
      return true
    } catch (error) {
      console.error('Microphone access denied:', error)
      setPermissionStatus('denied')
      setErrorMessage('Microphone access denied. Please allow microphone access in your browser settings.')
      setDebugInfo(`Error getting mic: ${error}`)
      return false
    }
  }, [])

  // Check if running on client and browser supports SpeechRecognition
  useEffect(() => {
    setIsClient(true)
    
    const initVoiceRecognition = async () => {
      // Check browser support
      if (typeof window !== 'undefined') {
        // Debug information
        setDebugInfo('Initializing voice recognition...')
        
        // Check for SpeechRecognition API
        // @ts-ignore: Browser Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const hasSpeechRecognition = !!SpeechRecognition
        
        if (!hasSpeechRecognition) {
          setDebugInfo('Speech Recognition API not supported')
          setIsBrowserSupported(false)
          setErrorMessage('Your browser does not support voice recognition.')
          return
        }
        
        setIsBrowserSupported(true)
        
        // Check microphone permission
        const permission = await checkMicrophonePermission()
        setDebugInfo(`Initial microphone permission: ${permission}`)
        
        // Initialize recognition
        try {
          recognitionRef.current = new SpeechRecognition()
          
          // Configure recognition settings
          recognitionRef.current.continuous = true // Set to continuous mode
          recognitionRef.current.interimResults = false
          recognitionRef.current.lang = 'en-US'
          
          setDebugInfo('Speech recognition initialized in continuous mode')
          
          // Set up event handlers
          recognitionRef.current.onend = () => {
            // If we're in continuous mode and didn't explicitly stop, restart
            if (continuousListeningRef.current) {
              setDebugInfo('Recognition ended, but continuous mode is on. Restarting...')
              try {
                recognitionRef.current.start()
              } catch (error) {
                console.error('Error restarting recognition:', error)
                setDebugInfo(`Restart error: ${error}`)
                setIsListening(false)
                continuousListeningRef.current = false
              }
            } else {
              setDebugInfo('Recognition ended and continuous mode is off')
              setIsListening(false)
            }
          }
          
          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error)
            setDebugInfo(`Speech recognition error: ${event.error}`)
            
            // Handle errors without stopping listening entirely
            if (event.error === 'not-allowed') {
              setPermissionStatus('denied')
              setErrorMessage('Microphone access denied. Click the mic button to request access.')
              // This is a fatal error, so stop continuous listening
              continuousListeningRef.current = false
              setIsListening(false)
            } else if (event.error === 'no-speech') {
              setErrorMessage('No speech detected. Please try again.')
              // Don't stop continuous listening for no-speech errors
              setTimeout(() => {
                setErrorMessage(null)
              }, 3000)
            } else if (event.error === 'aborted') {
              // This is an expected error when we manually stop
              setDebugInfo('Recognition aborted by user')
            } else {
              setErrorMessage(`Error: ${event.error}. Please try again.`)
              setTimeout(() => {
                setErrorMessage(null)
              }, 3000)
            }
          }
        } catch (error) {
          console.error('Error initializing speech recognition:', error)
          setDebugInfo(`Init error: ${error}`)
          setIsBrowserSupported(false)
          setErrorMessage('Failed to initialize speech recognition.')
        }
      }
    }
    
    initVoiceRecognition()
    
    // Add keyboard shortcut for debug panel
    const handleDebugKeypress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'd') {
        setShowDebugPanel(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleDebugKeypress)
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleDebugKeypress)
      if (recognitionRef.current) {
        continuousListeningRef.current = false
        try {
          recognitionRef.current.abort()
        } catch (e) {
          console.error('Error cleaning up recognition:', e)
        }
      }
    }
  }, [checkMicrophonePermission])

  // Setup speech recognition - modified to always use AI interpretation
  const startListening = useCallback(async () => {
    if (!isClient || !isBrowserSupported) {
      setDebugInfo('Cannot start: client or browser not supported')
      return
    }
    
    setDebugInfo('Starting AI speech recognition in continuous mode...')
    
    // Check/request microphone permission first
    if (permissionStatus !== 'granted') {
      const granted = await requestMicrophoneAccess()
      if (!granted) {
        setDebugInfo('Mic permission denied, cannot start')
        return
      }
    }
    
    // Now we can start recognition
    if (!recognitionRef.current) {
      setDebugInfo('Recognition ref not initialized')
      return
    }
    
    try {
      // Set continuous mode
      continuousListeningRef.current = true
      setIsListening(true)
      setTranscript('')
      setRecognizedCommand(null)
      setErrorMessage(null)
      
      // Set up the result handler each time we start
      recognitionRef.current.onresult = (event: any) => {
        try {
          // Get the latest result (for continuous recognition)
          const resultIndex = event.resultIndex;
          const result = event.results[resultIndex];
          
          if (result && result[0]) {
            const command = result[0].transcript.toLowerCase().trim()
            console.log('Recognized speech:', command)
            setDebugInfo(`Recognized: "${command}"`)
            setTranscript(command)
            
            // Process all speech through AI
            processAICommand(command)
          }
        } catch (error) {
          console.error('Error processing speech result:', error)
          setDebugInfo(`Error processing result: ${error}`)
        }
      }

      // Start recognition
      recognitionRef.current.start()
      setDebugInfo('Continuous AI recognition started')
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      setDebugInfo(`Start error: ${error}`)
      setIsListening(false)
      continuousListeningRef.current = false
      
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        setPermissionStatus('denied')
        setErrorMessage('Microphone access denied. Please allow microphone access in your browser settings.')
      } else {
        setErrorMessage('Failed to start speech recognition. Please try again.')
      }
    }
  }, [isClient, isBrowserSupported, permissionStatus, requestMicrophoneAccess])

  const stopListening = useCallback(() => {
    if (!isClient || !isBrowserSupported || !recognitionRef.current) {
      setDebugInfo('Cannot stop: client or browser not supported')
      return
    }
    
    try {
      // Set flag to false first so the onend handler doesn't restart
      continuousListeningRef.current = false
      recognitionRef.current.abort()
      setDebugInfo('Recognition stopped explicitly by user')
    } catch (error) {
      console.error('Error stopping speech recognition:', error)
      setDebugInfo(`Stop error: ${error}`)
    }
    
    setIsListening(false)
  }, [isClient, isBrowserSupported])

  const navigateToSection = (sectionId: string) => {
    if (!isClient) return
    
    const section = document.getElementById(sectionId)
    if (section) {
      // Smooth scroll to section
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      setDebugInfo(`Navigating to section: ${sectionId}`)
    } else {
      console.warn(`Section with ID "${sectionId}" not found`)
      setDebugInfo(`Section not found: ${sectionId}`)
    }
  }

  // Handle action commands
  const executeAction = (actionType: string) => {
    if (!isClient) return
    
    setDebugInfo(`Executing action: ${actionType}`)
    
    switch (actionType) {
      // Scroll commands
      case 'scrollUp':
        window.scrollBy({ top: -300, behavior: 'smooth' })
        break
      case 'scrollDown':
        window.scrollBy({ top: 300, behavior: 'smooth' })
        break
      case 'scrollTop':
        window.scrollTo({ top: 0, behavior: 'smooth' })
        break
      case 'scrollBottom':
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        break
      
      // Social media commands
      case 'openLinkedIn':
        window.open('https://www.linkedin.com/in/mitadruroy/', '_blank')
        break
      case 'openInstagram':
        window.open('https://www.instagram.com/mitadru_roy/', '_blank')
        break
      case 'openGitHub':
        window.open('https://github.com/mitadru17', '_blank')
        break
      case 'openEmail':
        window.open('mailto:mitadruroy006@gmail.com', '_blank')
        break
      
      // Project commands
      case 'openLiveProject':
      case 'viewDemo':
        handleViewLiveProject()
        break
      case 'viewProject':
      case 'viewSource':
        handleViewProject()
        break
        
      // Project-specific commands
      case 'openProjectUpFeet':
        handleOpenSpecificProject('UpFeet')
        break
      case 'openProjectMyntra':
        handleOpenSpecificProject('Myntra Clone')
        break
      case 'openProjectSpotify':
        handleOpenSpecificProject('Spotify Clone')
        break
      case 'openProjectSwiggy':
        handleOpenSpecificProject('Swiggy Clone')
        break
      case 'openProjectGreenGrow':
        handleOpenSpecificProject('GreenGrow Tech')
        break
      
      // Project-specific view project commands
      case 'viewProjectUpFeet':
        handleViewSpecificProject('UpFeet')
        break
      case 'viewProjectMyntra':
        handleViewSpecificProject('Myntra Clone')
        break
      case 'viewProjectSpotify':
        handleViewSpecificProject('Spotify Clone')
        break
      case 'viewProjectSwiggy':
        handleViewSpecificProject('Swiggy Clone')
        break
      case 'viewProjectGreenGrow':
        handleViewSpecificProject('GreenGrow Tech')
        break
      
      // Project-specific live demo commands
      case 'viewDemoUpFeet':
        handleViewSpecificDemo('UpFeet')
        break
      case 'viewDemoMyntra':
        handleViewSpecificDemo('Myntra Clone')
        break
      case 'viewDemoSpotify':
        handleViewSpecificDemo('Spotify Clone')
        break
      case 'viewDemoSwiggy':
        handleViewSpecificDemo('Swiggy Clone')
        break
      case 'viewDemoGreenGrow':
        handleViewSpecificDemo('GreenGrow Tech')
        break
      
      // Modal commands
      case 'viewMore':
        handleViewMore()
        break
      case 'closeModal':
        handleCloseModal()
        break
      
      default:
        setDebugInfo(`Unknown action: ${actionType}`)
    }
  }
  
  // Find and click the most visible "View Project" button
  const handleViewProject = () => {
    // Look for project buttons (more compatible selector approach)
    const projectButtons = Array.from(document.querySelectorAll('button, a')).filter(el => 
      el.textContent?.includes('View Project')
    )
    
    if (projectButtons.length === 0) {
      setErrorMessage("No project buttons found in view")
      return
    }
    
    // Find the most visible button in the viewport
    let mostVisibleButton: Element | null = null
    let maxVisibility = 0
    
    projectButtons.forEach(button => {
      const rect = button.getBoundingClientRect()
      const visibility = getElementVisibility(rect)
      
      if (visibility > maxVisibility) {
        maxVisibility = visibility
        mostVisibleButton = button
      }
    })
    
    if (mostVisibleButton) {
      // Simulate a click on the button
      (mostVisibleButton as HTMLElement).click()
    } else {
      setErrorMessage("No visible project buttons found")
    }
  }
  
  // Find and click the most visible "Live Demo" button
  const handleViewLiveProject = () => {
    // Look for live demo links (more compatible selector approach)
    const demoButtons = Array.from(document.querySelectorAll('a')).filter(el => 
      el.textContent?.includes('Live Demo')
    )
    
    if (demoButtons.length === 0) {
      setErrorMessage("No live demo buttons found in view")
      return
    }
    
    // Find the most visible button in the viewport
    let mostVisibleButton: Element | null = null
    let maxVisibility = 0
    
    demoButtons.forEach(button => {
      const rect = button.getBoundingClientRect()
      const visibility = getElementVisibility(rect)
      
      if (visibility > maxVisibility) {
        maxVisibility = visibility
        mostVisibleButton = button
      }
    })
    
    if (mostVisibleButton) {
      // Simulate a click on the button
      (mostVisibleButton as HTMLElement).click()
    } else {
      setErrorMessage("No visible live demo buttons found")
    }
  }
  
  // Find and click the most visible "View More" or "View Details" button
  const handleViewMore = () => {
    // Look for view more buttons (more compatible selector approach)
    const viewMoreButtons = Array.from(document.querySelectorAll('button')).filter(el => 
      el.textContent?.includes('View Details') || el.textContent?.includes('View More')
    )
    
    if (viewMoreButtons.length === 0) {
      setErrorMessage("No view more buttons found in view")
      return
    }
    
    // Find the most visible button in the viewport
    let mostVisibleButton: Element | null = null
    let maxVisibility = 0
    
    viewMoreButtons.forEach(button => {
      const rect = button.getBoundingClientRect()
      const visibility = getElementVisibility(rect)
      
      if (visibility > maxVisibility) {
        maxVisibility = visibility
        mostVisibleButton = button
      }
    })
    
    if (mostVisibleButton) {
      // Simulate a click on the button
      (mostVisibleButton as HTMLElement).click()
    } else {
      setErrorMessage("No visible view more buttons found")
    }
  }
  
  // Handle closing any open modals
  const handleCloseModal = () => {
    // Look for close buttons (more compatible selector approach)
    const closeButtons = Array.from(document.querySelectorAll('button')).filter(el => 
      el.textContent?.includes('Close') || el.getAttribute('aria-label') === 'Close'
    )
    
    if (closeButtons.length === 0) {
      // No modals appear to be open
      return
    }
    
    // Click the first close button found
    (closeButtons[0] as HTMLElement).click()
  }
  
  // Handle opening a specific project
  const handleOpenSpecificProject = (projectName: string) => {
    // Find and scroll to the project section first
    navigateToSection('projects')
    
    // After a brief delay to allow scrolling, look for the specific project card
    setTimeout(() => {
      // Try to find the project title text
      const projectTitles = Array.from(document.querySelectorAll('h3, h4')).filter(el => 
        el.textContent?.includes(projectName)
      )
      
      if (projectTitles.length > 0) {
        // Found the project, now try to find its "View Project" button
        const projectContainer = findParentWithClass(projectTitles[0], 'project-card') || projectTitles[0].parentElement
        
        if (projectContainer) {
          const viewButtons = projectContainer.querySelectorAll('button')
          if (viewButtons.length > 0) {
            // Click the first button (usually "View Project")
            viewButtons[0].click()
            setDebugInfo(`Opened project: ${projectName}`)
          } else {
            setErrorMessage(`Could not find buttons for ${projectName}`)
          }
        } else {
          setErrorMessage(`Could not locate ${projectName} container`)
        }
      } else {
        setErrorMessage(`Project "${projectName}" not found`)
      }
    }, 500)
  }
  
  // Handle viewing a specific project
  const handleViewSpecificProject = (projectName: string) => {
    // Similar approach to handleOpenSpecificProject but specifically click "View Project" button
    navigateToSection('projects')
    
    setTimeout(() => {
      const projectTitles = Array.from(document.querySelectorAll('h3, h4')).filter(el => 
        el.textContent?.includes(projectName)
      )
      
      if (projectTitles.length > 0) {
        const projectContainer = findParentWithClass(projectTitles[0], 'project-card') || projectTitles[0].parentElement
        
        if (projectContainer) {
          const viewButtons = Array.from(projectContainer.querySelectorAll('button, a')).filter(el =>
            el.textContent?.includes('View Project')
          )
          
          if (viewButtons.length > 0) {
            (viewButtons[0] as HTMLElement).click()
            setDebugInfo(`Viewed project: ${projectName}`)
          } else {
            setErrorMessage(`Could not find View Project button for ${projectName}`)
          }
        } else {
          setErrorMessage(`Could not locate ${projectName} container`)
        }
      } else {
        setErrorMessage(`Project "${projectName}" not found`)
      }
    }, 500)
  }
  
  // Handle viewing a specific demo
  const handleViewSpecificDemo = (projectName: string) => {
    // Similar approach but click "Live Demo" link
    navigateToSection('projects')
    
    setTimeout(() => {
      const projectTitles = Array.from(document.querySelectorAll('h3, h4')).filter(el => 
        el.textContent?.includes(projectName)
      )
      
      if (projectTitles.length > 0) {
        const projectContainer = findParentWithClass(projectTitles[0], 'project-card') || projectTitles[0].parentElement
        
        if (projectContainer) {
          const demoLinks = Array.from(projectContainer.querySelectorAll('a')).filter(el =>
            el.textContent?.includes('Live Demo')
          )
          
          if (demoLinks.length > 0) {
            (demoLinks[0] as HTMLElement).click()
            setDebugInfo(`Opened demo for: ${projectName}`)
          } else {
            setErrorMessage(`Could not find Live Demo link for ${projectName}`)
          }
        } else {
          setErrorMessage(`Could not locate ${projectName} container`)
        }
      } else {
        setErrorMessage(`Project "${projectName}" not found`)
      }
    }, 500)
  }
  
  // Helper function to find parent element with specific class
  const findParentWithClass = (element: Element, className: string): Element | null => {
    let current = element
    
    while (current && current !== document.body) {
      if (current.classList.contains(className)) {
        return current
      }
      if (current.parentElement) {
        current = current.parentElement
      } else {
        break
      }
    }
    
    return null
  }
  
  // Helper function to calculate how visible an element is in the viewport
  const getElementVisibility = (rect: DOMRect): number => {
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    
    // Element is not in viewport at all
    if (
      rect.bottom < 0 ||
      rect.top > windowHeight ||
      rect.right < 0 ||
      rect.left > windowWidth
    ) {
      return 0
    }
    
    // Calculate visible area
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
    const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0)
    const visibleArea = visibleHeight * visibleWidth
    
    // Total area of the element
    const totalArea = rect.height * rect.width
    
    // Visibility ratio (0 to 1)
    return totalArea > 0 ? visibleArea / totalArea : 0
  }

  // When the component mounts, show AI welcome tooltip
  useEffect(() => {
    if (isClient) {
      setTimeout(() => {
        setShowCommandNotification(true)
        setRecognizedCommand("AI Assistant Active")
        
        setTimeout(() => {
          setShowCommandNotification(false)
          setRecognizedCommand(null)
        }, 5000)
      }, 2000)
    }
  }, [isClient])

  // Handle keyboard shortcut (Alt+V) to toggle voice recognition
  useEffect(() => {
    if (!isClient) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'v') {
        if (isListening) {
          stopListening()
        } else {
          startListening()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isClient, isListening, startListening, stopListening])

  // Process commands through AI agent - simplified without chat functionality
  const processAICommand = async (command: string) => {
    // Skip command if it's too short
    if (command.length < 2) return
    
    // Set AI state to thinking
    setAIState('thinking')
    
    try {
      // Delay to simulate thinking time (would be real API call in production)
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // Process the command and generate a response
      let response = await generateAIResponse(command)
      
      // Show the AI response in a notification
      setRecognizedCommand(response.message)
      setShowCommandNotification(true)
      
      // Hide the notification after a few seconds
      setTimeout(() => {
        setShowCommandNotification(false)
        setRecognizedCommand(null)
      }, 6000) // Slightly longer duration for reading the response
      
      // Execute action if the AI determined one
      if (response.action) {
        executeAIAction(response.action, response.params)
      }
    } catch (error) {
      console.error('Error processing AI command:', error)
      
      // Show error in command notification
      setRecognizedCommand("Sorry, I had trouble processing that request")
      setShowCommandNotification(true)
      
      setTimeout(() => {
        setShowCommandNotification(false)
        setRecognizedCommand(null)
      }, 3000)
    } finally {
      setIsAITyping(false)
      setAIState('inactive')
    }
  }
  
  // Simulate AI response generation - modified to use Gemini when available
  const generateAIResponse = async (command: string): Promise<{message: string, action?: string, params?: any}> => {
    // Convert command to lowercase for easier matching
    const lowerCommand = command.toLowerCase()
    
    try {
      // If Gemini is available, use it for natural language processing
      if (geminiModel && !fallbackMode) {
        setDebugInfo(`Using Gemini AI to process: "${command}"`)
        
        // Create a chat session to keep context
        // This includes portfolio context and action instructions
        const chat = geminiModel.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: "You are an AI assistant for Mitadru's portfolio website." }],
            },
            {
              role: "model",
              parts: [{ text: "I'll help visitors navigate and explore Mitadru's portfolio. What would you like to know?" }],
            },
            {
              role: "user", 
              parts: [{ text: "Here are the sections available: Home, About, Skills, Projects, Blog, and Contact. The project section features projects like UpFeet, Myntra Clone, Spotify Clone, Swiggy Clone, and GreenGrow Tech. You'll need to recognize user intent and provide specific JSON structured responses." }],
            },
            {
              role: "model",
              parts: [{ text: "I understand. I'll help visitors navigate through the sections of Mitadru's portfolio and provide information about his projects. I'll structure my responses accordingly and recognize user intents." }],
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
          },
        });
        
        // Enhanced prompt that includes UI interaction capabilities
        const aiPrompt = `
Process this user command for a portfolio website assistant: "${command}"

Respond with a JSON object in this exact format:
{
  "message": "The response message to show the user",
  "action": "One of these actions if applicable: navigate, highlight, viewProject, viewDemo, openSocial, scroll, close, closeAI, interactWithUI, searchContent",
  "params": {
    // Parameters relevant to the action, such as:
    "section": "home|about|skills|projects|blog|contact", // for navigate
    "project": "UpFeet|Myntra Clone|Spotify Clone|Swiggy Clone|GreenGrow Tech", // for project actions
    "platform": "linkedin|github|instagram|email", // for openSocial
    "direction": "up|down|top|bottom", // for scroll
    "description": "detailed description of UI element to interact with", // for interactWithUI
    "searchTerm": "text to search for on the page" // for searchContent
  }
}

Valid sections: home, about, skills, projects, blog, contact
Valid projects: UpFeet, Myntra Clone, Spotify Clone, Swiggy Clone, GreenGrow Tech

NEW CAPABILITIES:
1. If the user wants to click, press, select, or interact with any button, link or UI element, use action "interactWithUI" with description parameter.
2. If the user is looking for specific content on the page, use action "searchContent" with searchTerm parameter.

Examples of new commands to handle:
- "Click the contact button" → interactWithUI with description "contact button"
- "Press the submit button" → interactWithUI with description "submit button"
- "Open the menu" → interactWithUI with description "menu"
- "Find information about React" → searchContent with searchTerm "React"

Only include "action" and "params" if an action should be taken based on the command.
Keep responses concise and focused on helping the user navigate and interact with the portfolio.
`;

        // Send the prompt to Gemini
        const result = await chat.sendMessage(aiPrompt);
        const response = await result.response;
        const responseText = response.text();
        
        setDebugInfo(`Gemini response: ${responseText.substring(0, 100)}...`)
        
        try {
          // Try to parse the JSON response
          // In case Gemini doesn't return perfect JSON, we'll handle that gracefully
          if (responseText.includes('{') && responseText.includes('}')) {
            // Extract JSON from the response (in case there's additional text)
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsedResponse = JSON.parse(jsonMatch[0]);
              return {
                message: parsedResponse.message || "I understand what you're asking for.",
                action: parsedResponse.action,
                params: parsedResponse.params
              };
            }
          }
          
          // If we couldn't parse JSON, just return the text response
          return {
            message: responseText
          };
        } catch (error) {
          console.error("Error parsing Gemini response:", error);
          // Still return something useful to the user
          return {
            message: responseText || "I understood your request but had trouble formatting my response."
          };
        }
      } else {
        // Fallback to rule-based system
        setDebugInfo(`Using rule-based system for: "${command}"`)
        
        // Handle AI mode toggling
        if (/enable ai|turn on ai|activate ai|ai mode on/i.test(lowerCommand)) {
          return {
            message: "AI assistant is already active. I'm always listening in AI mode to help you navigate the portfolio!"
          }
        }
        
        if (/disable ai|turn off ai|deactivate ai|ai mode off/i.test(lowerCommand)) {
          return {
            message: "This portfolio is now fully AI-powered! I'll continue to help you navigate with natural language understanding."
          }
        }
        
        // Common greetings
        if (/^(hi|hello|hey|greetings)/i.test(lowerCommand)) {
          return {
            message: "Hello! I'm your AI portfolio assistant. I can help you navigate the site, tell you about Mitadru's projects, or provide more information. What would you like to know?"
          }
        }
        
        // Navigation intents
        if (/go to|navigate to|show me|take me to/i.test(lowerCommand)) {
          // Home section
          if (/home/i.test(lowerCommand)) {
            return {
              message: "Taking you to the home section.",
              action: "navigate",
              params: { section: "home" }
            }
          }
          
          // About section
          if (/about/i.test(lowerCommand)) {
            return {
              message: "Navigating to the about section where you can learn more about Mitadru.",
              action: "navigate",
              params: { section: "about" }
            }
          }
          
          // Projects section
          if (/project/i.test(lowerCommand)) {
            return {
              message: "Taking you to the projects section where you can explore Mitadru's portfolio work.",
              action: "navigate",
              params: { section: "projects" }
            }
          }
          
          // Skills section
          if (/skill/i.test(lowerCommand)) {
            return {
              message: "Navigating to the skills section to see Mitadru's technical expertise.",
              action: "navigate",
              params: { section: "skills" }
            }
          }
          
          // Contact section
          if (/contact/i.test(lowerCommand)) {
            return {
              message: "Taking you to the contact section where you can find ways to reach out to Mitadru.",
              action: "navigate",
              params: { section: "contact" }
            }
          }
        }
        
        // Project related queries
        if (/tell me about|what is|explain|details about/i.test(lowerCommand)) {
          // UpFeet project
          if (/upfeet/i.test(lowerCommand)) {
            return {
              message: "UpFeet is an e-commerce platform for footwear. It features a responsive design with product browsing, shopping cart functionality, and secure checkout. Would you like to see the project or its live demo?",
              action: "highlight",
              params: { project: "UpFeet" }
            }
          }
          
          // Myntra Clone
          if (/myntra/i.test(lowerCommand)) {
            return {
              message: "The Myntra Clone is a responsive e-commerce website inspired by Myntra. It showcases frontend development skills with React, CSS, and JavaScript. Would you like to see the project repository or live demo?",
              action: "highlight",
              params: { project: "Myntra Clone" }
            }
          }
          
          // Spotify Clone
          if (/spotify/i.test(lowerCommand)) {
            return {
              message: "The Spotify Clone replicates the popular music streaming service's UI. It demonstrates frontend skills with a focus on responsive design and interactive elements. Would you like to see the project or try the live demo?",
              action: "highlight",
              params: { project: "Spotify Clone" }
            }
          }
          
          // Swiggy Clone
          if (/swiggy/i.test(lowerCommand)) {
            return {
              message: "The Swiggy Clone is a food delivery platform replica, showing responsive UI design and interactive elements for a seamless food ordering experience. Would you like to see the project or its live demo?",
              action: "highlight",
              params: { project: "Swiggy Clone" }
            }
          }
          
          // GreenGrow Tech
          if (/greengrow/i.test(lowerCommand)) {
            return {
              message: "GreenGrow Tech is an agricultural technology project that demonstrates UI/UX design skills with a focus on sustainable farming solutions. Would you like to see more details about this project?",
              action: "highlight",
              params: { project: "GreenGrow Tech" }
            }
          }
          
          // Generic projects response
          if (/project/i.test(lowerCommand)) {
            return {
              message: "Mitadru has worked on several projects including UpFeet, Myntra Clone, Spotify Clone, Swiggy Clone, and GreenGrow Tech. Which one would you like to know more about?",
              action: "navigate",
              params: { section: "projects" }
            }
          }
          
          // Generic skills response
          if (/skills|technologies|tech stack/i.test(lowerCommand)) {
            return {
              message: "Mitadru is skilled in frontend technologies like React, JavaScript, CSS, and HTML. He also has experience with responsive design, UI/UX principles, and building e-commerce platforms. Would you like to see the skills section?",
              action: "navigate",
              params: { section: "skills" }
            }
          }
        }
        
        // View project or demo intents
        if (/show|view|open|see|demo|live/i.test(lowerCommand)) {
          // UpFeet project
          if (/upfeet/i.test(lowerCommand)) {
            if (/demo|live/i.test(lowerCommand)) {
              return {
                message: "Opening the live demo of UpFeet project.",
                action: "viewDemo",
                params: { project: "UpFeet" }
              }
            } else {
              return {
                message: "Opening the UpFeet project details.",
                action: "viewProject",
                params: { project: "UpFeet" }
              }
            }
          }
          
          // Myntra Clone
          if (/myntra/i.test(lowerCommand)) {
            if (/demo|live/i.test(lowerCommand)) {
              return {
                message: "Opening the live demo of the Myntra Clone project.",
                action: "viewDemo",
                params: { project: "Myntra Clone" }
              }
            } else {
              return {
                message: "Opening the Myntra Clone project details.",
                action: "viewProject",
                params: { project: "Myntra Clone" }
              }
            }
          }
          
          // Spotify Clone
          if (/spotify/i.test(lowerCommand)) {
            if (/demo|live/i.test(lowerCommand)) {
              return {
                message: "Opening the live demo of the Spotify Clone project.",
                action: "viewDemo",
                params: { project: "Spotify Clone" }
              }
            } else {
              return {
                message: "Opening the Spotify Clone project details.",
                action: "viewProject",
                params: { project: "Spotify Clone" }
              }
            }
          }
          
          // Swiggy Clone
          if (/swiggy/i.test(lowerCommand)) {
            if (/demo|live/i.test(lowerCommand)) {
              return {
                message: "Opening the live demo of the Swiggy Clone project.",
                action: "viewDemo",
                params: { project: "Swiggy Clone" }
              }
            } else {
              return {
                message: "Opening the Swiggy Clone project details.",
                action: "viewProject",
                params: { project: "Swiggy Clone" }
              }
            }
          }
          
          // GreenGrow Tech
          if (/greengrow/i.test(lowerCommand)) {
            if (/demo|live/i.test(lowerCommand)) {
              return {
                message: "Opening the live demo of the GreenGrow Tech project.",
                action: "viewDemo",
                params: { project: "GreenGrow Tech" }
              }
            } else {
              return {
                message: "Opening the GreenGrow Tech project details.",
                action: "viewProject",
                params: { project: "GreenGrow Tech" }
              }
            }
          }
        }
        
        // Social media intents
        if (/social|connect|profile|contact|linkedin|github|instagram|email/i.test(lowerCommand)) {
          if (/linkedin/i.test(lowerCommand)) {
            return {
              message: "Opening Mitadru's LinkedIn profile.",
              action: "openSocial",
              params: { platform: "linkedin" }
            }
          }
          
          if (/github/i.test(lowerCommand)) {
            return {
              message: "Opening Mitadru's GitHub profile where you can explore his code repositories.",
              action: "openSocial",
              params: { platform: "github" }
            }
          }
          
          if (/instagram/i.test(lowerCommand)) {
            return {
              message: "Opening Mitadru's Instagram profile.",
              action: "openSocial",
              params: { platform: "instagram" }
            }
          }
          
          if (/email|mail|gmail/i.test(lowerCommand)) {
            return {
              message: "Opening email client to contact Mitadru.",
              action: "openSocial",
              params: { platform: "email" }
            }
          }
          
          // Generic contact
          return {
            message: "You can connect with Mitadru through LinkedIn, GitHub, Instagram, or email. Which platform would you prefer?",
            action: "navigate",
            params: { section: "contact" }
          }
        }
        
        // Scrolling intents
        if (/scroll/i.test(lowerCommand)) {
          if (/up/i.test(lowerCommand)) {
            return {
              message: "Scrolling up.",
              action: "scroll",
              params: { direction: "up" }
            }
          }
          
          if (/down/i.test(lowerCommand)) {
            return {
              message: "Scrolling down.",
              action: "scroll",
              params: { direction: "down" }
            }
          }
          
          if (/top/i.test(lowerCommand)) {
            return {
              message: "Scrolling to the top of the page.",
              action: "scroll",
              params: { direction: "top" }
            }
          }
          
          if (/bottom/i.test(lowerCommand)) {
            return {
              message: "Scrolling to the bottom of the page.",
              action: "scroll",
              params: { direction: "bottom" }
            }
          }
        }
        
        // Close/exit/back intents
        if (/close|exit|back|return|go back/i.test(lowerCommand)) {
          if (/chat|assistant|ai/i.test(lowerCommand)) {
            return {
              message: "Closing the AI assistant chat. You can reopen it anytime by clicking the chat button or saying 'open assistant'.",
              action: "closeAI"
            }
          }
          
          return {
            message: "Going back or closing the current view.",
            action: "close"
          }
        }
        
        // Help intent
        if (/help|assist|what can you do|commands|features/i.test(lowerCommand)) {
          return {
            message: "I can help you navigate the portfolio, learn about Mitadru's projects, open demos, connect with social media, and answer questions about his work. Try asking things like 'Tell me about the Myntra Clone', 'Show me your skills', or 'Open your LinkedIn profile'."
          }
        }
        
        // Default response for unrecognized commands
        return {
          message: "I'm not sure I understand what you're asking for. You can ask me to navigate the site, tell you about Mitadru's projects, or help you connect through social media. Try saying something like 'Show me your projects' or 'Tell me about your skills'."
        }
      }
    } catch (error) {
      console.error("Error in generateAIResponse:", error);
      return {
        message: "I'm having trouble processing that request right now. Could you try again?"
      };
    }
    
    // Default response if no pattern was matched
    return {
      message: "I'm not sure I understand what you're asking for. You can ask me to navigate the site, tell you about Mitadru's projects, or help you connect through social media. Try saying something like 'Show me your projects' or 'Tell me about your skills'."
    }
  }
  
  // Execute actions based on AI understanding
  const executeAIAction = (action: string, params?: any) => {
    switch (action) {
      case "navigate":
        navigateToSection(params.section)
        break
        
      case "highlight":
        navigateToSection('projects')
        // After a brief delay, highlight the specific project
        setTimeout(() => {
          highlightProject(params.project)
        }, 600)
        break
        
      case "viewProject":
        handleViewSpecificProject(params.project)
        break
        
      case "viewDemo":
        handleViewSpecificDemo(params.project)
        break
        
      case "openSocial":
        openSocialMedia(params.platform)
        break
        
      case "scroll":
        handleScroll(params.direction)
        break
        
      case "close":
        handleCloseModal()
        break
        
      case "closeAI":
        // Remove this case or modify it since there's no chat to close
        break
        
      case "interactWithUI":
        // New action for generic UI interaction
        if (params?.description) {
          const result = interactWithUI(params.description)
          
          // Show the result in a notification
          setRecognizedCommand(result)
          setShowCommandNotification(true)
          
          setTimeout(() => {
            setShowCommandNotification(false)
            setRecognizedCommand(null)
          }, 5000)
        }
        break
        
      case "searchContent":
        // New action to search for content on the page
        if (params?.searchTerm) {
          const result = searchForContent(params.searchTerm)
          
          // Show the result in a notification
          setRecognizedCommand(result)
          setShowCommandNotification(true)
          
          setTimeout(() => {
            setShowCommandNotification(false)
            setRecognizedCommand(null)
          }, 5000)
        }
        break
        
      default:
        console.log("Unknown action:", action)
    }
  }
  
  // Handle scrolling through AI
  const handleScroll = (direction: string) => {
    switch (direction) {
      case "up":
        window.scrollBy({ top: -300, behavior: 'smooth' })
        break
      case "down":
        window.scrollBy({ top: 300, behavior: 'smooth' })
        break
      case "top":
        window.scrollTo({ top: 0, behavior: 'smooth' })
        break
      case "bottom":
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        break
    }
  }
  
  // Open social media profiles
  const openSocialMedia = (platform: string) => {
    switch (platform) {
      case "linkedin":
        window.open('https://www.linkedin.com/in/mitadruroy/', '_blank')
        break
      case "github":
        window.open('https://github.com/mitadru17', '_blank')
        break
      case "instagram":
        window.open('https://www.instagram.com/mitadru_roy/', '_blank')
        break
      case "email":
        window.open('mailto:mitadruroy006@gmail.com', '_blank')
        break
    }
  }
  
  // Highlight a specific project (visual feedback)
  const highlightProject = (projectName: string) => {
    const projectTitles = Array.from(document.querySelectorAll('h3, h4')).filter(el => 
      el.textContent?.includes(projectName)
    )
    
    if (projectTitles.length > 0) {
      const projectContainer = findParentWithClass(projectTitles[0], 'project-card') || projectTitles[0].parentElement
      
      if (projectContainer) {
        // Add highlight class
        projectContainer.classList.add('highlight-project')
        
        // Scroll to make project visible
        projectContainer.scrollIntoView({ behavior: 'smooth', block: 'center' })
        
        // Remove highlight after a few seconds
        setTimeout(() => {
          projectContainer.classList.remove('highlight-project')
        }, 3000)
      }
    }
  }

  // Initialize Gemini AI on client side
  useEffect(() => {
    if (isClient) {
      const model = initializeGeminiAI()
      setGeminiModel(model)
      setFallbackMode(!model) // Set fallback mode if Gemini couldn't be initialized
      
      if (!model) {
        console.warn("Gemini AI couldn't be initialized. Falling back to rule-based system.")
        setDebugInfo("Gemini unavailable - using fallback mode")
      } else {
        setDebugInfo("Gemini AI initialized successfully")
      }
    }
  }, [isClient])

  // Add a function to toggle fallback mode for testing purposes
  const toggleFallbackMode = () => {
    setFallbackMode(prev => !prev)
    setDebugInfo(`Fallback mode ${!fallbackMode ? 'enabled' : 'disabled'}`)
  }

  // Add API key notification if not found
  useEffect(() => {
    if (isClient && !process.env.NEXT_PUBLIC_GEMINI_API_KEY && !fallbackMode) {
      setErrorMessage("Gemini API key not found. Please add your API key to the environment variables.")
      setFallbackMode(true)
    }
  }, [isClient, fallbackMode])

  // New helper function to find any UI element based on description
  const findUIElement = (description: string): HTMLElement | null => {
    if (!isClient) return null
    setDebugInfo(`Looking for UI element: "${description}"`)
    
    const lowerDescription = description.toLowerCase().trim()
    let elements: HTMLElement[] = []
    
    // Try different strategies to find the element
    
    // 1. First try exact text match on buttons, links and interactive elements
    const exactMatches = Array.from(document.querySelectorAll('button, a, [role="button"], input, select, .interactive, [tabindex]:not([tabindex="-1"])')).filter(el => 
      el.textContent?.toLowerCase().includes(lowerDescription)
    ) as HTMLElement[]
    
    if (exactMatches.length > 0) {
      elements = exactMatches
      setDebugInfo(`Found ${elements.length} elements with exact text match: "${lowerDescription}"`)
    }
    
    // 2. If no exact matches, look for partial matches in text
    if (elements.length === 0) {
      const words = lowerDescription.split(/\s+/)
      const partialMatches = Array.from(document.querySelectorAll('button, a, [role="button"], input, select, .interactive, [tabindex]:not([tabindex="-1"])')).filter(el => {
        const elText = el.textContent?.toLowerCase() || ''
        return words.some(word => elText.includes(word))
      }) as HTMLElement[]
      
      if (partialMatches.length > 0) {
        elements = partialMatches
        setDebugInfo(`Found ${elements.length} elements with partial text match`)
      }
    }
    
    // 3. Try to find elements with similar aria-labels or titles
    if (elements.length === 0) {
      const ariaMatches = Array.from(document.querySelectorAll('[aria-label], [title]')).filter(el => {
        const ariaLabel = el.getAttribute('aria-label')?.toLowerCase() || ''
        const title = el.getAttribute('title')?.toLowerCase() || ''
        return ariaLabel.includes(lowerDescription) || title.includes(lowerDescription)
      }) as HTMLElement[]
      
      if (ariaMatches.length > 0) {
        elements = ariaMatches
        setDebugInfo(`Found ${elements.length} elements with matching aria-label or title`)
      }
    }
    
    // 4. Try to find elements by their type/tag and nearby text
    if (elements.length === 0) {
      // Detect if description contains element type hints
      const isButton = /button|click|press|tab/i.test(lowerDescription)
      const isLink = /link|click|press|open|go to|navigate/i.test(lowerDescription)
      const isInput = /input|type|enter|field|box/i.test(lowerDescription)
      
      if (isButton) {
        elements = Array.from(document.querySelectorAll('button, [role="button"], .btn')) as HTMLElement[]
        setDebugInfo(`Found ${elements.length} button elements`)
      } else if (isLink) {
        elements = Array.from(document.querySelectorAll('a')) as HTMLElement[]
        setDebugInfo(`Found ${elements.length} link elements`)
      } else if (isInput) {
        elements = Array.from(document.querySelectorAll('input, textarea, select')) as HTMLElement[]
        setDebugInfo(`Found ${elements.length} input elements`)
      }
    }
    
    // 5. As a last resort, try to find any clickable element
    if (elements.length === 0) {
      elements = Array.from(document.querySelectorAll('button, a, [role="button"], [onclick], .clickable, .interactive')) as HTMLElement[]
      setDebugInfo(`Falling back to any clickable element, found ${elements.length}`)
    }
    
    // If we found any elements, sort by visibility and relevance
    if (elements.length > 0) {
      // Sort by visibility first
      elements = elements.filter(el => {
        const rect = el.getBoundingClientRect()
        const visibility = getElementVisibility(rect)
        return visibility > 0 // Only consider visible elements
      })
      
      // Then sort by relevance to the description
      elements.sort((a, b) => {
        const aText = a.textContent?.toLowerCase() || ''
        const bText = b.textContent?.toLowerCase() || ''
        const aScore = scoreElementRelevance(aText, lowerDescription, a)
        const bScore = scoreElementRelevance(bText, lowerDescription, b)
        return bScore - aScore
      })
      
      // Return the most relevant visible element
      if (elements.length > 0) {
        setDebugInfo(`Selected best matching element: "${elements[0].textContent}"`)
        return elements[0]
      }
    }
    
    setDebugInfo('No matching UI elements found')
    return null
  }
  
  // Helper function to score element relevance
  const scoreElementRelevance = (elementText: string, searchText: string, element: HTMLElement): number => {
    let score = 0
    
    // Exact match is best
    if (elementText === searchText) {
      score += 100
    }
    // Contains the whole search phrase
    else if (elementText.includes(searchText)) {
      score += 50
    }
    // Contains any of the words
    else {
      const words = searchText.split(/\s+/)
      for (const word of words) {
        if (word.length > 2 && elementText.includes(word)) {
          score += 10
        }
      }
    }
    
    // Boost score for elements with matching aria-label or title
    const ariaLabel = element.getAttribute('aria-label')?.toLowerCase() || ''
    const title = element.getAttribute('title')?.toLowerCase() || ''
    
    if (ariaLabel.includes(searchText) || title.includes(searchText)) {
      score += 25
    }
    
    // Boost score based on element type
    if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
      score += 5
    }
    if (element.tagName === 'A') {
      score += 3
    }
    
    // Visibility bonus
    const rect = element.getBoundingClientRect()
    const visibility = getElementVisibility(rect)
    score += visibility * 20 // Up to 20 points for fully visible elements
    
    return score
  }
  
  // Function to interact with UI elements based on natural language
  const interactWithUI = (description: string): string => {
    try {
      const element = findUIElement(description)
      
      if (!element) {
        return `I couldn't find any UI element matching "${description}". Could you describe it differently?`
      }
      
      // Highlight the element visually first
      const originalOutline = element.style.outline
      const originalBoxShadow = element.style.boxShadow
      element.style.outline = '2px solid var(--color-primary, #00eeff)'
      element.style.boxShadow = '0 0 10px var(--color-primary, #00eeff)'
      
      // Scroll the element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      
      // Click the element after a short delay to allow scrolling
      setTimeout(() => {
        try {
          // Restore original styles after a delay
          setTimeout(() => {
            element.style.outline = originalOutline
            element.style.boxShadow = originalBoxShadow
          }, 1500)
          
          // Simulate click
          element.click()
          setDebugInfo(`Clicked element: "${element.textContent}"`)
        } catch (error) {
          console.error('Error clicking element:', error)
          setDebugInfo(`Error clicking element: ${error}`)
        }
      }, 500)
      
      return `I found and clicked the "${element.textContent || description}" element for you.`
    } catch (error) {
      console.error('Error interacting with UI:', error)
      setDebugInfo(`Error interacting with UI: ${error}`)
      return `I encountered an error while trying to interact with the UI. Please try again.`
    }
  }
  
  // Function to search for content on the page
  const searchForContent = (searchTerm: string): string => {
    try {
      const textNodes = []
      const searchTermLower = searchTerm.toLowerCase()
      
      // Walk through all text nodes on the page
      const walk = document.createTreeWalker(
        document.body, 
        NodeFilter.SHOW_TEXT, 
        null
      )
      
      let node
      while (node = walk.nextNode()) {
        const text = node.textContent?.trim()
        if (text && text.toLowerCase().includes(searchTermLower)) {
          textNodes.push(node)
        }
      }
      
      if (textNodes.length === 0) {
        return `I couldn't find any content containing "${searchTerm}" on the current page.`
      }
      
      // Find the most relevant one (first one that is visible)
      let bestNode = null
      for (const node of textNodes) {
        const element = node.parentElement
        if (element) {
          const rect = element.getBoundingClientRect()
          if (getElementVisibility(rect) > 0.3) { // Reasonably visible
            bestNode = node
            break
          }
        }
      }
      
      if (!bestNode && textNodes.length > 0) {
        bestNode = textNodes[0] // Fallback to first match if none are visible
      }
      
      if (bestNode && bestNode.parentElement) {
        // Highlight the found content
        const element = bestNode.parentElement
        const originalBackground = element.style.background
        const originalColor = element.style.color
        
        element.style.background = 'var(--color-primary, #00eeff)'
        element.style.color = 'var(--color-dark, #0e141b)'
        
        // Scroll to the content
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        
        // Reset styles after a delay
        setTimeout(() => {
          element.style.background = originalBackground
          element.style.color = originalColor
        }, 3000)
        
        const surroundingText = bestNode.textContent?.trim()
        return `I found content matching "${searchTerm}" on the page: "${surroundingText?.substring(0, 100)}${surroundingText && surroundingText.length > 100 ? '...' : ''}"`
      }
      
      return `I found content matching "${searchTerm}" but couldn't highlight it.`
    } catch (error) {
      console.error('Error searching for content:', error)
      return `I encountered an error while searching for "${searchTerm}".`
    }
  }

  // If not on client yet, return null to prevent hydration issues
  if (!isClient) {
    return null
  }

  // If browser doesn't support speech recognition, show a simplified button
  if (!isBrowserSupported) {
    return (
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          className="bg-surface/90 text-primary p-3 rounded-full opacity-50 cursor-not-allowed"
          disabled
          title="Voice navigation not supported in this browser"
        >
          <FiMicOff size={24} />
        </button>
        <div className="mt-2 bg-dark/90 text-xs text-primary p-2 rounded text-center max-w-xs">
          Voice navigation not supported in this browser. Try Chrome or Edge.
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Voice control button with AI indicator */}
      <motion.button
        onClick={isListening ? stopListening : startListening}
        className={`fixed bottom-8 right-8 z-50 flex items-center justify-center rounded-full p-3 transition-all duration-300 ${
          isListening 
            ? 'bg-primary text-black animate-neon-pulse' 
            : 'bg-surface/90 text-primary hover:bg-primary/20'
        } border-2 border-primary/50`}
        whileTap={{ scale: 0.9 }}
        aria-label={isListening ? 'Stop listening' : 'Start voice navigation'}
      >
        {isListening ? (
          <FiMic size={24} className="animate-pulse" />
        ) : (
          <FiMic size={24} />
        )}
      </motion.button>

      {/* Permission notification for denied state */}
      <AnimatePresence>
        {permissionStatus === 'denied' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-24 right-8 z-50 bg-dark/90 backdrop-blur-md border border-red-500 px-4 py-3 rounded-md font-mono max-w-xs"
          >
            <div className="text-red-500 text-xs uppercase tracking-wider mb-1 flex items-center">
              <FiAlertTriangle className="mr-1" /> Microphone Access Required
            </div>
            <div className="text-text-secondary text-sm mb-3">
              Voice navigation requires microphone access. Please enable it in your browser settings.
            </div>
            <button 
              onClick={requestMicrophoneAccess}
              className="cyberpunk-button text-xs py-1 px-3 w-full"
            >
              Request Microphone Access
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error notification */}
      <AnimatePresence>
        {errorMessage && permissionStatus !== 'denied' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-24 right-8 z-50 bg-dark/90 backdrop-blur-md border border-red-500 px-4 py-3 rounded-md font-mono max-w-xs"
          >
            <div className="text-red-500 text-xs uppercase tracking-wider mb-1">Error</div>
            <div className="text-text-primary text-sm">
              {errorMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice command notification - enhanced with better styling */}
      <AnimatePresence>
        {showCommandNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-24 right-8 z-50 bg-dark/90 backdrop-blur-md border border-primary px-4 py-3 rounded-md font-mono max-w-xs"
          >
            <div className="text-primary text-xs uppercase tracking-wider mb-1">
              AI Voice Assistant
            </div>
            <div className="text-text-primary flex items-start">
              <span className="text-primary mr-2 mt-1">&gt;</span>
              {recognizedCommand && (
                <span>{recognizedCommand}</span>
              )}
            </div>
            {recognizedCommand === "AI Assistant Active" && (
              <div className="text-xs text-text-secondary mt-2">
                Click the mic and start speaking naturally. Try asking questions like "What projects have you worked on?"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Listening indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-dark/80 backdrop-blur-md border border-primary rounded-lg p-6 font-mono neon-outline"
          >
            <div className="text-primary text-center mb-4">
              <div className="flex justify-center mb-2">
                <FiMic size={32} className="animate-pulse" />
              </div>
              <h3 className="text-lg uppercase tracking-wider">
                AI Assistant Listening...
              </h3>
            </div>
            
            {transcript && (
              <div className="mb-6 text-center">
                <div className="text-xs text-text-secondary mb-1">I heard:</div>
                <div className="text-sm text-text-primary">{transcript}</div>
              </div>
            )}
            
            <button 
              onClick={stopListening}
              className="cyberpunk-button text-xs py-1 px-3 w-full"
            >
              Stop Listening
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Debug panel (Ctrl+Alt+D to toggle) - updated to remove chat references */}
      <AnimatePresence>
        {showDebugPanel && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-20 right-0 z-50 bg-dark/95 border-l border-t border-b border-primary p-4 rounded-l-md font-mono text-xs w-64 max-h-[70vh] overflow-y-auto"
          >
            <div className="text-primary uppercase tracking-wider mb-2 flex justify-between items-center">
              <span>Voice Debug Panel</span>
              <button 
                onClick={() => setShowDebugPanel(false)}
                className="text-text-secondary hover:text-primary"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Browser Support:</span>
                <span className={isBrowserSupported ? "text-green-500" : "text-red-500"}>
                  {isBrowserSupported ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Mic Permission:</span>
                <span className={
                  permissionStatus === 'granted' ? "text-green-500" : 
                  permissionStatus === 'denied' ? "text-red-500" : 
                  "text-yellow-500"
                }>
                  {permissionStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Listening:</span>
                <span className={isListening ? "text-green-500" : "text-text-secondary"}>
                  {isListening ? "Continuous" : "Off"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Gemini AI:</span>
                <span className={!fallbackMode ? "text-green-500" : "text-yellow-500"}>
                  {!fallbackMode ? "Active" : "Fallback Mode"}
                </span>
              </div>
              <button 
                onClick={toggleFallbackMode}
                className="cyberpunk-button text-[10px] py-1 px-2 w-full mt-2"
              >
                {fallbackMode ? "Enable Gemini AI" : "Use Fallback Mode"}
              </button>
              
              <div className="border-t border-primary/30 pt-2 mt-2">
                <div className="text-text-secondary mb-1">Debug Log:</div>
                <div className="text-primary text-[10px] bg-black/50 p-2 rounded max-h-40 overflow-y-auto">
                  {debugInfo || "No debug info yet"}
                </div>
              </div>
              
              <div className="pt-2">
                <button 
                  onClick={requestMicrophoneAccess}
                  className="cyberpunk-button text-[10px] py-1 px-2 w-full mb-2"
                >
                  Request Mic Permission
                </button>
                <button 
                  onClick={isListening ? stopListening : startListening}
                  className="cyberpunk-button text-[10px] py-1 px-2 w-full"
                >
                  {isListening ? "Stop Listening" : "Start Listening"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default VoiceNavigation 