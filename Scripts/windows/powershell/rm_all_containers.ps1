<#
.SYNOPSIS
  Removes all containers.

.DESCRIPTION
  Removes all of the docker containers.

.FILE
  rm_all_containers.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

docker rm $(docker ps -a -q)

