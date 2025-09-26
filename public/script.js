const rows = [
  document.querySelector('.row-top'),
  document.querySelector('.row-middle'),
  document.querySelector('.row-bottom')
];

const preview = document.getElementById('preview');
let activeThumbnail = null;

async function loadPhotos() {
  try {
    const res = await fetch('/api/photos');
    const photos = await res.json();

    // Get the gallery container
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Clear existing rows

    // Create rows with 6 images each
    for (let i = 0; i < photos.length; i += 6) {
      const row = document.createElement('div');
      row.className = 'row';
      const rowPhotos = photos.slice(i, i + 6);

      rowPhotos.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.url;
        img.className = 'thumbnail';
        row.appendChild(img);

        // Hover preview logic
        img.addEventListener('mouseenter', e => {
          activeThumbnail = img;
          preview.src = photo.url;
          preview.style.display = 'block';
          positionPreview(e);
        });

        img.addEventListener('mousemove', e => {
          if (activeThumbnail === img) positionPreview(e);
        });

        img.addEventListener('mouseleave', () => {
          preview.style.display = 'none';
          activeThumbnail = null;
        });
      });

      gallery.appendChild(row);
    }
  } catch (err) {
    console.error('Failed to load photos:', err);
  }
}



function positionPreview(e) {
  const padding = 20;
  let x = e.clientX + padding;
  let y = e.clientY + padding;

  const rect = preview.getBoundingClientRect();
  if (x + rect.width > window.innerWidth) x = e.clientX - rect.width - padding;
  if (y + rect.height > window.innerHeight) y = e.clientY - rect.height - padding;
  if (x < 0) x = 0;
  if (y < 0) y = 0;

  preview.style.left = x + 'px';
  preview.style.top = y + 'px';
}

// Initial load
loadPhotos();

// Optional: auto-refresh every 10s to catch new images
setInterval(loadPhotos, 10000);
