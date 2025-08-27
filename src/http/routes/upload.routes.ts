// src/http/routes/upload.routes.ts
import type { FastifyInstance } from 'fastify';
import '@fastify/multipart'; 
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { pipeline } from 'node:stream/promises'; 

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/uploads/video',  async (req, reply) => {
    const data = await req.file();
    if (!data) {
      return reply.status(400).send({ message: 'Arquivo não enviado' });
    }

    const allowed = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!allowed.includes(data.mimetype)) {
      return reply.status(400).send({ message: 'Tipo de arquivo não suportado' });
    }

    const ext = path.extname(data.filename) || '.mp4';
    const name = crypto.randomBytes(16).toString('hex') + ext;
    const target = path.join(process.cwd(), 'uploads', 'videos', name);

    await fs.promises.mkdir(path.dirname(target), { recursive: true });

    const writeStream = fs.createWriteStream(target);
    await pipeline(data.file, writeStream); 

    const url = `/uploads/videos/${name}`;
    return reply.code(201).send({ url });
  });
}
