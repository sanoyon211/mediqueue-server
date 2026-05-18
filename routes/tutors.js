const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = tutorsCollection => {
  // GET all tutors (with search & filter)
  router.get('/', async (req, res) => {
    try {
      const { search, startDate, endDate, limit } = req.query;
      let query = {};

      // Search by tutor name
      if (search) {
        query.tutorName = { $regex: search, $options: 'i' };
      }

      // Filter by date range
      if (startDate || endDate) {
        query.sessionStartDate = {};
        if (startDate) query.sessionStartDate.$gte = startDate;
        if (endDate) query.sessionStartDate.$lte = endDate;
      }

      const tutors = await tutorsCollection
        .find(query)
        .limit(limit ? parseInt(limit) : 0)
        .toArray();

      res.json(tutors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single tutor
  router.get('/:id', async (req, res) => {
    try {
      const tutor = await tutorsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      if (!tutor) {
        return res.status(404).json({ message: 'Tutor not found' });
      }
      res.json(tutor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET tutors by user email
  router.get('/user/:email', async (req, res) => {
    try {
      const tutors = await tutorsCollection
        .find({ userEmail: req.params.email })
        .toArray();
      res.json(tutors);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // POST create tutor
  router.post('/', async (req, res) => {
    try {
      const tutor = {
        ...req.body,
        createdAt: new Date().toISOString(),
      };
      const result = await tutorsCollection.insertOne(tutor);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // PUT update tutor
  router.put('/:id', async (req, res) => {
    try {
      const { _id, ...updateData } = req.body;
      const result = await tutorsCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: updateData },
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH decrease slot
  router.patch('/:id/decrease-slot', async (req, res) => {
    try {
      const tutor = await tutorsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });

      if (!tutor) {
        return res.status(404).json({ message: 'Tutor not found' });
      }

      if (tutor.totalSlot <= 0) {
        return res.status(400).json({ message: 'No slots available' });
      }

      const result = await tutorsCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $inc: { totalSlot: -1 } },
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // DELETE tutor
  router.delete('/:id', async (req, res) => {
    try {
      const result = await tutorsCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};
