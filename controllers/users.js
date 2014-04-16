var mongoose = require('mongoose');
var User = mongoose.model('User');
var Team = mongoose.model('Team');

exports.checkLogin = function(req, res){
    if (req.user) {
        res.send(200, req.user);
    } else {
        res.send(401);
    };
};

exports.login = function(req, res) {
    User.findOne({
        username: req.body.username
    }, function(err, user) {
        if (err) {
            res.send(500, {
                'error': 'An error has occurred'
            });
        }
        if (!user) {
            res.send(401, {
                'error': 'Username does not exist'
            });
        } else {
            if (user.password != req.body.password) {
                res.send(401, {
                    'error': 'Wrong password'
                });
            } else {
                res.json({
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    phoneNumber: user.phoneNumber
                });
            }
        }
    });
};

exports.create = function(req, res) {
    var newUser = new User(req.body);
    newUser.save(function(err) {
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

exports.getOne = function(req, res) {
    var id = req.params.id;
    User.findOne({
        '_id': id
    }, {
        'password': 0
    }, function(err, user) {
        user.getTeamsCount(id, function(err, result) {
            var userObj = user.toObject();
            userObj.teams = {
                'manager': result.manager,
                'user': result.user
            }
            if (!err) {
                res.send(userObj);
            } else {
                res.send(409);
            };
        })
    });
};

exports.update = function(req, res) {
    var user = req.body;
    console.log(user);
    if (user.password) {
        User.update({
            _id: req.params.id
        }, {
            $set: {
                firstName: user.firstName,
                lastName: user.lastName,
                password: user.password,
                phoneNumber: user.phoneNumber,
                email: user.email
            }
        }, function(err) {
            if (!err) {
                res.send(200);
            } else {
                res.send(409);
            };
        });
    } else {
        User.update({
            _id: req.params.id
        }, {
            $set: {
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                email: user.email
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

exports.getByTeam = function(req, res) {
    Team
        .findOne({
            '_id': req.params.id
        })
        .populate('users', 'firstName lastName username')
        .exec(function(err, team) {
            if (!err) {
                res.json(team.users);
            } else {
                res.send(409);
            };
        });
};
