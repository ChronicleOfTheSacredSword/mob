import {MobRepositoryPort} from "../../application/ports/outbound/MobRepositoryPort";
import {Mob} from "../../domain/models/Mob";
import redis from "../../../db";

class MobRepo implements MobRepositoryPort {
    async getMobIds(): Promise<number[]> {
        const mobIds = await redis.get("mobs");
        if(!mobIds)
            return [];
        return mobIds.split(";").filter((item)=>{return item!==''}).map((item)=>{return Number.parseInt(item);});
    }

    async getAllMobs():  Promise<Mob[]>{
        const mobIds:number[]  = await this.getMobIds();
        let mobs: any = [];
        for (const id of mobIds) {
            await this.getMobById(id).then((mob: any) => {
                mobs.push(mob);
            })
        }
        return mobs;
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
            let newId = mobIds.length > 0 ?(Math.max(...mobIds)+1): 0;
            mobIds.push(newId);
            await redis.set("mobs", mobIds.join(";"));
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
            const mobIds:number[] = await this.getMobIds()
            const index = mobIds.indexOf(id);
            if (index > -1) {
                mobIds.splice(index, 1);
            }
            await redis.set("mobs", mobIds.join(";"));
            await redis.del(`${id}`);
            return id;
        }catch (e){
            console.error(e);
            return null;
        }
    }
}export default MobRepo

