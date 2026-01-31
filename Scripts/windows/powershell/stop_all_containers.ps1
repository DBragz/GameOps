<#
.SYNOPSIS
  Stop all containers.

.DESCRIPTION
  Stops all of the docker containers.

.FILE
  ssh_keygen.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

docker kill $(docker ps -q)

