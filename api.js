var mongoose = require('mongoose'); 
var express = require('express'); 
var router = express.Router(); 
const env = require('node-env-file');// .env file

env(__dirname + '/.env');
var TaskModel = require('./task_schema'); 

// Connecting to database 
var query = 'mongodb+srv://'+process.env.DBMONGOUSER+':'+process.env.DBMONGOPASS+'@'+process.env.DBMONGOSERV+'/'+process.env.DBMONGO+'?retryWrites=true&w=majority';

//'mongodb+srv://dbmongog1:lorena@cluster0.2cz3y.mongodb.net/dbmongog1?retryWrites=true&w=majority'

console.log(query)
const db = (query); 
mongoose.Promise = global.Promise; 

mongoose.connect(db, { useNewUrlParser : true, 
useUnifiedTopology: true }, function(error) { 
	if (error) { 
		console.log("Error!" + error); 
	} else{
        console.log("Conexion a la base de datos exitosa");
    }
}); 


//metodo get de consultar todas las tareas

router.get('/all-task', function(req, res) {
    TaskModel.find(function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    });  
 });

// consultar una sola tarea

router.get('/get-task/:TaskId', function (req, res){
    TaskModel.findOne({ TaskId: req.params.TaskId }, function (err, data) {
        if (err) { 
            console.log(err);
            res.send("internal error");
        } else { 
            res.send(data);
        }
    });
});




// guarda una tarea

router.post('/create-task', function(req, res) {

    let task_id = req.body.TaskId;
    let name = req.body.Name;
    let deadline = req.body.Deadline;

    let task= {
        TaskId:task_id, 
        Name:name, 
        Deadline: deadline
    }

    var newTask = new TaskModel(task);



    newTask.save(function(err, data) {
        if(err) {
            console.log(error);
        }
        else {
            res.send("Data inserted");
        }
    });
});


// modificar una tarea
router.post('/update-task', function(req, res) {
    TaskModel.findOneAndUpdate({TaskId: req.body.TaskId }, {
        Name: req.body.Name,
        Deadline:  req.body.Deadline
    }, function (err, data){
        if (err){
            console.log(err);
        }else{
            res.send(data);
            console.log("Data Deleted!");
        }
     });  
});

//metodo postborra una tarea con el cofigo del identificador

//router.post('/delete-task', function(req, res) {
//    TaskModel.findByIdAndDelete((req.body.id), 
//    function(err, data) {
//        if(err){
//            console.log(err);
//            res.send("internal error");
//        }
//        else{
//            res.send(data);
//            console.log("Data Deleted!");
//        }
//    });  
//});

//metodo post borra una tarea con solo decir delete-task

router.delete('/delete-task', function(req, res) {
    TaskModel.deleteOne({TaskId: req.body.TaskId },  
    function(err, data) {
        if(err){
            console.log(err);
            res.send("internal error");
        }
        else{
            res.send(data);
            console.log("Data Deleted!");
        }
    });  
});


module.exports = router;
