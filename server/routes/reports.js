const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Report = require('../models/Report'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

router.post('/upload', upload.single('report'), async (req, res) => {
  try {
    const { patientId, doctorName } = req.body;
    const newReport = new Report({
      patientId,
      doctorName,
      fileName: req.file.originalname,
      filePath: req.file.path
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) { res.status(500).json({ msg: 'Upload failed' }); }
});

router.get('/all', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) { res.status(500).json({ msg: 'Server Error' }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Report deleted successfully' });
  } catch (err) { res.status(500).json({ msg: 'Delete failed' }); }
});

module.exports = router;