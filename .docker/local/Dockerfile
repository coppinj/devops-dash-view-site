FROM node:20

RUN npm i -g @angular/cli@17

WORKDIR /site
RUN apt update && apt install git vim acl -y

RUN chown -R node:node /site
RUN chmod -R g+s /site

USER node
EXPOSE 4200

RUN echo "alias ll='ls -alh'" > ~/.bashrc

CMD yarn \
    && yarn run start --host 0.0.0.0
