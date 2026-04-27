import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
  isStreaming: boolean;
}

export function HealthReport({ content, isStreaming }: Props) {
  if (!content) return null;

  return (
    <div className="mt-8 rounded-2xl border border-violet-100 bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-lg font-semibold text-white">Health Analysis Report</h2>
        </div>
        {isStreaming && (
          <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-300" />
            Generating…
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="prose prose-violet max-w-none prose-headings:font-semibold prose-h2:text-violet-800 prose-h2:text-lg prose-h3:text-gray-700 prose-h3:text-base prose-li:text-gray-700 prose-p:text-gray-700 prose-strong:text-gray-900">
          <ReactMarkdown>{content}</ReactMarkdown>
          {isStreaming && (
            <span className="inline-block h-4 w-0.5 animate-pulse bg-violet-500 align-middle ml-0.5" />
          )}
        </div>
      </div>
    </div>
  );
}
