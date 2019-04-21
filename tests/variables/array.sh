#!/bin/bash

# Arrays seem to be unsupported by parser?

declare -a foo
declare -a foo[sub]
# declare -a foo=(a b c)
# foo=(a b c)

declare -A bar
bar[baz]=quax
# declare -A bar=(
#   [baz]=quax
#   [quax]=baz
# )
