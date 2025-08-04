

import prisma from "../src/db";

async function main() {
    await prisma.availableTriggers.create({
        data : {
            name: "Web Hook",
            image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXGQWBgPLNmjfNp-yvEt92o40TQiuoe4Iojw&s"
        }
    });

    await prisma.availableAction.create({
        data : {
            name : "Email",
            image : "https://media.istockphoto.com/id/2052093189/vector/blue-mail-icon-mail-button-vector.jpg?s=612x612&w=0&k=20&c=nUYbs8zEExhLHw2yYD7sX59KdFPoXMsTUyX5qbgeIVU=",
        }
    })

    await prisma.availableAction.create({
        data : {
            name : "Solana",
            image : "https://cdn-icons-png.flaticon.com/512/6001/6001527.png"
        }
    })
}

main();