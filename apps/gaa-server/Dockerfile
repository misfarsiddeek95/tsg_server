FROM docker.io/node:16.13.2

WORKDIR /app

COPY dist/apps/gaa-server gaa-server
COPY prisma gaa-server/prisma

RUN npm -g config set user root && npm -g install prisma
RUN cd gaa-server && yarn
RUN cd gaa-server && prisma generate

RUN useradd -m myuser
USER myuser

CMD [ "node", "gaa-server/main.js" ]