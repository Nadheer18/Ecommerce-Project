# -------------------------------
# BASE IMAGE
# -------------------------------
FROM node:20-alpine

# -------------------------------
# SET WORKING DIRECTORY
# -------------------------------
WORKDIR /app

# -------------------------------
# COPY PACKAGE FILES
# -------------------------------
COPY package*.json ./

# -------------------------------
# INSTALL DEPENDENCIES
# -------------------------------
RUN npm install --production

# -------------------------------
# COPY APPLICATION SOURCE
# -------------------------------
COPY . .

# -------------------------------
# CREATE UPLOADS FOLDER (FOR IMAGES)
# -------------------------------
RUN mkdir -p /app/uploads && chmod -R 755 /app/uploads

# -------------------------------
# EXPOSE APP PORT
# -------------------------------
EXPOSE 3000

# -------------------------------
# RUN APPLICATION
# -------------------------------
CMD ["node", "index.js"]

