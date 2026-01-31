<# 
.SYNOPSIS
  Entrypoint Docker program.

.DESCRIPTION
  Loads a particular image inside a Docker container and sh's into it.

.FILE
  docker_entrypoint.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

if (-not $args[0]) {
  return Write-Host "Error: Parameters missing`nUsage: docker_entrypoint.sh DOCKER_IMAGE"
}

docker run --rm -it --entrypoint sh $args[0]

