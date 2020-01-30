import express, { Request, Response } from 'express';
import path from 'path';

const router = express.Router();

/* GET home page. */
router.get('/ping', (req: Request, res: Response) => {
  res.status(200).send('pong');
});

export default router;
