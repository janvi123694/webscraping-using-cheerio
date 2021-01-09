// retrieve details of a single match 
// to serach for an el in dev tools - ctrl f 
 let request = require("request"); // dependencies
 let cheerio = require("cheerio");
 let fs = require("fs");
 
 //let link = "https://www.espncricinfo.com/series/8039/scorecard/1144529/england-vs-australia-2nd-semi-final-icc-cricket-world-cup-2019"; 
 
 function getMatch(link){  
   request(link,cb);    // request input-> link output -> html file
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

     let ch = cheerio.load(html); 

	 let bothInnings = ch(".card.content-block.match-scorecard-table .Collapsible");  // array of 2 teams innings

	 for(let i= 0;i<bothInnings.length;i++){

	 	 let teamName = ch(bothInnings[i]).find("h5").text();   // OP->i =0  Australia Innings (50 overs maximum)   i=1 England Innings (target: 224 runs from 50 overs)  

		 // aim-> extract in the form -> i=0 Australia  i=1 England   

		 teamName= teamName.split(" ")[0]; 

		
		 let allTrs = ch(bothInnings[i]).find(".table.batsman tbody tr");  // 
		 for(let j =0;j<allTrs.length-1;j++){ // <i.length-1 to avoid batsmanName =   runs= 14 balls= fours= sixes=  ie EMPTY OP

		 	 let allTds = ch(allTrs[j]).find("td"); 
			 if(allTds.length>1){ // valid ones 
			  let batsmanName = ch(allTds[0]).find("a").text().trim(); // to use find() , attr() etc need CHEERIO 
			  let runs= ch(allTds[2]).text().trim(); 
			  let balls=ch(allTds[3]).text().trim(); 
			  let fours=ch(allTds[5]).text().trim(); 
			  let sixes = ch(allTds[6]).text().trim(); 
			  let strikeRate = ch(allTds[7]).text().trim(); 
			 //console.log(`batsmanName = ${batsmanName}  runs= ${runs} balls=${balls} fours=${fours} sixes= ${sixes}`);  // string interpolation ie backticks easy to add dynamic data 
			 processDetails(teamName,batsmanName, runs , balls , fours , sixes , strikeRate); 
			 }

		 }
	 }
	
  }

  function checkTeamFolder(teamName){ 
    return fs.existsSync(teamName);  // 1.  ./ ie if it exists in same folder  2. fs.existsSync() returns true/false      
  }

  function createTeamFolder(teamName){
    fs.mkdirSync(teamName); // mkdirSync(foldername) to create a  new folder  
  }


  function checkBatsmanFile(teamName,batsmanName){ // team -> india ; file -> dhoni , jadeja  BATSMAN FILE PATH -India/dhoni.json

    let batsmanPath = `${teamName}/${batsmanName}.json`; // json  js obj notation ;way of storing files
	return fs.existsSync(batsmanPath); 

  }

  function createBatsmanFile(teamName,batsmanName, runs , balls , fours , sixes , strikeRate){
    let batsmanPath = `${teamName}/${batsmanName}.json`; // fwd slash during path  
    let batsmanFile = []; 
	let inning ={
	 teamName: teamName,     // key value names can be of same or diff name 
	 batsmanName: batsmanName, 
	 runs : runs, 
	 balls: balls,
	 fours : fours , 
	 sixes: sixes, 
	 SR : strikeRate
	};

	batsmanFile.push(inning);  // push the object onto the array 
	batsmanFile = JSON.stringify(batsmanFile);  // 1.MUST Stringify BEFORE ADDING INTO JSON FILE. 2. Stringify->to convert an obj into string  3. when sending data o/from web server it must be sent as a string 

	fs.writeFileSync(batsmanPath,batsmanFile);    // Q WHY DO I HAVE TO WRITE AN ARRAY?? 
   }


  function updateBatsmanFile(teamName,batsmanName, runs , balls , fours , sixes , strikeRate){

     let batsmanPath = `${teamName}/${batsmanName}.json`; // fwd slash during path  
	 let batsmanFile = fs.readFileSync(batsmanPath);    // OP-> stringified file  to convert it in obj form ->JSON.parse()  
	 batsmanFile = JSON.parse(batsmanFile);     // conversion stringified file into the object form  
	 let inning ={
	 teamName: teamName,     // key value names can be of same or diff name 
	 batsmanName: batsmanName, 
	 runs : runs, 
	 balls: balls,
	 fours : fours , 
	 sixes: sixes, 
	 SR : strikeRate
	};

	 batsmanFile.push(inning); 

	 // 1. stringify file 2. UPDATE 
	 batsmanFile = JSON.stringify(batsmanFile); 
	 fs.writeFileSync(batsmanPath,batsmanFile); 
  }


  //  FUNCTION THAT CREATES FOLDERS FOR TEAMS AND CREATES/UPDATES BATSMAN FILES 

  function processDetails(teamName,batsmanName, runs , balls , fours , sixes , strikeRate){
  	  let isTeamFolder = checkTeamFolder(teamName);// does team folder exists? 

	  if(isTeamFolder){  // if team folder exists, does is it have the player file?

	  let isBatsman = checkBatsmanFile(teamName,batsmanName);
	    if(isBatsman){
		 updateBatsmanFile(teamName,batsmanName, runs , balls , fours , sixes , strikeRate);
		}

		else{
		  createBatsmanFile(teamName,batsmanName, runs , balls , fours , sixes , strikeRate);
		}

	  }

	  else{   // team folder doesnt exists 1. create a team folder 2. create batsman file  
	     createTeamFolder(teamName);
		 createBatsmanFile(teamName,batsmanName, runs , balls , fours , sixes , strikeRate);
	  }
  }
  // EXPORT getMatch() TO GET LINK OF EVERY MATCH FROM allMatches.js 
  module.exports = getMatch; 







  
