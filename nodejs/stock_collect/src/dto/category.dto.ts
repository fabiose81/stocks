export class CategoryDto {
    name: string;
    numberOfStocks: number;

    constructor(name: string, numberOfStocks: number) {
        this.name = name;
        this.numberOfStocks = numberOfStocks;
    }
}