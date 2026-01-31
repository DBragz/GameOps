#!/bin/sh
#
# Name: npm_proxy.sh
#
# Author: Daniel Ribeirinha-Braga
#
# Description: Script for setting up my npm proxy.
#

if [ -z $1 ]; then
  echo -e "Error: Parameter missing\nUsage: npm_proxy.sh <proxy>"
  exit 0
fi

npm config set proxy $1
npm config set https-proxy $1

