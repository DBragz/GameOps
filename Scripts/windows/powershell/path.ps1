<# 
.SYNOPSIS
  Set path.

.DESCRIPTION
  Script for adding a directory to the environment path.

.FILE
  path.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

[Environment]::SetEnvironmentVariable("PATH", $Env:PATH + ";" + ($args[0]), [EnvironmentVariableTarget]::Machine)

