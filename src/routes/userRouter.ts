import { Router } from "express";
import auth from "../middleware/auth";
import hasRole from "../middleware/role";
import userController from "../controllers/userController";

const router = Router();

/**
 * @POST Registration request
 */
router.post("/register", async (req, res) => {
  try {
    userController.registerUser(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @POST request for login
 */
router.post("/login", async (req, res) => {
  try {
    userController.loginUser(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @GET request for retrieving all users
 * -- User must be authenticated  --
 * -- User must have role 'basic' --
 */
router.get("/all", auth, hasRole("admin"), async (req, res) => {
  try {
    userController.getAllUsers(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @POST request for updating a person's role, given his ID
 * -- User must be authenticated  --
 * -- User must have role 'admin' --
 */
router.post("/addRole/:id", auth, hasRole("admin"), async (req, res) => {
  try {
    userController.assignRoleToUser(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
