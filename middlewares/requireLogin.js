module.exports = (req, res, next) => {
    if(!localStorage.getItem('currentUser')){
        return res.status(401).send({ error: 'You must log in!' });
    }
    next();
};