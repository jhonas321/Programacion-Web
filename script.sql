create table usuario(
    
    id_usuario    int primary key auto_increment,
    nombre_usu    varchar(40) not null,
    usuario       char(20) not null unique,
    contrasena    char(20) not null,
    admi          boolean default false
);
create table tipo_ambiente(
    id_tipo_am  int primary key auto_increment,
    nombre_tipo   varchar(40) not null unique
);


create table ambiente(
    id_ambiente    int primary key auto_increment,
    id_tipo_am     int,
    numero        char(4) not null unique,
    capacidad     int not null,
    descripcion   varchar(40),
    activo        boolean default false,
    habilitado    boolean default true,
    foreign key (id_tipo_am) references tipo_ambiente(id_tipo_am)
);

create table facilidad(
    id_facilidad  int primary key auto_increment,
    nombre_faci   varchar(40) not null unique
);

create table tiene_facilidad(
    id_tiene_fac int primary key auto_increment,
    id_ambiente  int,
    id_facilidad int,
    foreign key (id_ambiente) references ambiente(id_ambiente),
    foreign key (id_facilidad) references facilidad(id_facilidad)
);

create table periodo(
    id_periodo  int primary key auto_increment,
    hora_ini    time not null,
    hora_fin    time not null
 );
 
create table reserva(
    id_reserva    int primary key auto_increment,
    id_usuario    int,
    id_ambiente   int,
    id_periodo    int,
    fecha         date not null,
    estado        varchar(40) not null ,
    foreign key (id_usuario) references usuario(id_usuario),
    foreign key (id_ambiente) references ambiente(id_ambiente),
    foreign key (id_periodo) references periodo(id_periodo)
);



INSERT INTO tipo_ambiente(nombre_tipo)
VALUES ("AULA COMUN");
INSERT INTO tipo_ambiente(nombre_tipo)
VALUES ("AULA LAB FISICA");
INSERT INTO tipo_ambiente(nombre_tipo)
VALUES ("AULA LAB QUIMICA");
INSERT INTO tipo_ambiente(nombre_tipo)
VALUES ("AUDITORIO");

INSERT INTO ambiente (id_tipo_am, numero, capacidad, descripcion, activo, habilitado)
VALUES (1, "690A", 50, "Ubicacion: Edificio nuevo", true, true);
INSERT INTO ambiente (id_tipo_am, numero, capacidad, descripcion, activo, habilitado)
VALUES (1, "690B", 50, "Ubicacion: Edificio nuevo", true, true);
INSERT INTO ambiente (id_tipo_am, numero, capacidad,  descripcion, activo, habilitado)
VALUES (1, "690C", 40, "Ubicacion: Edificio nuevo", true, true);
INSERT INTO ambiente (id_tipo_am, numero, capacidad,  descripcion, activo, habilitado)
VALUES (1, "690D", 40, "Ubicacion: Edificio nuevo", true, true);
INSERT INTO ambiente (id_tipo_am, numero, capacidad,  descripcion, activo, habilitado)
VALUES (1, "690E", 50, "Ubicacion: Edificio nuevo", true, true);
INSERT INTO ambiente (id_tipo_am, numero, capacidad,  descripcion, activo, habilitado)
VALUES (1, "690F", 60, "Ubicacion: Edificio nuevo", true, true);

INSERT INTO ambiente (id_tipo_am, numero, capacidad,  descripcion, activo, habilitado)
VALUES (1, "691A", 50, "Ubicacion: Edificio nuevo", true, true);
INSERT INTO ambiente (id_tipo_am, numero, capacidad,  descripcion, activo, habilitado)
VALUES (1, "691B", 50, "Ubicacion: Edificio nuevo", true, true);
INSERT INTO ambiente (id_tipo_am, numero, capacidad,  descripcion, activo, habilitado)
VALUES (1, "691C", 40, "Ubicacion: Edificio nuevo", true, true);
INSERT INTO ambiente (id_tipo_am, numero, capacidad,  descripcion, activo, habilitado)
VALUES (1, "691D", 40, "Ubicacion: Edificio nuevo", true, true);
INSERT INTO ambiente (id_tipo_am, numero, capacidad,  descripcion, activo, habilitado)
VALUES (1, "691E", 50, "Ubicacion: Edificio nuevo",true, true);
INSERT INTO ambiente (id_tipo_am, numero, capacidad,  descripcion, activo, habilitado)
VALUES (1, "691F", 60, "Ubicacion: Edificio nuevo", true, true);

