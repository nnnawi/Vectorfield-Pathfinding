var input_formula = '-x';
var power = 1;
var distance_choice = 0;
var gradient_choice = 0;
var operator_choice = 0;
var neighbor_choice = 0;
var operator_boolean = false;

var djikstra_heat_map = function(p){
    var node_grid = [];
    var open_list = [];
    var neighbor_list = [];
    var target_node;
    var x_lim,y_lim;
    var tile_size = 30;
    var time = 0;

    p.setup = function(){
        p.createCanvas(720,480);
        x_lim = p.ceil(p.width/tile_size);
        y_lim = p.ceil(p.height/tile_size);
        p.init_grid();
        p.init_neighbor();
        p.colorMode(p.HSB);
    }

    p.draw = function(){
        p.background(0);
        p.draw_heatmap();
        p.draw_grid();
        /*
        if(open_list.length > 0){
            if(p.millis() - time){
                p.djikstra_algorithm();
                time = p.millis();
            }
        }
        */
    }

    p.init_grid = function(){
        for(y = 0;y < y_lim; y++){
            var temp_array = [];
            for(x = 0;x < x_lim; x++){
                var new_node = new node(p.createVector(x,y),-1000);
                temp_array.push(new_node);
            }
        node_grid.push(temp_array);
        }
        target_node = node_grid[p.floor(y_lim/2)][p.floor(x_lim * 8/10)];
        target_node.distance = 0;
    }

    p.init_neighbor = function(){
        for(x = 0;x < 3; x++){
            for(y = 0;y < 3; y++){
                var new_vector = p.createVector(x-1,y-1);
                neighbor_list.push(new_vector);
            }
        }
        neighbor_list.splice(4,1);
    }

    p.draw_grid = function(){
        p.stroke(100);
        p.strokeWeight(1);
        for(x = 0;x < x_lim; x++){
            p.line(x*tile_size,0,x*tile_size,p.height);
        }
        for(y=0;y < y_lim; y++){
            p.line(0,y*tile_size,p.width,y*tile_size);
        }
    }

    p.draw_heatmap = function(){
        p.noStroke();
        for(y = 0;y < y_lim; y++){
            for(x = 0;x < x_lim; x++){
                var current_node = node_grid[y][x];
                switch(current_node.distance){
                    case -1000:
                        p.fill(0);
                    break;

                    case 0:
                        p.fill(118,100,100);
                    break;

                    case -9999:
                        p.fill(0,0,53);
                    break;
                    
                    default:
                        var color = p.map(current_node.distance,0,p.max(x_lim,y_lim),0,200);
                        p.fill(color,255,255);
                }
                p.rect(x*tile_size,y*tile_size,tile_size,tile_size);
                p.noStroke();
                p.fill(0);
                //p.text(current_node.distance.toFixed(2),x*tile_size,(y+.5)*tile_size)
            }
        }
    }

    p.in_grid = function(input){
        return input.x >= 0 && input.x < x_lim && input.y >= 0 && input.y < y_lim;
    }

    p.mouseDragged = function(){
        var mouse_vector = p.createVector(p.floor(p.mouseX/tile_size),p.floor(p.mouseY/tile_size));
        node_grid[mouse_vector.y][mouse_vector.x].distance = -9999;
    }

    p.keyPressed = function(){
        open_list.push(target_node);
        p.djikstra_algorithm();
    }

    p.djikstra_algorithm = function(){
        while(open_list.length > 0){
            var current_node = open_list[0];
            for(i = 0;i < neighbor_list.length; i++){
                var direction_vector = neighbor_list[i];
                var neighbor_vector = p5.Vector.add(direction_vector,current_node.position);
                if(p.in_grid(neighbor_vector)){
                    var neighbor_node = node_grid[neighbor_vector.y][neighbor_vector.x];
                    var distance = neighbor_node.distance;
                    var new_distance = current_node.distance + direction_vector.mag(); //modifying the added value might impact on curl of the vector field
                    if(distance != -9999){
                        if(distance == -1000){
                            neighbor_node.distance = new_distance;
                            open_list.push(neighbor_node);
                        }
                        else if(distance > new_distance && distance != 0){
                            neighbor_node.distance = new_distance;
                        }
                    }
                }
            }
            open_list.splice(0,1);
        }
    }
}

//Solve issues of edge tiles not being computed


