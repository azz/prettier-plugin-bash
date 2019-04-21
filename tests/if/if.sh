#!/bin/bash

if $a; then
  echo 'yes'
fi

if [ $a = $b ]; then
  echo 'yes'
fi

if foo; then
  echo 'yes'
fi
