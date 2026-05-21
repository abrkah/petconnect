import { memoryStorage } from 'multer';
import { PET_PHOTO_ERROR_PREFIX } from '../../common/multer-exception.filter';

const EXT_OK = /\.(jpe?g|png|gif|webp|heic|heif)$/i;
const MIME_OK =
  /^image\/(jpe?g|pjpeg|png|gif|webp|heic|heif|x-icon)$/i;

export function isAllowedPetPhoto(file: Express.Multer.File): boolean {
  const mime = (file.mimetype || '').toLowerCase();
  const name = (file.originalname || '').toLowerCase();
  if (MIME_OK.test(mime)) return true;
  if (EXT_OK.test(name)) return true;
  if (
    (mime === 'application/octet-stream' || mime === '') &&
    EXT_OK.test(name)
  ) {
    return true;
  }
  return false;
}

export const petPhotoUploadOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    _req: unknown,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!isAllowedPetPhoto(file)) {
      cb(
        new Error(
          `${PET_PHOTO_ERROR_PREFIX}Unsupported image type "${file.mimetype}". Use JPEG, PNG, GIF, WebP, or HEIC.`,
        ),
        false,
      );
      return;
    }
    cb(null, true);
  },
};
