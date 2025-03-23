from confluent_kafka import Consumer, KafkaError
from analyse import analyse
from producer import producer

import os

def consumer():
    conf = {
        'bootstrap.servers': os.environ['KAFKA_BOOTSTRAP_SERVER'],  
        'group.id': os.environ['KAFKA_GROUP_ID'],      
        'enable.auto.commit': os.environ['KAFKA_AUTO_COMMIT'],           
        'auto.offset.reset': os.environ['KAFKA_OFFSET_RESET']
    }

    consumer = Consumer(conf)
    consumer.subscribe([os.environ['KAFKA_TOPIC_CONSUMER']])

    try:
        while True:
            msg = consumer.poll(timeout=1.0) 
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    print('End of partition reached {0}/{1}'
                          .format(msg.topic(), msg.partition()))
                elif msg.error():
                    print(msg.error()) 
            else:
                stock = msg.value().decode('utf-8')
                print('Received message: {0}'.format(stock))
                result = analyse(stock)
                producer(stock, result)
    finally:
        consumer.close()

consumer()