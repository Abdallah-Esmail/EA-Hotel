import { check, body } from "express-validator";
import validatorMiddleware from "../../middlewares/validationMiddleware.js";
import userModel from "../../models/user.model.js";
import appError from "../appError.js";
import httpStatusText from "../httpStatusText.js";
import bcrypt from "bcryptjs";

export const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  validatorMiddleware,
];

export const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be string")
    .isLength({ min: 3 })
    .withMessage("Too short user name")
    .isLength({ max: 32 })
    .withMessage("Too long user name"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail()
    .custom(async (val) => {
      const user = await userModel.findOne({ where: { email: val } });
      if (user) {
        throw new appError("Email already exists", 400, httpStatusText.FAIL);
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 chars at least")
    .isLength({ max: 32 })
    .withMessage("Too long password")
    .matches(/^\S+$/)
    .withMessage("Password must not contain spaces"),
  check("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepts Egy & SA phone numbers"),
  check("passwordConfirmation")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new appError(
          "Password confirmation is incorrect",
          400,
          httpStatusText.FAIL,
        );
      }
      return true;
    }),
  validatorMiddleware,
];

export const updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid user id format"),
  body("name").optional().isString().withMessage("Name must be string"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepts Egy & SA phone numbers"),
  check("role").optional(),
  validatorMiddleware,
];

export const changeUserPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("The new password is required")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be between 6 and 32 chars")
    .matches(/^\S+$/)
    .withMessage("Password must not contain spaces")
    .custom(async (newPassword, { req }) => {
      if (!req.user._id)
        throw new appError("Authentication required", 401, httpStatusText.FAIL);
      const user = await userModel.findById(req.user._id).select("+password");
      if (!user) {
        throw new appError(
          "There is no user for this id",
          404,
          httpStatusText.FAIL,
        );
      }
      if (
        !req.body.currentPassword ||
        !(await bcrypt.compare(req.body.currentPassword, user.password))
      ) {
        throw new appError(
          "Incorrect current password",
          400,
          httpStatusText.FAIL,
        );
      }
      return true;
    })
    .custom((newPassword, { req }) => {
      if (newPassword !== req.body.passwordConfirmation) {
        throw new appError(
          "The confirmation password is not equal to the new password",
          400,
          httpStatusText.FAIL,
        );
      }
      return true;
    }),
  body("passwordConfirmation")
    .notEmpty()
    .withMessage("Confirmation password is required"),
  validatorMiddleware,
];

export const deactivateUserValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid user id format")
    .notEmpty()
    .withMessage("Users id is required"),
  validatorMiddleware,
];

export const updateLoggedUserValidator = [
  body("name").optional().isString().withMessage("Name must be string"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepts Egy & SA phone numbers"),
  validatorMiddleware,
];

export const updateUserRoleValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("Invalid user id"),
  check("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["user", "manager", "admin"])
    .withMessage("Invalid role"),
  validatorMiddleware,
];
