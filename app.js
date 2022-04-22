const   express     = require('express'),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require('mongoose'),
        Print       = require('./models/print'),
        Comment     = require('./models/comment'),
        seedDB      = require('./seeds.js');

mongoose.connect('mongodb://localhost/NamDoSanPrint');
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extend: true}));
// seedDB();

// const printSchema = new mongoose.Schema({
//     name: String,
//     Artist: String,
//     url: String
// });

// const Print = mongoose.model('Print', printSchema);

// const prints = [
//     {name:"Iron man 3", Artist:"Phantom City Creative", url:"https://img.kapook.com/u/itsada/movie/1sheet%20SF_re_2.jpg"},
//     {name:"The lord of the rings", Artist:"Gabz", url:"https://getreview.today/wp-content/uploads/2021/05/fellowship-1024x767.jpeg"},
//     {name:"Iron man", Artist:"Gabz", url:"https://upload.wikimedia.org/wikipedia/th/2/20/Ironmanposter.jpg"}
// ];

// Print.create(
//     {
//         name:"Iron man 3", 
//         Artist:"Phantom City Creative", 
//         url:"https://img.kapook.com/u/itsada/movie/1sheet%20SF_re_2.jpg"
//     },
//     function(err, print){
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("New data added!");
//             console.log(print);
//         }
//     }
// )

app.get("/", function(req, res) {
    res.render("landing.ejs");
});

app.get("/prints", function(req, res) {
    // res.render("index.ejs", {prints:prints})
    Print.find({}, function(err, allPrints){
        if(err) {
            console.log(err);
        } else {
            res.render("print/index.ejs", {prints: allPrints})
        }
    })
});

app.post("/prints", (req, res) => {
    let name = req.body.name;
    let Artist = req.body.Artist;
    let url = req.body.url;
    let newPrint = {name:name, Artist:Artist, url:url};
    // prints.push(newPrint);
    Print.create(newPrint, function(err, newlyAdded) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/prints");
        }
    })
    // res.redirect("/prints");
})

app.get("/prints/new", (req, res) => {
    res.render("print/new.ejs");
});

app.get("/prints/:id", (req, res) => {
    Print.findById(req.params.id).populate('comments').exec(function(err, foundPrint) {
    // Print.findById(req.params.id, (err, foundPrint) => {
        if(err) {
            console.log(err);
        } else {
            res.render("print/show.ejs", {print: foundPrint});
        }
    });
})

app.get("/prints/:id/comments/new", (req, res) => {
    Print.findById(req.params.id, (err, foundPrint) => {
        if(err) {
            console.log(err)
        } else {
            res.render("comments/new.ejs", {print: foundPrint})
        }
    })
})

app.post("/prints/:id/comments", (req, res) => {
    Print.findById(req.params.id, (err, foundPrint) => {
        if(err) {
            console.log(err)
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err)
                } else {
                    foundPrint.comments.push(comment);
                    foundPrint.save();
                    res.redirect("/prints/" + foundPrint._id);
                }
            });
        }
    });
})

app.listen(3000, () => {
    console.log("Activated");
});