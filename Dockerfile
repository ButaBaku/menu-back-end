# Base image
FROM node:20.16.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Generate Prisma migration
RUN npx prisma migrate dev

# Make the entry file executable
RUN chmod +x ./bin/www.js

# Expose the port the app runs on
EXPOSE 80

# Start the app using the custom entry file
CMD ["node", "./bin/www.js"]
