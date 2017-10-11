#!/bin/bash

echo ""
echo "Linted Files"
echo "============"

# Loop through controllers.
for filename in ./lib/*.js; do
    echo "$filename"

    eslint $filename
done

echo ""
