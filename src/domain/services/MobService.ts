import {MobRepositoryPort} from "../../application/ports/outbound/MobRepositoryPort";
import {MobServicePort} from "../../application/ports/inbound/MobServicePort";
import {Mob} from "../models/Mob";

export class MobService implements MobServicePort {
    constructor(private readonly repo: MobRepositoryPort) {}

    getAllMobs(): Promise<Mob[]>{
        return this.repo.getAllMobs();
    }

    getMobById(id: number): Promise<Mob | null>{
        if(id === undefined) {
            throw new Error("A mob's id must be provided");
        }
        return this.repo.getMobById(id);
    }

    insertMob(mob: Omit<Mob, 'id'>):  Promise<Mob | null>{
        if(mob.name === undefined || mob.pv === undefined || mob.atk === undefined || mob.drops === undefined) {
            throw new Error("A mob (name, pv, atk and drops) must be provided");
        }
        return this.repo.insertMob(mob);
    }

    deleteMob(id: number):  Promise<number | null> {
        if (id === undefined) {
            throw new Error("A mob's id must be provided");
        }
        return this.repo.deleteMob(id);
    }
}