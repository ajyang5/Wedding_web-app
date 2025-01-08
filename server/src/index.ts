import express, { Express } from "express";
import { save, load, copyMap } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post("/api/save", save);
app.get("/api/load", load);
app.get("/api/copyMap", copyMap);
app.listen(port, () => console.log(`Server listening on ${port}`));
