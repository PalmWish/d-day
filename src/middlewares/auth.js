const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "UNAUTHORIZED" });
  }
  req.user = user;
  next();
};

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    // console.log(`authHeader: ${authHeader}`);
    // console.log(`fullHeader:`, req.headers);
    // console.log(`authToken: ${token}`);
    
    if (!token) return res.status(401).json({ error: "Permission denied." });

    jwt.verify(token, env.JWT_SECRET, (err, decodedUser) => {
        if (err) return res.status(403).json({ error: "Your session is expired." });
        
        req.user = decodedUser; 
        next(); 
    });
};

module.exports = {
  authMiddleware,
  verifyToken
};