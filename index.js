import express from 'express';
import pool from './data/db.js';

const app = express();
const PORT  = 3000;


app.get('/kolcsonzesek', async (req, res) => {    
    let sql = 'SELECT kolcsonzesek.id, konyvek.cim, olvasok.nev, datum, visszahozva FROM `kolcsonzesek` INNER JOIN konyvek ON konyvek.id = konyvId INNER JOIN olvasok ON olvasok.id = olvasoId;';
    let eredmeny = await pool.query(sql);
    
    res.json(eredmeny);
});

app.get('/konyvek/elerheto', async (req, res) => {
    let sql = 'SELECT * FROM konyvek WHERE NOT EXISTS ( SELECT * FROM kolcsonzesek WHERE kolcsonzesek.konyvId = konyvek.id AND kolcsonzesek.visszahozva = "false" );';
    let eredmeny = await pool.query(sql);

    res.json(eredmeny);
});

app.get('/olvasok/:id/kolcsonzesek', async (req, res) => {
    const id = req.params.id;

    let sql = `SELECT olvasok.id, olvasok.nev, konyvek.cim FROM kolcsonzesek INNER JOIN konyvek ON konyvek.id = kolcsonzesek.konyvId INNER JOIN olvasok ON kolcsonzesek.olvasoId = olvasok.id WHERE olvasok.id = ${id};`;
    let eredmeny = await pool.query(sql);

    res.json(eredmeny);
});

app.post('/kolcsonzesek', async (req, res) => {
    const {konyvId, olvasoId} = req.query;

    if(!konyvId || !olvasoId){
        res.status(400).send("Hiba: Hiányzó értékek!");
    }

    let sql = `INSERT INTO kolcsonzesek(konyvId, olvasoId) VALUES (${konyvId}, ${olvasoId});`;
    let eredmeny = await pool.query(sql);

    res.json(eredmeny);
});


app.listen(PORT, () => {
    console.log(`Szerver fut: http://localhost:${3000}`);
});