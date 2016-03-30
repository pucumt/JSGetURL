sudo apt-get install nginx  
OK！Nginx 装好了！就这么简单！

接下来我们启动 Nginx 服务:

sudo service nginx restart  


配置 Nginx

我们希望利用 Nginx 做 Ghost 的前端代理服务。OK， 我们进入 /etc/nginx/sites-available/ 目录设置 Nginx ：

cd /etc/nginx/sites-available/  
sudo touch ghost.conf  
sudo vi ghost.conf  
最后一条指令是用 vim 编辑器打开 ghost.conf 文件进行编辑。我们输入如下内容：

server {  
    listen 80;
    server_name ghostchina.com *.ghostchina.com; //替换为你自己的域名！

    location / {
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   Host      $http_host;
        proxy_pass         http://127.0.0.1:2368;
    }
}
127.0.0.1 可能要用localhost代替
如果不会用 vim 的话，请百度一下吧。只要会基本操作就 OK 了。
然后我们为 ghost.conf 文件做一个软链接到 /etc/nginx/sites-enabled/ 目录下：

sudo ln -s /etc/nginx/sites-available/ghost.conf /etc/nginx/sites-enabled/ghost.conf  
安装 forever

目前我们推荐采用 Upstart 进程守护工具来启动 Ghost。关于如何通过 Upstart 启动、监控 Ghost，请参考这篇文章：用 Upstart 守护 Ghost。
如果是通过 npm start 启动 Ghost 的话，只要你关闭了远程连接，Ghost 也就停了，这个我们当然不希望喽。幸好，有 forever 工具帮我们解决这个问题。接下来执行以下指令来安装 forever ：

sudo npm install forever -g  
注意：这条指令将 forever 安装到全局环境。安装的时候系统会提示一些 WARN，这是因为 forever 依赖的 Node.js 版本过低，没关系，不用理会。


启动 Ghost

执行如下指令重启 Nginx、启动 Ghost：

sudo service nginx restart  
cd /srv/ghost  
sudo NODE_ENV=production forever start index.js  


w保存，q退出。wq保存退出！
进入编辑状态后，按esc
再按shift＋zz，注意是两下z

cd /root
cd WPWebSite
npm start
