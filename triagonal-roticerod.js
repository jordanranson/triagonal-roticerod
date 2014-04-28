//The MIT License (MIT)
//
//Copyright (c) 2014 Jordan Ranson
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in
//all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//THE SOFTWARE.

Triagonal = {};

(function(){

    var _height = Math.sqrt(3) / 2; // height of an equilateral triangle
    var _gradientScale = 100;

    function setupCanvas(canvas, context, params) {
        var tHeight = params.width/params.scale;
        var height, offset;

        canvas.width = params.width;
        canvas.height = params.height;

        context.translate(0, -(tHeight*_height));
        if(params.width > params.height) {
            tHeight *= _height;
            height = params.height/tHeight;
            offset = height - (height << 0);
            offset = (tHeight - (offset*tHeight)) / 2;

            context.translate(0, -offset);
        } else {
            tHeight = params.height/params.scale;
            height = params.width/tHeight;
            offset = height - (height << 0);
            offset = (tHeight - (offset*tHeight)) / 2;

            context.translate(-(tHeight+offset), 0);
        }
    }

    function jitter(value, magnitude) {
        return value + ((Math.random() * (magnitude*2)) - magnitude);
    }

    function generateGrid(params) {
        var grid      = [];
        var magnitude = params.magnitude;
        var length    = params.scale + 2;
        var row, col, o;

        for(var y = 0; y < length; y++) {
            row = [];
            o = y % 2 === 1 ? 0 : 0.5; // 50% offset on odd rows to make a triangle shape
            grid.push(row);

            for(var x = -1; x < length; x++) {
                col = {
                    x: jitter(x+o, magnitude),
                    y: jitter(y*_height, magnitude)
                }
                row.push(col);
            }
        }

        return grid;
    }

    function makeColor(data) {
        var color = [
            'rgb(',
            data[0],
            ',',
            data[1],
            ',',
            data[2],
            ')'
        ];

        return color.join('');
    }

    // returns a random pixel position within a threshold from a gradient
    // used to randomize the vertex colours in each row
    function grdPos(y,a,s) { // a = gradientVariance, s = scale
        var b = a / 2;
        var result = ((y*_gradientScale)+(_gradientScale/2)) + ((Math.random()*a)-b);
        return result < 0 ? 0 : result > _gradientScale*s ? _gradientScale*s : result;
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

    function drawVertex(context, x, y, params, drawingMode) {
        var grid = params.grid;
        if(!(grid[y+1] && grid[y+1][x+1])) return;

        var scale = params.size;
        var color = params.shadeCtx.getImageData(0, grdPos(y,params.shadeVariance,params.scale), 1, 1);

        var p1, p2, p3;

        if(drawingMode === 'even') {
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
            drawPolygon(context, p1, p2, p3, makeColor(color.data));

            color = params.shadeCtx.getImageData(0, grdPos(y,params.shadeVariance,params.scale), 1, 1);
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
            drawPolygon(context, p1, p2, p3, makeColor(color.data));
        }
        else if(drawingMode === 'odd') {
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
            drawPolygon(context, p1, p2, p3, makeColor(color.data));

            color = params.shadeCtx.getImageData(0, grdPos(y,params.shadeVariance,params.scale), 1, 1);
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
            drawPolygon(context, p1, p2, p3, makeColor(color.data));
        }
    }

    function drawOdd(context, x, y, params) {
        drawVertex(context, x, y, params, 'odd');
    }

    function drawEven(context, x, y, params) {
        drawVertex(context, x, y, params, 'even');
    }

    function drawBackground(context, width, y, params) {
        var colorData = params.shadeCtx.getImageData(0, (y*_gradientScale)+(_gradientScale/2), 1, 1).data;

        width *= params.size;
        y *= params.size;

        context.fillStyle = makeColor(colorData);
        context.fillRect(-1, y-1, width+1, params.size+1);
    }

    function drawTriangles(context, params) {
        for(var y = 0; y < params.grid.length; y++) {
            drawBackground(context, params.grid[y].length, y, params);
            for(var x = 0; x < params.grid[y].length; x++) {
                y % 2 === 0 ?
                    drawEven(context, x, y, params) :
                    drawOdd(context, x, y, params);
            }
        }
    }

    Triagonal.generate = function(params) {
        var delta, end, start = new Date().getTime();

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

        params.scale        = params.scale || 10;
        params.scale       *= params.width > params.height ? 1 : _height;
        params.size         = params.width > params.height ?
            params.width / params.scale :
            params.height / params.scale;
        params.magnitude    = params.magnitude >= 0 ? params.magnitude : 0.15; // 15% point randomization
        params.grid         = params.grid || generateGrid(params);
        params.shadeVariance= params.shadeVariance ? params.shadeVariance * (params.size*5) : 100;
        params.shade        = params.shade(params.scale+2, params.shadeVariance);
        params.shadeCtx     = params.shade.getContext('2d');

        setupCanvas(canvas, context, params);
        drawTriangles(context, params);

        end = new Date().getTime();
        delta = end - start;
        //console.log('time took to process...', delta);

        return canvas;
    };

    Triagonal.createShade = function(from, to) {
        return function(rows, variance) {
            rows *= _gradientScale;

            var canvas = document.createElement('canvas');
                canvas.height = rows;
                canvas.width = 1;
            var context = canvas.getContext('2d');
            var gradient = context.createLinearGradient(0,0,0,rows);

            gradient.addColorStop(0,from);
            gradient.addColorStop(1,to);

            context.fillStyle = gradient;
            context.fillRect(0,0,1,rows);

            return canvas;
        }
    };

    Triagonal.getColorFromShade = function(shade, position) {
        var canvas = shade(1);
        var position = position < 0 ? 0 : position > 100 ? 100 : position;
        var color = canvas.getContext('2d').getImageData(0, position, 1, 1);

        return makeColor(color.data);
    }
})();
