/**
 * Build-time script: processes CSV exports into JSON for the React app.
 * Phase 1 placeholder — full implementation in Phase 2.
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const dataDir = join(import.meta.dirname, '..', 'src', 'data')
mkdirSync(dataDir, { recursive: true })

// Placeholder empty data so the app builds
writeFileSync(join(dataDir, 'cds.json'), '[]')
writeFileSync(join(dataDir, 'dvds.json'), '[]')
writeFileSync(join(dataDir, 'stats.json'), '{}')

console.log('Data prepared (placeholder).')
