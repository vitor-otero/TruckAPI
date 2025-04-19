import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserInput, LoginInput } from '../types/user';

const userService = new UserService();

export class UserController {
  async register(req: Request<{}, {}, CreateUserInput>, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request<{}, {}, LoginInput>, res: Response) {
    try {
      const result = await userService.login(req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: 'No token provided' });
        return;
      }

      const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
      const user = await userService.validateToken(token);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}
