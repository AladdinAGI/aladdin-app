import { toolsInfo } from '@/constants/toolsInfo';

interface QuickQuestionsProps {
  onSelect: (question: string) => void;
  currentLang: 'en' | 'zh';
}

export function QuickQuestions({ onSelect, currentLang }: QuickQuestionsProps) {
  return (
    <div className="space-y-4">
      {toolsInfo.map(
        (
          tool: {
            name: { [key: string]: string };
            examples: { [key: string]: string[] };
          },
          index: number
        ) => (
          <div key={index} className="tool-section">
            <h3 className="text-sm text-gray-500 mb-2">
              {tool.name[currentLang]}
            </h3>
            <div className="flex flex-wrap gap-3">
              {tool.examples[currentLang].map(
                (example: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => onSelect(example)}
                    className="px-4 py-2 bg-white hover:bg-[#f0f7ff] border border-[#e1e1e1] 
                         hover:border-[#1890ff] rounded-md text-sm text-[#333] hover:text-[#1890ff] 
                         transition-colors whitespace-nowrap"
                  >
                    {example}
                  </button>
                )
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
