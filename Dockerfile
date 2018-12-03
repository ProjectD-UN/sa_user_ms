FROM node:8-alpine
ADD package*.json /tmp/
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/
WORKDIR /opt/app
ADD . /opt/app
EXPOSE 3000
CMD ["node", "index.js"]