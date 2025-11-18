// Mapping from stock symbols to company names for news event fetching
export const stockToCompanyMapping: Record<string, string> = {
  // Indian Stocks (NSE)
  "RELIANCE.NS": "Reliance Industries",
  "TCS.NS": "Tata Consultancy Services",
  "INFY.NS": "Infosys",
  "HDFCBANK.NS": "HDFC Bank",
  "ICICIBANK.NS": "ICICI Bank",
  "HINDUNILVR.NS": "Hindustan Unilever",
  "SBIN.NS": "State Bank of India",
  "BHARTIARTL.NS": "Bharti Airtel",
  "BAJFINANCE.NS": "Bajaj Finance",
  "ITC.NS": "ITC Limited",
  "KOTAKBANK.NS": "Kotak Mahindra Bank",
  "LT.NS": "Larsen & Toubro",
  "AXISBANK.NS": "Axis Bank",
  "ASIANPAINT.NS": "Asian Paints",
  "MARUTI.NS": "Maruti Suzuki",
  "SUNPHARMA.NS": "Sun Pharmaceutical",
  "TITAN.NS": "Titan Company",
  "ULTRACEMCO.NS": "UltraTech Cement",
  "WIPRO.NS": "Wipro",
  "POWERGRID.NS": "Power Grid Corporation",
  "ONGC.NS": "ONGC",
  "ADANIENT.NS": "Adani Enterprises",
  "ADANIPORTS.NS": "Adani Ports",
  "APOLLOHOSP.NS": "Apollo Hospitals",
  "BAJAJ-AUTO.NS": "Bajaj Auto",
  "BAJAJFINSV.NS": "Bajaj Finserv",
  "ASIANPAINT.NS": "Asian Paints",
  "DRREDDY.NS": "Dr Reddy's Laboratories",
  "EICHERMOT.NS": "Eicher Motors",
  "GRASIM.NS": "Grasim Industries",
  "HCLTECH.NS": "HCL Technologies",
  "HEROMOTOCO.NS": "Hero MotoCorp",
  "INDUSINDBK.NS": "IndusInd Bank",
  "JSWSTEEL.NS": "JSW Steel",
  "M&M.NS": "Mahindra & Mahindra",
  "NESTLEIND.NS": "Nestle India",
  "NTPC.NS": "NTPC",
  "TECHM.NS": "Tech Mahindra",
  "TATACONSUM.NS": "Tata Consumer Products",
  "TATAMOTORS.NS": "Tata Motors",
  "TATASTEEL.NS": "Tata Steel",
  
  // Add more mappings as needed
};

/**
 * Convert a stock symbol to its company name for news fetching
 * @param symbol Stock symbol (e.g., "RELIANCE.NS", "AAPL")
 * @returns Company name or null if not mapped
 */
export function getCompanyNameFromSymbol(symbol: string): string | null {
  return stockToCompanyMapping[symbol] || null;
}
