Nginx负载均衡策略
负载均衡用于从“upstream”模块定义的后端服务器列表中选取一台服务器接受用户的请求。一个最基本的upstream模块是这样的，模块内的server是服务器列表：
    #动态服务器组
    upstream ibps3_gateway {
        server 192.168.3.220:15100;  # gateway
        server 192.168.3.230:15100;  # gateway
    }
在upstream模块配置完成后，要让指定的访问反向代理到服务器列表：

  server {
      listen       ibps3.bpmhome.cn:15100;

      location / {
          proxy_pass http://ibps3_gateway;
      }
  }
这就是最基本的负载均衡实例，但这不足以满足实际需求；目前Nginx服务器的upstream模块支持6种方式的分配：
负载均衡策略

策略	说明
轮询	默认方式
weight	权重方式
ip_hash	依据ip分配方式
least_conn	最少连接方式
fair（第三方）	响应时间方式
url_hash（第三方）	依据URL分配方式
权重配置：

weight 和请求数量成正比，主要用于上游服务器配置不均衡的情况。下面的配置中，192.168.3.230 机器的请求量是 192.168.3.220 机器请求量的 2 倍。

upstream ibps3_gateway {
    server 192.168.3.220:15100  weight=5;  # gateway
    server 192.168.3.230:15100  weight=10;  # gateway
}
ip_hash 配置：

每一个请求按照请求的 ip 的 hash 结果分配。这样每一个请求固定落在一个上游服务器，能够解决 ip 会话在同一台服务器的问题。

upstream ibps3_gateway {
    ip_hash;
    server 192.168.3.220:15100;  # gateway
    server 192.168.3.230:15100;  # gateway
}
upstream 中常用的配置项：
down：表示当前的 server 不參与负载均衡。
weight：负载权重，值越大，负载的权重就越大，默认1。
max_fails：最大请求失败尝试的次数默认1。
fail_timeout：max_fails次失败后，暂停请求此台服务器的时间。
backup：其它全部非 backup 机器 down 或者忙的时候，请求 backup 机器。所以这台机器压力会最轻。
upstream ibps3_gateway {
    server 192.168.3.220:15100 max_fails=2 fail_timeout=20s weight=3;
    server 192.168.3.230:15100 max_fails=2 fail_timeout=20s weight=3;
    server 192.168.3.240:15100 down;
    server 192.168.3.250:15100 backup;
}
二、history模式、跨域、缓存、反向代理
# html设置history模式
location / {
    index index.html index.htm;
    proxy_set_header Host $host;
    # history模式最重要就是这里
    try_files $uri $uri/ /index.html;
    # index.html文件不可以设置强缓存 设置协商缓存即可
    add_header Cache-Control 'no-cache, must-revalidate, proxy-revalidate, max-age=0';
}
# 接口跨域、反向代理、缓存
location ^~ /api/ {
    # 跨域处理 设置头部域名
    add_header Access-Control-Allow-Origin *;
    # 跨域处理 设置头部方法
    add_header Access-Control-Allow-Methods 'GET,POST,DELETE,OPTIONS,HEAD';
    # 改写路径
    rewrite ^/api/(.*)$ /$1 break;
    # 反向代理
    proxy_pass http://static_env;
    proxy_set_header Host $http_host;
}

location ~* \.(?:css(\.map)?|js(\.map)?|gif|svg|jfif|ico|cur|heic|webp|tiff?|mp3|m4a|aac|ogg|midi?|wav|mp4|mov|webm|mpe?g|avi|ogv|flv|wmv)$ {
    # 静态资源设置七天强缓存
    expires 7d;
    access_log off;
}

五、灰度部署
如何根据headers头部来进行灰度，下面的例子是用cookie来设置

如何获取头部值在nginx中可以通过$http_xxx来获取变量

upstream stable {
    server xxx max_fails=1 fail_timeout=60;
    server xxx max_fails=1 fail_timeout=60;
 }
upstream canara {
   server xxx max_fails=1 fail_timeout=60;
}

server {
    listen 80;
    server_name  xxx;
    # 设置默认
    set $group "stable";

    # 根据cookie头部设置接入的服务
    if ($http_cookie ~* "tts_version_id=canara"){
        set $group canara;
    }
    if ($http_cookie ~* "tts_version_id=stable"){
        set $group stable;
    }
    location / {
        proxy_pass http://$group;
        proxy_set_header   Host             $host;
        proxy_set_header   X-Real-IP        $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        index  index.html index.htm;
    }
}
六、优雅降级
常用于ssr的node服务挂了返回500错误码然后降级到csr的cos桶或者nginx中

