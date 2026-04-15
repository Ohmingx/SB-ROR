import yfinance as yf

def fetch_data(symbol: str):
    data = yf.download(symbol, start="2015-01-01")
    data = data.dropna()
    return data

# if __name__ == "__main__":
#     data = fetch_data("RELIANCE.NS")
#     print(data.head())