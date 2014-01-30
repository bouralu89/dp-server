var mongoose = require('mongoose');
var Team = mongoose.model('Team');
var Task = mongoose.model('Task');

exports.create = function(req, res) {
    var team = req.body;
    var newTeam = new Team({
        name: team.name,
        code: team.code,
        manager: team.manager,
        password: team.password,
        description: team.description
    });
    newTeam.save(function(err, newTeam) {
        if (!err) {
            res.send(201);
        } else {

            if (err.code == 11000) {
                res.send(406);
            } else {
                res.send(409);
            }
        };
    });
};

exports.removeUser = function(req, res) {
    var tid = req.params.id;
    var uid = req.params.uid;
    Team.update({
        '_id': tid
    }, {
        $pull: {
            'users': uid
        }
    }).exec(function(err, val) {
        console.log(err);
        console.log(val);
        if (!err) {
            res.send(200);
        } else {
            res.send(409);
        };
    });
};

exports.getAllByUser = function(req, res) {
    Team
        .find({
            $or: [{
                'manager': req.params.id
            }, {
                'users': req.params.id
            }]
        }, {
            'password': 0
        })
        .populate('manager', 'first_name surname username')
        .exec(function(err, teams) {
            if (teams) {
                res.send(teams);
            } else {
                res.send(409);
            };
        });
};
exports.getAllByManager = function(req, res) {
    Team
        .find({
            'manager': req.params.id
        }, {
            'password': 0
        })
        .exec(function(err, teams) {
            if (teams) {
                res.send(teams);
            } else {
                res.send(409);
            };
        });
};
exports.getAllByUserOnly = function(req, res) {
    Team
        .find({
            'users': req.params.id
        }, {
            'password': 0
        })
        .exec(function(err, teams) {
            if (teams) {
                res.send(teams);
            } else {
                res.send(409);
            };
        });
};
exports.getOne = function(req, res) {
    Team
        .findOne({
            '_id': req.params.id
        }, {
            'password': 0
        })
        .populate('manager', 'first_name surname')
        .exec(function(err, team) {
            if (!err) {
                team.taskCount(function(err, result) {
                    //console.log(result);
                    var t = team.toObject();
                    t.tasksNumber = result.current;
                    t.tasksNumberHistory = result.history;
                    res.send(t);
                });
            } else {
                res.send(409);
            };
        });
};
exports.join = function(req, res) {
    Team.update({
        _id: req.body.team_id
    }, {
        $addToSet: {
            users: req.body.user_id
        }
    }, function(err) {
        if (!err) {
            res.send(201);
        } else {
            res.send(409);
        };
    });
};
exports.update = function(req, res) {
    console.log(req.body);
    var team = req.body;
    if (team.password) {
        Team.update({
            _id: req.params.id
        }, {
            $set: {
                name: team.name,
                code: team.code,
                password: team.password,
                description: team.description
            }
        }, function(err) {
            if (!err) {
                res.send(200);
            } else {
                res.send(409);
            };
        });
    } else {
        Team.update({
            _id: req.params.id
        }, {
            $set: {
                name: team.name,
                code: team.code,
                description: team.description
            }
        }, function(err) {
            if (!err) {
                res.send(200);
            } else {
                res.send(409);
            };
        });
    };

};
exports.search = function(req, res) {
    var data = req.body;
    Team
        .findOne({
            code: data.code,
            password: data.password
        }, {
            'password': 0
        })
        .populate('manager')
        .exec(function(err, team) {
            if (team) {
                res.send(200, team);
            } else {
                res.send(409, null);
            };
        });
};
