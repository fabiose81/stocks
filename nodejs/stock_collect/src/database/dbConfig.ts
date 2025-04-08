import mongoose from "mongoose";

export class DbConfig {

    constructor() {}

    async connect() {
        const DB_HOST = process.env.MONGODB_HOST;
        const DB_PORT = process.env.MONGODB_PORT;
        const DB = process.env.MONGODB_DB;
        const uri = `mongodb://${DB_HOST}:${DB_PORT}/${DB}`;

        await mongoose.connect(uri)
            .then(() => {
                console.log('DataBase connected');
            })
            .catch(error => console.log(error));
    }
}