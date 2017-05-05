FROM mhart/alpine-node:0.12

RUN mkdir -p /usr/node_app
COPY . /usr/node_app
WORKDIR /usr/node_app
RUN npm install pm2@next -g
RUN npm install --production

# Start process.yml
CMD ["pm2-docker", "mqtt-ifttt-bridge.js"]
