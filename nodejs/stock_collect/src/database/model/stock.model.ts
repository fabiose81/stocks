import mongoose from 'mongoose';
import StockSchema from '../schema/stock.schema.js';

const StockModel = mongoose.model('Stock', StockSchema);

export default StockModel;