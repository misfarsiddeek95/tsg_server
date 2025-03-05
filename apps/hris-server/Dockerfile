FROM docker.io/node:16.13.2

WORKDIR /app

COPY dist/apps/hris-server hris-server
COPY prisma hris-server/prisma

RUN npm -g config set user root && npm -g install prisma
RUN cd hris-server && yarn
RUN cd hris-server && prisma generate

RUN useradd -m myuser
USER myuser

CMD [ "node", "hris-server/main.js" ]