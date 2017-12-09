
var PORT = 8080;

var http = require('http');
var url=require('url');
var fs=require('fs');
var mine = require('./mine').types;
var path=require('path');
var os = require('os'); 

var last = null 

function getPK10() {
    var uri = 'http://e.apiplus.net/newly.do?token=t9c95da775871eeaek&code=bjpk10&rows=1&format=json';  
    http.get(uri, function(res) {    
        res.setEncoding('utf8');
        var cache = null
        res.on('data', (chunk) => { 
          cache = JSON.parse(`${chunk}`)
        });
        res.on('end', () => {
          console.log('No more data in response.');
          last = cache.data
          console.log(last);  
        });  
    }).on('error', function(e) {   
        console.log("error: " + e.message);   
    });
}

getPK10();

setTimeout(function(){  
   getPK10(); 
},15000); 

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname; 
    /***
    if (pathname.charAt(pathname.length - 1) == "/") {
        //如果访问目录
        pathname += "page/pk10.html"; //指定为默认网页
    }   
    ***/
    var realPath = path.join("static", pathname);
    console.log(realPath);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});

function getIPv4(){ 
    var interfaces = os.networkInterfaces();//获取网络接口列表 
    var ipv4s = [];//同一接口可能有不止一个IP4v地址，所以用数组存
    Object.keys(interfaces).forEach(function (key){
        interfaces[key].forEach(function (item){
    
            //跳过IPv6 和 '127.0.0.1'
            if ( 'IPv4' !== item.family || item.internal !== false )return;
    
            ipv4s.push(item.address);//可用的ipv4s加入数组
            console.log(key+'--'+item.address);
        })        
    })    
    return ipv4s[0];//返回一个可用的即可
} 

server.listen(PORT,function (){ 
    console.log('Server start on: '+getIPv4()+':'+PORT+"."); 
});


