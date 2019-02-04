module.exports = {
    isLoggenIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            return res.redirect('/signin');
        }
    },
    isNotLoggenIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        } else {
            return res.redirect('/profile');
        }
    }
};