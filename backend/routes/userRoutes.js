import express from 'express';
import {userAuth} from '../middlewares/authMiddleware.js';
import { getUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.post("/get-user",userAuth, getUser);
router.post("/update-user",userAuth, updateUser);
export default router;
