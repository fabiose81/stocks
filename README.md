https://github.com/user-attachments/assets/b75edb1b-89d0-4e9b-b431-4e1ab2e9216a

![alt text](https://github.com/fabiose81/stocks/blob/master/stocks.jpg?raw=true)



# In nodejs/stock_collect create the file .env and insert:

SERVER_PORT = 4000 

WEBSOCKET_PORT = 8080

### For docker
MONGODB_HOST = database

MONGODB_PORT = 27017

### For localhost
MONGODB_HOST = localhost

MONGODB_PORT = 7017

MONGODB_DB = stocks

### ChatGpt config
OPENAI_API_KEY =  {your openAI key}

CHAT_GPT_MODEL = gpt-4o

CHAT_GPT_MESSAGE_CONTENT = What are the most valuable stocks in the past %s years? As result show 5 categories and 1 stock(code, name) and the total in json array like: [{"name", "numberOfStocks", "stocks" : [{"code": "code", "name": "name"}]}]. No comments in the json response and no result for BRK.B code
#### Feel free to change the number of categories and stocks
#### The purpose of this code its only for study. Remember to verify this information as stock recommendations can vary based on current market conditions and individual financial goals
