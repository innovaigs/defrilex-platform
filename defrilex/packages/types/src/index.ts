// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  CLIENT = 'client',
  SERVICE_PROVIDER = 'service_provider',
  ADMIN = 'admin',
}

// Service Categories
export enum ServiceCategory {
  LINGUISTS = 'linguists',
  VIRTUAL_ASSISTANTS = 'virtual_assistants',
  CUSTOMER_SERVICE = 'customer_service',
  WEB_DEVELOPERS = 'web_developers',
  DIGITAL_MARKETERS = 'digital_marketers',
  AI_AGENTS = 'ai_agents',
}

// Service Provider Profile
export interface ServiceProvider extends User {
  profile: ServiceProviderProfile;
}

export interface ServiceProviderProfile {
  id: string;
  userId: string;
  title: string;
  bio: string;
  hourlyRate: number;
  availability: AvailabilityStatus;
  skills: Skill[];
  categories: ServiceCategory[];
  portfolio: PortfolioItem[];
  languages: Language[];
  timezone: string;
  responseTime: string;
  completedProjects: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  verificationBadges: VerificationBadge[];
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  isVerified: boolean;
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  projectUrl?: string;
  category: ServiceCategory;
  tags: string[];
  createdAt: Date;
}

export interface Language {
  code: string;
  name: string;
  proficiency: LanguageProficiency;
}

export enum LanguageProficiency {
  BASIC = 'basic',
  CONVERSATIONAL = 'conversational',
  FLUENT = 'fluent',
  NATIVE = 'native',
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  UNAVAILABLE = 'unavailable',
}

export interface VerificationBadge {
  id: string;
  type: VerificationType;
  issuedAt: Date;
  expiresAt?: Date;
}

export enum VerificationType {
  IDENTITY = 'identity',
  SKILL = 'skill',
  BACKGROUND_CHECK = 'background_check',
  EDUCATION = 'education',
  CERTIFICATION = 'certification',
}

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  subcategory?: string;
  clientId: string;
  serviceProviderId?: string;
  status: ProjectStatus;
  budget: ProjectBudget;
  timeline: ProjectTimeline;
  requirements: string[];
  attachments: Attachment[];
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  UNDER_REVIEW = 'under_review',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
}

export interface ProjectBudget {
  type: BudgetType;
  amount: number;
  currency: string;
  hourlyRate?: number;
  estimatedHours?: number;
}

export enum BudgetType {
  FIXED = 'fixed',
  HOURLY = 'hourly',
}

export interface ProjectTimeline {
  startDate?: Date;
  endDate?: Date;
  estimatedDuration: number; // in days
  actualDuration?: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: MilestoneStatus;
  deliverables: string[];
  createdAt: Date;
  completedAt?: Date;
}

export enum MilestoneStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

// Proposal Types
export interface Proposal {
  id: string;
  projectId: string;
  serviceProviderId: string;
  coverLetter: string;
  proposedBudget: ProjectBudget;
  proposedTimeline: ProjectTimeline;
  milestones: ProposedMilestone[];
  attachments: Attachment[];
  status: ProposalStatus;
  submittedAt: Date;
  respondedAt?: Date;
}

export enum ProposalStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export interface ProposedMilestone {
  title: string;
  description: string;
  amount: number;
  estimatedDays: number;
  deliverables: string[];
}

// Message Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: MessageType;
  attachments: Attachment[];
  isRead: boolean;
  sentAt: Date;
  editedAt?: Date;
}

export enum MessageType {
  TEXT = 'text',
  FILE = 'file',
  IMAGE = 'image',
  SYSTEM = 'system',
}

export interface Conversation {
  id: string;
  projectId?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface Review {
  id: string;
  projectId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  categories: ReviewCategory[];
  isPublic: boolean;
  createdAt: Date;
  response?: ReviewResponse;
}

export interface ReviewCategory {
  name: string;
  rating: number;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  content: string;
  createdAt: Date;
}

// Payment Types
export interface Payment {
  id: string;
  projectId: string;
  milestoneId?: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  createdAt: Date;
  processedAt?: Date;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  DISPUTED = 'disputed',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CRYPTOCURRENCY = 'cryptocurrency',
}

// Search Types
export interface SearchFilters {
  category?: ServiceCategory;
  subcategory?: string;
  priceRange?: PriceRange;
  rating?: number;
  availability?: AvailabilityStatus;
  languages?: string[];
  skills?: string[];
  location?: string;
  timezone?: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface SearchResult {
  providers: ServiceProvider[];
  totalCount: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export enum NotificationType {
  PROJECT_UPDATE = 'project_update',
  NEW_MESSAGE = 'new_message',
  PROPOSAL_RECEIVED = 'proposal_received',
  PROPOSAL_ACCEPTED = 'proposal_accepted',
  MILESTONE_COMPLETED = 'milestone_completed',
  PAYMENT_RECEIVED = 'payment_received',
  REVIEW_RECEIVED = 'review_received',
  SYSTEM_ANNOUNCEMENT = 'system_announcement',
}