var vectorfield_pathfinding = function(p){
    var node_grid = [];
    var open_list = [];
    var neighbor_list = [];
    var neighbor_djikstra = [];
    var target_node;
    var x_lim,y_lim;
    var tile_size = 30;
    var time = 0;

    var sobel_x = 
    [[-1,0,1],
     [-2,0,2],
     [-1,0,1]
    ]

    var sobel_y =
    [[-1,-2,-1],
     [0,0,0],
     [1,2,1]
    ]

    p.setup = function(){
        p.createCanvas(720,480);
        x_lim = p.ceil(p.width/tile_size);
        y_lim = p.ceil(p.height/tile_size);
        p.init_grid();
        p.init_djikstra_neighbor();
        p.colorMode(p.HSB);
    }

    p.draw = function(){
        p.background(0);
        if(operator_boolean){
            p.choose_operator();
            //p.draw_grid();
        }
        else{
            p.draw_heatmap();
            p.draw_grid();
            p.display_arrows();
        }
        /*
        if(open_list.length > 0){
            if(p.millis() - time){
                p.djikstra_algorithm();
                time = p.millis();
            }
        }
        */
    }

    p.init_grid = function(){
        node_grid = [];
        for(y = 0;y < y_lim; y++){
            var temp_array = [];
            for(x = 0;x < x_lim; x++){
                var new_node = new node(p.createVector(x,y),-1000);
                temp_array.push(new_node);
            }
            node_grid.push(temp_array);
        }
        target_node = node_grid[p.floor(y_lim/2)][p.floor(x_lim * 8/10)];
        target_node.distance = 0;
    }

    p.reset_grid = function(){
        for(y = 0;y < y_lim; y++){
            for(x = 0;x < x_lim; x++){
                var current_node = node_grid[y][x];
                if(current_node.distance != -9999){
                    current_node.distance = -1000;
                }
            }
        }
        target_node = node_grid[p.floor(y_lim/2)][p.floor(x_lim * 8/10)];
        target_node.distance = 0;
    }

    p.init_neighbor = function(){
        neighbor_list = [];
        switch(p.int(neighbor_choice)){
            case 0:
                for(x = 0;x < 3; x++){
                    for(y = 0;y < 3; y++){
                        var new_vector = p.createVector(x-1,y-1);
                        neighbor_list.push(new_vector);
                    }
                }
                neighbor_list.splice(4,1);
            break;
            case 1:
                neighbor_list.push(p.createVector(0,-1));
                neighbor_list.push(p.createVector(0,1));
                neighbor_list.push(p.createVector(1,0));
                neighbor_list.push(p.createVector(-1,0));
            break;
            case 2:
                for(x = 0;x < 5; x++){
                    for(y = 0;y < 5; y++){
                        var new_vector = p.createVector(x-2,y-2);
                        neighbor_list.push(new_vector);
                    }
                }
            break;
            case 3:
                neighbor_list.push(p.createVector(-2,0));
                neighbor_list.push(p.createVector(-1,0));
                neighbor_list.push(p.createVector(1,0));
                neighbor_list.push(p.createVector(2,0));
                neighbor_list.push(p.createVector(0,1));
                neighbor_list.push(p.createVector(0,2));
                neighbor_list.push(p.createVector(0,-1));
                neighbor_list.push(p.createVector(0,-2));
                neighbor_list.push(p.createVector(1,1));
                neighbor_list.push(p.createVector(-1,1));
                neighbor_list.push(p.createVector(1,-1));
                neighbor_list.push(p.createVector(-1,-1));            
            break;
        }
        console.log(neighbor_list);
    }

    p.init_djikstra_neighbor = function(){
        for(x = 0;x < 3; x++){
            for(y = 0;y < 3; y++){
                var new_vector = p.createVector(x-1,y-1);
                neighbor_djikstra.push(new_vector);
            }
        }
        neighbor_djikstra.splice(4,1);
    }

    p.draw_grid = function(){
        p.stroke(100);
        p.strokeWeight(1);
        for(x = 0;x < x_lim; x++){
            p.line(x*tile_size,0,x*tile_size,p.height);
        }
        for(y=0;y < y_lim; y++){
            p.line(0,y*tile_size,p.width,y*tile_size);
        }
    }

    p.draw_heatmap = function(){
        p.noStroke();
        for(y = 0;y < y_lim; y++){
            for(x = 0;x < x_lim; x++){
                var current_node = node_grid[y][x];
                switch(current_node.distance){
                    case -1000:
                        p.fill(0);
                    break;

                    case 0:
                        p.fill(118,100,100);
                    break;

                    case -9999:
                        p.fill(0,0,53);
                    break;
                    
                    default:
                        var color = p.map(current_node.distance,0,p.max(x_lim,y_lim),0,200);
                        p.fill(color,255,255);
                }
                p.rect(x*tile_size,y*tile_size,tile_size,tile_size);
                p.noStroke();
                p.fill(0);
                //p.text(current_node.distance.toFixed(2),x*tile_size,(y+.5)*tile_size)
            }
        }
    }

    p.display_arrows = function(){
        p.stroke(0);
        for(x = 0;x < x_lim; x++){
           for(y = 0;y < y_lim; y++){
                var current_node = node_grid[y][x];
                if(current_node.direction != 0){
                    var position = p.createVector((x+.5)*tile_size,(y+.5)*tile_size);
                    var arrow_position = current_node.direction.copy().mult(tile_size/2);
                    p.push();
                    p.translate(position.x,position.y);
                    p.line(0,0,arrow_position.x,arrow_position.y);
                    p.push();
                    p.translate(arrow_position.x,arrow_position.y);
                    p.rotate(arrow_position.heading() + 3*p.PI/4);
                    p.line(0,0,tile_size/5,0);
                    p.line(0,0,0,tile_size/5);
                    p.pop();
                    p.pop();
                }
            }
        }
    }

    p.in_grid = function(input){
        return input.x >= 0 && input.x < x_lim && input.y >= 0 && input.y < y_lim;
    }

    p.in_screen = function(){
        return p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
    }

    p.mouseDragged = function(){
        if(p.in_screen()){
            var mouse_vector = p.createVector(p.floor(p.mouseX/tile_size),p.floor(p.mouseY/tile_size));
            node_grid[mouse_vector.y][mouse_vector.x].distance = -9999;
        }
    }

    p.compute_vectorfield = function(){
        p.init_neighbor();
        p.reset_grid();
        open_list.push(target_node);
        p.djikstra_algorithm();
        p.choose_gradient();
        p.compute_divergence();
        p.compute_curl();
    }

    p.djikstra_algorithm = function(){
        while(open_list.length > 0){
            var current_node = open_list[0];
            for(i = 0;i < neighbor_djikstra.length; i++){
                var direction_vector = neighbor_djikstra[i];
                var neighbor_vector = p5.Vector.add(direction_vector,current_node.position);
                if(p.in_grid(neighbor_vector)){
                    var neighbor_node = node_grid[neighbor_vector.y][neighbor_vector.x];
                    var distance = neighbor_node.distance;
                    var new_distance = current_node.distance + p.choose_distance(direction_vector); //modifying the added value might impact on curl of the vector field
                    if(distance != -9999){
                        if(distance == -1000){
                            neighbor_node.distance = new_distance;
                            open_list.push(neighbor_node);
                        }
                        else if(distance > new_distance && distance != 0){
                            neighbor_node.distance = new_distance;
                        }
                    }
                }
            }
            open_list.splice(0,1);
        }
    }

    p.kernel_convolution_function = function(){
        for(y = 0;y < y_lim; y++){
            for(x = 0;x < x_lim; x++){
                var current_node = node_grid[y][x];
                var output_vector = p.createVector(0,0);
                for(i = 0;i < neighbor_list.length; i++){
                    var direction_vector = neighbor_list[i];
                    var neighbor_vector = p5.Vector.add(current_node.position,direction_vector);
                    if(p.in_grid(neighbor_vector)){
                        var neighbor_node = node_grid[neighbor_vector.y][neighbor_vector.x];
                        var distance = neighbor_node.distance;
                        output_vector.add(direction_vector.copy().mult(p.compute_distance_function(distance)));
                    }
                    //add else statement to correct boundarie issues
                }
                output_vector.normalize();
                current_node.direction = output_vector.copy();
            }
        }
    }

    p.kernel_convolution_sobel = function(){ //add in-grid if just like in kernel_convolution_function
        for(y1 = 1;y1 < y_lim-1; y1++){
            for(x1 = 1;x1 < x_lim-1; x1++){
                var current_node = node_grid[y1][x1];
                var x_gradient = 0;
                var y_gradient = 0;
                for(x2 = 0;x2 < 3; x2++){
                    for(y2 = 0;y2 < 3; y2++){
                        var neighbor_node = node_grid[y1 + y2 - 1][x1 + x2 - 1];
                        x_gradient -= neighbor_node.distance * sobel_x[y2][x2];
                        y_gradient -= neighbor_node.distance * sobel_y[y2][x2]; 
                    }
                }
                var angle = p.atan2(y_gradient,x_gradient);
                current_node.direction = p5.Vector.fromAngle(angle).copy();
            }
        }
    }

    p.kernel_convolution_minimum = function(){ //add in-grid if just like in kernel_convolution_function
        for(x = 1;x < x_lim-1; x++){
            for(y = 1;y < y_lim-1; y++){
                var current_node = node_grid[y][x];
                var direction = [];
                var minimum = 10000
                for(i = 0;i < neighbor_list.length; i++){
                    var neighbor = neighbor_list[i];
                    var neighbor_node = node_grid[y + neighbor.y][x + neighbor.x];
                    if(neighbor_node.distance < minimum && neighbor_node.distance != -9999){
                        minimum = neighbor_node.distance;
                        direction = neighbor.copy();
                    }
                }
                current_node.direction = direction.copy();
            }
        }
    }

    p.compute_divergence = function(){
        for(x = 2;x < x_lim-2; x++){
            for(y = 2;y < y_lim-2; y++){
                var current_node = node_grid[y][x];
                var next_x_node = node_grid[y][x+1];
                var next_y_node = node_grid[y+1][x];
                var prev_x_node = node_grid[y][x-1];
                var prev_y_node = node_grid[y-1][x];
                var x_difference = p5.Vector.sub(next_x_node.direction,prev_x_node.direction).x;
                var y_difference = p5.Vector.sub(next_y_node.direction,prev_y_node.direction).y;
                var divergence = x_difference + y_difference;
                current_node.divergence = divergence;
            }
        }
    }

    p.compute_curl = function(){
        for(x = 2;x < x_lim-2; x++){
            for(y = 2;y < y_lim-2; y++){
                var current_node = node_grid[y][x];
                var next_x_node = node_grid[y][x+1];
                var next_y_node = node_grid[y+1][x];
                var prev_x_node = node_grid[y][x-1];
                var prev_y_node = node_grid[y-1][x];
                var x_difference = p5.Vector.sub(next_x_node.direction,prev_x_node.direction).y;
                var y_difference = p5.Vector.sub(next_y_node.direction,prev_y_node.direction).x;
                var curl = x_difference - y_difference;
                current_node.curl = curl;
            }
        }
    }

    p.draw_divergence = function(){
        for(x = 0;x < x_lim; x++){
            for(y = 0;y < y_lim; y++){
                var current_node = node_grid[y][x];
                var color = p.map(current_node.divergence,0,-4,0,255);
                p.fill(230,255,color);
                p.rect(x * tile_size,y * tile_size, tile_size, tile_size);
            }
        }
    }

    p.draw_curl = function(){
        for(x = 0;x < x_lim; x++){
            for(y = 0;y < y_lim; y++){
                var current_node = node_grid[y][x];
                var color = p.map(current_node.curl,0,-2,2,255);
                p.fill(230,255,color);
                p.rect(x * tile_size,y * tile_size, tile_size, tile_size);
            }
        }
    }

    p.choose_distance = function(input){
        switch(distance_choice){
            case 0:
                return 1;
            break;

            case 1:
                return p.ceil(input.mag());
            break;

            case 2:
                return input.mag();
            break;
        }
    }

    p.choose_gradient = function(){
        switch (gradient_choice){
            case 0:
                p.kernel_convolution_function();
            break;
            case 1:
                p.kernel_convolution_sobel();
            break;
            case 2:
                p.kernel_convolution_minimum();
            break;
        }
    }

    p.choose_operator = function(){
        switch (operator_choice){
            case 0:
                p.draw_divergence();
            break;
            case 1:
                p.draw_curl();
            break;
        }
    }

    p.compute_distance_function = function(input){
        var buffer_formula = input_formula;
        buffer_formula = buffer_formula.replaceAll('x',input);
        var output = math.evaluate(buffer_formula);
        return output;
    }
}
var myp5 = new p5(vectorfield_pathfinding,'vectorfield_pathfinding');

class node{
    constructor(position,distance){
        this.position = position;
        this.distance = distance;
        this.direction = 0;
        this.divergence = 0;
        this.curl = 0;
    }
} 