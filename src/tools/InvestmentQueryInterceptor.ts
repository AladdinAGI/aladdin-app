/**
 * Utility for intercepting and analyzing investment-related queries
 */

interface InvestmentParams {
  amount: string;
  targetAPY: number;
  riskTolerance: number;
}

/**
 * Analyzes a user query to determine if it matches investment recommendation pattern
 * @param query - The user's query text
 * @returns - Returns parsed parameters if matched, null otherwise
 */
export const analyzeInvestmentQuery = (
  query: string
): InvestmentParams | null => {
  // Skip analysis if query is missing
  if (!query) return null;

  // Handle specific investment queries matching our pattern
  const amountRegex = /(\d{1,3}(,\d{3})*|\d+)(\.\d+)?\s*(USDT|usdt)/i;
  const returnRegex = /(\d+(\.\d+)?)\s*%\s*(return|apy|yield|apr)/i;
  const riskRegex = /(risk\s*tolerance|risk).+?(\d+(\.\d+)?)\s*%/i;

  // Extract amount
  const amountMatch = query.match(amountRegex);
  // Extract return target
  const returnMatch = query.match(returnRegex);
  // Extract risk tolerance
  const riskMatch = query.match(riskRegex);

  // Check if we have all required parameters
  if (amountMatch && returnMatch && riskMatch) {
    // Parse the numeric values
    const amount = amountMatch[1].replace(/,/g, '');
    const targetAPY = parseFloat(returnMatch[1]);
    const riskTolerance = parseFloat(riskMatch[2]);

    return {
      amount,
      targetAPY,
      riskTolerance,
    };
  }

  return null;
};

export default analyzeInvestmentQuery;
