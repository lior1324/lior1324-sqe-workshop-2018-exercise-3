import * as esprima from 'esprima';
import * as esgraph from 'esgraph';


//json-summary change back from html...
let localDic={};
let globalDic={};
let userVars='';
let codeLines='';
let insideTrueIf=true;
let stopColor=false;
let outputLines=[];
let functionRow=0;
let globalNumber=1;

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse,{loc:true});
};


const getTextFinished=(codeToParse,variables)=>{
    globalDic={};localDic={};functionRow=0;outputLines=[];stopColor=false;insideTrueIf=true;let parsedCode=parseCode(codeToParse);
    userVars=variables;globalNumber=1;
    codeLines=codeToParse.split('\n');
    for(var i in parsedCode) { // im walking above all the out side.
        if (i === 'body') {
            for (var j in parsedCode[i]) {// thats the array of all the functions.
                //if (parsedCode[i][j]['type'] === 'FunctionDeclaration') {
                functionDeclarationFinder(parsedCode[i][j]);
                //}
            }
        }
    }
    return buildCfg(codeToParse);
};
const buildCfg = (code)=>{
    var parsedCode=parseCode(code)['body'][0]['body'];
    var graph =esgraph(parsedCode);
    var stringGraph=esgraph.dot(graph);
    stringGraph = removeException(stringGraph);
    stringGraph = removeEntryExitNodes(stringGraph);
    stringGraph = changeTrueAndFalseOnArc(stringGraph);
    setColorAndNumbers(graph[2]);
    stringGraph = changeNodesLabelsAndStyle(stringGraph,graph[2]);
    return stringGraph;
};
const setColorAndNumbers = (arrObject)=>{
    realColorAndNumber(arrObject[1],'green',1);
};
const realColorAndNumber = (node,color) =>{
    var colorTrue='',colorFalse='';
    if(node['type']==='exit') {return;}
    if(node['false']!=undefined) {
        var parsedCode = node['astNode'];
        var left = getInit(parsedCode['left']);var right = getInit(parsedCode['right']);left = checkIfNan(left);right = checkIfNan(right);left = checkIfString(left);right=checkIfString(right);
        var ans = eval(left + parsedCode['operator'] + right);
        colorFalse = colorByWhileOrIfFalse(ans, node['parent'],color);colorTrue = colorByWhileOrIfTrue(ans,color);
        if (node['parent']['type'] === 'WhileStatement') {  var temp= node['color'];
            /*node['color']=color;*/checkColorReplaceIf(node,color);
            if(checkWhenToReturn(temp,color)) return;
            realColorAndNumber(node['false'], colorFalse);realColorAndNumber(node['true'], colorTrue);
        } else {
            checkColorReplaceIf(node,color);
            realColorAndNumber(node['false'], colorFalse);
            realColorAndNumber(node['true'], colorTrue);}}
    else {
        checkColorReplaceIf(node,color);
        realColorAndNumber(node['normal'], color);}
};
const checkWhenToReturn=(temp,color)=>{
    if((!(temp==='white' && color ==='green')) && temp!=undefined)
        return true;
    return false;
};
const checkColorReplaceIf=(node,color)=>{
    if(node['color']===undefined) {node['color'] = color;node['number'] = globalNumber;globalNumber++;}
    else {if(color==='green') {node['color'] = 'green';}}
};
const colorByWhileOrIfTrue=(ans,color)=>{
    if(color==='white')
        return 'white';
    if(ans){
        return 'green';
    }else {
        return 'white';
    }
};
const colorByWhileOrIfFalse=(ans,parsedCode,color)=>{
    if(color==='white')
        return 'white';
    if(parsedCode['type']==='WhileStatement'){
        return 'green';
    }else{
        // color true depends on the ans and false is the mashlim.
        if(!ans){
            return 'green';
        }else{
            return 'white';
        }
    }
};
const checkIfNan = (side) =>{
    if(isNaN(side)){
        var test=parseCode(side)['body'][0]['expression'];
        if(!(test['type']==='BinaryExpression'))
            return side;
        return getInit(parseCode(side)['body'][0]['expression']);
    }
    return side;
};
/*const colorNodesAndNumber = (stringGraph,arrObject)=>{
    let arr=stringGraph.split('\n');
    for(var i=1;i<arrObject.length-1;i++){
        var split = arr[i-1].split(' ');
        if(arrObject[i]['astNode']['type']==='VariableDeclaration'){
            var decString=declarationString(arrObject[i]['astNode']['declarations']);
            arr[i-1]=split[0]+' [label="'+decString+'", shape=rectangle]';
        }else if(arrObject[i]['astNode']['type']==='BinaryExpression'){
            var binString=BinaryString(arrObject[i]['astNode']);
            arr[i-1]=split[0]+' [label="'+binString+'", shape=diamond]';
        }else if(arrObject[i]['astNode']['type']==='AssignmentExpression'){
            var assiString=assigmentString(arrObject[i]['astNode']);
            arr[i-1]=split[0]+' [label="'+assiString+'", shape=rectangle]';
        }else{ // (arrObject[i]['astNode']['type']==='ReturnStatement')
            var retuString=returnString(arrObject[i]['astNode']);
            arr[i-1]=split[0]+' [label="'+retuString+'", shape=rectangle]';
        }
    }
    return joinStringArray(arr);
};*/
const changeNodesLabelsAndStyle =(stringGraph,arrObject)=>{
    let arr=stringGraph.split('\n');
    for(var i=1;i<arrObject.length-1;i++){
        var split = arr[i-1].split(' ');
        if(arrObject[i]['astNode']['type']==='VariableDeclaration'){
            var decString=declarationString(arrObject[i]['astNode']['declarations']);
            arr[i-1]=split[0]+' [label="'+arrObject[i]['number']+'. '+decString+'", shape=rectangle, style = filled, fillcolor='+arrObject[i]['color']+']';
        }else if(arrObject[i]['astNode']['type']==='BinaryExpression'){
            var binString=BinaryString(arrObject[i]['astNode']);
            arr[i-1]=split[0]+' [label="'+arrObject[i]['number']+'. '+binString+'", shape=diamond, style = filled, fillcolor='+arrObject[i]['color']+']';
        }else if(arrObject[i]['astNode']['type']==='AssignmentExpression'){
            var assiString=assigmentString(arrObject[i]['astNode']);
            arr[i-1]=split[0]+' [label="'+arrObject[i]['number']+'. '+assiString+'", shape=rectangle, style = filled, fillcolor='+arrObject[i]['color']+']';
        }else{ // (arrObject[i]['astNode']['type']==='ReturnStatement')
            var retuString=returnString(arrObject[i]['astNode']);
            arr[i-1]=split[0]+' [label="'+arrObject[i]['number']+'. '+retuString+'", shape=rectangle, style = filled, fillcolor='+arrObject[i]['color']+']';
        }
    }
    return joinStringArray(arr);
};

