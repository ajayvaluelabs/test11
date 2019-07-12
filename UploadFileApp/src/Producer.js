import React, { Component } from 'react';
import kafka, { KafkaClient } from 'kafka-node';
import config from './kafka_config';

export default class Producer extends Component {    
    constructor(props) {
        super(props);        
        
        const client = new kafka.KafkaClient({
            kafkaHost: config.kafka_server,
            sasl: {
                mechanism: 'plain',
                username: '$ConnectionString',
                password: config.kafka_connection_string
            }
        });
        const producer = kafka.Producer;
        this.producer = new producer(client);
    };

    produceMessage = (message, topic) => {
        let payload = [
            {
                topic: topic,
                messages: JSON.stringify(message)
            }
        ];
        this.Producer.send(payload, (err, data) => {
            if (err) {
                console.log('[kafka-producer -> '+topic+']: broker update failed');
            } else {
            console.log('[kafka-producer -> '+topic+']: broker update success');
            }
        });
    };
}