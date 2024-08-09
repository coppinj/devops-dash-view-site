#!/bin/bash

IMAGE_NAME="devops-dash-view-front-test"
docker build . -f .docker/test/Dockerfile -t $IMAGE_NAME
docker save $IMAGE_NAME > $IMAGE_NAME.tar.gz