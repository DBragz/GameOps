<# 
.SYNOPSIS
  Displays Windows operating system.

.DESCRIPTION
  Displays the current Windows operating system.

.FILE
  os_info.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

(Get-CimInstance -ClassName CIM_OperatingSystem).Caption 

