import * as userService from '../services/userService.js';

export async function getAll(req, res) {
  const users = await userService.getAll();

  res.send(users);
}
