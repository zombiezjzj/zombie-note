#



docker run --name mysql -v /home/ljaer/mysql:/var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -d mysql:8.0.31

docker run -it -e WORDPRESS_DB_HOST=119.45.237.248:3306 -e WORDPRESS_DB_USESR=root -e WORDPRESS_DB_PASSWORD=123456 -p 8080:80 --name wordpress -d wordpress
