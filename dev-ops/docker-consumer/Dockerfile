FROM node:20-alpine

ARG AWS_SQS_URL
ARG AWS_SQS_NAME
ARG AWS_REGION

ENV AWS_SQS_URL=$AWS_SQS_URL
ENV AWS_SQS_NAME=$AWS_SQS_NAME
ENV AWS_REGION=$AWS_REGION

WORKDIR /aws-sqs-asg-cloudwatch

COPY ./dev-ops/docker/entrypoint.sh ./entrypoint.sh
COPY . .

RUN yarn install --frozen-lockfile
RUN apk add --no-cache bash
RUN apk add --no-cache stress-ng

ENTRYPOINT ./entrypoint.sh
