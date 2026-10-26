export type PhoneApp = 
  | 'home' 
  | 'youtube' 
  | 'instagram' 
  | 'phone' 
  | 'camera' 
  | 'whatsapp' 
  | 'settings' 
  | 'spotify';

export interface CommandLog {
  id: string;
  timestamp: string;
  input: string;
  action: string;
  target?: string;
  parameter?: string;
  response: string;
  status: 'success' | 'running' | 'failed';
  source: 'voice' | 'text' | 'button_hold' | 'quick_pill';
}

export interface PermissionItem {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  systemKey: string;
  descriptionHindi: string;
  descriptionEnglish: string;
  granted: boolean;
  requiredFor: string;
  isCore: boolean;
  instructionHindi: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  avatarBg: string;
}

export interface AutoScrollConfig {
  active: boolean;
  intervalMs: number;
  direction: 'down' | 'up';
}
