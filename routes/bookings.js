const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

module.exports = bookingsCollection => {
  // GET bookings by user email
  router.get('/user/:email', async (req, res) => {
    try {
      const bookings = await bookingsCollection
        .find({ studentEmail: req.params.email })
        .toArray();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // POST create booking
  router.post('/', async (req, res) => {
    try {
      const booking = {
        ...req.body,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      const result = await bookingsCollection.insertOne(booking);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH cancel booking
  router.patch('/:id/cancel', async (req, res) => {
    try {
      const result = await bookingsCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status: 'cancelled' } },
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};
