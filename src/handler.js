import fs from 'fs';
import path from 'path';
import DateHelper from './dateHelper.js';
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
        return res.send(response);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return res.status(500).send({status: false, message: 'error server'});
    }
};

const getThumbByIdHandler = (request, res) => {
    try {
        const imageId = parseInt(request?.params?.id)||[];
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

const addingRev = async (req, res) => {
    const { id } = req?.params || {};
    const { name, review } = req?.body || {};
    if (!id || !name || !review) {
        return res.status(400).send('Payload tidak valid');
    }

    const DATE = new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
    const inDate = new Date(DATE);
    const year = inDate.getFullYear();
    const month = String(DateHelper.monthNameChecker(inDate.getMonth() + 1));
    const day = String(inDate.getDate());
    const date = `${day} ${month} ${year}`;
    const query = `
        INSERT INTO review (id_food, nama, tanggal, isi_review)
        VALUES ($1, $2, $3, $4) RETURNING id, id_food, nama, tanggal, isi_review
    `;
    const values = [id, name, date, review];
    const { rows } = await pool.query(query, values);
    if(!rows.length){
        return res.status(400).send({
            status: false,
            message: 'Failed to add review'
        });
    }
    return res.status(201).send({
        status: true,
        result: rows,
    });
}

const getReviewById = async (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT * FROM review WHERE id_food = $1
    `;
    const values = [id];
    const { rows } = await pool.query(query, values);
    if(!rows.length){
        return res.status(404).send({
            status: false,
            message: 'No review data'
        });
    }
    return res.send({
        status: true,
        result: rows,
    });
}

const searchRecipeByName = (req, res) => {
    try {
        const jsonData = fs.readFileSync(path.join(__dirname, '../assets/data', 'data.json'));
        const data = JSON.parse(jsonData);

        const { name } = req.query;
        if (!name) {
            return res.status(400).send({ status: false, message: 'Parameter nama resep diperlukan' });
        }

        const resepYangCocok = data.receipt.filter((resep) =>
            resep.name.toLowerCase().replace(/\s/g, '').includes(name.toLowerCase().replace(/\s/g, ''))
        );

        const response = {
            status: true,
            result: resepYangCocok,
        };

        return res.send(response);
    } catch (error) {
        console.error('Error membaca file JSON:', error);
        return res.status(500).send({ status: false, message: 'Error server' });
    }
};

const filterByRegional = (req, res) => {
    try {
        const jsonData = fs.readFileSync(path.join(__dirname, '../assets/data', 'data.json'));
        const data = JSON.parse(jsonData);

        const { regional } = req.query;
        if (!regional) {
            return res.status(400).send({ status: false, message: 'Parameter regional diperlukan' });
        }

        const filteredRecipes = data.receipt.filter((recipe) =>
            recipe.regional.toLowerCase().replace(/\s/g, '') === regional.toLowerCase().replace(/\s/g, '')
        );

        const response = {
            status: true,
            result: filteredRecipes,
        };

        return res.send(response);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return res.status(500).send({ status: false, message: 'Error server' });
    }
};

const getDistinctRegionals = (req, res) => {
    try {
        const jsonData = fs.readFileSync(path.join(__dirname, '../assets/data', 'data.json'));
        const data = JSON.parse(jsonData);

        // Mengambil daftar nama regional unik
        const distinctRegionals = [...new Set(data.receipt.map(recipe => recipe.regional))];

        const response = {
            status: true,
            result: distinctRegionals,
        };

        return res.send(response);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return res.status(500).send({ status: false, message: 'Error server' });
    }
};

const getRecipeByName = (req, res) => {
    try {
        const jsonData = fs.readFileSync(path.join(__dirname, '../assets/data', 'data.json'));
        const data = JSON.parse(jsonData);

        const { name } = req.params;
        if (!name) {
            return res.status(400).send({ status: false, message: 'Parameter nama resep diperlukan' });
        }

        const matchingRecipes = data.receipt.filter((recipe) =>
            recipe.name.toLowerCase().replace(/\s/g, '').includes(name.toLowerCase().replace(/\s/g, ''))
        );

        const response = {
            status: true,
            result: matchingRecipes,
        };

        return res.send(response);
    } catch (error) {
        console.error('Error membaca file JSON:', error);
        return res.status(500).send({ status: false, message: 'Error server' });
    }
};

const getRecipesByRegional = (req, res) => {
    try {
        const jsonData = fs.readFileSync(path.join(__dirname, '../assets/data', 'data.json'));
        const data = JSON.parse(jsonData);

        const { regional } = req.params;
        if (!regional) {
            return res.status(400).send({ status: false, message: 'Parameter regional diperlukan' });
        }

        const filteredRecipes = data.receipt.filter((recipe) =>
            recipe.regional.toLowerCase().replace(/\s/g, '') === regional.toLowerCase().replace(/\s/g, '')
        );

        const response = {
            status: true,
            result: filteredRecipes,
        };

        return res.send(response);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return res.status(500).send({ status: false, message: 'Error server' });
    }
};

const addingReview = async (req, res) => {
    const { id, name, review } = req.body || {};
    if (!id || !name || !review) {
        return res.status(400).send('Payload tidak valid');
    }

    const DATE = new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
    const inDate = new Date(DATE);
    const year = inDate.getFullYear();
    const month = String(DateHelper.monthNameChecker(inDate.getMonth() + 1));
    const day = String(inDate.getDate());
    const date = `${day} ${month} ${year}`;
    const query = `
        INSERT INTO review (id_food, nama, tanggal, isi_review)
        VALUES ($1, $2, $3, $4) RETURNING id, id_food, nama, tanggal, isi_review
    `;
    const values = [id, name, date, review];
    const { rows } = await pool.query(query, values);
    if(!rows.length){
        return res.status(400).send({
            status: false,
            message: 'Failed to add review'
        });
    }
    return res.status(201).send({
        status: true,
        result: rows,
    });
}


export { getCulinaries, getThumbByIdHandler, addingRev, getReviewById, searchRecipeByName,
         filterByRegional, getDistinctRegionals, getRecipeByName, getRecipesByRegional, addingReview };