import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (request, response) => {
  return response.json({ ok: true });
});

app.listen(4444, () => console.log('Server stating on port 4444.'));
