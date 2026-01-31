<# 
.SYNOPSIS
  Enter Docker container.

.DESCRIPTION
  Loads a particular image inside a Docker container and sh's into it.

.FILE
  docker_sh.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

if (-not $args[0]) {
  return Write-Host "Error: Parameters missing`nUsage: docker_sh.sh CONTAINER_NAME_OR_ID"
}

docker exec -it $args[0] sh

