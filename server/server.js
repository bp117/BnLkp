const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
// Middleware to parse JSON requests
app.use(bodyParser.json());

// POST endpoint for chat
app.post('/chat', (req, res) => {
    const { query, corpus_name } = req.body;

    // You can add logic here to generate a response based on the query and corpus_name

    const response = {
        response: {
            result: [
                {
                    context: "fsjdfhsdjfhs",
                    book: "sdhfjsdh",
                    section_title: "dfd",
                    hyperlink: "http://sdfd/",
                    generated_resp: "sdfdsfdsfdsds"
                },
                {
                    context: "fsjdfhsdjfhs",
                    book: "sdhfjsdh",
                    section_title: "dfd",
                    hyperlink: "http://sdfd/",
                    generated_resp: "sdfdsfdsfdsds"
                }
            ]
        }
    };

    res.json(response);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
