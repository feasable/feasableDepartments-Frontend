export interface UserProfile {
  id: string
  email: string
  first_name?: string
  last_name?: string
  company_name?: string
  company_size?: CompanySize
  industry?: string
  role?: UserRole
  Spaces?: Department[]
  primary_goal?: PrimaryGoal
  phone?: string
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export type CompanySize = '1' | '2-10' | '11-50' | '51-200' | '201-1000' | '1000+'

export type UserRole = 
  | 'Founder/CEO'
  | 'Operations Manager'
  | 'Marketing Manager'
  | 'Sales Manager'
  | 'HR Manager'
  | 'Product Manager'
  | 'Engineer'
  | 'Other'

export type Department = 
  | 'Sales'
  | 'Marketing'
  | 'HR'
  | 'Finance'
  | 'Operations'
  | 'Customer Service'
  | 'Product'
  | 'Engineering'

export type PrimaryGoal =
  | 'Save time on repetitive tasks'
  | 'Reduce operational costs'
  | 'Scale without hiring'
  | 'Improve team efficiency'
  | 'Better customer experience'
  | 'Data-driven decisions'

export interface OnboardingData {
  firstName: string
  lastName: string
  companyName: string
  companySize: CompanySize
  role: UserRole
  Spaces: Department[]
  primaryGoal: PrimaryGoal
  phone?: string
}
