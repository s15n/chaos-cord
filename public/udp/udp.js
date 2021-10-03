const dgram = require('dgram')
//import dgram from 'dgram'

function udp(ip, port) {
    const client = dgram.createSocket('udp4');

    const PORT = port
    const HOST = ip

    client.on('listening', () => {
        const address = client.address();
        console.log('UDP Server listening on ' + address.address + ":" + 
        address.port);
    });
    
    client.on('message', (message, remote) => {
        console.log("got message from server ==> ", remote.address + ':' + 
        remote.port +' - ' + message);
    });
    
    function sendMessage(message) {
        if (message) {
        client.send(message, 0, message.length, PORT, HOST, (err, bytes) => {
            if (err) throw err;
            console.log('UDP message sent to ' + HOST + ':' + PORT);
            // client.close();
            });
       }
    }

    sendMessage('HI');
}

module.exports.udp = udp