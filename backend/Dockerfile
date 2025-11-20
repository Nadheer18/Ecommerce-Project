# Use Node.js 20 (stable LTS)
FROM node:20

# Create working directory inside the container
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend source code
COPY . .

# Expose the backend port
EXPOSE 3000

# Start your backend app
CMD ["npm", "start"]

