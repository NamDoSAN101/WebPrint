const   express = require('express'),
        router  = express.Router(),
        multer  = require('multer'),
        path    = require('path'),
        storage = multer.diskStorage({
            destination: function(req, file, callback) {
                callback(null, './public/upload/');
            },
            filename: function(req, file, callback) {
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        }),
        imageFilter = function(req, file, callback) {
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                return callback(new Error('Only jpg, jpeg, png and gif'), false);
            }
            callback(null, true);
        },
        upload  = multer({storage: storage, fileFilter: imageFilter}),
        middleware = require('../middleware'),
        Print   = require('../models/print');

router.get("/", function(req, res) {
    // res.render("index.ejs", {prints:prints})
    Print.find({}, function(err, allPrints){
        if(err) {
            console.log(err);
        } else {
            res.render("print/index.ejs", {prints: allPrints})
        }
    })
});

router.post("/", middleware.isLoggedIn, upload.single('image'), (req, res) => {
    req.body.print.image = '/upload/' + req.file.filename;
    req.body.print.author = {
        id: req.user._id,
        username: req.user.username
    };
    // let name = req.body.name;
    // let Artist = req.body.Artist;
    // let url = req.body.url;
    // let author = {
    //     id: req.user._id,
    //     username: req.user.username
    // }
    // let newPrint = {name:name, Artist:Artist, url:url, author: author};
    // prints.push(newPrint);
    // Print.create(newPrint, function(err, newlyAdded) {
    Print.create(req.body.print, function(err, newlyAdded) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/prints");
        }
    });
    // res.redirect("/prints");
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("print/new.ejs");
});

router.get("/:id", (req, res) => {
    Print.findById(req.params.id).populate('comments').exec(function(err, foundPrint) {
    // Print.findById(req.params.id, (err, foundPrint) => {
        if(err) {
            console.log(err);
        } else {
            res.render("print/show.ejs", {print: foundPrint});
        }
    });
})

module.exports = router;