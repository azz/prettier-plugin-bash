#!/bin/bash

echo '1' > file

echo '2' >> file

echo '3' 2> file

echo '4' 2>&1

echo '5' 1>&2

echo '6' >&1

echo '7' >&1 2> file
