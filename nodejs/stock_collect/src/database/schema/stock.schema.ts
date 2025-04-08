import mongoose from 'mongoose';
const { Schema } = mongoose;

const StockSchema = new Schema({
        name: String,
        numberOfStocks: Number,
        stock: {
            code: String,
            name: String,
            result: Array
        }   
})

export default StockSchema;