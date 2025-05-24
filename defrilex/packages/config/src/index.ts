// Environment configuration
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

// API configuration
export const API_CONFIG = {
  BASE_URL: ENV.API_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
      VERIFY_EMAIL: '/auth/verify-email',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    USERS: {
      PROFILE: '/users/profile',
      UPDATE_PROFILE: '/users/profile',
      UPLOAD_AVATAR: '/users/avatar',
      VERIFY_IDENTITY: '/users/verify-identity',
    },
    PROVIDERS: {
      LIST: '/providers',
      SEARCH: '/providers/search',
      PROFILE: '/providers/:id',
      CREATE_PROFILE: '/providers/profile',
      UPDATE_PROFILE: '/providers/profile',
      PORTFOLIO: '/providers/portfolio',
      SKILLS: '/providers/skills',
      VERIFICATION: '/providers/verification',
    },
    PROJECTS: {
      LIST: '/projects',
      CREATE: '/projects',
      DETAIL: '/projects/:id',
      UPDATE: '/projects/:id',
      DELETE: '/projects/:id',
      PROPOSALS: '/projects/:id/proposals',
      MILESTONES: '/projects/:id/milestones',
      FILES: '/projects/:id/files',
    },
    PROPOSALS: {
      CREATE: '/proposals',
      UPDATE: '/proposals/:id',
      ACCEPT: '/proposals/:id/accept',
      REJECT: '/proposals/:id/reject',
      WITHDRAW: '/proposals/:id/withdraw',
    },
    MESSAGES: {
      CONVERSATIONS: '/messages/conversations',
      CONVERSATION: '/messages/conversations/:id',
      SEND: '/messages/send',
      MARK_READ: '/messages/:id/read',
    },
    PAYMENTS: {
      METHODS: '/payments/methods',
      PROCESS: '/payments/process',
      HISTORY: '/payments/history',
      ESCROW: '/payments/escrow',
      RELEASE: '/payments/release',
    },
    REVIEWS: {
      CREATE: '/reviews',
      UPDATE: '/reviews/:id',
      RESPOND: '/reviews/:id/respond',
      LIST: '/reviews',
    },
    NOTIFICATIONS: {
      LIST: '/notifications',
      MARK_READ: '/notifications/:id/read',
      MARK_ALL_READ: '/notifications/read-all',
      PREFERENCES: '/notifications/preferences',
    },
    SEARCH: {
      PROVIDERS: '/search/providers',
      PROJECTS: '/search/projects',
      SUGGESTIONS: '/search/suggestions',
    },
    ADMIN: {
      USERS: '/admin/users',
      PROVIDERS: '/admin/providers',
      PROJECTS: '/admin/projects',
      ANALYTICS: '/admin/analytics',
      REPORTS: '/admin/reports',
    },
  },
} as const;

// Application constants
export const APP_CONFIG = {
  NAME: 'Defrilex',
  DESCRIPTION: 'Premium marketplace connecting clients with elite professionals',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@defrilex.com',
  CONTACT_EMAIL: 'contact@defrilex.com',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // File uploads
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  
  // Validation
  MIN_PASSWORD_LENGTH: 8,
  MAX_BIO_LENGTH: 1000,
  MAX_PROJECT_DESCRIPTION_LENGTH: 5000,
  MAX_PROPOSAL_LENGTH: 2000,
  
  // Rating system
  MIN_RATING: 1,
  MAX_RATING: 5,
  
  // Search
  SEARCH_DEBOUNCE_MS: 300,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_RESULTS: 50,
  
  // Real-time updates
  WS_RECONNECT_INTERVAL: 5000,
  WS_MAX_RECONNECT_ATTEMPTS: 10,
  
  // Cache
  CACHE_DURATION: {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 30 * 60 * 1000, // 30 minutes
    LONG: 24 * 60 * 60 * 1000, // 24 hours
  },
} as const;

