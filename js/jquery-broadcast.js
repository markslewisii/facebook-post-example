/** 
 * jQuery event broadcaster
 * @var string strEvent event name
 * @var array|object data Extra data passed to listeners
 */
jQuery.broadcast = function(strEvent, data) {
    console.log("broadcast: " + strEvent);
    jQuery(".jq-event-listener").each(function() {
        // console.log(jQuery(this));
        jQuery(this).triggerHandler(strEvent, data);
    });
    return false;
};