const declarationString=(parsedCode)=>{
    var ans='';
    for (var i in parsedCode) {
        if(parsedCode[i]['init']!=null) {
            if (parsedCode[i]['init']['type'] === 'ArrayExpression') { // array
                ans = ans +parsedCode[i]['id']['name']+' = [';
                for (var j in parsedCode[i]['init']['elements']) {
                    ans = ans +getStringThird(parsedCode[i]['init']['elements'][j])+', ';
                }
                ans =ans.substring(0, ans.length-2);
                ans = ans + '], ';
            } else {
                ans = ans+parsedCode[i]['id']['name'] + ' = '+getStringThird(parsedCode[i]['init'])+', '; // there is init
            }
        }
        else { // no init
            ans=ans+parsedCode[i]['id']['name']+', ';}
    }
    return ans.substring(0, ans.length-2);
};
const BinaryString=(parsedCode)=>{
    //TODO: return the string.
    var left = findWhatLeft(parsedCode['left']);
    var rights = getStringThird(parsedCode['right']);
    return left +' '+parsedCode['operator']+' '+ rights;
};
const assigmentString=(parsedCode)=>{
    //TODO: return the string.
    var left = findWhatLeft(parsedCode['left']);
    var rights = getStringThird(parsedCode['right']);
    return left +' = '+ rights;
};
const returnString=(parsedCode)=>{
    //TODO: return the string.
    var string =getStringThird(parsedCode['argument']);
    return 'return '+string;
};
const getStringThird = (parsedCode)=>{
    if(parsedCode['type']==='Literal'){
        return literalFunctionLocal(parsedCode);
    }
    if(parsedCode['type']==='Identifier'){
        return identifierThird(parsedCode);
    }
    if(parsedCode['type']==='MemberExpression'){
        return memberExpressionThird(parsedCode);
    }
    if(parsedCode['type']==='UnaryExpression'){
        return unaryExpressionThird(parsedCode);
    }else{
        return binaryExpressionThird(parsedCode);
    }
};
const binaryExpressionThird =(parsedCode)=>{
    var left=0,right=0;
    if(parsedCode['left']['type']==='Literal'){
        left=literalFunctionLocal(parsedCode['left']);
    }else if (parsedCode['left']['type']==='Identifier'){
        left = identifierThird(parsedCode['left']);
    }else {
        left= binaryExpressionThird2(parsedCode['left']);
    }
    if(parsedCode['right']['type']==='Literal'){
        right=literalFunctionLocal(parsedCode['right']);
    }else if (parsedCode['right']['type']==='Identifier'){
        right = identifierThird(parsedCode['right']);
    }
    else {
        right = binaryExpressionThird2(parsedCode['right']);
    }
    return '('+left+' '+parsedCode['operator']+' '+right+')';
};
const binaryExpressionThird2 =(parsedCode)=>{
    if(parsedCode['type']==='MemberExpression'){
        return memberExpressionThird(parsedCode);
    }else if(parsedCode['type']==='UnaryExpression'){
        return unaryExpressionThird(parsedCode);
    }else { // binary expression
        return '('+getStringThird(parsedCode['left'])+' '+parsedCode['operator']+' '+getStringThird(parsedCode['right'])+')';
    }
};
const identifierThird = (parsedCode)=>{
    return parsedCode['name'];
};
const memberExpressionThird = (parsedCode)=>{
    return parsedCode['object']['name'] + '[' + getStringThird(parsedCode['property']) + ']';
};
const unaryExpressionThird = (parsedCode)=>{
    return parsedCode['operator']+' ('+getStringThird(parsedCode['argument'])+')';
};
const findWhatLeft = (parsedCode)=>{
    if(parsedCode['type']==='MemberExpression'){
        return parsedCode['object']['name'] + '[' + getStringThird(parsedCode['property']) + ']';
    }else{
        if(parsedCode['name']===undefined)
            return literalFunctionLocal(parsedCode);
        return parsedCode['name'];
    }
};
const changeTrueAndFalseOnArc = (graph) =>{
    let arr=graph.split('\n');
    for(var j =0; j<arr.length;j++){
        var temp = arr[j].split(' ');
        if(temp[1]==='->'){ // arc
            if(temp[3]==='[label="true"]') {//true
                arr[j]=temp[0]+' '+temp[1]+' '+temp[2]+' '+'[label="T"]';
            }
            else if(temp[3]==='[label="false"]'){
                arr[j]=temp[0]+' '+temp[1]+' '+temp[2]+' '+'[label="F"]';
            }
        }
    }
    return joinStringArray(arr) ;
};

