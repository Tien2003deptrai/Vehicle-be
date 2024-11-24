const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.Role)) {
            return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
        }
        next();
    };
};

module.exports = authorize;
