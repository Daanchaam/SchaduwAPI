const router = require('express').Router();
const auth = require('../middleware/auth');
const hasRole = require('../middleware/role');
const registerUser = require('../controllers/userController');

/**
 * @POST Registration request
 */
router.post('/register', async(req, res) => {
  try {
    registerUser(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @POST request for login
 */
router.post('/login', async(req, res) => {
  try {
    loginUser(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @GET request for retrieving all users
 * -- User must be authenticated  --
 * -- User must have role 'basic' --
 */
router.get('/all', auth, hasRole('admin'), async(req, res) => {
  try {
    getAllUsers(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @POST request for updating a person's role, given his ID
 * -- User must be authenticated  --
 * -- User must have role 'admin' --
 */
router.post('/addRole/:id', auth, hasRole('admin'), async(req, res) => {
  try {
    assignRoleToUser(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;