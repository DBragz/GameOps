#!/bin/sh
#
# Name: rm_all_containers.sh
#
# Author: Daniel Ribeirinha-Braga 
#
# Description: Removes all of the Docker containers.
#

docker rm $(docker ps -a -q)

