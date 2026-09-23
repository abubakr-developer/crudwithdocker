FROM node:20-alpine

# Set working directory inside the container
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy all remaining project files
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]