var express = require("express");
const Transaction = require("../models/transaction");
const Notification = require("../models/notification");
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
        
        if(lyoum < new Date(transaction[0].endDate)){
            var daysleft = transaction[0].endDate.getTime() - lyoum.getTime();            
            var Difference_In_Days = daysleft / (1000 * 3600 * 24);
         res.json(Math.ceil(Difference_In_Days));
    }
    else{
        res.json(false);
    }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



//update all transactions state
router.patch("/updateAll", getAll, (req, res) => {
    var lyoum = new Date()
   
    res.transaction.forEach((element) => {
        if(lyoum > new Date(element.endDate) && element.state == true ){
            element.state = false;
            try {
                element.save().then((updatedapp) => {
                   
                   //post notification 
                   const notification = new Notification({
                    id: req.body.id,
                    icon: "heroicons_solid:star",
                    title: req.body.title,
                    patientId: "",
                    docId: element.docId,
                    description: "your subscription has expired.",
                    time: lyoum,
                    read: false,
                    image: null,
                    link: "/pricing",
                    useRouter: true,
                });
                try {
                    const newNotification =  notification.save();
            
                    res.status(201).json({ newNotification });
                } catch (err) {
                    console.log(err);
                    
                }
                   
                });
            } catch (error) {
                console.log("mmmmmm")
            }
        }
        
    
        
        
    });
    
});


// get one transaction by 

router.get("/:id", getApp, (req, res) => {
    console.log(res.transaction)
    //console.log("olaaaaaaaaaaaaaaa",res.transaction.start)
    res.json(res.transaction);
});




//add Appointment



router.post("/", async(req, res, next) => {
    console.log(req.body.t);
    var typee = req.body.period;
    console.log(typee)
    var noww = new Date();
    var add_value = 30
    if(typee == "year"){
        add_value = 365
    }
    else if (typee == "month"){
        add_value = 30
    }
    const transaction = new Transaction({
        id: req.body.t.id,
        docId: req.body.t.docId,
        state: req.body.t.state,
        startDate: new Date(),
        
        endDate: noww.setDate(noww.getDate() + add_value),
        price: req.body.t.price,
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


//delete one transaction

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

async function getAll(req, res, next) {
   // console.log(req.params.id)
    try {
        transaction = await Transaction.find();
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