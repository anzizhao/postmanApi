"use strict";

var Swagger2Postman = require("swagger2-postman")
var path = require('path');
var fs = require('fs');
var jsonfile = require('jsonfile')


let swaggerFile =  './alpha.json';
let configure ;
const opt = {
    configFile: './configure.json',
};

//var data = require( opt.configFile )
//console.dir(data)
//configure   = JSON.parse(data)

//read configure.json  path 
(function readConfig(){
    var data = fs.readFileSync( opt.configFile, 'utf-8')
    configure   = JSON.parse(data)
})();

if ( ! configure || ! configure.convert instanceof Array ) {
    console.log("配置文件有误")
}

let srcJson = require(swaggerFile)
srcJson.basePath = ''
configure.convert.forEach( item =>{
    srcJson.host = item.host 
    let convert = new Swagger2Postman();
    let result = convert.convert( srcJson )
    let savePath = item.outputFile  
    if( result.status === 'passed') {
        //fs.writeFileSync(savePath, JSON.stringify(result.collection) )
        //jsonfile.writeFileSync(savePath, JSON.stringify(result.collection) )
        jsonfile.writeFileSync(savePath, result.collection, {spaces: 2})
    } else {
        console.err('转换失败, host:' + item.host + '  outputFile: ' + item.outputFile ) 
    }

})

//console.log( 'convert status: ' +  result.status )

//console.dir( result.collection )

