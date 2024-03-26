const express = require("express");
const router = express.Router();
const employeesController = require("../controllers/employeesController");
const verifyJWT = require("../middleware/verifyJWT");
const ROLES_List = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    verifyRoles(ROLES_List.Admin, ROLES_List.Editor),
    employeesController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_List.Admin, ROLES_List.Editor),
    employeesController.updateEmployee
  )
  .delete(verifyRoles(ROLES_List.Admin), employeesController.deleteEmployee);

router.route("/:id").get(employeesController.getEmployee);

module.exports = router;
