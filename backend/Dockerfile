FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Install MySQL client
RUN apk add --no-cache mysql-client bash netcat-openbsd

COPY . .

RUN chmod +x wait-for-mysql.sh

CMD ["./wait-for-mysql.sh", "mysql", "npm", "start"]

