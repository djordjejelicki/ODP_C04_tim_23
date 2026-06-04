import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from "fs";

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

import { IUserTrailRepository } from './Domain/repositories/userTrails/IUserTrailRepository';
import { UserTrailRepository } from './Database/repositories/userTrails/UserTrailRepository';
import { IUserTrailService } from './Domain/services/userTrails/IUserTrailService';
import { UserTrailService } from './Services/userTrails/UserTrailService';
import { UserTrailController } from './WebAPI/controllers/UserTrailController';

import { IAscentRepository } from './Domain/repositories/ascents/IAscentRepository';
import { AscentRepository } from './Database/repositories/ascents/AscentRepository';
import { IAscentService } from './Domain/services/acents/IAscentService';
import { AscentService } from './Services/ascents/AscentService';
import { AscentController } from './WebAPI/controllers/AscentController';

import { IHikeRepository } from './Domain/repositories/hikes/IHikeRepository';
import { HikeRepository } from './Database/repositories/hikes/HikeRepository';
import { IHikeParticipantRepository } from './Domain/repositories/hikes/IHikeParticipantRepository';
import { HikeParticipantRepository } from './Database/repositories/hikes/HikeParticipantRepository';
import { IHikeService } from './Domain/services/hikes/IHikeService';
import { HikeService } from './Services/hikes/HikeService';
import { HikeController } from './WebAPI/controllers/HikeController';

import { IAuditLogRepository } from './Domain/repositories/auditLogs/IAuditLogRepository';
import { AuditLogRepository } from './Database/repositories/auditLogs/AuditLogRepository';
import { IAuditLogService } from './Domain/services/auditLogs/IAuditLogService';
import { AuditLogService } from './Services/auditLogs/AuditLogService';
import { AuditLogController } from './WebAPI/controllers/AuditLogController';

import { IDashboardService } from './Domain/services/dashboard/IDashboardService';
import { DashboardService } from './Services/dashboard/DashboardService';
import { DashboardController } from './WebAPI/controllers/DashboardController';

require('dotenv').config();

const app = express();

const uploadsPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsPath)){
    fs.mkdirSync(uploadsPath, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsPath));

// Repositories
const userRepository: IUserRepository = new UserRepository();
const mountainRepository : IMountainRepository = new MountainRepository();
const trailRepository : ITrailRepository = new TrailRepository();
const terrainTagRepository : ITerrainTagRepository = new TerrainTagRepository();
const trailTagRepository: ITrailTagRepository = new TrailTagRepository();
const userTrailRepository: IUserTrailRepository = new UserTrailRepository();
const ascentRepository: IAscentRepository = new AscentRepository();
const hikeRepository: IHikeRepository = new HikeRepository();
const hikeParticipantRepository: IHikeParticipantRepository = new HikeParticipantRepository();
const auditLogRepository: IAuditLogRepository = new AuditLogRepository();

// Services
const auditLogService: IAuditLogService = new AuditLogService(auditLogRepository);
const authService: IAuthService = new AuthService(userRepository, auditLogService);
const userService: IUserService = new UserService(userRepository);
const mountainService: IMountainService = new MountainService(mountainRepository);
const trailService: ITrailService = new TrailService(trailRepository, trailTagRepository, ascentRepository, terrainTagRepository, mountainRepository);
const terrainTagService: ITerrrainTagService = new TerrainTagService(terrainTagRepository, trailTagRepository);
const userTrailService: IUserTrailService = new UserTrailService(userTrailRepository, ascentRepository, hikeRepository, trailRepository, hikeParticipantRepository, mountainRepository);
const ascentService: IAscentService = new AscentService(ascentRepository, userTrailRepository, trailRepository);
const hikeService: IHikeService = new HikeService(hikeRepository, hikeParticipantRepository, userRepository, userTrailRepository, trailRepository);
const dashboardService: IDashboardService = new DashboardService(userTrailRepository, trailRepository, mountainRepository);

// WebAPI routes
const authController = new AuthController(authService);
const userController = new UserController(userService);
const mountainController = new MountainController(mountainService);
const trailController = new TrailController(trailService);
const terrainTagController = new TerrainTagController(terrainTagService);
const userTrailController = new UserTrailController(userTrailService);
const ascentController = new AscentController(ascentService);
const hikeController = new HikeController(hikeService);
const auditLogController = new AuditLogController(auditLogService);
const dashboardController = new DashboardController(dashboardService);

// Registering routes
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', mountainController.getRouter());
app.use('/api/v1', trailController.getRouter());
app.use('/api/v1', terrainTagController.getRouter());
app.use('/api/v1', userTrailController.getRouter());
app.use('/api/v1', ascentController.getRouter());
app.use('/api/v1', hikeController.getRouter());
app.use('/api/v1', auditLogController.getRouter());
app.use('/api/v1', dashboardController.getRouter());


export default app;