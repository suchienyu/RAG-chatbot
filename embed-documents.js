require('dotenv').config();

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
const { OpenAI } = require('openai');
const { Client } = require('pg');



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});

async function storeEmbeddings() {
    await client.connect();

    const documents = [
        'First document content',
        'Second document content',
        // Add more documents here
    ];

    for (let content of documents) {
        const embedding = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: content,
        });

        await client.query(
            'INSERT INTO documents (content, embedding) VALUES ($1, $2)',
            [content, embedding.data[0].embedding]
        );
    }

    await client.end();
}

storeEmbeddings();
