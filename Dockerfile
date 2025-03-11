FROM ghcr.io/puppeteer/puppeteer:24.4.0

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn*.lock ./

RUN yarn install --frozen-lockfile
# CMD ["ls", '/usr/bin']
COPY . .
CMD [ "node", "app.js" ]