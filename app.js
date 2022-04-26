const   express     = require('express'),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require('mongoose'),
        passport    = require('passport'),
        LocalStrategy = require('passport-local'),
        flash       = require('connect-flash'),
        Print       = require('./models/print'),
        Comment     = require('./models/comment'),
        User        = require('./models/user'),
        seedDB      = require('./seeds.js');

const   indexRoutes = require("./routes/index"),
        printRoutes = require("./routes/prints"),
        commentRoutes = require("./routes/comments");

mongoose.connect('mongodb://localhost/NamDoSanPrint');
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({extend: true}));
app.use(flash());
// seedDB();

app.use(require('express-session') ({
    secret: 'secret word',
    releaseEvents: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

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

app.use('/', indexRoutes);
app.use('/prints', printRoutes);
app.use('/prints/:id/comments', commentRoutes);

app.listen(3000, () => {
    console.log("Activated");
});