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

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Repositories
const userRepository: IUserRepository = new UserRepository();
const mountainRepository : IMountainRepository = new MountainRepository();

// Services
const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const mountainService: IMountainService = new MountainService(mountainRepository);

// WebAPI routes
const authController = new AuthController(authService);
const userController = new UserController(userService);
const mountainController = new MountainController(mountainService);

// Registering routes
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', mountainController.getRouter());

export default app;