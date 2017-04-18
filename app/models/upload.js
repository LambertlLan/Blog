/**
 * Created by lois on 2017/1/3.
 */
var formidable = require('formidable');
var path = require('path');
var sd = require('silly-datetime');
var fs = require('fs');
var config = require('../../config/config')

exports.uploadImg = function (req,res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = "uploads";
    form.parse(req, function(err, fields, files) {
        if (err) throw err;
        var ran = parseInt(Math.random()*89999+10000)
        var ttt = sd.format(new Date(), 'YYYYMMDDHHmmss');
        var oldpath = files.tupian.path;
        var extname = path.extname(files.tupian.name);
        var newname = ttt+ran+extname
        var newpath = "uploads/"+newname;
        fs.rename(oldpath,newpath,function (err) {
            if (err) throw err;
        })
        res.send(config.basePath+newname);
    });
    return;
}