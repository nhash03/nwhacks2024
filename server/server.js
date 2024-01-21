const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const Tesseract = require('tesseract.js');
const xlsx = require('xlsx');
const axios = require('axios').default;
const admin = require('firebase-admin');

const app = express();
app.use(express.json())
app.use(cors())
const PORT = process.env.PORT || 8080;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'build')));

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const users = [
  { id: 1, token: 'user_token_1', location: { latitude: 37.7749, longitude: -122.4194 } },
  // Add more users...
];

app.post('/notify', (req, res) => {
  const { location } = req.body;

  // Identify nearby users (simplified algorithm)
  const nearbyUsers = users.filter(user => {
    const distance = calculateDistance(location, user.location);
    return distance <= 5; // Assume users within 5 km are nearby
  });

  // Send notifications to nearby users
  sendNotifications(nearbyUsers);

  res.json({ success: true, message: 'Emergency notification sent.' });
});

function calculateDistance(location1, location2) {
  // Simplified distance calculation using Euclidean distance formula
  const latDiff = location1.latitude - location2.latitude;
  const lonDiff = location1.longitude - location2.longitude;
  return Math.sqrt(latDiff ** 2 + lonDiff ** 2);
}

function sendNotifications(users) {
  const registrationTokens = users.map(user => user.token);

  const message = {
    notification: {
      title: 'Emergency Notification',
      body: 'Someone nearby needs help!',
    },
    tokens: registrationTokens,
  };

  admin.messaging().sendMulticast(message)
    .then(response => {
      console.log('Successfully sent emergency notification:', response);
    })
    .catch(error => {
      console.error('Error sending emergency notification:', error);
    });
}

app.post('/api/analyze', upload.single('image'), async (req, res) => {
  const text = req.body.text;
  const image = req.file;
  const imageBuffer = req.file.buffer;

  result = await Tesseract.recognize(
    imageBuffer,
    'eng', 
    { logger: info => console.log(info) } 
    ).then(({ data: { text } }) => {
    console.log('Extracted Text:', 'text');
    return text;
    // res.status(200).json({ success: true, message: text});
    }).catch(error => {
    console.error('Error extracting text:', error);
    return null;
    // res.status(500).json({ success: false, message: 'Error extracting text from the image' });
  });

  console.log("HI")

  if (result === null) {
    res.status(500).json({ success: false, message: 'Error extracting text from the image' });
  } else {
    console.log("SENDING DATA\n")
    await axios.post("https://weakbsbs523kbyckuk67sfjjqe0qflck.lambda-url.us-east-2.on.aws/", {
      data: result
    })
    .then(response => {
      console.log(response.data.body)
      res.status(200).json({ success: true, message: JSON.parse(response.data.body).message, hilo: JSON.parse(response.data.body).hilo });
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ success: false, message: 'Error extracting text from the image' });
    })
  }
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

    var conflictingPairs = 'WARNING: There is a possible drug interferenece between ';
    console.log('drug list', drug_list)
    drug_list.forEach((drug) => {
        if (conflicts[drug]) {
            conflicts[drug].forEach((conflictingDrug) => {
                if (drug_list.includes(conflictingDrug)){
                conflictingPairs += drug +' and '+ conflictingDrug + '-';}
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

        const conflictingDrugs = Object.keys(row).filter((key) => key !== 'drug name ' && row[key] && (row[key]!=='-1')&&(key == 'Food interaction' || key == 'Food interaction 2' || key == 'Food interaction 3' || key == 'Food interference 4' )).map((key) => row[key]);
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
