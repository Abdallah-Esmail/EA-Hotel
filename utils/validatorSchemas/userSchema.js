export const createUserValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string")
    .isLength({ min: 3, max: 32 })
    .withMessage("First name must be between 3 and 32 characters"),

  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string")
    .isLength({ min: 3, max: 32 })
    .withMessage("Last name must be between 3 and 32 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail()
    .custom(async (val) => {
      const user = await User.findOne({ where: { email: val } }); // ✅
      if (user) throw new Error("Email already exists");
      return true;
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 100 })
    .withMessage("Password must be between 8 and 100 characters") // ✅
    .matches(/^\S+$/)
    .withMessage("Password must not contain spaces"),

  // passwordConfirmation, phone: زي ما هم
  validatorMiddleware,
];

export const updateUserValidator = [
  param("id").isUUID(4).withMessage("Invalid user ID format (Must be UUIDv4)"),
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string"),
  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string"),
  body("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepts Egy & SA phone numbers"),
  validatorMiddleware,
];

export const updateLoggedUserValidator = [
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string"),
  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string"),
  body("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepts Egy & SA phone numbers"),
  validatorMiddleware,
];
