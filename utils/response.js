export default ({ res, code = 200, message = "", data = {} }) => {
  return res.status(code).send({
    message,
    code,
    data,
  });
};

export const SUCCESS = "Success";
export const BAD_REQUEST = "Bad Request";
export const INTERNAL_ERROR = "Internal server error";
export const INVALID_LOGIN = "Please enter correct email or password";
