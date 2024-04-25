const express = require('express');
const knexConfig = require('./knexfile').development;
const knex = require('knex')(knexConfig);
const router = express.Router();

//Obtener todas las aulas
router.get('/getAulas', (req, res) => {
    knex('ambiente').select()
    .then(aulas => res.json(aulas))
    .catch(err => res.status(500).json({ message: 'Error al obtener todas las aulas' }));
});

// Ruta para obtener información administrativa de los ambientes
router.get('/ambientesAdmin', (req, res) => {
    knex.select(
        'a.id_ambiente', 
        't.id_tipo_am',
        't.nombre_tipo as Tipo de ambiente',
        'a.numero as Numero',
        'a.capacidad as Capacidad',
        'a.descripcion as Descripcion',
        'a.activo as Activo',
        'a.habilitado as Habilitado',
        knex.raw('IFNULL(GROUP_CONCAT(f.nombre_faci ORDER BY f.nombre_faci ASC), "Sin facilidades") as Facilidades')
    )
    .from('tipo_ambiente as t')
    .join('ambiente as a', 't.id_tipo_am', 'a.id_tipo_am')
    .leftJoin('tiene_facilidad as tf', 'a.id_ambiente', 'tf.id_ambiente')
    .leftJoin('facilidad as f', 'tf.id_facilidad', 'f.id_facilidad')
    .groupBy('a.id_ambiente')
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener la información de ambientesAdmin' });
    });
});

router.get('/reservasAdmin', async (req, res) => {
    try {
        const reservas = await knex('reserva as r')
            .select(
                'r.id_reserva',
                'u.nombre_usu as NombreUsuario',
                't.nombre_tipo as TipoAmbiente',
                'a.numero as Numero',
                'a.capacidad as Capacidad',
                'a.descripcion as Descripcion',
                knex.raw('GROUP_CONCAT(DISTINCT f.nombre_faci ORDER BY f.nombre_faci ASC) as Facilidades'),
                'p.hora_ini as HoraInicio',
                'p.hora_fin as HoraFin',
                'r.fecha as Fecha',
                'r.estado as Estado'
            )
            .join('usuario as u', 'r.id_usuario', 'u.id_usuario')
            .join('ambiente as a', 'r.id_ambiente', 'a.id_ambiente')
            .join('tipo_ambiente as t', 'a.id_tipo_am', 't.id_tipo_am')
            .join('periodo as p', 'r.id_periodo', 'p.id_periodo')
            .leftJoin('tiene_facilidad as tf', 'a.id_ambiente', 'tf.id_ambiente')
            .leftJoin('facilidad as f', 'tf.id_facilidad', 'f.id_facilidad')
            .groupBy('r.id_reserva')
            .orderBy('r.fecha', 'desc');

        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.status(500).json({ message: 'Error al obtener las reservas' });
    }
});

//Buscar los tipos de ambientes
router.get('/tiposDeAmbientes', (req, res) => {
    knex.select('id_tipo_am', 'nombre_tipo')
        .from('tipo_ambiente')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error("Error al obtener los tipos de ambiente:", err);
            res.status(500).json({ message: 'Error al obtener los tipos de ambiente' });
        });
});

//Buscar las facilidades
router.get('/facilidades', (req, res) => {
    knex.select('id_facilidad', 'nombre_faci')
        .from('facilidad')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error("Error al obtener las facilidades:", err);
            res.status(500).json({ message: 'Error al obtener las facilidades' });
        });
});

router.get('/aulasDisponibles/:fecha/:idPeriodo', async (req, res) => {
    const { fecha, idPeriodo } = req.params;

    try {
        const aulasDisponibles = await knex('ambiente as a')
            .select(
                'a.id_ambiente',
                't.nombre_tipo',
                'a.numero', 
                'a.capacidad', 
                'a.descripcion',
                knex.raw('GROUP_CONCAT(f.nombre_faci ORDER BY f.nombre_faci ASC) as facilidades')
            )
            .join('tipo_ambiente as t', 'a.id_tipo_am', 't.id_tipo_am')
            .leftJoin('tiene_facilidad as tf', 'a.id_ambiente', 'tf.id_ambiente')
            .leftJoin('facilidad as f', 'tf.id_facilidad', 'f.id_facilidad')
            .where({ 'a.activo': true, 'a.habilitado': true })
            .whereNotExists(
                knex.select('*')
                    .from('reserva as r')
                    .join('periodo as p', 'r.id_periodo', 'p.id_periodo')
                    .whereRaw('r.id_ambiente = a.id_ambiente')
                    .andWhere('r.fecha', fecha)
                    .andWhere('p.id_periodo', idPeriodo)
                    .whereIn('r.estado', ['Aceptado', 'Pendiente'])
            )
            .groupBy('a.id_ambiente')
            .orderBy('a.numero');

        res.json(aulasDisponibles);
    } catch (error) {
        console.error('Error al buscar aulas disponibles:', error);
        res.status(500).json({ message: 'Error al buscar aulas disponibles' });
    }
});

