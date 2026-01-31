<# 
.SYNOPSIS
  Ansible container.

.DESCRIPTION
  Creates an ansible docker container.

.FILE
  ansible.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

docker run --rm -it -v Get-Location:/ansible willhallonline/ansible:latest /bin/sh

