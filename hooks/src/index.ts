
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express(); 
app.use(express.json());

app.post('/hooks/catch/:user/:zapId', async (req, res) => {
    const user = req.params.user;
    const zapId = req.params.zapId;
    const body = req.body;

    // store in db a new trigger for this user
    // create transition for this user 
    console.log("Rich Hook Called");
    await prisma.$transaction(async (tsx) => {
        // create a new zapRun
        console.log("Creating a new ZapRun");
        const run = await tsx.zapRun.create({
            data: {
                zapId : zapId,
                metaData: body,
            },
        });

        console.log("Creating a new ZapRunOutBox")

        await tsx.zapRunOutBox.create({
            data: {
                zapRunId: run.id,
            },
        });

        // create a new trigger
        console.log("Creating a new Trigger");
    });

    res.json({
        status: 'success',
        message : "Successfully created a new ZapRun",
    })
    // push it on to a queue
})

app.listen(3000, () => {
  console.log('listening on port 3000');
});
