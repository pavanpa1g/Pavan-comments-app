import jwt from "jsonwebtoken";

export function getUserIdByToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
}
