FROM docker.io/node:16.13.2

WORKDIR /app

COPY dist/apps/gra-server gra-server
COPY prisma gra-server/prisma

RUN npm -g config set user root && npm -g install prisma
RUN cd gra-server && yarn
RUN cd gra-server && prisma generate

RUN useradd -m myuser
USER myuser

CMD [ "node", "gra-server/main.js" ]