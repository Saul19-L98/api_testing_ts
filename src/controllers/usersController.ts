import express from "express";
import { getUsers, deleteUserById, getUserById } from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error getting users" });
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);
    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error deleting user" });
  }
};

export const updateUserName = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Missing information" });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    user.username = username;
    await user.save();
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error updating user name" });
  }
};
