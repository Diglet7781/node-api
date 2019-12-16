const express=require('express');
const app=express();
const morgan =require('morgan');
const bodyParser=require('body-parser');
const mongoose =require('mongoose');
const connectionString="mongodb+srv://admin:admin@node-rest-shop-jfpik.mongodb.net/test?retryWrites=true&w=majority";
const productRoutes=require('./api/routes/products');//routes for products
const orderRoutes=require('./api/routes/order');//routes for order

mongoose.connect(connectionString,{ useNewUrlParser: true,useUnifiedTopology: true });

app.use(morgan('dev')); //morgan is middleware for handeling logging error
app.use(bodyParser.urlencoded({extended: false})); //body-parser provides access to the body of the request
app.use(bodyParser.json());

//preventing cross origin resource sharing error(cors)
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); //giving access to any client
    //which kind of headers to allow
    res.header('Access-Control-Allow-Headers',
    "Origin,X-Requested-With,Content-Type,Accept,Authorization");
    //telling browsers what method to accept
    if(req.method==="OPTIONS"){
        res.header("Access-Control-Allow-Methods",'PUT,GET,POST,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();
});
//handel routing
app.use('/products',productRoutes);
app.use('/order',orderRoutes);

//if none of the above routes is specified the error handeling takes in
app.use((req,res,next)=>{
const error =new Error('Not Found');
error.status=404;
next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        message:error.message
    });
});

module.exports=app;
