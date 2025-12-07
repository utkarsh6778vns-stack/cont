export interface PitchFormData {
  recipientName: string;
  recipientEmail?: string;
  recipientCompany: string;
  recipientWebsite?: string;
  senderName: string;
  senderPortfolio?: string;
  tone: ToneType;
  specificFocus: string;
}

export enum ToneType {
  PROFESSIONAL = 'Professional',
  CASUAL = 'Casual',
  PERSUASIVE = 'Persuasive',
  DIRECT = 'Direct'
}

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export interface BulkLead {
  id: string;
  recipientName: string;
  recipientEmail?: string;
  recipientCompany: string;
  recipientWebsite?: string;
}

export interface BulkEmailJob {
  lead: BulkLead;
  status: 'pending' | 'processing' | 'completed' | 'error';
  result?: GeneratedEmail;
  error?: string;
}

export interface SenderStrategyData {
  senderName: string;
  senderPortfolio: string;
  tone: ToneType;
  specificFocus: string;
}