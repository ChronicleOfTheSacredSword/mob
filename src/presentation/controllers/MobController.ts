import {MobServicePort} from "../../application/ports/inbound/MobServicePort";
import {Express, Response, Request} from "express";
import {Mob} from "../../domain/models/Mob";

export class MobController {
  constructor(private mobService: MobServicePort) {}

  registerRoutes(app: Express) {
    app.get('/mob', this.getAllMobs.bind(this));
    app.get('/mob/:id', this.getMobById.bind(this));
    app.post('/mob', this.insertMob.bind(this));
    app.delete('/mob/:id', this.deleteMob.bind(this));
  }

  async getAllMobs(req: Request, res: Response) {
    const mobs: Mob[] | null = await this.mobService.getAllMobs();
    if (mobs) {
      res.status(200).send(mobs);
    } else {
      res.status(404).send({ message: `No mobs not found` });
    }
  }

  async getMobById(req: Request, res: Response) {
    const mob: Mob | null = await this.mobService.getMobById(Number.parseInt(req.params.id));
    if (mob) {
      res.status(200).send(mob);
    } else {
      res.status(404).send({ message: `Mob ${req.params.id} not found` });
    }
  }
  async insertMob(req: Request, res: Response) {
    const created: Mob | null = await this.mobService.insertMob(req.body);
    if (created === null) {
      res.status(404).send({ message: "Mob could not be inserted" });
    } else {
      res.status(201).send(created);
    }
  }

  async deleteMob(req: Request, res: Response) {
    const deleted: number | null = await this.mobService.deleteMob(Number.parseInt(req.params.id));
    if (deleted === null) {
      res.status(404).send({message: `Mob ${req.params.id} could not be deleted`});
    } else {
      res.status(200).send({message: `Mob ${deleted} deleted`});
    }
  }
}