import MobRepositoryAdapter from "../../../infrastructure/adapters/MobRepositoryAdapter";
import {MobService} from "../../../domain/services/MobService";
import {Mob} from "../../../domain/models/Mob";

describe('Mob Integration Test', () => {
    let repo: MobRepositoryAdapter = new MobRepositoryAdapter();
    let service: MobService = new MobService(repo);

    it('Test Mob lifecycle', async () => {
        let mob: Mob = { id: -1, name: "Test mob", pv: 200, atk: 50, drops: [0, 1] }

        let created = await service.insertMob(mob);
        expect(created).not.toBeNull();
        if(created !== null)
            mob.id = created.id;

        expect(created).toEqual(mob);
        let result1:any = await service.getAllMobs()

        expect(result1).not.toBeNull();
        expect(result1.some(item => item.id === mob.id)).toBe(true);
        let result2 = await service.getMobById(mob.id)
        expect(result2).not.toBeNull();
        expect(result2).toEqual(mob);

        let result3 = await service.getMobById(-1)
        expect(result3).toBeNull();

        expect(await service.deleteMob(mob.id)).toEqual(mob.id);
        expect((await service.getAllMobs()).some(item => item.id === mob.id)).toBe(false);
    });
});
