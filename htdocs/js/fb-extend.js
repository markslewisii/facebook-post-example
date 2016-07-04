window.fbAsyncInit = function() {
    FB.init({
        appId      : '1611551282490800',
        cookie     : false,
        xfbml      : false,
        version    : 'v2.6'
    });


    FB.Event.subscribe('auth.login', function() { jQuery.broadcast("fb:login"); });
    FB.Event.subscribe('auth.logout', function() { jQuery.broadcast("fb:logout"); });

    checkLoginState();

    /**
     * Facebook extend
     */

    // save acces tokens
    FB.access_token = {};

    // ID of me
    FB.myID = null;

    // Save current facebook page ID
    FB.current_pageID = null;

    /**
     * Get user profile
     * @var function callback Function to call back 
     */
    FB.getMe = function(callback) {
        FB.api("/me", callback);
    }

    /**
     * Get pages the user can admin
     * @var function callback Function to call back 
     */
    FB.getAccounts = function(callback) {
        FB.api("/me/accounts", function(response) {
            // console.log("/me/accounts");
            // console.log(response);
            //save page access token
            for(i = 0; i < response.data.length; i++) {
                FB.setAccessToken(response.data[i].id, response.data[i].access_token);
            }
            callback(response);
        });
    }

    FB.setAccessToken = function(id, token) {
        // console.log("setAccessToken:" + id + "," + token);
        FB.access_token[String(id)] = token;
    }
    FB.getAccessToken = function(id) {
        return FB.access_token[String(id)];
    }


    FB.setMyID  = function(id) {
        console.log("FB.setMyID:" + id);
        FB.myID = id;
    }
    FB.getMyID  = function(id) {
        return FB.myID;
    }
    FB.isMe  = function(id) {
        console.log(id + " == " + FB.getMyID());
        return ((id == FB.getMyID()) || (id == "me"));
    }

   FB.setCurrentPageID  = function(id) {
        FB.current_pageID = id;
    }
    FB.getCurrentPageID  = function(id) {
        return FB.current_pageID;
    }



    /**
     * Get get posts for user or page
     * @var string pageID ID of user (i.e. "me") or page
     * @var object params Parameters to includein the query
     * @var function callback Function to call back 
     */
    FB.getPosts = function(pageID, params, callback) {
        console.log("FB.getPost: " + pageID);

        // save the page ID
        FB.setCurrentPageID(pageID);

        if (! jQuery.isPlainObject( params )) params = {};
        body = jQuery.extend({
                    is_published: true,
                    access_token: FB.getAccessToken(pageID),
                    fields: "insights.metric(post_impressions_unique),created_time,story,message,link,name,picture,caption,description,type,object_id",
                    limit: 5
                }, params);

        // console.log("getPosts->body:");
        // console.log(body);

        action = (body.is_published === false) ? "promotable_posts" : "posts";                  
        FB.api( "/" + pageID + "/" + action, 
                body,
                callback
            );
    }

    /**
     * Paging for posts
     * @var string cursorLink Paging link as returned from Facebook
     * @var function callback Function to call back 
     */
    FB.nextPrev = function(cursorLink, callback) {
        jQuery.ajax({
            url: cursorLink,
            success: callback,
            cache: false,
            dataType: 'json'
        });
    }


    /**
     * Check cursor link URLs for prev/next
     * If no data, return false, else true
     * @return boolean
     */
    FB.hasNextPrev = function(cursorLink, callback) {
        FB.nextPrev(cursorLink, function(response) {
            callback((response.data.length > 0));
        });
    }

    /**
     * Add post
     * @var string pageID ID of user (i.e. "me") or page
     * @var object data Data to include in POST
     * @var function callback Function to call back 
     */
    FB.addPost = function(pageID, data, callback) {
        data.access_token = FB.getAccessToken(pageID);
        FB.api("/" + pageID + "/feed", "POST", data, callback);
    }


    FB.updatePost = function(pageID, postID, params, callback) {
        if (! jQuery.isPlainObject( params )) params = {};
        body = jQuery.extend(
                        {
                            access_token: FB.getAccessToken(pageID)
                        },
                        params
                    );

        FB.api("/" + postID + "?access_token=" + FB.getAccessToken(pageID), "POST", body, callback);
    }

    FB.deletePost = function(pageID, postID, callback) {
        FB.api("/" + postID + "?access_token=" + FB.getAccessToken(pageID), "DELETE", callback);
    }


};