import {MobRepositoryPort} from "../../application/ports/outbound/MobRepositoryPort";
import {Mob} from "../../domain/models/Mob";
import redis from "../../../db";

class MobRepo implements MobRepositoryPort {
    async getMobIds(): Promise<number[]> {
        const mobIds = await redis.smembers("mobs");
        return mobIds.map(id => parseInt(id, 10));
    }

    async getAllMobs():  Promise<Mob[]>{
        const mobIds:number[]  = await this.getMobIds();
        if (mobIds.length === 0) return [];
        const mobPromises = mobIds.map(id => this.getMobById(id));
        const mobs = await Promise.all(mobPromises);
        return mobs.filter((mob): mob is Mob => mob !== null);
    }

    async getMobById(id: number):  Promise<Mob | null>{
        const res = await redis.get(`${id}`);
        if(res != null){
            const parsedRes = await JSON.parse(res);
            return {id: id, name: parsedRes.name, pv: parsedRes.pv, atk: parsedRes.atk, drops: parsedRes.drops};
        }
        return null;
    }

    async insertMob(mob: Omit<Mob, 'id'>):  Promise<Mob | null>{
        try{
            const mobIds:number[] = await this.getMobIds()
            let newId = mobIds.length > 0 ?(Math.max(...mobIds)+1): 1;
            await redis.sadd("mobs", newId.toString());

            let newMob = {id: newId, name: mob.name, pv: mob.pv, atk: mob.atk, drops: mob.drops}
            await redis.set(`${newMob.id}`, JSON.stringify(mob));
            return newMob;
        }catch (e){
            console.error(e);
            return null;
        }
    }

    async deleteMob(id: number): Promise<number | null>{
        try{
            await redis.srem("mobs", id.toString());
            await redis.del(`${id}`);
            return id;
        }catch (e){
            console.error(e);
            return null;
        }
    }
}export default MobRepo

