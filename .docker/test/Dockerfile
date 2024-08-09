# BUILD
FROM node:20-alpine as build

ARG NODE_ENV=test

WORKDIR /fend

COPY package.json /fend
COPY yarn.lock /fend

RUN npm install -g @angular/cli@16 && yarn

COPY . /fend
RUN ng build --configuration=$NODE_ENV --output-path dist

# CONTAINER
FROM nginx:1.19-alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /fend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


