import {Mob} from "../../../domain/models/Mob";

export interface MobRepositoryPort {
    getAllMobs(): Promise<Mob[]>;
    getMobById(id: number): Promise<Mob | null>;
    insertMob(mob:  Omit<Mob, 'id'>):  Promise<Mob | null>;
    deleteMob(id: number):  Promise<number | null>;
}