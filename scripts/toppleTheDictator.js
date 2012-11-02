//globally scoped vars
var squareOccupied=0;
var powerStationOccupied=0;
var powerStationNeutral=1;
var powerStationDictator=0;
var policeStationOccupied=0;
var palaceGuarded=0;
var universityGuarded=0;
var mediaCenterGuarded=0;

var twoPlayerMode = false;
var thisTurn = false;


// Topple The Dictator Objects and Their Methods
var hex;
var combat=new Object;
var movement=new Object;
var turnCounter=new Object;
var spawn=new Object;
var victoryCondition=new Object;
var calculateDictator=new Object;
var uiBox = new Object;
var checkHex = new Object;

//get video urls
	var video = [];
	var videoIterator=0;
		$.getJSON('assets/data/data.json', function(data) {
			  $.each(data, function(val) {
				video.push(val);
			  });
			  return video;
		});
	

combat.attack = function(hex, selected)
{
		if(hex.has("soldier")===true){defenseTileType="soldier";}
				else if(hex.has("protesters")===true){defenseTileType="protesters";}
				else if(hex.has("police")===true){defenseTileType="police";}
				else if(hex.has("guerilla")===true){defenseTileType="guerilla";}
				
				if(selected.text()===1){
				_numberOfAttacks = selected.text();
				}else{
				_numberOfAttacks = $("#unitSlider").val();	
				}
				
				if(tileType==="soldier" || tileType==="guerilla"){
				attackDie = 3;
				}else if(tileType==="police"){
				attackDie = 2;	
				}else if(tileType==="protesters"){
				attackDie = 1;	
				}
				
				battleDie = Crafty.math.randomInt(1, 6);
				if(attackDie >= battleDie){
					
				//Set Up UI Box
		
		$(".outerUI h2").text("Combat Results");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>Defending Unit Has Been Destroyed!</h3><h5 id='closeUI'>Close Box</h5><p><iframe id='apFrame'></iframe></p>");
		$(".outerUI").show();
		
		
		$("#apFrame").attr('src', video[videoIterator]);
		
		if(videoIterator===14)
		{videoIterator=0;}else{videoIterator++;}
		
		
		
		//Set Up UI  Box	
					
				
				
					if(hex.text()===1)
					{
					hex.removeComponent(defenseTileType).addComponent(tileType)
					.removeComponent(defenseTurn).addComponent(turn)
					.removeComponent("active").addComponent("inactive")
					.text(_numberOfAttacks);	
					
					path.forEach(function(tile) {
						if(!tile.has("soldier") && !tile.has("protesters") && !tile.has("police") && !tile.has("guerilla")){
						tile.removeComponent("path").addComponent("hexagon");}
					
					});
					
					
						if((selected.text()-_numberOfAttacks)==0){
						selected.removeComponent("selected").addComponent("hexagon")
						.removeComponent(turn).addComponent("neutral")
						.removeComponent("active").addComponent("inactive")
						.text(" ");
						}else{//test for unit stack
						selected.removeComponent("selected").addComponent(tileType)
						.removeComponent("active").addComponent("inactive")
						.text(selected.text()-_numberOfAttacks);	
						}//end test for unit stack
						
						
					
					}else{//stack decrement conditional
						_tempStackNumber = hex.text();
						hex.text(_tempStackNumber-1);
						
						_pathExists=false;
						path.forEach(function(tile){
							if(tile.has("path")){
						_pathExists=true;
							}
						});
					
					
					
						if(_pathExists===true)
						{
							selected.removeComponent("selected").addComponent("hexagon")
						.removeComponent(turn).addComponent("neutral")
						.removeComponent("active").addComponent("inactive")
						.text("");
					
						path.forEach(function(tile) {
						if(!tile.has("soldier") && !tile.has("protesters") && !tile.has("police") && !tile.has("guerilla")){
						tile.removeComponent("path").addComponent(tileType)
						.removeComponent("neutral").addComponent(turn)
						.text(_numberOfAttacks);
						}});
						
					
						}else{//_pathExists conditional
						
							selected.removeComponent("selected").addComponent(tileType)
						.removeComponent("active").addComponent("inactive")
						.text(selected.text());
					
						}//_pathExists Condistional	
						
					}//decrement stack conditional
				
				
				}else{//attack and battle die conditional
					
					//Set Up UI Box
		
		$(".outerUI h2").text("Combat Results");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>Failed to destroy enemy unit!</h3><h5 id='closeUI'>Close Box</h5>");
		$(".outerUI").show();
		 
		
		//Set Up UI  Box	
					
					_pathExists=false;
					path.forEach(function(tile){
						if(tile.has("path")){
					_pathExists=true;
						}
					});
					
					
					
					if(_pathExists===true)
					{
						selected.removeComponent("selected").addComponent("hexagon")
					.removeComponent(turn).addComponent("neutral")
					.removeComponent("active").addComponent("inactive")
					.text(" ");
					
						path.forEach(function(tile) {
						if(!tile.has("soldier") && !tile.has("protesters") && !tile.has("police") && !tile.has("guerilla")){
							tile.removeComponent("path").addComponent(tileType)
						.removeComponent("neutral").addComponent(turn)
						.text(_numberOfAttacks);}})
						
					}else{//path exists conditional
						
							selected.removeComponent("selected").addComponent(tileType)
						.removeComponent("active").addComponent("inactive");
					
					
						
					}//_pathExists Condistional
				
				
				
				}//attack and battle die conditional
				
				$("#unstack").hide();
				Crafty("unstack").each(function(){
				this.attr({z:0})
				});
				
				uiBox.closeBox();
				
				
}

