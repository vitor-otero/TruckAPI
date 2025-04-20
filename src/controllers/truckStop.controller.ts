import { Request, Response } from 'express';
import { TruckStopService } from '../services/truckStop.service';
import { CreateTruckStopInput, SearchTruckStopsInput } from '../types/truckStop';

const truckStopService = new TruckStopService();

export class TruckStopController {
  async create(req: Request, res: Response) {
    try {
      const input: CreateTruckStopInput = req.body;
      const userId = (req as any).user.id;
      const truckStop = await truckStopService.createTruckStop(input, userId);
      res.status(201).json(truckStop);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async search(req: Request, res: Response) {
    try {
      const input: SearchTruckStopsInput = req.query as any;
      const stops = await truckStopService.searchTruckStops({
        ...input,
        latitude: Number(input.latitude),
        longitude: Number(input.longitude),
        radius: input.radius ? Number(input.radius) : undefined
      });
      res.status(200).json(stops);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const stop = await truckStopService.getTruckStop(Number(id));
      if (!stop) {
        return res.status(404).json({ error: 'Truck stop not found' });
      }
      res.status(200).json(stop);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const input: Partial<CreateTruckStopInput> = req.body;
      const stop = await truckStopService.updateTruckStop(Number(id), userId, input);
      res.status(200).json(stop);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      await truckStopService.deleteTruckStop(Number(id), userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
