import express from 'express';
import * as fs from "node:fs";
import * as YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from "./errorHandling";

import MobRepo from "../infrastructure/adapters/MobRepositoryAdapter";
import {MobService} from "../domain/services/MobService";
import {MobController} from "../presentation/controllers/MobController";


const app = express();
app.use(express.json());


const file  = fs.readFileSync(require.resolve('../api/Mob.yml'), 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const mobRepo = new MobRepo();
const mobService = new MobService(mobRepo);
const mobController = new MobController(mobService);
mobController.registerRoutes(app);

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
});
