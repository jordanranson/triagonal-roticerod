Triagonal = {};

(function(){

    var _height = Math.sqrt(3) / 2; // height of an equilateral triangle

    function setupCanvas(canvas, params) {
        canvas.width = params.width;
        canvas.height = params.height;
    }

    function jitter(value, magnitude) {
        return value + ((Math.random() * (magnitude*2)) - magnitude);
    }

    function generateGrid(params) {
        var grid      = [];
        var magnitude = params.magnitude;
        var length    = params.scale + 1;
        var row, col, o;

        for(var y = 0; y < length; y++) {
            row = [];
            o = y % 2 === 1 ? 0 : 0.5; // 50% offset on odd rows to make a triangle shape
            grid.push(row);

            for(var x = 0; x < length; x++) {
                col = {
                    x: jitter(x, magnitude),
                    y: jitter(y, magnitude)
                }
                row.push(col);
            }
        }

        return grid;
    }

    function drawPolygon(context, p1, p2, p3, fillStyle) {
        context.beginPath();

        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.lineTo(p3.x, p3.y);

        context.fillStyle = fillStyle;
        context.fill();
        context.closePath();
    }

    function drawEven(context, x, y, params) {
        var grid = params.grid;
        var scale = params.width > params.height ?
            (params.width / params.scale) :
            (params.height / params.scale)
        var p1, p2, p3;

        if(!(grid[y+1] && grid[y+1][x+1])) return;

        p1 = {
            x: grid[y][x].x * scale,
            y: grid[y][x].y * scale
        };
        p2 = {
            x: grid[y+1][x].x * scale,
            y: grid[y+1][x].y * scale
        };
        p3 = {
            x: grid[y+1][x+1].x * scale,
            y: grid[y+1][x+1].y * scale
        };
        drawPolygon(context, p1, p2, p3, '#f00');

        p1 = {
            x: grid[y][x].x * scale,
            y: grid[y][x].y * scale
        };
        p2 = {
            x: grid[y+1][x+1].x * scale,
            y: grid[y+1][x+1].y * scale
        };
        p3 = {
            x: grid[y][x+1].x * scale,
            y: grid[y][x+1].y * scale
        };
        drawPolygon(context, p1, p2, p3, '#00f');
    }

    function drawOdd(context, x, y, params) {
        var grid = params.grid;
        var scale = params.width > params.height ?
            (params.width / params.scale):
            (params.height / params.scale)
        var p1, p2, p3;

        if(!(grid[y+1] && grid[y+1][x+1])) return;

        p1 = {
            x: grid[y][x].x * scale,
            y: grid[y][x].y * scale
        };
        p2 = {
            x: grid[y+1][x].x * scale,
            y: grid[y+1][x].y * scale
        };
        p3 = {
            x: grid[y][x+1].x * scale,
            y: grid[y][x+1].y * scale
        };
        drawPolygon(context, p1, p2, p3, '#ff0');

        p1 = {
            x: grid[y][x+1].x * scale,
            y: grid[y][x+1].y * scale
        };
        p2 = {
            x: grid[y+1][x].x * scale,
            y: grid[y+1][x].y * scale
        };
        p3 = {
            x: grid[y+1][x+1].x * scale,
            y: grid[y+1][x+1].y * scale
        };
        drawPolygon(context, p1, p2, p3, '#0f0');
    }

    function drawTriangles(context, params) {
        for(var y = 0; y < params.grid.length; y++) {
            for(var x = 0; x < params.grid[y].length; x++) {
                y % 2 === 0 ?
                    drawEven(context, x, y, params) :
                    drawOdd(context, x, y, params);
            }
        }
    }

    Triagonal.generate = function(params) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        params = params || {};

        // width & height
        params.width        = params.width && params.width === 'auto' ?
            window.innerWidth :
            params.width || 300;
        params.height       = params.height && params.height === 'auto' ?
            window.innerHeight :
            params.height || 300;

        params.scale        = params.scale    || 10;
        params.magnitude    = params.magnitude >= 0 ? params.magnitude : 0.15; // 15% point randomization
        params.grid         = params.grid     || generateGrid(params);

        console.log(params);

        setupCanvas(canvas, params);
        drawTriangles(context, params);

        return canvas;
    };
})();