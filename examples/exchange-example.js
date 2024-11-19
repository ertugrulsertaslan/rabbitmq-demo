import amqp from "amqplib";

const exchange = "direct_logs";
const type = "direct"; // direct exchange type

// Message sending function
async function sendMessage(routingKey, message) {
  try {
    const connection = await amqp.connect("amqp://localhost"); // Connect to RabbitMQ
    const channel = await connection.createChannel(); // Create channel
    await channel.assertExchange(exchange, type, { durable: false }); // Exchange Defined

    // Send message
    channel.publish(exchange, routingKey, Buffer.from(message));

    console.log(` [x] Sent: ${message} with routing key: ${routingKey}`);

    setTimeout(() => {
      connection.close(); // Close connection
    }, 500);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Message receiving function
async function receiveMessages(routingKey) {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange(exchange, type, { durable: false });

    // Creating a temporary queue and connected to the exchange
    const q = await channel.assertQueue("", { exclusive: true });
    channel.bindQueue(q.queue, exchange, routingKey);

    console.log(` [*] Waiting for logs with routing key: ${routingKey}`);

    //  Start consuming messages from the queue
    channel.consume(
      q.queue, // The queue to consume from
      (msg) => {
        if (msg.content) {
          console.log(` [x] Received: ${msg.content.toString()}`);
        }
      },
      { noAck: true } // 'noAck: true' means RabbitMQ will assume the message was processed successfully without explicit acknowledgment
    );
  } catch (error) {
    console.error("Error receiving messages:", error);
  }
}

// First start receiver , After send Message
async function start() {
  await receiveMessages("info");
  sendMessage("info", "Info message");
}

start();