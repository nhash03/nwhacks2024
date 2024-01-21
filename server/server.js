const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const Tesseract = require('tesseract.js');

const app = express();
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT || 8080;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'build')));


app.post('/api/analyze', upload.single('image'), (req, res) => {
  const text = req.body.text;
  const image = req.file;
  const imageBuffer = req.file.buffer;

  Tesseract.recognize(
    imageBuffer,
    'eng', 
    { logger: info => console.log(info) } 
    ).then(({ data: { text } }) => {
    console.log('Extracted Text:', text);
    res.status(200).json({ success: true, message: text});
    }).catch(error => {
    console.error('Error extracting text:', error);
    res.status(500).json({ success: false, message: 'Error extracting text from the image' });
  });

  
});

// Send all other requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
