// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('[auth] Extracted token:', token);

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Step 1: Try your internal JWT (for email/password users)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, name: true }
      });

      if (user) {
        req.user = user;
        console.log('[auth] Authenticated internal user:', user);
        return next();
      }
    } catch (err) {
      console.log('[auth] Not an internal JWT:', err.message);
    }

    // Step 2: Validate Supabase JWT via Auth REST API
    try {
      const { data } = await axios.get(`${process.env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: process.env.SUPABASE_ANON_KEY
        }
      });

      req.user = {
        id: data.id,
        email: data.email,
        name: data.user_metadata?.full_name || data.email?.split('@')[0]
      };

      console.log('[auth] Authenticated Supabase user:', req.user);
      return next();
    } catch (supabaseErr) {
      console.error('[auth] Supabase token failed:', supabaseErr.response?.data || supabaseErr.message);
      return res.status(401).json({ error: 'Supabase token invalid or expired' });
    }

  } catch (err) {
    console.error('[auth] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = auth;
