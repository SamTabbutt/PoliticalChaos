class aisSys{
    constructor(){
        this.chaosVars = [.95,.7,.6,3.5,.25,.1];
        this.numVars = 6;
        this.currentVars = this.chaosVars;
    }
    alterVars(vars){
        this.currentVars = vars;
    }
    alterVarsByIndex(index,newVar){
        this.currentVars[index] = newVar;
    }
    returnToChaos(){
        this.currentVars = this.chaosVars;
    }
    getNumVars(){
        return this.numVars;
    }
    f(X,vars){
        var dx = (X[2]-vars[1]) * X[0] - vars[3]*X[1];
        var dy = vars[3] * X[0] + (X[2]-vars[1]) * X[1];
        var dz = vars[2] + (vars[0]*X[2]) - (Math.pow(X[2],3)/3) - (Math.pow(X[0],2)+Math.pow(X[1],2))*(1+vars[4]*X[2]) + (vars[5]*X[2]*Math.pow(X[0],3));
        return [dx,dy,dz]
    
    }
    generateOrbit(X0){
        var dt = .01;
        var sequence = [X0];
        var t = 0;
        var tfin = 30;
        let X = X0
        while (t<tfin){
            var dX = this.f(X,this.currentVars);
            X = X.map(function (num, idx) {
                return num + dX[idx]*dt;
              });
            t = t + dt;
            sequence.push(X);
        }
        return sequence;   
    }
    generateBif(dimInd,dimComInd,varInd,lim,freq){
        this.alterVarsByIndex(varInd,0);
        var X0 = [.1,0,.1]
        var change = lim/freq;
        var bif = [];
        while (this.currentVars[varInd]<lim){
            var indList = [];
            var curOrb = this.generateOrbit(X0);
            var lastElems = curOrb.slice(Math.max(curOrb.length - 750, 0));
            for (var i = 1; i<lastElems.length-1;i++){
                if (lastElems[i][dimInd]>lastElems[i-1][dimInd]&&lastElems[i][dimInd]>lastElems[i+1][dimInd]){
                    indList.push(lastElems[i][dimComInd]);
                }
            }
            bif.push(indList);
            this.alterVarsByIndex(varInd,this.currentVars[varInd]+change);
        }
        return bif;
    }
}

class arnSys extends aisSys{
    constructor(){
        super();
        this.chaosVars = [5,3.8];
        this.numVars = 2;
        this.currentVars = this.chaosVars;
    }
    f(X,vars){
        var dx = X[1];
        var dy = X[2];
        var dz = vars[0]*X[0] - vars[1]*X[1] - X[2] - X[0]**3;
        return [dx,dy,dz]
    
    }
}

class burkeSys extends aisSys{
    constructor(){
        super();
        this.chaosVars = [10,4.272];
        this.numVars = 2;
        this.currentVars = this.chaosVars;
    }
    f(X,vars){
        var dx = -1*vars[0]*(X[0]+X[1]);
        var dy = -1*X[1]-vars[0]*X[0]*X[2];
        var dz = vars[1]+vars[0]*X[0]*X[1];
        return [dx,dy,dz]
    
    }
}

class chenSys extends aisSys{
    constructor(){
        super();
        this.chaosVars = [40,3,28];
        this.numVars = 3;
        this.currentVars = this.chaosVars;
    }
    f(X,vars){
        var dx = vars[0]*(X[1]-X[0]);
        var dy = (vars[2]-vars[0])*X[0]-X[0]*X[2]+vars[2]*X[1];
        var dz = X[0]*X[1]-vars[1]*X[2];
        return [dx,dy,dz]
    
    }
}

class rosslerSys extends aisSys{
    constructor(){
        super();
        this.chaosVars = [.2,.2,5.7];
        this.numVars = 3;
        this.currentVars = this.chaosVars;
    }
    f(X,vars){
        var dx = -1*X[1]-X[2];
        var dy = X[0]+vars[0]*X[1];
        var dz = vars[1]+X[2]*(X[0]-vars[2]);
        return [dx,dy,dz]
    
    }
}



function ReturnLinear() {
    var i;
    var table="<tr><th>x</th><th>y</th><th>z</th></tr>";
    let system = new arnSys();
    var x = system.generateOrbit([0,0.1,0]);
    for (i = 0; i <x.length; i++) { 
      table += "<tr><td>" +
      x[i][0] +
      "</td><td>" +
      x[i][1] +
      "</td><td>" +
      x[i][2]
      "</td></tr>";
    }
    document.getElementById("t").innerHTML = table;
  }


