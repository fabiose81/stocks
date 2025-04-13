from confluent_kafka import Producer

import socket
import os

def producer(stock, result):
    conf = {
        'bootstrap.servers': os.environ['KAFKA_BOOTSTRAP_SERVER'],  
        'client.id': socket.gethostname()
    }

    producer = Producer(conf)

    topic = os.environ['KAFKA_TOPIC_PRODUCER']

    producer.produce(topic, key=stock, value=result, callback=acked)
    producer.poll(1)
    producer.flush()

def acked(err, msg):
    if err is not None:
        print("Failed to deliver message: %s: %s" % (str(msg), str(err)))
    else:
        print("Produced event to topic {topic}: key = {key:12}".format(
            topic=msg.topic(), key=msg.key().decode('utf-8')))