insert into periodo(hora_ini, hora_fin) values ('06:45:00', '07:30:00');
insert into periodo(hora_ini, hora_fin) values ('07:30:00', '08:15:00');
insert into periodo(hora_ini, hora_fin) values ('08:15:00', '09:00:00');
insert into periodo(hora_ini, hora_fin) values ('09:00:00', '09:45:00');
insert into periodo(hora_ini, hora_fin) values ('09:45:00', '10:30:00');
insert into periodo(hora_ini, hora_fin) values ('10:30:00', '11:15:00');
insert into periodo(hora_ini, hora_fin) values ('11:15:00', '12:00:00');
insert into periodo(hora_ini, hora_fin) values ('12:00:00', '12:45:00');
insert into periodo(hora_ini, hora_fin) values ('12:45:00', '13:30:00');
insert into periodo(hora_ini, hora_fin) values ('13:30:00', '14:15:00');
insert into periodo(hora_ini, hora_fin) values ('14:15:00', '15:00:00');
insert into periodo(hora_ini, hora_fin) values ('15:00:00', '15:45:00');
insert into periodo(hora_ini, hora_fin) values ('15:45:00', '16:30:00');
insert into periodo(hora_ini, hora_fin) values ('16:30:00', '17:15:00');
insert into periodo(hora_ini, hora_fin) values ('17:15:00', '18:00:00');
insert into periodo(hora_ini, hora_fin) values ('18:00:00', '18:45:00');
insert into periodo(hora_ini, hora_fin) values ('18:45:00', '19:30:00');
insert into periodo(hora_ini, hora_fin) values ('19:30:00', '20:15:00');
insert into periodo(hora_ini, hora_fin) values ('20:15:00', '21:00:00');
insert into periodo(hora_ini, hora_fin) values ('21:00:00', '21:45:00');


insert into facilidad(nombre_faci) values ('Televisor');
insert into facilidad(nombre_faci) values ('Data');

insert into usuario(nombre_usu, usuario, contrasena, admi) values ('Giovani Brun', 'Denisxd', '123', true);
insert into usuario(nombre_usu, usuario, contrasena, admi) values ('Jorge Salazar', 'Jorgitoxd', '456', false);
insert into usuario(nombre_usu, usuario, contrasena, admi) values ('Luz Flores', 'Luzxd', '789', false);

insert into tiene_facilidad(id_ambiente, id_facilidad) values (1, 2);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (2, 2);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (3, 2);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (4, 2);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (5, 2);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (6, 2);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (7, 2);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (8, 2);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (9, 2);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (10, 2);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (11, 2);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (12, 2);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (4, 1);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (7, 1);
insert into tiene_facilidad(id_ambiente, id_facilidad) values (10, 1);

insert into reserva(id_usuario, id_ambiente, id_periodo, fecha, estado) values ('2', '10', '8', '2023-10-25', 'Pendiente');
insert into reserva(id_usuario, id_ambiente, id_periodo, fecha, estado) values ('2', '6', '12', '2023-10-26', 'Pendiente');
insert into reserva(id_usuario, id_ambiente, id_periodo, fecha, estado) values ('2', '4', '10', '2023-10-27', 'Pendiente');
insert into reserva(id_usuario, id_ambiente, id_periodo, fecha, estado) values ('2', '9', '3', '2023-10-28', 'Pendiente');
insert into reserva(id_usuario, id_ambiente, id_periodo, fecha, estado) values ('2', '11', '9', '2023-10-28', 'Pendiente');
insert into reserva(id_usuario, id_ambiente, id_periodo, fecha, estado) values ('3', '2', '5', '2023-10-29', 'Pendiente');
insert into reserva(id_usuario, id_ambiente, id_periodo, fecha, estado) values ('3', '5', '6', '2023-10-30', 'Pendiente');
insert into reserva(id_usuario, id_ambiente, id_periodo, fecha, estado) values ('3', '7', '15', '2023-10-31', 'Pendiente');
insert into reserva(id_usuario, id_ambiente, id_periodo, fecha, estado) values ('3', '10', '8', '2023-10-31', 'Pendiente');
insert into reserva(id_usuario, id_ambiente, id_periodo, fecha, estado) values ('3', '3', '7', '2023-11-01', 'Pendiente');



DELIMITER //

CREATE PROCEDURE crearAmbiente(
  IN p_id_tipo_am INT,
  IN p_numero CHAR(4),
  IN p_capacidad INT,
  IN p_descripcion VARCHAR(40)
)
BEGIN
  DECLARE v_id_ambiente INT;

  -- Insertar un nuevo registro en la tabla ambiente
  INSERT INTO ambiente (id_tipo_am, numero, capacidad, descripcion, activo, habilitado)
  VALUES (p_id_tipo_am, p_numero, p_capacidad, p_descripcion, TRUE, TRUE);

  -- Obtener el ID del nuevo ambiente insertado
  SELECT LAST_INSERT_ID() INTO v_id_ambiente;

  -- Devolver el ID del nuevo ambiente
  SELECT v_id_ambiente;
END //

DELIMITER ;


DELIMITER //

CREATE PROCEDURE agregarFacilidad(
  IN p_id_ambiente INT,
  IN p_id_facilidad INT
)
BEGIN
  -- Insertar un nuevo registro en la tabla tiene_facilidad
  INSERT INTO tiene_facilidad (id_ambiente, id_facilidad)
  VALUES (p_id_ambiente, p_id_facilidad);
END