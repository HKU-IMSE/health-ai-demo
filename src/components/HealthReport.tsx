import ArticleIcon from '@mui/icons-material/Article';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
  isStreaming: boolean;
}

export function HealthReport({ content, isStreaming }: Props) {
  if (!content) return null;

  return (
    <div className="mt-8 rounded-2xl border border-violet-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3">
        <div className="flex items-center gap-2">
          <ArticleIcon className="text-white" style={{ fontSize: 20 }} />
          <span className="text-base font-semibold text-white">Health Analysis Report</span>
        </div>
        {isStreaming && (
          <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
            <FiberManualRecordIcon className="text-green-300 animate-pulse" style={{ fontSize: 10 }} />
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
