#!/bin/sh
#
# Name: git_init.sh
#
# Author: Daniel Ribeirinha-Braga
#
# Description: Script for setting up Git username and email.
#

if [ -z $1 ] && [ -z $2 ]; then
  echo -e "Error: Parameters missing\nUsage: git_init.sh [username] [email]"
  exit 0
fi

git config user.name $1
git config user.email $2

