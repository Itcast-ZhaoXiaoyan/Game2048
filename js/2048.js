var game={
	data:[],	//保存所有数字的二维数组
	rn:4,	//总行数
	cn:4,	//总列数
	RUNNING:1,
	GAMEOVER:0,
	score:0,	//分数
	
	isGameOver:function(){	//判断游戏状态是否为结束
		//如果没有满，则返回false
		if(!this.isFull()){
			return false;
		}
		//否则
		else{
			//从左边第一个元素开始col，遍历二维数组
			for(var row=0;row<this.rn;row++){
				//从列元素row，遍历数组
				for(var col=0;col<this.cn;col++){
					//如果当前元素不是最右侧元素
					if(col<this.cn-1){
						//如果当前元素==右侧元素
						if(this.data[row][col] == this.data[row][col+1]){
							return false;
						}
					}	
					//如果当前元素不是最下方元素
					if(row<this.rn-1){
						//如果当前元素==下方元素
						if(this.data[row][col] == this.data[row+1][col]){
							return false;
						}
					}	
				}	
			}	
			//否则返回true
			return true;
		}	
	},
	
	start:function(){	//游戏开始
		this.state = this.RUNNING;	//当前状态正在运行
		//找到游戏结束界面，隐藏
		var div = document.getElementById("gameOver");
		div.style.display="none";
		//初始化二维数组this.data
		this.data=[
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0]
		];
		//重置分数为0
		this.score=0;
		//在两个随机位置生成2或4
		this.randomNum();
		this.randomNum();
		
		//将数据更新到页面；
		this.updateView();
	},
	
	isFull:function(){		//判断当前数组是否已满
		//双重for循环遍历二维数组
		for(var row=0;row<this.rn;row++){
			for(var col=0;col<this.cn;col++){
				//只要发现当前元素==0
				if(this.data[row][col] == 0){
					return false;
				}
			}
		}
		//如果循环正常退出
		return true;
	},
	
	randomNum:function(){		//在随机位置生成一个数
		//如果不满，执行下列条件
		if(!this.isFull()){
			while(true){
				//0-3随机生成一个行号
				var row=parseInt(Math.random()*this.rn);
				
				//0-3
				var col=parseInt(Math.random()*this.cn);
				//如果data[row][col]==0
				if(this.data[row][col]==0){
					//Math.random():<0.5	>=0.5
					//随机生成一个数 <0.5 ?2:4
					//放入data[row][col]
					this.data[row][col]=Math.random() > 0.5 ? 2:4;
					//退出循环
					break;
				}
			}
		}	
	},
	
	//更新视图
	updateView:function(){
		//将二维数组中每个格的数字放入前景格中
		//遍历二维数组中每个元素，比如：row=2，col=3，16
		for(var row=0;row<this.rn;row++){
			for(var col=0;col<this.cn;col++){
				//网页中一切元素、属性、文字都是对象
				var div=document.getElementById("c"+row+col);
				//c23
				
				//当前元素值
				var curr=this.data[row][col];
				//修改div开始标签和结束标签之间的内容
				div.innerHTML=curr!=0 ? curr:"";
				
				//修改div的class属性
				div.className=curr!=0 ? "cell n"+curr : "cell";
			}
		}
		
		var span=document.getElementById("score");
		span.innerHTML=this.score;
		
		//判断并修改游戏状态为GAMEOVER
		if(this.isGameOver()){
			this.state=this.GAMEOVER;
			var div=document.getElementById("gameOver");
			var span=document.getElementById("finalScore");
			span.innerHTML=this.score;
			
			//修改div的style属性下的display子属性为"block"
			div.style.display="block";
		}
	},
	
	//实现左移
	//找当前位置右侧，即下一个不为0的数
	getRightNext:function(row,col){
		//循环变量：nextc——指下一个元素的列下标
		//从col+1开始，遍历row行中剩余元素，<cn时结束
		for(var nextc=col+1;nextc<this.cn;nextc++){
			//如果遍历到的元素!=0
			if(this.data[row][nextc]!=0){
				//就返回nextc
				return nextc;
			}
		}
		//(循环正常结束)，就返回-1
		return -1;
	},
	
	/*找当前位置左侧，下一个不为0的数*/
	getLeftNext:function(row,col){
		//nextc从col-1开始，遍历row行中剩余元素，>=0结束
		for(var nextc=col-1;nextc>=0;nextc--){
			//    遍历过程中，同getRightNext
			if(this.data[row][nextc]!=0){
				return nextc;
			}
		}return -1;
	},
	
	//判断并左移，指定行中的每个元素
	moveLeftInRow:function(row){
		//col从0开始，遍历row行中的每个元素，到cn-1结束
		for(var col=0;col<this.cn-1;col++){
			//获得当前元素下一个不为0的元素的下标nextc
			var nextc=this.getRightNext(row,col);
			
			//如果nextc==-1，(说明后边没有!=0的元素)
			if(nextc==-1){
				break;
			}
			else{
				//如果当前位置==0
				if(this.data[row][col]==0){
					//将下一个位置的值，赋值给该位置
					this.data[row][col]=this.data[row][nextc];
					
					//下一个位置设置为0
					this.data[row][nextc]=0;
					
					//让col退一格，重新检查一次
					col--;
				}
				
				//如果当前位置等于下一个位置
				else if(this.data[row][col]==this.data[row][nextc]){
					//将当前位置*=2
					this.data[row][col]*=2;
					//下一个位置设置为0
					this.data[row][nextc]=0;
					//将当前位置的值，累加到score上
					this.score+=this.data[row][col];
				}
			}
		}
	},
	
	//判断并右移指定行中的每个元素
	moveRightInRow:function(row){
		//col从cn-1开始，到>0结束
		for(var col=this.cn-1;col>0;col--){
			var nextc=this.getLeftNext(row,col);
			if(nextc==-1){
				break;
			}
			else{
				if(this.data[row][col]==0){
					this.data[row][col]=this.data[row][nextc];
					this.data[row][nextc]=0;
					col++;
				}
				else if(this.data[row][col]==this.data[row][nextc]){
					this.data[row][col]*=2;
					this.data[row][nextc]=0;
					this.score+=this.data[row][col];
				}
			}
		}
	},
	
	//移动所有行——左移
	moveLeft:function(){
		//将老数据字符转为字符串类型赋值给oldStr
		var oldStr=this.data.toString();
		
		//循环遍历每一行
		for(var row=0;row<this.rn;row++){
			//调用moveLeftInRow方法，传入当前行号row
			this.moveLeftInRow(row);
		}
		//(循环结束后)
		//将新数据字符转换为字符串类型赋值给newStr
		var newStr=this.data.toString();
		//如果oldStr!=newStr
		if(oldStr!=newStr){
			//调用randomNum(),随机生成一个数
			this.randomNum();
			//调用updateView(),更新页面
			this.updateView();
		}
	},
	
	//移动所有行——右移
	moveRight:function(){
		var oldStr=this.data.toString();
		for(var row=0;row<this.rn;row++){
			this.moveRightInRow(row);
		}
		var newStr=this.data.toString();
		if(oldStr!=newStr){
			this.randomNum();
			this.updateView();
		}
	},
	
	//获得任意位置下方不为0的位置
	getDownNext:function(row,col){
		//nextr从row+1开始，到this.rn结束
		for(var nextr=row+1;nextr<this.rn;nextr++){
			if(this.data[nextr][col]!=0){
				return nextr;
			}
			return -1;
		}
	},
	
	//判断并上移，指定列中的每个元素
	moveUpInCol:function(col){
		//row从0开始，到rn-1，遍历每一行元素
		for(var row=0;row<this.rn-1;row++){
			//先从当前位置下方不为0的行nextr
			var nextr=this.getDownNext(row,col);
			//如果nextr==-1
			if(nextr==-1){
				break;
			}
			//否则
			else{
				//如果当前位置等于0
				if(this.data[row][col]==0){
					//将当前位置替换为nextr位置的元素
					this.data[row][col]=this.data[nextr][col];
					//将nextr对应位置，置为0
					this.data[nextr][col]=0;
					//退一行，再循环时保持原状
					row--;
				}
				//否则，如果当前位置等于nextr位置
				else if(this.data[row][col]==this.data[nextr][col]){
					//将当前位置*=2
					this.data[row][col]*=2;
					//将nextr位置置为0
					this.data[nextr][col]=0;
					//将当前的值累加到score属性上
					this.score+=this.data[row][col];
				}
			}
		}
	},
	
	//上移所有列
	moveUp:function(){
		var oldStr=this.data.toString();
		//遍历所有列
		for(var col=0;col<this.cn-1;this.moveUpInCol(col++));
		var newStr=this.data.toString();
		if(oldStr!=newStr){
			this.randomNum();
			this.updateView();
		}
	},
	
	//下移所有列
	moveDown:function(){
		var oldStr=this.data.toString();
		for(var col=0;col<this.cn;this.moveDownInCol(col++));
		var newStr=this.data.toString();
		if(oldStr!=newStr){
			this.randomNum();
			this.updateView();
		}
	},
	
	moveDownInCol:function(col){
		//row从this.rn-1，到>0结束，row--
		for(var row=this.rn-1;row>0;row--){
			//定义一个元素nextr
			var nextr=this.getUpNext(row,col);
			//如果下一个元素==-1，跳出循环
			if(nextr==-1){
				break;
			}
			else{
				if(this.data[row][col]==0){
					this.data[row][col]=this.data[nextr][col];
					this.data[nextr][col]=0;
					row++;
				}
				else if(this.data[row][col]==this.data[nextr][col]){
					this.data[row][col]*=2;
					this.data[nextr][col]=0;
					this.score+=this.data[row][col];
				}
			}
		}
	},
	
	//获得任意位置上方不为0的位置
	getUpNext:function(row,col){
		//遍历行数，依次-1
		for(var nextr=row-1;nextr>0;nextr--){
			if(this.data[nextr][col]!=0){
				return nextr;
			}
		}
		return -1;
	}
}

//window下onload事件，当页面加载后，自动执行
window.onload=function(){
	//页面加载完毕，自动启动游戏
	game.start();
	//当键盘按键时，触发移动
	document.onkeydown=function(){
		//获得事件对象中键盘号：2步
		//事件对象：在事件发生时自动创建，
		//		封装了事件的信息
		if(game.state==game.RUNNING){
			//Step1：获得事件对象
			var e=window.event||arguments[0];
					//IE标准		DOM标准
			//Step2：获得键盘号——e.keyCode
			if(e.keyCode==37){
				game.moveLeft();
			}
			else if(e.keyCode==39){
				game.moveRight();
			}
			else if(e.keyCode==38){
				game.moveUp();
			}
			else if(e.keyCode==40){
				game.moveDown();
			}
			//如果按左键，调用moveLeft
			//否则如果按右键，调用moveRight
		}
	}
}
