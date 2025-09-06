Paths (ajuste se necessário)

API

repo: /srv/app/area-do-aluno-api/area-do-aluno-api

compose file: docker-compose.prod.yml

health: https://api.infinitycurso.com.br/__debug/whoami

WEB

repo: /srv/app/area-do-aluno-web/area-do-aluno-web

webroot (Nginx): /var/www/aluno.infinitycurso.com.br/html

0) Pré-requisitos (uma vez)

Docker & Docker Compose instalados.

Nginx + certificados válidos para os domínios.

.env somente no servidor (não versionar) em
/srv/app/area-do-aluno-api/area-do-aluno-api/.env, por exemplo:

NODE_ENV=production
PORT=3333

DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
JWT_SECRET="troque-este-segredo-grande"

CORS_ALLOWED_ORIGINS=https://aluno.infinitycurso.com.br

MAX_UPLOAD_MB=200
UPLOAD_DIR=/srv/app/uploads


Crie e dê permissão à pasta de uploads:

sudo mkdir -p /srv/app/uploads
sudo chown -R $USER:$USER /srv/app/uploads


Nginx da API não deve forçar headers CORS (deixe a API cuidar disso).

Migrations: toda mudança de schema deve vir com uma migration criada em DEV.

1) Backup rápido do banco (recomendado antes de cada deploy)

Ajuste host, user e db.

mkdir -p /srv/backups
pg_dump -Fc -h 127.0.0.1 -U <DB_USER> <DB_NAME> > /srv/backups/aluno_$(date +%F_%H%M).dump
# Para restaurar (referência):
# pg_restore -c -h 127.0.0.1 -U <DB_USER> -d <DB_NAME> /srv/backups/ARQ.dump

2) Deploy API (toda vez que for atualizar)

Entrar no servidor e ir ao projeto

ssh root@SEU_SERVIDOR
cd /srv/app/area-do-aluno-api/area-do-aluno-api


Atualizar código

git fetch --all
git reset --hard origin/main     # troque 'main' se usar outra branch


Rebuild e subir container

docker compose -f docker-compose.prod.yml build --pull --no-cache api
docker compose -f docker-compose.prod.yml up -d --remove-orphans api


Prisma (rodar dentro de container efêmero)

docker compose -f docker-compose.prod.yml run --rm api npx prisma generate
docker compose -f docker-compose.prod.yml run --rm api npx prisma migrate deploy


migrate deploy aplica apenas migrations existentes; não apaga dados.

Checagem

docker compose -f docker-compose.prod.yml logs -n 100 -f api
curl -s https://api.infinitycurso.com.br/__debug/whoami | jq . || true

Preflight CORS (se mexeu em CORS)
curl -i -X OPTIONS https://api.infinitycurso.com.br/auth/login \
  -H "Origin: https://aluno.infinitycurso.com.br" \
  -H "Access-Control-Request-Method: POST"

Rollback rápido (API)
cd /srv/app/area-do-aluno-api/area-do-aluno-api
git reflog --date=iso
git reset --hard <COMMIT_ANTERIOR>

docker compose -f docker-compose.prod.yml build --no-cache api
docker compose -f docker-compose.prod.yml up -d api


Banco: evite “desmigrar” em produção. Se necessário, faça uma hotfix migration que corrija o schema adiante.