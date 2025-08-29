import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { UpdateUserUseCase } from '../../../use-cases/user/update-user.js';

export async function updateUserController(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ id: z.string().min(1) });
  const bodySchema = z.object({
    nome: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.enum(['MASTER','ADMIN','OPERADOR','PROFESSOR']).optional(),
    senha: z.string().min(6).optional(),
  });

  const { id } = paramsSchema.parse(req.params);
  const body = bodySchema.parse(req.body);

  if (
    body.nome === undefined &&
    body.email === undefined &&
    body.role === undefined &&
    body.senha === undefined
  ) {
    return reply.status(400).send({ message: 'Nenhuma alteração enviada.' });
  }

  const useCase = new UpdateUserUseCase((req as any).usersRepo ?? undefined as any);

  const payload: { id: string } & Partial<{ nome: string; email: string; role: 'MASTER'|'ADMIN'|'OPERADOR'|'PROFESSOR'; senha: string }> = { id };
  if (body.nome !== undefined) payload.nome = body.nome;
  if (body.email !== undefined) payload.email = body.email;
  if (body.role !== undefined) payload.role = body.role;
  if (body.senha !== undefined) payload.senha = body.senha;

  const { user } = await useCase.execute(payload);
  return reply.send({ user });
}