movement.simple = function(hex, selected)
{
	path.forEach(function(tile) {
					if(!tile.has("soldier") && !tile.has("protesters") && !tile.has("police") && !tile.has("guerilla") && !tile.has("water")){
                    tile.removeComponent("path").addComponent("hexagon");}
					else{ tile.removeComponent("path");}
                });
				selected.removeComponent("selected").addComponent("hexagon")
				.removeComponent(turn).addComponent("neutral")
				.removeComponent("active").addComponent("inactive");
				
				tempStackNumber = selected.text();
				selected.text("");
				
				hex.removeComponent("hexagon").addComponent(tileType)
				.removeComponent("neutral").addComponent(turn)
				.text(tempStackNumber);
				
				tileType = "";				
}

movement.complex = function(hex, selected)
{
	unitValue = $("#unitValue").text();
	
	
	path.forEach(function(tile) {
					if(!tile.has("soldier") && !tile.has("protesters") && !tile.has("police") && !tile.has("guerilla") && !tile.has("water")){
                    tile.removeComponent("path").addComponent("hexagon");}
					else{ tile.removeComponent("path");}
                });
				
	if(unitValue==selected.text())
	{
		
		selected.removeComponent("selected").addComponent("hexagon")
				.removeComponent(turn).addComponent("neutral")
				.removeComponent("active").addComponent("inactive");
				
				tempStackNumber = parseInt(selected.text());
				selected.text("");
				
				hex.removeComponent("hexagon").addComponent(tileType)
				.removeComponent("neutral").addComponent(turn)
				.text(tempStackNumber);
				
				
	}else{//allow for less-than maximum tiles to move
		selected.removeComponent("selected").addComponent(tileType)
				.removeComponent("active").addComponent("inactive");
		
		tempStackNumber = parseInt(selected.text())-parseInt(unitValue); 
		 
				selected.text(tempStackNumber);
		
		hex.removeComponent("hexagon").addComponent(tileType)
				.removeComponent("neutral").addComponent(turn)
				.text(parseInt(unitValue));		
				
	}
	tileType = "";					
}

movement.revert = function(hex)
{
	$("#unstack").hide();
	hex.removeComponent("selected").addComponent(tileType);
	tileType = "";
	return tileType;	
}

movement.stack = function(hex, selected)
{
	unitValue = $("#unitValue").text();
	if(unitValue===""){unitValue=1;}
				
				tempStackNumber = parseInt(hex.text())+parseInt(unitValue);
				hex.text(tempStackNumber);
				
				
	
				if(parseInt(unitValue)===parseInt(selected.text()))
				{
				selected.removeComponent("selected").addComponent("hexagon")
				.removeComponent(turn).addComponent("neutral")
				.removeComponent("active").addComponent("inactive")
				.text("");
				}else{
					remainder=parseInt(selected.text())-parseInt(unitValue);
				selected.removeComponent("selected").addComponent(tileType)	
				.removeComponent("active").addComponent("inactive")
				.text(remainder);
				}
				
				tileType = "";
				return tileType;	
}

turnCounter.switchSides = function()
{
	
	if(turn==="dictator")
	{
		
		victoryCondition.dictator();
		
		if(_existsUniversity===1 && _existsMediaCenter===1){
			
		$(".outerUI h2").text("The Dictator Has Won!");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The dictator has taken control of the University and Media Center. No more resistence is left. Dictator wins!</h3><h5 id='returnToMM'>Return To Main Menu</h5>");
		$(".outerUI").show();
		uiBox.mainMenuReturn();		
			
		}else{//victory condition loop
		turn="people";
		defenseTurn="dictator";
		$("#turn").text("People's Turn");
		Crafty("people").each(function(){
			this.removeComponent("inactive")
			.addComponent("active");
		});
		
		spawn.people();
		
		}//end victory condition loop
		
		
	}else{
		
		victoryCondition.people();
		
		if(_existsPalace ===1)
		{
			$(".outerUI h2").text("The People Have Won!");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The people have stormed the palace! People win!</h3><h5 id='returnToMM'>Return To Main Menu</h5>");
		$(".outerUI").show();
		uiBox.mainMenuReturn();		
				
		}else if(_existsSquare === 1){
			
			$(".outerUI h2").text("The People Have Won!");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The people have created revolution by occupying the city square. People win!</h3><h5 id='returnToMM'>Return To Main Menu</h5>");
		$(".outerUI").show();
		uiBox.mainMenuReturn();	
			
		}else{//victory conditional
		
		turn="dictator";
		defenseTurn="people";
		$("#turn").text("Dictator's Turn");
		
		
		if(twoPlayerMode===false)
		{
		Crafty("dictator").each(function(){
			this.removeComponent("active")
			.addComponent("inactive");
		});	
			
		calculateDictator.main();
		}else{
		Crafty("dictator").each(function(){
			this.removeComponent("inactive")
			.addComponent("active");
		});	
		spawn.dictator();
		}
			
		}//end victory conditional
	}
	return turn;
	return defenseTurn;
}

turnCounter.unstack = function(maxValue)
{
	
	//Set Up UI Box
		
		$(".outerUI h2").text("Move Selected Units");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>How Many Units do you wish to move?</h3><p id='slider'></p><p id='unitValue'>"+maxValue+"</p><h5 id='setUnitValue'>Finish</h5>");
		$(".outerUI").show();
		$("#slider").slider({ min: 1, max: maxValue, step:1, value: maxValue, change: function(event, ui) {turnCounter.setUnit($("#slider").slider("option","value"));} });
		//uiBox.closeBox();
		//Set Up UI  Box

$("#setUnitValue").click(function(){
	$(".outerUI").hide();
	
	});
	
}

turnCounter.setUnit = function(unitValue)
{
	$("#unitValue").text(unitValue);
	
}

