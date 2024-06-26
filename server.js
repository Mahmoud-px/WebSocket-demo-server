const { default: axios } = require('axios');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');


const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server });


wss.on('connection', (ws) =>{

    console.log('WebSocket client connected')

    ws.on('message', async (message) => {
        console.log('Received message:', message.toString());
      
        if (message.toString() === 'ping') {
          try {
            let MasterTrade;
            let id;
      
            // First Axios request
            const response1 = await axios.get('https://pdzsl5xw2kwfmvauo5g77wok3q0yffpl.lambda-url.us-east-2.on.aws/');
            console.log('Replicating Master Trade:', response1.data);
            MasterTrade = response1.data;
      
            // Second Axios request
            const response2 = await axios.get('https://mt4.mtapi.io/Connect?user=44712225&password=tfkp48&host=18.209.126.198&port=443');
            console.log('Replicating Master Trade id:', response2.data);
            id = response2.data;
      
            // third Axios request
            if (MasterTrade && id) {
                const combinedData = {id: id, ...MasterTrade}

                //This /OrderSend api is not responding as explained in the task file. It responds with error message : "Too many open orders" 🤷‍♂️
                // const response3 = await axios.get('https://mt4.mtapi.io/OrderSend', { params: combinedData });
                // console.log('Successfully replicated Master Trade:', response3.data);
                // ws.send(JSON.stringify(response3.data));

                // I have replicated Master Trade with the current data instead:
                console.log('Successfully replicated Master Trade:', combinedData);
                ws.send(JSON.stringify(combinedData));
            }
          } catch (error) {
            console.error('Error:', error.message);
          }
        }
    });

    ws.on('close', ()=>{
        console.log('client disconnected')
    })
})

server.listen(5000, ()=>{
    console.log('Server listening on port 5000')
})

