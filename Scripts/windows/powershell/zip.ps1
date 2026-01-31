<#
.SYNOPSIS
  File compressor.

.DESCRIPTION
  Compresses the file accordingly.

.FILE
  user_env.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

Compress-Archive $args[0] $args[1]

