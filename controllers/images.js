var fs = require('fs');
var gm = require('gm').subClass({
    imageMagick: true
});
var Grid = require('gridfs-stream');
var mongoose = require('mongoose');
var gfs = Grid(mongoose.connection.db, mongoose.mongo);

function cropImage(imgPath, cb) {
    console.log(imgPath);
    gm(imgPath)
        .resize(256, 256, "^")
        .gravity('Center')
        .crop(256, 256, 0, 0)
        .write(imgPath, function(err) {
            cb(err);
        });
}

exports.getTeamImg = function(req, res) {

    var readstream = gfs.createReadStream({
        filename: "team_" + req.params.id
    });
    readstream.on('error', function(err) {
        fs.createReadStream('res/teamImg.png').pipe(res);
    });

    readstream.pipe(res);
};

exports.getUserImg = function(req, res) {
    var readstream = gfs.createReadStream({
        filename: "user_" + req.params.id
    });
    readstream.on('error', function(err) {
        fs.createReadStream('res/userImg2.png').pipe(res);
    });

    readstream.pipe(res);
};

exports.createTeamImg = function(req, res) {
    var image = req.files.file;

    var tmp_path = image.path;
    var type = image.type;

    cropImage(tmp_path, function(err) {
        if (!err) {
            gfs.remove({
                filename: "team_" + req.params.id
            }, function(err) {
                if (err) {
                    res.send(500);
                } else {
                    var writestream = gfs.createWriteStream({
                        filename: "team_" + req.params.id,
                        content_type: type
                    });
                    fs.createReadStream(tmp_path).pipe(writestream);
                    fs.unlink(tmp_path, function() {
                        res.send(200);
                    });
                };
            });
        } else {
            res.send(500);
        }
    });
};
exports.createUserImg = function(req, res) {
    var image = req.files.file;
    var tmp_path = image.path;
    var type = image.type;

    cropImage(tmp_path, function(err) {
        if (!err) {
            gfs.remove({
                filename: "user_" + req.params.id
            }, function(err) {
                if (err) {
                    res.send(500);
                } else {
                    var writestream = gfs.createWriteStream({
                        filename: "user_" + req.params.id,
                        content_type: type
                    });
                    fs.createReadStream(tmp_path).pipe(writestream);
                    fs.unlink(tmp_path, function() {
                        res.send(200);
                    });
                };
            });

        } else {
            res.send(500);
        }
    });
};
