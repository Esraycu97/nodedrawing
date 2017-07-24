$(function(){

    //dom objects
    var win = $(window);

    //initialize canvas
    var canvas = $('#canvas');
    var ctx = canvas[0].getContext('2d');
    var width = win.width();
    var height = win.height();
    canvas.attr('width',width);
    canvas.attr('height',height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0,width,height);

    //vars in the app
    var name = prompt('What\'s your name?','');
    var socket = io();
    var block = $('#block');
    var color = 'black';
    var thickness = 1;
    var id = Math.round($.now()*Math.random()); // Generate an unique ID
    var users = {};
    var afk_time = 10000; // time in seconds to remove afk users
    var cursors = {};
    var mouse = {
    	click : false,
    	draw : false,
    	pos : {},
    	pos_prev : {}
    }

    var sideSize = navResize();
    $('#color-ul li a').on('click',function(){
        color = $(this).attr('data-color');
    });
    $('#demoDropdown li a').on('click',function(){
        $(this).sideNav('hide');
        thickness = $(this).attr('data-thick');
    });

    function navResize(){
        var elSize = {};
        if(win.width() >= 1024){
            width = win.width() - $('.side-nav').width();
            elSize.width = $('.side-nav').width();
            elSize.height = 0;
        } else {
            height = win.height() - Math.round($('.nav-bar').height());
            elSize.width = 0;
            elSize.height = Math.round($('.nav-bar').height());
        }
        return elSize;
    }

    function draw(mx, my, lx, ly,c,t){
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = t;
        ctx.moveTo(mx, my);
        ctx.lineTo(lx, ly);
        ctx.stroke();
        ctx.closePath();
    }
    
    //event resize
    win.on('resize',function(e){
        width = $(this).width();
        height = $(this).height();
        sideSize = navResize();
    });

    //mouse events
    canvas.on('mousedown' , function (e){
        mouse.draw = true;
        mouse.pos_prev.x = e.clientX - sideSize.width;
        mouse.pos_prev.y = e.clientY - sideSize.heigth;

        // Hide the instructions
        block.fadeOut();
    });

    canvas.on('mouseup', function(e){ mouse.draw = false; });

    canvas.on('mousemove', function(e){
        mouse.pos.x = (e.clientX - sideSize.width) / width;
        mouse.pos.y = (e.clientY - sideSize.height) / height;
        socket.emit('drawing',{
            pos : mouse.pos,
            draw: mouse.draw,
            id: id,
            color : color,
            thickness : thickness,
            username : name
        });

        // Draw a line for the current user's movement, as it is
        // not received in the socket.on('moving') event above

        if(mouse.draw){
            draw(mouse.pos_prev.x, mouse.pos_prev.y, e.clientX - sideSize.width, e.clientY - sideSize.height,color,thickness);
            mouse.pos_prev.x = e.clientX - sideSize.width;
            mouse.pos_prev.y = e.clientY - sideSize.height;
        }
    });

    // touch events
    canvas.on('touchstart', function(e) {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        mouse.draw = true;
        mouse.pos_prev.x = touch.clientX - sideSize.width;
        mouse.pos_prev.y = touch.clientY - sideSize.heght;
    });

    // On touch move
    canvas.on('touchmove', function(e) {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        mouse.pos.x = (touch.clientX - sideSize.width) / width;
        mouse.pos.y = (touch.clientY - sideSize.height) / height;
        socket.emit('drawing',{
            pos : mouse.pos,
            draw: mouse.draw,
            id: id,
            color : color,
            thickness : thickness,
            username : name
        });

        // Draw a line not received in the socket.on('drawing') event above

        if(mouse.draw){
            draw(mouse.pos_prev.x, mouse.pos_prev.y, touch.clientX - sideSize.width, touch.clientY - sideSize.height,color,thickness);
            mouse.pos_prev.x = touch.clientX - sideSize.width;
            mouse.pos_prev.y = touch.clientY - sideSize.height;
        }
    });

    canvas.on('touchend touchleave touchcancel', function(e) {
        mouse.draw = false;
    });

    // Remove inactive users after 10sec
    setInterval(function(){
        for(afk in users){
            if($.now() - users[afk].now > afk_time){
                // remove a user from app 10sec default
                cursors[afk].remove();
                delete users[afk];
                delete cursors[afk];
            }
        }
    },afk_time);

      $('#dlCanvas').on('click',downloadCanvas);
    function downloadCanvas() {
        var downTo = canvas[0].toDataURL('image/png;base64;');
        // force to download 
        downTo = downTo.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
        name_img = prompt("Give a name to your image","");
        if(name_img.length > 0){
            this.setAttribute("download", name_img+'.jpeg');
            this.href = downTo;
        } else {
            return false;
        }
    };
    
    socket.on('drawing', function (data) {
        if(! (data.id in users)){
            // a new user has come online, create a cursor for them
            cursors[data.id] = $('<div class="cursor">').appendTo('#cursors').append('<div class="username-cursor">'+data.username);
        }
        cursors[data.id].css({
            'left' : data.pos.x*width,
            'top' : data.pos.y*height
        });
        // Is the user drawing?
        if(data.draw && users[data.id]){
            draw(users[data.id].pos.x*width, users[data.id].pos.y*height, data.pos.x*width, data.pos.y*height,data.color,data.thickness);
        }
        // Saving the current user 
        users[data.id] = data;
        users[data.id].now = $.now()

    });
 
});

