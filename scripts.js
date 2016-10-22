function parser(){
    // Gets the email header given by the user
    var emailHeader = document.getElementById("email-header").value;
    // Splits the header by '\n'
    var headerSplitter = emailHeader.split("\n");
    // Auxiliar variables
    var j, len;
    // Array to store information of each field that matters
    var deliveredTo = new Array(), from = new Array(), received = new Array(), x_received = new Array(), received_spf = new Array(), date = new Array(), subject = new Array(), cc = new Array(), to = new Array();

    for(j = 0; j < headerSplitter.length; j++) {

        if(headerSplitter[j].includes("Delivered-To:") && headerSplitter[j].indexOf("Delivered-To:") == 0){
            deliveredTo.push(headerSplitter[j]);
            len = deliveredTo.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                deliveredTo[len-1] += headerSplitter[++j];
            }
            deliveredTo[len-1] += "<br>";
        }
        if(headerSplitter[j].includes("From:") && headerSplitter[j].indexOf("From:") == 0){
            from.push(headerSplitter[j]);
            len = from.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                from[len-1] += headerSplitter[++j];
            }
            from[len-1] += "<br>";
        }
        if(headerSplitter[j].includes("Received:") && headerSplitter[j].indexOf("Received:") == 0){
            received.push(headerSplitter[j]);
            len = received.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                received[len-1] += headerSplitter[++j];
            }
            received[len-1] += "<br>";
        }
        if(headerSplitter[j].includes("X-Received:") && headerSplitter[j].indexOf("X-Received:") == 0){
            x_received.push(headerSplitter[j]);
            len = x_received.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                x_received[len-1] += headerSplitter[++j];
            }
            x_received[len-1] += "<br>";
        }
        if(headerSplitter[j].includes("Received-SPF:") && headerSplitter[j].indexOf("Received-SPF:") == 0){
            received_spf.push(headerSplitter[j]);
            len = received_spf.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                received_spf[len-1] += headerSplitter[++j];
            }
            received_spf[len-1] += "<br>";
        }
        if(headerSplitter[j].includes("Date:") && headerSplitter[j].indexOf("Date:") == 0){
            date.push(headerSplitter[j]);
            len = date.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                date[len-1] += headerSplitter[++j];
            }
            date[len-1] += "<br>";
        }
        if(headerSplitter[j].includes("Subject:") && headerSplitter[j].indexOf("Subject:") == 0){
            subject.push(headerSplitter[j]);
            len = subject.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                subject[len-1] += headerSplitter[++j];
            }
            subject[len-1] += "<br>";
        }
        if(headerSplitter[j].includes("Cc:") && headerSplitter[j].indexOf("Cc:") == 0){
            cc.push(headerSplitter[j]);
            len = cc.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                cc[len-1] += headerSplitter[++j];
            }
            cc[len-1] += "<br>";
        }
        if(headerSplitter[j].includes("To:") && headerSplitter[j].indexOf("To:") == 0){
            to.push(headerSplitter[j]);
            len = to.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                to[len-1] += headerSplitter[++j];
            }
            to[len-1] += "<br>";
        }
    }
    // Sets the result obtained in the respectetive span
    document.getElementById("deliveredTo").innerHTML = deliveredTo;
    document.getElementById("from").innerHTML = from;
    document.getElementById("received").innerHTML = received;
    document.getElementById("x-received").innerHTML = x_received;
    document.getElementById("receivedSPF").innerHTML = received_spf;
    document.getElementById("date").innerHTML = date;
    document.getElementById("subject").innerHTML = subject;
    document.getElementById("cc").innerHTML = cc;
    document.getElementById("to").innerHTML = to;
    // Changes display of #parse-result to "block"
    document.getElementById("parse-result").style.display = "block";

    getReceiverEmail(deliveredTo);
    getSenderEmail(from);
    getDateEmail(date);
}

function indexOfFields(headerLine) {
    var i;
    var headerFields = ["Received", "Delivered-To", "X-Received", "Received-SPF", "DKIM-Signature", "Return-Path",
    "Authentication-Results", "Date", "From", "Reply-To", "Message-ID", "Subject", "MIME-Version", "Content-Type",
    "To", "X-Virus-Scanned", "Content-Transfer-Encoding", "X-Sender", "User-Agent", "In-Reply-To", "X-Mailer",
    "References", "Cc", "X-MSFBL", "Content-Language", "X-Priority", "Disposition-Notification-To"];
    for(i = 0; i < headerFields.length; i++) {
        if(headerLine.includes(headerFields[i]) && headerLine.indexOf(headerFields[i]) == 0) {
            return 0;
        }
    }
    return -1;
}

function getReceiverEmail(deliveredTo){
    var email = deliveredTo[0].split(":");
    console.log(email[1]);
}

function getSenderEmail(from){
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
    console.log(email);
}

function getDateEmail (date) {
    var dt = date[0].split("Date:");
    console.log(dt[1]);
    console.log(dt[0]);
}
