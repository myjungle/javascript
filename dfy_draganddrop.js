function dragndropcontrol(varname){

	// 드래그 앤 드롭
	// http://www.psyonline.kr

	this.keeperclassname='keeper';
	this.guideclassname='guide';
	this.useanimation=false;
	this.animationspeed=3;

	this.mobj=null;
	this.oobj=null;
	this.onobj=null;
	this.gobj=null;
	this.hlobox=null;
	this.movable=false;
	this.mx=0;
	this.my=0;

	this.tbox=new Array();
	this.tboxomv=new Array();
	this.addtargetbox=function(id,offsetminusvalue){
		this.tbox.push(document.getElementById(id));
		this.tboxomv.push((offsetminusvalue)? offsetminusvalue : 0);
	}	

	var isie=(navigator.userAgent.toLowerCase().indexOf('msie')!=-1)? true : false;
	if((/msie 9/i).test(navigator.userAgent)) isie=false;

	this.initialize=function(){
		var childs;
		for(var i=0,max=this.tbox.length; i<max; i++){
			childs=this.tbox[i].childNodes;
			for(var j=0,jmax=childs.length; j<jmax; j++){
				if(childs[j].nodeType==1) this.makemoveableobject(childs[j],i);
				else{
					this.tbox[i].removeChild(childs[j]);
					j--;
					jmax--;
				}
			}
		}
	}

	var childtagname=null;
	this.makemoveableobject=function(object,boxnum){
		object.style.cursor='move';
		object.onmousedown=function(e){
			if(isie) e=window.event;
			this.mypos=eval(varname).getposition(this);
			if(this.parentNode.childNodes.length==1) childtagname=this.tagName;
			eval(varname).makecoords();
			eval(varname).movable=true;
			eval(varname).mx=e.clientX;
			eval(varname).my=e.clientY;
			eval(varname).mobj=this.cloneNode(true);
			with(eval(varname).mobj.style){
				position='absolute';
				width=(this.offsetWidth-eval(varname).tboxomv[boxnum])+'px';
				zIndex='1001';
			}
			eval(varname).mobj.left=this.mypos[0];
			eval(varname).mobj.top=this.mypos[1];
			eval(varname).setposition(this.mypos[0],this.mypos[1]);
			this.parentNode.appendChild(eval(varname).mobj);
			eval(varname).mobj.height=eval(varname).mobj.offsetHeight;
			this.className=eval(varname).keeperclassname;
			eval(varname).oobj=this;
			eval(varname).onobj=this.nextSibling;
			if(eval(varname).onobj==eval(varname).mobj) eval(varname).hlobox=this.parentNode;
			else eval(varname).hlobox=null;
			document.documentElement.onmousemove=function(e){
				if(eval(varname).movable){
					if(isie) e=window.event;
					eval(varname).mobj.left=eval(varname).mobj.offsetLeft-(eval(varname).mx-e.clientX);
					eval(varname).mobj.top=eval(varname).mobj.offsetTop-(eval(varname).my-e.clientY);
					eval(varname).mobj.right=eval(varname).mobj.left+eval(varname).mobj.offsetWidth;
					eval(varname).mobj.bottom=eval(varname).mobj.top+eval(varname).mobj.offsetHeight;
					eval(varname).setposition(eval(varname).mobj.left,eval(varname).mobj.top);
					eval(varname).checkboxcoords();
					eval(varname).mx=e.clientX;
					eval(varname).my=e.clientY;
				}
				return false;
			}
			document.documentElement.onmouseup=function(){
				eval(varname).movable=false;
				eval(varname).animationcheck();
				document.documentElement.onmousemove=null;
				document.documentElement.onmouseup=null;
				return false;
			}
			return false;
		}
	}

	this.animationcheck=function(){
		var guide,guidepos;
		if(!this.useanimation) this.returnorchange();
		else{
			guide=(this.gobj)? this.gobj : this.oobj;
			guidepos=this.getposition(guide);
			this.moveanimation(guidepos[0],guidepos[1]);
		}
	}

	this.returnorchange=function(){
		this.oobj.parentNode.removeChild(this.mobj);
		if(this.gobj){
			this.oobj.parentNode.removeChild(this.oobj);
			this.makemoveableobject(this.gobj,nowoverboxnum);
			this.gobj.className='';
			this.gobj='';
		}else{
			this.oobj.className='';
		}
	}

	var nowoverboxnum=null;
	this.checkboxcoords=function(){
		var checked=false;
		for(var i=0,max=this.tbox.length; i<max; i++){
			if((this.mobj.left>this.tbox[i].left && this.mobj.left<this.tbox[i].right) ||
			(this.mobj.right>this.tbox[i].left && this.mobj.right<this.tbox[i].right) ||
			(this.mobj.left<this.tbox[i].left && this.mobj.right>this.tbox[i].right)){
				if(this.mobj.bottom>this.tbox[i].top && this.mobj.top<this.tbox[i].bottom){
					nowoverboxnum=i;
					this.checkchildcoords();
					checked=true;
					break;
				}
			}
		}
		if(!checked) this.mobjoutside();
	}

	this.mobjoutside=function(){
		this.removegobj();
		nowoverboxnum=null;
		nowoverchildnum=null;
	}

	var nowoverchildnum=null;
	this.checkchildcoords=function(){
		var checked=false,childs=this.tbox[nowoverboxnum].childNodes;
		for(var i=0,j=0,max=childs.length; i<max; i++){
			if(this.gobj!=childs[i]){
				if(this.mobj.top>childs[i].top && this.mobj.top<childs[i].bottom){
					if(nowoverchildnum!=j){
						this.removegobj();
						nowoverchildnum=j;
						this.makegobj(childs[j]);
					}
					checked=true;
					break;
				}
				j++;
			}
		}
		if(!checked && this.tbox[nowoverboxnum]!=this.hlobox && this.mobj.top>this.tbox[nowoverboxnum].top){
			if(nowoverchildnum!='last'){
				this.removegobj();
				nowoverchildnum='last';
				this.makegobj();
			}
		}
	}

	this.removegobj=function(){
		if(this.gobj){
			this.gobj.parentNode.removeChild(this.gobj);
			this.gobj=null;
		}
	}

	this.makegobj=function(target){
		if(!target){
			if(!this.tbox[nowoverboxnum].childNodes.length) this.gobj=document.createElement(childtagname);
			else this.gobj=this.tbox[nowoverboxnum].childNodes[0].cloneNode(true);
			this.gobj.className=this.guideclassname;
			this.gobj.innerHTML=this.mobj.innerHTML;
			this.tbox[nowoverboxnum].appendChild(this.gobj);
		}else if(target!=this.oobj && target!=this.onobj){
			this.gobj=target.cloneNode(true);
			this.gobj.className=this.guideclassname;
			this.gobj.innerHTML=this.mobj.innerHTML;
			this.tbox[nowoverboxnum].insertBefore(this.gobj,target);
		}
	}

	this.makecoords=function(){
		var boxpos,childs,childpos,childsah=0;
		for(var i=0,max=this.tbox.length; i<max; i++){
			boxpos=this.getposition(this.tbox[i]);
			this.tbox[i].left=boxpos[0];
			this.tbox[i].top=boxpos[1];
			this.tbox[i].right=boxpos[0]+this.tbox[i].offsetWidth;
			this.tbox[i].bottom=boxpos[1]+this.tbox[i].offsetHeight;
			childs=this.tbox[i].childNodes;
			for(var j=0,jmax=childs.length; j<jmax; j++) childsah+=childs[j].offsetHeight;
			childsah=Math.round((childsah/childs.length)/2);
			for(var j=0,isfirst=true,jmax=childs.length; j<jmax; j++){
				childpos=this.getposition(childs[j]);
				if(isfirst){
					childs[j].top=boxpos[1]-childsah;
					isfirst=false;
				}else childs[j].top=childs[j-1].bottom-1;
				childs[j].bottom=(childpos[1]+childs[j].offsetHeight)-childsah;
			}
		}
	}

	this.getposition=function(target,aa){
		var rv=[0,0];
		for(var ckobj=target;
		ckobj.tagName.toLowerCase()!='body' && ckobj.tagName.toLowerCase()!='html';
		ckobj=ckobj.offsetParent) rv=[rv[0]+ckobj.offsetLeft,rv[1]+ckobj.offsetTop];
		if(isie) rv=[rv[0]+1,rv[1]+1];
		return rv;
	}

	this.setposition=function(left,top){
		this.mobj.style.left=left+'px';
		this.mobj.style.top=top+'px';
	}

	this.moveanimation=function(left,top){
		clearTimeout(this.mobj.posact);
		var obj=this.mobj,s=this.animationspeed,pos=this.getposition(this.mobj,1);
		var gap=(Math.abs(pos[0]-left)>Math.abs(pos[1]-top))? 1 : 0;
		var action=function(){
			pos=[obj.left,obj.top];
			if(pos[0]==left && pos[1]==top) eval(varname).returnorchange();
			else{
				if(gap){
					obj.left=(pos[0]<left)? pos[0]+Math.ceil((left-pos[0])/s) : pos[0]-Math.ceil((pos[0]-left)/s);
					obj.top=Math.abs(pos[1]-top)*(Math.abs(obj.left-pos[0])/Math.abs(pos[0]-left));
					obj.top=(pos[1]<top)? pos[1]+obj.top : pos[1]-obj.top;
				}else{
					obj.top=(pos[1]<top)? pos[1]+Math.ceil((top-pos[1])/s) : pos[1]-Math.ceil((pos[1]-top)/s);
					obj.left=Math.abs(pos[0]-left)*(Math.abs(obj.top-pos[1])/Math.abs(pos[1]-top));
					obj.left=(pos[0]<left)? pos[0]+obj.left : pos[0]-obj.left;
				}
				eval(varname).setposition((obj.left==left)? left : obj.left,(obj.top==top)? top : obj.top);
				obj.posact=setTimeout(action,10);
			}
		}
		action();
	}

}
