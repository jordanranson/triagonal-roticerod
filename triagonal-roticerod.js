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

    function jitter(value, magnitude) {
        return value + ((Math.random() * (magnitude*2)) - magnitude);
    }

    function generateGrid(params) {
        var grid        = [];
        var h           = Math.sqrt(3) / 2; // height of an equilateral triangle
        var rows        = params.rows || 5;
        var cols        = params.cols || 5;
        var magnitude   = params.magnitude || 0.15; // 15% point randomization
        var row, col, o;

        for(var y = 0; y < rows; y++) {
            row = [];
            o = y % 2 === 0 ? 0 : 0.5; // 50% offset on odd rows to make a triangle shape
            o = 0;
            grid.push(row);

            for(var x = 0; x < cols; x++) {
                col = {
                    x: jitter(x+o, magnitude),
                    y: jitter(y*h, magnitude)
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

    function drawEven(context, grid, scale, x, y, params) {
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

    function drawOdd(context, grid, scale, x, y, params) {
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

    function drawTriangles(context, grid, width, height, params) {
        var length = width > height ? width : height;
        var scale = length / (width > height ? grid[0].length : grid.length);

        for(var y = 0; y < grid.length; y++) {
            for(var x = 0; x < grid[y].length; x++) {
                y % 2 === 0 ?
                    drawEven(context, grid, scale, x, y, params) :
                    drawOdd(context, grid, scale, x, y, params);
            }
        }
    }

    Triagonal.generate = function(params) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var width, height, grid;

        setupCanvas(canvas, params);
        width = canvas.width;
        height = canvas.height;

        grid = generateGrid(params);
        drawTriangles(context, grid, width, height, params);

        return canvas;
    };
})();