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

    var myJSON = JSON.stringify(listOfStrokes);

    console.log(myJSON);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            document.getElementById("demo").innerHTML = xhttp.responseText;
        }
    };
    xhttp.open("POST", "localhost:3000/run", true);
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

paintCanvas.addEventListener( 'mousedown', startDrawing );
paintCanvas.addEventListener( 'mousemove', drawLine );
paintCanvas.addEventListener( 'mouseup', stopDrawing );
//paintCanvas.addEventListener( 'mouseout', stopDrawing );