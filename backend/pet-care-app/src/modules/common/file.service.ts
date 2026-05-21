import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UPLOADS_ROOT } from '../../common/uploads-path';

@Injectable()
export class FileService {
  private baseDir = UPLOADS_ROOT;

  constructor() {
    this.ensureDirectoryExists(this.baseDir);
  }

  private ensureDirectoryExists(dir: string) {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (error) {
        throw new InternalServerErrorException('Failed to create directory');
      }
    }
  }

  public saveFile(file: Express.Multer.File, folder: string): string {
    const folderPath = path.join(this.baseDir, folder);
    this.ensureDirectoryExists(folderPath);

    const safeOriginal = (file.originalname || 'photo')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    const uniqueFileName = `${uuidv4()}-${safeOriginal || 'photo'}`;
    const filePath = path.join(folderPath, uniqueFileName);

    try {
      fs.writeFileSync(filePath, file.buffer);
    } catch (error) {
      throw new InternalServerErrorException('Failed to save file');
    }

    return uniqueFileName; // Return only the filename, not full path
  }
}
