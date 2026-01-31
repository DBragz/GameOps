#!/bin/sh
#
# Name: git_proxy.sh
#
# Author: Daniel Ribeirinha-Braga
#
# Description: Script for setting up Git proxy.
#

if [ -z $1 ]; then
  echo -e "Error: Parameter missing\nUsage: git_proxy.sh [proxy]"
  exit 0
fi

git config --global http.proxy $1
git config --global https.proxy $1

