import express from "express";

import {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  deactivateUserValidator,
  updateLoggedUserValidator,
  updateUserRoleValidator,
} from "../utils/validatorSchemas/userSchema.js";
import * as userController from "../controllers/user.controller.js";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

router.use(authController.protect);

router.get("/getMe", userController.getLoggedUserData, userController.getUser);

router.put(
  "/changeMyPassword",
  changeUserPasswordValidator,
  userController.updateLoggedUserPassword,
);

router.put(
  "/updateMe",
  userController.uploadUserImage,
  userController.resizeImage,
  updateLoggedUserValidator,
  userController.updateLoggedUserData,
);

router.delete("/deleteMe", userController.deleteLoggedUser);

router.patch(
  "/:id/role",
  authController.allowedTo("admin"),
  updateUserRoleValidator,
  userController.updateUserRole,
);

router.use(authController.allowedTo("admin", "manager"));

router
  .route("/")
  .get(userController.getUsers)
  .post(createUserValidator, userController.createUser);

router
  .route("/:id")
  .get(getUserValidator, userController.getUser)
  .put(
    userController.uploadUserImage,
    userController.resizeImage,
    updateUserValidator,
    userController.updateUser,
  )
  .patch(deactivateUserValidator, userController.deactivateUser);

export default router;
