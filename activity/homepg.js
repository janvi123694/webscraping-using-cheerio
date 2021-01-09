 // npm install request  -> to install request module 
 // npm init   -> to get package.json file 
 // npm install cheerio -> to install cheerio module


 let request = require("request"); // dependencies ; importing functions /modules  
 let cheerio = require("cheerio");
 const getAllMatches = require("./allMatches");    //allMatches is a js file in same folder. we need to pass complete link to it 

 let link = "https://www.espncricinfo.com/series/_/id/19439/season/2019/icc-mens-cricket-world-cup-league-2"; // main link 

 request(link,cb);    // requesr is the high order function ; cb is teh call back func ; INPUT -> LINK OP -> HTML FILE 


 function cb(error,response,html){    
 	 if(error==null && response.statusCode==200){  // successful response
	 	 console.log("good");
		 parseData(html); 
	 }
	 else if(response.statusCode==404){   
	 	 console.log("page not foubd");
	 }
	 else{
	    console.log("error");
	 }
  }
  

  function parseData(html){
    // fs.writeFileSync("./home.html",html)   // args-> filename , data 

    let ch = cheerio.load(html);       // cheerio modeul to traverse thru dom since u cant do otherwise in node

	let aTag = ch(".widget-items.cta-link a").attr("href");    // link of VIEW RESULTS 
   //1.class1 -widget-items class2- cta-link ; 2. anchor tag is a child of element with class name = "widget" ; 3.anchor tags have unwanted info like  classname ,data hover ,target etc  4. we only need the link ie HREF soln-> cheerio's "attr"
	
	
	//console.log(aTag);  output -> /scores/series/19439/season/2019/icc-men's-cricket-world-cup-league-2?view=results  INCOMPLETE LINK

	//let completeLink = "https://www.espncricinfo.com/"+aTag; 

	getAllMatches("https://www.espncricinfo.com/scores/series/8039/season/2019/icc-cricket-world-cup?view=results"); // pass link to getAllMatches() in allMatches.js. that would display the links of all matches 

  }


  /* SUMMARY 
  1. from homepg.js send the links of view results button to allMatches.js 
  2. allMatches.js sends links of score card for every match to match.js
  3.match.js creates folders , updates/writes files

  1. module.exports vs modeule .exports.key 

  2.JSON 
  json is a way of storing data; light weight 
  u send data in teh form of objects 
  array of objects 

  3.functions 
   let batsmanFile = fs.readFileSync(batsmanPath); 
   fs.writeFileSync()
   fs.existsSync()
   fs.mkdirSync()
   
  4. cheerio 
   find 
   attr 
  4