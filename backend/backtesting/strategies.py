def sma_strategy(data):
    data["SMA_50"] = data["Close"].rolling(window=50).mean()
    data["SMA_200"] = data["Close"].rolling(window=200).mean()

    data["signal"] = 0

    data.loc[data["SMA_50"] > data["SMA_200"], "signal"] = 1
    data.loc[data["SMA_50"] < data["SMA_200"], "signal"] = -1

    return data

if __name__ == "__main__":
    from data.data_fetcher import fetch_data

    data = fetch_data("RELIANCE.NS")
    data = sma_strategy(data)

    print(data[["Close", "SMA_50", "SMA_200", "signal"]].tail())