import amqp from "amqplib";

// RabbitMQ connection string
const amqpUrl = process.env.RABBITMQ_URL || "amqp://localhost";

export async function sendToQueue(queue: string, message: any) {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect(amqpUrl);
    // Create a channel
    const channel = await connection.createChannel();

    // Assert a queue into existence
    await channel.assertQueue(queue, {
      durable: true, // The queue will survive a broker restart
    });

    // Send a message to the queue
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true, // The message will be persisted to disk
    });

    console.log(`Message sent to queue "${queue}":`, message);

    // Close the connection after a short delay
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Error sending message to RabbitMQ:", error);
  }
}
