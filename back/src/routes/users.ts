import express from "express";
const { getAllUsers, getSingleUser } = require("../controllers/users");
const router = express.Router();
/*-----------ESTAN SIN USO AUN, ver dsp q tengo q agregarles eluserid al params p/
poder chequear ownership*/
router.get("/users", getAllUsers);
router.get("/users/:id", getSingleUser);
module.exports = router;
