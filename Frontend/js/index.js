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

let x = 0, y = 0;
let isMouseDown = false;

const stopDrawing = () => { isMouseDown = false; }
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
        [x, y] = [newX, newY];
    }
}

paintCanvas.addEventListener( 'mousedown', startDrawing );
paintCanvas.addEventListener( 'mousemove', drawLine );
paintCanvas.addEventListener( 'mouseup', stopDrawing );
paintCanvas.addEventListener( 'mouseout', stopDrawing );