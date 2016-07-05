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
        console.log("FB.addPost");
        console.log(data);
        data.access_token = FB.getAccessToken(pageID);

        if (data.type == "photo") {
            console.log("calling FB.addPhoto");
            FB.addPhoto(
                data,
                callback
                /*
                function (response) {
                    delete data.source;
                    delete data.url;
                    delete data.caption;
                    data.object_attachment = response.id;

                    console.log(data);
                    FB.api("/" + pageID + "/feed", "POST", data, callback);
                }
                */

            );

        } else if (data.type == "video") {
            console.log("calling FB.addVideo");
            FB.addVideo(
                data,
                callback
                /*
                function (response) {
                    delete data.source;
                    delete data.url;
                    delete data.caption;
                    data.object_attachment = response.id;

                    console.log(data);
                    FB.api("/" + pageID + "/feed", "POST", data, callback);
                }
                */

            );

        } else {
            FB.api("/" + pageID + "/feed", "POST", data, callback);
        }
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


    FB.addPhoto = function(data, callback) {
        console.log("addPhoto");
        console.log(jQuery(data.source)[0].files[0]);


        var formData = new FormData();
        formData.append("access_token", FB.getAccessToken(FB.getCurrentPageID()));
        formData.append("caption", data.caption);
        // formData.append("no_story", true);
        if (data.published) formData.append("published", data.published);
        formData.append("source", jQuery(data.source)[0].files[0]);


        jQuery.ajax({
            url: "https://graph.facebook.com/" + FB.getCurrentPageID() + "/photos",
            data: formData,
            success: callback,
            type: "POST",
            cache: false,
            dataType: 'json',
            contentType: false,
            processData: false

        });

        // FB.api("/" + FB.getCurrentPageID() + "/photos", formData, "POST", callback);

        /*
        var reader = new FileReader();
        reader.onload = function() {
            var photoData = jQuery.extend({}, data, {source: reader.result});
            photoData.access_token = FB.getAccessToken(FB.getCurrentPageID());
            console.log("reader.onload");
            console.log(photoData);
            FB.api("/" + FB.getCurrentPageID() + "/photos", photoData, "POST", callback);
        }
        reader.readAsBinaryString(jQuery(data.source)[0].files[0]);
        */
    }

   FB.addVideo = function(data, callback) {
        console.log("addVideo");
        console.log(jQuery(data.source)[0].files[0]);


        var formData = new FormData();
        formData.append("access_token", FB.getAccessToken(FB.getCurrentPageID()));
        formData.append("title", data.title);
        if (data.published) formData.append("published", data.published);
        formData.append("source", jQuery(data.source)[0].files[0]);


        jQuery.ajax({
            url: "https://graph.facebook.com/" + FB.getCurrentPageID() + "/videos",
            data: formData,
            success: callback,
            type: "POST",
            cache: false,
            dataType: 'json',
            contentType: false,
            processData: false

        });

    }


};