import React from 'react';
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
        // Scroll to report on first chunk
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
        <div className="mx-auto max-w-3xl px-4 py-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">Health AI</h1>
            <p className="text-xs text-gray-500">Personalised health analysis powered by AI</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Intro */}
        <div className="mb-8 rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Get your personalised health report</h2>
          <p className="text-sm text-gray-600">
            Enter your health data below and our AI will generate a structured analysis including body metrics, health assessment, and personalised recommendations.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <HealthForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <strong className="font-semibold">Error:</strong> {error}
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
