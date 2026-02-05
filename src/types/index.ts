// User interface
interface User {
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

// Certificate interface
interface Certificate {
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
  extracted_data: any
  created_at: string
}

// Conditional points for edict criteria
interface ConditionalPoints {
  trigger: string
  additional_points: number
  description?: string
}

// Edict criterion (single evaluation rule)
interface EdictCriterion {
  program?: string
  department?: string
  display_order: number
  sub_order?: number
  category_slug: string
  description: string
  unit_points: number
  conditionals?: ConditionalPoints[]
  item_limit?: number
  max_points?: number
  search_keywords?: string[]
}

// Edict (Edital) interface
interface Edict {
  id: string
  code: string
  title: string
  description?: string
  institution: string
  state?: string
  city?: string
  status: string
  year?: number
  programs?: string[]
  departments?: string[]
  barema_config: {
    criteria: EdictCriterion[]
    programs?: string[]
    departments?: string[]
    year?: number
    footnotes?: string[]
  }
  settings: any
  created_at: string
  updated_at?: string
  published_at?: string
}

// Edict evaluation interface
interface EdictEvaluation {
  edict_id: string
  total_score: number
  max_score: number
  category_scores: any
  gaps: any[]
  position?: number
  created_at: string
}

// Ranking entry interface
interface RankingEntry {
  rank: number
  user_id: string
  full_name: string
  state: string
  score: number
  percentile: number
}

// Exports
export type {
  User,
  Certificate,
  ConditionalPoints,
  EdictCriterion,
  Edict,
  EdictEvaluation,
  RankingEntry
}
