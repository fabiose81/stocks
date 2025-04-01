import { Stock } from "./dto/stock";

export class Singleton {

    private static instance: Singleton;
    private stocks: Array<Stock> = []

    constructor() {}

    static getInstance() {
        if (this.instance) {
            return this.instance;
          }
          this.instance = new Singleton();
          return this.instance;
    }

    setStocks(stocks: Array<Stock>) {
        this.stocks = stocks;
    }

    getStocks() {
        return this.stocks;
    }
}