const express = require('express');
const knex = require('knex')(require('./knexfile').development);

const router = express.Router();

router.post('/login', async (req, res) => {
    const { usuario, contrasena } = req.body;


    try {
        const user = await knex('usuario').where({ usuario }).first();
        
        if (user && contrasena === user.contrasena) { 
           
            res.json({
                valido: true,
                admi: user.admi,
                nom: user.nombre_usu,
                idUser: user.id_usuario                 
            });
        } else {
            res.json({
                valido: false
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

module.exports = router;
