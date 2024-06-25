import db from "../model/index.js";
import { INTERNAL_ERROR } from "../utils/response.js";

/**
 * Check if user is admin or not
 **/
export const isAdmin = async (req, res, next) => {
  try {
    const headers = req.headers;
    const clientToken =
      headers["authorization"].replace("Bearer ", "") ||
      headers["x-access-token"];
    if (!clientToken) {
      return res.status(400).send("Need token");
    }
    const user = await db.user.findOne({
      where: {
        id: clientToken,
      },
    });
    const verified = user.role === "admin";
    if (!verified) {
      return res.status(400).send("Invalid token.");
    }
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send(INTERNAL_ERROR);
  }
};
