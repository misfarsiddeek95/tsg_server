FROM docker.io/node:16.13.2

WORKDIR /app

COPY dist/apps/ams-server ams-server
COPY prisma ams-server/prisma

RUN npm -g config set user root && npm -g install prisma
RUN cd ams-server && yarn
RUN cd ams-server && prisma generate

RUN useradd -m myuser
USER myuser

CMD [ "node", "ams-server/main.js" ]