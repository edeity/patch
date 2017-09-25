# 补丁管理工具-后台

## 前置

```shell
# mongodb
$ brew install mongo
$ brew services start mongo
# mongo.conf 
# systemLog: ...
# storage: ...
# net: ...
# replication:
#	replSetName: rs0

$ mongo
$ rs.initiate()
# 假如不成功， 则需要：
# rs.initiate({_id: "rs0", members: [{"_id": 1, "host": "127.0.0.1:27017"}]})
$ rs.slaveOk()

#elasticsearch
$ brew install elasticsearch
$ brew services start elasticsearch
# config/elasricsearch.yml
# 开启外网访问权限
# network.host: 0.0.0.0
# 开启跨域访问
# http.cors.enabled: true
# 允许访问的端口, 调试时仅为本机3000端口
# http.cors.allow-origin: http://localhost:3000
#http.cors.allow-origin: /.*/

# 同步mongodb && elasticsearch
$ pip install elastic-doc-manager
$ pip install mongo-connector
$ mongo-connector -m 127.0.0.1:27017 -t 127.0.0.1:9200 -d elastic_doc_manager
```

### 启动

```shell
$ npm install
$ npm install pm2 -g
$ pm2 startup ./bin/www
```



