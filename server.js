var PORT = 3000;

var http = require('http');
var url=require('url');
var fs=require('fs');
var mine=require('./mine').types;
var path=require('path');
var os = require('os'); 

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;
    if (pathname=="/api/live") {
        //如果访问数据接口 解析 url 参数
        var params = url.parse(request.url, true).query;   
        var retJson = JSON.stringify(sendPK10());
        response.writeHead(200, {
            'Content-Type': 'application/json'
        }); 
        response.write(retJson, "binary");
        response.end();  
        return
    }   
    var realPath = path.join("static", pathname); 
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
        })        
    })  
    return ipv4s[0];//返回一个可用的即可
}   

server.listen(PORT,function(){
    console.log("server start "+PORT)
});

var CURRENT = {                
    periodNumber:0,
    period:0,
    periodDate:0,
    awardTime:'',
    awardNumbers:''
}

var PERIOD = {                
    periodNumber:0,
    period:0,
    periodDate:0,
    awardTime:'',
    awardNumbers:''
}

var opentimestamp = 0 

function getPK10() {
    var uri = 'http://e.apiplus.net/newly.do?token=t9c95da775871eeaek&code=bjpk10&rows=2&format=json';  
    http.get(uri, function(res) {    
        res.setEncoding('utf8');
        var cache = null
        res.on('data', (chunk) => { 
            cache = JSON.parse(`${chunk}`)
        }); 
        res.on('end', () => { 
            var d = cache.data[0]
            CURRENT.periodNumber = d.expect
            CURRENT.period = d.expect
            CURRENT.periodDate = d.expect
            CURRENT.awardTime = d.opentime  
            CURRENT.awardNumbers = d.opencode.split(",").map(function(a){
                return Number.parseInt(a)
            }).join(',')  
            opentimestamp = d.opentimestamp  
            d = cache.data[1]
            PERIOD.periodNumber = d.expect
            PERIOD.period = d.expect
            PERIOD.periodDate = d.expect
            PERIOD.awardTime = d.opentime  
            PERIOD.awardNumbers = d.opencode.split(",").map(function(a){
                return Number.parseInt(a)
            }).join(',')
        }); 
    }).on('error', function(e) {   
        console.log("error: " + e.message);   
    }); 
}

function sendPK10(){ 
    //系统时间毫秒
    var _time = new Date().getTime(); 
    var s_time = Math.floor(_time/1000); //服务器时间 
    var curent = CURRENT 
    //倒计时秒数（下一次开奖比赛的时间差值）
    var n_interval = Math.floor((new Date((opentimestamp+315)*1000).getTime()-_time)/1000)*1000
    var n_date = new Date((opentimestamp+300)*1000);//下次开奖时间 
    //当前这一期开奖时间与当前服务器时间差值，如果相遇在30秒以内就表示当前正在播放比赛视频
    if(s_time-opentimestamp<30){
        //取上一次的比赛数据为当前期
        curent = PERIOD   
        n_interval -= 300000 
    }   
    var n_awardTime = n_date.getFullYear()+"-"+(n_date.getMonth()+1)+"-"+n_date.getDate()+" "+n_date.getHours()+":"+n_date.getMinutes()+":"+n_date.getSeconds();
    var n_no = (Number.parseInt(CURRENT.periodNumber) + 1)+""
    var retData = {
        'time':s_time,
        'current': curent,  
        'next': {           
            'periodNumber':n_no,
            'period':n_no,
            'periodDate':n_no,
            'awardTime':n_awardTime,
            'awardTimeInterval':n_interval,
            'delayTimeInterval':10
        }   
    }   
    return retData
}

setInterval(function(){   
   getPK10();  
},11000);  
getPK10();
