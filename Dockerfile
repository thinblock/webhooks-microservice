FROM centos:latest
MAINTAINER Hamza Baig <hamzabaig18@gmail.com>

EXPOSE 8080 

RUN curl -sL https://rpm.nodesource.com/setup_8.x | bash -
RUN yum install install -y nodejs epel-release nodejs make gcc-c++
RUN npm install yarn -g
ADD package.json yarn.lock /tmp/
RUN cd /tmp/ && yarn install --ignore-engines
# moving app and modules into app folder
WORKDIR /app
RUN mv /tmp/node_modules/ /app/
ADD . /app
RUN yarn build

CMD ["yarn", "serve"]

