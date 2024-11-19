import amqp from "amqplib";

const exchange = "logs"; // Name of the exchange
const type = "fanout"; // Type of the exchange is 'fanout'. This means all messages will be broadcast to all queues bound to this exchange.

async function receiveMessages() {
  try {
    // Step 1: Connect to the RabbitMQ server
    const connection = await amqp.connect("amqp://localhost");

    // Step 2: Create a channel for communication
    const channel = await connection.createChannel();

    // Step 3: Declare the exchange
    // Ensures the exchange exists; creates it if it doesn't.
    // 'durable: false' means the exchange won't survive RabbitMQ server restarts.
    await channel.assertExchange(exchange, type, { durable: false });

    // Step 4: Declare a temporary queue
    // Passing an empty string as the queue name creates a temporary, exclusive queue.
    // 'exclusive: true' means the queue will only be accessible by this connection and will be deleted when the connection closes.
    const q = await channel.assertQueue("", { exclusive: true });

    console.log(" [*] Waiting for logs. To exit press CTRL+C");

    // Step 5: Bind the queue to the exchange
    // This binding connects the queue to the 'logs' exchange. Since it's a fanout exchange, the routing key is irrelevant.
    channel.bindQueue(q.queue, exchange, "");

    // Step 6: Consume messages from the queue
    // When a message is received, the callback function logs the message content.
    // 'noAck: true' means RabbitMQ doesn't wait for acknowledgment from the consumer, assuming the message is successfully processed.
    channel.consume(
      q.queue, // The temporary queue to consume messages from
      (msg) => {
        if (msg.content) {
          console.log(` [x] Received: ${msg.content.toString()}`);
        }
      },
      { noAck: true } // Messages are auto-acknowledged
    );
  } catch (error) {
    console.error("Error receiving messages:", error);
  }
}

receiveMessages();
