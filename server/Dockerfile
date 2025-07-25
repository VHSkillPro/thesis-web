# Define development environment image.
# Use the official lightweight Node.js 20 image.
FROM node:20.15-alpine3.19 as development

# Set the working directory.
WORKDIR /usr/server

# Copy the package.json and package-lock.json files into the image.
COPY package*.json /usr/server/

# Install the dependencies.
RUN npm ci

# Copy the rest of the source files into the image.
COPY . /usr/server

# Expose the port that the application listens on.
EXPOSE 3000

# Set the NODE_ENV environment variable to development.
ENV NODE_ENV development

# Define the command to run the application.
CMD ["npm", "run", "start:dev"]

# Define build environment image.
# Use the official lightweight Node.js 20 image.
FROM node:20.15-alpine3.19 as build

# Set the working directory.
WORKDIR /usr/server

# Copy the package.json and package-lock.json files into the image.
COPY package.json /usr/server/package.json

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. 
# In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --from=development /usr/server/node_modules ./node_modules

# Copy the rest of the source files into the image.
COPY . /usr/server

# Build the application.
RUN npm run build

# Set the NODE_ENV environment variable to production.
ENV NODE_ENV production

# Install the dependencies and clean the cache.
RUN npm ci --only=production && npm cache clean --force

# Define production environment image.
FROM node:20.15-alpine3.19 as production

# Copy source files from the build environment image.
COPY --from=build /usr/server/.env ./.env
COPY --from=build /usr/server/node_modules ./node_modules
COPY --from=build /usr/server/dist ./dist

# Expose the port that the application listens on.
EXPOSE 3000

# Define the command to run the application.
CMD ["node", "./dist/main.js"]