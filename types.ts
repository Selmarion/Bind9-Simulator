export enum ConfigType {
  NAMED_CONF = 'named.conf',
  FORWARD_ZONE = 'forward.zone',
  REVERSE_ZONE = 'reverse.zone'
}

export interface FileConfig {
  id: string;
  type: ConfigType;
  name: string;
  content: string;
  description: string;
}

export interface ValidationError {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  generalFeedback?: string;
}

export interface AnalysisResult {
  type: 'validation' | 'explanation';
  data: string | ValidationResult;
  isLoading: boolean;
}