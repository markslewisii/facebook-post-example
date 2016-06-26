Handlebars.loadTemplate = function(file) {
	return new Promise(
		function(resolve, reject) {
		    jQuery.ajax({
		        url: file,
		        cache: true,
		        success: function(data) {
		        	// console.log(data);
		            source    = data;
		            resolve(Handlebars.compile(source));
		        },              
		        error: function(data) {
		            reject(data);
		        }               
		    })
	    }
    );
}