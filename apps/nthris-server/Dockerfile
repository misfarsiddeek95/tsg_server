FROM docker.io/node:16.13.2

WORKDIR /app

COPY dist/apps/nthris-server nthris-server
COPY prisma nthris-server/prisma

RUN npm -g config set user root && npm -g install prisma
RUN cd nthris-server && yarn
RUN cd nthris-server && prisma generate

RUN useradd -m myuser
USER myuser

CMD [ "node", "nthris-server/main.js" ]