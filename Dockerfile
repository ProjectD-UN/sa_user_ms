FROM node:8-alpine
ADD package*.json /tmp/
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/
WORKDIR /opt/app
ADD . /opt/app
CMD ["node", "index.js"]
EXPOSE 3003