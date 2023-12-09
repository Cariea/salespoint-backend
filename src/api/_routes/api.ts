import { Router } from 'express'

export const router = Router()

// Test endpoint
router.get('/ping', (_req, res) => {
  res.status(200).json({ test: 'todo piola' })
})
