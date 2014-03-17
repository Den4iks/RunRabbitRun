  /**
   * Created with IntelliJ IDEA.
   * User: balastryk-d
   * Date: 06.03.14
   * Time: 15:50
   * To change this template use File | Settings | File Templates.
   */
   $(function() {
    $('#runButton').click(function (){
     init();
     var $table = $('#table');
     var opts = {
      tableSizeX:$('#x').val(),
      tableSizeY:$('#y').val(),
      tree:tree,
      shrub:shrub,
      wolf:wolf,
      rabbit:rabbit
    }

    var table = new TableSearch ($table,opts,astar.search)

  });
  });
   function Animal(speed){
     this.speed=speed
   };

   function Plant(count,lifeTime){
     this.count=count;
     this.lifeTime=lifeTime;
   }

   function Rabbit(speed){
     Animal.call(this,speed);
   }

   function Wolf(speed){
     Animal.call(this,speed);
     this.findProperWay=findWay;
   }

   function Tree (count,lifeTime) {
     Plant.call(this,count,lifeTime)
   }

   function Shrub (count,lifeTime) {
     Plant.call(this,count,lifeTime)
   }

   var findWay = function way($end,self) {
    var end = self.nodeFromElement($end,self);

    this.currentPosition.removeClass('wolf');
    /*$end.addClass("finish");*/
    /*var $start = this.$cells.filter("." + css.start);*/
    var start = self.nodeFromElement(this.currentPosition,self);


    var path = self.search(self.graph.nodes, start, end);
    self.animatePath(path);
    
  };



  function init() {
   this.rabbit = new Rabbit($('#rabbitSpeed').val());
   this.wolf = new Wolf($('#wolfSpeed').val());
   this.tree = new Tree($('#treeCount').val(),$('#treeLife').val());
   this.shrub = new Shrub($('#shrubeCount').val(),$('#shrubeLife').val());
 }

 function TableSearch ($graph,options,implementation) {
  this.$graph = $graph;
  this.search = implementation;
  this.opts = options;
  this.generate();	
}

