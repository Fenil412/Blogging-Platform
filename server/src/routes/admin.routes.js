import { Router } from "express";
import {admin, deleteUser, dashboard} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const router = Router()

router.route('/users').get( verifyJWT, isAdmin, admin)
router.route('/users/:id').delete( verifyJWT, isAdmin, deleteUser)
router.route('/dashboard').get( verifyJWT, isAdmin, dashboard)

export default router