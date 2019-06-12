// (function(){
//     function HeadNavbar(text,el,parent){
//         this.text=text;
//         this.el=el;
//         this.parent=parent;
//         this.appen=function(){
//             document.getElementById(this.parent).innerHTML=navStr;
//         }
//     }
// })()


const a=1;
console.log(a)
const navList=['首页','免费资源','课程中心','IT学院','学院故事','IT学院','学院故事']
var navStr='<ul>'
for(let i in navList) {
    navStr += '<li><a>'+navList[i]+'</a></li>';
}
navStr+='</ul>'
document.getElementById("navList").innerHTML=navStr;