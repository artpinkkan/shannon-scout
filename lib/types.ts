// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = "Admin" | "Recruiter" | "Candidate" | "Interviewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  tenantId: string;
  createdAt: string;
}

// ─── Tenant / Organization ───────────────────────────────────────────────────

export type Industry = "finance" | "tech" | "banking" | "hr" | "other";

export interface Tenant {
  id: string;
  name: string;
  shortName: string;
  industry: Industry;
  complianceFlag: boolean; // POJK / regulatory bound
  logoInitials: string;
  color: string;
  planTier: "starter" | "growth" | "enterprise";
  interviewHours: number;
  costThisMonth: number;
  asrProvider: "Google STT" | "Azure Speech" | "Whisper" | "In-house";
  wer: number; // Word Error Rate %
  der: number; // Diarisation Error Rate %
  createdAt: string;
}

// ─── Jobs ───────────────────────────────────────────────────────────────────

export type JobStatus = "draft" | "active" | "paused" | "closed";

export interface Job {
  id: string;
  tenantId: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  salaryMin: number;
  salaryMax: number;
  currency: string;
  description: string;
  requirements: string[];
  status: JobStatus;
  applicantCount: number;
  postedAt: string;
  closesAt: string;
  recruiterName: string;
}

// ─── Candidates ─────────────────────────────────────────────────────────────

export type PipelineStage =
  | "screening"
  | "interview"
  | "decision"
  | "hired"
  | "rejected";

export interface CandidateNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  currentRole: string;
  currentCompany: string;
  yearsExperience: number;
  skills: string[];
  education: string;
  university: string;
  gpa: number;
  languages: string[];
  linkedIn: string;
  avatarInitials: string;
  avatarColor: string;
  stage: PipelineStage;
  jobId: string;
  jobTitle: string;
  tenantId: string;
  appliedAt: string;
  score: number; // 0-100 AI match score
  tags: string[];
  notes: CandidateNote[];
  resumeUrl: string;
}

// ─── Interviews ──────────────────────────────────────────────────────────────

export type InterviewStatus = "scheduled" | "live" | "completed" | "cancelled";

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  tenantId: string;
  interviewerName: string;
  interviewerRole: string;
  status: InterviewStatus;
  scheduledAt: string;
  durationMinutes: number;
  recordingUrl?: string;
  transcriptReady: boolean;
  language: "id" | "en" | "mixed";
  asrProvider: string;
  wer?: number;
}

// ─── Transcript ──────────────────────────────────────────────────────────────

export type Speaker = "S1" | "S2";

export interface TranscriptSegment {
  id: string;
  speaker: Speaker;
  speakerLabel: string; // "Interviewer" | "Candidate"
  startTime: number; // seconds
  endTime: number;
  text: string;
  confidence: number; // 0-1
  isFinal: boolean;
  hasCodeSwitch: boolean; // contains EN words in ID sentence or vice versa
  codeSwitchWords?: string[]; // words that are code-switched
  keyTerms?: string[];
  language: "id" | "en" | "mixed";
}

// ─── Post-Interview AI ───────────────────────────────────────────────────────

export interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  done: boolean;
}

export interface TopicSegment {
  id: string;
  topic: string;
  startTime: number;
  endTime: number;
  summaryLine: string;
  keywords: string[];
}

export interface KeyDecision {
  id: string;
  decision: string;
  madeBy: string;
  timestamp: number;
  context: string;
}

export interface InterviewReview {
  interviewId: string;
  summaryId: string;
  overallId: string;
  summaryBahasa: string;
  summaryEnglish: string;
  actionItems: ActionItem[];
  topicSegments: TopicSegment[];
  keyDecisions: KeyDecision[];
  overallRecommendation: "strong_hire" | "hire" | "no_hire" | "strong_no_hire";
  strengthHighlights: string[];
  concernAreas: string[];
  generatedAt: string;
}

// ─── Glossary ───────────────────────────────────────────────────────────────

export type GlossaryCategory =
  | "finance"
  | "tech"
  | "hr"
  | "banking"
  | "acronym"
  | "custom";

export interface GlossaryTerm {
  id: string;
  tenantId: string;
  term: string;
  expansion?: string; // for acronyms
  pronunciation?: string;
  category: GlossaryCategory;
  hitCount: number;
  lastSeen?: string;
  addedBy: string;
  addedAt: string;
}

// ─── NLP Settings ────────────────────────────────────────────────────────────

export interface NLPSettings {
  tenantId: string;
  enablePunctuation: boolean;
  enableInverseTextNorm: boolean;
  enableFillerRemoval: boolean;
  fillerWords: string[];
  enableCodeSwitchLabelling: boolean;
  codeSwitchHighlightColor: "yellow" | "blue" | "purple" | "green";
  enableParticleNorm: boolean;
  particlesTarget: string[]; // e.g. ["lah", "kan", "nih"]
  enableGlossaryCorrection: boolean;
  confidenceThreshold: number; // 0-1
  asrLatencyTargetMs: number;
  diarizationEnabled: boolean;
  minSpeakers: number;
  maxSpeakers: number;
}

// ─── Admin Stats ─────────────────────────────────────────────────────────────

export interface AdminStats {
  totalInterviews: number;
  totalHoursTranscribed: number;
  totalCostThisMonth: number;
  activeTenantsCount: number;
  avgWER: number;
  avgDER: number;
  interviewsThisWeek: number;
  tenantBreakdown: TenantUsage[];
}

export interface TenantUsage {
  tenantId: string;
  tenantName: string;
  interviewsThisMonth: number;
  hoursTranscribed: number;
  costThisMonth: number;
  asrProvider: string;
  wer: number;
  der: number;
  planTier: string;
  complianceFlag: boolean;
}
