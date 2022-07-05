# pull base image
FROM node:16.14.2-buster-slim

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# default to port 19006 for node, and 19001 and 19002 (tests) for debug
ARG PORT=19006
ENV PORT $PORT
EXPOSE $PORT 19001 19002

# install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i --unsafe-perm -g npm@latest expo-cli@latest

# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir /opt/poc-tarea-pwa
WORKDIR /opt/poc-tarea-pwa
COPY --chown=node:node . .
USER node
ENV PATH ./.bin:$PATH
RUN npm config set legacy-peer-deps true
RUN npm install
RUN npm install typescript@~4.3.5

# copy in our source code last, as it changes the most
WORKDIR /opt/poc-tarea-pwa/app
# for development, we bind mount volumes; comment out for production
# COPY ./poc-tarea-pwa .

ENTRYPOINT ["npm", "run"]
CMD ["web"]

# Comando para rodar no windows :

# docker build -t poc-blockchain-pwa .                                                                                                                                                        
# docker run -it --rm --name poc-blockchain-pwa -p 19006:19006 -v /opt/poc-blockchain-pwa:/opt/poc-blockchain-pwa/app:delegated -v notused:/opt/poc-blockchain-pwa/app/node_modules poc-blockchain-pwa

# Comando para rodar no mac/linux :

# docker build -t poc-blockchain-pwa .     

# docker run -it --rm --name react_native_app \
#           -p 19006:19006 \
#           -v (pwd):/opt/react_native_app/app:delegated \
#           -v notused:/opt/react_native_app/app/node_modules \
#           react_native_app