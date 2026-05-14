import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dbPath = path.join(process.cwd(), 'feedback.json');

// Initialize if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({
    bugs: [],
    features: [],
    polish: []
  }, null, 2));
}

app.get('/api/feedback', (req, res) => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read feedback' });
  }
});

app.post('/api/feedback', (req, res) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

app.listen(PORT, () => {
  console.log(`Kaizen Launch Planner API running on http://localhost:${PORT}`);
});
