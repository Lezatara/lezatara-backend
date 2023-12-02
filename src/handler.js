import fs from 'fs';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pg from 'pg'
const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const URL = `postgresql://syahrul11aemry:HnFYDvBh8b3j@ep-snowy-sky-58280439-pooler.ap-southeast-1.aws.neon.tech/dblezatara`;
const pool = new Pool({
    connectionString: URL,
    ssl: {
        rejectUnauthorized: false,
        sslmode: 'require',
    },
});


const getCulinaries = (req, res) => {
    try {
        const jsonData = fs.readFileSync(path.join(__dirname, '../assets/data', 'data.json'));
        const data = JSON.parse(jsonData);
        const response = {
            status: true,
            result: data.receipt,
        }
        res.send(response);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return res.status(500).send({status: false, message: 'error server'});
    }
};

const getThumbByIdHandler = (request, res) => {
    try {
        const imageId = parseInt(request.params.id);
        console.log(imageId);
        const data = fs.readFileSync(path.join(__dirname, '../assets/data', 'data-img.json'));
        const jsonData = JSON.parse(data);
        const thumbnailImg = jsonData.thumbnail.find((thumb) => thumb.id === imageId);

        console.log(thumbnailImg);

        if (thumbnailImg) {
            const { fileName } = thumbnailImg;
            const imagePath = path.join(__dirname, '../assets/thumbnail', fileName);

            return res.sendFile(imagePath);
        }
        return res.status(404).send({status: false, message: 'Data not found'});
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return res.status(500).send({status: false, message: 'error server'});
    }
};

export { getCulinaries, getThumbByIdHandler };