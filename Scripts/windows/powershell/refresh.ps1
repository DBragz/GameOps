<#
.SYNOPSIS
  Refresh environment variables

.DESCRIPTION
  Script for refreshing environment variables.

.FILE
  refresh.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Process)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::User)

