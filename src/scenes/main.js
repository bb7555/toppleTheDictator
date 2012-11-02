Crafty.scene("main", function() {



	Crafty.modules("scripts/", {
    hexmap: '0.2'
}, function() {

    Crafty.sprite(64, "assets/hexagons.png", {
        path: [1, 0],
        hexagon: [0, 0],
        selected: [2, 0],
		protesters: [3, 0],
		soldier: [4, 0],
		guerilla: [5, 0],
		police: [6, 0],
    });
	
	
	//Crafty.background("url(/assets/map.png)");

	
	
	
	Crafty.e("HTML, Mouse")
   .attr({x:700, y:20, w:90, h:26})
   .replace("<h6 id='endTurn'>End Turn</h6>")
   .bind("Click",function(){
	   
	   turnCounter.switchSides();
	
   });
   
   Crafty.e("HTML, Mouse, mainUI")
	.attr({x:50, y:20, z:2})
   .replace('<div class="outerUI"><h2>Topple The Dictator Main Menu</h2><div class="innerUI" ><h3>Welcome to Topple The Dictator!</h3><p>Please Choose From The Options Below To Begin</p><h5 id="one-player">One-Player Game</h5><h5 id="two-player">Two-Player Game</h5><h5 id="tutorial">Tutorial</h5><h5 id="strategy-guide">Strategy Guide</h5><h5 id="resources">Resources</h5></div></div>');
    
uiBox.mainUI();  
   
   Crafty.e("HTML, Mouse, unstack")
   .attr({x:700, y:50, w:90, h:400})
   .replace("<div id='turn'>Dictator's Turn</div><h6 id='returnMM'>Main Menu</h6><h6 id='site'>Visit Site</h6>");
  $("#returnMM").click(function(){	
	 Crafty.scene(gameContainer.scene);	
	});
	$("#site").click(function(){	
	 window.location.href='http://topplethedictator.com';	
	});
  
    var hexmap = Crafty.e("Hexmap").hexmap(64, 64);
    selected = null;
    path = null;
	tileType = "";
	tileSide = "";
	tileStatus = "";
	previousTileType = "";
	tempStackNumber = 1;
	attackDie = 1;
	defendDie = 1;
	turn="dictator";
	defenseTurn="people";
	defenseTileType="";
	unitValue=1;
	badMove=false;
	tileSpecial ='';
	iterator=0;
	var tooFar;

    hexmap.create(10, 10, function() {
        return Crafty.e("2D, DOM, Mouse, Text,"+tileType+","+tileSide+","+tileStatus+","+tileSpecial+","+iterator+"").bind("Click", function() {
      		
			if (!selected && !this.has("hexagon") && this.has(turn) && this.has("active")) {
                selected = this;
				if(selected.has("soldier")===true){tileType = "soldier";}
				else if(selected.has("protesters")===true){tileType = "protesters";}
				else if(selected.has("police")===true){tileType = "police";}
				else if(selected.has("guerilla")===true){tileType = "guerilla";}
                this.removeComponent(tileType).addComponent("selected");
				if(this.text()>1)
				{
					turnCounter.unstack(this.text());
					
				}
				unitValue=this.text();
            }
            else if (selected === this) {
                
				movement.revert(this);
				selected = null;
                
            }
			else if (this.has("path")===true && selected)
			{
				
				if(unitValue===1){
					
				movement.simple(this, selected);
				
				}else{
				movement.complex(this, selected)
				}
				selected=null;
			}
			else if(!this.has(turn) && selected && !this.has('water') && !this.has("hexagon") && path.length===1)
			{
				
				combat.attack(this, selected);
				selected=null;
				
			}
			else if(this.has(turn) && selected && this.has(tileType) && tooFar===false)
			{
			
				movement.stack(this, selected);
				selected = null;				
				
			}
        }).bind("MouseOver", function() {
            if (selected){
                if (path) path.forEach(function(tile) {
					if(!tile.has("selected") && !tile.has("soldier") && !tile.has("protesters") && !tile.has("police") && !tile.has("guerilla")){
                    tile.removeComponent("path").addComponent("hexagon");}
                });

                path = hexmap.findPath(selected, this);
				
				
				if(path.length!=1 || this.has("11") || this.has("97")){tooFar=true;}else{tooFar=false;}
				
				
				
				if(tooFar===false){
                if (path) path.every(function(tile) {
					if(!tile.has("soldier") && !tile.has("protesters") && !tile.has("police") && !tile.has("guerilla") && !tile.has("water")){	
                    tile.removeComponent("hexagon").addComponent("path");}
					
                });
				}//end tooFar
            }

        });
    });

});


   
});
