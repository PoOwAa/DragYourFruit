// Constructor for Shape objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Shape(x, y, name, property, value, w, h, fill) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.name = name || "a";
    this.property = property || [];
    this.value = value || [];
    this.fill = fill || '#1BBC9B';
}

// Draws this shape to a given context
Shape.prototype.draw = function(ctx) {
    var maxw = 0;
    var rowh = 20;
    var i=1;
    // write the text
    // object name
    ctx.globalCompositeOperation='destination-over';
    ctx.font = "15px Open Sans";
    ctx.fillStyle = '#FFFFFF';
    ctx.textBaseline = "top";
    ctx.fillText(this.name, this.x, this.y);
    if (maxw < ctx.measureText(this.name).width) {
        maxw = ctx.measureText(this.name).width;
    }

    for (var prop in this.property) {
        ctx.fillText(this.property[prop], this.x, this.y+rowh*i);
        //console.log(this.property[prop]);
        if (maxw < ctx.measureText(this.property[prop]).width) {
            maxw = ctx.measureText(this.property[prop]).width;
        }
        i++;

        for (var val in this.value) {
            ctx.fillText(this.value[prop], this.x, this.y+rowh*i);
            //console.log(this.value[prop]);
            if (maxw < ctx.measureText(this.value[prop]).width) {
                maxw = ctx.measureText(this.value[prop]).width;
            }
            i++;
            break;
        }
    }
    // draw the shape
    this.h = rowh*i;
    this.w = maxw+10;

    ctx.fillStyle = this.fill;
    ctx.fillRect(this.x, this.y, this.w, this.h);

}

// Determine if a point is inside the shape's bounds
Shape.prototype.contains = function(mx, my) {
    // All we have to do is make sure the Mouse X,Y fall in the area between
    // the shape's X and (X + Width) and its Y and (Y + Height)
    return  (this.x <= mx) && (this.x + this.w >= mx) &&
        (this.y <= my) && (this.y + this.h >= my);
}

function CanvasState(canvas) {
    // **** First some setup! ****

    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
    // when there's a border or padding. See getMouse for more detail
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {
        this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
        this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
        this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
        this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
    }
    // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
    // They will mess up mouse coordinates and this fixes that
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;

    // **** Keep track of state! ****

    this.valid = false; // when set to false, the canvas will redraw everything
    this.shapes = [];  // the collection of things to be drawn
    this.dragging = false; // Keep track of when we are dragging
    // the current selected object. In the future we could turn this into an array for multiple selection
    this.selection = null;
    this.dragoffx = 0; // See mousedown and mousemove events for explanation
    this.dragoffy = 0;

    // **** Then events! ****

    var myState = this;

    //fixes a problem where double clicking causes text to get selected on the canvas
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
    // Up, down, and move are for dragging
    canvas.addEventListener('mousedown', function(e) {
        var mouse = myState.getMouse(e);
        var mx = mouse.x;
        var my = mouse.y;
        var shapes = myState.shapes;
        var l = shapes.length;
        for (var i = l-1; i >= 0; i--) {
            if (shapes[i].contains(mx, my)) {
                var mySel = shapes[i];
                // Keep track of where in the object we clicked
                // so we can move it smoothly (see mousemove)
                myState.dragoffx = mx - mySel.x;
                myState.dragoffy = my - mySel.y;
                myState.dragging = true;
                myState.selection = mySel;
                myState.valid = false;
                //console.log(shapes[i].x);
                return;
            }
        }
        // havent returned means we have failed to select anything.
        // If there was an object selected, we deselect it
        if (myState.selection) {
            myState.selection = null;
            myState.valid = false; // Need to clear the old selection border
        }
    }, true);
    canvas.addEventListener('mousemove', function(e) {
        if (myState.dragging){
            var mouse = myState.getMouse(e);
            // We don't want to drag the object by its top-left corner, we want to drag it
            // from where we clicked. Thats why we saved the offset and use it here
            myState.selection.x = mouse.x - myState.dragoffx;
            myState.selection.y = mouse.y - myState.dragoffy;
            myState.valid = false; // Something's dragging so we must redraw
        }
    }, true);
    canvas.addEventListener('mouseup', function(e) {
        myState.dragging = false;
    }, true);

    // click on menu for making new fruit shape
    drawFruit = function(fruit) {
        var minifruit = new Shape(1, 1, fruit);

        for (var prop in globalFruits[fruit]) {

                minifruit.property.push(prop);
                //console.log(prop);

                for (var val in globalFruits[fruit][prop]) {
                    minifruit.value.push(globalFruits[fruit][prop][val]);
                    //console.log(globalFruits[fruit][prop][val]);
                    break;
                }

        }

        myState.addShape(minifruit);
        console.log(minifruit);

    };

    // **** Options! ****

    this.selectionColor = '#CC0000';
    this.selectionWidth = 2;
    this.interval = 1;
    setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.addShape = function(shape) {
    this.shapes.push(shape);
    this.valid = false;
}

CanvasState.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by the code
CanvasState.prototype.draw = function() {
    // if our state is invalid, redraw and validate!
    if (!this.valid) {
        var ctx = this.ctx;
        var shapes = this.shapes;
        this.clear();

        // draw all shapes
        var l = shapes.length;
        for (var i = 0; i < l; i++) {
            var shape = shapes[i];
            // We can skip the drawing of elements that have moved off the screen:
            if (shape.x > this.width || shape.y > this.height ||
                shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
            shapes[i].draw(ctx);
        }

        // draw selection
        if (this.selection != null) {
            ctx.strokeStyle = this.selectionColor;
            ctx.lineWidth = this.selectionWidth;
            var mySel = this.selection;
            ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
        }

        this.valid = true;
    }
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
    var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

    // Compute the total offset
    if (element.offsetParent !== undefined) {
        do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
        } while ((element = element.offsetParent));
    }

    // Add padding and border style widths to offset
    // Also add the <html> offsets in case there's a position:fixed bar
    offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
    offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

    mx = e.pageX - offsetX;
    my = e.pageY - offsetY;

    // We return a simple javascript object (a hash) with x and y defined
    return {x: mx, y: my};
}




function canvasInit() {
    var s = new CanvasState(document.getElementById('fruitCanvas'));
}