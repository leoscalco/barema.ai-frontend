export interface User {
  id: string
  email: string
  full_name: string
  cpf?: string
  phone?: string
  crm?: string
  specialty?: string
  city?: string
  state?: string
  subscription_tier?: 'free' | 'basic' | 'premium'
  total_score?: number
  is_active: boolean
  is_verified: boolean
  created_at: string
}

export interface Certificate {
  id: string
  user_id: string
  title: string
  institution: string
  category: string
  workload_hours: number
  start_date: string
  end_date: string
  issue_date: string
  status: 'pending' | 'processing' | 'validated' | 'rejected' | 'approved' | 'needs_review'
  ai_confidence?: number
  extraction_confidence?: number
  file_path: string
  extracted_data?: any
  created_at: string
}

export interface Edict {
  id: string
  code: string
  title: string
  institution: string
  state: string
  deadline: string
  barema_config: any
  created_at: string
}

export interface EdictEvaluation {
  edict_id: string
  total_score: number
  max_score: number
  category_scores: any
  gaps: any[]
  position?: number
  created_at: string
}

export interface RankingEntry {
  rank: number
  user_id: string
  full_name: string
  state: string
  score: number
  percentile: number
}
