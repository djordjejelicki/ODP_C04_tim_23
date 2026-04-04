import express from 'express';
import cors from 'cors';
import { IAuthService } from './Domain/services/auth/IAuthService';
import { AuthService } from './Services/auth/AuthService';
import { IUserRepository } from './Domain/repositories/users/IUserRepository';
import { UserRepository } from './Database/repositories/users/UserRepository';
import { AuthController } from './WebAPI/controllers/AuthController';
import { IUserService } from './Domain/services/users/IUserService';
import { UserService } from './Services/users/UserService';
import { UserController } from './WebAPI/controllers/UserController';

import { IMountainRepository } from './Domain/repositories/mountains/IMountainRepository';
import { MountainRepository } from './Database/repositories/mountains/MountainRepository';
import { IMountainService } from './Domain/services/mountains/IMountainService';
import { MountainService } from './Services/mountains/MountainService';
import { MountainController } from './WebAPI/controllers/MountainController';

import { ITrailRepository } from './Domain/repositories/trails/ITrailRepository';
import { TrailRepository } from './Database/repositories/trails/TrailRepository';
import { ITrailService } from './Domain/services/trails/ITrailService';
import { TrailService } from './Services/trails/TrailService';
import { TrailController } from './WebAPI/controllers/TrailController';

import { ITerrainTagRepository } from './Domain/repositories/terrainTags/ITerrainTagRepository';
import { TerrainTagRepository } from './Database/repositories/terrainTags/TerrainTagRepository';
import { ITerrrainTagService } from './Domain/services/terrainTags/ITerrainTagService';
import { TerrainTagService } from './Services/terrainTags/TerrainTagService';
import { TerrainTagController } from './WebAPI/controllers/TerrainTagController';

import { ITrailTagRepository } from './Domain/repositories/trailTags/ITrailTagRepository';
import { TrailTagRepository } from './Database/repositories/trailTags/TrailTagRepository';

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Repositories
const userRepository: IUserRepository = new UserRepository();
const mountainRepository : IMountainRepository = new MountainRepository();
const trailRepository : ITrailRepository = new TrailRepository();
const terrainTagRepository : ITerrainTagRepository = new TerrainTagRepository();
const trailTagRepository: ITrailTagRepository = new TrailTagRepository();

// Services
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const mountainService: IMountainService = new MountainService(mountainRepository);
const trailService: ITrailService = new TrailService(trailRepository, trailTagRepository);
const terrainTagService: ITerrrainTagService = new TerrainTagService(terrainTagRepository);

// WebAPI routes
const authController = new AuthController(authService);
const userController = new UserController(userService);
const mountainController = new MountainController(mountainService);
const trailController = new TrailController(trailService);
const terrainTagController = new TerrainTagController(terrainTagService);

// Registering routes
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', mountainController.getRouter());
app.use('/api/v1', trailController.getRouter());
app.use('/api/v1', terrainTagController.getRouter());

export default app;