router.get('/aulasDisponibles/:fecha/:idPeriodo/:capacidadUsuario', async (req, res) => {
    const { fecha, idPeriodo, capacidadUsuario } = req.params;

    try {
        const aulasDisponibles = await knex('ambiente as a')           
            .select(
                'a.id_ambiente',
                't.nombre_tipo',
                'a.numero', 
                'a.capacidad', 
                'a.descripcion',
                knex.raw('GROUP_CONCAT(f.nombre_faci ORDER BY f.nombre_faci ASC) as facilidades')
            )
            .join('tipo_ambiente as t', 'a.id_tipo_am', 't.id_tipo_am')
            .leftJoin('tiene_facilidad as tf', 'a.id_ambiente', 'tf.id_ambiente')
            .leftJoin('facilidad as f', 'tf.id_facilidad', 'f.id_facilidad')
            .where({ 'a.activo': true, 'a.habilitado': true })
            .andWhere('a.capacidad', '>=', capacidadUsuario)
            .whereNotExists(
                knex.select('*')
                    .from('reserva as r')
                    .join('periodo as p', 'r.id_periodo', 'p.id_periodo')
                    .whereRaw('r.id_ambiente = a.id_ambiente')
                    .andWhere('r.fecha', fecha)
                    .andWhere('p.id_periodo', idPeriodo)
                    .whereIn('r.estado', ['Aceptado', 'Pendiente'])
            )
            .groupBy('a.id_ambiente')
            .orderBy('a.numero');

        res.json(aulasDisponibles);
    } catch (error) {
        console.error('Error al buscar aulas disponibles:', error);
        res.status(500).json({ message: 'Error al buscar aulas disponibles' });
    }
});

