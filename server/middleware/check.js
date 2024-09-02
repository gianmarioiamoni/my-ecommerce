// middleware to track if a route is called

export const check = (req, res, next) => {
    console.log('Route called:', req.url);
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    console.log('Request query:', req.query);
    
    next();
};
