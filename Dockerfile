FROM node:lts
RUN apt-get update && apt-get install imagemagick tesseract-ocr -y
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install
COPY ./ ./
CMD [ "yarn", "start" ]