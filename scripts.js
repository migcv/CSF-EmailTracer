function parser(){
    // Gets the email header given by the user
    var emailHeader = document.getElementById("email-header").value;
    // Splits the header by '\n'
    var headerSplitter = emailHeader.split("\n");
    // Auxiliar variables
    var i, j, len;
    // Array to store information of each field that matters
    var deliveredTo = new Array(), from = new Array(), received = new Array(), x_received = new Array(), received_spf = new Array(), date = new Array(), subject = new Array(), cc = new Array(), to = new Array();

    var tableRef = undefined;
    var newRow = undefined;
    var aux = undefined;
    var received_table = undefined;

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
            received.push(headerSplitter[j]);
            len = received.length;
            while(indexOfFields(headerSplitter[j+1]) != 0) {
                received[len-1] += headerSplitter[++j];
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
    }
    // Sets the result obtained in the respectetive span
    document.getElementById("deliveredTo").innerHTML = getDeliverToAndDateAndSubject(deliveredTo, "Delivered-To:");
    document.getElementById("from").innerHTML = getFrom(from);
    //document.getElementById("received").innerHTML = received;
    //document.getElementById("x-received").innerHTML = x_received;
    //document.getElementById("date").innerHTML = date;
    document.getElementById("subject").innerHTML = getDeliverToAndDateAndSubject(subject, "Subject:");
    document.getElementById("cc").innerHTML = getToCC(cc, "Cc:");
    document.getElementById("to").innerHTML = getToCC(to, "To:");
    // Changes display of #parse-result to "block"
    document.getElementById("parse-result").style.display = "block";

    received_table =  document.getElementById("received-table");
    received_table.style.display = "block";

    /*tableRef = received_table.getElementsByTagName('tbody')[0];
    len = tableRef.rows.length;
    alert(len);
    for(i = 0;  i < len*2; i++) {
        tableRef.deleteRow(i);
        alert(i + ":" + len);
    }*/


    tableRef = received_table.getElementsByTagName('tbody')[0];
    var rowsRef = tableRef.getElementsByTagName("tr");
    for(j = 0;  j < received.length; j++) {
        aux = getReceived(received[j]);

        // Insert a row in the table at the last row

        if(rowsRef[j] != undefined) {
            tableRef.deleteRow(j);
            newRow = tableRef.insertRow(j);
        }
        else {
            newRow = tableRef.insertRow(j);
        }

        // Insert a cell in the row at index 0
        var newCell  = newRow.insertCell(0);

        // Append a text node to the cell
        var newText  = document.createTextNode(aux[0][0]);
        newCell.appendChild(newText);

        newCell  = newRow.insertCell(1);

        // Append a text node to the cell
        newText  = document.createTextNode(aux[1]);
        newCell.appendChild(newText);

         newCell  = newRow.insertCell(2);

        // Append a text node to the cell
        newText  = document.createTextNode(aux[2]);
        newCell.appendChild(newText);

         newCell  = newRow.insertCell(3);

        // Append a text node to the cell
        newText  = document.createTextNode(aux[3]);
        newCell.appendChild(newText);
    }

    //console.log(getDeliverToAndDateAndSubject(deliveredTo, "Delivered-To:"));
    //console.log(getFrom(from));
    //console.log(getDeliverToAndDateAndSubject(date, "Date:"));
    //console.log(getToCC(to, "To:"));
    //console.log(getToCC(cc, "Cc:"));
    //console.log(getDeliverToAndDateAndSubject(subject, "Subject:"));
}

function indexOfFields(headerLine) {
    var i;
    var headerFields = ["Received:", "Delivered-To:", "X-Received:", "Received-SPF:", "DKIM-Signature:", "Return-Path:",
    "Authentication-Results:", "Date:", "From:", "Reply-To:", "Message-ID:", "Message-Id:", "Subject:", "MIME-Version:", "Content-Type:",
    "To:", "X-Virus-Scanned:", "Content-Transfer-Encoding:", "X-Sender", "User-Agent", "In-Reply-To", "X-Mailer",
    "References", "Cc", "X-MSFBL", "Content-Language", "X-Priority", "Disposition-Notification-To", "X-wrimid", "X-OriginalArrivalTime", "X-Report-Abuse", "X-SMTPCOM-Tracking-Number", "X-SMTPCOM-Sender-ID", "Feedback-ID", "DomainKey-Signature", "X-CSA-Complaints", "List-ID", "x-job", "Return-Receipt-To", "X-Spam-Flag", "X-Spam-Score", "X-Spam-Level", "X-Spam-Status", "X-Mailgun-Sid", "X-Auto-Response-Suppress", "X-PHP-Originating-Script", "X-Gmail-Original-Message-ID", "X-AntiAbuse", "X-Get-Message-Sender-Via:", "X-Authenticated-Sender:"];
    for(i = 0; i < headerFields.length; i++) {
        if(headerLine.includes(headerFields[i]) && headerLine.indexOf(headerFields[i]) == 0) {
            return 0;
        }
    }
    return -1;
}

function getReceived(received) {
    var receivedSplited = received.split(" ");
    console.log(receivedSplited);
    var i, j;
    var keyWords = ["from", "by", "with"];
    var res = new Array(), aux_from = new Array(), aux_by = new Array(), aux_with = new Array(), aux_date = new Array();
    for(i = 0; i < receivedSplited.length; i++) {
        if(receivedSplited[i].includes("from")) {
            // Get DNS
            aux_from.push(receivedSplited[++i]);
            // Get IP
            if(!aux_from[0].includes("localhost")) {
                for(; receivedSplited[i].indexOf("[") < 0; i++);
                var i_first = receivedSplited[i].indexOf("["), i_last = receivedSplited[i].indexOf("]");
                var ip = new String();
                for(j = i_first + 1; j < i_last; j++) {
                    ip += receivedSplited[i].charAt(j);
                }
                aux_from.push(ip);
            }
        }
        if(receivedSplited[i].includes("by")) {
            // Get DNS
            aux_by.push(receivedSplited[++i]);
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
