#!/bin/sh
#
# Name: find_large_files.sh
#
# Author: Daniel Ribeirinha-Braga
#
# Description: Script for finding large files.
#

if [ -z $1 ]; then
  echo -e "Error: Parameter missing\nUsage: find_large_files.sh [file_size_in_M]"
  exit 0
fi

find / -type f -size +"${1}M" -exec ls -lh {} \;
