var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

var messageSchema = new Schema({
    text: String,
    user: {
        type: ObjectId,
        ref: 'User'
    },
    team: {
        type: ObjectId,
        ref: 'Team'
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [{
        text: String,
        date: {
            type: Date,
            default: Date.now
        },
        user: {
            type: ObjectId,
            ref: 'User'
        }
    }]
});

mongoose.model('Message', messageSchema);
