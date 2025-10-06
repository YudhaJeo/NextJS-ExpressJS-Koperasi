import { findUserByEmail } from '../models/authModel.js';
import { generateToken } from '../utils/jwt.js';
import { loginSchema } from '../schemas/authSchema.js';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate({ email, password });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const user = await findUserByEmail(email.trim());
    
    if (!user) {
      return res.status(401).json({ error: 'Email belum terdaftar' });
    }

    const passwordMatch = await bcrypt.compare(password.trim(), user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password salah' });
    }

    if (user.status !== 1) {
      return res.status(403).json({ error: 'Akun Anda tidak aktif' });
    }

    const accessTokenPayload = {
      id: user.id,
      role_id: user.role_id,
      email: user.email,
      kode_perusahaan: user.kode_perusahaan
    };

    const accessToken = await generateToken(accessTokenPayload);

    res.status(200).json({
      accessToken,
      username: user.name,
      email: user.email,
      role_id: user.role_id,
      kode_perusahaan: user.kode_perusahaan,
      mode: user.mode || 'dark',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};