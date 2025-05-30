// validations.ts
import type { AiModel, LlmConfig, EmbeddingConfig } from './types';

/**
 * Validates model configuration based on model type
 */
export const validateModelConfiguration = (
  modelType: string,
  config: Record<string, any>
): { valid: boolean; message?: string } => {
  switch (modelType) {
    case 'llm': {
      const llmConfig = config as LlmConfig;
      
      // Common validation
      if (!llmConfig.apiKey) {
        return { valid: false, message: 'API Key is required' };
      }
      
      if (!llmConfig.model) {
        return { valid: false, message: 'Model name is required' };
      }
      
      // Provider-specific validation
      if (llmConfig.modelType === 'openai') {
        // Client ID is now optional
        return { valid: true };
      } 
      if (llmConfig.modelType === 'azure') {
        if (!llmConfig.endpoint) {
          return { valid: false, message: 'Endpoint is required for Azure OpenAI' };
        }
        
        if (!llmConfig.deploymentName) {
          return { valid: false, message: 'Deployment Name is required for Azure OpenAI' };
        }
      }
      
      return { valid: true };
    }
    
    case 'ocr': {
      if (!config.apiKey) {
        return { valid: false, message: 'API Key is required' };
      }
      
      if (!config.name) {
        return { valid: false, message: 'Provider name is required' };
      }
      
      // Some OCR providers require an endpoint
      if (['Azure Document Intelligence', 'Google Document AI'].includes(config.name) && !config.endpoint) {
        return { valid: false, message: `Endpoint is required for ${config.name}` };
      }
      
      return { valid: true };
    }
    
    case 'embedding': {
      const embeddingConfig = config as EmbeddingConfig;
      
      // If using default, no validation needed
      if (embeddingConfig.modelType === 'default') {
        return { valid: true };
      }
      
      // Common validation for both OpenAI and Azure
      if (!embeddingConfig.apiKey) {
        return { valid: false, message: 'API Key is required' };
      }
      
      if (!embeddingConfig.model) {
        return { valid: false, message: 'Model name is required' };
      }
      
      // Azure-specific validation
      if (embeddingConfig.modelType === 'azureOpenAI' && !embeddingConfig.endpoint) {
        return { valid: false, message: 'Endpoint is required for Azure OpenAI' };
      }
      
      return { valid: true };
    }
    
    case 'slm':
    case 'reasoning': {
      if (!config.apiKey) {
        return { valid: false, message: 'API Key is required' };
      }
      
      if (!config.name) {
        return { valid: false, message: 'Provider name is required' };
      }
      
      if (!config.model) {
        return { valid: false, message: 'Model name is required' };
      }
      
      return { valid: true };
    }
    
    case 'multiModal': {
      if (!config.apiKey) {
        return { valid: false, message: 'API Key is required' };
      }
      
      if (!config.name) {
        return { valid: false, message: 'Provider name is required' };
      }
      
      if (!config.model) {
        return { valid: false, message: 'Model name is required' };
      }
      
      // Some multimodal providers require an endpoint
      if (['Azure OpenAI', 'Google AI'].includes(config.name) && !config.endpoint) {
        return { valid: false, message: `Endpoint is required for ${config.name}` };
      }
      
      return { valid: true };
    }
    
    default:
      return { valid: false, message: `Unknown model type: ${modelType}` };
  }
};

/**
 * Checks if a model configuration exists for the given type
 */
export const validateModelHasConfiguration = (aiModels: AiModel[], type: string): boolean => {
  const model = aiModels.find((m) => m.type === type);
  return model ? model.configurations.length > 0 : false;
};