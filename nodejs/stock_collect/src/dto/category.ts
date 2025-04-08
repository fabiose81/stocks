import { Stock } from "./stock";

export class Category {
    name: string;
    numberOfStocks: number;
    stocks: Array<Stock> = []

    constructor() {}
}