#!/bin/bash

echo "start tileserver_gl..."
cd tileserver
docker run --rm -it -v $(pwd):/data -p 30002:80 maptiler/tileserver-gl