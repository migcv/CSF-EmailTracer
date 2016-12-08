// Array to store information of each field that matters
var deliveredTo = new Array(), from = new Array(), received = new Array(), x_received = new Array(), message_id = new Array(),
received_spf = new Array(), date = new Array(), subject = new Array(), cc = new Array(), to = new Array(), ip = new Array(), 
serverDates = new Array(), from1 = new Array(), by1 = new Array();
var data;
var receivedIPInfo;
var firstConnectionDate, firstConnectionCity;

function parser(){
	// Auxiliar variables
	var i, j, k, len;
	// Gets the email header given by the user
	var emailHeader = document.getElementById("email-header").value;
	// Splits the header by '\n'
	var headerSplitter = emailHeader.split("\n");

	for(j = 0; j < headerSplitter.length; j++) {

        if(headerSplitter[j].includes("Delivered-To:") && headerSplitter[j].indexOf("Delivered-To:") == 0){
            deliveredTo.push(headerSplitter[j]);
            len = deliveredTo.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                deliveredTo[len-1] += headerSplitter[++j];
            }
        }
        if(headerSplitter[j].includes("From:") && headerSplitter[j].indexOf("From:") == 0){
            from.push(headerSplitter[j]);
            len = from.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                from[len-1] += headerSplitter[++j];
            }
        }
        if(headerSplitter[j].includes("Received:") && headerSplitter[j].indexOf("Received:") == 0){
            received.push(headerSplitter[j]);
            len = received.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                received[len-1] += headerSplitter[++j];
            }
        }
        if(headerSplitter[j].includes("X-Received:") && headerSplitter[j].indexOf("X-Received:") == 0){
            x_received.push(headerSplitter[j]);
            len = x_received.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                x_received[len-1] += headerSplitter[++j];
            }
        }
        if(headerSplitter[j].includes("Received-SPF:") && headerSplitter[j].indexOf("Received-SPF:") == 0){
            received_spf.push(headerSplitter[j]);
            len = received_spf.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                received_spf[len-1] += headerSplitter[++j];
            }
        }
        if(headerSplitter[j].includes("Date:") && headerSplitter[j].indexOf("Date:") == 0){
            date.push(headerSplitter[j]);
            len = date.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                date[len-1] += headerSplitter[++j];
            }
        }
        if(headerSplitter[j].includes("Subject:") && headerSplitter[j].indexOf("Subject:") == 0){
            subject.push(headerSplitter[j]);
            len = subject.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                subject[len-1] += headerSplitter[++j];
            }
        }
        if(headerSplitter[j].includes("Cc:") && headerSplitter[j].indexOf("Cc:") == 0){
            cc.push(headerSplitter[j]);
            len = cc.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                cc[len-1] += headerSplitter[++j];
            }
        }
        if(headerSplitter[j].includes("To:") && headerSplitter[j].indexOf("To:") == 0){
            to.push(headerSplitter[j]);
            len = to.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                to[len-1] += headerSplitter[++j];
            }
        }
        if(headerSplitter[j].includes("Message-ID:") && headerSplitter[j].indexOf("Message-ID:") == 0){
            message_id.push(headerSplitter[j]);
            len = message_id.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                message_id[len-1] += headerSplitter[++j];
            }
        }
    }
    // Sets the result obtained in the respectetive span
    document.getElementById("deliveredTo").innerHTML = getDeliverToAndDateAndSubject(deliveredTo, "Delivered-To:");
    document.getElementById("from").innerHTML = getFrom(from);
    document.getElementById("subject").innerHTML = getDeliverToAndDateAndSubject(subject, "Subject:");
    if(getToCC(cc, "Cc:") != undefined) {
        document.getElementById("cc-p").style.display = "block";
        document.getElementById("cc").innerHTML = getToCC(cc, "Cc:");
    }
    if(getToCC(to, "To:") != undefined) {
        document.getElementById("to-p").style.display = "block";
        document.getElementById("to").innerHTML = getToCC(to, "To:");
    }
    document.getElementById("date").innerHTML = getDeliverToAndDateAndSubject(date, "Date:");
    // Changes display of #parse-result to "block"
    document.getElementById("parse-result").style.display = "block";
    document.getElementById("map").style.display = "block";
    document.getElementById("spoof-vpn").style.display = "block";

	// Contructs a table with information from the "Received:"
	receivedTable();
	ipTable();
	initMap();
	verifyVPN();
    document.getElementById("spoof-p").style.display = "block";
    document.getElementById("spoof").innerHTML = spoofedMails();
}

