FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies (in the mounted volume)
COPY package*.json ./
RUN npm install

# Copy the rest of the files
COPY . .

RUN npx prisma generate
# Expose the port the app runs on
EXPOSE 3000

# Run in dev mode (change to build/start for prod)
CMD ["npm", "run", "dev"]

