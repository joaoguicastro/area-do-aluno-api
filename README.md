# 1) entrar na VPS
ssh root@SEU_SERVIDOR

# 2) ir até a pasta do backend
cd /srv/app/area-do-aluno-api/area-do-aluno-api

# 3) pegar as últimas mudanças do Git
git fetch --all
git reset --hard origin/main   # troque 'main' se seu branch for outro

# 4) (opcional) ver difs rápidos
git log --oneline -5
git status

# 5) rebuild/pull da imagem e subir
# Se você COMPILA a imagem na VPS:
docker compose -f docker-compose.prod.yml build --no-cache api
# Se você PULLA uma imagem do registry:
# docker compose -f docker-compose.prod.yml pull api

docker compose -f docker-compose.prod.yml up -d api

# 6) aplicar migrations do Prisma (dentro do container)
docker compose -f docker-compose.prod.yml run --rm api npx prisma generate
docker compose -f docker-compose.prod.yml run --rm api npx prisma migrate deploy

# 7) checar logs
docker compose -f docker-compose.prod.yml logs -n 100 -f api

# 8) (opcional) health check rápido
curl -s http://127.0.0.1:3333/__debug/whoami || true