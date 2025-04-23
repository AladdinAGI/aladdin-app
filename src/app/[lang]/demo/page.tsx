import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const data = `
> ### 💎 **Here are some tokens related to your search "{search_term}":**
 ---
123`;
export default function DemoPage() {
  return (
    <ReactMarkdown
      components={{
        table: ({ ...props }) => (
          <table
            className="min-w-full border border-gray-300 text-sm text-center"
            {...props}
          />
        ),
        thead: ({ ...props }) => (
          <thead className="bg-gray-100 text-gray-700" {...props} />
        ),
        tr: ({ ...props }) => (
          <tr className="border-b hover:bg-gray-50" {...props} />
        ),
        th: ({ ...props }) => (
          <th className="px-4 py-2 font-medium border" {...props} />
        ),
        hr: () => (
          <hr className="my-6 border-t-2 border-dashed border-gray-300" />
        ),
        td: ({ ...props }) => <td className="px-4 py-2 border" {...props} />,
        img: ({ ...props }) => (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img className="inline-block w-6 h-6 align-middle" {...props} />
        ),
      }}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
    >
      {data}
    </ReactMarkdown>
  );
}