// Service categories configuration
export const SERVICE_CATEGORIES = {
  LINGUISTS: {
    id: 'linguists',
    label: 'Linguists',
    icon: '🌐',
    description: 'Translation, interpretation, and localization services',
    subcategories: [
      'Translation',
      'Interpretation',
      'Localization',
      'Proofreading',
      'Transcription',
      'Voice Over',
    ],
  },
  VIRTUAL_ASSISTANTS: {
    id: 'virtual_assistants',
    label: 'Virtual Assistants',
    icon: '🤖',
    description: 'Administrative, personal, and specialized support',
    subcategories: [
      'Administrative Support',
      'Personal Assistant',
      'Data Entry',
      'Research',
      'Email Management',
      'Calendar Management',
    ],
  },
  CUSTOMER_SERVICE: {
    id: 'customer_service',
    label: 'Customer Service',
    icon: '💬',
    description: 'Support, chat, and phone assistance',
    subcategories: [
      'Live Chat Support',
      'Phone Support',
      'Email Support',
      'Technical Support',
      'Sales Support',
      'Social Media Support',
    ],
  },
  WEB_DEVELOPERS: {
    id: 'web_developers',
    label: 'Web Developers',
    icon: '💻',
    description: 'Frontend, backend, and full-stack development',
    subcategories: [
      'Frontend Development',
      'Backend Development',
      'Full-Stack Development',
      'Mobile Development',
      'E-commerce Development',
      'API Development',
    ],
  },
  DIGITAL_MARKETERS: {
    id: 'digital_marketers',
    label: 'Digital Marketers',
    icon: '📈',
    description: 'Social media, PPC, content, and strategy',
    subcategories: [
      'Social Media Marketing',
      'PPC Advertising',
      'Content Marketing',
      'SEO',
      'Email Marketing',
      'Marketing Strategy',
    ],
  },
  AI_AGENTS: {
    id: 'ai_agents',
    label: 'AI Agents',
    icon: '🧠',
    description: 'Automation, chatbots, and AI implementation',
    subcategories: [
      'Chatbot Development',
      'Process Automation',
      'AI Integration',
      'Machine Learning',
      'Data Analysis',
      'AI Consulting',
    ],
  },
} as const;

// Theme configuration
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#1a365d', // Primary Navy
    },
    SECONDARY: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#f7fafc', // Warm Gray
    },
    ACCENT: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#d69e2e', // Premium Gold
    },
    SUCCESS: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#38a169', // Confident Green
    },
    WARNING: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#ed8936', // Attention Orange
    },
    ERROR: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#e53e3e', // Clear Red
    },
  },
  FONTS: {
    PRIMARY: 'Inter, system-ui, sans-serif',
    DISPLAY: 'Poppins, system-ui, sans-serif',
    CODE: 'JetBrains Mono, Consolas, monospace',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    '2XL': '3rem',
    '3XL': '4rem',
  },
  BORDER_RADIUS: {
    SM: '0.25rem',
    MD: '0.375rem',
    LG: '0.5rem',
    XL: '0.75rem',
    '2XL': '1rem',
    FULL: '9999px',
  },
  SHADOWS: {
    SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    MD: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    LG: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    XL: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_VIDEO_CALLS: true,
  ENABLE_AI_MATCHING: true,
  ENABLE_CRYPTOCURRENCY_PAYMENTS: false,
  ENABLE_ADVANCED_ANALYTICS: true,
  ENABLE_REAL_TIME_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: true,
  ENABLE_MULTI_LANGUAGE: false,
  ENABLE_MOBILE_APP: true,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait and try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully.',
  PROJECT_CREATED: 'Project created successfully.',
  PROPOSAL_SUBMITTED: 'Proposal submitted successfully.',
  MESSAGE_SENT: 'Message sent successfully.',
  PAYMENT_PROCESSED: 'Payment processed successfully.',
  REVIEW_SUBMITTED: 'Review submitted successfully.',
  FILE_UPLOADED: 'File uploaded successfully.',
  EMAIL_VERIFIED: 'Email verified successfully.',
  PASSWORD_RESET: 'Password reset successfully.',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'defrilex_auth_token',
  REFRESH_TOKEN: 'defrilex_refresh_token',
  USER_PREFERENCES: 'defrilex_user_preferences',
  SEARCH_HISTORY: 'defrilex_search_history',
  DRAFT_PROJECTS: 'defrilex_draft_projects',
  THEME_PREFERENCE: 'defrilex_theme',
  LANGUAGE_PREFERENCE: 'defrilex_language',
} as const;

// Regular expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  PHONE: /^\+?[\d\s\-\(\)]+$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
} as const;
