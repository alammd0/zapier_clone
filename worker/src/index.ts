import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";
import { parse } from "./parser";
import { JsonObject } from "@prisma/client/runtime/library";
import { sendEmail } from "./email";
import { sendSol } from "./sendSol";

const prism = new PrismaClient();

const TOPIC_NAME = "zap-event";

const kafka = new Kafka({
  clientId: "zapier-processor",
  brokers: ["localhost:9092"],
});

async function main() {
  const consumer = kafka.consumer({ groupId: "zapier-worker" });
  await consumer.connect();
  const producer = kafka.producer();
  await producer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  await consumer.run({
    autoCommit : false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset : message.offset,
        value : message?.value?.toString(),
      });

      const parseValue = JSON.parse(message?.value?.toString() || "{}");
      const zapRunId = parseValue.zapRunId;
      const stage = parseValue.stage;

      const zapRunDetails = await  prism.zapRun.findFirst({
        where : {
          id : zapRunId
        },
        include : {
          zap : {   
            include : {
              action : {
                include : {
                  type : true
                }
              }
            }
          }
        }
      }); 
      
      const currentAction = zapRunDetails?.zap.action.find((x) => x.sortingOrder === stage);

      if(!currentAction){
        console.log("No action found");
        return;
      };

      console.log("Current Action - ", currentAction);

      const zapRunMetaData = zapRunDetails?.metaData;

      if(currentAction.type.name === "Email"){
          const body = parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetaData);
          const to = parse((currentAction.metadata as JsonObject)?.email as string, zapRunMetaData);
          console.log(`Sending email to ${to} with body ${body}`);
          await sendEmail(to, body);
      }

      if(currentAction.type.name === "Solana"){
         const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunMetaData);
         const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetaData);
         console.log(`Sending ${amount} SOL to ${address}`);
         await sendSol(address, amount);
      }

      await new Promise(r => setTimeout(r, 3000));

      const lastStage = (zapRunDetails?.zap.action.length || 1) - 1;
      console.log("Last Stage - ", lastStage);

      if(lastStage !== stage){
        console.log("Pushing in Queue");
        await producer.send({
          topic : TOPIC_NAME,
          messages : [{
            value : JSON.stringify({
              stage : stage + 1,
              zapRunId : zapRunId
            })
          }]
        })
      }

      console.log("Processing Done"); 
      await consumer.commitOffsets([{
        topic: TOPIC_NAME,
        partition,
        offset: (Number(message.offset) + 1).toString(),
      }]);
    },
  });
}

main();
