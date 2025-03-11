FROM ghcr.io/puppeteer/puppeteer:24.4.0
ENV PUPPETEER_SKIP_DOWNLOAD true

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "node", "index.js" ]