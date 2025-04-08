export class Singleton {

    private static instance: Singleton;
    private totalNumberOfStocks = 0
    private stocksSentByWS = 0
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
        return this.stocksSentByWS;
    }

    getWebSocket() {
        return this.webSocket;
    }

    setWebSocket(webSocket: WebSocket) {
        this.webSocket = webSocket;
    }

    setTotalNumberOfStocks(totalNumberOfStocks) {
        this.totalNumberOfStocks = totalNumberOfStocks;
    }

    addStockSentByWS() {
        this.stocksSentByWS++;
    }

    addAmountStock(numberOfStocks) {
        this.totalNumberOfStocks += numberOfStocks;
    }
}