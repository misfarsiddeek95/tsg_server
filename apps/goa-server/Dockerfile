FROM docker.io/node:16.13.2

WORKDIR /app

COPY dist/apps/goa-server goa-server
COPY prisma goa-server/prisma

RUN npm -g config set user root && npm -g install prisma@4.13.0
RUN cd goa-server && yarn
RUN cd goa-server && prisma generate

RUN useradd -m myuser
USER myuser

CMD [ "node", "goa-server/main.js" ]