import {MobRepositoryPort} from "../../application/ports/outbound/MobRepositoryPort";
import {MobServicePort} from "../../application/ports/inbound/MobServicePort";
import {Mob} from "../models/Mob";

export class MobService implements MobServicePort {
    constructor(private readonly repo: MobRepositoryPort) {}

    getAllMobs(): Promise<Mob[] | null>{
        return this.repo.getAllMobs();
    }

    getMobById(id: number): Promise<Mob | null>{
        if(id === undefined) {
            throw new Error("A mob's id must be provided");
        }
        return this.repo.getMobById(id);
    }

    insertMob(mob: Mob):  Promise<Mob | null>{
        if(mob === undefined) {
            throw new Error("A mob must be provided");
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