spawn.people = function()
{
	_powerStationControlDictator=0;
		
		Crafty("neutral-powerStation").each(function(){
			if(this.has('dictator')){_powerStationControlDictator=1;}
		});
		
		//Set Up UI Box
		
		$(".outerUI h2").text("People Must Rally Units!");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>Please Select a Unit Type to Rally</h3><h5 id='spawnProtesters'>Protesters</h5><h5 id='spawnGuerilla'>Guerrillas</h5>");
		$(".outerUI").show();
		
		
		
		//Set Up UI  Box
		
		$("#spawnProtesters").click(function(){
			if(_powerStationControlDictator===1 && _existsUniversity===1){
			
			$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The dictator has the power station and occupied the university. No Protesters can be mobilized.</h3><h5 id='closeUI'>Close Box</h5>");
			
			uiBox.closeBox();
	$("#spawnProtesters").unbind('click');
	$("#spawnGuerilla").unbind('click');
			}else if(_existsMediaCenter===1 && _existsUniversity===1){
			
			$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The dictator has occupied the media center and the university. No Protesters can be mobilized.</h3><h5 id='closeUI'>Close Box</h5>");
			
			uiBox.closeBox();
	$("#spawnProtesters").unbind('click');
	$("#spawnGuerilla").unbind('click');
			}else{
			spawn.protesters();
			}//end spawn conditional
			});
		$("#spawnGuerilla").click(function(){
				if(_powerStationControlDictator===1){
					
				$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The dictator has shut off the power. Media Center does not function</h3><h5 id='closeUI'>Close Box</h5>");	
					
				uiBox.closeBox();
	$("#spawnProtesters").unbind('click');
	$("#spawnGuerilla").unbind('click');
				}else if(_existsMediaCenter===1){
				
				
				$(".innerUI > p, .innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The dictator has occupied the Media. Media Center does not produce</h3><h5 id='closeUI'>Close Box</h5>");	
				
				uiBox.closeBox();
	$("#spawnProtesters").unbind('click');
	$("#spawnGuerilla").unbind('click');
				}else{//spawn conditional
				spawn.guerilla();
				}//end spawn conditional
			});
}

spawn.dictator = function()
{
	_powerStationControlPeople=0;
		
		Crafty("neutral-powerStation").each(function(){
			if(this.has('people')){_powerStationControlPeople=1;}
		});
		
		_policeStationOccupied=0;
		
		Crafty("dictator-policeStation").each(function(){
			if(this.has('people')){_policeStationOccupied=1;}
		});
		
		//Set Up UI Box
		
		$(".outerUI h2").text("The Dictator Must Rally Units!");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>Please Select a Unit Type to Rally</h3><h5 id='spawnPolice'>Police</h5><h5 id='spawnSoldier'>Soldiers</h5>");
		$(".outerUI").show();
		
		
		
		//Set Up UI  Box
		$("#spawnPolice").click(function(){
			
				if(_powerStationControlPeople===1){
				
				$(".innerUI > p, .innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The people have taken the power station! No police can be mobilized!</h3><h5 id='closeUI'>Close Box</h5>");	
				
				uiBox.closeBox();
	$("#spawnPolice").unbind('click');
	$("#spawnSoldier").unbind('click');	
				}else if(_policeStationOccupied===1){
				
				$(".innerUI > p, .innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The people have taken the police station! No police can be mobilized!</h3><h5 id='closeUI'>Close Box</h5>");	
				
				uiBox.closeBox();
	$("#spawnPolice").unbind('click');
	$("#spawnSoldier").unbind('click');	
				}else{
				spawn.police();
				}//end spawn conditional
			});
		$("#spawnSoldier").click(function(){
				if(_powerStationControlPeople===1){
				
				$(".innerUI > p, .innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The people have taken the power station no soldiers can be mobilized!</h3><h5 id='closeUI'>Close Box</h5>");	
				
				uiBox.closeBox();
	$("#spawnPolice").unbind('click');
	$("#spawnSoldier").unbind('click');		
				}else{
				spawn.soldier();
				}//end spawn conditional
			});	
}

spawn.protesters = function()
{
	chanceProtesters=Crafty.math.randomInt(1, 6);
	
	if(chanceProtesters<=3)
	{
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>Protesters emerge in the city!</h3><h5 id='closeUI'>Close Box</h5>");	
		
	i=0;
	finish=0;
	Crafty("hexagon").each(function(){
		if(i===80 && !this.has("people") && !this.has("dictator") && finish===0 && !this.has("water"))
		{
			this.addComponent("protesters").removeComponent("hexagon")
			.addComponent("people").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;	
		}else if(i===82 && !this.has("people") && !this.has("dictator") && finish===0 && !this.has("water"))
		{
			this.addComponent("protesters").removeComponent("hexagon")
			.addComponent("people").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;	
		}else if(i===84 && !this.has("people") && !this.has("dictator") && finish===0 && !this.has("water"))
		{
			this.addComponent("protesters").removeComponent("hexagon")
			.addComponent("people").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;	
		}
		i++;
		});
	}else{
		
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>No protesters emerge in the city</h3><h5 id='closeUI'>Close Box</h5>");	
		
	}
	
	
	uiBox.closeBox();
	$("#spawnProtesters").unbind('click');
	$("#spawnGuerilla").unbind('click');
}

spawn.guerilla = function()
{
	chance=Crafty.math.randomInt(1, 6);
	
	if(chance<=1)
	{
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>Guerrilla unit emerges in the city!</h3><h5 id='closeUI'>Close Box</h5>");	
		
	i=0;
	finish=0;
	Crafty("hexagon").each(function(){
		if(i===80 && !this.has("people") && !this.has("dictator") && finish===0 && !this.has("water"))
		{
			this.addComponent("guerilla").removeComponent("hexagon")
			.addComponent("people").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;	
		}else if(i===83 && !this.has("people") && !this.has("dictator") && finish===0 && !this.has("water"))
		{
			this.addComponent("guerilla").removeComponent("hexagon")
			.addComponent("people").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;	
		}else if(i===85 && !this.has("people") && !this.has("dictator") && finish===0 && !this.has("water"))
		{
			this.addComponent("guerilla").removeComponent("hexagon")
			.addComponent("people").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;	
		}
		i++;
		});
	}else{
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>No guerrilla unit emerges in the city</h3><h5 id='closeUI'>Close Box</h5>");	
		
	}
	uiBox.closeBox();
	$("#spawnProtesters").unbind('click');
	$("#spawnGuerilla").unbind('click');
}

