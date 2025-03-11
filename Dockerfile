FROM ghcr.io/puppeteer/puppeteer:24.4.0
# ENV PUPPETEER_SKIP_DOWNLOAD true

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn*.lock ./

RUN yarn install --frozen-lockfile
# CMD ["ls", '/usr/bin']
COPY . .
CMD [ "node", "app.js" ]