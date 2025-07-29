import { Kafka } from "kafkajs";

const TOPIC_NAME = "zap-event";

const kafka = new Kafka({
  clientId: "zapier-processor",
  brokers: ["localhost:9092"],
});

async function main() {
  const consumer = kafka.consumer({ groupId: "zapier-worker" });
  await consumer.connect();

  consumer.subscribe({ topic: TOPIC_NAME });

  await consumer.run({
    autoCommit : false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset : message.offset,
        value : message.value.toString(),
      });
    //   stop execution of the consumer
    await new Promise((resolve) => setTimeout(resolve, 1000));

    //   commit the message
    await consumer.commitOffsets([{
        topic : TOPIC_NAME,
        partition: partition,
        offset : (parseInt(message.offset) + 1).toString(),
    }])
    },
  });
}

main();
