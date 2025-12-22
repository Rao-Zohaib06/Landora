import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { verifyAdminSessionToken } from '../utils/adminSession.js';

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  const parts = header.split(';');
  for (const part of parts) {
    const [k, ...v] = part.trim().split('=');
    if (!k) continue;
    out[k] = decodeURIComponent(v.join('=') || '');
  }
  return out;
}

export const authenticate = async (req, res, next) => {
  try {
    // ENV-based admin session (HttpOnly cookie) support
    // - No database dependency for admin credentials.
    // - Works after server restart as long as ADMIN_AUTH_SECRET remains the same.
    const cookieHeader = req.headers.cookie;
    const cookies = parseCookies(cookieHeader);
    const adminToken = cookies.admin_session;
    const adminSecret = process.env.ADMIN_AUTH_SECRET;
    if (adminToken && adminSecret) {
      const payload = verifyAdminSessionToken(adminToken, adminSecret);
      if (payload) {
        const adminActorId = process.env.ADMIN_ACTOR_ID || '000000000000000000000001';
        req.user = {
          _id: adminActorId,
          id: adminActorId,
          role: 'admin',
          name: 'Admin',
          email: process.env.ADMIN_EMAIL || 'admin@local',
          isEnvAdmin: true,
        };
        return next();
      }
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.status !== 'active') {
      // Provide specific message for agents awaiting approval
      if (user.role === 'agent' && user.status === 'pending') {
        return res.status(403).json({
          success: false,
          message: 'Your agent account is pending approval. Please wait for admin approval.',
          statusCode: 'AGENT_PENDING_APPROVAL',
        });
      }
      
      if (user.role === 'agent' && user.status === 'rejected') {
        return res.status(403).json({
          success: false,
          message: 'Your agent account has been rejected. Please contact support.',
          statusCode: 'AGENT_REJECTED',
        });
      }

      return res.status(403).json({
        success: false,
        message: 'Account is not active',
      });
    }

    // Additional check for agents - must be approved by admin
    if (user.role === 'agent' && !user.approvedByAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Your agent account is pending admin approval.',
        statusCode: 'AGENT_PENDING_APPROVAL',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

export const roleGuard = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
    }

    next();
  };
};

