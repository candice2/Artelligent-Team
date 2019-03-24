const express = require("express");
const router = express.Router();
let {PythonShell} = require("python-shell");

var sys = require('sys')
var exec = require('child_process').exec;


router.post('/run',function(req,res){

    let data = req.body.data;
    // PythonShell.run('train_model2.py',{scriptPath:"/Users/mohitgrover/repos/ai/Artelligent-Team",args: ["--classes_file='training.tfrecord.classes'","--model_dir='/modelV1'","--predict_for_data:'"+data+"'"]}, function(err,results){
    //     if(err) throw err;
    //     console.log(results);
    // });

    console.log(req.body.data);
    console.log("python train_model2.py --classes_file 'training.tfrecord.classes' --model_dir='/model' --predict_for_data='"+data+"'");
    dir = exec("python train_model2.py --classes_file 'training.tfrecord.classes' --model_dir='/model' --predict_for_data='"+data+"'", function(err, stdout, stderr) {
        if (err) {
          // should have err.code here?  
        }
        console.log(stdout);
      });
    console.log("this is dir: " + dir);  
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.send("done");
});

module.exports = router;