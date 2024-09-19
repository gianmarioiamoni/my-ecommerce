import jwt from 'jsonwebtoken';

/**
 * Middleware to check if the user is authenticated
 * 
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @param {function} next - the next middleware function
 * 
 * @throws {Error} if the token is invalid or expired
 */
export const isAuthenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the given token with the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // save the user object in the request 
        next();  
    } catch (error) {
        console.log('Error validating token:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};


/**
 * Middleware to check if the user is an admin
 * 
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @param {function} next - the next middleware function
 * 
 * @throws {Error} if the user is not an admin
 */
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();  // user is admin, proceed to the next middleware
    } else {
        // User is not an admin, deny access
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