function receivedTable() {
	var received_table = document.getElementById("received-table");
	var tableRef = received_table.getElementsByTagName('tbody')[0];

	aux = getReceived(received[received.length-1]);
	newRow = tableRef.insertRow(0);

	for(j = 0;  j < received.length; j++) {
		aux = getReceived(received[received.length-j-1]);
		newRow = tableRef.insertRow(j+1);

		// Insert a cell RECEIVED-FROM
		newCell  = newRow.insertCell(0);
		if(aux[1] == "") {
			var newText  = document.createTextNode("---");
		}
		else {
			var newText  = document.createTextNode(aux[1]);
		}
		newCell.appendChild(newText);
		// Insert a cell RECEIVED-BY
		var newCell  = newRow.insertCell(1);
		if(aux[0] == "") {
			var newText  = document.createTextNode("---");
		}
		else {
			var newText  = document.createTextNode(aux[0][0]);
		}
		newCell.appendChild(newText);
		// Insert a cell PROTOCOL
		newCell  = newRow.insertCell(2);
		newText  = document.createTextNode(aux[2]);
		newCell.appendChild(newText);
		// Insert a cell DATE
		newCell  = newRow.insertCell(3);
		newText  = document.createTextNode(aux[3]);
		newCell.appendChild(newText);
		serverDates.push(aux[3]);

		if(j == 0){
			firstConnectionDate = aux[3];
		}
	}


	// Puts table visible
	received_table.style.display = "block";
}

function ipTable() {
	var received_table = document.getElementById("ip-table");
	var tableRef = received_table.getElementsByTagName('tbody')[0];

	for(j = 0;  j < ip.length; j++) {
		getIPinfo(ip[j]);
		if(!receivedIPInfo) {
			continue;
		}
		newRow = tableRef.insertRow(j);

		// Insert a cell IP
		newCell  = newRow.insertCell(0);
		var newText  = document.createTextNode(data.ip);
		newCell.appendChild(newText);
		// Insert a cell DOMAIN
		var newCell  = newRow.insertCell(1);
		var newText  = document.createTextNode(data.hostname);
		newCell.appendChild(newText);
		// Insert a cell ORGANIZATION
		newCell  = newRow.insertCell(2);
		newText  = document.createTextNode(data.org);
		newCell.appendChild(newText);
		var lat = "---";
		var log = "---";
		if(data.loc != undefined) {
			lat = data.loc.split(",")[0];
			log = data.loc.split(",")[1];
		}
		// Insert a cell LATITUDE
		newCell  = newRow.insertCell(3);
		newText  = document.createTextNode(lat);
		newCell.appendChild(newText);
		// Insert a cell LONGITUDE
		newCell  = newRow.insertCell(4);
		newText  = document.createTextNode(log);
		newCell.appendChild(newText);
		// Insert a cell CITY
		newCell  = newRow.insertCell(5);
		newText  = document.createTextNode(data.city);
		newCell.appendChild(newText);
		// Insert a cell COUNTRY
		newCell  = newRow.insertCell(6);
		newText  = document.createTextNode(data.country);
		newCell.appendChild(newText);
		// Insert a cell ISP
		newCell  = newRow.insertCell(7);
		newText  = document.createTextNode(data.isp);
		newCell.appendChild(newText);

		if(j == 0){
			firstConnectionCity = data.country;
		}
	}
	// Puts table visible
	received_table.style.display = "block";
}

