# Base image
FROM node:22-alpine


RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json .
USER node
RUN npm install --legacy-peer-deps
COPY --chown=node:node . ./
RUN npm run build
EXPOSE 4200
CMD ["npx", "nx", "run", "client:serve:development", "--host", "0.0.0.0"]

