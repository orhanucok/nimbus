// app/config.tsx â€” Multi-provider LLM config for Nimbus
// Switch providers via LLM_PROVIDER and FC_LLM_PROVIDER in .env.local

type ProviderName = 'deepseek' | 'openai' | 'groq' | 'xai' | 'openrouter' | 'ollama';

const PRIMARY: ProviderName = (process.env.LLM_PROVIDER as ProviderName) || 'deepseek';
const FC: ProviderName = (process.env.FC_LLM_PROVIDER as ProviderName) || 'groq';

const PROVIDERS: Record<ProviderName, { baseURL: string; apiKey: string | undefined; model: string }> = {
  deepseek: {
    baseURL: 'https://api.deepseek.com/v1',
    apiKey: process.env.DEEPSEEK_API_KEY,
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  },
  openai: {
    baseURL: 'https://api.openai.com/v1',
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  groq: {
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  },
  xai: {
    baseURL: 'https://api.x.ai/v1',
    apiKey: process.env.XAI_API_KEY,
    model: process.env.XAI_MODEL || 'grok-beta',
  },
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct',
  },
  ollama: {
    baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1',
    apiKey: process.env.OLLAMA_API_KEY || 'ollama',
    model: process.env.OLLAMA_MODEL || 'llama3.2',
  },
};

const primary = PROVIDERS[PRIMARY];
const fc = PROVIDERS[FC];

export const config = {
  // Active provider (echo for debugging)
  provider: PRIMARY,
  fcProvider: FC,

  // Primary chat
  BaseURL: primary.baseURL,
  API_KEY: primary.apiKey,
  Model: primary.model,

  // Function calling / vision (separate, lighter model)
  fcBaseURL: fc.baseURL,
  fcAPI_KEY: fc.apiKey,
  fcModel: fc.model,

  // Misc
  useRateLimiting: process.env.USE_RATE_LIMITING !== 'false',
  numberOfPagesToScan: 10,
  numberOfTweetToScan: 10,
};

