// ══════════════════════════════════════════
// NASA API Hooks
// Junior Astronaut Mission Trainer
// ══════════════════════════════════════════

const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
const BASE    = 'https://api.nasa.gov';
const IMG_LIB = 'https://images-api.nasa.gov';

// ── APOD — Astronomy Picture of the Day ──────────────────────────────
export async function fetchAPOD(date = null) {
  try {
    const params = new URLSearchParams({ api_key: API_KEY });
    if (date) params.append('date', date);
    const res  = await fetch(`${BASE}/planetary/apod?${params}`);
    if (!res.ok) throw new Error('APOD fetch failed');
    const data = await res.json();
    // Only use image type (not video)
    if (data.media_type !== 'image') return null;
    return { url: data.hdurl || data.url, title: data.title, explanation: data.explanation, date: data.date };
  } catch (err) {
    console.warn('[NASA] APOD error:', err.message);
    return null;
  }
}

// ── Random APOD from past 365 days ──────────────────────────────────
export async function fetchRandomAPOD(count = 5) {
  try {
    const params = new URLSearchParams({ api_key: API_KEY, count: String(count) });
    const res    = await fetch(`${BASE}/planetary/apod?${params}`);
    if (!res.ok) throw new Error('Random APOD fetch failed');
    const data   = await res.json();
    // Filter to images only
    const images = data.filter((d) => d.media_type === 'image');
    return images.map((d) => ({ url: d.hdurl || d.url, title: d.title, explanation: d.explanation, date: d.date }));
  } catch (err) {
    console.warn('[NASA] Random APOD error:', err.message);
    return [];
  }
}

// ── Mars Rover Photos — Curiosity ───────────────────────────────────
export async function fetchMarsRoverPhotos(sol = 1000, camera = null) {
  try {
    const params = new URLSearchParams({ api_key: API_KEY, sol: String(sol) });
    if (camera) params.append('camera', camera);
    const res  = await fetch(`${BASE}/mars-photos/api/v1/rovers/curiosity/photos?${params}`);
    if (!res.ok) throw new Error('Mars rover fetch failed');
    const data = await res.json();
    return (data.photos || []).slice(0, 10).map((p) => ({
      url:       p.img_src,
      camera:    p.camera.full_name,
      sol:       p.sol,
      earthDate: p.earth_date,
    }));
  } catch (err) {
    console.warn('[NASA] Mars Rover error:', err.message);
    return [];
  }
}

// ── NASA Image & Video Library ───────────────────────────────────────
export async function fetchNASAImages(query, maxResults = 6) {
  try {
    const params = new URLSearchParams({ q: query, media_type: 'image' });
    const res    = await fetch(`${IMG_LIB}/search?${params}`);
    if (!res.ok) throw new Error('Image Library fetch failed');
    const data   = await res.json();
    const items  = (data.collection?.items || []).slice(0, maxResults);
    return items.map((item) => ({
      url:         item.links?.[0]?.href,
      title:       item.data?.[0]?.title,
      description: item.data?.[0]?.description,
      nasa_id:     item.data?.[0]?.nasa_id,
    })).filter((i) => i.url);
  } catch (err) {
    console.warn('[NASA] Image Library error:', err.message);
    return [];
  }
}

// ── EPIC — Earth Polychromatic Imaging Camera ────────────────────────
export async function fetchEPICImage() {
  try {
    const res  = await fetch(`${BASE}/EPIC/api/natural?api_key=${API_KEY}`);
    if (!res.ok) throw new Error('EPIC fetch failed');
    const data = await res.json();
    if (!data.length) return null;
    const img  = data[0];
    // Build the EPIC image URL
    const [year, month, day] = img.date.split(' ')[0].split('-');
    const url = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${img.image}.png`;
    return { url, caption: img.caption, date: img.date };
  } catch (err) {
    console.warn('[NASA] EPIC error:', err.message);
    return null;
  }
}
