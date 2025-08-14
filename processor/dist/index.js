"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const prisma = new client_1.PrismaClient();
const TOPIC_NAME = "zap-event";
const kafka = new kafkajs_1.Kafka({
    clientId: 'zapier-processor',
    brokers: ['localhost:9092'],
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const processor = kafka.producer();
        yield processor.connect();
        while (true) {
            const pendingRows = yield prisma.zapRunOutBox.findMany({
                where: {},
                take: 10,
            });
            processor.send({
                topic: TOPIC_NAME,
                messages: pendingRows.map((row) => {
                    return {
                        value: JSON.stringify({ zapRunId: row.zapRunId, stage: 0 })
                    };
                }),
            });
            yield prisma.zapRunOutBox.deleteMany({
                where: {
                    id: {
                        in: pendingRows.map((row) => row.id),
                    },
                },
            });
            yield new Promise(r => setTimeout(r, 3000));
        }
    });
}
main();
