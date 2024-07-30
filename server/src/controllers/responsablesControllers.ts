import { Request, Response } from 'express';
import pool from '../database';


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
        await pool.query('INSERT INTO responsable set ?', [req.body]);
        resp.json({ message: 'Responsable guardado' })
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
                res.status(404).json({ message: 'Responsable no encontrado' });
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
    
    
}
export const responsablesControllers = new ResponsablesControllers();
