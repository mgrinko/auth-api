import 'dotenv/config';

import { sequelize } from './src/utils/db.js';
import { Token } from './src/models/Token.js';
import { User } from './src/models/User.js';

sequelize.sync({ force: true });