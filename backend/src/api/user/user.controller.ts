import { NextFunction, Response } from "express";
import { TypedRequest } from "../../utils/typed-request.interface";
import userService from "./user.service";
import { logService } from "../log/log.service";
import { UserIdentityModel } from "../../utils/auth/local/user-identity-model";

interface PasswordRequestBody {
  newPassword: string;
}

export const me = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const username = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const userIdentity = await UserIdentityModel.findOne({ user: user.id });
    const username = userIdentity?.credentials.username;
    res.json(username);
  } catch (err) {
    next(err);
  }
};

export const list = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const items = await userService.list();
    res.json(items);
  } catch (err) {
    next(err);
  }
};

export const password = async (
  req: TypedRequest<PasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const newPassword = req.body.newPassword;

    const success = await userService.changePassword(user.id!, newPassword);
    console.log(success);
    if (success!) {
      await logService.createLog(
        req,
        "Password Change",
        "Password cambiata correttamente"
      );
      res.status(200).json({ message: "Password cambiata correttamente" });
    } else {
      await logService.createLog(
        req,
        "Password Change",
        "Cambiamento password fallito"
      );
      res.status(400).json({ message: "Cambiamento password fallito" });
    }
  } catch (err: any) {
    await logService.createLog(req, "Password Change", err.message);
    next(err);
  }
};