function indexOfFields(headerLine) {
	var i;
	var headerFields = ["Received:", "Delivered-To:", "X-Received:", "Received-SPF:", "DKIM-Signature:", "Return-Path:",
	"Authentication-Results:", "Date:", "From:", "Reply-To:", "Message-ID:", "Message-Id:", "Subject:", "MIME-Version:", "Content-Type:",
	"To:", "X-Virus-Scanned:", "Content-Transfer-Encoding:", "X-Sender", "User-Agent", "In-Reply-To", "X-Mailer",
	"References", "Cc", "X-MSFBL", "Content-Language", "X-Priority", "Disposition-Notification-To", "X-wrimid", "X-OriginalArrivalTime", 
	"X-Report-Abuse", "X-SMTPCOM-Tracking-Number", "X-SMTPCOM-Sender-ID", "Feedback-ID", "DomainKey-Signature", "X-CSA-Complaints", "List-ID",
	"x-job", "Return-Receipt-To", "X-Spam-Flag", "X-Spam-Score", "X-Spam-Level", "X-Spam-Status", "X-Mailgun-Sid", "X-Auto-Response-Suppress", 
	"X-PHP-Originating-Script", "X-Gmail-Original-Message-ID", "X-AntiAbuse", "X-Get-Message-Sender-Via:", "X-Authenticated-Sender:", "Thread-Topic:",
	"Thread-Index:", "X-MS-Has-Attach", "X-MS-TNEF-Correlator:", "authentication-results:", "x-ms-exchange-messagesentrepresentingtype:",
	"x-tmn:", "x-eopattributedmessage:", "x-microsoft-exchange-diagnostics:", "x-ms-office365-filtering-correlation-id:", "x-microsoft-antispam:",
	"x-exchange-antispam-report-cfa-test:", "x-forefront-prvs:", "spamdiagnosticoutput:", "spamdiagnosticmetadata:", "X-OriginatorOrg:",
	"X-MS-Exchange-CrossTenant-originalarrivaltime:", "X-MS-Exchange-CrossTenant-fromentityheader:", "X-MS-Exchange-CrossTenant-id:",
	"X-MS-Exchange-Transport-CrossTenantHeadersStamped:", "X-OriginalArrivalTime:"];
	for(i = 0; i < headerFields.length; i++) {
		if(headerLine.includes(headerFields[i]) && headerLine.indexOf(headerFields[i]) == 0) {
			return 0;
		}
	}
	return -1;
}

function getReceived(received) {
	var receivedSplited = received.split(" ");
	var i, j;
	var keyWords = ["from", "by", "with"];
	var res = new Array(), aux_from = new Array(), aux_by = new Array(), aux_with = new Array(), aux_date = new Array();
	for(i = 0; i < receivedSplited.length; i++) {
		if(receivedSplited[i].includes("from")) {
			// Get DNS
            ++i;
			aux_from.push(receivedSplited[i]);
            from1.push(receivedSplited[i]);
			// Get IP
			if(!aux_from[0].includes("localhost")) {
				for(; receivedSplited[i].indexOf("[") < 0; i++);
				var i_first = receivedSplited[i].indexOf("["), i_last = receivedSplited[i].indexOf("]");
				var ip_aux = new String();
				for(j = i_first; j < i_last+1; j++) {
					ip_aux += receivedSplited[i].charAt(j);
				}
				aux_from.push(ip_aux);
				ip_aux = ip_aux.split("[")[1].split("]")[0];
				if(ip_aux.includes("IPv6:")) {
					ip_aux = ip_aux.split("IPv6:")[1];
				}
				// Saves IP if the IP wasn't saved yet
				var exists = false;
				for(k = 0; k < ip.length; k++) {
					if(ip[k] == ip_aux || ip_aux == "127.0.0.1") {
						exists = true;
					}
				}
				if(!exists) {
					ip.push(ip_aux);
				}
			}
		}
		if(receivedSplited[i].includes("by")) {
			// Get DNS
            ++i;
			aux_by.push(receivedSplited[i]);
            by1.push(receivedSplited[i]);
		}
		if(receivedSplited[i].includes("with")) {
			aux_with.push(receivedSplited[++i]);
		}
	}
	receivedSplited = received.split(";");
	aux_date = receivedSplited[receivedSplited.length-1];
	res.push(aux_by, aux_from, aux_with, aux_date);
	return res;

}

function getReceivedSPF(receivedSPF) {
	var splited = receivedSPF[0].split("=");
	return splited[1].split(";")[0];
}

function getDeliverToAndDateAndSubject(array, string){
	var aux = array[0].split(string);
	return aux[1];
}

function getFrom(from){
	var aux = from[0].split(":");
	var aux1 = aux[1].split(" ");
	var i, email;
	for(i = 0; i < aux1.length ; i++){
		if(aux1[i].includes("@")){
			email = aux1[i];
			break;
		}
	}
	email = email.replace('<',' ');
	email = email.replace('>', ' ');
	return email;
}

