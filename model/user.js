var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var async = require('async');
var Team = mongoose.model('Team');

var userSchema = new Schema({
    first_name: String,
    surname: String,
    username: {
        type: String,
        unique: true,
        sparse: true
    },
    password: String,
    email: String,
    phoneNumber: String
});

userSchema.methods.getTeamsCount = function(id, cb) {
    async.parallel({
        manager: function(callback) {
            Team.find({
                'manager': id
            }, function(err, teams) {
                callback(null, teams.length);
            });
        },
        user: function(callback) {
            Team.find({
                'users': id
            }, function(err, teams) {
                callback(null, teams.length);
            });
        }
    }, cb);
}

mongoose.model('User', userSchema);
