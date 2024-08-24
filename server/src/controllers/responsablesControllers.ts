import { Request, Response } from 'express';
import pool from '../database';
import nodemailer from 'nodemailer';
import crypto from 'crypto';  // Para generar un token único
class ResponsablesControllers {
    public async index(req: Request, resp: Response) {

        const responsables = await pool.query('SELECT * FROM responsable INNER JOIN rol ON rol.idRoles = responsable.idRoles');
        resp.json(responsables);
    }

    public async getResponsable(req: Request, res: Response): Promise<void> {
        const { idResp } = req.params;
        try {
            const result = await pool.query('SELECT * FROM responsable WHERE idResp = ?', [idResp]);
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: 'Responsable no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el responsable', error });
        }
    }

    public async create(req: Request, resp: Response): Promise<void> {
        console.log(req.body);
        try {
            await pool.query('INSERT INTO responsable SET ?', [req.body]);
            resp.json({ message: 'Responsable guardado' });
        } catch (error: any) { // Utiliza 'any' para manejar el error genérico
            if (error.code === 'ER_SIGNAL_EXCEPTION' && typeof error.sqlMessage === 'string') {
                const messages = error.sqlMessage.split('. ');
                resp.status(400).json({ message: messages.filter((msg: string) => msg !== '').join('. ') });
            } else {
                resp.status(500).json({ message: 'Error al guardar el responsable', error });
            }
        }
    }


    public async delete(req: Request, resp: Response) {
        const { idResp } = req.params;
        await pool.query('DELETE FROM responsable WHERE idResp = ?', [idResp]);
        resp.json({ message: 'Responsable eliminado' });
    }

    public async updateResponsable(req: Request, res: Response): Promise<void> {
        const { idResp } = req.params;
        const updateData = req.body;
        try {
            const result = await pool.query('UPDATE responsable SET ? WHERE idResp = ?', [updateData, idResp]);
            if (result.affectedRows > 0) {
                res.json({ message: 'Responsable actualizado' });
            } else {
                res.status(404).json({ message: 'Responsable no encontrado para actualizar' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el responsable', error });
        }
    }
    // Método para obtener ID por nombre de usuario

    public async getIdByUsername(req: Request, res: Response): Promise<void> {
        const { nombUsuario } = req.params;
        try {
            const result = await pool.query('SELECT idResp FROM responsable WHERE nombUsuario = ?', [nombUsuario]);
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: 'Responsable no encontrado desde getId' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el responsable', error });
        }
    }


    // Método para validar usuario
    public async validateUser(req: Request, res: Response): Promise<void> {
        const { nombUsuario, contrasenia } = req.body;
        try {
            const result = await pool.query('SELECT idResp, idRoles FROM responsable WHERE nombUsuario = ? AND contrasenia = ?', [nombUsuario, contrasenia]);
            if (Array.isArray(result) && result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).send('Usuario o contraseña incorrectos');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Error en la consulta validateUser');
        }
    }

    public async buscarResponsable(req: Request, res: Response): Promise<void> {
        const { correoElec, telefono } = req.body;
        try {
            const result = await pool.query('SELECT idResp FROM responsable WHERE correoElec = ? OR telefono = ?', [correoElec, telefono]);
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: 'Responsable no encontrado para actualizar ' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al buscar el responsable', error });
        }
    }

    public async updateContrasenia(req: Request, res: Response): Promise<void> {
        const { idResp } = req.params;
        const { contrasenia } = req.body;
        try {
            const result = await pool.query('UPDATE responsable SET contrasenia = ? WHERE idResp = ?', [contrasenia, idResp]);
            if (result.affectedRows > 0) {
                res.json({ message: 'Contraseña actualizada' });
            } else {
                res.status(404).json({ message: 'Responsable no encontrado para actualizar la contraseña' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la contraseña', error });
        }
    }


    // Método para obtener ID por nombre de usuario
    public async enviarCorreoAscenso(req: Request, res: Response): Promise<void> {
        const { razon } = req.body;
    
        if (!razon) {
            res.status(400).json({ message: 'La razón del ascenso es requerida' });
            return;
        }
    
        try {
            const userId = req.body.userId; // Asegúrate de que el userId se envíe desde el frontend
            const responsable = await pool.query('SELECT nombres, appPaterno, appMaterno, correoElec, telefono, numControl FROM responsable WHERE idResp = ?', [userId]);
    
            if (responsable.length === 0) {
                res.status(404).json({ message: 'Responsable no encontrado' });
                return;
            }
    
            const { nombres, appPaterno, appMaterno, correoElec, telefono, numControl } = responsable[0];
    
            // Configurar el transporte de correo
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'control.actividades.2024@gmail.com', 
                    pass: 'nxzw oini eywx rbum'
                },
                tls: {
                    rejectUnauthorized: false
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
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Correo enviado exitosamente' });
    
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ message: 'Error al enviar el correo', error });
        }
    }
    

//verificar correos

public async enviarCorreoVerificacion(req: Request, res: Response): Promise<void> {
    const { correoElec } = req.body;

    if (!correoElec) {
        res.status(400).json({ message: 'Correo electrónico es requerido' });
        return;
    }

    try {
        const result = await pool.query('SELECT idResp, nombres FROM responsable WHERE correoElec = ?', [correoElec]);

        if (result.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }

        const { idResp, nombres } = result[0];
        const token = crypto.randomBytes(20).toString('hex');

        // Guardar el token en la base de datos con una expiración (opcional)
        await pool.query('UPDATE responsable SET tokenVerificacion = ?, tokenExpiracion = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE idResp = ?', [token, idResp]);

        // Configurar el transporte de correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'control.actividades.2024@gmail.com',
                pass: 'nxzw oini eywx rbum'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: 'control.actividades.2024@gmail.com',
            to: correoElec,
            subject: 'Verificación de Correo Electrónico',
            text: `
            Hola ${nombres},

            Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico:

            http://localhost:4200/verificar-correo/${token} 

            Si no solicitaste esta verificación, por favor ignora este correo.

            Atentamente,
            Control de Actividades
            `
        };//cambiar url en producción

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo de verificación enviado exitosamente' });

    } catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
        res.status(500).json({ message: 'Error al enviar el correo de verificación', error });
    }
}

public async verificarToken(req: Request, res: Response): Promise<void> {
    const { token } = req.params;

    try {
        const result = await pool.query('SELECT idResp FROM responsable WHERE tokenVerificacion = ? AND tokenExpiracion > NOW()', [token]);
        if (result.length === 0) {
            res.status(400).json({ message: 'Token inválido o expirado' });
            return;
        }

        const { idResp } = result[0];
        res.status(200).json({ message: 'Token verificado, puedes proceder con la recuperación de contraseña', idResp });
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(500).json({ message: 'Error al verificar el token', error });
    }
}


}


export const responsablesControllers = new ResponsablesControllers();
