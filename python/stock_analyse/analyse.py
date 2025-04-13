import yfinance as yahooFinance

def analyse(stock, period, interval):
    try:
        ticker = yahooFinance.Ticker(stock)
        history = ticker.history(period=period, interval=interval)
        history = history.drop(columns=['Open', 'High', 'Low', 'Volume', 'Dividends', 'Stock Splits'])
        history.shift()
        history.reset_index(inplace=True)
        feature_extraction(history)
        history = history.drop(columns=['Date', 'Close'])

        return history.to_json(orient='records')
    except:
        return 'ERROR'

def feature_extraction(hist):
    hist['Day'] = hist['Date'].dt.day
    hist['Month'] = hist['Date'].dt.month
    hist['Year'] = hist['Date'].dt.year
    hist['Profitability'] = hist['Close'] / hist['Close'].shift() * 100 - 100