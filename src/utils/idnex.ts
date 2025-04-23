// 检测用户消息中的质押命令
const checkForStakingCommand = (message: string): boolean => {
  const trimmedMsg = message.trim().toLowerCase();
  return trimmedMsg.startsWith('/stake') || trimmedMsg.includes('stake tokens');
};
type InvestmentInfo = {
  amount: number;
  returnTarget: number;
  riskTolerance: number;
  success: boolean;
};

function parseInvestmentInfo(input: string): InvestmentInfo | null {
  const regex =
    /I have\s+\$?(\d+)\s+(?:USDT|USD|ETH)?\s+and\s+want\s+to\s+achieve\s+a\s+(\d+)%\s+return\s+target\s+by\s+taking\s+a\s+certain\s+degree\s+of\s+risk\.\s+My\s+risk\s+tolerance\s+is\s+(\d+)%\./i;
  const match = input.match(regex);

  if (!match) return null;

  const [, amountStr, returnStr, riskStr] = match;
  return {
    success: true,
    amount: parseFloat(amountStr),
    returnTarget: parseFloat(returnStr),
    riskTolerance: parseFloat(riskStr),
  };
}

export { parseInvestmentInfo, checkForStakingCommand };
