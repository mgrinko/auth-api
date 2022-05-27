import { ApiError } from '../exceptions/api-error.js';

export const errorMiddleware = (error, req, res, next) => {
  if (error instanceof ApiError) {
    const { status, message, errors } = error;

    return res.status(status).send({ message, errors });
  }

  console.log('----- 500 -----');
  console.log(error);
  console.log('----- --- -----');

  res.status(500).send({ message: 'Unexpected server error' });
};
 