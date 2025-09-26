const express = require('express');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const app = express();
const photosDir = path.join(__dirname, 'photos');

// Serve static files
app.use('/photos', express.static(photosDir));
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for photos (newest first)
app.get('/api/photos', (req, res) => {
  const files = fs.readdirSync(photosDir)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .map(f => {
      const stats = fs.statSync(path.join(photosDir, f));
      return { url: `/photos/${f}`, time: stats.mtime };
    })
    .sort((a,b) => b.time - a.time); // newest first
  res.json(files);
});

// Optional: watch for new files (for logging or future live update)
chokidar.watch(photosDir).on('all', (event, path) => {
  console.log(`Photo folder changed: ${event} ${path}`);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