router.get('/verificarReserva/:idUsuario/:idAmbiente/:periodo/:fecha', async (req, res) => {
    const { idUsuario, idAmbiente, periodo, fecha } = req.params;

    try {
        const reservaExistente = await knex('reserva')
            .where({
                id_usuario: idUsuario,
                id_ambiente: idAmbiente,
                id_periodo: periodo,
                fecha: fecha
            })
            .first();

        if (reservaExistente) {
            res.json({ reservaExistente: true });
        } else {
            res.json({ reservaExistente: false });
        }
    } catch (error) {
        console.error('Error al verificar la reserva existente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.get('/numeroReservasDelDia/:idUsuario/:idAmbiente/:fecha', async (req, res) => {
    const { idUsuario, idAmbiente, fecha } = req.params;

    try {
        const numeroReservas = await knex('reserva')
            .where({
                id_usuario: idUsuario,
                id_ambiente: idAmbiente,
                fecha: fecha
            })
            .count('id_reserva as numReservas');

        if (numeroReservas.length > 0) {
            res.json({ numReservas: numeroReservas[0].numReservas });
        } else {
            res.json({ numReservas: 0 });
        }
    } catch (error) {
        console.error('Error al contar las reservas del día:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Buscar aulas por su tipo
router.get('/tipo/:tipoId', (req, res) => {
    const { tipoId } = req.params;
    knex('ambiente').where('id_tipo_am', tipoId).select()
    .then(aulas => res.json(aulas))
    .catch(err => res.status(500).json({ message: 'Error al obtener las aulas' }));
});

// Buscar un aula por su ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    knex('ambiente').where('id_ambiente', id).select()
    .then(aula => {
        if(aula.length) res.json(aula[0]);
        else res.status(404).json({ message: 'Aula no encontrada' });
    })
    .catch(err => res.status(500).json({ message: 'Error al obtener el aula' }));
});

// Buscar un aula por su numero
router.get('/buscarAmbiente/:numero', (req, res) => {
    const { numero } = req.params;
    knex('ambiente').where('numero', numero).select()
    .then(aula => {
        if(aula.length) res.json(aula[0]);
        else res.status(404).json({ message: 'Aula no encontrada' });
    })
    .catch(err => res.status(500).json({ message: 'Error al obtener el aula' }));
});

//Historial de reservas de un usuario
router.get('/historial/:idUsuario', async (req, res) => {
    const idUsuario = req.params.idUsuario;

    try {
        const historialReservas = await knex('ambiente as a')
            .select(
                'r.id_reserva',
                't.nombre_tipo',
                'a.numero', 
                'a.capacidad', 
                'a.descripcion', 
                knex.raw('GROUP_CONCAT(f.nombre_faci ORDER BY f.nombre_faci ASC) as facilidades'),
                knex.raw('DATE_FORMAT(r.fecha, "%Y-%m-%d") as fecha'), 
                'p.hora_ini',
                'p.hora_fin',
                'r.estado'
            )
            .innerJoin('tipo_ambiente as t', 'a.id_tipo_am', 't.id_tipo_am')
            .innerJoin('reserva as r', 'a.id_ambiente', 'r.id_ambiente')
            .innerJoin('usuario as u', 'u.id_usuario', 'r.id_usuario')
            .innerJoin('periodo as p', 'p.id_periodo', 'r.id_periodo')
            .leftJoin('tiene_facilidad as tf', 'a.id_ambiente', 'tf.id_ambiente')
            .leftJoin('facilidad as f', 'tf.id_facilidad', 'f.id_facilidad')
            .where('u.id_usuario', idUsuario)
            .groupBy('r.id_reserva')
            .orderBy('r.fecha', 'desc');

        res.json(historialReservas);
    } catch (error) {
        console.error('Error al obtener el historial de reservas:', error);
        res.status(500).json({ message: 'Error al obtener el historial de reservas' });
    }
});


// Ruta para crear un nuevo ambiente
router.post('/crearAmbiente', async (req, res) => {
    const { tipo_ambiente, numero, capacidad, descripcion, facilidades } = req.body;
    
    try {
        
        const ambienteResult = await knex.raw('CALL crearAmbiente(?, ?, ?, ?)', [tipo_ambiente, numero, capacidad, descripcion]);
        const id_ambiente = ambienteResult[0][0][0].v_id_ambiente;


        for (let id_facilidad of facilidades) {
            await knex.raw('CALL agregarFacilidad(?, ?)', [id_ambiente, parseInt(id_facilidad)]);
        }
        
        res.json({ message: 'Ambiente y facilidades agregados exitosamente', id_ambiente: id_ambiente });
    } catch (error) {
        console.error("Error al crear el ambiente:", error);
        res.status(500).json({ message: 'Error al crear el ambiente' });
    }
});

router.post('/crearReserva', async (req, res) => {
    const { idUsuario, idAmbiente, periodo, fecha} = req.body;

    try {
        
        await knex('reserva').insert({
            id_usuario: idUsuario,
            id_ambiente: idAmbiente,
            id_periodo: periodo,
            fecha: fecha,
            estado: 'Pendiente'
        });

        res.json({ message: 'Reserva enviada para su aprobacion.' });
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        res.status(500).json({ message: 'Error al crear la reserva' });
    }
});

// Cambiar el estado del atributo habilitado de un aula específica
router.put('/:id/habilitado', (req, res) => {
    const { id } = req.params;
    const { habilitado } = req.body;  

    knex('ambiente').where('id_ambiente', id).update({ habilitado })
    .then(count => {
        if(count) res.json({ message: 'Estado "habilitado" actualizado correctamente' });
        else res.status(404).json({ message: 'Aula no encontrada' });
    })
    .catch(err => res.status(500).json({ message: 'Error al actualizar el estado "habilitado"' }));
});

// Actualizar aula
router.put('/actualizarAmbiente/:id', (req, res) => {
    const { id } = req.params;
    const { numero, capacidad, descripcion, tipo_ambiente, activo, habilitado } = req.body;
    
    console.log(id);
    console.log(tipo_ambiente);

    knex('ambiente')
    .where('id_ambiente', id)
    .update({
        numero,
        capacidad,
        descripcion,
        id_tipo_am: tipo_ambiente, 
        activo,
        habilitado
    })
    .then(count => {
        if(count) res.json({ message: 'Aula actualizada correctamente' });
        else res.status(404).json({ message: 'Aula no encontrada' });
    })
    .catch(err => res.status(500).json({ message: 'Error al actualizar el aula', error: err }));
});

router.put('/actualizarEstadoReserva/:idReserva', async (req, res) => {
    const { idReserva } = req.params;
    const { estado } = req.body;

    try {
        const estadosPermitidos = ['Pendiente', 'Aceptado', 'Rechazado'];
        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({ message: 'Estado no válido.' });
        }

        const resultado = await knex('reserva')
            .where('id_reserva', idReserva)
            .update({ estado });

        if (resultado) {
            res.json({ message: 'Estado actualizado correctamente.' });
        } else {
            res.status(404).json({ message: 'Reserva no encontrada.' });
        }
    } catch (error) {
        console.error('Error al actualizar el estado de la reserva:', error);
        res.status(500).json({ message: 'Error al actualizar el estado de la reserva' });
    }
});

module.exports = router;  