function getToCC(to, stringtoFind){
	if(to.length <= 0) return;
	var aux = to[0].split(stringtoFind);
	if(!aux[1].includes("<")){
		return aux[1];
	}
	else{
		aux = aux[1].split(",");
	var i,k;
	for(i = 0; i < aux.length; i++){
		k = aux[i].indexOf('<');
		aux[i] = aux[i].substr(k, aux[i].length);
		aux[i] = aux[i].replace('<',' ');
		aux[i] = aux[i].replace('>',' ');
	}
	return aux;
	}
}

function getMessageIdDomain(msgID) {
    return msgID[0].split("@")[1].split(">")[0].split(".");
}

function getIPinfo(ip){
	receivedIPInfo = false;
	//https://www.eurekapi.com/IP-GeoLoc-ip-address-geolocation-locator-lookup-database-software-geography-country-region-state-county-province-city-postal-zip-code-metro-area-code-latitude-longitude@IP-GeoLoc
	//http://ipinfo.io/developers/specific-fields
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			data = JSON.parse(xmlhttp.responseText);
			receivedIPInfo = true;
		}
	}
	var htt1 = "http://ipinfo.io/"+ip+ "/json";
	xmlhttp.open("GET", htt1 ,false);
	xmlhttp.send();
}
var map;
function initMap() {
	var mapOptions = {
		zoom: 2,
		center: new google.maps.LatLng(0.682927, 28.743951)
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	google.maps.event.addDomListener(window, 'load', initMap);

	for(j = 0;  j < ip.length; j++) {
		getIPinfo(ip[j]);
		if(!receivedIPInfo) {
			continue;
		}
		var infowindow = new google.maps.InfoWindow()

		if(data.loc != undefined) {
			lat1 = parseFloat(data.loc.split(",")[0]);
			log1 = parseFloat(data.loc.split(",")[1]);
		}
		else{ continue; }
		var uluru = {lat: lat1, lng: log1};
		var marker = new google.maps.Marker({
			position: uluru,
			map: map
		});
		var infowindow = new google.maps.InfoWindow()

		var content = data.ip
		google.maps.event.addListener(marker,'click', 
			(function(marker,content,infowindow){ 
				return function() {
					infowindow.setContent(content);
					infowindow.open(map,marker);
				};
		})(marker,content,infowindow)); 

	}
}

function verifyVPN(){
	emailDate = getDeliverToAndDateAndSubject(date, "Date:");
	console.log("First Connection:")
	console.log(firstConnectionCity);
	console.log(firstConnectionDate);
	console.log("Original Time:")
	console.log(emailDate);
}


function spoofedMails(){
    var spoofedcase = 0;
    // Test Timestamps
	actualDate = new Array();
	emailDate = getDeliverToAndDateAndSubject(date, "Date:");
	actualDate.push(new Date(emailDate).toUTCString());
	receivedDates = new Array();
	for(i = 0; i < serverDates.length; i++){
		date = new Date(serverDates[i]).toUTCString();
		receivedDates.push(date);
	}
	a2 = new Date(actualDate[0]);
	for(i = 0; i < receivedDates.length; i++){
		a1 = new Date(receivedDates[i]);
		if(a1 - a2 > 600000){
			alert("TIMESTAMPS Spoof Suspect!")
            spoofedcase++;
		}
	}
    // Test Received's By's and From's
    by1 = removeEmpty(by1);
    from1 = removeEmpty(from1);
    if(by1.length == from1.length) {
        for(i = 1; i < by1.length - 1; i++) {
            if(strcmp(by1[i], from1[i+1]) != 0) {
                alert("BY_FROM Spoof Suspect!")
                spoofedcase++;
                break;
            }
        }
    }
    // Test MessageID
    var domain = getMessageIdDomain(message_id);
    if(from1.length > 1) {
        var fromDomain = from1[2].split(".");
    }
    else {
        var fromDomain = from1[0].split(".");
    }
    for(i = 1; i < domain.length; i++) {
        console.log(fromDomain);
        console.log(domain);
        if(strcmp(domain[i], fromDomain[i]) != 0) {
            alert("MSG_ID Spoof Suspect!")
            spoofedcase++;
            break;
        }
    }
    return spoofedcase;
}
    
function removeEmpty(array) {
    var i;
    for(i = 0; i < array.length; i++) {
        if(array[i] == "") {
            array.splice(i, 1);   
        }
    }
    return array
}

function strcmp(a, b) {
    if (a.toString() < b.toString()) return -1;
    if (a.toString() > b.toString()) return 1;
    return 0;
}
