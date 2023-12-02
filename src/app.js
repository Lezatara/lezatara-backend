import Express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getCulinaries, getThumbByIdHandler, addingRev, getReviewById } from "./handler.js";
const app = Express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(Express.json());
app.use(cors());
app.use(Express.static(path.join(__dirname, 'images')));

app.get("/", (req, res) => {
    res.send("Smiling API");
});
app.get("/foods", getCulinaries);
app.get("/foods/image/:id", getThumbByIdHandler);
app.post("/foods/:id/review", addingRev);
app.get("/foods/:id/review", getReviewById);

export default app;