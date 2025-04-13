import { CategoryDto } from "./category.dto";

export class StockDto {
    category: CategoryDto;
    code: string;
    name: string;
    result: any;

    constructor(category: CategoryDto, code: string, name: string, result: any) {
        this.category = category;
        this.code = code;
        this.name = name;
        this.result = result;
    }
}