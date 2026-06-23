/**
 * Video controller — YouTube URL CMS.
 *  - Public:  list videos (newest first).
 *  - Admin:   create / delete.
 */
import prisma from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { getYouTubeVideoId } from '../utils/youtube.js';

// POST /api/videos  (admin)
export const createVideo = asyncHandler(async (req, res) => {
  const url = String(req.body.url || '').trim();

  if (!getYouTubeVideoId(url)) {
    throw ApiError.badRequest('Validation failed', { url: 'Enter a valid YouTube URL' });
  }

  const video = await prisma.video.create({ data: { url } });
  res.status(201).json({ success: true, data: video });
});

// GET /api/videos  (public)
export const getVideos = asyncHandler(async (_req, res) => {
  const videos = await prisma.video.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ success: true, count: videos.length, data: videos });
});

// DELETE /api/videos/:id  (admin)
export const deleteVideo = asyncHandler(async (req, res) => {
  const existing = await prisma.video.findUnique({ where: { id: req.params.id } });
  if (!existing) throw ApiError.notFound('Video not found');

  await prisma.video.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Video deleted', id: req.params.id });
});
