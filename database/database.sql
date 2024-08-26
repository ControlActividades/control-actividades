-- Elimina la base de datos si ya existe y créala de nuevo
DROP DATABASE IF EXISTS controlActividadesUtng;
CREATE DATABASE controlActividadesUtng;

-- Selecciona la base de datos que se va a usar
USE controlActividadesUtng;

-- Elimina las tablas si ya existen para evitar errores
DROP TABLE IF EXISTS reserva;
DROP TABLE IF EXISTS responsable;
DROP TABLE IF EXISTS rol;
DROP TABLE IF EXISTS edificio;

-- Crea la tabla 'rol' primero ya que es referenciada por otras tablas
CREATE TABLE rol (
    idRoles INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    rol VARCHAR(20) NOT NULL UNIQUE
);

-- Crea la tabla 'edificio' que no tiene dependencias
CREATE TABLE edificio (
    idEdificio INT NOT NULL AUTO_INCREMENT PRIMARY KEY UNIQUE,
    nombEdificio VARCHAR(50) NOT NULL UNIQUE
);

-- Crea la tabla 'responsable', la cual hace referencia a la tabla 'rol'
CREATE TABLE responsable (
    idResp INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombUsuario VARCHAR(50) NOT NULL UNIQUE,
    contrasenia VARBINARY(32) NOT NULL,
    nombres VARCHAR(50) NOT NULL,
    appPaterno VARCHAR(50) NOT NULL,
    appMaterno VARCHAR(50) NULL,
    telefono VARCHAR(10) NULL UNIQUE,
    correoElec VARCHAR(260) NULL UNIQUE,
    numControl VARCHAR(20)  NULL,
    grupo VARCHAR(20) NULL,
    idRoles INT NULL,
    -- Nuevos campos para la verificación de correo
    correoVerificado BOOLEAN DEFAULT FALSE, -- Indica si el correo ha sido verificado
    tokenVerificacion VARCHAR(255) NULL, -- Almacena el token de verificación de correo
    tokenExpiracion DATETIME NULL, -- Almacena la fecha de expiración del token
    FOREIGN KEY (idRoles) REFERENCES rol(idRoles)
);

-- Crea la tabla 'reservas', que hace referencia a la tabla 'responsable'
CREATE TABLE reservas (
    idReserva INT AUTO_INCREMENT PRIMARY KEY,
    horaInicio TIME NOT NULL,
    horaFin TIME NOT NULL,
    estado VARCHAR(20) NULL,
    areaUsar VARCHAR(20) NOT NULL,
    fecha DATE NOT NULL,
    razon VARCHAR(5000) NOT NULL,
    idResp INT NULL,
    FOREIGN KEY (idResp) REFERENCES responsable(idResp) ON DELETE CASCADE
);

DELIMITER //

CREATE TRIGGER before_insert_in_rol
BEFORE INSERT ON rol
FOR EACH ROW
BEGIN
    -- Verifica si el nombre del rol ya existe
    IF EXISTS (SELECT 1 FROM rol WHERE rol = NEW.rol) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El nombre del rol ya existe.';
    END IF;

END//

DELIMITER //

CREATE TRIGGER before_insert_in_build
BEFORE INSERT ON edificio
FOR EACH ROW
BEGIN
    -- Verifica si el nombre del edificio ya existe
    IF EXISTS (SELECT 1 FROM edificio WHERE nombEdificio = NEW.nombEdificio) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El nombre del edificio ya existe.';
    END IF;

END//

DELIMITER ;


DELIMITER //

CREATE TRIGGER before_insert_update_responsable
BEFORE INSERT ON responsable
FOR EACH ROW
BEGIN
    -- Verifica si el nombre de usuario ya existe
    IF EXISTS (SELECT 1 FROM responsable WHERE nombUsuario = NEW.nombUsuario) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El nombre de usuario ya existe.';
    END IF;

    -- Verifica si el teléfono ya existe
    IF EXISTS (SELECT 1 FROM responsable WHERE telefono = NEW.telefono) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El teléfono ya existe.';
    END IF;

    -- Verifica si el correo electrónico ya existe
    IF EXISTS (SELECT 1 FROM responsable WHERE correoElec = NEW.correoElec) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El correo electrónico ya existe.';
    END IF;

    -- Verifica si el número de control ya existe
    IF EXISTS (SELECT 1 FROM responsable WHERE numControl = NEW.numControl) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El número de control ya existe.';
    END IF;
END//

DELIMITER ;


