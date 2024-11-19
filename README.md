# RabbitMQ Fanout Exchange Example 🐰🎉🐇

This project demonstrates how to use RabbitMQ's **Fanout Exchange** to send and receive messages. In a fanout exchange, messages are broadcast to **all queues** bound to the exchange, regardless of the routing key.

## Tutorials 📚

Learn more through these tutorials:

- [Getting Started with RabbitMQ](tutorials/tutorial1.md)
- [Advanced RabbitMQ Concepts](tutorials/tutorial2.md)

## Features ✨

- **Message Producer**: Sends a broadcast message to the exchange.
- **Message Consumer**: Listens for and processes messages broadcast from the exchange.
- Utilizes the `amqplib` library for RabbitMQ interactions.
- Demonstrates temporary queues for one-time message consumption.

---

## Requirements 🛠️

To run this project, you'll need:

- **Node.js** (v14 or newer) 🚀
- **RabbitMQ Server** (running locally or remotely) 🐰
- **amqplib** (installed via npm) 📦

---

## Installation 🧑‍💻

- [RabbitMQ Installation Guide 🛠️ ](install/rabbitmq.setup.md)

1. Clone this repository:

```bash

 git clone https://github.com/your-username/rabbitmq-fanout-example.git
 cd rabbitmq-fanout-example

```

```bash

 npm install

```

# RabbitMQ with Docker Desktop 🐳

This guide explains how to set up and run RabbitMQ using Docker Desktop. It includes instructions for creating a RabbitMQ container, accessing the management interface, and integrating it with a Node.js application.

---

## 1. Pull the RabbitMQ Docker Image 📥

Download the official RabbitMQ image from Docker Hub. This version includes the management plugin for a web-based UI.

```bash

docker pull rabbitmq:3-management

```

## 2. Run RabbitMQ in a Docker Container 🚀

Start a RabbitMQ container with the management interface enabled:

```bash

docker run -d --name rabbitmq-container -p 5672:5672 -p 15672:15672 rabbitmq:3-management

```

Explanation:

- `-d`: Runs the container in detached mode.
- `--name rabbitmq-container`: Assigns a name to the container for easier reference.
- `-p 5672:5672`: Maps RabbitMQ's AMQP port (5672) for message communication.
- `-p 15672:15672`: Maps the management plugin's web UI port (15672).

## 3. Access the RabbitMQ Management Interface 🌐

1. Open your browser and navigate to [http://localhost:15672](http://localhost:15672).
2. Log in using the default credentials:
   - **Username**: `guest`
   - **Password**: `guest`
3. The management interface allows you to monitor and manage exchanges, queues, and bindings.

### 4. Connect Your Node.js Application to RabbitMQ 🧑‍💻

In your Node.js application, use the following connection string to connect to RabbitMQ running in the Docker container:

```javascript
const connection = await amqp.connect("amqp://localhost");
```

### 5. Stopping and Removing the Container 🛑

To stop the RabbitMQ container:

```bash
docker stop rabbitmq-container
```

To remove the RabbitMQ container:

```bash
docker rm rabbitmq-container
```

### 6. Use Docker Compose (Optional) 🔧

For easier container management and more complex setups, create a docker-compose.yml file:

```bash
version: '3'
services:
  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq-container
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
volumes:
  rabbitmq_data:
```

Start RabbitMQ with Docker Compose:

```bash
docker-compose up -d
```

Stop RabbitMQ with Docker Compose:

```bash
docker-compose down
```

## License 📄

[MIT](https://choosealicense.com/licenses/mit/)
