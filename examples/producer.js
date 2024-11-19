import amqp from "amqplib";

const exchange = "logs"; // Name of the exchange
const type = "fanout"; // Type of the exchange is 'fanout'. This means all messages will be broadcast to all queues bound to this exchange.

async function sendMessage() {
  try {
    // Step 1: Connect to RabbitMQ server
    const connection = await amqp.connect("amqp://localhost");
    // Step 2: Create a channel for communication
    const channel = await connection.createChannel();

    // Step 3: Declare the exchange
    // Ensures the exchange exists; creates it if it doesn't.
    // 'durable: false' means the exchange won't survive RabbitMQ server restarts.
    await channel.assertExchange(exchange, type, { durable: false });

    // Step 4: Define the message to send
    const msg = "Hello, World!";

    // Step 5: Publish the message
    // Since this is a fanout exchange, the routing key is ignored, so an empty string ("") is used.
    channel.publish(exchange, "", Buffer.from(msg));

    console.log(` [x] Sent: ${msg}`);
    setTimeout(() => {
      connection.close(); // Close the connection to RabbitMQ
    }, 500);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

sendMessage();
