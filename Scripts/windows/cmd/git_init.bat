@REM Name:     git_init.bat
@REM Author:   Daniel Ribeirinha-Braga
@REM Purpose:  Script for setting up Git username and email.

@echo off

if [%2]==[] (
  echo Error: Parameters missing
  echo usage: git_init.bat [username] [email]
  goto :eof
)

git config --global user.name %1
git config --global user.email %2

