#!/bin/sh
#
# Name: stop_all_containers.sh
#
# Author: Daniel Ribeirinha-Braga
#
# Description: Stops all of the Docker containers running.
#

docker kill $(docker ps -q)

