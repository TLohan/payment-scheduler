// Node script to automate rent payments on the first of each month.

var http = require('http');

var schedule = require('node-schedule');

const MONTHS= ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const dayOfMonth = 1;

console.log('server started....');
console.log(`server will be triggered on day ${dayOfTheMonth}  of each month.`);

var job = schedule.scheduleJob(`* * ${dayOfMonth} *  *`, function(){
    var today = new Date(Date.now());
    var msg = "Processing rent payments for " + MONTHS[today.getMonth()] + '.\n';
    http.get("http://tenancymanagement.azurewebsites.net/api/payments/autoupdaterentpayments", (resp) => {
        let data = '';
 
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            data = JSON.parse(data);
            
            data.forEach(payment => {
                var house = payment['lease']['flat']['house']['name'];
                var flat = payment['lease']['flat']['number'];
                var amount = payment['amount'];
                console.log(`House: ${house} Flat: ${flat} Amount: €${amount}`);
            });
        });
    });
    console.log(msg);
});

