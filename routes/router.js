const express = require("express");
const router = express.Router();
let {PythonShell} = require("python-shell");

var sys = require('sys')
var exec = require('child_process').exec;

var downloader = require('./downloader');


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

router.get('/image',function(req,res){
  let imageName = req.query.image;
  downloader.downloadImage(imageName);

  return res.status(200);
});

router.get('/imageUrl',function(req,res){
  let imageName = req.query.image;
  console.log("here");
  let url = downloader.getImageUrl(imageName,res);

  console.log("this is a url" + url);
  //return res.status(200).json(url);
});

module.exports = router;