import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-white mb-3 mt-6">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-white mb-2 mt-4">
            {children}
          </h3>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="text-gray-300 mb-4 leading-relaxed break-words">
            {children}
          </p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-gray-300">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-300">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-300">
            {children}
          </li>
        ),

        // Inline code
        code: ({ node, className, children, ref, ...props }) => {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : ''
          const isInline = !match

          if (isInline) {
            return (
              <code
                className="px-1.5 py-0.5 bg-navy-800 text-accent-500 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            )
          }

          return (
            <div className="overflow-hidden max-w-full" style={{ wordBreak: 'break-word' }}>
              <SyntaxHighlighter
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style={vscDarkPlus as any}
                language={language}
                PreTag="div"
                className="rounded-lg mb-4 text-sm [&>pre]:!whitespace-pre-wrap [&>pre]:!break-words [&_code]:!whitespace-pre-wrap [&_code]:!break-words"
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  backgroundColor: '#1a1d29',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  overflow: 'hidden',
                }}
                codeTagProps={{
                  style: {
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }
                }}
                wrapLongLines={true}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          )
        },

        // Strong/Bold
        strong: ({ children }) => (
          <strong className="text-white font-semibold">
            {children}
          </strong>
        ),

        // Emphasis/Italic
        em: ({ children }) => (
          <em className="text-gray-200 italic">
            {children}
          </em>
        ),

        // Links
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-accent-500 hover:text-accent-400 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),

        // Blockquote
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-accent-500 pl-4 py-2 mb-4 bg-navy-800 rounded-r">
            {children}
          </blockquote>
        ),

        // Horizontal rule
        hr: () => (
          <hr className="border-navy-700 my-6" />
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
