import api, { API_ENABLED, mockDelay } from './api';
import { getYouTubeVideoId } from '../lib/youtube';

/**
 * YouTube video CMS data access layer.
 *   GET    /api/videos       — public: list videos (newest first)
 *   POST   /api/videos       — admin: add a video URL
 *   DELETE /api/videos/:id   — admin: remove a video
 */
const STORAGE_KEY = 'cj_videos';

function mapVideoFromApi(v) {
  if (!v) return v;
  return {
    id: v.id,
    url: v.url,
    videoId: getYouTubeVideoId(v.url),
    createdAt: v.createdAt,
  };
}

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore malformed storage */
  }
  return [];
}

function writeStore(videos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
}

export async function getVideos() {
  if (API_ENABLED) {
    const { data } = await api.get('/api/videos');
    return (data?.data || []).map(mapVideoFromApi);
  }
  if (import.meta.env.DEV) {
    await mockDelay(300);
    return readStore().map(mapVideoFromApi);
  }
  return [];
}

export async function createVideo(url) {
  if (API_ENABLED) {
    const { data } = await api.post('/api/videos', { url });
    return mapVideoFromApi(data?.data);
  }
  if (import.meta.env.DEV) {
    await mockDelay(400);
    const video = {
      id: `vid-${Date.now()}`,
      url: url.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [video, ...readStore()];
    writeStore(next);
    return mapVideoFromApi(video);
  }
  throw new Error('Videos are read-only in this environment');
}

export async function deleteVideo(id) {
  if (API_ENABLED) {
    const { data } = await api.delete(`/api/videos/${id}`);
    return data;
  }
  if (import.meta.env.DEV) {
    await mockDelay(300);
    const next = readStore().filter((v) => v.id !== id);
    writeStore(next);
    return { success: true, id };
  }
  throw new Error('Videos are read-only in this environment');
}
