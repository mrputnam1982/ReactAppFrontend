# We don't want to start from scratch.
# That is why we tell node here to use the current node image as base.
FROM node:16-alpine

# Create an application directory
RUN mkdir -p /app

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package.json ./
COPY yarn.lock ./
# Install node packages
RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++
RUN yarn install
RUN apk del .gyp
# Copy or project directory (locally) in the current directory of our docker image (/app)
COPY . /app

# Build the app
RUN npm run build

# Expose $PORT on container.
# We use a varibale here as the port is something that can differ on the environment.
EXPOSE $PORT

# Set host to localhost / the docker image
ENV APP_HOST=0.0.0.0

# Set app port
ENV APP_PORT=$PORT

# Set the base url
ENV PROXY_API=$PROXY_API

# Set the browser base url
ENV PROXY_LOGIN=$PROXY_LOGIN

# Start the app (development mode)
# CMD [ "node", "index.js" ]