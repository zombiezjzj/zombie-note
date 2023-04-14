
# docker 部署 elasticsearch+kibana+filebeat

学习，看完各种博客，自己记录一下

## elasticsearch

docker 安装elasticsearch 官方地址
[https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)
>切记在docker pull 时候加上对应的版本号
```javascript
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.9.1
```
```javascript
docker run -d --name es -p 9200:9200 -p 9300:9300 -e ES_JAVA_OPTS="-Xms256m -Xmx256m" -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.9.1
```
>解释：
	>			-d  	 后台运行
	>			--name		 指定名字，以后start stop rm exec啥的，用名字就行，不用那一长串id
	>			-p 	端口前面是映射出去的端口，后面是本地端口，9200单节点的，9300集群的
	>			-e		 "discovery.type=single-node"  单节点部署
	>			-e 	ES_JAVA_OPTS="-Xms256m -Xmx256m" 指定 jvm内存大小（买了个腾讯云服务器1核2g，没指定大小，启动完elasticsearch，再启动kibana，es就挂了，妹的）

这个很简单。

	
## kibana
docker 安装kibana官方地址
[https://www.elastic.co/guide/en/kibana/current/docker.html](https://www.elastic.co/guide/en/kibana/current/docker.html)
>切记在docker pull 时候加上对应的版本号
>elasticsearch 和 kibana版本最好一致，否则会有意想不到的问题

```javascript
docker run -d  -p 5601:5601 --link es --name kibana docker.elastic.co/kibana/kibana:7.9.1
```
>解释：
	>			--link es   对应上面创建的es容器

启动之后需要进入容器修改一个配置
```javascript
docker exec -it kibana /bin/bash
vi config/kibana.yml
```
修改elasticsearch:9200  改为你机器的ip地址
>切记不要使用localhost，不认识，会报 kibana没准备好的问题

## filebeat

filebeat的一些命令，查看这位大佬的博客
[https://www.cnblogs.com/whych/p/9930138.html](https://www.cnblogs.com/whych/p/9930138.html)

```javascript
wget https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.9.1-linux-x86_64.tar.gz
tar -zxvf filebeat-7.9.1-linux-x86_64.tar.gz
```
解压完成后修改filebeat.yml
```javascript
output.elasticsearch:
  hosts: ["localhost:9200"]
  username: "elastic"
  password: "${ES_PWD}"   #通过keystore设置密码
setup.kibana:
  host: "localhost:5601"
```
filebeat创建username
```javascript
./filebeat keystore create elastic
./filebeat keystore add ES_PWD  回车之后会输入密码
./filebeat keystore list
```
启动
```javascript
./filebeat -e -c filebeat.yml
```
>-c：配置文件位置
-path.logs：日志位置
-path.data：数据位置
-path.home：包的位置
-e：关闭日志输出
-d 选择器：启用对指定选择器的调试。 对于选择器，可以指定逗号分隔的组件列表，也可以使用-d“*”为所有组件启用调试.例如，-d“publish”显示所有“publish”相关的消息。（这部分抄的）


启动完成之后就可以访问ip:5601去访问kibana了

不同的kibana样式可能变化很大，找着英文名就行了，使用的话，去查看discover中，选择查看条件就行了。