/*
variables
*/
var model;
var canvas;
var classNames = [];
var canvas;
var coords = [];
var mousePressed = false;
var mode;

/*
prepare the drawing canvas 
*/
$(function() {
    canvas = window._canvas = new fabric.Canvas('canvas');
    canvas.backgroundColor = '#ffffff';
    canvas.isDrawingMode = 0;
    canvas.freeDrawingBrush.color = "black";
    canvas.freeDrawingBrush.width = 10;


    var colorPicker = document.getElementById('colorpicker');
   
    
    colorPicker.addEventListener( 'change', event => {
        canvas.freeDrawingBrush.color  = event.target.value; 
  } );


    canvas.renderAll();
    //setup listeners 
    canvas.on('mouse:up', function(e) {
        getFrame();
        mousePressed = false
    });
    canvas.on('mouse:down', function(e) {
       /* var elementId = (e.target || e.srcElement).id;
        console.log(elementId);*/
        mousePressed = true
    });
    canvas.on('mouse:move', function(e) {
        recordCoor(e)
    });
/*    canvas.on('mouse:dblclick', function (event) {
        if (canvas.getActiveObject(img1)) {
            alert(event.target);
        }
    });*/

})

/*
set the table of the predictions 
*/
function setTable(top5, probs) {
    //loop over the predictions 
    for (var i = 0; i < top5.length; i++) {
        let sym = document.getElementById('sym' + (i + 1))
        let prob = document.getElementById('prob' + (i + 1))
        //console.log("prediction: " + sym + " probablility: " + prob);
        
       // sym.innerHTML = top5[i]
       // prob.innerHTML = Math.round(probs[i] * 100)
    }
    //create the pie 
  //  createPie(".pieID.legend", ".pieID.pie");

}

/*
record the current drawing coordinates
*/
function recordCoor(event) {
    var pointer = canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;

    if (posX >= 0 && posY >= 0 && mousePressed) {
        coords.push(pointer)
    }
}

/*
get the best bounding box by trimming around the drawing
*/
function getMinBox() {
    //get coordinates 
    var coorX = coords.map(function(p) {
        return p.x
    });
    var coorY = coords.map(function(p) {
        return p.y
    });

    //find top left and bottom right corners 
    var min_coords = {
        x: Math.min.apply(null, coorX),
        y: Math.min.apply(null, coorY)
    }
    var max_coords = {
        x: Math.max.apply(null, coorX),
        y: Math.max.apply(null, coorY)
    }

    //return as strucut 
    return {
        min: min_coords,
        max: max_coords
    }
}

