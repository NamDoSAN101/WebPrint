const   express = require('express'),
        router  = express.Router({mergeParams: true}),
        Print    = require('../models/print'),
        Comment = require('../models/comment'),
        middleware = require('../middleware');

router.get("/new", middleware.isLoggedIn, (req, res) => {
    Print.findById(req.params.id, (err, foundPrint) => {
        if(err) {
            console.log(err)
        } else {
            res.render("comments/new.ejs", {print: foundPrint})
        }
    })
})

router.post("/", middleware.isLoggedIn, (req, res) => {
    Print.findById(req.params.id, (err, foundPrint) => {
        if(err) {
            console.log(err)
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err)
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundPrint.comments.push(comment);
                    foundPrint.save();
                    res.redirect("/prints/" + foundPrint._id);
                }
            });
        }
    });
});



module.exports = router;