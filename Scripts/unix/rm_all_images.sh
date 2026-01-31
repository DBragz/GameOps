#!/bin/sh
#
# Name: rm_all_images.sh
#
# Author: Daniel Ribeirinha-Braga
#
# Description: Removes all of the Docker images.
#

docker rmi $(docker images -q)

