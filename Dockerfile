FROM node:20-alpine

WORKDIR /app
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci

COPY . /app

# dummy DB URL
ENV DATABASE_URL=file:dummy.db
RUN npm run dbsetup
ENV DATABASE_URL=""

ENTRYPOINT ["npm", "run", "start"]
