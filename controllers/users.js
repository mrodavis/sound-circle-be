const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const Track = require('../models/Track');

const User = require('../models/user');

router.get('/', verifyToken, async (req, res) => {
  try {
    // Get a list of all users, but only return their username and _id
    const users = await User.find({}, "username");

    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId){
      return res.status(403).json({ err: "Unauthorized"});
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ err: 'User not found.'});
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;

// ---------------- Playlist Endpoints ----------------

// GET /users/:userId/playlist
router.get('/:userId/playlist', verifyToken, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.userId)) {
      return res.status(403).json({ err: 'Unauthorized' });
    }
    const user = await User.findById(req.params.userId).populate('playlist');
    if (!user) return res.status(404).json({ err: 'User not found.' });
    res.json(user.playlist || []);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// POST /users/:userId/playlist  { trackId } or { track }
router.post('/:userId/playlist', verifyToken, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.userId)) {
      return res.status(403).json({ err: 'Unauthorized' });
    }
    const { trackId, track } = req.body || {};
    if (!trackId && !track) return res.status(400).json({ err: 'trackId or track required' });

    let id = trackId;
    if (!id && track) {
      // Best-effort create/find. Keep logic minimal; rely on Track uniqueness by key
      const { title, artist, coverArtUrl, soundClipUrl, sourceUrl, genre } = track;
      if (!title || !artist) return res.status(400).json({ err: 'title and artist are required' });
      // Attempt to find by simple match; if not found, create
      let t = await Track.findOne({ title, artist, soundClipUrl: soundClipUrl ?? null });
      if (!t) t = await Track.create({ title, artist, coverArtUrl, soundClipUrl, sourceUrl, genre });
      id = t._id;
    }

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ err: 'User not found.' });

    // Prevent duplicates, add to front
    const current = (user.playlist || []).map(String);
    if (!current.includes(String(id))) {
      user.playlist = [id, ...(user.playlist || [])];
      await user.save();
    }

    const updated = await User.findById(user._id).populate('playlist');
    res.status(201).json(updated.playlist || []);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// DELETE /users/:userId/playlist/:trackId
router.delete('/:userId/playlist/:trackId', verifyToken, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.userId)) {
      return res.status(403).json({ err: 'Unauthorized' });
    }
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ err: 'User not found.' });
    user.playlist = (user.playlist || []).filter((t) => String(t) !== String(req.params.trackId));
    await user.save();
    const updated = await User.findById(user._id).populate('playlist');
    res.json(updated.playlist || []);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});
