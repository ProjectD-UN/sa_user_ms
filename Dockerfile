FROM node:8-alpine
ADD package*.json /tmp/
RUN cd /tmp && npm install
RUN mkdir -p /opt/app/users && cp -a /tmp/node_modules /opt/app/users
WORKDIR /opt/app/users
ADD . /opt/app/users
EXPOSE 3003
CMD ["node", "index.js"]
