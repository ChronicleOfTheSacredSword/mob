import {Mob} from "../../../domain/models/Mob";

export interface MobRepositoryPort {
    getAllMobs(): Promise<Mob[] | null>;
    getMobById(id: number): Promise<Mob | null>;
    insertMob(mob: Mob):  Promise<Mob | null>;
    deleteMob(id: number):  Promise<number | null>;
}