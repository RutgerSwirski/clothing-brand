import ReactMarkdown from "react-markdown";

export const MarkdownContent = ({ content }: { content?: string }) => {
  if (!content) {
    return <div className="text-gray-500 italic">No content provided</div>;
  }

  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-semibold mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-semibold mb-2">{children}</h3>
        ),
        p: ({ children }) => <p className="mb-3">{children}</p>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-blue-600 underline hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 mb-3">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 mb-3">{children}</ol>
        ),
        li: ({ children }) => <li className="mb-1">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-stone-400 pl-4 italic text-stone-600 mb-3">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-stone-100 px-1 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        ),
        hr: () => <hr className="my-6 border-t border-stone-300" />,
      }}
    >
      {content || ""}
    </ReactMarkdown>
  );
};
