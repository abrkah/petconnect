import { join } from 'path';

/** Single uploads root (pet-care-app/uploads), used for save + static serve. */
export const UPLOADS_ROOT = join(process.cwd(), 'uploads');
