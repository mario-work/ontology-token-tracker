const hamburger_icon = document.getElementById("menu-hamburger");
const close_sidebar = document.getElementById("close_sidebar");
const sidebar = document.getElementById("sidebar");
const nav = document.getElementById("nav");
const content = document.getElementById("content");
const main_block = document.getElementsByClassName("main_block")[0];
const bottom_menu = document.getElementById("bottom_menu");
const overlay = document.getElementById("overlay");
const wallet_address = document.getElementsByClassName("wallet")[0];
var addNewWallet = document.getElementById("addNewWallet");

const bottom_menu_items = document.querySelectorAll(".item");
const listOfTokens = document.getElementById("listOfTokens");
const refreshAndSort = document.getElementById("refreshAndSort");
var refreshBtn = null;

var ong_balance = document.getElementById("ong_balance");
var showMoreBlock = document.getElementById("showMoreBlock");
var showMoreBtn = document.getElementById("showMoreBtn");


const networkIndicator = document.getElementById("networkIndicator");

const chains = [
	{"title":"Ontology Mainnet", "id" : 58, "rpc":`${CorsProxyServerAddress}/https://dappnode1.ont.io:10339`, "type":"mainnet"},
	{"title":"Ontology Testnet (Polaris)", "id" : 5851, "rpc":`${CorsProxyServerAddress}/https://polaris1.ont.io:10339`, "type":"testnet"}
]

if(!localStorage.getItem('chainType') || !localStorage.getItem('chainID') || !localStorage.getItem('rpc')){
	localStorage.setItem('chainID', 58);
	localStorage.setItem('rpc', `${CorsProxyServerAddress}/https://dappnode1.ont.io:10339`);
	localStorage.setItem('chainType', "mainnet");
}

if(!localStorage.getItem("walletsStorage") || JSON.parse(localStorage.getItem("walletsStorage")).length == 0){
	localStorage.setItem("walletsStorage", JSON.stringify([]));
	localStorage.setItem("currentWallet", null);
} 
else {
	if(!localStorage.getItem("currentWallet")){
		localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);

		var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
		var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
		var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
		wallet_address.classList.add("exist");
		wallet_address.innerHTML = `<span>${nameWal}</span> ${addWal.substring(0, 4)}...${addWal.substring(38)}`;

		if(wallet_address.classList.contains("exist")){
			wallet_address.addEventListener("click", ()=>{
				navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
			})
		}

	} else{
		var checkThisAddress = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
		if(checkThisAddress < 0){
			localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);
		}

		var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
		var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
		var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
		wallet_address.classList.add("exist");
		wallet_address.innerHTML = `<span>${nameWal}</span> ${addWal.substring(0, 4)}...${addWal.substring(38)}`;
		
		if(wallet_address.classList.contains("exist")){
			wallet_address.addEventListener("click", ()=>{
				navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
			})
		}

	}
}




addNewWallet.addEventListener("click", ()=>{
	render("addressBook", main_block, null);
	bottom_menu_items.forEach((item) => {
		item.classList.remove("active");
	})
	bottom_menu_items[3].classList.add("active");
})


bottom_menu_items.forEach((item) => {
	item.addEventListener("click", ()=>{
		if(!item.classList.contains("active")){
			render(item.getAttribute("data-id"), main_block, null);
		}

		bottom_menu_items.forEach((item) => {
			item.classList.remove("active");
		})
		item.classList.add("active");
	})
})

wallet_address.addEventListener("click", ()=>{
	wallet_address.classList.add("copied");
})

wallet_address.addEventListener("mouseover", ()=>{
	wallet_address.classList.remove("copied");
})


hamburger_icon.addEventListener("click", ()=>{
	sidebar.classList.toggle("show_sidebar");
	nav.classList.toggle("blur");
	content.classList.toggle("blur");
	bottom_menu.classList.toggle("blur");
	overlay.classList.toggle("show");

	const walletsList = document.getElementById("walletsList");
	var arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));

	walletsList.innerHTML = "";

	if(arrayOfWallets.length == 0){
		walletsList.innerHTML = `<span class="title">Your address book is empty</span>`;
	} else{
		var str = "";
		for(const wallet of arrayOfWallets){
			var checked = "";
			if(localStorage.getItem("currentWallet") == wallet.address){
				checked = `checked`;
			}
			str += `
				<li class="walletItem ${checked}" data-wallet="${wallet.address}" data-name="${wallet.name}">
					<div class="wallet">
						<span>${wallet.name}</span> (${wallet.address.substring(0, 4)}...${wallet.address.substring(38)})
					</div>
					<span class="checked"><i class="fa fa-check" aria-hidden="true"></i></span>
				</li>`;
		}
		walletsList.innerHTML += `<ul>${str}</ul>`;

		const walletItems = document.querySelectorAll(".walletItem");
		walletItems.forEach((item) => {
				item.addEventListener("click", ()=>{ 
					localStorage.setItem("currentWallet", item.getAttribute("data-wallet"));
					walletItems.forEach((item) => {
						item.classList.remove("checked");
					})
					item.classList.add("checked");

					sidebar.classList.toggle("show_sidebar");
					nav.classList.toggle("blur");
					content.classList.toggle("blur");
					bottom_menu.classList.toggle("blur");
					overlay.classList.toggle("show");

					wallet_address.innerHTML = `<span>${item.getAttribute("data-name")}</span> ${item.getAttribute("data-wallet").substring(0, 4)}...${item.getAttribute("data-wallet").substring(38)}`;

					tokenList = "";
					address = item.getAttribute("data-wallet");
					render("balance", main_block, null);

				}) 
		})

	}

})

overlay.addEventListener("click", ()=>{
	sidebar.classList.toggle("show_sidebar");
	nav.classList.toggle("blur");
	content.classList.toggle("blur");
	bottom_menu.classList.toggle("blur");
	overlay.classList.toggle("show");
})

close_sidebar.addEventListener("click", ()=>{
	sidebar.classList.toggle("show_sidebar");
	nav.classList.toggle("blur");
	content.classList.toggle("blur");
	bottom_menu.classList.toggle("blur");
	overlay.classList.toggle("show");
})




networkIndicator.className = "";
networkIndicator.classList.add(`chain_${localStorage.getItem('chainID')}`);
networkIndicator.classList.add(localStorage.getItem('chainType'));


const templates = {};

