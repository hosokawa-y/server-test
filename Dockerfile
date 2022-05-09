# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:12-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
# RUN npm ci --only=production
RUN npm install

# Copy local code to the container image.
COPY . ./

# Use the official Debian slim image for a lean production container.
# FROM debian:buster-slim
# RUN set -x && apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
#     --no-install-recommends \
#     ca-certificates && \
#     rm -rf /var/lib/apt/lists/*

# Create and change to the app directory.
# WORKDIR /

# # Copy the binary to the production image from the builder stage.
# # COPY --from=builder /app/server /app/server

# COPY . ./
# RUN  chmod +x /start_tileserver.sh

# # Run the web service on container startup.
# ENTRYPOINT ./start_tileserver.sh && tail -f /dev/null

# Run the web service on container startup.
CMD [ "node", "app0.js" ]