#!/bin/sh

cd cgi-bin
  for file in *.cgi
  do
    perl -c $file
  done
cd ..

cd perl-lib
  for file in *.pm
  do
    perl -c $file
  done
cd ..
