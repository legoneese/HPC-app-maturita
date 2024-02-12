//import mqtt from 'mqtt';
/*
class MqttService {
  constructor() {
    this.client = null;
  }

  connect(clientId, host, username, password) {
    
        this.client = mqtt.connect(host, {
          clientId,
          username,
          password,
          clean: true,
          connectTimeout: 4000,
          reconnectPeriod: 1000,
        });
      
        this.client.on('connect', () => {
          console.log('Connected to MQTT Broker');
        });
      
        this.client.on('error', (err) => {
          console.error('Connection error: ', err);
          this.client.end();
        });
      
        this.client.on('reconnect', () => {
          console.log('Reconnecting...');
        });
      
        this.client.on('close', () => {
          console.log('Disconnected from MQTT Broker');
        });
      
      
  }

  publish(topic, message) {
    
        if (this.client) {
          this.client.publish(topic, message, { qos: 1 }, (err) => {
            if (err) {
              console.error('Publish error:', err);
            }
          });
        }
      
      
  }

  // Additional methods like subscribe, unsubscribe, etc., can be added here
}

export default new MqttService();*/
