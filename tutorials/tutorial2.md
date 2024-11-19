# RabbitMQ Advanced - Tutorial 2: Using Fanout Exchange

In this tutorial, we will go deeper into RabbitMQ by focusing on **Fanout Exchanges**. You will learn how RabbitMQ can broadcast messages to multiple consumers using fanout exchanges.

### Learning Goals:

- How to create and configure a **Fanout Exchange** in RabbitMQ.
- How to publish messages to the fanout exchange.
- How multiple consumers can subscribe to the exchange and receive messages.

---

### **Step 1: Set up RabbitMQ (if you haven't already)**

Follow the steps from **Tutorial 1** to install and start RabbitMQ. If you already have RabbitMQ running, proceed to the next step.

---

### **Step 2: Create a Fanout Exchange**

In RabbitMQ, an exchange is responsible for routing messages to queues. A **Fanout Exchange** broadcasts messages to all queues bound to it, regardless of the routing key. 

To set up a **Fanout Exchange**, you need to declare the exchange in your producer script and bind queues to it in your consumer script.

#### Example code for setting up the Fanout Exchange in a producer script (`producer.js`):

```javascript
const amqp = require('amqplib');

const exchange = 'logs'; // Exchange name
const type = 'fanout'; // Exchange type is fanout, meaning all messages will be broadcast

async function sendMessage() {
  try {
    const connection = await amqp.connect('amqp://localhost'); // Connect to RabbitMQ server
    const channel = await connection.createChannel(); // Create a channel

    // Declare the fanout exchange
    await channel.assertExchange(exchange, type, { durable: false });

    const msg = 'Hello World!'; // The message to send
    channel.publish(exchange, '', Buffer.from(msg)); // Publish the message to the exchange

    console.log(` [x] Sent: ${msg}`);

    setTimeout(() => {
      connection.close(); // Close the connection
    }, 500);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

sendMessage();
