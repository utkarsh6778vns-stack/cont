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