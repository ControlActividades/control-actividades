USE master;

DROP DATABASE IF EXISTS controlActividadesUtng;
CREATE DATABASE controlActividadesUtng;

USE controlActividadesUtng;

DROP TABLE IF EXISTS responsable;
CREATE TABLE responsable (
    idResp INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombUsuario VARCHAR(20) NOT NULL,
    contrasenia CHAR(10) NOT NULL,
    permiso VARCHAR(10) NOT NULL,
    nombres VARCHAR(10) NOT NULL,
    appPaterno VARCHAR(20) NOT NULL,
    appMaterno VARCHAR(20) NOT NULL,
    telefono VARCHAR(10),
    correoElec VARCHAR(20),
    numControl VARCHAR(12) NOT NULL,
    grupo VARCHAR(20) NOT NULL,
);