spawn.police = function()
{
	chance=Crafty.math.randomInt(1, 6);
	
	if(chance<=2)
	{
		
		//Set Up UI Box
		
		$(".outerUI h2").text("The Dictator Tries To Rally Units!");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>New riot police unit emerges in the city.</h3><h5 id='closeUI'>Close Box</h5>");
		$(".outerUI").show();
		
		if(twoPlayerMode===false)
		{
		uiBox.closeBoxAI();
		}else{
		uiBox.closeBox();	
		}
		//Set Up UI  Box
		
		
	i=0;
	finish=0;
	Crafty("hexagon").each(function(){
		if(i===70 && !this.has("people") && !this.has("dictator") && finish===0)
		{
			this.addComponent("police").removeComponent("hexagon")
			.addComponent("dictator").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;	
		}else if(i===72 && !this.has("people") && finish===0)
		{
			this.addComponent("police").removeComponent("hexagon")
			.addComponent("dictator").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;
		}else if(i===74 && !this.has("people") && finish===0){
			this.addComponent("police").removeComponent("hexagon")
			.addComponent("dictator").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;
		}
		i++;
		});
	}else{
		
		$(".outerUI h2").text("The Dictator Tries To Rally Units!");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The dictator fails to rally new riot police in the city.</h3><h5 id='closeUI'>Close Box</h5>");
		$(".outerUI").show();
		if(twoPlayerMode===false)
		{
		uiBox.closeBoxAI();
		}else{
		uiBox.closeBox();	
		}
	}
	
	
	
	$("#spawnPolice").unbind('click');
	$("#spawnSoldier").unbind('click');	
}

spawn.policeNorth = function()
{
	chance=Crafty.math.randomInt(1, 6);
	
	if(chance<=2)
	{
		//Set Up UI Box
		
		$(".outerUI h2").text("The Dictator Tries To Rally Units!");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>New riot police unit emerges in the city.</h3><h5 id='closeUI'>Close Box</h5>");
		$(".outerUI").show();
		uiBox.closeBoxAI();
		
		
		//Set Up UI  Box
	i=0;
	finish=0;
	Crafty("hexagon").each(function(){
		if(i===13 && !this.has("people") && !this.has("dictator") && finish===0)
		{
			this.addComponent("police").removeComponent("hexagon")
			.addComponent("dictator").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;	
		}else if(i===14 && !this.has("people") && finish===0)
		{
			this.addComponent("police").removeComponent("hexagon")
			.addComponent("dictator").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;
		}else if(i===15 && !this.has("people") && finish===0){
			this.addComponent("police").removeComponent("hexagon")
			.addComponent("dictator").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;
		}
		i++;
		});
	}else{
		$(".outerUI h2").text("The Dictator Tries To Rally Units!");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The dictator fails to rally new riot police in the city.</h3><h5 id='closeUI'>Close Box</h5>");
		$(".outerUI").show();
		uiBox.closeBoxAI();
	}
	
	$("#spawnPolice").unbind('click');
	$("#spawnSoldier").unbind('click');	
}

spawn.soldier = function()
{
	chance=Crafty.math.randomInt(1, 6);
	
	if(chance<=1)
	{
		$(".outerUI h2").text("The Dictator Tries To Rally Units!");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The dictator rallies a new soldier unit in the city.</h3><h5 id='closeUI'>Close Box</h5>");
		$(".outerUI").show();
	i=0;
	finish=0;
	Crafty("hexagon").each(function(){
		if(i===10 && !this.has("people") && !this.has("dictator") && finish===0)
		{
			this.addComponent("soldier").removeComponent("hexagon")
			.addComponent("dictator").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;	
		}else if(i===12 && !this.has("people") && !this.has("dictator") && finish===0)
		{
			this.addComponent("soldier").removeComponent("hexagon")
			.addComponent("dictator").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;	
		}else if(i===14 && !this.has("people") && !this.has("dictator") && finish===0)
		{
			this.addComponent("soldier").removeComponent("hexagon")
			.addComponent("dictator").removeComponent("neutral")
			.addComponent("active").removeComponent("inactive")
			.text(1);
			finish=1;	
		}
		i++;
		});
	}else{
		$(".outerUI h2").text("The Dictator Tries To Rally Units!");
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").html("<h3>The dictator fails to rally a new soldier unit in the city.</h3><h5 id='closeUI'>Close Box</h5>");
		$(".outerUI").show();
	}
	if(twoPlayerMode===false)
		{
		uiBox.closeBoxAI();
		}else{
		uiBox.closeBox();	
		}
	$("#spawnPolice").unbind('click');
	$("#spawnSoldier").unbind('click');
}

victoryCondition.dictator = function()
{
	_existsUniversity = 0;
	_existsMediaCenter = 0;		
				
		Crafty("people-university").each(function(){
			if(this.has("dictator"))
			{
				_existsUniversity = 1;
			}
		});
		
		Crafty("people-mediaCenter").each(function(){
			if(this.has("dictator"))
			{
				_existsMediaCenter = 1;
			}
		});
		
	return _existsUniversity;
	return _existsMediaCenter;
}

