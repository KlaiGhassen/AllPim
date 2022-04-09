var express = require("express");
const Transaction = require("../models/transaction");
var router = express.Router();



//get all transaction
router.get("/", async(req, res, next) => {
    try {
        const apps = await Transaction.find();
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get("/byDocId/:docId", async(req, res, next) => {
    try {
        const transaction = await Transaction.find({ docId: req.params.docId });
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// returns true if state is true and subsciption is still valid 
router.get("/byDocId/checkSubs/:docId", async(req, res, next) => {
    var lyoum = new Date()
    
    try {
        const transaction = await Transaction.find({ docId: req.params.docId, state: true});
        
        if(lyoum < new Date(transaction[0].endDate) && lyoum > new Date(transaction[0].startDate )){
        res.json(true);
    }
    else{
        res.json(false);
    }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// get one transaction by 

router.get("/:id", getApp, (req, res) => {
    console.log(res.transaction)
    //console.log("olaaaaaaaaaaaaaaa",res.transaction.start)
    res.json(res.transaction);
});





//add Appointment



router.post("/", async(req, res, next) => {
    console.log(req.body);
    var noww = new Date();
    const transaction = new Transaction({
        id: req.body.id,
        docId: req.body.docId,
        state: req.body.state,
        startDate: new Date(),
        endDate: noww.setDate(noww.getDate() + 30),
        price: req.body.price,
    });
    try {
        const newApp = await transaction.save();

        res.status(201).json({ newApp });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            res.json({ isemail: true });
        }
    }
});


//delet one transaction

router.delete("/:id", getApp, async(req, res) => {
   
    try {
        await res.transaction.remove();
        console.log("barra mriguel")
    } catch (err) {
        console.log("a7bess fam w jib cigarou w 9ahwa bech nassehrou fama mochkla")
    }
});







async function getApp(req, res, next) {
    console.log(req.params.id)
    try {
        transaction = await Transaction.findById(req.params.id );
        if (transaction == null) {
            return res.status(404).json({ message: "cannot find transaction" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.transaction = transaction;
    next();

    
}



module.exports = router;