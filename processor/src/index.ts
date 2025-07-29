import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const prisma = new PrismaClient();
const TOPIC_NAME = "zap-event"

const kafka  = new Kafka({
    clientId: 'zapier-processor',
    brokers: ['localhost:9092'],
});

async function main() {

    const processor = kafka.producer();
    await processor.connect();

  while (true) {
    const pendingRows = await prisma.zapRunOutBox.findMany({
        where: {},
        take: 10,
    });

    processor.send({
        topic: TOPIC_NAME,
        messages: pendingRows.map((row) => {
            return {
                value: row.zapRunId,
            };
        }),
    })
 
    await prisma.zapRunOutBox.deleteMany({
        where: {
            id: {
                in: pendingRows.map((row) => row.id),
            },
        },
    })
  }
}

main();