victoryCondition.people = function()
{
	_existsPalace = 0;
	_existsSquare = 0;
		
		var _holdSquare=0;
		var _holdSquareTemp;
		
		Crafty("dictator-palace").each(function(){
			if(this.has("people"))
			{
				_existsPalace = 1;
			}
		});
		
		Crafty("dictator-square").each(function(){
			if(this.has("people"))
			{
			  if(this.has('none')){
			  this.addComponent('first');
			  this.removeComponent('none');	
			  }else if(this.has('first'))
			  {this.removeComponent('first');
			  this.addComponent('second');
			  }else if(this.has('second'))
			  {this.removeComponent('second');
			  this.addComponent('third');
			  }else if(this.has('third'))
			  {
				_existsSquare =1;  
			  }
			}else{
			if(this.has('first')){this.removeComponent('first');}
			if(this.has('second')){this.removeComponent('second');}			if(this.has('third')){this.removeComponent('third');}		
			this.addComponent('none');	
			}
			
			if(this.has("dictator"))
			{
				
				if(this.has("switchSides")){
					alert('dictator has units join with the people');
					
					if(this.has('police'))
					{
						alert('The police unit has disbanded');
						this.removeComponent('police')
						.removeComponent('dictator')
						.removeComponent('active')
						.removeComponent('switchSides')
						.addComponent('hexagon')
						.addComponent('neutral')
						.addComponent('inactive')
						.text("");
					}else{
						alert('The soldiers have joined the people!');
						this.removeComponent('soldier')
						.removeComponent('dictator')
						.removeComponent('switchSides')
						.addComponent('guerilla')
						.addComponent('people')
						.addComponent('active')
						.text();
					}
				}else{this.addComponent("switchSides");
				
				if(twoPlayerMode===true)
						{
					alert('The dictator should move units from the city square or they will change sides to the people or disband');
						}//end two-player mode test
				
				}
			}//end dictator conversion
		});
	return _existsPalace;
	return _existsSquare;	
}

checkHex.citySquare = function()
{
	//check city square
	Crafty("24").each(function(){
		
		if(this.has("people")){squareOccupied=1;}
		else{squareOccupied=0;}
		return squareOccupied;
	});
}

checkHex.powerStation = function()
{
//check power station
	Crafty("19").each(function(){
		
		if(this.has("people")){powerStationOccupied=1;powerStationNeutral=0;powerStationDictator=0;}
		else if(this.has("neutral")){powerStationNeutral=1;powerStationOccupied=0; powerStationDictator=0;}
		else if(this.has("dictator")){powerStationDictator=1;powerStationNeutral=0; powerStationOccupied=0;}
		return powerStationDictator;
		return powerStationNeutral;
		return powerStationOccupied;
	});	
}

checkHex.policeStation = function()
{
//check police station
	Crafty("71").each(function(){
		
		if(this.has("people")){policeStationOccupied=1;}
		else{policeStationOccupied=0;}
		return policeStationOccupied;
	});	
}

checkHex.palace = function()
{
	//check palace
	Crafty("21").each(function(){
		
		if(this.has("dictator")){palaceGuarded=1;}
		else{palaceGuarded=0;}
		return palaceGuarded;
	});	
}

checkHex.university = function()
{
	//check university
	Crafty("84").each(function(){
		
		if(!this.has("dictator")){universityGuarded=1;}
		else{universityGuarded=0;}
		return universityGuarded;
	});	
}

checkHex.mediaCenter = function()
{
	Crafty("89").each(function(){
		
		if(!this.has("dictator")){mediaCenterGuarded=1;}
		else{mediaCenterGuarded=0;}
		return mediaCenterGuarded;
	});	
}

calculateDictator.main = function()
{
		
	thisTurn=false;
	var protestersArray=new Array();
	var guerillaArray=new Array();	
	var policeArray=new Array();
	var soldierArray=new Array();
	
	Crafty("people").each(function(){
		if(this.has('protesters'))
		{
			preStr=this.getDomId();
			cellInt= parseInt(preStr.slice(3))-5;	
			protestersArray.push(cellInt);
		}else if(this.has('guerilla')){
			preStr=this.getDomId();
			cellInt= parseInt(preStr.slice(3))-5;	
			guerillaArray.push(cellInt);	
		}
	});
	
	Crafty("dictator").each(function(){
		if(this.has('soldier'))
		{
			preStr=this.getDomId();
			cellInt= parseInt(preStr.slice(3))-5;	
			soldierArray.push(cellInt);
		}else if(this.has('police')){
			preStr=this.getDomId();
			cellInt= parseInt(preStr.slice(3))-5;	
			policeArray.push(cellInt);	
		}
	});
	
	
	checkHex.powerStation();
	checkHex.policeStation();
	
	//spawn units
	if(powerStationOccupied===0 && (powerStationDictator===1 ||powerStationNeutral===1) && policeStationOccupied===0 && policeArray.length<3)
	{
		
		spawn.police();
	}else if(powerStationOccupied===0 && (powerStationDictator===1 ||powerStationNeutral===1) && policeStationOccupied===0 && policeArray.length===3){
		
	spawn.policeNorth();
}else if(powerStationOccupied===0 && (powerStationDictator===1 || powerStationNeutral===1)){
		spawn.soldier();
	}else{
	calculateDictator.mainStrategy();	
	}
}

