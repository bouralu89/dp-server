var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var Team = mongoose.model('Team');

exports.create = function(req, res) {
    var newMessage = new Message(req.body);
    newMessage.save(function(err) {
        if (!err) {
            res.send(201);
        } else {
            res.send(409);
        };
    });
};

exports.getAllByUserId = function(req, res) {
    Team.find({
        $or: [{
            'manager': req.params.id
        }, {
            'users': req.params.id
        }]
    })
        .exec(function(err, teams) {
            Message
                .find({
                    team: {
                        $in: teams
                    },
                    date: {
                        $lt: req.query.from
                    }
                })
                .limit(5)
                .sort({
                    'date': -1
                })
                .populate('user', 'first_name surname')
                .populate('team', 'name')
                .exec(function(err, msgs) {
                    if (err) {
                        console.log(err, msgs);
                        res.send(409, null);
                    } else {
                        getCommentsCount(msgs, function(messages) {
                            console.log(messages);
                            res.send(200, messages);
                        });
                    };
                });
        });

};
exports.getNewByUserId = function(req, res) {
    Team.find({
        $or: [{
            'manager': req.params.id
        }, {
            'users': req.params.id
        }]
    })
        .exec(function(err, teams) {
            Message
                .find({
                    team: {
                        $in: teams
                    },
                    date: {
                        $gt: req.query.from
                    }
                })
                .sort({
                    'date': -1
                })
                .populate('user', 'first_name surname')
                .populate('team', 'name')
                .exec(function(err, msgs) {
                    if (err) {
                        res.send(409, null);
                    } else {
                        getCommentsCount(msgs, function(messages) {
                            console.log(messages);
                            res.send(200, messages);
                        });
                    };
                });
        });

};
exports.getAllByTeamId = function(req, res) {
    Message
        .find({
            team: req.params.id
        })
        .sort({
            'date': -1
        })
        .populate('user', 'first_name surname')
        .populate('team', 'name')
        .exec(function(err, msgs) {
            if (err) {
                res.send(409, null);
            } else {
                getCommentsCount(msgs, function(messages) {
                    console.log(messages);
                    res.send(200, messages);
                });
            };
        });
};

function getCommentsCount(msgs, cb) {
    var messages = [];
    msgs.forEach(function(msg) {
        var m = msg.toObject();
        m.commentcount = m.comments.length;
        delete m.comments;
        messages.push(m);
    });
    cb(messages);
};
