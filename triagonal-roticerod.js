Triagonal = {};

(function(){
    function setupCanvas(canvas, params) {
        canvas.width =
            params.width && params.width === 'auto' ?
                window.innerWidth :
                params.width || 300;
        canvas.height =
            params.height && params.height === 'auto' ?
                window.innerHeight :
                params.height || 300;
    }

    function drawTriangle(context, side, cx, cy, fillStyle) {
        var h = side * (Math.sqrt(3)/2);

        context.translate(cx, cy);

        context.beginPath();

        context.moveTo(0, -h / 2);
        context.lineTo( -side / 2, h / 2);
        context.lineTo(side / 2, h / 2);
        context.lineTo(0, -h / 2);

        context.fillStyle = fillStyle;
        context.fill();

        context.closePath();
    }

    function generateGrid(x, y) {

    }

    Triagonal.generate = function(params) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        setupCanvas(canvas, params);
        drawTriangle(context, 100, canvas.width/2, canvas.height/2);

        return canvas;
    };
})();