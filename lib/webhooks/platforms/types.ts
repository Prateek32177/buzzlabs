import React from 'react';
import { WebhookPlatform } from '../types';
export interface PlatformField {
  key: string;
  label: string;
  description: string;
  type: 'text' | 'secret' | 'select';
  placeholder?: string;
  required?: boolean;
  readOnly: boolean;
  options?: { label: string; value: string }[];
}

export interface WebhookPlatformConfig {
  id: WebhookPlatform;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: PlatformField[];
  docs?: string;
  verificationHeaders?: string[]; // Headers to show in integration guide
  exampleCode?: {
    curl?: string;
    node?: string;
    python?: string;
  };
  showSaveButton?: boolean;
}
