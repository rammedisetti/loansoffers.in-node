/** Authentication middleware: gates staff-only API routes. */

export function requireStaff(req, res, next) {
  if (req.session && req.session.user && req.session.user.is_staff) {
    return next();
  }
  return res.status(401).json({ detail: 'Authentication required.' });
}
