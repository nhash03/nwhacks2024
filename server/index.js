// // import express from 'express';
// // import * as dotenv from 'dotenv';
// // import cors from 'cors';
// // import bodyParser from 'body-parser';
// // import multer from 'multer';
// // import Tesseract from 'tesseract.js';

// // dotenv.config();

// const express = require('express');
// const multer = require('multer');
// const bodyParser = require('body-parser');
// const Tesseract = require('tesseract.js');


// const app = express();
// // const bodyParser = bodyParser();
// // const Tesseract = Tesseract();

// // app.use(cors())
// app.use(express.json({limit: "50mb"}))

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// app.get('/', (req, res) => {
//     res.status(200).json({message: "Hello"})
// })


// app.post('/upload', upload.single('file'), async (req, res) => {
//     console.log('entered post')
//   try {
//     const imageBuffer = req.file.buffer;

//     // Use Tesseract.js to extract text
//     const { data: { text } } = await Tesseract.recognize(
//       imageBuffer,
//       'eng', // Specify the language
//       { logger: info => console.log(info) } 
//     );

//     console.log('Extracted Text:', text);

//     res.status(200).json({ success: true, message: 'File uploaded and text extracted successfully' });
//   } catch (error) {
//     console.error('Error extracting text:', error);
//     res.status(500).json({ success: false, message: 'Error extracting text from the image' });
//   }
// });

// app.listen(5173, ()=> console.log('server started'))
import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import createWorker from 'tesseract.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello' });
});

app.post('/upload', upload.single('file'), async (req, res) => {
    console.log('entered post');
    try {
        const imageBuffer = req.file.buffer;

        // Use Tesseract.js to extract text
        // const { data: { text } } = await Tesseract.recognize(
        //     imageBuffer,
        //     'eng', // Specify the language
        //     { logger: info => console.log(info) }
        // );
        const worker = await createWorker('eng');
        (async () => {
        const { data: { text } } = await worker.recognize(imageBuffer);
        console.log(text);
        await worker.terminate();
        })();

        console.log('Extracted Text:', text);

        res.status(200).json({ success: true, message: 'File uploaded and text extracted successfully' });
    } catch (error) {
        console.error('Error extracting text:', error);
        res.status(500).json({ success: false, message: 'Error extracting text from the image' });
    }
});

app.listen(5173, () => console.log('server started'));
