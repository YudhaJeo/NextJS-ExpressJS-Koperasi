import "dotenv/config";
import * as jose from "jose";
import { datetime, status } from "../utils/general.js";

export const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];

    if (!header || !header.startsWith("Bearer ")) {
      console.log('Token Verification - No Bearer Token');
      return res.status(401).json({
        status: status.GAGAL,
        message: "Token tidak valid",
        datetime: datetime(),
      });
    }

    const token = header.split(" ")[1];
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);

    console.log('Token Verification - Attempting to verify token');
    const { payload } = await jose.jwtVerify(token, secretKey, {
      algorithms: ["HS512"],
    });

    console.log('Token Verification - Token Valid', {
      userId: payload.id,
      email: payload.email,
      roleId: payload.role_id
    });

    req.user = payload;
    next();
  } catch (err) {
    if (err.code === "ERR_JWT_EXPIRED") {
      console.log('Token Verification - Token Expired');
      return res.status(401).json({
        status: status.GAGAL,
        message: "Token expired, silahkan login kembali",
        datetime: datetime(),
      });
    }

    if (err.code === "ERR_JWS_INVALID") {
      console.log('Token Verification - Invalid Token Structure');
      return res.status(401).json({
        status: status.GAGAL,
        message: "Token tidak valid",
        datetime: datetime(),
      });
    }

    console.error('Token Verification - Unexpected Error', err);
    return res.status(500).json({
      status: status.GAGAL,
      message: "Terjadi kesalahan pada server",
      datetime: datetime(),
    });
  }
};