var mongoose = require('mongoose');
var Team = mongoose.model('Team');
var User = mongoose.model('User');
var Task = mongoose.model('Task');

exports.create = function(req, res) {
    var newTask = new Task(req.body);
    newTask.save(function(err) {
        if (!err) {
            res.send(201);
        } else {
            res.send(409);
        };
    });
};

exports.update = function(req, res) {
    var task = req.body;
    console.log(task);
    Task.update({
        _id: req.params.id
    }, {
        $set: {
            title: task.title,
            endDate: task.endDate,
            text: task.text
        }
    }, function(err) {
        if (!err) {
            res.send(201);
        } else {
            console.log(err);
            res.send(409);
        };
    });
};

exports.get = function(req, res) {
    Task
        .findOne({
            '_id': req.params.id
        })
        .populate('team', 'name _id')
        .exec(function(err, task) {
            if (!err) {
                res.send(task);
            } else {
                res.send(409);
            };
        });
};

exports.delete = function(req, res) {
    Task
        .remove({
            '_id': req.params.id
        }, function(err) {
            if (!err) {
                res.send(200);
            } else {
                res.send(409);
            };
        });
};

exports.getCurrentByTeam = function(req, res) {
    Task
        .find({
            'team': req.params.id,
            'endDate': {
                '$gte': new Date
            }
        })
        .sort({
            endDate: 1
        })
        .exec(function(err, tasks) {
            if (!err) {
                res.send(tasks);
            } else {
                res.send(409);
            };
        });
};

exports.getArchiveByTeam = function(req, res) {
    Task
        .find({
            'team': req.params.id,
            'endDate': {
                '$lt': new Date
            }
        })
        .sort({
            endDate: 1
        })
        .exec(function(err, tasks) {
            console.log(tasks);
            if (!err) {
                res.send(tasks);
            } else {
                res.send(409);
            };
        });
};

exports.getCurrentByUser = function(req, res) {
    Team.find({
        $or: [{
            'manager': req.params.id
        }, {
            'users': req.params.id
        }]
    })
        .exec(function(err, teams) {
            Task
                .find({
                    team: {
                        $in: teams
                    },
                    'endDate': {
                        '$gte': new Date
                    }
                })
                .sort({
                    endDate: 1
                })
                .populate('team', 'name')
                .exec(function(err, tasks) {
                    if (!err) {
                        res.send(tasks);
                    } else {
                        res.send(409, {
                            'error': err
                        });
                    };
                });
        });

};
