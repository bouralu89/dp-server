var mongoose = require('mongoose'),
    async = require('async'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

var Task = mongoose.model('Task');

var teamSchema = new Schema({
    name: String,
    code: {
        type: String,
        unique: true,
        sparse: true
    },
    manager: {
        type: ObjectId,
        ref: 'User'
    },
    users: [{
        type: ObjectId,
        ref: 'User'
    }],
    password: String,
    description: String
});

teamSchema.methods.taskCount = function(cb) {
    var id = this._id;
    async.parallel({
        current: function(callback) {
            Task.find({
                'team': id,
                'endDate': {
                    '$gte': new Date
                }
            }, function(err, tasks) {
                callback(null, tasks.length);
            });
        },
        history: function(callback) {
            Task.find({
                'team': id,
                'endDate': {
                    '$lt': new Date
                }
            }, function(err, tasks) {
                callback(null, tasks.length);
            });
        }
    }, cb);

}

mongoose.model('Team', teamSchema);
