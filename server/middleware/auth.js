const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const redisClient = require('../client/redisClient'); // Adjust path if needed

const prisma = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('[auth] Extracted token:', token);

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // 🔐 Step 1: Try internal JWT (email/password users)
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

    // 🔁 Step 2: Validate Supabase token (with Redis cache)
    const cacheKey = `supabase_token:${token}`;
    try {
      // ✅ 2A: Try cache first
      const cachedUser = await redisClient.get(cacheKey);
      if (cachedUser) {
        req.user = JSON.parse(cachedUser);
        console.log('[auth] Supabase user from cache:', req.user);
        return next();
      }

      // 🌐 2B: If not in cache, fetch from Supabase API
      const { data } = await axios.get(`${process.env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: process.env.SUPABASE_ANON_KEY
        }
      });

      const userData = {
        id: data.id,
        email: data.email,
        name: data.user_metadata?.full_name || data.email?.split('@')[0]
      };

      // 💾 Cache user data for 5 minutes
      await redisClient.setEx(cacheKey, 60 * 5, JSON.stringify(userData));

      req.user = userData;
      console.log('[auth] Supabase user from API:', req.user);
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
