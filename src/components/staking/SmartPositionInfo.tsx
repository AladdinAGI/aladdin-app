// 添加智能持仓信息组件
export const SmartPositionInfo = () => {
  return (
    <div className="w-[100%] mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md p-3 text-white mb-4">
      <div className="flex items-center space-x-2">
        <div className="rounded-full bg-white bg-opacity-20 p-1">
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04c-.178.018-.35.038-.523.059C1.3 10.678 1 13.299 1 17c0 5 3.9 6 6 6h10c2.1 0 6-1 6-6 0-3.701-.3-6.322-.859-8.957a8.738 8.738 0 01-.523-.059"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h4 className="font-medium text-sm">
            Intelligent Position Management
          </h4>
          <p className="text-xs text-white text-opacity-90">
            Your positions are automatically managed by our AI agents. When
            market risks are detected, assets will be redeemed and reinvested
            automatically until your target KPI is achieved—all without
            requiring your intervention.
          </p>
        </div>
      </div>
    </div>
  );
};
