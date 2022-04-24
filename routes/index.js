const   express = require('express'),
        router  = express.Router(),
        User    = require('../models/user'),
        passport = require('passport');

router.get("/", function(req, res) {
    res.render("landing.ejs");
});

router.get('/register', (req, res) => {
    res.render('register.ejs');
});

router.post('/register', (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.redirect('/register');
        } else {
            passport.authenticate('local')(req, res, () => {
                res.redirect('/prints');
            });
        }
    });
});

router.get('/login', (req, res) => {
    res.render('login.ejs');
})

router.post('/login', passport.authenticate('local', {
    successRedirect: "/prints",
    failureRedirect: '/login'
}), (req, res) => {})

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;