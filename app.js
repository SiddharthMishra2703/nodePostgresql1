const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

//for vercel
app.set('views', __dirname + '/views');
app.set('public', __dirname + '/public');


var pg = require('pg');



//enter your sql server details in env file or direct here
const con = new pg.Client(process.env.CON_STRING);

// const con = new pg.Client({
//     host:process.env.HOST,
//     user:process.env.USER,
//     password:process.env.PASSW,
//     database:process.env.DATABASE,
//     port:5432,
//     ssl:true
// });
con.connect(function(error){
    if(error) throw error;
    else console.log('Connected');
});



app.get("/", function(req, res){
    res.render('login');
});
app.post("/", function(req, res){
    let item = req.body;

    con.query(`select password from auth where id = '${item.name}'`, function(err, result){
        if(result.rows){
            result = result.rows;
        }
        if(result && result[0] && result[0].password == item.password && item.name == 'admin'){
            let q1 = w1 = b1 = 0;
            let q2 = w2 = b2 = 0;
            con.query("select quantity, weight, box_count from customer1", function(err, result){
                if(result.rows){
                    result = result.rows;
                }
                if(err) throw err;
                if(result.length == 0){
                    res.render("admin", {q1, w1, b1, q2, w2, b2});
                }else{
                    result.forEach(ele => {
                        q1 += ele.quantity;
                        w1 += ele.weight;
                        b1 += ele.box_count;
                    });
                    con.query("select quantity, weight, box_count from customer2", function(err, result){
                        if(result.rows){
                            result = result.rows;
                        }
                        if(err) throw err;
                        if(result.length == 0){
                            res.render("admin", {q1, w1, b1, q2, w2, b2});
                        }else{
                            result.forEach(ele => {
                                q2 += ele.quantity;
                                w2 += ele.weight;
                                b2 += ele.box_count;
                            });
                            res.render("admin", {q1, w1, b1, q2, w2, b2});
                        }
                    });
                }
            });
        }
        else if(result && result[0] && result[0].password == item.password && item.name != 'admin'){
            res.render("others", {name:item.name});
        }
        else{
            res.send("invalid credential");
        }
    });
});

app.post("/customer", function(req, res){
    let item = req.body;
    con.query(`insert into ${item.name} values ('${item.a}', '${item.b}', '${item.c}', '${item.d}', ${item.e}, ${item.f}, '${item.g}', '${item.h}', ${item.i}, ${item.j}, '${item.k}', '${item.l}') `, function(err, result){
        if(err) throw err;
    });
    res.redirect("/");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("Server started at port " + PORT);
});
