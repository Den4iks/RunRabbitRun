  /**
   * Created with IntelliJ IDEA.
   * User: balastryk-d
   * Date: 06.03.14
   * Time: 15:50
   * To change this template use File | Settings | File Templates.
   */
   $(document).ready(function() {
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


     $('#runButton').click(function (){
      $('#table').empty();
      $('#message').empty();
      clearInterval(self.timer);
      rabbit = new Rabbit($('#rabbitSpeed').val());
      wolf = new Wolf($('#wolfSpeed').val());
      tree = new Tree($('#treeCount').val(),$('#treeLife').val());
      shrub = new Shrub($('#shrubeCount').val(),$('#shrubeLife').val());
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


  
   var findWay = function way($end,self) {
    var end = self.nodeFromElement($end,self);

    this.currentPosition.removeClass('wolf');
  
    var start = self.nodeFromElement(this.currentPosition,self);


    var path = self.search(self.graph.nodes, start, end);
    if(wolf.currentPosition!==rabbit.currentPosition && path.length==0 || !path  ) {
      $("#message").text("Couldn't find a path");
      clearInterval(self.timer)
    }else{
      self.animatePath(path,self);
    }
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
  var $graph = this.$graph;

  $graph.empty();

      var cellWidth = ($graph.width()/this.opts.tableSizeY-2);  // -2 for border
      var cellHeight = ($graph.height()/this.opts.tableSizeX-2);
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
      //First step
      generateTree();
      generateShrub();
      generateStartWolfPosition();
      generateStartRabbitPosition();
      //First step
      this.timer=setInterval(step,1000);
      var treeLifeTime=this.opts.tree.lifeTime;
      var shrubLifeTime=this.opts.shrub.lifeTime;
      $('#stopButton').click(function (){
        clearInterval(self.timer);
        self.$graph.empty();
        return;
      });
      function step(){
         self.nodes = [];
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
        generateNode();
        self.graph = new Graph(self.nodes);
        wolf.findProperWay(rabbit.currentPosition,self)
        
        
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

TableSearch.prototype.animatePath = function(path,self) {
  i=0
  var speed = wolf.speed; 
  var grid = this.grid;
  var elementFromNode = function(node) {
    return grid[node.x][node.y];
  };

  var removeClass = function(path, i) {

    elementFromNode(path[i]).removeClass('wolf');
    
  }
  var addClass = function(path, i)  {
    if (path.length>2){
      setTimeout( function() { removeClass(path, i-1) }, 300);
}
      elementFromNode(path[i]).addClass('wolf');
      wolf.currentPosition=elementFromNode(path[i]);
    };
    while (speed>0) {
      if(path.length==1 || wolf.currentPosition==rabbit.currentPosition) { 
        $("#message").text("Wolf Win");
        clearInterval(self.timer); 
           }
      addClass(path, i)
      --speed;
      i++
    }

  };