calculateDictator.mainStrategy = function()
{	
	
	checkHex.palace();
	checkHex.powerStation();
	checkHex.policeStation();
	checkHex.mediaCenter();
	checkHex.university();
	checkHex.citySquare();
	Crafty("dictator").each(function(){
		
		
			
		preStr=this.getDomId();
			cellInt= parseInt(preStr.slice(3))-5;
			
			if(this.has("soldier")){
				tileType="soldier";
				
				if(palaceGuarded===0)
				{
					calculateDictator.determineMove(cellInt, 21, tileType, this.text());
				}else if(palaceGuarded===1 && !this.has("21")){
					if(squareOccupied===1){
					calculateDictator.determineMove(cellInt, 24, tileType, this.text());		
					}else if(powerStationOccupied===1){
					calculateDictator.determineMove(cellInt, 19, tileType, this.text());	
					}
				}
				
			}//soldier test loop
				
			if(this.has("police")){tileType="police";
			
			    //for all police units north of the river
				if(cellInt<70)
					{
					if(squareOccupied===1){
					calculateDictator.determineMove(cellInt, 24, tileType, this.text());	
					}else{
						if(powerStationNeutral===1){	
						calculateDictator.determineMove(cellInt, 19, tileType, this.text());
						}else if(powerStationOccupied===1){
						calculateDictator.determineMove(cellInt, 19, tileType, this.text());
						}//power station rally
					}
				}else if(cellInt>70){
						if(policeStationOccupied===1)
						{
							calculateDictator.determineMove(cellInt, 71, tileType, this.text());
						}else if(universityGuarded===1){
							calculateDictator.determineMove(cellInt, 84, tileType, this.text());
						}else if(mediaCenterGuarded===1 && !this.has("84")){
							calculateDictator.determineMove(cellInt, 89, tileType, this.text());
						}
					
						
					}
			
			}//police test loop
			
			
			
		});
	
	
}

calculateDictator.determineMove = function(cellInt, destinationInt, tileType, unitAmount)
{
	rowEven=0;
	adjCalc=destinationInt-cellInt;
	//calculate horizontal distance
	//find horizontal position of cpu tile
	if(cellInt>10){
		cellInt=cellInt.toString();
		if(parseInt(cellInt)>10){if(parseInt(cellInt.charAt(0))%2===0){rowEven=1;}}
		horizCell=parseInt(cellInt.slice(1));
		if(horizCell===0){horizCell=10;}
		}else{horizCell=cellInt;}
	
	//find horizontal position of destination tile
	if(destinationInt>10){
		destinationInt=destinationInt.toString();
		horizDesination=parseInt(destinationInt.slice(1));
		if(horizDesination===0){horizDesination=10;}
		}else{horizDesination=destinationInt;}
	
	
	horizDistance=Math.abs(horizDesination-horizCell);
	horizDirection=horizDesination-horizCell;
	
	//calculate vertical distance
	vertDistance=Math.abs((Math.ceil(cellInt/10))-(Math.ceil(destinationInt/10)));
	vertDirection=(Math.ceil(cellInt/10))-(Math.ceil(destinationInt/10));
	
	//alert(adjCalc);
	
	//determine best move
	if(((horizDistance<=1 && vertDistance<=1)&&
	(
	(adjCalc===1 || adjCalc===-1)
	 || 
	 (rowEven===1 && (adjCalc===10 || adjCalc===11 || adjCalc===-10 ||adjCalc===-11 || adjCalc===9 || adjCalc===-9)) 
	 || 
	 (rowEven===0 && (adjCalc===9 || adjCalc===-9 || adjCalc===10 || adjCalc===-10))
	 )) && cellInt!=82){
		
		calculateDictator.moveHex(cellInt, destinationInt, tileType, unitAmount);
		
		
	}else if(horizDistance>=vertDistance){
		//alert(horizDistance+" "+vertDistance);
		calculateDictator.moveHorizontal(cellInt, destinationInt, tileType, unitAmount, horizDirection);
	}else{
		calculateDictator.moveVertical(cellInt, destinationInt, tileType, unitAmount, vertDirection);
	}
	
}

calculateDictator.moveHex = function(cellInt, destinationInt, tileType, unitAmount)
{
	Crafty(""+destinationInt+"").each(function(){
	
	if(!this.has("people")){
	
	//vacate hex
	Crafty(""+cellInt+"").each(function(){
		this.removeComponent(tileType)
		.removeComponent("dictator")
		.addComponent("hexagon")
		.addComponent("neutral")
		.text("");
	});
	
	//occupy hex
			//determine unit stack
			if(this.has("dictator"))
			{
				unitAmount=parseInt(this.text())+parseInt(unitAmount);
			}
	
				this.addComponent(tileType)
			.addComponent("dictator")
			.removeComponent("hexagon")
			.removeComponent("neutral")
			.text(unitAmount);
	
	}else{
		if(!this.has("protesters")){defenseType="guerilla";}
		else{defenseType="protesters";}
		
		calculateDictator.attack(tileType, defenseType, this.text(), destinationInt, cellInt, unitAmount);
	}
	
	});
}

calculateDictator.moveHorizontal = function(cellInt, destinationInt, tileType, unitAmount, horizDirection)
{
	
	
	if(horizDirection>0){destinationInt=(parseInt(cellInt)+1);}else{destinationInt=(parseInt(cellInt)-1);}
	Crafty(""+destinationInt+"").each(function(){
	if(!this.has("people")){	
	//vacate hex
	Crafty(""+cellInt+"").each(function(){
		this.removeComponent(tileType)
		.removeComponent("dictator")
		.addComponent("hexagon")
		.addComponent("neutral")
		.text("");
	});
			
	
	//occupy hex
	
	//determine unit stack
			if(this.has("dictator"))
			{
				unitAmount=parseInt(this.text())+parseInt(unitAmount);
			}
	
				this.addComponent(tileType)
			.addComponent("dictator")
			.removeComponent("hexagon")
			.removeComponent("neutral")
			.text(unitAmount);
			
	}else if(this.has("people")){//attack if occupied
		if(!this.has("protesters")){defenseType="guerilla";}
		else{defenseType="protesters";}
		
		calculateDictator.attack(tileType, defenseType, this.text(), destinationInt, cellInt, unitAmount);
	}else{//stack dictator units
		//vacate hex
	Crafty(""+cellInt+"").each(function(){
		this.removeComponent(tileType)
		.removeComponent("dictator")
		.addComponent("hexagon")
		.addComponent("neutral")
		.text("");
	});
		
		//occupy and stack hex
	_currentUnitAmount=this.text;
				this.addComponent(tileType)
			.addComponent("dictator")
			.removeComponent("hexagon")
			.removeComponent("neutral")
			.text(unitAmount+_currentUnitAmount);
	
		
		
	}
			
	});
	
	
}

