exports.up = function(knex) {
    return knex.schema
      .createTable('tipo_ambiente', function (table) {
        table.increments('id_tipo_am');
        table.string('nombre_tipo', 40).notNullable().unique();
      })
      .createTable('ambiente', function (table) {
        table.increments('id_ambiente');
        table.integer('id_tipo_am').unsigned().references('id_tipo_am').inTable('tipo_ambiente');
        table.char('numero', 4).notNullable().unique();
        table.integer('capacidad').notNullable();
        table.string('descripcion', 255);
        table.boolean('activo').defaultTo(false);
        table.boolean('habilitado').defaultTo(true);
      })
      .createTable('facilidad', function (table) {
        table.increments('id_facilidad');
        table.string('nombre_faci', 40).notNullable().unique();
      })
      .createTable('tiene_facilidad', function (table) {
        table.increments('id_tiene_fac');
        table.integer('id_ambiente').unsigned().references('id_ambiente').inTable('ambiente');
        table.integer('id_facilidad').unsigned().references('id_facilidad').inTable('facilidad');
      })
      .createTable('periodo', function (table) {
        table.increments('id_periodo');
        table.time('hora_ini').notNullable();
        table.time('hora_fin').notNullable();
      })
      .createTable('usuario', function (table) {
        table.increments('id_usuario');
        table.string('nombre_usu', 40).notNullable();
        table.char('usuario', 20).notNullable().unique();
        table.char('contrasena', 20).notNullable();
        table.boolean('admi').defaultTo(false);
      })
      .createTable('reserva', function (table) {
        table.increments('id_reserva');
        table.integer('id_usuario').unsigned().references('id_usuario').inTable('usuario');
        table.integer('id_ambiente').unsigned().references('id_ambiente').inTable('ambiente');
        table.integer('id_periodo').unsigned().references('id_periodo').inTable('periodo');
        table.date('fecha').notNullable();
        table.string('estado', 40).notNullable();
      })
      .then(function() {
        return knex('tipo_ambiente').insert([
           { nombre_tipo: 'AULA COMUN' },
           { nombre_tipo: 'AULA LAB FISICA' },
           { nombre_tipo: 'AULA LAB QUIMICA' },
           { nombre_tipo: 'AUDITORIO' }
        ]);
      })
      .then(function() {
        return knex('ambiente').insert([

            { id_tipo_am: 1, numero: '690A', capacidad: 50, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 1, numero: '690B', capacidad: 50, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 1, numero: '690C', capacidad: 40, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 1, numero: '690D', capacidad: 40, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 1, numero: '690E', capacidad: 50, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 1, numero: '690E', capacidad: 50, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 1, numero: '690F', capacidad: 60, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 2, numero: '690G', capacidad: 80, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 1, numero: '691A', capacidad: 50, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 1, numero: '691B', capacidad: 40, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 1, numero: '691C', capacidad: 50, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 1, numero: '691D', capacidad: 60, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 1, numero: '691E', capacidad: 40, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 1, numero: '691E', capacidad: 50, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 1, numero: '691F', capacidad: 60, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true },
            { id_tipo_am: 2, numero: '691G', capacidad: 80, descripcion: 'Ubicacion: Edificio nuevo', activo: true, habilitado: true }
        ]);
      })
      .then(function() {
        return knex('facilidad').insert([
          { nombre_faci: 'Televisor' },
          { nombre_faci: 'Data' },
        ]);
      })
      .then(function() {
        return knex('tiene_facilidad').insert([
          { id_ambiente: 1, id_facilidad: 2 },
          { id_ambiente: 2, id_facilidad: 2 },
          { id_ambiente: 3, id_facilidad: 2 },
          { id_ambiente: 4, id_facilidad: 2 },
          { id_ambiente: 5, id_facilidad: 2 },
          { id_ambiente: 6, id_facilidad: 2 },
          { id_ambiente: 7, id_facilidad: 2 },
          { id_ambiente: 8, id_facilidad: 2 },
          { id_ambiente: 9, id_facilidad: 2 },
          { id_ambiente: 10, id_facilidad: 2 },
          { id_ambiente: 11, id_facilidad: 2 },
          { id_ambiente: 12, id_facilidad: 2 },
          { id_ambiente: 13, id_facilidad: 2 },
          { id_ambiente: 14, id_facilidad: 2 },
          { id_ambiente: 15, id_facilidad: 2 },
          { id_ambiente: 16, id_facilidad: 2 },
          { id_ambiente: 7, id_facilidad: 1 },
          { id_ambiente: 8, id_facilidad: 1 },
          { id_ambiente: 15, id_facilidad: 1 },
          { id_ambiente: 16, id_facilidad: 1 }
        ]);
      })
      .then(function() {
        return knex('usuario').insert([
          { nombre_usu: 'Giovani Brun', usuario: 'Denisxd', contrasena: '123', admi: true },
          { nombre_usu: 'Jorge Salazar', usuario: 'Jorgitoxd', contrasena: '456', admi: false },
          { nombre_usu: 'Luz Flores', usuario: 'Luzxd', contrasena: '789', admi: false }  
        ]);
      })
      .then(function () {
        return knex('periodo').insert([
          { hora_ini: '06:45:00', hora_fin: '07:30:00' },
          { hora_ini: '07:30:00', hora_fin: '08:15:00' },
          { hora_ini: '08:15:00', hora_fin: '09:00:00' },
          { hora_ini: '09:00:00', hora_fin: '09:45:00' },
          { hora_ini: '09:45:00', hora_fin: '10:30:00' },
          { hora_ini: '10:30:00', hora_fin: '11:15:00' },
          { hora_ini: '11:15:00', hora_fin: '12:00:00' },
          { hora_ini: '12:00:00', hora_fin: '12:45:00' },
          { hora_ini: '12:45:00', hora_fin: '13:30:00' },
          { hora_ini: '13:30:00', hora_fin: '14:15:00' },
          { hora_ini: '14:15:00', hora_fin: '15:00:00' },
          { hora_ini: '15:00:00', hora_fin: '15:45:00' },
          { hora_ini: '15:45:00', hora_fin: '16:30:00' },
          { hora_ini: '16:30:00', hora_fin: '17:15:00' },
          { hora_ini: '17:15:00', hora_fin: '18:00:00' },
          { hora_ini: '18:00:00', hora_fin: '18:45:00' },
          { hora_ini: '18:45:00', hora_fin: '19:30:00' },
          { hora_ini: '19:30:00', hora_fin: '20:15:00' },
          { hora_ini: '20:15:00', hora_fin: '21:00:00' },
          { hora_ini: '21:00:00', hora_fin: '21:45:00' }
        ]);
      })
      .then(function () {
        return knex('reserva').insert([
          { id_usuario: 2, id_ambiente: 10, id_periodo: 8, fecha: '2023-10-25', estado: 'Pendiente' },
          { id_usuario: 2, id_ambiente: 6, id_periodo: 12, fecha: '2023-10-26', estado: 'Pendiente' },
          { id_usuario: 2, id_ambiente: 4, id_periodo: 10, fecha: '2023-10-27', estado: 'Pendiente' },
          { id_usuario: 2, id_ambiente: 9, id_periodo: 3, fecha: '2023-10-28', estado: 'Pendiente' },
          { id_usuario: 2, id_ambiente: 11, id_periodo: 9, fecha: '2023-10-28', estado: 'Pendiente' },
          { id_usuario: 3, id_ambiente: 2, id_periodo: 5, fecha: '2023-10-29', estado: 'Pendiente' },
          { id_usuario: 3, id_ambiente: 5, id_periodo: 6, fecha: '2023-10-30', estado: 'Pendiente' },
          { id_usuario: 3, id_ambiente: 7, id_periodo: 15, fecha: '2023-10-31', estado: 'Pendiente' },
          { id_usuario: 3, id_ambiente: 10, id_periodo: 8, fecha: '2023-10-31', estado: 'Pendiente' },
          { id_usuario: 3, id_ambiente: 3, id_periodo: 7, fecha: '2023-11-01', estado: 'Pendiente' }
        ]);
      })
      .then(function() {
        return knex.raw(`
          DELIMITER //
          CREATE PROCEDURE crearAmbiente(
            IN p_id_tipo_am INT,
            IN p_numero CHAR(4),
            IN p_capacidad INT,
            IN p_descripcion VARCHAR(40)
          )
          BEGIN
            DECLARE v_id_ambiente INT;
  
            INSERT INTO ambiente (id_tipo_am, numero, capacidad, descripcion, activo, habilitado)
            VALUES (p_id_tipo_am, p_numero, p_capacidad, p_descripcion, TRUE, TRUE);
  
            SELECT LAST_INSERT_ID() INTO v_id_ambiente;
  
            SELECT v_id_ambiente;
          END //
          DELIMITER ;
        `);
        
      })
      .then(function() {
        return knex.raw(`
          DELIMITER //
          CREATE PROCEDURE agregarFacilidad(
            IN p_id_ambiente INT,
            IN p_id_facilidad INT
          )
          BEGIN
            INSERT INTO tiene_facilidad (id_ambiente, id_facilidad)
            VALUES (p_id_ambiente, p_id_facilidad);
          END //
          DELIMITER ;
        `);
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('reserva')
      .dropTableIfExists('usuario')
      .dropTableIfExists('periodo')
      .dropTableIfExists('tiene_facilidad')
      .dropTableIfExists('facilidad')
      .dropTableIfExists('ambiente')
      .dropTableIfExists('tipo_ambiente')
      .raw('DROP PROCEDURE IF EXISTS crearAmbiente')
      .raw('DROP PROCEDURE IF EXISTS agregarFacilidad');
  };
  