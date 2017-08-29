var express         = require("express"),
    bodyParser      = require("body-parser");
var router          = express.Router();

router.use(bodyParser.urlencoded({extended: true}));



//all
router.get("/explore/all", function(req, res){
    req.session.returnTo = req.path; //RECORD THE PATH
    res.render("explore/all");
});

//foods
router.get("/explore/foods", function(req, res){
    req.session.returnTo = req.path; //RECORD THE PATH
    res.render("explore/foods");
});




module.exports = router;