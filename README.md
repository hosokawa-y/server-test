# server-test

こちらを参考にベクトルタイルサーバーを作ってみる  
[nodejsでベクトルタイルサーバーを作る（mbtilesからpbfを配信する）](https://qiita.com/T-ubu/items/545d9f995ef7496a2ec4)

mbtileの作成は[tippecanoe](https://github.com/mapbox/tippecanoe)を利用

## start server
```
node app0.js 
```

## get tiles from mbtiles
```
http://localhost:8080/VT/zxy/sample/{z}/{x}/{y}.pdf
```

e.g.
```
http://localhost:8080/VT/zxy/sample/0/0/0.pdf
```