var tokenList = "";
var chainId = localStorage.getItem('chainID');
var rpc = localStorage.getItem('rpc');
var address = localStorage.getItem("currentWallet");




var nfts = {};
nfts.exist = false;
nfts.items = [];

if(!localStorage.getItem("currentWallet") || (localStorage.getItem("currentWallet") == "null") ){
	render("noWallet", main_block, "Balance");
}
else{
	render("balance", main_block, null);
}



function loadMore(targetElement, sendedData){
	const listOfTokens = document.getElementById("listOfTokens");
	targetElement.classList.add("hidden");
	var tokensInList = document.getElementsByClassName("token").length;

	if(sendedData.data.items.length > tokensInList+5){
		var maxToShow = tokensInList + 5;
		var showBtnMore = true;
	} else{
		var maxToShow = sendedData.data.items.length;
		var showBtnMore = false;
	}

	;(async () => {
		var balance = null;
		for(var i=tokensInList; i < maxToShow; i++){
			balance = (Math.round(sendedData.data.items[i].balance  * 1000000000000000) / 1000000000000000);
			realLogoUrl = checkImage(sendedData.data.items[i].contract_address, sendedData.data.items[i].contract_name)

			let contract_address = `${sendedData.data.items[i].contract_address.substring(0, 7)}...${sendedData.data.items[i].contract_address.substring(35)}`;
			contract_address = `<p class="subtitle">Contract: ${contract_address}</p>`

			listOfTokens.innerHTML += `<li class="token" data-tokenIMG="${realLogoUrl}"  data-tokenName="${sendedData.data.items[i].contract_name} [${sendedData.data.items[i].contract_ticker_symbol}]" data-tokenContract="${sendedData.data.items[i].contract_address}">
				<img src="${realLogoUrl}" >
				<div>
					<p class="title">${sendedData.data.items[i].contract_name}</p>
					${contract_address}
					<p class="subtitle">Balance: ${balance.toFixed(4).replace(/[.,]00$/, "")} ${sendedData.data.items[i].contract_ticker_symbol}</p>
					<div style="display:flex; flex-direction: row; justify-content: center;">
						<span class="miniBtn untrack-btn" data-tokenContract="${sendedData.data.items[i].contract_address}">Untrack</span>
					</div>
				</div>
				</li>`;
		}
		
		if(showBtnMore){
			targetElement.classList.remove("hidden");
		}

		
		tokenUntrackOnClick(address);

	})();
}



async function getOngTokenBalance(address){
	let web3 = new Web3(rpc);
	address = web3.utils.toChecksumAddress(address);
	let balance = await web3.eth.getBalance(address);
	return balance / 10 ** 18;
}

