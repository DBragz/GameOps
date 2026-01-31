#!/bin/sh
#
# Name: token_access.sh
#
# Author: Daniel Ribeirinha-Braga
#
# Description: A script that uses environment variables to setup your GitHub crednetials with a token.
#

if [ -z $1 ] && [ -z $2 ] && [ -z $3 ]; then
  echo -e "Error: Parameters missing\nUsage: token_access.sh [environment_variable] [repository] [username]"
  exit 0
fi

SECRET=$(printenv "$1")
REPO=$2
USERNAME=$3
# GIT_NAME=$3
# GIT_EMAIL=$4
# LOCAL_GIT_NAME=$(git config --get user.name)
# LOCAL_GIT_EMAIL=$(git config --get user.email)

echo "Secret: $SECRET"
echo "Repo: $REPO"
echo "Username: $USERNAME"
# echo "Git Name: $GIT_NAME"
# echo "Git Email: $GIT_EMAIL"
# echo "Local Git Name: $LOCAL_GIT_NAME"
# echo "Local Git Email: $LOCAL_GIT_EMAIL"

# ./unix/git_init.sh $GIT_NAME $GIT_EMAIL

git remote add github https://$USERNAME:$SECRET@github.com/$USERNAME/$REPO.git
