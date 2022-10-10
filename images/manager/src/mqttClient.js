import mqtt from "mqtt";


export default class MQTTClient {
  constructor(id, callback, topics) {
    this.id = id;
    this.callback = callback;
    this.client = null;

    this.clientStats = {
      connected: false
    }
    this.MQTT_TOPIC          = topics;
    this.MQTT_ADDR           = process.env.MQTT_ADDR;

    // this.keepAlive = setInterval(() => {
    //   if(this.clientStats.connected) {
    //     this.client.publish("services/"+this.id+"/im_alive", "service,id="+this.id+" alive=1")
    //   }
    // }, process.env.LIFELINE_TIME > 0 ? process.env.LIFELINE_TIME : 10000 )
  }
  async broadcast(topic, message, override = null) {
    if(this.clientStats.connected) {
      if(override !== null) {
        this.client.publish(override, message)

      } else {
        this.client.publish(`services/${this.id}/${topic}`, message)
      }
    }
  }
  async connect() {
    console.log("retrying to connect", this.MQTT_ADDR)
  
    this.client  = mqtt.connect(this.MQTT_ADDR,{clientId: this.id, protocolId: 'MQIsdp', protocolVersion: 3, connectTimeout:1000, debug:true});
    
    this.client.on('connect', () => {
      this.clientStats.connected=true;
      console.log("connected")
      this.client.subscribe(this.MQTT_TOPIC, (err) => {
        if (!err) {
          console.log("connected")
        }
        else {
          console.log(err);
        }
      })
    })
  
    this.client.on('message', async (topic, message) => {
      this.callback(topic, message);
  
    })
  
    this.client.on('error', (e) => {
      this.clientStats.connected=false;
      console.log("ERROR", e)
      this.client.end()
    })
  
    this.client.on("end", () => {
      setTimeout(() => {
        if(!this.clientStats.connected) {
          this.connect();
        } 
      }, 5000);
    })
  }
}