async function checkContractFn(contract){

	const wallets = JSON.parse(localStorage.getItem('walletsStorage'));
	let tokensContracts = [];

	for(var i = 0; i < wallets.length; i++){
		if(wallets[i].address.toLowerCase() == address.toLowerCase()){
			tokensContracts = wallets[i]["erc20-tokens"][chainId];
			break;
		}
	}

	if(tokensContracts.includes(contract.toLowerCase())){
		result.error = true;
		result.message = `Token already is tracked !`;
		return result;
	}
	else{
		let web3 = new Web3(rpc);
		const abi = [
			{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
			{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
			{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},
			{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}
		]
		let contractAdress = web3.utils.toChecksumAddress(contract);
		contract = new web3.eth.Contract(abi, contractAdress);

		let result = {};
		result.error = false;
		result.message = "None";

		try{
			let symbol = await contract.methods.symbol().call();
			let name = await contract.methods.name().call();

			let decimals;
			try{
				decimals = await contract.methods.decimals().call();
			} catch{
				decimals = 18;
			}
			let balance = await contract.methods.balanceOf(web3.utils.toChecksumAddress("0x0000000000000000000000000000000000000000")).call();

			if(symbol && name && (decimals >= 0) && (balance >= 0) ){
				let allWallets = JSON.parse(localStorage.getItem('walletsStorage'));
				let allTokensContracts = [];
				let idAdress;
				
				for(var i = 0; i < allWallets.length; i++){
					if(allWallets[i].address.toLowerCase() == address.toLowerCase()){
						idAdress = i;
						allTokensContracts = allWallets[i]["erc20-tokens"][chainId];
						break;
					}
				}

				allTokensContracts.push(contractAdress.toLowerCase());
				allWallets[idAdress]["erc20-tokens"][chainId] = allTokensContracts;
				localStorage.setItem('walletsStorage', JSON.stringify(allWallets))
				return result;
			}
		} catch{
			result.error = true;
			result.message = `Non-existent contract`;
			return result;
		}
	}
	
}

async function getTokenBalance(chainId, address, sort_by, asc_desc) {
	let web3 = new Web3(rpc);
	const wallets = JSON.parse(localStorage.getItem('walletsStorage'));
	let tokensContracts = [];
	let tokensInfo = [];

	for(var i = 0; i < wallets.length; i++){
		if(wallets[i].address.toLowerCase() == address.toLowerCase()){
			tokensContracts = wallets[i]["erc20-tokens"][chainId];
			break;
		}
	}

	const abi = [
		{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
		{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
		{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},
		{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}
	]

	for(var i = 0; i < tokensContracts.length; i++){
		let contractAdress = web3.utils.toChecksumAddress(tokensContracts[i]);
		let contract = new web3.eth.Contract(abi, contractAdress);

		let symbol = await contract.methods.symbol().call()
		if(symbol){
			let name = await contract.methods.name().call();
			let decimals;
			try{
				decimals = await contract.methods.decimals().call();
			} catch{
				decimals = 18;
			}
			let balance = await contract.methods.balanceOf(web3.utils.toChecksumAddress(address)).call();

			tokensInfo.push({
				"contract_address": contractAdress,
				"contract_name": name,
				"contract_ticker_symbol": symbol,
				"contract_decimals": decimals,
				"balance": balance / 10 ** decimals,
			})
		}
	}

	var newObject = {};
	newObject.data = {};
	newObject.error = false;

	if(tokensInfo.length > 1){
		if( sort_by == "balance"){
			newObject.data.items = Object.values(tokensInfo).sort(function(a, b) { 
				return (a["balance"] - b["balance"])*(asc_desc)
			});
		} 
		else if( sort_by == "contract_name"){
			if(asc_desc == 1){
				newObject.data.items = Object.values(tokensInfo).sort(function(a, b) { 
					return a["contract_name"].localeCompare(b["contract_name"]);
				});
			} else{
				newObject.data.items = Object.values(tokensInfo).sort(function(a, b) { 
					return b["contract_name"].localeCompare(a["contract_name"]);
				});
			}
		}
	}

	else{
		newObject.data.items = tokensInfo;
	}
	
	newObject.ongBalance = await getOngTokenBalance(address);
	returnedData = newObject;
	
  	return returnedData;
}

async function sortTokenBalance(result, sort_by, asc_desc){

	var newObject = {};
	newObject.data = {};
	newObject.ongBalance = result.ongBalance;
	newObject.error = false;

	if( sort_by == "balance"){
		newObject.data.items = Object.values(result.data.items).sort(function(a, b) { 
			return (a["balance"] - b["balance"])*(asc_desc)
		});
	} 
	else if( sort_by == "contract_name"){
		if(asc_desc == 1){
			newObject.data.items = Object.values(result.data.items).sort(function(a, b) { 
				if(a["contract_name"] && b["contract_name"] ){
					return a["contract_name"].trim().localeCompare(b["contract_name"].trim());
				}
			});
		} else{
			newObject.data.items = Object.values(result.data.items).sort(function(a, b) { 
				return b["contract_name"].trim().localeCompare(a["contract_name"].trim());
			});
		}
	}

	returnedData = newObject;
	return returnedData;
}





function render(template_name, node, dataSended) {
		var listOfTokens = null;
		var refreshAndSort = null;
		var sortOption = null;
		var ong_balance = null;
		var refreshBtn = null;

    if (!node) return;
    switch(template_name){
    	case "balance":

    		bottom_menu_items.forEach((item) => {
					item.classList.remove("active");
				})
				bottom_menu_items[0].classList.add("active");

    		if(!localStorage.getItem("currentWallet") || (localStorage.getItem("currentWallet") == "null") ){
    			render("noWallet", main_block, "Balance");
    			break;
    		}

    		node.innerHTML = `
    		<h1 class="title">Balance</h1>
    		<p id="balance_total"><span id="ong_balance">-</span> ONG</p>

    		<div id="refreshAndSort"></div>

    		<div id="listBlock"> 
	    		<ul id="listOfTokens">
		    		<div class="lds-dual-ring">
		    		<div>
	    		</ul> 
    		</div>
    		<div id="showMoreBlock"></div>`;
	    	listOfTokens = document.getElementById("listOfTokens");
	    	refreshAndSort = document.getElementById("refreshAndSort");

	    	var tokenListNew = "";
			ong_balance = document.getElementById("ong_balance");


    		;(async () => {
				result = await getTokenBalance(chainId, address, "balance",  -1);
				
				if (result.error) {
				    tokenList = `<li class="error"><p class="title">Error #${result.error_code}:</p><p class="subtitle">${result.error_message}</p></li>`;
				    listOfTokens.innerHTML = tokenList;
					ong_balance.innerHTML = `${result.ongBalance.toFixed(4).toLocaleString()}`;
				}
				else{
					tokenList = "";
					var balance = null;
					var realLogoUrl = null;

				  	if(result.data.items.length > 5){
						var maxToShow = 5;
						var showBtnMore = true;
					} else{
						var maxToShow = result.data.items.length;
						var showBtnMore = false;
					}

				  	for (var i = 0; i < maxToShow; i++){
						balance = (Math.round(result.data.items[i].balance * 1000000000000000) / 1000000000000000);
						realLogoUrl = checkImage(result.data.items[i].contract_address, result.data.items[i].contract_name)


						let contract_address = `${result.data.items[i].contract_address.substring(0, 9)}...${result.data.items[i].contract_address.substring(33)}`;
						contract_address = `<p class="subtitle">Contract: ${contract_address}</p>`;

						tokenListNew += `<li class="token" data-tokenIMG="${realLogoUrl}"  data-tokenName="${result.data.items[i].contract_name} [${result.data.items[i].contract_ticker_symbol}]" data-tokenContract="${result.data.items[i].contract_address}">
							<img src="${realLogoUrl}" >
							<div>
								<p class="title">${result.data.items[i].contract_name}</p>
								${contract_address}
								<p class="subtitle">Balance: ${balance.toFixed(4).replace(/[.,]00$/, "")} ${result.data.items[i].contract_ticker_symbol}</p>
								<div style="display:flex; flex-direction: row; justify-content: center;">
									<span class="miniBtn untrack-btn" data-tokenContract="${result.data.items[i].contract_address}">Untrack</span>
								</div>
							</div>
							</li>`;
					}

					refreshAndSort.innerHTML = ` 
					<div id="refresh">
			            <span class="material-icons" style=" font-size: 22px; "> refresh </span> &nbsp;Refresh
			          </div>
			          <div id="sort_block">
			            <div id="sort">Sort by:</div>
			            <div id="sortby">
			              <ul>
			                <li class="sortOption" id="contract_name__1">Token name [a-z]</li>
			                <li class="sortOption" id="contract_name__-1">Token name [z-a]</li>
			                <li class="sortOption" id="balance__1">Token balance [asc]</li>
			                <li class="sortOption" id="balance__-1">Token balance [des]</li>
			              </ul>
			            </div>
			          </div>`;

					refreshBtn = document.getElementById("refresh");
					refreshBtn.addEventListener("click", ()=>{
						render("refresh", main_block, null);
					});

					refreshAndSort = document.getElementById("refreshAndSort");
			    	refreshAndSort.classList.remove("hidden");
			    	sortOption = document.querySelectorAll(".sortOption");
				
					sortOption.forEach((item) => {
						item.addEventListener("click", ()=>{
							;(async () => {
								var sortBy = (item.id).split("__")[0];
								var sortAscDesc = parseInt((item.id).split("__")[1]);

								var sortedArray = await sortTokenBalance(result, sortBy, sortAscDesc);

								render("sortBalance", main_block, sortedArray);
							})()
							refreshAndSort.classList.add("hidden");
						})
					})

					if(result.data.items.length > 0){
						listOfTokens.innerHTML = `<div class="orc20tokens">Tracked ORC-20 tokens:</div><span id="trackNewToken">Track new token</span>
						<div id="trackNewTokenForm" class="hidden" >
		    				<input id="contractAddress" type="text" placeholder="Contract address">
		    				<p id="trackError" style="margin-bottom: 5px;"></p>
		    				<div class="btns"  style="flex-direction: row;">
			    				<button id="cancelTrack">Cancel</button>
			    				<button id="checkContract">Check & Track</button>
		    				</div>
		    			</div><br><br>${tokenListNew}`;
				    } else {
						listOfTokens.innerHTML = `<div class="orc20tokens">No tracked ORC-20 tokens</div><span id="trackNewToken">Track new token</span>
						<div id="trackNewTokenForm" class="hidden" >
		    				<input id="contractAddress" type="text" placeholder="Contract address" >
		    				<p id="trackError" style="margin-bottom: 5px;"></p>
		    				<div class="btns"  style="flex-direction: row;">
			    				<button id="cancelTrack">Cancel</button>
			    				<button id="checkContract">Check & Track</button>
		    				</div>
		    			</div><br><br>`;
				    }


				    var trackNewToken = document.getElementById("trackNewToken");
					var trackNewTokenForm = document.getElementById("trackNewTokenForm");
					var cancelTrack = document.getElementById("cancelTrack");
				    var checkContract = document.getElementById("checkContract");


					var contractAddress = document.getElementById("contractAddress");
					var trackError = document.getElementById("trackError");


					trackNewToken.addEventListener("click", ()=>{
						trackNewTokenForm.classList.toggle("hidden");
						contractAddress.value = "";
						trackError.innerHTML = "";
						contractAddress.classList.remove("error");
					})

					cancelTrack.addEventListener("click", ()=>{
						trackNewTokenForm.classList.toggle("hidden");
						contractAddress.value = "";
						trackError.innerHTML = "";
						contractAddress.classList.remove("error");
					})


					checkContract.addEventListener("click", ()=>{
						contractAddress = document.getElementById("contractAddress");

						var validRegEx = /^0x([A-Fa-f0-9]{40})$/;

						if(!contractAddress.value || !(validRegEx.test(contractAddress.value)) ){
							contractAddress.classList.remove("error");
							trackError.innerHTML = "Incorrect format of address";
							contractAddress.focus();
							contractAddress.classList.add("error");
						} else{
							contractAddress.classList.remove("error");
							trackError.innerHTML = `<span style="color:white">Checking contract...</span>`;

							;(async ()=>{
								let result = await checkContractFn(contractAddress.value.trim());

								if(result.error == false){
									render("balance", main_block, null);
									trackError.innerHTML = `<span style="color:green">Contact has been successfully added !</span>`;
								} else {
									trackError.innerHTML = result.message;
								}

							})()
						}
					})






					ong_balance.innerHTML = `${result.ongBalance.toFixed(4).toLocaleString()}`;

					if(showBtnMore){
	    				showMoreBlock = document.getElementById("showMoreBlock");
						showMoreBlock.innerHTML = `<button class="btn1" id="showMoreBtn">Show more</button>`;
						showMoreBtn = document.getElementById("showMoreBtn");

						showMoreBtn.addEventListener("click", function(event){
				        	var targetElement = event.target || event.srcElement;
				        	loadMore(targetElement, result);
				      	});
					}
				}
				
				tokenUntrackOnClick(address);

			})()


	    	refreshAndSort = document.getElementById("refreshAndSort");
	    	refreshAndSort.classList.remove("hidden");
	    	sortOption = document.querySelectorAll(".sortOption");
		
			sortOption.forEach((item) => {
				item.addEventListener("click", ()=>{
					;(async () => {
						var sortBy = (item.id).split("__")[0];
						var sortAscDesc = parseInt((item.id).split("__")[1]);
						var sortedArray = await sortTokenBalance(result, sortBy, sortAscDesc);
						render("sortBalance", main_block, sortedArray);
					})()
					refreshAndSort.classList.add("hidden");
				})
			})

    		break;

    	case "refresh":
    		render("balance", main_block, null);
    		break;

    	case "sortBalance":

    		if(!localStorage.getItem("currentWallet") || (localStorage.getItem("currentWallet") == "null") ){
    			render("noWallet", main_block, "Balance");
    			break;
    		}

    		node.innerHTML = `
    		<h1 class="title">Balance</h1>
    		<p id="balance_total"><span id="ong_balance">-</span> ONG</p>

    		<div id="refreshAndSort"></div>

    		<div id="listBlock"> 
	    		<ul id="listOfTokens">
		    		<div class="lds-dual-ring">
		    		<div>
	    		</ul> 
    		</div>
    		<div id="showMoreBlock"></div>`;
	    	listOfTokens = document.getElementById("listOfTokens");
	    	refreshAndSort = document.getElementById("refreshAndSort");
				ong_balance = document.getElementById("ong_balance");

				;(async () => {
					refreshAndSort.classList.add("hidden");
	    		refreshAndSort.innerHTML = ` 
						<div id="refresh">
	            <span class="material-icons" style=" font-size: 22px; "> refresh </span> &nbsp;Refresh
	          </div>
	          <div id="sort_block">
	            <div id="sort">Sort by:</div>
	            <div id="sortby">
	              <ul>
	                <li class="sortOption" id="contract_name__1">Token name [a-z]</li>
	                <li class="sortOption" id="contract_name__-1">Token name [z-a]</li>
	                <li class="sortOption" id="balance__1">Token balance [asc]</li>
	                <li class="sortOption" id="balance__-1">Token balance [des]</li>
	              </ul>
	            </div>
	          </div>`;

					refreshBtn = document.getElementById("refresh");
					refreshBtn.addEventListener("click", ()=>{
						render("refresh", main_block, null);
					});

	    		if(dataSended.data.items.length > 5){
						var maxToShow = 5;
						var showBtnMore = true;
					} else{
						var maxToShow = dataSended.data.items.length;
						var showBtnMore = false;
					}

					tokenListNew = "";

					for (var i = 0; i < maxToShow; i++){
						balance = (Math.round(dataSended.data.items[i].balance  * 1000000000000000) / 1000000000000000);
						realLogoUrl = checkImage(dataSended.data.items[i].contract_address, dataSended.data.items[i].contract_name)

						let contract_address = `${dataSended.data.items[i].contract_address.substring(0, 9)}...${dataSended.data.items[i].contract_address.substring(33)}`;
						contract_address = `<p class="subtitle">Contract: ${contract_address}</p>`;

						tokenListNew += `<li class="token" data-tokenIMG="${realLogoUrl}"  data-tokenName="${dataSended.data.items[i].contract_name} [${dataSended.data.items[i].contract_ticker_symbol}]" data-tokenContract="${dataSended.data.items[i].contract_address}">
							<img src="${realLogoUrl}" >
							<div>
								<p class="title">${dataSended.data.items[i].contract_name}</p>
								${contract_address}
								<p class="subtitle">Balance: ${balance.toFixed(4).replace(/[.,]00$/, "")} ${dataSended.data.items[i].contract_ticker_symbol}</p>
								<div style="display:flex; flex-direction: row; justify-content: center;">
									<span class="miniBtn untrack-btn" data-tokenContract="${dataSended.data.items[i].contract_address}">Untrack</span>
								</div>
							</div>
							</li>`;
					}

					

					if(result.data.items.length > 0){
						listOfTokens.innerHTML = `<div class="orc20tokens">Tracked ORC-20 tokens:</div><span id="trackNewToken">Track new token</span>
						<div id="trackNewTokenForm" class="hidden" >
		    				<input id="contractAddress" type="text" placeholder="Contract address">
		    				<p id="trackError" style="margin-bottom: 5px;"></p>
		    				<div class="btns"  style="flex-direction: row;">
			    				<button id="cancelTrack">Cancel</button>
			    				<button id="checkContract">Check & Track</button>
		    				</div>
		    			</div><br><br>${tokenListNew}`;
				    } else {
						listOfTokens.innerHTML = `<div class="orc20tokens">No tracked ORC-20 tokens</div><span id="trackNewToken">Track new token</span>
						<div id="trackNewTokenForm" class="hidden" >
		    				<input id="contractAddress" type="text" placeholder="Contract address" >
		    				<p id="trackError" style="margin-bottom: 5px;"></p>
		    				<div class="btns"  style="flex-direction: row;">
			    				<button id="cancelTrack">Cancel</button>
			    				<button id="checkContract">Check & Track</button>
		    				</div>
		    			</div><br><br>`;
				    }


				    var trackNewToken = document.getElementById("trackNewToken");
					var trackNewTokenForm = document.getElementById("trackNewTokenForm");
					var cancelTrack = document.getElementById("cancelTrack");
				    var checkContract = document.getElementById("checkContract");


					var contractAddress = document.getElementById("contractAddress");
					var trackError = document.getElementById("trackError");


					trackNewToken.addEventListener("click", ()=>{
						trackNewTokenForm.classList.toggle("hidden");
						contractAddress.value = "";
						trackError.innerHTML = "";
						contractAddress.classList.remove("error");
					})

					cancelTrack.addEventListener("click", ()=>{
						trackNewTokenForm.classList.toggle("hidden");
						contractAddress.value = "";
						trackError.innerHTML = "";
						contractAddress.classList.remove("error");
					})


					checkContract.addEventListener("click", ()=>{
						contractAddress = document.getElementById("contractAddress");

						var validRegEx = /^0x([A-Fa-f0-9]{40})$/;

						if(!contractAddress.value || !(validRegEx.test(contractAddress.value)) ){
							contractAddress.classList.remove("error");
							trackError.innerHTML = "Incorrect format of address";
							contractAddress.focus();
							contractAddress.classList.add("error");
						} else{
							contractAddress.classList.remove("error");
							trackError.innerHTML = `<span style="color:white">Checking contract...</span>`;

							;(async ()=>{
								let result = await checkContractFn(contractAddress.value.trim());

								if(result.error == false){
									render("balance", main_block, null);
									trackError.innerHTML = `<span style="color:green">Contact has been successfully added !</span>`;
								} else {
									trackError.innerHTML = result.message;
								}

							})()
						}
					})

					ong_balance.innerHTML = `${parseFloat(dataSended.ongBalance).toFixed(4).toLocaleString()}`;

					if(showBtnMore){
		    		showMoreBlock = document.getElementById("showMoreBlock");
		    		showMoreBlock.innerHTML = `<button class="btn1" id="showMoreBtn">Show more</button>`;
						showMoreBtn = document.getElementById("showMoreBtn");

						showMoreBtn.addEventListener("click", function(event){
			        var targetElement = event.target || event.srcElement;
			        loadMore(targetElement, dataSended);
			      });
					}

					refreshAndSort.classList.remove("hidden");
					sortOption = document.querySelectorAll(".sortOption");
			
					sortOption.forEach((item) => {
						item.addEventListener("click", ()=>{
							;(async () => {
								var sortBy = (item.id).split("__")[0];
								var sortAscDesc = parseInt((item.id).split("__")[1]);
								var sortedArray = await sortTokenBalance(result, sortBy, sortAscDesc);
								render("sortBalance", main_block, sortedArray);
							})()
							refreshAndSort.classList.add("hidden");
						})
					})

					
					tokenUntrackOnClick(address);

				})();

    		break;

    	case "nfts":

    		if(!localStorage.getItem("currentWallet") || (localStorage.getItem("currentWallet") == "null") ){
    			render("noWallet", main_block, "NFTs");
    			break;
    		}

    		node.innerHTML = `
    		<h1 class="title">NFTs</h1>
    		<div id="listBlock" style="margin-top:0px"> 
    			<div class="lds-dual-ring"></div> 
    		</div>
    		<div id="blockForNFT"></div>
    		 `;

    		const blockForNFT = document.getElementById("blockForNFT");
	    	const listBlock = document.getElementById("listBlock");

    		listBlock.innerHTML = `
    			<ul>
			    	<li class="error" >
			    		<p class="title" style=" font-weight: 400; text-align: center">This feature is under development</p>
			    	</li>
		    	</ul> 
    		`;

    		break;

    	case "settings":
    		node.innerHTML = `
    			<h1 class="title">Settings</h1> 
    			<ul class="settings_options">
    				<li class="settingOption" data-id="addressBook"> <p class="title">Saved addresses</p> <p class="subtitle">View, edit or remove added addresses</p> </li> 
    				<li class="settingOption" data-id="network"> <p class="title">Change network</p> <p class="subtitle">Change your network settings</p> </li> 
    			</ul>
    			`;

    			const seetingOptions = document.querySelectorAll(".settingOption");

    			seetingOptions.forEach((item) => {
						item.addEventListener("click", ()=>{
							render(item.getAttribute("data-id"), main_block, null);
						})
					})

	    	break;

	    case "addressBook":
    		node.innerHTML = `
    		 	<div class="undo"><span class="material-icons"> arrow_back </span></div>
    			<h1 class="title">Saved addresses</h1>
    			<span id="addWalletBtn">Add new address</span>
    			<div id="addWalletForm" class="hidden">
    				<input id="walletName" type="text" maxlength="15" placeholder="Name"><br>
    				<input id="walletAddress" type="text" placeholder="Address"><br>
    				<p id="addError"></p>
    				<div class="btns">
	    				<button id="cancelAdd">Cancel</button>
	    				<button id="confirmAdd">Add</button>
    				</div>
    			</div>
    			<ul id="divAddressBook"></ul>
    		`;

    		var back = document.getElementsByClassName("undo")[0];
    		back.addEventListener("click", ()=>{
					render("settings", main_block, null);
				})

				var arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));
				var divAddressBook = document.getElementById("divAddressBook");

				divAddressBook.innerHTML = "";

				for(const wallet of arrayOfWallets){
					divAddressBook.innerHTML += ` 
	    		<li class="settingOption" data-id="${wallet.address}"> 
	    			<div class="row">
	    				<div class="left">
	    					<input type="text" class="input_title" value="${wallet.name}" maxlength="15" readonly data-id="${wallet.address}"> 
	    				</div>
	    				<div class="right">
		    				<span class="save hidden" data-id="${wallet.address}"><i class="fa fa-check" aria-hidden="true" ></i></span>
		    				<span class="edit" data-id="${wallet.address}"><i class="fa fa-pencil" aria-hidden="true"></i></span>
		    				<span class="delete" data-id="${wallet.address}"><i class="fa fa-trash" aria-hidden="true"></i></span>
		    			</div>
	    			</div>
	    			<p class="subtitle">${wallet.address}</p> 
	    		</li>
	    		`;
				}

				var addWalletBtn = document.getElementById("addWalletBtn");
				var addWalletForm = document.getElementById("addWalletForm");
				var cancelAdd = document.getElementById("cancelAdd");
				var confirmAdd = document.getElementById("confirmAdd");


				var walletName = document.getElementById("walletName");
				var walletAddress = document.getElementById("walletAddress");
				var addError = document.getElementById("addError");


				addWalletBtn.addEventListener("click", ()=>{
					addWalletForm.classList.toggle("hidden");
					walletName.value = "";
					walletAddress.value = "";
					addError.innerHTML = "";
					walletName.classList.remove("error");
					walletAddress.classList.remove("error");
				})

				cancelAdd.addEventListener("click", ()=>{
					addWalletForm.classList.toggle("hidden");
					walletName.value = "";
					walletAddress.value = "";
					addError.innerHTML = "";
					walletName.classList.remove("error");
					walletAddress.classList.remove("error");

					deleteBtns = document.querySelectorAll(".delete");
					editBtns = document.querySelectorAll(".edit"); 
	    			saveBtns = document.querySelectorAll(".save"); 

	    			editBtns.forEach((item) => {
						item.addEventListener("click", ()=>{
							document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
							document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].readOnly = false;
							document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].classList.add("active");

							item.classList.add("hidden");
						})
					})

					saveBtns.forEach((item) => {
						item.addEventListener("click", ()=>{
							var walletInp = document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0];
							if(walletInp.value){
								document.querySelectorAll(`span.edit[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
								walletInp.setAttribute("value", walletInp.value);
								walletInp.readOnly = true;
								walletInp.classList.remove("active");

								var objIndex = arrayOfWallets.findIndex((obj => obj.address == item.getAttribute("data-id")));
								arrayOfWallets[objIndex].name = walletInp.value;
								localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

								item.classList.add("hidden");

								var currentW = localStorage.getItem("currentWallet");
								if(item.getAttribute("data-id") == currentW){
									wallet_address.innerHTML = `<span>${walletInp.value}</span> ${item.getAttribute("data-id").substring(0, 4)}...${item.getAttribute("data-id").substring(38)}`;
								}

							} else{
								walletInp.focus();
							}
						})
					})

					deleteBtns.forEach((item) => {
						item.addEventListener("click", ()=>{
							document.querySelectorAll(`li.settingOption[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); item.classList.add("hidden"); });
							document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });
							document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });							

							arrayOfWallets = arrayOfWallets.filter(e => e.address !== item.getAttribute("data-id"));
							localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));
							
							var currentW = localStorage.getItem("currentWallet");
							if( (item.getAttribute("data-id") == currentW) && arrayOfWallets.length){
								localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);

								var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
								var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
								var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
								wallet_address.classList.add("exist");
								wallet_address.innerHTML = `<span>${nameWal}</span> ${addWal.substring(0, 3)}...${addWal.substring(38)}`;
							
								if(wallet_address.classList.contains("exist")){
									wallet_address.addEventListener("click", ()=>{
										navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
									})
								}

							}

							if(!arrayOfWallets.length){
								localStorage.setItem("currentWallet", null);

								wallet_address.classList.remove("exist");
								wallet_address.innerHTML = `<a id="addNewWallet">No wallet, click to add</a>`;

								addNewWallet = document.getElementById("addNewWallet");
								addNewWallet.addEventListener("click", ()=>{
									render("addressBook", main_block, null);
									bottom_menu_items.forEach((item) => {
										item.classList.remove("active");
									})
									bottom_menu_items[3].classList.add("active");
								})
							}

							tokenList = "";
							address = localStorage.getItem('currentWallet');

							arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));
							deleteBtns = document.querySelectorAll(".delete"); 
						})

					})
				})


				confirmAdd.addEventListener("click", ()=>{

					walletName = document.getElementById("walletName");
					walletAddress = document.getElementById("walletAddress");

					var validRegEx = /^0x([A-Fa-f0-9]{40})$/;
					var checkExist = arrayOfWallets.findIndex((obj => obj.address == walletAddress.value));

					if(!walletName.value.trim()){
						walletName.focus();
						addError.innerHTML = "Write a name of address";
						walletName.classList.add("error");
					} else if(!walletAddress.value.trim() || !(validRegEx.test(walletAddress.value.trim())) ){
						walletName.classList.remove("error");
						addError.innerHTML = "Put an correct wallet address";
						walletAddress.focus();
						walletAddress.classList.add("error");
					} else if(checkExist >= 0){
						addError.innerHTML = "Wallet already exist in list !";
						walletAddress.focus();
						walletAddress.classList.add("error");
					} else{
						walletName.classList.remove("error");
						walletAddress.classList.remove("error");
						addError.innerHTML = "";

						arrayOfWallets.push({"name": walletName.value, "address":walletAddress.value.trim(), "erc20-tokens" : {"58":[], "5851":[]} });
						localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

						if(arrayOfWallets.length == 1){
							localStorage.setItem("currentWallet", arrayOfWallets[0].address);

							var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
							var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
							var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
							wallet_address.classList.add("exist");
							wallet_address.innerHTML = `<span>${nameWal}</span> ${addWal.substring(0, 3)}...${addWal.substring(38)}`;
							
							if(wallet_address.classList.contains("exist")){
								wallet_address.addEventListener("click", ()=>{
									navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
								})
							}
						}

						divAddressBook.innerHTML += ` 
		    		<li class="settingOption" data-id="${walletAddress.value}"> 
		    			<div class="row">
		    				<div class="left">
		    					<input type="text" class="input_title" value="${walletName.value}" onfocus="this.value = this.value;" readonly data-id="${walletAddress.value}"> 
		    				</div>
		    				<div class="right">
			    				<span class="save hidden" data-id="${walletAddress.value}"><i class="fa fa-check" aria-hidden="true" ></i></span>
			    				<span class="edit" data-id="${walletAddress.value}"><i class="fa fa-pencil" aria-hidden="true"></i></span>
			    				<span class="delete" data-id="${walletAddress.value}"><i class="fa fa-trash" aria-hidden="true"></i></span>
			    			</div>
		    			</div>
		    			<p class="subtitle">${walletAddress.value}</p> 
		    		</li>
		    		`;

						addWalletForm.classList.toggle("hidden");

						deleteBtns = document.querySelectorAll(".delete"); 
						editBtns = document.querySelectorAll(".edit"); 
		    		saveBtns = document.querySelectorAll(".save"); 

		    		editBtns.forEach((item) => {
							item.addEventListener("click", ()=>{
								document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
								document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].readOnly = false;
								document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].classList.add("active");

								item.classList.add("hidden");
							})
						})

						saveBtns.forEach((item) => {
							item.addEventListener("click", ()=>{
								var walletInp = document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0];
								if(walletInp.value){
									document.querySelectorAll(`span.edit[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
									walletInp.setAttribute("value", walletInp.value);
									walletInp.readOnly = true;
									walletInp.classList.remove("active");

									var objIndex = arrayOfWallets.findIndex((obj => obj.address == item.getAttribute("data-id")));
									arrayOfWallets[objIndex].name = walletInp.value;
									localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

									item.classList.add("hidden");

									var currentW = localStorage.getItem("currentWallet");
									if(item.getAttribute("data-id") == currentW){
										wallet_address.innerHTML = `<span>${walletInp.value}</span> ${item.getAttribute("data-id").substring(0, 4)}...${item.getAttribute("data-id").substring(38)}`;
									}

								} else{
									walletInp.focus();
								}
							})
						})

						deleteBtns.forEach((item) => {
							item.addEventListener("click", ()=>{
								document.querySelectorAll(`li.settingOption[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); item.classList.add("hidden"); });
								document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });
								document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });

								arrayOfWallets = arrayOfWallets.filter(e => e.address !== item.getAttribute("data-id"));
								localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));
								
								var currentW = localStorage.getItem("currentWallet");
								if( (item.getAttribute("data-id") == currentW) && arrayOfWallets.length){
									localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);

									var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
									var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
									var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
									wallet_address.classList.add("exist");
									wallet_address.innerHTML = `<span>${nameWal}</span> ${addWal.substring(0, 3)}...${addWal.substring(38)}`;
								
									if(wallet_address.classList.contains("exist")){
										wallet_address.addEventListener("click", ()=>{
											navigator.clipboard.writeText(localStorage.getItem("currentWallet"));
										})
									}

								}

								if(!arrayOfWallets.length){
									localStorage.setItem("currentWallet", null);

									wallet_address.classList.remove("exist");
									wallet_address.innerHTML = `<a id="addNewWallet">No wallet, click to add</a>`;

									addNewWallet = document.getElementById("addNewWallet");
									addNewWallet.addEventListener("click", ()=>{
										render("addressBook", main_block, null);
										bottom_menu_items.forEach((item) => {
											item.classList.remove("active");
										})
										bottom_menu_items[3].classList.add("active");
									})
								}

								tokenList = "";
								address = localStorage.getItem('currentWallet');

								arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));
								deleteBtns = document.querySelectorAll(".delete"); 
							})

						})

					tokenList = "";
					address = localStorage.getItem('currentWallet');


					}
				})

				
    		

    		var walletsNames = document.querySelectorAll(".input_title");

    		var editBtns = document.querySelectorAll(".edit");
    		var deleteBtns = document.querySelectorAll(".delete");
    		var saveBtns = document.querySelectorAll(".save");

    		editBtns.forEach((item) => {
					item.addEventListener("click", ()=>{
						document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
						document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].readOnly = false;
						document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0].classList.add("active");

						item.classList.add("hidden");
					})
				})

				saveBtns.forEach((item) => {
					item.addEventListener("click", ()=>{
						var walletInp = document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`)[0];
						if(walletInp.value){
							document.querySelectorAll(`span.edit[data-id='${item.getAttribute("data-id")}']`)[0].classList.remove("hidden");
							walletInp.setAttribute("value", walletInp.value);
							walletInp.readOnly = true;
							walletInp.classList.remove("active");

							var objIndex = arrayOfWallets.findIndex((obj => obj.address == item.getAttribute("data-id")));
							arrayOfWallets[objIndex].name = walletInp.value;
							localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

							item.classList.add("hidden");

							var currentW = localStorage.getItem("currentWallet");
							if(item.getAttribute("data-id") == currentW){
								wallet_address.innerHTML = `<span>${walletInp.value}</span> ${item.getAttribute("data-id").substring(0, 4)}...${item.getAttribute("data-id").substring(38)}`;
							}

						} else{
							walletInp.focus();
						}
					})
				})

				deleteBtns.forEach((item) => {
					item.addEventListener("click", ()=>{
						document.querySelectorAll(`li.settingOption[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); item.classList.add("hidden"); });
						document.querySelectorAll(`span.save[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });
						document.querySelectorAll(`input[data-id='${item.getAttribute("data-id")}']`).forEach((item) => { item.setAttribute("data-id", null); });

						arrayOfWallets = arrayOfWallets.filter(e => e.address !== item.getAttribute("data-id"));
						localStorage.setItem("walletsStorage", JSON.stringify(arrayOfWallets));

						var currentW = localStorage.getItem("currentWallet");
						if( (item.getAttribute("data-id") == currentW) && arrayOfWallets.length){
							localStorage.setItem("currentWallet", JSON.parse(localStorage.getItem("walletsStorage"))[0].address);
							
							var indexOfWallet = JSON.parse(localStorage.getItem("walletsStorage")).findIndex((obj => obj.address == localStorage.getItem("currentWallet")));
							var nameWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].name;
							var addWal = JSON.parse(localStorage.getItem("walletsStorage"))[indexOfWallet].address;
							wallet_address.classList.add("exist");
							wallet_address.innerHTML = `<span>${nameWal}</span> ${addWal.substring(0, 3)}...${addWal.substring(38)}`;
								
						}

						if(!arrayOfWallets.length){
							localStorage.setItem("currentWallet", null);

							wallet_address.classList.remove("exist");
							wallet_address.innerHTML = `<a id="addNewWallet">No wallet, click to add</a>`;

							addNewWallet = document.getElementById("addNewWallet");
							addNewWallet.addEventListener("click", ()=>{
								render("addressBook", main_block, null);
								bottom_menu_items.forEach((item) => {
									item.classList.remove("active");
								})
								bottom_menu_items[3].classList.add("active");
							})
						}

						tokenList = "";
						address = localStorage.getItem('currentWallet');

						arrayOfWallets = JSON.parse(localStorage.getItem("walletsStorage"));
						deleteBtns = document.querySelectorAll(".delete"); 

					})
				})


	    	break;

    	case "network":
    		node.innerHTML = `
    		 	<div class="undo"><span class="material-icons"> arrow_back </span></div>
    			<h1 class="title">Change network</h1>
    			<ul id="networks"></ul>
    			`;
    		var back = document.getElementsByClassName("undo")[0];
    		back.addEventListener("click", ()=>{
					render("settings", main_block, null);
				})

    		var divNetworks = document.getElementById("networks");
    		divNetworks.innerHTML = "";

    		for(const chain of chains){
    			var active = "";
    			if(chain.id == localStorage.getItem('chainID')){
    				active = "active";
    			}
    			divNetworks.innerHTML += ` 
	    			<li class="network ${active}" data-rpc="${chain.rpc}" data-id="${chain.id}" data-type="${chain.type}">${chain.title}</li>
	    		`;
    		}
    		

    		var allNetworks = document.querySelectorAll(".network");
    		allNetworks.forEach((item) => {
					item.addEventListener("click", ()=>{

						localStorage.setItem('chainID', item.getAttribute("data-id"));
						localStorage.setItem('chainType', item.getAttribute("data-type"));
						localStorage.setItem('rpc', item.getAttribute("data-rpc"));

						networkIndicator.className = "";
						networkIndicator.classList.add(`chain_${item.getAttribute("data-id")}`);
						networkIndicator.classList.add(item.getAttribute("data-type"));

					
						allNetworks.forEach((item) => {
							item.classList.remove("active");
						})
						item.classList.add("active");

						tokenList = "";
						chainId = localStorage.getItem('chainID');
						rpc = localStorage.getItem('rpc');

					})
				})



	    	break;

    	case "noWallet":
    		node.innerHTML = `
    			<h1 class="title">${dataSended}</h1>
    			<div class="noWallet">
    				Your address book is empty.<br>
    				<a id="linkAddWallet">Click here to add new wallet</a>
    				</div>
    			`;

    		document.getElementById("linkAddWallet").addEventListener("click", ()=>{
    			render("addressBook", main_block, null);
    			bottom_menu_items.forEach((item) => {
						item.classList.remove("active");
					})
					bottom_menu_items[3].classList.add("active");
    		});

	    	break;

    	default:
    		node.innerHTML = templates[template_name];
    }
};




function tokenUntrackOnClick(address){
	var untrackBtns = document.querySelectorAll(".untrack-btn");
	untrackBtns.forEach((item) => {
		item.addEventListener("click", ()=>{
			var tokenContract = item.getAttribute("data-tokenContract");
			let wallets = JSON.parse(localStorage.getItem('walletsStorage'));
			let idAdress;
			let tokensContracts = [];

			for(var i = 0; i < wallets.length; i++){
				if(wallets[i].address.toLowerCase() == address.toLowerCase()){
					idAdress = i;
					tokensContracts = wallets[i]["erc20-tokens"][chainId];
					break;
				}
			}

			let contractIndex = tokensContracts.findIndex((contract => contract.toLowerCase() == tokenContract.toLowerCase()))
			tokensContracts.splice(contractIndex, 1);
			wallets[idAdress]["erc20-tokens"][chainId] = tokensContracts;

			localStorage.setItem('walletsStorage', JSON.stringify(wallets))

			render("refresh", main_block, null);
		})
	})
}



function checkImage(tokenContractAddress, tokenContractName){
	const addedTokensLogo = [
		["0x6ea9f7b81bdeb047d63a023b1f28bea481a5785a", "png"],
		["0x219cc8e994ea6b35cdcffb5d44e229325d5ad02a", "png"],
		["0xd8bc24cfd45452ef2c8bc7618e32330b61f2691b", "png"],
		["0x72b0f5612802d473a13716db71a0348bcf631d98", "svg"],
		["0xae834526aa3b70de9b34f81c4bf51bc2c80a5473", "svg"],
		["0xd18f97592a1adf4fa18d041abb7bd89491d3a8be", "svg"],
		["0xfcad47c29551c7691398776c8fa73287c8fa8ec0", "svg"],
	]

	for(var i = 0; i < addedTokensLogo.length; i++){
		if(addedTokensLogo[i][0].toLowerCase() == tokenContractAddress.toLowerCase()){
			return `./resources/images/token_logo/${addedTokensLogo[i][0]}.${addedTokensLogo[i][1]}`
			break;
		}
	}
	
	return `https://eu.ui-avatars.com/api/?name=${tokenContractName}`
}