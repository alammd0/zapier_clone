
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
    await prisma.$transaction(async (tsx) => {
        const run = await tsx.zapRun.create({
            data: {
                zapId : zapId,
                metaData: body,
            },
        });

        await tsx.zapRunOutBox.create({
            data: {
                zapRunId: run.id,
            },
        });
    });

    res.json({
        status: 'success',
        message : "Successfully created a new ZapRun",
    })
})

app.listen(3001, () => {
  console.log('listening on port 3001');
});
