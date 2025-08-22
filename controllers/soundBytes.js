const express = require("express");
const verifyToken = require ("../middleware/verify-token.js"); // needs to be built
const SoundByte = require("../models/soundByte.js"); // needs to be built
const router = express.Router();

//create soundByte - CREATE - post - '/'
router.post("/", verifyToken, async (req, res) => {
  try {
    req.body.author = req.user._id;
    const sByte = await SoundByte.create(req.body);
    sByte._doc.author = req.user;
    res.status(201).json(hoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//index of soundBytes - READ - get - '/'
router.get("/", verifyToken, async (req, res) => {
    try {
    const sBytes = await SoundByte.find({})
      .populate("author")
      .sort({ createdAt: "desc" });
    res.status(200).json(sBytes);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//show soundByte - READ - get - /:sByteId
router.get("/:sByteId", verifyToken, async (req, res) => {
  try {
    const sByte = await SoundByte.findById(req.params.hootId).populate("author");
    res.status(200).json(hoot);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//edit  soundByte - UPDATE -  put - /:sByteId
router.put("/:sByteId", verifyToken, async (req, res) => {
  try {
    // Find the sByte:
    const sByte = await SoundByte.findById(req.params.sByteId);
    // Check permissions:
    if (!sByte.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }
    // Update sByte:
    const updatedSoundByte = await SoundByte.findByIdAndUpdate(
      req.params.sByteId,
      req.body,
      { new: true }
    );
    // Append req.user to the author property:
    updatedSoundByte._doc.author = req.user;
    // Issue JSON response:
    res.status(200).json(updatedSoundByte);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//delete soundByte - DELETE -  delete - /:sByteId
router.delete("/:sByteId", verifyToken, async (req, res) => {
  try {
    const sByte = await SoundByte.findById(req.params.sByteId);

    if (!sByte.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const deletedSoundByte = await SoundByte.findByIdAndDelete(req.params.sByteId);
    res.status(200).json(deletedSoundByte);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;