优雅降级主要用error_page参数来进行降级指向备用地址。

upstream ssr {
    server xxx max_fails=1 fail_timeout=60;
    server xxx max_fails=1 fail_timeout=60;
 }
upstream csr {
    server xxx max_fails=1 fail_timeout=60;
    server xxx max_fails=1 fail_timeout=60;
}

location ^~ /ssr/ {
    proxy_pass http://ssr;
    # 开启自定义错误捕获 如果这里不设置为on的话 会走向nginx处理的默认错误页面
    proxy_intercept_errors on;
    # 捕获500系列错误 如果500错误的话降级为下面的csr渲染
    error_page 500 501 502 503 504 = @csr_location

    # error_page 500 501 502 503 504 = 200 @csr_location
    # 注意这上面的区别 等号前面没有200 表示 最终返回的状态码已 @csr_location为准 加了200的话表示不管@csr_location返回啥都返回200状态码
}

location @csr_location {
    # 这时候地址还是带着/ssr/的要去除
    rewrite ^/ssr/(.*)$ /$1 break;
    proxy_pass http://csr;
    rewrite_log on;
}
6.1 webp根据浏览器自动降级为png
这套方案不像常见的由nginx把png转为webp的方案，而是先经由图床系统（node服务）上传两份图片:

1、一份是原图png
2、一份是png压缩为webp的图片（使用的是imagemin-webp）

然后通过nginx检测头部是否支持webp来返回webp图片，不支持的话就返回原图即可。这其中还做了错误拦截，如果cos桶丢失webp图片及时浏览器支持webp也要降级为png

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;

  # 设置日志格式
  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
  '$status $body_bytes_sent "$http_referer" '
  '"$http_user_agent" "$http_x_forwarded_for"'
  '"$proxy_host" "$upstream_addr"';

  access_log  /var/log/nginx/access.log  main;

  sendfile        on;
  keepalive_timeout  65;

  # 开启gzip
  gzip on;
  gzip_vary on;
  gzip_proxied any;
  gzip_comp_level 6;
  gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

  # 负载均衡 这里可以是多个cos桶地址即可
  upstream static_env {
    server xxx;
    server xxx;
  }

  # map 设置变量映射 第一个变量指的是要通过映射的key值 Accpet 第二个值的是变量别名
  map $http_accept $webp_suffix {
    # 默认为 空字符串
    default   "";
    # 正则匹配如果Accep含有webp字段 设置为.webp值
    "~*webp"  ".webp";
  }
  server {

    listen 8888;
    absolute_redirect off;    #取消绝对路径的重定向
    #网站主页路径。此路径仅供参考，具体请您按照实际目录操作。
    root /usr/share/nginx/html;

    location / {
      index index.html index.htm;
      proxy_set_header Host $host;
      try_files $uri $uri/ /index.html;
      add_header Cache-Control 'no-cache, max-age=0';
    }

    # favicon.ico
    location = /favicon.ico {
      log_not_found off;
      access_log off;
    }

    # robots.txt
    location = /robots.txt {
      log_not_found off;
      access_log off;
    }

    # 
    location ~* \.(png|jpe?g)$ {
      # Pass WebP support header to backend
      # 如果header头部中支持webp
      if ($webp_suffix ~* webp) {
        # 先尝试找是否有webp格式图片
        rewrite ^/(.*)\.(png|jpe?g)$ /$1.webp break;
        # 找不到的话 这里捕获404错误 返回原始错误 注意这里的=号 代表最终返回的是@static_img的状态吗
        error_page 404 = @static_img;
      }
      proxy_intercept_errors on;
      add_header Vary Accept;
      proxy_pass http://static_env;
      proxy_set_header Host $http_host;
      expires 7d;
      access_log off;
    }

    location @static_img {
      #set $complete $schema $server_addr $request_uri;
      rewrite ^/.+$ $request_uri break;
      proxy_pass http://static_env;
      proxy_set_header Host $http_host;
      expires 7d;
    }


    # assets, media
    location ~* \.(?:css(\.map)?|js(\.map)?|gif|svg|jfif|ico|cur|heic|webp|tiff?|mp3|m4a|aac|ogg|midi?|wav|mp4|mov|webm|mpe?g|avi|ogv|flv|wmv)$ {
      proxy_pass http://static_env;
      proxy_set_header Host $http_host;
      expires 7d;
      access_log off;
    }


    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
      root   /usr/share/nginx/html;
    }
  }
}