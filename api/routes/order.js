const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');

const Order=require('../models/order');
const Product=require('../models/product');
router.get('/',(req,res,next)=>{
    Order
    .find()
    .select('_id product quantity')
    .exec()
    .then(docs=>{
        console.log(docs);
        if(docs.length==0){
            res.status(200).json({
                message:"There are no orders to Display",
                request:{
                    type:"POST",
                    URL:"http:localhost:3000/order",
                    body:{
                        productId:{
                            type:"GET",
                            url:"http:localhost:3000/products"
                        },
                        quantity:"Number"
                    }
                }
            })
        }else{
       const response={
            count:docs.length,
            orders:docs.map(doc=>{
                return{
                    _id:doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request:{
                        type:"POST",
                        url:"http:localhost:3000/order"
                    }
                }
            })
        };
        res.status(200).json(response);
    }})
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    });
    
});

router.get('/:orderId',(req,res,next)=>{
    const id=req.params.orderId;
    Order.findById({_id:id})
    .select("_id quantity product")
    .exec()
    .then(result=>{
        res.status(200).json({
            orderId:result._id,
            qunatity:result.quantity,
            productId:result.product,
            request:{
                type:"GET",
                url:"http:localhost:3000/order/"+result._id
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        });
    });
})

router.post("/",(req,res,next)=>{
    Product.findById(req.body.productId)
    .then(product=>{
        if(!product){
            return res.status(500).json({
                message:"Product Not Found"
            });
        }
        const order= new Order({
            _id:mongoose.Types.ObjectId(),
            quantity:req.body.quantity,
            product:req.body.productId
        });
        return order.save();
    })
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:"order stored",
            createdOrder:{
                _id:result._id,
                product:result.product,
                quantity:result.quantity
            },
            request:{
                type:"GET",
                url:"http:localhost:3000/orders/"+result._id
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
    });
    
router.delete("/:orderId",(req,res,next)=>{
    const id=req.params.orderId;
    Order.deleteOne({_id:id})
    .exec()
    .then(result=>{
        result.status(200).json({
            message:"the order has been deleted sucessfully",
           request:{
               type:"GET",
               url:"http:localhost:3000/order/"
           }
        });
    })
    .catch(err=>{
        res.status(500).json(err);
    });

    
});


module.exports=router;