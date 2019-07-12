import React, { Component } from 'react';
import './App.css';
import Clock from './Clock';
import axios from 'axios';
import { EventHubClient, EventPosition, OnMessage, OnError, MessagingError, delay, EventData } from "@azure/event-hubs";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      receivedEvents: "test"
    }
    this.client = EventHubClient.createFromConnectionString("Endpoint=sb://projectpatek-stg.servicebus.windows.net/;SharedAccessKeyName=receive;SharedAccessKey=Z6NUJ9P2+nCqSYIwDzrc0L3TWcmnlhNRGt01bl8Z73U=;EntityPath=csvupload", "csvupload");

    this.listenForMessages();
  }

  async listenForMessages () {
    const client = EventHubClient.createFromConnectionString("Endpoint=sb://projectpatek-stg.servicebus.windows.net/;SharedAccessKeyName=send_receive;SharedAccessKey=dyRztIwd286LaCGemuG5CZbjBBIEDMB71tE0fhF/jPA=;EntityPath=csvfrontend", "csvfrontend");
    const partitionIds = await client.getPartitionIds();

    const onMessageHandler = (brokeredMessage) => {      
      this.setState({
        receivedEvents: new Date().toLocaleTimeString() + " : " + JSON.stringify(brokeredMessage.body) + "<br />" + this.state.receivedEvents
      });
    };
    const onErrorHandler = (err) => {
      console.log("Error occurred: ", err);
    };
  
    const rcvHandler = client.receive(partitionIds[1], onMessageHandler, onErrorHandler, {
      eventPosition: EventPosition.fromStart(),
      consumerGroup: "test"
    });
  }

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  onChangeHandler=event => {
    this.setState ({
      selectedFile: event.target.files[0]});
  }

  onClickHandler = () => {
    const cl = this.client;
    this.getBase64(this.state.selectedFile).then(function (data) {      
      cl.send({
        body: JSON.stringify({
          FileData: data.split('base64,')[1]
        })
      });
    });  
  }

  render () {
    
    return (     
      <div className="container">
        <Clock />
        <div className="row">
          <div className="offset-md-3 col-md-6"> 
            <div className="form-group files color">
              <label>Upload Your File </label>
              <input type="file" name="file" onChange={this.onChangeHandler} className="form-control" multiple=""/>
            </div>              
          </div>            
        </div>
        <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button> 
        <br />
        <div className="card" dangerouslySetInnerHTML={{__html: this.state.receivedEvents}}></div>
      </div>    
    )
  }
}


export default App;
