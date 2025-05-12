import { userService } from './userService.js';

class AuthService {
  constructor({ userService }) {
    this.userService = userService;
  }

  async login(userData) {
    const { email, password } = userData;
    const user = await userService.findByEmail(email);

    if (!user) return null;

    const { passwordHash: hash, passwordSalt: salt } = user;
    const isPasswordValid = await this.userService.verify({
      password,
      hash,
      salt,
    });

    if (!isPasswordValid) return null;

    return user;
  }
}

const authService = new AuthService({ userService });

export { authService };
