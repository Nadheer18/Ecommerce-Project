# ---- Base Image ----
FROM node:20-alpine

# ---- Set working directory ----
WORKDIR /app

# ---- Copy package files ----
COPY package*.json ./

# ---- Install dependencies ----
RUN npm install --production

# ---- Copy the application code ----
COPY . .

# ---- Create uploads folder inside container ----
RUN mkdir -p uploads && chmod -R 755 uploads

# ---- Expose port ----
EXPOSE 3000

# ---- Start the server ----
CMD ["node", "index.js"]

