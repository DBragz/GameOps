<#
.SYNOPSIS
  Removes all images

.DESCRIPTION
  Removes all of the docker images.

.FILE
  rm_all_images.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

docker rmi $(docker images -q)

