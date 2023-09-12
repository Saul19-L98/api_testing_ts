import express from "express";
import register from "../controllers/registerController";
import loginController from "../controllers/loginController";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", loginController);
};