const removeEntryExitNodes = (graph) =>{
    let arr=graph.split('\n');
    var nodeRemove=getNodeRemove(arr);
    for(var j =0; j<arr.length;j++){
        var temp = arr[j].split(' ');
        if(nodeRemove.includes(temp[0])){ // node + maybe arc gets in
            arr[j] = '';
        }
        else if(temp[1]==='->' && nodeRemove.includes(temp[2])) { // arc
            arr[j] = '';
        }
    }
    return joinStringArray(arr) ;
};

const joinStringArray=(arr)=>{
    let ans=[];
    for(var j =0; j<arr.length;j++){
        if(!(arr[j]==='')){
            ans.push(arr[j]);
        }
    }
    return ans.join('\n');
};

const getNodeRemove= (arr)=>{
    var nodeRemove=[];
    for(var i =0; i<arr.length;i++){
        if(arr[i].includes('entry') || arr[i].includes('exit')){
            nodeRemove.push(arr[i].split(' ')[0]);
        }
    }
    return nodeRemove;
};
const removeException = (graph)=>{
    let arr=graph.split('\n');
    for(var i =0; i<arr.length;i++){
        if(arr[i].includes('exception')){
            arr[i]='';
        }
    }
    return joinStringArray(arr);
};
const functionDeclarationFinder =(parsedCode)=>{
    // moving the parameter that we get by the thing.
    outputLines.push (codeLines[functionRow]);
    functionRow++;
    var partOfInput = smartSplit(userVars);
    for(var i in parsedCode['params']) {
        matchInput2Dic(partOfInput[i].trim(),parsedCode['params'][i]);
    }
    for (var j in parsedCode['body']['body']){
        localTreat(parsedCode['body']['body'][j]);
    }
    outputLines.push ('}');
    functionRow++;
    // moving down the slide just copy the sentences down and u all good.
};
const localTreat=(parsedCode)=>{
    if(parsedCode['type']==='VariableDeclaration') {
        declarationLocal(parsedCode['declarations']);
    }else if (parsedCode['type']==='ExpressionStatement') {
        assigmentLocal(parsedCode['expression']);
    }else if(parsedCode['type']==='IfStatement'){
        IfLocal(parsedCode,'if ',true);
    }else if(parsedCode['type']==='ReturnStatement'){
        returnLocal(parsedCode);
    }else{ // while
        whileLocal(parsedCode);
    }
};
const declarationLocal=(parsedCode)=>{
    // remove from the line
    functionRow++;
    for (var i in parsedCode) {
        if(parsedCode[i]['init']!=null) {
            if (parsedCode[i]['init']['type'] === 'ArrayExpression') {
                for (var j in parsedCode[i]['init']['elements']) {
                    var name = parsedCode[i]['id']['name'] + '[' + j + ']';
                    localDic[name] = getString(parsedCode[i]['init']['elements'][j]);
                }
            } else {
                localDic[parsedCode[i]['id']['name']] = getString(parsedCode[i]['init']);
            }
        }
        else {
            localDic[parsedCode[i]['id']['name']] = '';
        }
    }
};
const getString =(parsedCode)=>{
    if(parsedCode['type']==='Literal'){
        return literalFunctionLocal(parsedCode);
    }
    if(parsedCode['type']==='Identifier'){
        return identifierFunctionLocal(parsedCode);
    }
    if(parsedCode['type']==='MemberExpression'){
        return memberExpressionLocal(parsedCode);
    }
    if(parsedCode['type']==='UnaryExpression'){
        return unaryExpressionLocal(parsedCode);
    }else{
        return binaryExpressionLocal(parsedCode);
    }
};
const literalFunctionLocal=(parsedCode)=>{
    if(parsedCode['raw'].includes('"'))
        return parsedCode['raw'].replace(/"/g,'\'');
    if(isNaN(parsedCode['raw']))
        return parsedCode['raw'];
    return parsedCode['value'];
};

const identifierFunctionLocal=(parsedCode)=>{
    if(globalDic.hasOwnProperty(parsedCode['name'])){
        return parsedCode['name'];
    }else{
        return localDic[parsedCode['name']];
    }
};
const memberExpressionLocal=(parsedCode)=>{
    var string = parsedCode['object']['name'] + '[' + getInit(parsedCode['property']) + ']';
    if(globalDic.hasOwnProperty(string)){
        return string;
    }else if (localDic.hasOwnProperty(string)){
        return localDic[string];
    }else{
        return string;
    }
};
const unaryExpressionLocal=(parsedCode)=>{
    return parsedCode['operator']+' ('+getString(parsedCode['argument'])+')';
};
const binaryExpressionLocal=(parsedCode)=>{
    var left=0,right=0;
    if(parsedCode['left']['type']==='Literal'){
        left=literalFunctionLocal(parsedCode['left']);
    }else if (parsedCode['left']['type']==='Identifier'){
        left = identifierFunctionLocal(parsedCode['left']);
    }else {
        left= binaryExpressionLocal2(parsedCode['left']);
    }
    if(parsedCode['right']['type']==='Literal'){
        right=literalFunctionLocal(parsedCode['right']);
    }else if (parsedCode['right']['type']==='Identifier'){
        right = identifierFunctionLocal(parsedCode['right']);
    }
    else {
        right = binaryExpressionLocal2(parsedCode['right']);
    }
    return '('+left+' '+parsedCode['operator']+' '+right+')';
};
const binaryExpressionLocal2 =(parsedCode)=>{
    if(parsedCode['type']==='MemberExpression'){
        return memberExpressionLocal(parsedCode);
    }else if(parsedCode['type']==='UnaryExpression'){
        return unaryExpressionLocal(parsedCode);
    }else { // binary expression
        return '('+getString(parsedCode['left'])+' '+parsedCode['operator']+' '+getString(parsedCode['right'])+')';
    }
};
const assigmentLocal=(parsedCode)=>{
    // check left and right and add to the table accordingly
    functionRow++;
    var left = findWhatLeftGlobal(parsedCode['left']);
    var rights = getString(parsedCode['right']);
    var rightv = getInit(parsedCode['right']);
    if(globalDic.hasOwnProperty(left)){
        globalDic[left]=rightv;
    }else{
        localDic[left]=rights;
    }
};
const IfLocal =(parsedCode,ifelse,shouldIColor)=>
{
    var saveLocal={},saveGlobal={};
    saveLocal=copyDic(localDic);saveGlobal=copyDic(globalDic);
    var IfTest=getString(parsedCode['test']),color='';
    color =booleanToColor(myEval(parseCode(IfTest)['body'][0]['expression']));        functionRow++;    color=checkIfColor(shouldIColor,color);
    if(parsedCode['consequent']['type']==='BlockStatement'){
        outputLines.push(ifelse+' ('+IfTest+') {' + color);
        for (var j in parsedCode['consequent']['body']){
            localTreat(parsedCode['consequent']['body'][j]);}
        outputLines.push('}');functionRow++;}
    else{
        outputLines.push(ifelse+' ('+IfTest+')'+color);
        localTreat(parsedCode['consequent']);}
    localDic=saveLocal;globalDic=saveGlobal;
    if(parsedCode['alternate']!=null){
        elseIfStatementFinder(parsedCode['alternate'],color);
    }
    localDic=saveLocal;globalDic=saveGlobal;
};
const checkIfColor=(shouldIColor,color)=>{
    if(color==='~'){
        insideTrueIf=true;
    }
    else{
        insideTrueIf=false;
    }
    return color;
};
const copyDic=(Dic)=>{
    var ans ={};
    for (var key in Dic) {
        ans[key]=Dic[key];
    }
    return ans;
};
const booleanToColor=(bool)=>{
    if(bool)
        return '~'; // green is mapped to ~
    return '@'; // red is mapped to @
};
const myEval=(parsedCode)=>{
    var left =getInit(parsedCode['left']);
    var right=getInit(parsedCode['right']);
    left=checkIfString(left);
    right=checkIfString(right);
    var ans = eval(left +parsedCode['operator']+right);
    return ans;
};
const checkIfString=(checking)=>{
    if(typeof checking === 'string' || checking instanceof String){
        if(!checking.includes('\''))
            return '\''+checking+'\'';
    }
    return checking;
};

const elseIfStatementFinder= (parsedCode,color)=>
{
    if(parsedCode['type']==='IfStatement'){ // case of else if
        if(color==='~'){
            IfLocal(parsedCode,'else if ',false); // e for else if
        }else{
            IfLocal(parsedCode,'else if ',true);} // e for else if
    }
    else{ // case of else
        functionRow++;
        if(parsedCode['type']==='BlockStatement'){// check if block or not {}....
            outputLines.push('else {');
            for (var j in parsedCode['body']){
                localTreat(parsedCode['body'][j]);}
            outputLines.push('}');        functionRow++;
        } else{
            outputLines.push('else');
            localTreat(parsedCode);}
    }
};
const returnLocal=(parsedCode)=>{
    var string =getString(parsedCode['argument']);
    var newLine='return '+string+';';
    functionRow++;
    if(insideTrueIf){
        stopColor=true;
    }
    outputLines.push(newLine);
};
const whileLocal=(parsedCode)=>{
    var whileTest,stoplocal=stopColor;
    whileTest=getString(parsedCode['test']);
    if(!myEval(parseCode(whileTest)['body'][0]['expression'])){
        stopColor=true;
    }
    functionRow++;
    if(parsedCode['body']['type']==='BlockStatement'){
        outputLines.push('while ('+whileTest+') {');
        for (var j in parsedCode['body']['body']){
            localTreat(parsedCode['body']['body'][j]);
        }
        outputLines.push('}');
        functionRow++;
    }else{
        outputLines.push('while ('+whileTest+')');
        localTreat(parsedCode['body']);
    }
    stopColor=stoplocal;
};
const smartSplit=(input)=>{
    var array='',flag=false,ans=[],splitted = input.split(',');
    for(var i in splitted){
        if(splitted[i].includes('[')){
            array = array+splitted[i]+', ';
            flag=true;
        }
        else if(splitted[i].includes(']')){
            ans.push(array+splitted[i]);
            flag=false;array='';
        } else if(flag===true) {
            array=array+splitted[i]+', ';
        }else {
            ans.push(splitted[i]);
        }
    }
    return ans;
};
const matchInput2Dic=(value,parsedCode)=>{
    if (value.includes('[')){ //array
        arrayHandler(value.substring(1, value.length-1),parsedCode);
    }else if(value.includes('\'') || value.includes('"')){ // string
        value = value.substring(1, value.length-1);
        globalDic[parsedCode['name']]=value;
    }else if(isNaN(value)){// number
        checkIfTrueOrFalse(value,parsedCode);
    }else{// true / false
        turnToNumber(value,parsedCode);
    }
};
const turnToNumber=(value,parsedCode)=>{
    if(value.includes('.')){
        globalDic[parsedCode['name']]=parseFloat(value);
    }else{
        globalDic[parsedCode['name']]=parseInt(value);
    }
};

const arrayHandler =(value,parsedCode)=>{
    var partOfInput = value.split(',');
    for (var i in partOfInput){
        partOfInput[i]=partOfInput[i].trim();
        if(partOfInput[i].includes('\'') || partOfInput[i].includes('"')){ // string
            value = partOfInput[i].substring(1, partOfInput[i].length-1);
            globalDic[parsedCode['name']+'['+i+']']=value;
        }else if(isNaN(partOfInput[i])){// true / false
            checkIfTrueOrFalseArr(i,partOfInput[i],parsedCode);
        }else{// number
            turnToNumberArr(i,partOfInput[i],parsedCode);
        }
    }
};
const turnToNumberArr =(i,value,parsedCode)=>{
    if(value.includes('.')){
        globalDic[parsedCode['name']+'['+i+']']=parseFloat(value);
    }else{
        globalDic[parsedCode['name']+'['+i+']']=parseInt(value);
    }
};
const checkIfTrueOrFalseArr =(i,value,parsedCode)=>{
    if(value==='true'){
        globalDic[parsedCode['name']+'['+i+']']=true;
    }
    else{
        globalDic[parsedCode['name']+'['+i+']']=false;
    }
};
const checkIfTrueOrFalse=(value,parsedCode)=>{
    if(value==='true'){
        globalDic[parsedCode['name']]=true;
    }
    else{
        globalDic[parsedCode['name']]=false;
    }
};
/*const globalTreat=(parsedCode)=>{
    if(parsedCode['type']==='VariableDeclaration')
    {
        declarationGlobal(parsedCode['declarations']);
    }
    else
    {
        assigmentGlobal(parsedCode);
    }

};*/

/*const assigmentGlobal=(parsedCode)=>{
    // need to check if it cointains in the global array
    // otherwise we change the value of it
    var left = findWhatLeftGlobal(parsedCode['expression']['left']);
    var right = getInit(parsedCode['expression']['right']);
    globalDic[left]=right;
    outputLines.push(left+' = '+right+';');
};*/


const findWhatLeftGlobal= (parsedCode)=>{
    if(parsedCode['type']==='MemberExpression'){
        return parsedCode['object']['name'] + '[' + getInit(parsedCode['property']) + ']';
    }else{
        return parsedCode['name'];
    }
};

/*const declarationGlobal=(parsedCode)=>{
    for (var i in parsedCode) {
        if(parsedCode[i]['init']!=null) {
            if (parsedCode[i]['init']['type'] === 'ArrayExpression') {
                for (var j in parsedCode[i]['init']['elements']) {
                    var name = parsedCode[i]['id']['name'] + '[' + j + ']';
                    globalDic[name] = getInit(parsedCode[i]['init']['elements'][j]);
                }
            } else {
                globalDic[parsedCode[i]['id']['name']] = getInit(parsedCode[i]['init']);
            }
        }
        else {
            globalDic[parsedCode[i]['id']['name']] = 0;
        }
    }
    outputLines.push(codeLines[functionRow]);
};*/

const getInit=(parsedCode)=>{
    // literal computed identifier unary binary
    if(parsedCode['type']==='Literal'){
        return literalFunctionGlobal(parsedCode);
    }
    if(parsedCode['type']==='Identifier'){
        return identifierFunctionGlobal(parsedCode);
    }
    if(parsedCode['type']==='MemberExpression'){
        return memberExpressionGlobal(parsedCode);
    }
    if(parsedCode['type']==='UnaryExpression'){
        return unaryExpressionGlobal(parsedCode);
    }else{
        return binaryExpressionGlobal(parsedCode);
    }
};

const literalFunctionGlobal=(parsedCode)=>{
    if(parsedCode['raw'].includes('"'))
        return parsedCode['raw'].replace(/"/g,'\'');
    if(isNaN(parsedCode['raw']))
        return parsedCode['raw'];
    return parsedCode['value'];
};
const binaryExpressionGlobal=(parsedCode)=>{
    var left=0,right=0;
    if(parsedCode['left']['type']==='Literal'){
        left=parsedCode['left']['value'];
    }else if (parsedCode['left']['type']==='Identifier'){
        left = globalDic[parsedCode['left']['name']];
    }else {
        left= binaryExpressionGlobal2(parsedCode['left']);
    }
    if(parsedCode['right']['type']==='Literal'){
        right=parsedCode['right']['value'];
    }else if (parsedCode['right']['type']==='Identifier'){
        right = globalDic[parsedCode['right']['name']];
    }
    else {
        right = binaryExpressionGlobal2(parsedCode['right']);
    }
    return getValueGlobal(left,right,parsedCode['operator']);

};

const binaryExpressionGlobal2=(parsedCode)=>{
    if(parsedCode['type']==='MemberExpression'){
        var string = parsedCode['object']['name'] + '[' + getInit(parsedCode['property']) + ']';
        return globalDic[string];
    }else if(parsedCode['type']==='UnaryExpression'){
        return -1 * getInit(parsedCode['argument']);
    }else { // binary expression
        return getValueGlobal(getInit(parsedCode['left']),getInit(parsedCode['right']),parsedCode['operator']);
    }
};

const getValueGlobal=(left,right,operator)=>{
    switch (operator){
    case '+':
        return left+right;
    case '-':
        return left-right;
    case '*':
        return left*right;
    case '/':
        return left/right;
    }
};
const unaryExpressionGlobal=(parsedCode)=>{
    return -1 * getInit(parsedCode['argument']);
};
const memberExpressionGlobal=(parsedCode)=>{
    var string = parsedCode['object']['name'] + '[' + getInit(parsedCode['property']) + ']';
    return globalDic[string];
};
const identifierFunctionGlobal=(parsedCode)=>{
    if(globalDic.hasOwnProperty(parsedCode['name'])){
        return globalDic[parsedCode['name']];
    }else{
        return localDic[parsedCode['name']];
    }
};


export {parseCode,getTextFinished};
