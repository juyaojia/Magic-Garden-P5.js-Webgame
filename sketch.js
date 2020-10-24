var watercan, seedbag, shovel, painter, water_c, shovel_c, seedbag_c, painter_c, f1, f2, f3, f4
var newCanvas, b1, b2, b3, b4, cursor, dropArray, seedArray, count, flag

function preload(){
	watercan = loadImage("media/water.PNG")
	seedbag = loadImage("media/seedbag.PNG")
	shovel = loadImage("media/shavel.PNG")
	painter = loadImage("media/magic_painter.PNG")
	water_c = loadImage("media/water_clicked.PNG")
	seedbag_c = loadImage("media/seedbag_clicked.PNG")
	shovel_c = loadImage("media/shavel_clicked.PNG")
	painter_c = loadImage("media/magic_painter_clicked.PNG")
	f1 = loadImage("media/f1.PNG")
	f2 = loadImage("media/f2.PNG")
	f3 = loadImage("media/f3.PNG")
	f4 = loadImage("media/f4.PNG")
}

function setup(){
	newCanvas = createCanvas(600,600)
	newCanvas.parent("#canvas")
	newCanvas.style("display","block")
	newCanvas.style("margin","auto")

	button1 = new Button1(0,0)
	button2 = new Button2(watercan.width,0)
	button3 = new Button3(watercan.width+seedbag.width,0)
	button4 = new Button4(watercan.width+seedbag.width+shovel.width,0)

	noiseDetail(24)
	cursor = null

	//used to control the stream coming from the watercan
	count = 0

	//initialization!
	seedArray = []
	dropArray = []
}

function draw(){
	background("#E1FFFF")
	fill("#228B22")
	strokeWeight(1)
	stroke(0)
	rect(0,450,600,200)
	//image(water_c, 0,0)

	//display buttons and cursor setting
	button1.display()
	button2.display()
	button3.display()
	button4.display()

	
	//planting seed
	for(var i=0; i<seedArray.length;i++){
		seed = seedArray[i].display()
	}
		
	if (button3.mode == 1){
		for(var i=0; i<seedArray.length;i++){
			if (mouseIsPressed && dist(mouseX, mouseY, seedArray[i].x, seedArray[i].y)<=30){
				seedArray.splice(i,1)
				i = i - 1
			}
		}
	}

	else if (button1.mode == 1){
		//watering
		count+=1
		if (mouseIsPressed){
			wateringMode = 1
			//watering
			if (count % 4 ==0){
				dropArray.push(new Drop(mouseX-20, mouseY+20))
			}
		}

		else{
			//not watering
			wateringMode = 0
		}


		for(var i=0; i<dropArray.length;i++){
			var show = dropArray[i].display()
			//remove the drop from the array when it disappears
			if (show == true){
				dropArray.splice(i,1)
				i = i - 1
			}
		}
		for(var i=0; i<seedArray.length;i++){
			if (dist(seedArray[i].x, seedArray[i].y, mouseX, mouseY) <= 80 && wateringMode == 1){
				if (seedArray[i].size < 15){
					seedArray[i].size+=0.1
				}
				else if (seedArray[i].size >= 15){
					seedArray[i].mode = 1
				}
			}
		}
	}	
	//change the image on the cursor
	changeCursor()
}

/*
class Root{
	constructor(x, y){
		this.x = x
		this.y = y
		this.xEnd = x
		this.yEnd = y
		this.xNoiseoffset = random(0, 100)
		this.rootArray = []
	}
	display(){
		for (var i=0;i<100;i++){
			var Xaddon = map(noise(this.xNoiseoffset), 0, 1, -0.5, 0.5)
			var Yaddon = 1
			this.xEnd += Xaddon
			this.yEnd += Yaddon
			this.xNoiseoffset+=0.1
			var rootParts = new RootParts(this.x, this.y, this.xEnd, this.yEnd)
			rootParts.display()
			//this.rootArray.push(rootParts)
			this.x = this.xEnd
			this.y = this.yEnd
			console.log(this.x + "  " + this.y)
		}
	}
}

class RootParts{
	constructor(x, y, xEnd, yEnd){
		this.x = x
		this.y = y
		this.xEnd = xEnd
		this.yEnd = yEnd
	}
	display(){
		line(this.x, this.y, this.xEnd, this.yEnd)
	}
}
*/
class Petal{
	constructor (x, y, size, r, g, b, angle){
		this.x = x
		this.y = y
		this.size = size
		this.r = r
		this.g = g
		this.b = b
		this.angle = angle
		this.speed = 1
	}
	display(){
		fill(this.r, this.g, this.b, 100)
		//rotate
		push()
		translate(this.x, this.y)
		rotate(radians(this.angle))
		noStroke()
		rect(0,0, this.size, this.size)
		strokeWeight(1)
		stroke(0)
		pop()

		if (dist(this.x, this.y, mouseX, mouseY) <= 2 * this.size){
			this.speed = 3
		}
		else {
			this.speed = 1
		}
		this.angle += this.speed
	}
}

