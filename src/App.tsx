import React from 'react';
import { Alert } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { HealthForm } from './components/HealthForm';
import { HealthReport } from './components/HealthReport';
import { streamHealthAnalysis } from './lib/ai';
import type { HealthFormData } from './types';

function App() {
  const [report, setReport] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const reportRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = async (data: HealthFormData) => {
    setReport('');
    setError(null);
    setIsLoading(true);
    setIsStreaming(true);

    await streamHealthAnalysis(
      data,
      (chunk) => {
        setReport((prev) => prev + chunk);
        if (!report) {
          setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
        }
      },
      () => {
        setIsLoading(false);
        setIsStreaming(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
        setIsStreaming(false);
      },
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shrink-0">
            <FavoriteIcon fontSize="small" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-900 leading-tight">Health AI</p>
            <p className="text-xs text-gray-500">Personalised health analysis powered by AI</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Intro */}
        <div className="mb-6 rounded-2xl border border-violet-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Get your personalised health report</h2>
          <p className="text-sm text-gray-500">
            Enter your health data below and our AI will generate a structured analysis including body metrics,
            health assessment, and personalised recommendations.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <HealthForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6">
            <Alert severity="error">{error}</Alert>
          </div>
        )}

        {/* Report */}
        <div ref={reportRef}>
          <HealthReport content={report} isStreaming={isStreaming} />
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-100 bg-white py-6 text-center text-xs text-gray-400">
        For informational purposes only. Not a substitute for professional medical advice.
      </footer>
    </div>
  );
}

export default App;
