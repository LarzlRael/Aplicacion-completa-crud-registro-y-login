const express = require('express');
const router = express.Router();

const pool = require('../dataBase')
const { isLoggenIn } = require('../lib/auth');

router.get('/add', isLoggenIn, (req, res) => {
    res.render('links/add')
});
router.post('/add', isLoggenIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id:req.user.id
    };
    await pool.query('INSERT INTO links SET ? ', [newLink]);
    req.flash('success', 'Guardado correctamente');
    res.redirect('/links')
});

router.get('/', isLoggenIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM  links WHERE user_id = ?',[req.user.id]);
    res.render('links/list', { links: links })
});
router.get('/delete/:id', isLoggenIn, async (req, res) => {
    const { id } = req.params;
    await pool.query("DELETE FROM links WHERE ID = ?", [id]);
    req.flash('success', 'link eliminado satisfactoriamente');
    res.redirect('/links');
});
router.get('/edit/:id', isLoggenIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query("SELECT * FROM links WHERE id = ?", [id]);
    console.log(links[0]);
    res.render('links/edit', { links: links[0] });
});
router.post('/update/:id', isLoggenIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    }
    await pool.query("UPDATE links SET ? WHERE id = ?", [newLink, id]);
    req.flash('success', 'actualizado satisfactoriamente');
    res.redirect('/links');
})


module.exports = router;