function mousePressed(){

	var button1Area = mouseX>=0 && mouseX <= watercan.width && mouseY>=0 && mouseY<=watercan.height
	var button2Area = mouseX>watercan.width && mouseX <= watercan.width+seedbag.width && mouseY>=0 && mouseY<=seedbag.height
	var button3Area = mouseX>watercan.width+seedbag.width && mouseX <= watercan.width+seedbag.width+shovel.width && mouseY>=0 && mouseY<=shovel.height
	var button4Area = mouseX>watercan.width+seedbag.width+shovel.width && mouseX <= watercan.width+seedbag.width+shovel.width+painter.width && mouseY>=0 && mouseY<=painter.height

	if (button2.mode == 1 && !(button1Area || button3Area || button4Area) && mouseY < 450){
		seedArray.push(new Seed(mouseX-20, mouseY+20))
	}	

	//detect button click
	if(button1Area){
		button1.mode = 1
		button2.mode = 0
		button3.mode = 0
		button4.mode = 0
		cursor = watercan
	}

	else if(button2Area){
		button1.mode = 0
		button2.mode = 1
		button3.mode = 0
		button4.mode = 0
		cursor = seedbag
	}

	else if(button3Area){
		button1.mode = 0
		button2.mode = 0
		button3.mode = 1
		button4.mode = 0
		cursor = shovel
	}

	else if(button4Area){
		button1.mode = 0
		button2.mode = 0
		button3.mode = 0
		button4.mode = 1
		cursor = painter
	}
}

class Drop{
	constructor(x, y){
		this.x = x
		this.y = y
		this.alpha = 255
		this.XSpeed = random(-1.5,1.5)
		this.YSpeed = 3
		this.r = random (5, 15)
	}

	display(){
		fill(100,149,237,this.alpha)
		noStroke()
		ellipse(this.x, this.y, this.r, this.r)
		this.x += this.XSpeed
		this.y += this.YSpeed
		this.alpha -= 10

		//disappear after certain period of time
		if (this.alpha <= 0){
			return true
		}
	}



}


class Seed{
	constructor(x, y){
		this.x = x
		this.y = y
		//0 for seed
		//1 for blooming
		//2 for being shoveled
		this.mode = 0
		this.size = 10
		this.heightY = random(150,350)
		this.lineX = this.x
		//this.lineY = this.y doesn't work, it appears at the initial this.y, instead of the changed this.y why??
		this.lineY = 450
		this.flowerSize = 0
		this.flowerAimedSize = random (20, 70)

		this.red = random(0, 255)
		this.green = random(0, 255)
		this.blue = random(0, 255)
		this.petalArray = []
	}

	display(){

		//the seed is falling and will be planted
		if (this.mode == 0){
			this.y += 3
			if (this.y >= 450){
				this.y = 450
			}
		
			fill(0)
			ellipse(this.x, this.y, this.size, this.size)
		}

		else if (this.mode == 1){
			strokeWeight(2)
			fill(0)
			line(this.x, this.y, this.lineX, this.lineY)
			strokeWeight(1)
			this.lineY -= 0.5
			if (this.lineY <= this.heightY){
				this.lineY = this.heightY
				fill(this.red, this.green, this.blue)
				noStroke()
				ellipse(this.lineX, this.lineY, this.flowerSize, this.flowerSize)
				stroke(0)
				if (this.flowerSize < this.flowerAimedSize){
					this.flowerSize += 1
				}
				if (this.flowerSize >= this.flowerAimedSize){
					for(var i=0;i<5;i++){
						this.petalArray.push(new Petal(this.lineX, this.lineY, this.flowerAimedSize, this.red, this.green, this.blue, 72*i))
						this.petalArray[i].display()
						//why would this happen? lol
						if(cursor == painter && mouseIsPressed && dist(mouseX, mouseY, this.lineX, this.lineY)<= 2 * this.flowerAimedSize){
							this.petalArray[i].r = random(0, 255)
							this.petalArray[i].g = random(0, 255)
							this.petalArray[i].b = random(0, 255)
						}
					}
				}
			}
			fill(0)
			ellipse(this.x, this.y, this.size, this.size)
		}
	}
}

//no () after the class name!
class Button1{
	constructor(x, y){
		this.x = x
		this.y = y
		//0 for not in use
		//1 for in use
		this.mode = 0
	}

	display(){
		imageMode(CORNER)
		//this.!!!
		if(this.mode == 0){
			b1 = watercan
		}
		else if(this.mode == 1){
			b1 = water_c
		}
		image(b1, this.x, this.y)
	}
}

class Button2{
	constructor(x, y){
		this.x = x
		this.y = y
		//0 for not in use
		//1 for in use
		this.mode = 0
	}
	display(){
		if(this.mode == 0){
			b2 = seedbag
		}
		else if(this.mode == 1){
			b2 = seedbag_c
		}
		image(b2, this.x, this.y)
	}

}

class Button3{
	constructor(x, y){
		this.x = x
		this.y = y
		//0 for not in use
		//1 for in use
		this.mode = 0
	}

	display(){
		if(this.mode == 0){
			b3 = shovel
		}
		else if(this.mode == 1){
			b3 = shovel_c
		}
		image(b3, this.x, this.y)
	}

}


class Button4{
	constructor(x, y){
		this.x = x
		this.y = y
		//0 for not in use
		//1 for in use
		this.mode = 0
	}

	display(){
		if(this.mode == 0){
			b4 = painter
		}
		else if(this.mode == 1){
			b4 = painter_c
		}
		image(b4, this.x, this.y)
	}

}

function changeCursor(){
	if (cursor != null){
		noCursor()
		imageMode(CENTER)
		image(cursor, mouseX, mouseY, 50, 50)
		imageMode(CORNER)
	}
}