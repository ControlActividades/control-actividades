import { Request, Response } from 'express';
import pool from '../database';

class ReservasControllers {
    public async index(req: Request, resp: Response) {

        const reservas = await pool.query('SELECT * FROM reservas');
        resp.json(reservas);
    }

    public async getReserva(req: Request, res: Response): Promise<void> {
        const { idReserva } = req.params;
        try {
            const result = await pool.query('SELECT * FROM reservas WHERE idReserva = ?', [idReserva]);
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: 'Reserva no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la reserva', error });
        }
    }

    public async create(req: Request, resp: Response): Promise<void> {
        console.log(req.body);
        await pool.query('INSERT INTO reservas set ?', [req.body]);
        resp.json({ message: 'Reserva guardada' })
    }

    public async delete(req: Request, resp: Response) {
        const { idReserva } = req.params;
        await pool.query('DELETE FROM reservas WHERE idReserva = ?', [idReserva]);
        resp.json({ message: 'Reserva eliminada' });
    }

    public async updateReserva(req: Request, res: Response): Promise<void> {
        const { idReserva } = req.params;
        const updateData = req.body;
        try {
            const result = await pool.query('UPDATE reservas SET ? WHERE idReserva = ?', [updateData, idReserva]);
            if (result.affectedRows > 0) {
                res.json({ message: 'Reserva actualizada' });
            } else {
                res.status(404).json({ message: 'Reserva no encontrada para actualizar' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar la reserva', error });
        }
    }



    //oficios de reservas

    public async getReservaImprimir(req: Request, res: Response): Promise<void> {
        const { idReserva } = req.params;
        try {
            const result = await pool.query(`SELECT res.horaInicio, res.horaFin, res.areaUsar, res.fecha, res.razon, resp.idResp,CONCAT(resp.appPaterno, ' ', resp.appMaterno,' ',resp.nombres) AS nombCompleto, resp.telefono, resp.correoElec, resp.numControl, resp.grupo FROM reservas AS res INNER JOIN responsable AS resp ON res.idResp = resp.idResp WHERE idReserva = ?`, [idReserva]);
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: 'Reserva a imprimir no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la reserva para imprimir', error });
        }
    }

    //reserva disponible
    public async checkReserva(req: Request, res: Response): Promise<void> {
        const { horaInicio, horaFin, fecha } = req.body;
        try {
            const result = await pool.query(
                `SELECT * FROM reservas WHERE fecha = ? 
            AND ((horaInicio < ? AND horaFin > ?) 
            OR (horaInicio < ? AND horaFin > ?)
            OR (horaInicio >= ? AND horaFin <= ?))`,
                [fecha, horaFin, horaInicio, horaInicio, horaFin, horaInicio, horaFin]
            );

            let hasAcceptedReserva = false;
            let hasNonAcceptedReserva = false;

            for (const reserva of result) {
                if (reserva.estado === 'Aceptado') {
                    hasAcceptedReserva = true;
                    break;
                } else if (reserva.estado !== 'Aceptado') {
                    hasNonAcceptedReserva = true;
                }
            }

            res.status(hasAcceptedReserva ? 409 : 200).json({
                hasAcceptedReserva,
                hasNonAcceptedReserva
            });
        } catch (error) {
            res.status(500).json({ message: 'Error al verificar la reserva', error });
        }
    }




}
export const reservasControllers = new ReservasControllers();