calculateDictator.moveVertical = function(cellInt, destinationInt, tileType, unitAmount, vertDirection)
{
	if(cellInt < 51 && destinationInt > 51)
	{
		destinationInt=54;
		if(rowEven===1){vertMove=11;}else{vertMove=10;}
		
		
		if(vertDirection>0){destinationInt=(parseInt(cellInt)-vertMove);}else{destinationInt=(parseInt(cellInt)+vertMove);}
		
		
	Crafty(""+destinationInt+"").each(function(){
	if(!this.has("people")){	
	//vacate hex
	Crafty(""+cellInt+"").each(function(){
		this.removeComponent(tileType)
		.removeComponent("dictator")
		.addComponent("hexagon")
		.addComponent("neutral")
		.text(" ");
	});
	
	
	
	
	//occupy hex
	
				this.addComponent(tileType)
			.addComponent("dictator")
			.removeComponent("hexagon")
			.removeComponent("neutral")
			.text(unitAmount);
			
	}else{//attack if occupied
		if(!this.has("protesters")){defenseType="guerilla";}
		else{defenseType="protesters";}
		
		calculateDictator.attack(tileType, defenseType, this.text(), destinationInt, cellInt, unitAmount);
	}
			
	});
		
		
			
	}else if(cellInt===54){
		
	}else if(cellInt > 54){
		
	}
}

calculateDictator.attack = function(tileType, defenseType, defendingUnits, destinationInt, cellInt, unitAmount)
{
	//Set Up UI Box
		
		if(thisTurn===false){
		$(".outerUI h2").text("The Dictator Attacks the People!");
		
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
				
		$("<h5 id='closeUI'>Continue</h5>").appendTo(".innerUI");
		
		}
		
		$(".outerUI").show();
		
		//Set Up UI  Box	
	
	if(tileType==="soldier" || tileType==="guerilla"){
				attackDie = 3;
				}else if(tileType==="police"){
				attackDie = 2;	
				}else if(tileType==="protesters"){
				attackDie = 1;	
				}
				
				battleDie = Crafty.math.randomInt(1, 6);
				if(attackDie >= battleDie){
					//Set Up UI Box
		
		
		
		$("<h3>The dictator's "+tileType+" attack. Defending Unit Destroyed!</h3>").appendTo(".innerUI");
		
					
				
				
				if(defendingUnits===1)
					{
					//delete player's tile and move cpu tile
					
					//vacate hex
					Crafty(""+cellInt+"").each(function(){
						this.removeComponent(tileType)
						.removeComponent("dictator")
						.addComponent("hexagon")
						.addComponent("neutral")
						.text(" ");
					});
					
					//occupy hex
					Crafty(""+destinationInt+"").each(function(){
								this.addComponent(tileType)
							.addComponent("dictator")
							.removeComponent(defenseType)
							.removeComponent("people")
							.text(unitAmount);
					});	
						
					
					}else{//stack decrement conditional
						
						//decrement unit stack after sucessful attack
						Crafty(""+destinationInt+"").each(function(){
						textTemp=this.text();
						textTemp=textTemp-1;
						this.text(textTemp);
						});
					}
				
				
				}else{//attack and battle die conditional
				
				$("<h3>The dictator's "+tileType+" attack. The people's forces hold out.</h3>").appendTo(".innerUI");
				
				}
				
				
			uiBox.closeBox();
			
			thisTurn=true;	
}


uiBox.mainUI = function()
{
	
	$("#one-player").click(function(){
	 $(".outerUI").hide();
	 turnCounter.switchSides();	 
	});
	
	$("#two-player").click(function(){
		twoPlayerMode=true;
		$(".outerUI").hide();
		return twoPlayerMode;
	});
	
	$("#tutorial").click(function(){
		uiBox.tutorial();
	});
	
	$("#strategy-guide").click(function(){
		uiBox.strategy_guide();
	});
	
	$("#resources").click(function(){
		uiBox.resources();
	});
}

