#!/bin/bash

foo=${bar}baz

foo=${bar/1/2}
foo=${bar//1/2}

foo=${bar^}
foo=${bar^^}

foo=${bar,}
foo=${bar,,}

foo=${#bar}
