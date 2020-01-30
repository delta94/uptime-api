# stage 1 - build the code
FROM node:11.15-alpine as builder
WORKDIR /src
COPY package.json ./

RUN apk add --no-cache git && \
  npm config set unsafe-perm true

COPY .env .
ADD . .

RUN npm install
RUN npm run build


# stage 2
FROM node:11.15-alpine
WORKDIR /src
COPY package.json ./

RUN apk -v --update add --no-cache git \
  python \
  py-pip \
  && \
  npm config set unsafe-perm true && \
  pip install --upgrade awscli==1.14.5 s3cmd==2.0.1 && \
  apk -v --purge del py-pip

COPY --from=builder /src/build ./build
COPY UptimePM-Production.Admin.pfx .

EXPOSE 5000
CMD ["npm", "start"]