/*
get the current image data 
*/
function getImageData() {
        //get the minimum bounding box around the drawing 
        const mbb = getMinBox()

        //get image data according to dpi 
        const dpi = window.devicePixelRatio
        const imgData = canvas.contextContainer.getImageData(mbb.min.x * dpi, mbb.min.y * dpi,
                                                      (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);
        return imgData
    }

/*
get the prediction 
*/

function displayImage(min_coors,max_coors,url) {
    console.log("displaying image....");
    fabric.Image.fromURL(url, function (myImg) {
        //i create an extra var for to change some image properties
        var img1 = myImg.set({
            id: "imageId",
            selectable: true,
            left: min_coors.x,
            top: min_coors.y,
            width: max_coors.x - min_coors.x,
            height: max_coors.y - min_coors.y
        });
        img1.scale(0.4);

        canvas.clear();
        canvas.backgroundColor = '#ffffff';

        canvas.add(img1);
        canvas.isDrawingMode = 0;
       /* img1.on(    , function() {
            console.log('selected a circle');
        });*/
        //canvas.renderAll();
    });

}


function showImage(imageName){
    /*imageName="image/apple_0.png"*/
    console.log("imge"+imageName);
    var img = document.createElement("IMG");
    const Http = new XMLHttpRequest();
    //const url="http://localhost:3000/imageUrl?image=" + imageName;
    var url="";
if(imageName === 'apple') {
    var url = "http://localhost:3000/home/images/ai-apple.png";
    document.body.style.backgroundImage = "url('http://localhost:3000/home/images/apple-gif.gif')";
    //document.getElementById("backgroundImages").src="http://localhost:3000/home/images/apple-gif.gif";
}
else if(imageName === "star"){
    var url = "http://localhost:3000/home/images/ai-star.png";
    document.body.style.backgroundImage = "url('http://localhost:3000/home/images/star-gif.gif')";
    // document.getElementById("backgroundImages").src="http://localhost:3000/home/images/star-gif.gif";
}
else if(imageName === "sun"){
    var url = "http://localhost:3000/home/images/ai-sun.png";
    document.body.style.backgroundImage = "url('http://localhost:3000/home/images/sun-gif.gif')";
    //document.getElementById("backgroundImages").src="http://localhost:3000/home/images/sun-gif.gif";
}
else if(imageName === "moon"){
    var url = "http://localhost:3000/home/images/ai-moon.png";
    document.body.style.backgroundImage = "url('http://localhost:3000/home/images/moon-gif.gif')";
    //document.getElementById("backgroundImages").src="http://localhost:3000/home/images/moon-gif.gif";
}
else if(imageName === "clock"){
    var url = "http://localhost:3000/home/images/ai-clock.png";
    document.body.style.backgroundImage = "url('http://localhost:3000/home/images/clock-gif.gif')";
    //document.getElementById("backgroundImages").src="http://localhost:3000/home/images/clock-gif.gif";
}

    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange=(e)=>{
    console.log(url);
    //displayImage({x:400,y:100},{x:1500,y:1500},url);
    displayImage({x:400,y:50},{x:1100,y:1100},url);
    return false;
}

}

//displayImage({x:0,y:0},{x:150,y:150},"https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg");
function getFrame() {
    //make sure we have at least two recorded coordinates 
    if (coords.length >= 2) {

        //get the image data from the canvas 
        const imgData = getImageData()

        let min_coords,max_coords = getMinBox();
        //get the prediction 
        const pred = model.predict(preprocess(imgData)).dataSync()

        //find the top 5 predictions 
        const indices = findIndicesOfMax(pred, 5)
        const probs = findTopValues(pred, 5)
        const names = getClassNames(indices)
        console.log(names);
        console.log(probs);
        var max = 0;
        var maxIdx;
        for (var i=0; i < probs.length; i++){
            console.log(probs[i])
            if (probs[i] > max){
                maxIdx = i;
                max = probs[i];
            }
        }
        var ele = document.getElementById("suggestions");
        var content = "<h3 style='text-align:center;'>Looks like a " + names[maxIdx] + "! Which one am I?</h3>";
        for (var i=0; i < names.length; i++){
            content += "<button style='margin-top: 10px; margin-bottom: 10px; padding-left: 5px; padding-right: 5px; margin-left:10px; margin-right:10px;' onclick=showImage('"+ names[i] +"')>"+ names[i] + "</button>"
        }
        ele.innerHTML = content;
        // console.log(ele);
        // ele.innerHTML = "";
        // var list = document.createElement("ul");
        // for(var i = 0; i < names.length; i++){
        //     var link = document.createElement("a");
        //     link.href = "javascript:showImage('"+names[i]+"');";
        //     var t = document.createTextNode(names[i] + " (" + probs[i] + ")");
        //     link.appendChild(t);
        //     var li = document.createElement("li");
        //     li.appendChild(link);
        //     list.appendChild(li);
        // }
        // ele.appendChild(list);
        //set the table 
        setTable(names, probs)
    }

}

/*
get the the class names 
*/
function getClassNames(indices) {
    var outp = []
    for (var i = 0; i < indices.length; i++)
        outp[i] = classNames[indices[i]]
    return outp
}

/*
load the class names 
*/
async function loadDict() {
    if (mode == 'ar')
        loc = 'model2/class_names_ar.txt'
    else
        loc = 'model2/class_names.txt'
    
    await $.ajax({
        url: loc,
        dataType: 'text',
    }).done(success);
}

/*
load the class names
*/
function success(data) {
    const lst = data.split(/\n/)
    for (var i = 0; i < lst.length - 1; i++) {
        let symbol = lst[i]
        classNames[i] = symbol
    }
}

/*
get indices of the top probs
*/
function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
        outp.push(i); // add index to output array
        if (outp.length > count) {
            outp.sort(function(a, b) {
                return inp[b] - inp[a];
            }); // descending sort the output array
            outp.pop(); // remove the last index (index of smallest element in output array)
        }
    }
    return outp;
}

/*
find the top 5 predictions
*/
function findTopValues(inp, count) {
    var outp = [];
    let indices = findIndicesOfMax(inp, count)
    // show 5 greatest scores
    for (var i = 0; i < indices.length; i++)
        outp[i] = inp[indices[i]]
    console.log(outp);
    return outp
}

/*
preprocess the data
*/
function preprocess(imgData) {
    return tf.tidy(() => {
        //convert to a tensor 
        let tensor = tf.fromPixels(imgData, numChannels = 1)
        
        //resize 
        const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()
        
        //normalize 
        const offset = tf.scalar(255.0);
        const normalized = tf.scalar(1.0).sub(resized.div(offset));

        //We add a dimension to get a batch shape 
        const batched = normalized.expandDims(0)
        return batched
    })
}

/*
load the model
*/
async function start(cur_mode) {
    //arabic or english
    mode = cur_mode
    
    //load the model 
    model = await tf.loadModel('model2/model.json')
    
    //warm up 
    model.predict(tf.zeros([1, 28, 28, 1]))
    
    //allow drawing on the canvas 
    allowDrawing()
    
    //load the class names
    await loadDict()
}

/*
allow drawing on canvas
*/
function allowDrawing() {
    canvas.isDrawingMode = 1;
    // if (mode == 'en')
    //    // document.getElementById('status').innerHTML = 'Model Loaded';
    // else
    //     document.getElementById('status').innerHTML = 'تم التحميل';
    $('button').prop('disabled', false);
    var slider = document.getElementById('myRange');
    slider.oninput = function() {
        canvas.freeDrawingBrush.width = this.value;
    };
}

/*
clear the canvs 
*/
function erase() {
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    coords = [];
}
