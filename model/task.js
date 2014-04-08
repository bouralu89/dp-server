var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

var taskSchema = new Schema({
    text: String,
    title: String,
    team: {
        type: ObjectId,
        ref: 'Team'
    },
    creator: {
        type: ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    }
});

mongoose.model('Task', taskSchema);