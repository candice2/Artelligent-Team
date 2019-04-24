
// //console.log(tf);
// async function load(){
//     model = await tf.loadModel('model/model.json');
//     //console.log(model);
// }

// load();
// coords = [];
// var mbb = {};
// //the minimum boudning box around the current drawing

// //cacluate the dpi of the current window 
// //const canvas = document.querySelector( '.js-paint' );
// const canvas = new fabric.Canvas("myCanvas",{
//     isDrawingMode: true
//   });
// const ctx = canvas.getContext( '2d' );
// //ctx.square(300,300);
// //ctx.rect(100,100,128,128);
// const dpi = window.devicePixelRatio
// //extract the image data 

// var i = 0;
// function charu(){
    
//     // const imgData = ctx.getImageData(mbb.min.x * dpi, mbb.min.y * dpi,
//     //     (mbb.max.x - mbb.min.x) * dpi, (mbb.max.y - mbb.min.y) * dpi);
//     const imgData = ctx.getImageData(0,0,300,300);
    
//         var tfImg = tf.fromPixels(imgData, 1);
//         var smalImg = tf.image.resizeBilinear(tfImg, [28, 28]);
//         smalImg = tf.cast(smalImg, 'float32');
//         var tensor = smalImg.expandDims(0);
//         tensor = tensor.div(tf.scalar(255));
//         const prediction = model.predict(tensor);
//         const predictedValues = prediction.dataSync();
        


//         var isThereAnyPrediction = false;
//         for (index = 0; index < predictedValues.length; index++) {
//             if (predictedValues[index] > 0.5) {
//                 isThereAnyPrediction = true;
//                 console.log("predicted: ");
//                 console.log(index);
//             }
//         }
//         if (!isThereAnyPrediction) {
//             console.log("no prediction");
//         }

       

    // function preprocess(imgData)
    // {
    // return tf.tidy(()=>{
    //     //convert the image data to a tensor 
        
    //     let tensor = tf.fromPixels(imgData, 1)
    //    // sess = tf.Session();
    //     //console.log(tensor.toTensor().print());
    //     //console.log(tf.tensor(tensor).print());
    //     //resize to 28 x 28 
    //     const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat()
    //     // Normalize the image 
    //     const offset = tf.scalar(255.0);
    //     const normalized = tf.scalar(1.0).sub(resized.div(offset));
        
    //     //We add a dimension to get a batch shape 
    //     const batched = normalized.expandDims(0)
    //     //console.log(batched);
    //     return batched;
    // })
    // }
    
    // const pred = model.predict(preprocess(imgData)).dataSync()
    
    //  console.log("predictions: ");
    //  console.log(pred);
   
//}

// mousePressed = false;
// function recordCoor(event)
// {
//     mousePressed = true;
//   //get current mouse coordinate 

//   var pointer = canvas.getPointer(event.e);
//   var posX = pointer.x;
//   var posY = pointer.y;
  
//   //record the point if withing the canvas and the mouse is pressed 

//   if(posX >=0 && posY >= 0 && mousePressed)  
//   {	  
//     coords.push(pointer) 
//   } 

// }

// function getMinBox(){
	
//     var coorX = coords.map(function(p) {return p.x});
//     var coorY = coords.map(function(p) {return p.y});
  
//     //find top left corner 
//     var min_coords = {
//      x : Math.min.apply(null, coorX),
//      y : Math.min.apply(null, coorY)
//     }
//     //find right bottom corner 
//     var max_coords = {
//      x : Math.max.apply(null, coorX),
//      y : Math.max.apply(null, coorY)
//     }
//     return {
//      min : min_coords,
//      max : max_coords
//     }
//  }

//  function stopDrawing(event){
//     mousePressed = false;
//     mbb = getMinBox();
//     charu();
//  }



const paintCanvas = document.querySelector( '.js-paint' );
const context = paintCanvas.getContext( '2d' );
context.lineCap = 'round';

const colorPicker = document.querySelector( '.js-color-picker');

colorPicker.addEventListener( 'change', event => {
    context.strokeStyle = event.target.value; 
} );

const lineWidthRange = document.querySelector( '.js-line-range' );
const lineWidthLabel = document.querySelector( '.js-range-value' );

lineWidthRange.addEventListener( 'input', event => {
    const width = event.target.value;
    lineWidthLabel.innerHTML = width;
    context.lineWidth = width;
} );


var strokesListX=[];
var strokesListY=[];

let x = 0, y = 0;
let isMouseDown = false;
//required output from sketch

var listOfStrokes=[];

const stopDrawing = () => {
    isMouseDown = false;
    var stroke=[strokesListX,strokesListY];
    listOfStrokes.push(stroke);
    var st = JSON.stringify(listOfStrokes)
    var output = {data:st};
    var myJSON = JSON.stringify(output);

    console.log(myJSON);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
           // document.getElementById("demo").innerHTML = xhttp.responseText;
        }
    };
    xhttp.open("POST", "http://localhost:3000/run", true);
    xhttp.setRequestHeader("content-type", "application/json");
    xhttp.send(myJSON);


    strokesListX=[];
    strokesListY=[];

}

const startDrawing = event => {
    isMouseDown = true;   
   [x, y] = [event.offsetX, event.offsetY];  
   console.log(x);
   console.log(y);
}
const drawLine = event => {

    if ( isMouseDown ) {

        //track all x,y coordinates
        const newX = event.offsetX;
        const newY = event.offsetY;

        console.log("old coordinates:");
        console.log(x);
        console.log(y);

        console.log("new coordinates:");
        console.log(newX);
        console.log(newY);


        context.beginPath();
        //make a line from current x,y to newX, newY
        context.moveTo( x, y );
        context.lineTo( newX, newY );
        context.stroke();



        strokesListX.push(newX);
        strokesListY.push(newY);

        [x, y] = [newX, newY];


    }

}

//canvas.on('mouse:down',recordCoor);
 paintCanvas.addEventListener( 'mousedown', startDrawing );
paintCanvas.addEventListener( 'mousemove', drawLine );
//canvas.on('mouse:move',recordCoor);
//canvas.on( 'mouse:up', stopDrawing );
paintCanvas.addEventListener( 'mouseout', stopDrawing );