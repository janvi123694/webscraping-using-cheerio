//   1. MUST DISPLAY LINKS OF ALL MATCHES 

 let request = require("request"); // dependencies
 let cheerio = require("cheerio");
 let getMatch = require("./match");
 
 function getAllMatches(link){  // LINK WAS COMPUTED IN homepg.js therefore exported getAllMatches() and passed link from homepg.js 
   //request(link,cb);    // request input-> link output -> html file
   request("https://www.espncricinfo.com/scores/series/8039/season/2019/icc-cricket-world-cup?view=results",cb);  // link of VIEW RESULTS all the matches along with results wud be displayed in small boxes 
 }
 

 function cb(error,response,html){    
 	 if(error==null && response.statusCode==200){  // successful response
	 	 console.log("successful response");
		 parseData(html); 
	 }
	 else if(response.statusCode==404){   
	 	 console.log("page not found");
	 }
	 else{
	    console.log("error");
	 }
  }
  
  function parseData(html){
    let ch = cheerio.load(html);                                // cheerio module to traverse thru dom
	 //console.log(html);                                        // html file wud be displayed on console 

	let allTags = ch("a[data-hover='Scorecard']"); // 1. cant use "" twice. can use " ",' '   2. allTags IS AN ARRAY OF ANCHOR TAGS.  3.anchor tags has unwanted info like  classname ,data hover ,target etc  4. we only need the link ie HREF
    // for every box ie match results there's a score card button so trying to access that anchor  tag 

	for(let i =0;i<allTags.length;i++){ 

		let link = ch(allTags[i]).attr("href");   // anchor tags have unwanted info like className etc we only want the link 
		let completeLink = "https://www.espncricinfo.com"+link; 

		//console.log(completeLink); 
		getMatch(completeLink);    // send the link to getMatch() in match.js so that it can display complete info for every match

	}
  }
 module.exports = getAllMatches; // getAllMatches is exported. can be used from anywhere. [ we're trying to make it accessible to homepg.js]