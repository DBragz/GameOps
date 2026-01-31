<#
.SYNOPSIS
  SSH key setup.

.DESCRIPTION
  Script for generating SSH keys.

.FILE
  ssh_keygen.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

if (-not $args[0]) {
  return Write-Host "Error: Parameters missing`nUsage: ssh_keygen.ps1 [<email>]"
}

ssh-keygen -t rsa -b 4096 -C $args[0]

Get-Content ~/.ssh/id_rsa.pub

