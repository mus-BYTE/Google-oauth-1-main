const app = require("express")();

const PORT = 3000;

const session = require('express-session');
const ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(session({
    secret:"keyboard cat",
    resave: false,
    saveUninitialized:true,
}));

const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID:"861791870125-5gqiods6a12n89831vokk0ln62p8ggd7.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"http://localhost:3000/auth/google/callback"
},
    function(accessToken,refreshToken,profile,done){
        console.log(profile);
        return done(null,profile);
    }
));

passport.serializeUser(function(user,done){
    done(null,user);
});

passport.deserializeUser(function(user,done){
    done(null,user);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
    passport.authenticate('google',{scope:["https://www.googleapis.com/auth/plus.login"]})
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    }
);

app.get("/",(req,res)=>{
    // res.send("Hello world");
    res.render("home.ejs");
});

app.listen(PORT,()=>{
    console.log(`Server is listening at Port:${PORT}`);
})
