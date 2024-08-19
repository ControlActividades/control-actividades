"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.responsablesControllers = void 0;
const database_1 = __importDefault(require("../database"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class ResponsablesControllers {
    index(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const responsables = yield database_1.default.query('SELECT * FROM responsable INNER JOIN rol ON rol.idRoles = responsable.idRoles');
            resp.json(responsables);
        });
    }
    getResponsable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idResp } = req.params;
            try {
                const result = yield database_1.default.query('SELECT * FROM responsable WHERE idResp = ?', [idResp]);
                if (result.length > 0) {
                    res.json(result[0]);
                }
                else {
                    res.status(404).json({ message: 'Responsable no encontrado' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener el responsable', error });
            }
        });
    }
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            try {
                yield database_1.default.query('INSERT INTO responsable SET ?', [req.body]);
                resp.json({ message: 'Responsable guardado' });
            }
            catch (error) { // Utiliza 'any' para manejar el error genérico
                if (error.code === 'ER_SIGNAL_EXCEPTION' && typeof error.sqlMessage === 'string') {
                    const messages = error.sqlMessage.split('. ');
                    resp.status(400).json({ message: messages.filter((msg) => msg !== '').join('. ') });
                }
                else {
                    resp.status(500).json({ message: 'Error al guardar el responsable', error });
                }
            }
        });
    }
    delete(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idResp } = req.params;
            yield database_1.default.query('DELETE FROM responsable WHERE idResp = ?', [idResp]);
            resp.json({ message: 'Responsable eliminado' });
        });
    }
    updateResponsable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idResp } = req.params;
            const updateData = req.body;
            try {
                const result = yield database_1.default.query('UPDATE responsable SET ? WHERE idResp = ?', [updateData, idResp]);
                if (result.affectedRows > 0) {
                    res.json({ message: 'Responsable actualizado' });
                }
                else {
                    res.status(404).json({ message: 'Responsable no encontrado para actualizar' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al actualizar el responsable', error });
            }
        });
    }
    // Método para obtener ID por nombre de usuario
    getIdByUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombUsuario } = req.params;
            try {
                const result = yield database_1.default.query('SELECT idResp FROM responsable WHERE nombUsuario = ?', [nombUsuario]);
                if (result.length > 0) {
                    res.json(result[0]);
                }
                else {
                    res.status(404).json({ message: 'Responsable no encontrado desde getId' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener el responsable', error });
            }
        });
    }
    // Método para validar usuario
    validateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nombUsuario, contrasenia } = req.body;
            try {
                const result = yield database_1.default.query('SELECT idResp, idRoles FROM responsable WHERE nombUsuario = ? AND contrasenia = ?', [nombUsuario, contrasenia]);
                if (Array.isArray(result) && result.length > 0) {
                    res.json(result[0]);
                }
                else {
                    res.status(404).send('Usuario o contraseña incorrectos');
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).send('Error en la consulta validateUser');
            }
        });
    }
    buscarResponsable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { correoElec, telefono } = req.body;
            try {
                const result = yield database_1.default.query('SELECT idResp FROM responsable WHERE correoElec = ? OR telefono = ?', [correoElec, telefono]);
                if (result.length > 0) {
                    res.json(result[0]);
                }
                else {
                    res.status(404).json({ message: 'Responsable no encontrado para actualizar ' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al buscar el responsable', error });
            }
        });
    }
    updateContrasenia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idResp } = req.params;
            const { contrasenia } = req.body;
            try {
                const result = yield database_1.default.query('UPDATE responsable SET contrasenia = ? WHERE idResp = ?', [contrasenia, idResp]);
                if (result.affectedRows > 0) {
                    res.json({ message: 'Contraseña actualizada' });
                }
                else {
                    res.status(404).json({ message: 'Responsable no encontrado para actualizar la contraseña' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al actualizar la contraseña', error });
            }
        });
    }
    // Método para obtener ID por nombre de usuario
    enviarCorreoAscenso(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { razon } = req.body;
            if (!razon) {
                res.status(400).json({ message: 'La razón del ascenso es requerida' });
                return;
            }
            try {
                const userId = req.body.userId; // Asegúrate de que el userId se envíe desde el frontend
                const responsable = yield database_1.default.query('SELECT nombres, appPaterno, appMaterno, correoElec, telefono, numControl FROM responsable WHERE idResp = ?', [userId]);
                if (responsable.length === 0) {
                    res.status(404).json({ message: 'Responsable no encontrado' });
                    return;
                }
                const { nombres, appPaterno, appMaterno, correoElec, telefono, numControl } = responsable[0];
                // Configurar el transporte de correo
                const transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'control.actividades.2024@gmail.com', // Tu correo electrónico
                        pass: 'tfvz ombm slyd myhx' // Usa la contraseña de aplicación generada
                    }
                });
                const mailOptions = {
                    from: 'control.actividades.2024@gmail.com',
                    to: 'rodriguez.mora.zahir.15@gmail.com',
                    subject: ' 🦅 Solicitud de Ascenso  🦅',
                    text: `
            Estimada Lic. Magda Mirthala Hernández González
            
            Por medio del presente, quisiera presentar una solicitud para ascenderme en la aplicación "Control de Actividades del Gimnasio Auditorio de la UTNG" con razón de:
            
            "${razon}"
            
            Anexo mis datos de identificación.
            
            -Nombre Completo: ${nombres} ${appPaterno} ${appMaterno}
            -Correo Electrónico: ${correoElec}
            -Teléfono: ${telefono}
            -Número de Control: ${numControl}
            
            Agradezco su atención y quedo a disposición para cualquier información adicional que se requiera.
            
            Atentamente,
            
            ${nombres} ${appPaterno} ${appMaterno}
            `
                };
                yield transporter.sendMail(mailOptions);
                res.status(200).json({ message: 'Correo enviado exitosamente' });
            }
            catch (error) {
                console.error('Error al enviar el correo:', error);
                res.status(500).json({ message: 'Error al enviar el correo', error });
            }
        });
    }
}
exports.responsablesControllers = new ResponsablesControllers();
