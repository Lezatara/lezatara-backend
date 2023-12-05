import Express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getCulinaries, getThumbByIdHandler, addingRev, getReviewById, searchRecipeByName, filterByRegional, getDistinctRegionals } from "./handler.js";
const app = Express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(Express.json());
app.use(cors());
app.use(Express.static(path.join(__dirname, 'images')));

app.get("/", (req, res) => {
    res.send([
    {
        "Title": "Documentation",
        "BASE URL": "https://lezatara-backend.vercel.app",
        "GET": {
            "Get All Foods": "/foods",
            "Get Food Image": "/foods/image/:id",
            "Get Food Review": "/foods/:id/review",
            "Get Search name": "foods/search?name=",
            "Get Filter Regional desc": "/foods/filter?regional=",
            "Get List Regional": "/regionals",
        },
        "POST": {
            "Post Review": "/foods/:id/review",
        }
    }
    ]);
});
app.get("/foods", getCulinaries);
app.get("/foods/image/:id", getThumbByIdHandler);
app.post("/foods/:id/review", addingRev);
app.get("/foods/:id/review", getReviewById);
app.get("/foods/search", searchRecipeByName);
app.get("/foods/filter", filterByRegional);
app.get("/regionals", getDistinctRegionals);

export default app;