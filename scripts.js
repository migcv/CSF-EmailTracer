function parser(){
    // Gets the email header given by the user
    var emailHeader = document.getElementById("email-header").value;
    // Splits the header by '\n'
    var headerSplitter = emailHeader.split("\n");
    // Auxiliar variables
    var j;
    // Array to store information of each field that matters
    var deliveredTo = new Array(), from = new Array(), received = new Array(), x_received = new Array(), receivedSPF = new Array(), date = new Array(), subject = new Array(), cc = new Array(), to = new Array();

    for(j = 0; j < headerSplitter.length; j++) {

        if(headerSplitter[j].includes("Delivered-To:") && headerSplitter[j].indexOf("Delivered-To:") == 0){
            deliveredTo.push(headerSplitter[j] + "<br>");
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                deliveredTo.push(headerSplitter[++j]+ "<br>");
            }
        }
        if(headerSplitter[j].includes("From:") && headerSplitter[j].indexOf("From:") == 0){
            from.push(headerSplitter[j] + "<br>");
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                from.push(headerSplitter[++j]+ "<br>");
            }
        }
        if(headerSplitter[j].includes("Received:") && headerSplitter[j].indexOf("Received:") == 0){
            received.push(headerSplitter[j] + "<br>");
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                received.push(headerSplitter[++j]+ "<br>");
            }
        }
        if(headerSplitter[j].includes("X-Received:") && headerSplitter[j].indexOf("X-Received:") == 0){
            x_received.push(headerSplitter[j]);
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                x_received.push(headerSplitter[++j]+ "<br>");
            }
        }
        if(headerSplitter[j].includes("Date:") && headerSplitter[j].indexOf("Date:") == 0){
            date.push(headerSplitter[j]);
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                date.push(headerSplitter[++j]+ "<br>");
            }
        }
        if(headerSplitter[j].includes("Subject:") && headerSplitter[j].indexOf("Subject:") == 0){
            subject.push(headerSplitter[j]);
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                subject.push(headerSplitter[++j]+ "<br>");
            }
        }
        if(headerSplitter[j].includes("Cc:") && headerSplitter[j].indexOf("Cc:") == 0){
            cc.push(headerSplitter[j]);
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                cc.push(headerSplitter[++j]+ "<br>");
            }
        }
        if(headerSplitter[j].includes("To:") && headerSplitter[j].indexOf("To:") == 0){
            to.push(headerSplitter[j]);
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                to.push(headerSplitter[++j]+ "<br>");
            }
        }
    }
    // Sets the result obtained in the respectetive span
    document.getElementById("deliveredTo").innerHTML = deliveredTo;
    document.getElementById("from").innerHTML = replaceTags(from);
    document.getElementById("received").innerHTML = received;
    document.getElementById("x-received").innerHTML = x_received;
    document.getElementById("receivedSPF").innerHTML = receivedSPF;
    document.getElementById("date").innerHTML = date;
    document.getElementById("subject").innerHTML = subject;
    document.getElementById("cc").innerHTML = cc;
    document.getElementById("to").innerHTML = to;
    // Changes display of #parse-result to "block"
    document.getElementById("parse-result").style.display = "block";
}

function indexOfFields(headerLine) {
    var i;
    var headerFields = ["Received", "Delivered-To", "X-Received", "Received-SPF", "DKIM-Signature", "Return-Path", "Authentication-Results", "Date", "From", "Reply-To", "Message-ID", "Subject", "MIME-Version", "Content-Type", "To", "X-Virus-Scanned", "Content-Transfer-Encoding", "X-Sender", "User-Agent", "In-Reply-To", "X-Mailer", "References", "Cc", "X-MSFBL", "Content-Language", "X-Priority", "Disposition-Notification-To"];
    for(i = 0; i < headerFields.length; i++) {
        if(headerLine.includes(headerFields[i]) && headerLine.indexOf(headerFields[i]) == 0) {
            return 0;
        }
    }
    return -1;
}
