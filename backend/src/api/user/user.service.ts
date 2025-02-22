import { UserExistsError } from "../../errors/user-exist";
import { UserIdentityModel } from "../../utils/auth/local/user-identity-model";
import { User } from "./user.entity";
import { UserModel } from "./user.model";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  async add(
    user: User,
    credentials: { username: string; password: string }
  ): Promise<User> {
    const existingIdentity = await UserIdentityModel.findOne({
      "credentials.username": credentials.username,
    });
    if (existingIdentity) {
      throw new UserExistsError();
    }
    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    const confirmationCode = uuidv4();

    const newUser = await UserModel.create({
      ...user,
      isActive: false,
      confirmationCode,
    });
    await UserIdentityModel.create({
      provider: "local",
      user: newUser.id,
      credentials: {
        username: credentials.username,
        hashedPassword,
      },
    });

    return newUser;
  }
  async list(): Promise<User[]> {
    let query: any = {};
    return UserModel.find(query);
  }

  async getUserById(userId: string) {
    return UserModel.findById(userId);
  }

  async changePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserIdentityModel.updateOne(
      { user: userId },
      { "credentials.hashedPassword": hashedPassword }
    );
    return true;
  }

  async activateUser(userId: string): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { isActive: true });
  }

  async verifyConfirmationCode(userId: string, confirmationCode: string) {
    const user = await UserModel.findById(userId);
    if (user && user.confirmationCode === confirmationCode) {
      user.isActive = true;
      user.confirmationCode = undefined;
      await user.save();
      return true;
    }
    return false;
  }
}
export default new UserService();
