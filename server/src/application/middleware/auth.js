export const authMiddleware =
  ({ authTokenService }) =>
  (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ error: "Access denied" });
    }

    const { val: decoded, ok, err } = authTokenService.verify(token);
    if (!ok) {
      res.status(401).json({ error: err });
      return;
    }
    req.userId = decoded.userId;
    next();
  };
