FROM node:20

WORKDIR /app

# Copy package files first
COPY package*.json ./

RUN npm install

# Copy ALL backend files including config/
COPY . .

EXPOSE 3000

CMD ["npm", "start"]

