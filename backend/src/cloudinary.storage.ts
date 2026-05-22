import { v2 as cloudinary } from 'cloudinary';
import type { StorageEngine } from 'multer';
import type { Request } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryStorage implements StorageEngine {
  constructor(private readonly folder: string) {}

  _handleFile(
    _req: Request,
    file: Express.Multer.File & { stream: NodeJS.ReadableStream },
    cb: (error?: Error | null, info?: Partial<Express.Multer.File>) => void,
  ) {
    const stream = cloudinary.uploader.upload_stream(
      { folder: this.folder, resource_type: 'image' },
      (err, result) => {
        if (err || !result) return cb(err ?? new Error('Cloudinary upload failed'));
        cb(null, { path: result.secure_url, filename: result.public_id, size: result.bytes });
      },
    );
    file.stream.pipe(stream);
  }

  _removeFile(
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null) => void,
  ) {
    if (file.filename) {
      cloudinary.uploader.destroy(file.filename, (err) => cb(err ?? null));
    } else {
      cb(null);
    }
  }
}
