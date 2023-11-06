// udp-server.js
const dgram = require('dgram');
const udpServer = dgram.createSocket('udp4');

udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

// Emitting dummy data every 500ms
setInterval(() => {
  const message = Buffer.from(String(Math.random()));
  udpServer.send(message, 0, message.length, 12345, 'localhost', (err) => {
    if (err) udpServer.close();
  });
}, 500);

udpServer.bind(12345);

// Export the udpServer
module.exports = udpServer;
