var messages = require('../controllers/messages'),
    tasks = require('../controllers/tasks'),
    users = require('../controllers/users'),
    teams = require('../controllers/teams'),
    comments = require('../controllers/comments'),
    images = require('../controllers/images');

module.exports = function(passport, app) {

    var auth = passport.authenticate('basic', {
        session: false,
        failureRedirect: '/fail'
    });

    // ----------------------------------------------------------------------------------------------
    //                                    AppRoutes 
    // ----------------------------------------------------------------------------------------------

    app.get('/app', function(req, res) {
        res.render('index.html');
    });

    // ----------------------------------------------------------------------------------------------
    //                                    MessagesRoutes 
    // ----------------------------------------------------------------------------------------------

    app.post('/messages', auth, messages.create);
    app.get('/messages/:id/comments', auth, comments.getComments);
    app.post('/messages/:id/comments', auth, comments.addComment);

    // ----------------------------------------------------------------------------------------------
    //                                    TeamsRoutes 
    // ----------------------------------------------------------------------------------------------

    app.post('/team', auth, teams.create);
    app.get('/team/user/:id', auth, teams.getAllByUser);
    app.get('/team/manager/:id', auth, teams.getAllByManager);
    app.get('/team/:id', auth, teams.getOne);
    app.put('/team/:id', auth, teams.update);
    
    app.get('/team/:id/tasks', auth, tasks.getCurrentByTeam);
    app.get('/team/:teamid/tasks/:id', auth, tasks.get);
    app.put('/team/:teamid/tasks/:id', auth, tasks.update);
    app.delete('/team/:teamid/tasks/:id', auth, tasks.delete);

    app.get('/team/:id/messages', auth, messages.getAllByTeamId);

    app.get('/team/:id/img', images.getTeamImg);
    app.post('/team/:id/img', images.createTeamImg);
    app.get('/team/:id/users', auth, users.getByTeam);
    app.delete('/team/:id/users/:uid', auth, teams.removeUser);
    app.get('/team/:id/messages', auth, messages.getAllByTeamId);
    app.post('/team/search', auth, teams.search);
    app.post('/team/join', auth, teams.join);

    // ----------------------------------------------------------------------------------------------
    //                                    TasksRoutes 
    // ----------------------------------------------------------------------------------------------

    app.post('/task', auth, tasks.create);
    app.put('/task/:id', auth, tasks.update);
    app.delete('/task/:id', auth, tasks.delete);
    app.get('/task/:id', auth, tasks.get);
    app.get('/task/team/:id', auth, tasks.getCurrentByTeam);
    app.get('/task/team/:id/archive', auth, tasks.getArchiveByTeam);
    app.get('/task/user/:id', auth, tasks.getCurrentByUser);

    // ----------------------------------------------------------------------------------------------
    //                                    AuthRoutes, UserRoutes 
    // ----------------------------------------------------------------------------------------------

    app.get('/login', auth, users.checkLogin);
    app.post('/login', users.login);
    app.post('/users', users.create);
    app.get('/user/:id', auth, users.getOne);
    app.put('/user/:id', auth, users.update);
    app.get('/user/:id/img', images.getUserImg);
    app.post('/user/:id/img', images.createUserImg);
    app.get('/user/:id/teams/manager', auth, teams.getAllByManager);
    app.get('/user/:id/teams/user', auth, teams.getAllByUserOnly);
    app.get('/user/:id/messages', auth, messages.getAllByUserId);
    app.get('/user/:id/newmessages', auth, messages.getNewByUserId);

    // ----------------------------------------------------------------------------------------------
    //                                    OtherRoutes 
    // ----------------------------------------------------------------------------------------------

    app.get('/fail', function(req, res) {
        console.log('Auth failed');
        res.send(401);
    });

}
