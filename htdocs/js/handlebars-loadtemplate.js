/**
 * @var file string location of external template to load and compile
 */
Handlebars.loadTemplate = function(file) {
	return new Promise(
		function(resolve, reject) {
		    jQuery.ajax({
		        url: file,
		        cache: true,
		        success: function(data) {
		            source    = data;
		            resolve(Handlebars.compile(source));
		        },              
		        error: function(data) {
		            reject(data);
		        }               
		    })
	    }
    );
};


/**
 * date format helper
 * @var string strDate Date in format accepted by Javascript
 */
Handlebars.registerHelper("formatdate", function(strDate) {
	var dateObj = new Date(strDate);
	var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	var hour = Number(dateObj.getHours());
	var ampm = (hour > 11) ? "PM" : "AM"
	if (hour > 12) hour -= 12;
	if (hour == 0) hour = 12;
	if (hour < 10) hour = "0" + String(hour);

	var minute = Number(dateObj.getMinutes());
	if (minute < 10) minute = "0" + String(minute);
	return month[Number(dateObj.getMonth())] + " " + Number(dateObj.getDate()) + ", " + dateObj.getFullYear() + " " + hour + ":" + minute + " " + ampm;
});

// Handlebars.prototype.loadTemplate = Handlebars.loadTemplate;