uiBox.tutorial = function()
{
	$(".outerUI h2").text("Game Tutorial");
		
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").css('overflow', 'scroll');
		$('<p class="text"><b>Tile Types</b><br /><b>Protesters</b> are easy for the people to rally, but are very weak when used to attack<br /><b>Guerrillas</b> are hard for the people to rally, but are as effective as soldiers for attacking<br /><b>Police</b> are the easiest unit for the dictator to rally. They have a stronger attack than protesters, but are not as strong as guerrillas or soldiers.<br /><b>Soldiers</b> are hard for the dictator to rally, but are as effective as guerillas for attacking<br /></p><p class="text"><b>Special Hex Types</b><br /><img src="assets/presPalace.jpg" /><br /><b>Presedential palace</b> is the base for the dictator<br /><img src="assets/citySquare.jpg" /><br /><b>City square</b> is a hex the people can gain a victory by using (see below)<br /><img src="assets/powerStation.jpg" /><br /><b>Power station</b> will prevent the dictator from rallying any units and shut down the people\'s media center when occupied.<br /><img src="assets/policeStation.jpg" /><br /><b>Police Station</b> is the basic rally point for riot police and will prevent police from being rallied by the dictator if occupied by the poeple.<br /><img src="assets/university.jpg" /><br /><b>University</b> must be held by the people to create protesters without a power station. It is also a victory hex for the dictator (see below)<br /><img src="assets/mediaCenter.jpg" /><br /><b>Media Center</b> must be held by the people to create protesters or guerillas. It is also a victory hex for the dictator (see below)<br /><b>River</b> cannot be crossed except via the two bridge hexes<br /></p><p class="text"><b>How To Move Tiles</b><br />To move a tile, CLICK or DOUBLE CLICK the tile to select it. It will turn gray when selected. All units may move one hex per turn. Then drag your finger or mouse cursor over the hex that you want to move the unit into. The hex should become light green. Click or Double Click the light green hex and the unit will move into that hex. See illustration below:<br/><img src="assets/directions.png" /><br />1:Click or Double Click the unit, 2:Make sure the unit is selected with gray-green color, 3:Drag finger or mouse over the hex to select it, 4:Click or Double Click the light green hex, 5:Unit has moved  </p><p class="text"><b>How To Attack Other Units</b><br />Just like in the game of chess, you must move your unit into the opposing unit\'s hex. This will spark a battle sequence, which you unit may or may not win. The overlay box will inform you if your unit was victorious or not. If not victorious, your unit will remain in its original hex. Stacked units, or hexes with more than unit in them will only attack once.</p><p class="text"><b>How To Win The Game - The People</b><br />The people have two options to win the game:<br />1) The people may storm the presedential palace hex. The people automatically win upon occupying this hex.<br />2) The people must occupy the city square hex for three consequetive turns.</p><p class="text"><b>How To Win The Game - The Dictator</b><br />The dictator has one option to win the game:<br />1) The dictator must occupy both the media center and university hex at the same time for one turn.</p><p class="text"><b>Stacking or Combining Units</b><br />You may combine units of the samee type (soldiers with soldiers, protesters with protesters, etc). However a single hex may attack or move only once per turn, regardless of how unit may be in the square. Also, stacked units only get one attack. However, stacked units decrease one at a time when defending a hex. Stacking units is better for defense rather than offense.</p><h5 id="returnToMM">Return to Main Menu</h5>').appendTo('.innerUI');
		uiBox.mainMenuReturn();
		
}

uiBox.strategy_guide = function()
{
	$(".outerUI h2").text("Strategy Guide");
		
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").css('overflow', 'scroll');
		$('<p class="text"><b>Power Station</b><br />Even though the power station hex is not used to directly determine a victory for either, possesion of this hard-to-reach hex can determine which side wins. Posession of this hex prevents your opponent from being able to rally new soldiers, police, or guerrillas. This hex might be less important to the people because they can still rally protesters if they control the university hex. However, the ability to keep the dictator to create new units will quickly lead to a victory to the people without the dictator\'s forces to prevent them occupying the city square or palace.</p><p class="text"><b>Rallying Units</b><br />The people will have the easiest time attempting to rally protesters. When playing the people, you should always have a good supply of protesters on hand to disrupt the dictators ability to do as he pleases on the board. Riot police are easier to rally than either soldiers or guerrillas, but usually cannot be mobilized as fast as protesters. When playing the dictator, one should keep a good amount of riot police on hand to oppress the people. Soldiers and guerillas are similar in every way. These units should be attempted to rally only after a sufficient number of police or protester units have been created.</p><p class="text"><b>Attacking and Defending</b><br />While you can stack as many units of the same type as you want on top of each other. This i not always a good idea. When attack from a hex, the player will only get one attack and, therefore, a chance at reducing the attacked hex\'s units by one (if that). When attacking, it is better to spread your units out into as many hexes as possible to get multiple attacks. When defending, one should stack as many units as possible on the hex one is trying to defend.</p><p class="text"><b>City Square</b><br />This is the victory hex for the people. While the dictator should stack units in his palace hex, he should NOT do that with the city square. The units of the dictator can be disbanded or even converted to guerillas for the people, if left in this square. The best the dictator can hope to do is prevent the people\'s units from entering the square or attack and occupying the square after the people have entered it.</p><h5 id="returnToMM">Return to Main Menu</h5>').appendTo('.innerUI');
		uiBox.mainMenuReturn();
}

uiBox.resources = function()
{
	$(".outerUI h2").text("What is Going on in Syria?");
		
		$(".innerUI > p,.innerUI > h3, .innerUI > h5").detach();
		$(".innerUI").css('overflow', 'scroll');
		$('<p><iframe width="480" height="360" src="http://www.youtube.com/embed/L4vD6JpJAFI" frameborder="0" allowfullscreen></iframe><br /><br /><iframe width="480" height="360" src="http://www.youtube.com/embed/uYCC6YP6ato" frameborder="0"></iframe></p><h3>How You Can Help</h3><p class="text">Individually, unless you are a billionaire or executive of a large and powerful country, there is very little you ALONE can do. Collectively, we can do much more. How to help:<ul><li class="resources">Part of the proceeds of this app go to the Red Cross/Red Crescent, which brings aid directly to those most affected. Consider purchasing a copy, if you have not done so already.</li><li class="resources">Educate yourself further.</li><li class="resources">Speak out and work against injustice where ever and however</li><li class="resources">Be creative. The solutions we need often will not start with the barrel of a gun.</li></ul></p><h5 id="returnToMM">Return to Main Menu</h5>').appendTo('.innerUI');
		uiBox.mainMenuReturn();
}

uiBox.closeBox = function()
{
	$("#closeUI").click(function(){
	 $(".outerUI").hide();
	$(".innerUI > p iframe").detach();
	;
	 //Crafty.scene(gameContainer.scene);	
	});
}

uiBox.closeBoxAI = function()
{
	$("#closeUI").click(function(){
	 $(".outerUI").hide();
	
	  calculateDictator.mainStrategy();
	})
}

uiBox.mainMenuReturn = function()
{
	$("#returnToMM").click(function(){
	$(".innerUI").css('overflow', 'auto')
	 Crafty.scene(gameContainer.scene);	
	});
}
