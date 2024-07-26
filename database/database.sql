USE master;

DROP DATABASE IF EXISTS controlActividadesUtng;
CREATE DATABASE controlActividadesUtng;

USE controlActividadesUtng;

DROP TABLE IF EXISTS responsable;
CREATE TABLE responsable (
    idResp INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombUsuario VARCHAR(50) NOT NULL UNIQUE,
    contrasenia VARBINARY(32) NOT NULL,  -- For SHA2_256 hashed passwords
    nombres VARCHAR(50) NOT NULL,
    appPaterno VARCHAR(20) NOT NULL,
    appMaterno VARCHAR(20) NULL,
    telefono VARCHAR(10) NULL,
    correoElec VARCHAR(320) NULL,
    numControl VARCHAR(20) NOT NULL,
    grupo VARCHAR(20) NOT NULL,
    idRoles INT NULL,
    FOREIGN KEY (idRoles) REFERENCES rol(idRoles)
);


DROP TABLE IF EXISTS reservas;
CREATE TABLE reservas (
    idReserva INT PRIMARY KEY,
    horaInicio TIME,
    horaFin TIME,
    dia DATE,
    mes DATE,
    anio DATE,
    idResp INT,
    FOREIGN KEY (idResp) REFERENCES otra_tabla(idResp) 
);

DROP TABLE IF EXISTS rol;
CREATE TABLE rol (
    idRoles INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    rol VARCHAR(10) NOT NULL UNIQUE
);


DROP TABLE IF EXISTS edificio;
CREATE TABLE edificio (
    idEdificio INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
    nombEdificio VARCHAR(50) NOT NULL UNIQUE
);
