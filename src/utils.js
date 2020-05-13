import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

/**

jwt.sing(뭘 암호화? , 시크릿 키)
 */
