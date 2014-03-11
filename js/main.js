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

 var table = new TableSearch ($table,opts)

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
}

function Tree (count,lifeTime) {
	Plant.call(this,count,lifeTime)
}

function Shrub (count,lifeTime) {
	Plant.call(this,count,lifeTime)
}

function init() {
 this.rabbit = new Rabbit($('#rabbitSpeed').val());
 this.wolf = new Wolf($('#wolfSpeed').val());
 this.tree = new Tree($('#treeCount').val(),$('#treeLife').val());
 this.shrub = new Shrub($('#shrubeCount').val(),$('#shrubeLife').val());
}

function TableSearch ($graph,options) {
this.$graph = $graph;
this.opts = options;
this.generate();	
}

TableSearch.prototype.generate = function() {

    var self = this;
	this.grid = [];
	var $graph = this.$graph;
    
    $graph.empty();

    var cellWidth = ($graph.width()/this.opts.tableSizeY);  // -2 for border
    var cellHeight = ($graph.height()/this.opts.tableSizeX);
    var $cellTemplate = $("<span />").addClass("grid_item").width(cellWidth).height(cellHeight);
    /*var isTreeCount=self.opts.tree.count;
    var isShrubCount=self.opts.shrub.count;*/

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
   var timer=setInterval(step,1000);
   var treeLifeTime=this.opts.tree.lifeTime;
   var shrubLifeTime=this.opts.shrub.lifeTime;
  
   function step(){
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
    function generateTree(){
    var isTreeCount=self.opts.tree.count;
    $('span').removeClass('tree');
	 while(isTreeCount>0){
    var randomTree=Math.floor(Math.random() * self.grid.length);
    var isTree=self.grid[randomTree][Math.floor(Math.random() * self.grid[randomTree].length)];
    if (!isTree.hasClass('tree')){
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
    if (!isShrub.hasClass('shrub') && !isShrub.hasClass('tree')){
    isShrub.addClass('shrub')
    --isShrubCount;
}
}
}

}
  

