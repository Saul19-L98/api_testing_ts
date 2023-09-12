import { getUserByEmail } from "../db/users";
import express from "express";
import { authentication, random } from "../helpers";

export default async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing information" });
    }
    const user = await getUserByEmail(email).select(
      "+authentication.password +authentication.salt"
    );
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const expectedHash = authentication(user.authentication!.salt!, password);

    if (expectedHash.toString() !== user.authentication!.password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const salt = random();
    const sessionToken = authentication(salt, user._id.toString());
    user.authentication!.sessionToken = `${sessionToken}`;
    await user.save();
    res.cookie("API-COOKIE", user.authentication!.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error registering user" });
  }
};
