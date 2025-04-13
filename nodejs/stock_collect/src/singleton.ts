export class Singleton {

    private static instance: Singleton;
    private totalNumberOfStocks = 0
    private totalNumberOfStocksConsumed = 0
    private webSocket: WebSocket;

    constructor() { }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new Singleton();
        return this.instance;
    }

    getTotalNumberOfStocks() {
        return this.totalNumberOfStocks;
    }

    getStocksSentByWS() {
        return this.totalNumberOfStocksConsumed;
    }

    getWebSocket() {
        return this.webSocket;
    }

    setStocksSentByWS(stockConsumed) {
        this.totalNumberOfStocksConsumed = stockConsumed;
    }

    setWebSocket(webSocket: WebSocket) {
        this.webSocket = webSocket;
    }

    setTotalNumberOfStocks(totalNumberOfStocks) {
        this.totalNumberOfStocks = totalNumberOfStocks;
    }

    addAmountOfStockConsumed() {
        this.totalNumberOfStocksConsumed++;
    }

    addAmountOfStock() {
        this.totalNumberOfStocks++;
    }
}