TableSearch.prototype.generate = function() {
  var WALL = 0;
  var OPEN = 1;
  var self = this;
  this.grid = [];
  this.nodes = [];
  var $graph = this.$graph;

  $graph.empty();

      var cellWidth = ($graph.width()/this.opts.tableSizeY);  // -2 for border
      var cellHeight = ($graph.height()/this.opts.tableSizeX);
      var $cellTemplate = $("<span />").addClass("grid_item").width(cellWidth).height(cellHeight);
      
      for(var x=0;x<this.opts.tableSizeX;x++) {
        var $row = $("<div class='clear' />");
        var gridRow = [];

        for(var y=0;y<this.opts.tableSizeY;y++) {
          var id = "cell_"+x+"_"+y;
          var $cell = $cellTemplate.clone();
          $cell.attr("id", id).attr("x", x).attr("y", y);
          $row.append($cell);
          gridRow.push($cell);   		
        }

        $graph.append($row);

        this.grid.push(gridRow);
        
      }
      generateTree();
      generateShrub();
      generateStartWolfPosition();
      generateStartRabbitPosition();
      generateNode();
      this.graph = new Graph(self.nodes);
      
      var timer=setInterval(step,1000);
      var treeLifeTime=this.opts.tree.lifeTime;
      var shrubLifeTime=this.opts.shrub.lifeTime;
      $('#stopButton').click(function (){
        clearInterval(timer);
        $graph.empty();
        return;
      });
      function step(){
        wolf.findProperWay(rabbit.currentPosition,self)
        --treeLifeTime;
        if(treeLifeTime===0){
          treeLifeTime=self.opts.tree.lifeTime;
          generateTree();
        }
        --shrubLifeTime;
        if(shrubLifeTime===0){
          shrubLifeTime=self.opts.shrub.lifeTime;
          generateShrub();
        }
        
      }

      function generateNode() {

        for (var i = 0;i<self.grid.length;i++){
          var nodeRow = [];
          for(var j=0;j<self.grid[i].length;j++){
            if(self.grid[i][j].hasClass('tree') || self.grid[i][j].hasClass('shrub')){
              nodeRow.push(WALL);
            }else{
              nodeRow.push(OPEN)
            }
          }
          self.nodes.push(nodeRow);
        }
      }

      function generateTree(){
        var isTreeCount=self.opts.tree.count;
        $('span').removeClass('tree');
        while(isTreeCount>0){
          var randomTree=Math.floor(Math.random() * self.grid.length);
          var isTree=self.grid[randomTree][Math.floor(Math.random() * self.grid[randomTree].length)];
          if (!isTree.hasClass('tree') && !isTree.hasClass('shrub') && !isTree.hasClass('wolf') && !isTree.hasClass('rabbit')){
            isTree.addClass('tree')
            --isTreeCount;
          }
        }  
      }

      function generateShrub(){
        var isShrubCount=self.opts.shrub.count;
        $('span').removeClass('shrub');
        while(isShrubCount>0){
          var randomShrub=Math.floor(Math.random() * self.grid.length);
          var isShrub=self.grid[randomShrub][Math.floor(Math.random() * self.grid[randomShrub].length)];
          if (!isShrub.hasClass('shrub') && !isShrub.hasClass('tree') && !isShrub.hasClass('wolf') && !isShrub.hasClass('rabbit')){
            isShrub.addClass('shrub')
            --isShrubCount;
          }
        }
      }

      function generateStartWolfPosition(){
       Wolf = 1;
       while(Wolf!=0){
        randomPlaceX=Math.floor(Math.random() * self.grid.length);
        randomWolfPlace= self.grid[randomPlaceX][Math.floor(Math.random() * self.grid[randomPlaceX].length)];
        if (!randomWolfPlace.hasClass('shrub') && !randomWolfPlace.hasClass('tree')){
          randomWolfPlace.addClass('wolf')
          --Wolf;
          wolf.currentPosition = randomWolfPlace
        }
      }

    }

    function generateStartRabbitPosition(){
     Rabbit = 1;
     while(Rabbit!=0){
      randomPlaceX=Math.floor(Math.random() * self.grid.length);
      randomRabbitPlace= self.grid[randomPlaceX][Math.floor(Math.random() * self.grid[randomPlaceX].length)];
      if (!randomRabbitPlace.hasClass('shrub') && !randomRabbitPlace.hasClass('tree') && !randomRabbitPlace.hasClass('wolf')){
        randomRabbitPlace.addClass('rabbit')
        --Rabbit;
        rabbit.currentPosition = randomRabbitPlace;
      }
    }

  }
  

}

TableSearch.prototype.nodeFromElement = function($cell,self) {
  return self.graph.nodes[parseInt($cell.attr("x"))][parseInt($cell.attr("y"))];
};
TableSearch.prototype.animateNoPath = function() {
  var $graph = this.$graph;
  var jiggle = function(lim, i) {
    if(i>=lim) { $graph.css("top", 0).css("left", 0); return;  }
    if(!i) i=0;
    i++;
    $graph.css("top", Math.random()*6).css("left", Math.random()*6);
    setTimeout( function() { jiggle(lim, i) }, 5 );
  };
  jiggle(15);
};
TableSearch.prototype.animatePath = function(path) {
  var i= 1;
  var speed = wolf.speed; 
  var grid = this.grid;
  var elementFromNode = function(node) {
    return grid[node.x][node.y];
  };

  var removeClass = function(path, i) {
    if(i>=path.length) return;
    elementFromNode(path[i]).removeClass('active');
    setTimeout( function() { removeClass(path, i+1) }, 100);
  }
  var addClass = function(path, i)  {
      if(i>=path.length) {  // Finished showing path, now remove
        return removeClass(path, 0);
      }
  elementFromNode(path[i]).addClass('active');
      
    ++i;

    };
    while (speed>0) {
      addClass(path, i)
      --speed;
    }

  };



