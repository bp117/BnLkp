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
app.post('/summarize', (req, res) => {
    const { text } = req.body;
    
    // Here, you'd typically process the text and generate a summary.
    // For the sake of this example, we'll return a mock response.

    res.json({
        response: {
            duration: "677 ms",
            result: {
                context: text,
                book: "Mock Book",
                section_title: "Mock Section",
                hyperlink: "http://mocklink/",
                generated_resp: "This is a mock summarized response."
            }
        }
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
