
使用docker-compose管理 nginx, mysql, node 

## 启动
```
docker-compose up -d --build
```
- --build 每次都会执行Dockerfile

## 进入到nginx

```
docker exec -it [containerId] bash
```

## 退出
```
exit
```

## 问题解决

- 如何mysql 工具无法连接 docker mysql 

https://devopsbuild.com/docker-host-is-not-allowed-to-connect-to-this-mysql-server/

- 高版本mysql 无法连接mysql
```
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456'; 
flush privileges; 
```