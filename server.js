const express = require('express');
const app = express();

// FAILLE 1 : Secret Hardcodé
const AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"; 
const AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

app.get('/', (req, res) => {
    // FAILLE 2 : Injection XSS (Cible pour ZAP/DAST)
    const name = req.query.name || 'Visiteur';
    // On renvoie l'entrée utilisateur sans la nettoyer !
    res.send(`<h1>Bienvenue, ${name} !</h1>`);
});

app.listen(3000, () => { console.log('App running on port 3000'); });