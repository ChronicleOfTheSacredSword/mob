import {Mob} from "../models/Mob";
import {MobService} from "./MobService";
import {MobRepositoryPort} from "../../application/ports/outbound/MobRepositoryPort";

describe('MobService', () => {
    it('should get the correct mob by id', () => {
        // Arrange
        const mob: Mob = { id: 9999, name: "Test mob", pv: 200, atk: 50, drops: [0, 1] }
        const repoMock = {
            getAllMobs: jest.fn(),
            getMobById: jest.fn().mockReturnValue(mob),
            insertMob: jest.fn(),
            deleteMob: jest.fn()
        };
        const mobService = new MobService(repoMock);

        // Act
        const tree = mobService.getMobById(9999);

        // Assert
        expect(tree).toEqual(mob);
        expect(repoMock.getMobById).toHaveBeenCalled();
    });

    it('should insert a new mob', () => {
        // Arrange
        const newMob: Mob = { id: -1, name: "Test mob", pv: 200, atk: 50, drops: [0, 1] }

        const repoMock = {
            getAllMobs: jest.fn(),
            getMobById: jest.fn(),
            insertMob: jest.fn().mockReturnValue(newMob),
            deleteMob: jest.fn()
        };
        const mobService = new MobService(repoMock);

        // Act
        const mob= mobService.insertMob({ name: "Test mob", pv: 200, atk: 50, drops: [0, 1] });

        // Assert
        expect(mob).not.toBeNull();
        expect(mob).toHaveProperty('id');
        expect(repoMock.insertMob).toHaveBeenCalled();
    });

    it('should fail to insert a new tree because of the lack of data', () => {
        // Arrange
        const newMob: any ={ name: "Test mob", pv: 200, drops: [0, 1] }

        const repoMock = {
            getAllMobs: jest.fn(),
            getMobById: jest.fn(),
            insertMob: jest.fn().mockImplementation(() => {
                new Error("A mob (name, pv, atk and drops) must be provided");
            }),
            deleteMob: jest.fn()
        };
        const mobService = new MobService(repoMock);

        // Assert
        expect(() => mobService.insertMob(newMob)).toThrow(Error)
        expect(() => mobService.insertMob(newMob)).toThrow("A mob (name, pv, atk and drops) must be provided");
    });
});

