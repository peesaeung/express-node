import bodyParser from "body-parser";
import express, {Application, Request, Response} from 'express';
import {PrismaClient} from "@prisma/client/"

const app: Application = express();
const PORT: number = 3000;
const prisma = new PrismaClient();

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    console.log(req);
    res.send('Express + TypeScript Server');
});
app.post('/patient', async (req: Request, res: Response) => {
    console.log(req.body.HNtest);
    let hnjson = req.body.HNtest;
    for (let i in hnjson) {
        hnjson[i].birth_date = new Date(hnjson[i].birth_date);
    }
    console.log(hnjson);
    await res.send('Patient POST');
    // Patient data (HN) >> Upsert HN >> PID
    // Upsert to patient_info db
    for (let i in hnjson) {
        await prisma.patient_info.upsert({
            create: hnjson[i],
            update: hnjson[i],
            where: {
                org_id_hn: {
                    org_id: hnjson[i]['org_id'],
                    hn: hnjson[i]['hn']
                }
            }
        });
    }
});
app.post('/visit', async (req: Request, res: Response) => {
    console.log(req.query);
    await res.send('Visit POST');
    // Transform >> PID, TXN >> Upsert TXN >> PID, VID
    // Upsert to txn_info db
    /*for (let i in req.query.TXNtest) {
        await prisma.txn_info.upsert({
            create: req.queryTXNtest[i],
            update: req.query.TXNtest[i],
            where: {
                org_id_pid_txn: {
                    org_id: req.query.TXNtest[i]['org_id'],
                    pid: req.query.TXNtest[i]['pid'],
                    txn: req.query.TXNtest[i]['txn']
                }
            }
        });
        await socket.emit('txn_response', {'data': TXNtest[i]});
    }*/
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
