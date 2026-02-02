import {MobRepositoryPort} from "../../application/ports/outbound/MobRepositoryPort";
import {Mob} from "../../domain/models/Mob";
import redis from "../../../db";

class MobRepo implements MobRepositoryPort {
    async getAllMobs():  Promise<Mob[] | null>{
        const mobIds = await redis.get("mobs");
        let mobs: any = [];
        if(mobIds !== null){
            const parsedRes = await JSON.parse(mobIds);
            parsedRes.forEach((id: number) => {
                let newMob = this.getMobById(id)
                if(newMob !== null){
                    mobs.push(newMob);
                }
            });
            return mobs;
        }
        return null;
    }

    async getMobById(id: number):  Promise<Mob | null>{
        const res = await redis.get(`${id}`);
        if(res != null){
            const parsedRes = await JSON.parse(res);
            return {id: id, name: parsedRes.name, pv: parsedRes.pv, atk: parsedRes.atk, drops: parsedRes.drops};
        }
        return null;
    }

    async insertMob(mob: Mob):  Promise<Mob | null>{
        try{
            // Insert id to mobs key (test first)
            await redis.set(`${mob.id}`, JSON.stringify({name: mob.name, pv: mob.pv, atk: mob.atk, drops: mob.drops}));
            return mob;
        }catch (e){
            console.error(e);
            return null;
        }
    }

    async deleteMob(id: number): Promise<number | null>{
        try{
            await redis.del(`${id}`);
            return id;
        }catch (e){
            console.error(e);
            return null;
        }
    }
}export default MobRepo

