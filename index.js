const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const CsvUpload = require("express-fileupload");
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
const port = process.env.PORT || 4002;

app.use(CsvUpload());

app.get('/', (req, res) => {
    res.send({ exampleMessage: "Connected!" });
})

app.post('/uploadCSV',  (req, res) => {
    if (req.files) {
        // сохраняем файл в директорию (временно)
        const uploadedFile = req.files.file;
        const uploadPath = __dirname
            + "/data/OriginalFiles/" + 'originalFile.csv';
        uploadedFile.mv(uploadPath);

        const csvData = req.files.file.data.toString('utf8');

        if (csvData.length > 0) {
            const nameOfColumns = csvData.replace(/(\r)/gm, "").split('\n')[0];

            res.send({ csvColumns: nameOfColumns.split(',')});
        } else {
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
});

app.post('/getColumnsNames', (req, res) => {
    // Мок заголовков таблицы
    const names = ['Имя', 'Должность', 'Руководитель', 'Отпуск', 'Отдел', 'День Рождения'];

    res.status(200).send({ bdNames: names });
});

app.post('/sendNewOrder', (req, res) => {
    if (req.body.data) {
        // новый порядок после матчинга на фронте
        const currentOrder = req.body.data;
        const array = fs.readFileSync(__dirname
            + "/data/OriginalFiles/" + 'originalFile.csv').toString().replace(/(\r)/gm, "").split("\n");
        const resultLines = [];

        // на основе оригинального фалйа создается новый с нужными данными
        for (let i = 1; i < array.length; i++) {
            const resultWords = [];
            const wordsSet = array[i].split(',');

            currentOrder.forEach((position) => {
                if (wordsSet[position]) {
                    resultWords.push(wordsSet[position]);
                } else {
                    resultWords.push(' ');
                }
            });

            resultLines.push(resultWords.join(',') + '\r');
        }

        fs.writeFileSync(__dirname + "/NewFiles/" + 'newFile.csv', resultLines.join(''));

        console.log('resultLines', resultLines);

        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})