#!/bin/sh
#
# Name: proxy.sh
#
# Author: Daniel Ribeirinha-Braga
#
# Description: Script for setting up the proxy for my http_proxy and https_proxy environment variables.
#

if [ -z $1 ]; then
  echo -e "Error: Parameter missing\nUsage: proxy.sh [<proxy>]"
  exit 0
fi

echo "export http_proxy=$1" >> ~/.profile
echo "export https_proxy=$1" >> ~/.profile

