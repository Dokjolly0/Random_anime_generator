import { NextFunction, Response, Request } from "express";
import { TypedRequest } from "../../utils/typed-request.interface";
import userService from "../user/user.service";
import { AddUserDTO } from "./auth.dto";
import { omit, pick } from "lodash";
import { UserExistsError } from "../../errors/user-exist";
import passport from "passport";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../utils/auth/jwt/jwt-strategy";
import { logService } from "../log/log.service";
import { emailService } from "../../utils/email.service";
import dotenv from "dotenv";

dotenv.config();

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authMiddleware = passport.authenticate(
      "local",
      async (err, user, info) => {
        if (err) {
          await logService.createLog(req, "Errore", err);
          next(err);
          return;
        }

        if (!user) {
          await logService.createLog(
            req,
            "LoginError",
            "Username o password non validi."
          );
          res.status(400).json({
            error: "LoginError",
            message: "Username o password non validi.",
          });
          return;
        }

        if (!user.isActive) {
          await logService.createLog(
            req,
            "LoginError",
            "Account non attivato."
          );
          res.status(400).json({
            error: "LoginError",
            message:
              "Account non attivato. Controlla la tua casella mail per confermare la registrazione.",
          });
          return;
        }

        const token = jwt.sign(JSON.parse(JSON.stringify(user)), JWT_SECRET, {
          expiresIn: "30 minutes",
        });

        await logService.createLog(
          req,
          "Login",
          "Login effettuato con successo."
        );

        res.status(200).json({
          user,
          token,
        });
      }
    );

    authMiddleware(req, res, next);
  } catch (e: any) {
    await logService.createLog(req, "Errore", e.message);
    next(e);
  }
};

export const add = async (
  req: TypedRequest<AddUserDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = omit(req.body, "username", "password", "iban", "openDate");
    const credentials = pick(req.body, "username", "password");
    const currentOpenDate = new Date();
    const updatedUserData = {
      ...userData,
      openDate: currentOpenDate,
      isActive: false,
    };
    const newUser = await userService.add(updatedUserData, credentials);
    await emailService.sendConfirmationEmail(
      req.body.username,
      newUser.id!,
      newUser.confirmationCode!
    );
    logService.createLog(req, "Utente registrato", newUser.id!);
    res.status(201).json({
      message:
        "Utente registrato correttamente. Controlla la tua casella mail per confermare la registrazione.",
      userId: newUser.id,
    });
  } catch (e) {
    if (e instanceof UserExistsError) {
      res.status(400);
      res.send(e.message);
    } else {
      next(e);
    }
  }
};

export const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, code } = req.query;

    const isConfirmed = await userService.verifyConfirmationCode(
      userId as string,
      code as string
    );

    if (isConfirmed) {
      res.redirect(`${process.env.BASE_URL}/confirm-email`);
      // res.status(200).json({ message: 'Mail confermata, account attivato.' });
    } else {
      res.redirect(`${process.env.BASE_URL}/confirm-email`);
      //   res.status(400).json({ message: "Codice di conferma non valido." });
    }
  } catch (error) {
    next(error);
  }
};
