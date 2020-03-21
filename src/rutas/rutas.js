const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('game');
});

router.get('/game', (req, res) => {
    res.render('game', {name: req.session.name});
});


router.post('/setNombre', (req, res) =>{
    let nombre = req.body.nombre;
    req.session.name = nombre;
    res.redirect(`/game`);
});

module.exports = router;