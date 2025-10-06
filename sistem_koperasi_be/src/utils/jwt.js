import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const generateToken = async (payload, options = {}) => {
  const { 
    expiresIn = '2d',
    issuer = 'koperasi_app' 
  } = options;

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS512' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setExpirationTime(expiresIn)
    .sign(secret);
};

export const generateRefreshToken = async (payload, options = {}) => {
  const { 
    expiresIn = '2d', 
    issuer = 'koperasi_app'
  } = options;

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS512' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setExpirationTime(expiresIn)
    .sign(secret);
};