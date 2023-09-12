import express from "express";
import { getUserIdByToken } from "../db/users";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["API-COOKIE"];
    if (!sessionToken) {
      return res.status(401).json({ message: "There is not current session" });
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(401).json({
        message: `Not authenticated from isAuthenticated: ${existingUser} ${sessionToken}`,
      });
    }
    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).json({ message: "Error authenticating user" });
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const sessionToken = req.cookies["API-COOKIE"];
    const currentUserId = await getUserIdByToken(sessionToken);
    if (!currentUserId?.id) {
      return res
        .status(400)
        .json({
          message: `User not authenticated from isOwner ${currentUserId},${id}`,
        });
    }
    if (currentUserId?.id !== id) {
      return res
        .status(401)
        .json({ message: `User not authorized ${currentUserId},${id}` });
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400).json({ message: "Error authenticating user" });
  }
};
