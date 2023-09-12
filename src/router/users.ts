import express from "express";

import {
  getAllUsers,
  deleteUser,
  updateUserName,
} from "../controllers/usersController";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
  router.patch("/users/:id", isAuthenticated, isOwner, updateUserName);
};
