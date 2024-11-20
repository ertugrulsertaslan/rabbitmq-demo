import amqp from "amqplib";

const exchange = "direct_logs";
const type = "direct"; // direct exchange type

// Message sending function
async function sendMessage(routingKey, message) {
  try {
    const connection = await amqp.connect("amqp://localhost"); // Connect to RabbitMQ
    const channel = await connection.createChannel(); // Create channel

    // Exchange Defined
    await channel.assertExchange(exchange, type, { durable: false });

    /*
      const exchange = 'direct_logs';
      const routingKey = 'error';
      const message = 'Error log message';
      channel.publish(exchange, routingKey, Buffer.from(message)); Direct type 

      const exchange = 'logs';
      const message = 'Broadcast message';
      channel.publish(exchange, '', Buffer.from(message)); Fanout type (routing key null)

      const exchange = 'topic_logs';
      const routingKey = 'logs.error';
      const message = 'Error log with topic';
      channel.publish(exchange, routingKey, Buffer.from(message)); Topic type 

      const exchange = 'headers_logs';
      const message = 'Document with headers';
      const headers = { type: 'pdf', format: 'A4' };
      channel.publish(exchange, '', Buffer.from(message), { headers }); Headers type
    */

    // Send message
    channel.publish(exchange, routingKey, Buffer.from(message)); // Direct type

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

    /*
      channel.bindQueue(q.queue, exchange, routingKey); Direct type
      channel.bindQueue(q.queue, exchange, ''); // Fanout (routing key is not used)
      channel.bindQueue(q.queue, exchange, routingKey); // Topic type
      channel.bindQueue(q.queue, exchange, '', { type: 'pdf', format: 'A4' }); // Headers type
    */
    channel.bindQueue(q.queue, exchange, routingKey); // Direct type

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
