import express from "express";
import { getUserByEmail, createUser } from "../db/users";
import { random, authentication } from "../helpers/index";

export default async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).send({ message: "Missing information" });
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }
    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error registering user" });
  }
};
