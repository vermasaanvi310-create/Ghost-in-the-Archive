import React, { useState } from 'react';
import { useArchive } from '../context/ArchiveContext';
import { ModelInferenceMode } from '../types/archive';
import { 
  Cpu, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, 
  Terminal, Globe, HardDrive, Wifi, WifiOff, Check, AlertCircle, Loader2, Sparkles 
} from 'lucide-react';

export const OpenAILabPage: React.FC = () => {
  const { modelConfig, setModelConfig, modelHealth, checkModelHealth } = useArchive();

  const [mode, setMode] = useState<ModelInferenceMode>(modelConfig.mode);
  const [ollamaUrl, setOllamaUrl] = useState(modelConfig.ollamaUrl);
  const [ollamaModel, setOllamaModel] = useState(modelConfig.ollamaModel);
  const [customEndpointUrl, setCustomEndpointUrl] = useState(modelConfig.customEndpointUrl);
  const [customModelName, setCustomModelName] = useState(modelConfig.customModelName);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveConfig = () => {
    setModelConfig({
      mode,
      ollamaUrl: ollamaUrl.trim(),
      ollamaModel: ollamaModel.trim(),
      customEndpointUrl: customEndpointUrl.trim(),
      customModelName: customModelName.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    checkModelHealth();
  };

  const handleRunHealthCheck = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      await checkModelHealth();
      setTestResult('Health inspection complete. Status updated below.');
    } catch (e: any) {
      setTestResult(`Health check failed: ${e.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs tracking-widest uppercase text-[#D6AD62]">
          <span>Open AI Architecture & Weights</span>
          <span aria-hidden="true">·</span>
          <span>Technical Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F0E8D8] tracking-tight">
          The Open AI Laboratory
        </h1>
        <p className="text-sm text-[#9E9689] font-editorial leading-relaxed">
          Inspect, configure, and verify the model architecture powering Ghost in the Archive. We believe in absolute transparency regarding where your data travels and how inference occurs.
        </p>
      </div>

      {/* Model Verification Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Connection Status */}
        <div className="p-5 rounded-lg bg-[#131219] border border-[#D6AD62]/20 space-y-2">
          <span className="text-[11px] font-mono-numbers uppercase text-[#9E9689] tracking-wider">
            Verification Status
          </span>
          <div className="flex items-center gap-2">
            {modelHealth?.status === 'connected' ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-300">Verified Connected</span>
              </>
            ) : modelHealth?.status === 'fallback_ready' ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-[#D6AD62]" />
                <span className="text-sm font-bold text-[#D6AD62]">Server Host Ready</span>
              </>
            ) : modelHealth?.status === 'offline_search' ? (
              <>
                <ShieldCheck className="w-5 h-5 text-sky-400" />
                <span className="text-sm font-bold text-sky-300">Offline Search Only</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <span className="text-sm font-bold text-rose-300">Endpoint Unreachable</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-[#9E9689] font-editorial">
            {modelHealth?.status === 'connected'
              ? 'Local runner responded with valid model tags.'
              : modelHealth?.status === 'fallback_ready'
              ? 'Cloud developer proxy verified and responding.'
              : 'Deterministic passage extraction active.'}
          </p>
        </div>

        {/* Card 2: Inference Mode */}
        <div className="p-5 rounded-lg bg-[#131219] border border-[#D6AD62]/20 space-y-2">
          <span className="text-[11px] font-mono-numbers uppercase text-[#9E9689] tracking-wider">
            Inference Realm
          </span>
          <div className="flex items-center gap-2">
            {modelHealth?.isLocal ? (
              <>
                <HardDrive className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-300">100% Local Machine</span>
              </>
            ) : (
              <>
                <Globe className="w-5 h-5 text-[#D6AD62]" />
                <span className="text-sm font-bold text-[#D6AD62]">Hosted Cloud Adapter</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-[#9E9689] font-editorial">
            {modelHealth?.isLocal
              ? 'Archive data never leaves your computer.'
              : 'Queries processed via backend server proxy.'}
          </p>
        </div>

        {/* Card 3: Internet Requirement */}
        <div className="p-5 rounded-lg bg-[#131219] border border-[#D6AD62]/20 space-y-2">
          <span className="text-[11px] font-mono-numbers uppercase text-[#9E9689] tracking-wider">
            Network Requirement
          </span>
          <div className="flex items-center gap-2">
            {modelHealth?.isOfflineCapable ? (
              <>
                <WifiOff className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-300">Offline Capable</span>
              </>
            ) : (
              <>
                <Wifi className="w-5 h-5 text-[#9E9689]" />
                <span className="text-sm font-bold text-[#F0E8D8]">Internet Required</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-[#9E9689] font-editorial">
            {modelHealth?.isOfflineCapable
              ? 'Runs without active internet when local.'
              : 'Requires network connection for remote API.'}
          </p>
        </div>

        {/* Card 4: Model License */}
        <div className="p-5 rounded-lg bg-[#131219] border border-[#D6AD62]/20 space-y-2">
          <span className="text-[11px] font-mono-numbers uppercase text-[#9E9689] tracking-wider">
            Model License
          </span>
          <div className="text-sm font-bold text-[#D6AD62] truncate">
            {modelHealth?.license || 'Open Weights'}
          </div>
          <p className="text-[11px] text-[#9E9689] font-editorial truncate">
            Model: {modelHealth?.model || 'None'}
          </p>
        </div>
      </div>

      {/* Model Configuration Form */}
      <div className="p-6 sm:p-8 rounded-xl bg-[#14121A] border border-[#D6AD62]/30 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D6AD62]/15">
          <div>
            <h3 className="text-xl font-bold text-[#F0E8D8]">Inference Adapter Configuration</h3>
            <p className="text-xs text-[#9E9689] font-editorial">
              Switch between local Ollama (Gemma 2, Qwen 2.5), a custom OpenAI-compatible endpoint, or the pre-configured server proxy.
            </p>
          </div>
          <button
            onClick={handleRunHealthCheck}
            disabled={isTesting}
            className="px-3.5 py-2 text-xs font-medium text-[#F0E8D8] hover:text-[#D6AD62] border border-[#D6AD62]/20 hover:border-[#D6AD62] rounded bg-[#131219] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>Test Connection Health</span>
          </button>
        </div>

        {/* Health Check Details Output */}
        {modelHealth?.details && (
          <div className="p-4 rounded bg-[#100F15] border border-[#D6AD62]/15 text-xs space-y-1">
            <span className="font-semibold text-[#D6AD62] uppercase tracking-wider text-[10px]">
              Latest Verification Audit:
            </span>
            <p className="text-[#9E9689] font-editorial">{modelHealth.details}</p>
            {modelHealth.latencyMs !== undefined && (
              <div className="text-[10px] text-[#9E9689] font-mono-numbers pt-1">
                Measured Latency: {modelHealth.latencyMs} ms · Timestamp: {new Date(modelHealth.verifiedAt).toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        {/* Inference Mode Radios */}
        <div className="space-y-4">
          <label className="text-xs font-semibold tracking-wider uppercase text-[#D6AD62] block">
            Select Active Inference Engine
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Option 1: Local Ollama */}
            <div
              onClick={() => setMode('ollama_local')}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                mode === 'ollama_local'
                  ? 'bg-[#1C1825] border-[#D6AD62] text-[#F0E8D8]'
                  : 'bg-[#100F15] border-[#D6AD62]/20 text-[#9E9689] hover:border-[#D6AD62]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-[#F0E8D8]">1. Local Ollama</span>
                <span className="text-[10px] font-semibold uppercase text-emerald-400">100% Private</span>
              </div>
              <p className="text-xs text-[#9E9689] font-editorial leading-relaxed">
                Connects directly to your machine's Ollama runner (`localhost:11434`). Truly offline with Gemma 2 or Qwen 2.5.
              </p>
            </div>

            {/* Option 2: Pre-configured Server Fallback */}
            <div
              onClick={() => setMode('gemini_server')}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                mode === 'gemini_server'
                  ? 'bg-[#1C1825] border-[#D6AD62] text-[#F0E8D8]'
                  : 'bg-[#100F15] border-[#D6AD62]/20 text-[#9E9689] hover:border-[#D6AD62]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-[#F0E8D8]">2. Server Host Proxy</span>
                <span className="text-[10px] font-semibold uppercase text-[#D6AD62]">Pre-Configured</span>
              </div>
              <p className="text-xs text-[#9E9689] font-editorial leading-relaxed">
                Runs via the server-side adapter. Zero client setup needed; ready immediately for hackathon testing and demo.
              </p>
            </div>

            {/* Option 3: Custom vLLM / Endpoint */}
            <div
              onClick={() => setMode('custom_endpoint')}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                mode === 'custom_endpoint'
                  ? 'bg-[#1C1825] border-[#D6AD62] text-[#F0E8D8]'
                  : 'bg-[#100F15] border-[#D6AD62]/20 text-[#9E9689] hover:border-[#D6AD62]/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-[#F0E8D8]">3. Custom Endpoint</span>
                <span className="text-[10px] font-semibold uppercase text-sky-400">OpenAI API Spec</span>
              </div>
              <p className="text-xs text-[#9E9689] font-editorial leading-relaxed">
                Point to a self-hosted vLLM, HuggingFace TGI, or local LM Studio OpenAI-compatible runner.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Fields for Selected Mode */}
        {mode === 'ollama_local' && (
          <div className="p-5 rounded bg-[#100F15] border border-[#D6AD62]/20 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D6AD62] block">
              Ollama Connection Parameters
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-[#9E9689]">Ollama Server URL</label>
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="w-full px-3 py-2 rounded bg-[#14121A] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-xs text-[#F0E8D8] font-mono-numbers"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#9E9689]">Model Name</label>
                <input
                  type="text"
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                  placeholder="gemma2:9b or qwen2.5:7b"
                  className="w-full px-3 py-2 rounded bg-[#14121A] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-xs text-[#F0E8D8] font-mono-numbers"
                />
              </div>
            </div>

            <div className="p-3 rounded bg-[#161521] border border-[#D6AD62]/10 text-xs text-[#9E9689] space-y-1">
              <div className="font-semibold text-[#D6AD62] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Quick Setup Guide for Local Offline Execution:</span>
              </div>
              <ol className="list-decimal list-inside space-y-0.5 font-mono-numbers text-[11px] text-[#F0E8D8]/80">
                <li>Install Ollama from https://ollama.com</li>
                <li>Pull an open-weight model: `ollama run gemma2:9b` or `ollama run qwen2.5:7b`</li>
                <li>Ensure CORS allows browser access: `OLLAMA_ORIGINS="*" ollama serve`</li>
              </ol>
            </div>
          </div>
        )}

        {mode === 'custom_endpoint' && (
          <div className="p-5 rounded bg-[#100F15] border border-[#D6AD62]/20 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D6AD62] block">
              OpenAI-Compatible Custom Endpoint
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-[#9E9689]">Endpoint URL</label>
                <input
                  type="text"
                  value={customEndpointUrl}
                  onChange={(e) => setCustomEndpointUrl(e.target.value)}
                  placeholder="http://localhost:8000/v1"
                  className="w-full px-3 py-2 rounded bg-[#14121A] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-xs text-[#F0E8D8] font-mono-numbers"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#9E9689]">Model Identifier</label>
                <input
                  type="text"
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  placeholder="Qwen/Qwen2.5-7B-Instruct"
                  className="w-full px-3 py-2 rounded bg-[#14121A] border border-[#D6AD62]/20 focus:border-[#D6AD62] focus:outline-none text-xs text-[#F0E8D8] font-mono-numbers"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Changes Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Check className="w-4 h-4" />
              <span>Configuration Saved</span>
            </div>
          )}
          <button
            onClick={handleSaveConfig}
            className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0B0A0F] bg-[#D6AD62] hover:bg-[#E5BE72] rounded transition-colors shadow-md cursor-pointer"
          >
            Apply Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
