const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const mongoose = require("mongoose");

router.get("/current/:id", async(req, res) => {
  console.log("hi",req.body)
  const user = await User.find({ _id: req.params.id });
        res.json(user);
 // res.json(req.body.payload);
});

router.get("/contacts", async (req, res) => {
  const  { _id}  = req.body.payload.compte
  console.log(_id)
  console.log("id",_id)
  try {
    const contacts = await User.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(_id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "contacts",
          foreignField: "_id",
          as: "contacts",
        },
      },
      {
        $project: {
          _id: 0,
          contacts: 1,
        },
      },
      {
        $unwind: "$contacts",
      },
      {
        $replaceRoot: {
          newRoot: "$contacts",
        },
      },
      {
        $project: {
          contacts: 0,
        },
      },
      {
        $lookup: {
          from: "messages",
          let: { contact_id: "$_id", user_id: mongoose.Types.ObjectId(_id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ["$from", "$$contact_id"] },
                        { $eq: ["$to", "$$user_id"] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ["$to", "$$contact_id"] },
                        { $eq: ["$from", "$$user_id"] },
                      ],
                    },
                  ],
                },
              },
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "latest_message",
        },
      },
      {
        $unwind: {
          path: "$latest_message",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          "latest_message.createdAt": -1,
        },
      },
      {
        $lookup: {
          from: "messages",
          let: { contact_id: "$_id", user_id: mongoose.Types.ObjectId(_id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$to", "$$user_id"] },
                    { $eq: ["$from", "$$contact_id"] },
                    { $eq: ["$readed", false] },
                  ],
                },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "unreaded",
        },
      },
      {
        $unwind: {
          path: "$unreaded",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "messages",
          let: { contact_id: "$_id", user_id: mongoose.Types.ObjectId(_id) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$to", "$$user_id"] },
                    { $eq: ["$from", "$$contact_id"] },
                    { $eq: ["$delivred", false] },
                  ],
                },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "undelivred",
        },
      },
      {
        $unwind: {
          path: "$undelivred",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          unreaded: {
            $ifNull: ["$unreaded", { count: 0 }],
          },
          undelivred: {
            $ifNull: ["$undelivred", { count: 0 }],
          },
        },
      },
    ]);
console.log("COntacts",contacts)
    res.json(contacts);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
