<#
.SYNOPSIS
  Authorizing SSH keys.

.DESCRIPTION
  Script for adding SSH keys to a server to be authorized.

.FILE
  ssh_access.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

if ((-not $args[0]) -or (-not $args[1])) {
  return Write-Host "Error: Parameters missing`nUsage: ssh_access.ps1 [<username>] [<hostname>]"
}

Get-Content ~/.ssh/id_rsa.pub | ssh $($args[0])@$($args[1]) 'mkdir ~/.ssh/ && touch ~/.ssh/authorized_keys && cat >> ~/.ssh/authorized_keys'

