import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-invert prose-zinc max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold text-zinc-100 mt-6 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold text-zinc-200 mt-5 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold text-zinc-200 mt-4 mb-2">{children}</h3>,
          p: ({ children }) => <p className="text-zinc-300 mb-4 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside text-zinc-300 mb-4 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-zinc-300">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-zinc-200">{children}</strong>,
          em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
          code: ({ children }) => (
            <code className="bg-zinc-800/60 text-zinc-200 px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-zinc-950 border border-zinc-800/60 rounded-lg p-4 overflow-x-auto mb-4">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-kzOrange/50 pl-4 italic text-zinc-400 mb-4">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-kzOrange hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kzOrange focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="border-zinc-800/60 my-6" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
