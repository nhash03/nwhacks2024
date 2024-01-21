const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const xlsx = require('xlsx');

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

app.post('/api/drug_conflict', (req, res) => {
    const drug_list = req.body.drug_list;
    const workbook = xlsx.readFile('./data/Datasets.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    const conflicts = {};
    jsonData.forEach((row) => {
        const mainDrug = row['drug name '];

        const conflictingDrugs = Object.keys(row).filter((key) => key !== 'drug name ' && row[key] && (key == 'drug interference 6' || key == 'drug interference 5' || key == 'drug interference 4' || key == 'drug interference 3' || key == 'drug interference 2' || key == 'drug intefernce' )).map((key) => row[key]);
        console.log(conflictingDrugs)
        if (conflictingDrugs.length > 0) {
            conflicts[mainDrug] = conflictingDrugs;
        }
    });

    var conflictingPairs = "";

    drug_list.forEach((drug) => {
        if (conflicts[drug]) {
            conflicts[drug].forEach((conflictingDrug) => {
                if (drug_list.includes(conflictingDrug)){
                conflictingPairs += 'WARNING: There is a possible drug interferenece between ' + drug+' and '+ conflictingDrug + '.\n';}
        });
        }
  });
    console.log(conflictingPairs)
    res.status(200).json({ success: true, message: conflictingPairs});
});

app.post('/api/food_conflict', (req, res) => {
    const drug_list = req.body.drug_list;
    const workbook = xlsx.readFile('./data/Datasets.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    const conflicts = {};
    jsonData.forEach((row) => {
        const mainDrug = row['drug name '];

        const conflictingDrugs = Object.keys(row).filter((key) => key !== 'drug name ' && row[key] && (key == 'Food interaction' || key == 'Food interaction 2' || key == 'Food interaction 3' || key == 'Food interference 4' )).map((key) => row[key]);
        console.log(conflictingDrugs)
        if (conflictingDrugs.length > 0) {
            conflicts[mainDrug] = conflictingDrugs;
        }
    });

    var conflictingPairs = "Possible Food Interferences:\n";

    drug_list.forEach((drug) => {
        if (conflicts[drug]) {
            conflictingPairs += 'There is a possible food interferenece between ' + drug+' and\n';
            conflicts[drug].forEach((conflictingDrug) => {
                conflictingPairs += "\t"+ conflictingDrug + "\n";
        });
        }
  });
    console.log(conflictingPairs)
    res.status(200).json({ success: true, message: conflictingPairs});
});

// Send all other requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
