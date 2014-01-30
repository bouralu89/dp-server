var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var _ = require('underscore')._;

exports.getComments = function(req, res) {
    var id = req.params.id;
    Message
        .findOne({
            '_id': id
        })
        .populate('comments.user', 'first_name surname username')
        .exec(function(err, msg) {
            if (!err) {
            	var sorted = _.sortBy(msg.comments, function(c){ c.date }).reverse();
                res.send(sorted);
            } else {
                console.log(err);
                res.send(409)
            };
        });
}
exports.addComment = function(req, res) {
    var id = req.params.id;
    var comment = req.body;
    Message.update({
        '_id': id
    }, {
        $addToSet: {
            comments: comment
        }
    }, function(err) {
        if (!err) {
            res.send(200);
        } else {
            console.log(err);
            res.send(409)
        };

    });
}
