#!/bin/bash

echo "start tileserver_gl..."
echo $(pwd)
echo $(ls)
cd tileserver
echo $(pwd)
docker 
docker run --rm -d -it -v $(pwd):/data -p 8080:80 maptiler/tileserver-gl
