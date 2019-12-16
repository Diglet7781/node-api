const express=require('express');


//creating  router to handel request METHODs  
const router=express.Router();
const mongoose=require('mongoose');
const Product=require('../models/product');


router.get('/',(req,res,next)=>{
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs =>{
        const response={
            count:docs.length,
            products: docs.map(doc=>{
                return{
                    name:doc.name,
                    price:doc.price,
                    id:doc._id,
                    request:{
                        type:'GET',
                        url:'http:localhost:3000/products/'+doc._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({message:err});
    });
});

router.post('/',(req,res,next)=>{
    const product= new Product({
       _id: new mongoose.Types.ObjectId(),
       name:req.body.name,
       price:req.body.price
    });

    product
    .save()
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message:"created product sucessfully",
            createdProduct:{
                name:result.name,
                price:result.price,
                id:result._id,
                request:{
                    type:"GET",
                    url:"http:localhost:3000/products/" + result._id
                }
            }
        });

    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    });
    
    
});
router.get('/:productId',(req,res,next)=>{
    const id=req.params.productId;
   Product.findById(id)
   .select('name price _id')
   .exec()
   .then(doc =>{
       if(doc){
        const response={
            name:doc.name,
            price:doc.price,
            id:doc._id,
            request:{
                type:"GET",
                url:"http:localhost:3000/products/"+doc._id
            }
        }
        res.status(200).json(response);
       }else{
           res.status(404).json({message: "No valid id found for provided id"});
       }
      
   })
   .catch(err =>{
    console.log(err);
    res.status(500).json({error: err});
   });
});
router.patch('/:productId',(req,res,next)=>{
const id=req.params.productId;
const updateOps={};
for (const ops of req.body){
    updateOps[ops.propName]=ops.value;
}
Product.update({_id:id},{$set:updateOps})
.exec().
then(result=>{
    console.log(result);
    res.status(200).json({
        message:"update sucessful",
        request:{
            type:"GET",
            url:"http:localhost:3000/products/"+id
        }
    });
})
.catch(err=>{
    console.log(err);
    res.status(500).json(err);
});

});
router.delete('/:productId',(req,res,next)=>{
   const id=req.params.productId;
   Product.remove({_id: id})
   .exec()
   .then(result=>{
       console.log(result);
       res.status(200).json({
           message:"product Deleted sucessfully",
           request:{
               type:"POST",
               url:"http:localhost:3000/products",
               body:{name:"string",price:"Number"}
           }
       });
   })
   .catch(err =>{
       console.log(err);
       res.status(500).json({message: err});
   });

})
module.exports=router;