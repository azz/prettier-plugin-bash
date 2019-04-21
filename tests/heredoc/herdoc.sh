#!/bin/bash

cat <<EOF
DOC
EOF

cat <<JSON
{
  "some": "${PROPERTY}"
}
JSON

# TODO: Parser bug
# foo=$(cat <<END
# start
# end
# END
# )
