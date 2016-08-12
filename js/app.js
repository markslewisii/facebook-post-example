jQuery(document).ready(function() {




    /* UI widgets */
    // profile dropdown
    jQuery('#profilesBtn').dropdown();
    jQuery(".loading").hide();


    /* turn off form submission */

    /**
     ** Hidden div for data loading and display **
     */
    jQuery("#api")

        /*
         * User had logged in
         * Load profile and pages
         * @var jQuery.Event evt - Event object
         * @broadcast profile:load
         */
        .on("fb:login", function(evt) {

            // load profile menu entry template
            Handlebars.loadTemplate('//facebook-post-example/_views/profile-entry.html')
                .then(function(hbTemplate) {
                    // get user profile
                    FB.getMe(function(response) {
                        // console.log("getMe callback");
                        // console.log(response);

                        if (!response || response.error) {
                            // error
                        } else {
                            jQuery("[aria-labelledby=\"profilesBtn\"]").prepend(hbTemplate({id: response.id, name: response.name}));
                            
                            FB.setMyID(response.id);

                            // load me
                            jQuery.broadcast("profile:load", {id: response.id, name: response.name});

                        }
                    });

                    // get pages
                    FB.getAccounts(function(response) {
                        if (!response || response.error) {
                            // error
                        } else {
                            // console.log("getAccounts callback");
                            // console.log(response);
                            for(i = 0; i < response.data.length; i++) {
                                // console.log(response.data[i].name);
                                jQuery("[aria-labelledby=\"profilesBtn\"]").append(hbTemplate({id: response.data[i].id, name: response.data[i].name}));
                            }
                            
                        }
                    });
                    
                })
                .catch(function() {
                    // error
                });         

            return false;
        })

        /*
         * Logout user
         * @var jQuery.Event evt - Event object
         */
        .on("fb:logout", function(evt) {
            FB.logout();
            return false;
        })

        /*
         * Load the profile or page
         * Trigger subsequent loading of posts and drafts
         * @var jQuery.Event evt - Event object
         * @var object data - OBject containing id and name of profile/page
         * @broadcast posts:load
         * @broadcast drafts:load
         */
        .on("profile:load", function(evt, data) {
            console.log("profile:load");
            console.log(data);
            // set jumbotron


            Handlebars.loadTemplate('//facebook-post-example/_views/profile-jumbo.html')
                .then(function(hbTemplate) {
                    jQuery(".jumbotron .container").html(hbTemplate({
                                                id: data.id,
                                                name: data.name
                                            }));
                })
                .catch(function() {
                // error
                });

            // load posts
            jQuery.broadcast("posts:load", data.id);

            // load drafts
            jQuery.broadcast("drafts:load", data.id);

            // load drafts
            return false;
        })

        /*
         * Load posts for a given profile/page
         * Trigger posts:loaded event so UI shows them
         * @var jQuery.Event evt - Event object
         * @var string id - ID of page
         * @broadcast posts:loaded
         */
        .on("posts:load", function(evt, id) {
            FB.getPosts(id, {is_published: true}, function(response) {
                if (!response || response.error) {
                    // error
                } else {

                    jQuery.broadcast("posts:loaded", response);
                }
            });
            return false
        })

        /*
         * Load drafts for a page
         * Cannot be used on a profile
         * @var jQuery.Event evt - Event object
         * @var string id - ID of page
         * @broadcast drafts:hasnot
         * @broadcast drafts:loaded
         */
        .on("drafts:load", function(evt, id) {
            if (FB.isMe(id)) {
                jQuery.broadcast("drafts:hasnot");
            } else {
                FB.getPosts(id, {is_published: false}, function(response) {
                    if (!response || response.error) {
                        // error
                    } else {
                        console.log("drafts:loaded");
                        console.log(response);

                        jQuery.broadcast("drafts:loaded", response);

                    }
                });
            }
        })


        /*
         * Load next page for the post/draft list
         * @var jQuery.Event evt - Event object
         * @var string cursorLink - URL of next page
         * @broadcast posts:loaded
         * @broadcast posts:nomore
         */
        .on("posts:paging", function(evt, cursorLink) {

            FB.nextPrev(cursorLink, function(response) {
                if (!response || response.error) {
                    // error
                } else {
                    if (response.data.length > 0) {
                        jQuery.broadcast("posts:loaded", response);
                    } else {
                        jQuery.broadcast("posts:nomore", response);
                    }
                }
            });         
            return false;

        })

        /*
         * Add a post
         * @var jQuery.Event evt - Event object
         * @var object data - Data for add
         * @broadcast posts:loaded
         * @broadcast modal:hide
         */
        .on("post:add", function(evt, data) {
            console.log("adding post");
            console.log(data);
            console.log(FB.getCurrentPageID());

            FB.addPost(FB.getCurrentPageID(), data, function(response) {
                if (!response || response.error) {
                    // error
                } else {
                    FB.getPosts(FB.getCurrentPageID(), {}, function(response) {
                        if (!response || response.error) {
                            // error
                        } else {
                            jQuery.broadcast("posts:loaded", response);
                            jQuery.broadcast("modal:hide", response);
                        }
                    });
                }
            });
            return false;
        })

        /*
         * Add a draft
         * @var jQuery.Event evt - Event object
         * @var object data - Data for add
         * @broadcast drafts:loaded
         * @broadcast modal:hide
         */
        .on("draft:add", function(evt, data) {

            console.log(data);
            console.log(FB.getCurrentPageID());
            
            data.published = false;
            FB.addPost(FB.getCurrentPageID(), data, function(response) {
                if (!response || response.error) {
                    // error
                } else {
                    FB.getPosts(FB.getCurrentPageID(), {is_published: false}, function(response) {
                        if (!response || response.error) {
                            // error
                        } else {
                            jQuery.broadcast("drafts:loaded", response);
                            jQuery.broadcast("modal:hide", response);
                        }
                    });
                }
            });
            return false;
        })

        /*
         * Load next page for the draft list
         * @var jQuery.Event evt - Event object
         * @var string cursorLink - URL of next page
         * @broadcast drafts:loaded
         * @broadcast drafts:nomore
         */
        .on("drafts:paging", function(evt, cursorLink) {

            FB.nextPrev(cursorLink, function(response) {
                if (!response || response.error) {
                    // error
                } else {
                    if (response.data.length > 0) {
                        jQuery.broadcast("drafts:loaded", response);
                    } else {
                        jQuery.broadcast("drafts:nomore", response);
                    }
                }
            });         
            return false;

        })


        /*
         * Update a post
         * @todo implement
         * @var jQuery.Event evt - Event object
         * @var object data - Data for update
         */
        .on("post:update", function(evt, data) {
            postID = data.postID;
            data.postID = null;
            FB.updatePost(FB.getCurrentPageID(), postID, function(response) {
            });
        })

        /*
         * delete a post
         * @var jQuery.Event evt - Event object
         * @var string postID - ID of post to delete
         * @broadcast posts:deleted
         */
        .on("post:delete", function(evt, postID) {
            console.log("post:delete");
            console.log(postID);

            FB.deletePost(FB.getCurrentPageID(), postID, function(response) {
                if (response.success == true) {
                    console.log("fadeOut:" + postID);
                    jQuery(".posts div[data-fb-postid=\"" + postID + "\"]")
                        .fadeOut(300,
                            function() {
                                jQuery(this).remove();
                                jQuery.broadcast("post:deleted", postID);
                            }
                        );
                    
                }
            });
        })

        /*
         * Publish a draft
         * @todo Manage drafts pane after draft is removed
         * @var jQuery.Event evt - Event object
         * @var string postID - ID of post to publish
         * @broadcast post:published
         */
        .on("post:publish", function(evt, postID) {
            console.log("post:publish");
            console.log(postID);

            FB.updatePost(FB.getCurrentPageID(), postID, {is_published: true}, function(response) {
                // console.log(response);
                if (response.success == true) {
                    console.log("fadeout:" + postID);
                    jQuery(".posts div[data-fb-postid=\"" + postID + "\"]")
                        .fadeOut(300,
                            function() {
                                jQuery(this).remove();
                                jQuery.broadcast("post:published", postID);
                            }
                        );

                    
                }
            });

        })

        /*
         * Post completed moving from draft to published post
         * Load published posts
         * @var jQuery.Event evt - Event object
         * @var string postID - ID of post to publish
         * @broadcast posts:load
         */
        .on("post:published", function (evt, postID) {

            FB.getPosts(FB.getCurrentPageID(), {is_published: true}, function(response) {
                if (!response || response.error) {
                    // error
                } else {
                    jQuery.broadcast("posts:load", FB.getCurrentPageID());

                }
            });
        })

        ;

    /*** UI elements ***/

    /**
     * Login button
     */
    jQuery('#fbLogin')

        /**
         * User logged in
         * Hide button
         */
        .on("fb:login", function() {
            jQuery(this).hide();
            return false;
        })

        /**
         * User logged out
         * Show button
         */
        .on("fb:logout", document, function() {
            jQuery(this).show();
            return false;
        })

        /**
         * Button clicked
         * Login
         */
       .on('click', function() {
            FB.login(function() {}, {scope: "user_posts,manage_pages,read_insights,publish_actions,publish_pages"});
            return false;
        });

    /**
     * Logout button
     */
    jQuery('#fbLogout')

        /**
         * User logged in
         * Show button
         */
        .on("fb:login",function() {
            jQuery(this).show();
            return false;
        })

        /**
         * User logged out
         * Hide button
         */
        .on("fb:logout",function() {
            jQuery(this).hide();
            return false;
        })

        /**
         * Button clicked
         * Logout
         * @broadcast fb:logout
         */
        .on('click', function() {
            jQuery.broadcast("fb:logout");
            return false;
        });

    /**
     * Profile/page menu selector
     */
    jQuery("#profilesBtn")

        /**
         * User logged in
         * Show
         */
        .on("fb:login",function() {
            jQuery(this).show();
            return false;
        })

        /**
         * User logged out
         * Hide
         */
        .on("fb:logout",function() {
            jQuery(this).hide();
            jQuery("[aria-labelledby=\"profilesBtn\"] li[role!=\"separator\"]").remove();
            return false;
        });

    /**
     * Instructional body shown prior to login
     */
    jQuery(".prelogin")
        /**
         * User logged in
         * Hide
         */
        .on("fb:login",function() {
            jQuery(this).hide();
            return false;
        })

        /**
         * User logged out
         * Show
         */
        .on("fb:logout",function() {
            jQuery(this).show();
            return false;
        })
        ;



    /**
     * Post columns loaded after login
     */
    jQuery(".postcols")
        /**
         * User logged in
         * Show
         */
        .on("fb:login",function() {
            console.log("show postcols");
            jQuery(this).show();
            return false;
        })

        /**
         * User logged out
         * Hide
         */
        .on("fb:logout",function() {
            jQuery(this).hide();
            return false;
        })
        ;

    /**
     * Selection event for list of profile/pages in menu
     * @broadcast profile:load
     */
    jQuery("[aria-labelledby=\"profilesBtn\"]")
        .on("click", "li a", function() {
            jQuery.broadcast("profile:load", {id: jQuery(this).attr("data-fb-pageid"), name: jQuery(".name", this).text()});
            jQuery(this).parent().collapse('hide');
            // return false;
        });

    /**
     * List of posts
     * Left side of UI if drafts are present else 100% width
     */
    jQuery("#posts_published")

        /**
         * API call to load posts complete
         * @var jQuery.Event evt - Event object
         * @var object response - Response from API call with list of posts
         * @broadcast fb:logout
         */
        .on("posts:loaded", function(evt, response) {
            console.log("#posts_published->posts:loaded");
            console.log(response);
            jQuery("#posts_published .posts").empty();

            // display posts
            Handlebars.loadTemplate('//facebook-post-example/_views/post-entry.html')
                .then(function(hbTemplate) {

                    // loop through posts
                    for(i = 0; i < response.data.length; i++) {

                        // loop through insights
                        views = null;
                        if (response.data[i].insights !== undefined) {
                            for(j = 0; j < response.data[i].insights.data.length; j++) {
                                if (response.data[i].insights.data[j].name == "post_impressions_unique") {
                                    views = String(response.data[i].insights.data[j].values[0].value);
                                    break;
                                }
                            }
                        }

                        var data = jQuery.extend({}, response.data[i], {views: views});
                        jQuery("#posts_published .posts").append(hbTemplate(data)).hide().fadeIn(300);
                                
                    }       
                })
                .catch(function() {
                    // error
                });

            // set prev/next
            jQuery("#posts_published .prev").attr("data-fb-cursor", response.paging.previous);
            jQuery("#posts_published .next").attr("data-fb-cursor", response.paging.next);

            // show/hide
            FB.hasNextPrev(response.paging.previous, function(hasMore) {
                if (hasMore) {
                    jQuery("#posts_published .prev").show();
                } else {
                    jQuery("#posts_published .prev").hide();
                }
            });
            FB.hasNextPrev(response.paging.next, function(hasMore) {
                if (hasMore) {
                    jQuery("#posts_published .next").show();
                } else {
                    jQuery("#posts_published .next").hide();
                }
            });

            return false;
        })

        /*
         * @todo ???
         */
        .on("post:load", function(evt, response) {
            console.log("post:load");
            console.log(response);
            return false;
        })

        /**
         * @todo ???
         */
        .on("post:published", function(evt, response) {
        })

        /**
         * Drafts have been loaded.
         * Make room by setting col width to 50% (6 col width)
         * @var jQuery.Event evt - Event object
         */
        .on("drafts:has", function(evt) {
            jQuery(this).parent().removeClass("col-md-12").addClass("col-md-6");
        })
 
        /**
         * Drafts have been loaded, but none to display.
         * Span 100% width
         * @var jQuery.Event evt - Event object
         */
       .on("drafts:hasnot", function(evt) {
            jQuery(this).parent().removeClass("col-md-6").addClass("col-md-12");
        })
        ;

    /**
     * List of drafts
     * Right side of UI (50% col)
     */
    jQuery("#posts_drafts")

        /**
         * Drafts have been loaded, display them
         * @var jQuery.Event evt - Event object
         * @var object response - Response from API call with list of drafts
         * @broadcast drafts:hasnot
         * @broadcast drafts:has
         */
        .on("drafts:loaded", function(evt, response) {
            // console.log("#posts_drafts->drafts:loaded");
            // console.log(response);

            jQuery(".posts", this).empty();

            if (response.data.length == 0) { // no drafts
                jQuery.broadcast("drafts:hasnot");
                return false;
            } else {
                jQuery.broadcast("drafts:has");
            }

            Handlebars.loadTemplate('//facebook-post-example/_views/post-entry.html')
                .then(function(hbTemplate) {

                    // loop through posts
                    for(i = 0; i < response.data.length; i++) {
                        // loop through insights
                        views = null;
                        if (response.data[i].insights !== undefined) {
                            for(j = 0; j < response.data[i].insights.data.length; j++) {
                                if (response.data[i].insights.data[j].name == "post_impressions_unique") {
                                    views = String(response.data[i].insights.data[j].values[0].value);
                                    break;
                                }
                            }
                        }

                        var data = jQuery.extend({}, response.data[i], {views: views, is_draft: true});

                        jQuery("#posts_drafts .posts").append(hbTemplate(data)).hide().fadeIn(300);

                                
                    }       
                })
                .catch(function() {
                    // error
                });

            // set prev/next
            jQuery(".prev", this).attr("data-fb-cursor", response.paging.previous);
            jQuery(".next", this).attr("data-fb-cursor", response.paging.next);

            var thisTarget = this;
            // show/hide
            FB.hasNextPrev(response.paging.previous, function(hasMore) {
                if (hasMore) {
                    jQuery(".prev", thisTarget).show();
                } else {
                    jQuery(".prev", thisTarget).hide();
                }
            });
            FB.hasNextPrev(response.paging.next, function(hasMore) {
                if (hasMore) {
                    jQuery(".next", thisTarget).show();
                } else {
                    jQuery(".next", thisTarget).hide();
                }
            });

            return false;

        })

        /*
         * Drafts have been loaded.
         * Show right col
         * @var jQuery.Event evt - Event object
         */
        .on("drafts:has", function(evt) {
            jQuery(this).parent().show();
            return false;
        })

        /*
         * Drafts have been loaded, but none to display
         * Hide right col
         * @var jQuery.Event evt - Event object
         */
        .on("drafts:hasnot", function(evt) {
            jQuery(this).parent().hide();
            return false;
        })
        ;

    
    
    /**
     * Post list inside either published posts or drafts
     */
    jQuery(".posts")

        /*
         * Click event for delete button
         * @var jQuery.Event evt - Event object
         * @broadcast post:delete
         */
        .on("click", "button.delete", function(evt) {
            console.log("delete post");

            jQuery(this).parents(".panel").find(".loading").show();
            jQuery.broadcast("post:delete", jQuery(this).closest(".panel").attr("data-fb-postid"));
            return false;
        })

        /*
         * A post has been deleted or published (hence delete from drafts)
         * @todo
         */
        .on("post:deleted post:published", function(evt, postID) {
            console.log(jQuery(this));
            console.log(jQuery(".panel", this).length);

            if ((jQuery(".panel", this).length == 0) && jQuery(this).is(":visible")) { // no more posts in column
                if (jQuery(this).prev().children(".prev").is(":visible")) {
                    jQuery(this).prev().children(".prev").click();

                } else if(jQuery(this).next().children(".next").is(":visible")) {
                    jQuery(this).next().children(".next").click();

                } else {
                    if (jQuery(this).parent().prop("id") == "posts_drafts") {
                        jQuery.broadcast("drafts:hasnot");
                    }
                }
            }

        })

        /*
         * Click event for publish button in a draft
         * @var jQuery.Event evt - Event object
         * @var object response - Response from API call with list of drafts
         * @broadcast post:publish
         */
        .on("click", "button.publish", function(evt, response) {
            console.log("publish post");
            console.log(jQuery(this).closest(".panel").attr("data-fb-postid"));

            jQuery(this).parents(".panel").find(".loading").show();

            jQuery.broadcast("post:publish", jQuery(this).closest(".panel").attr("data-fb-postid"));
            return false;
        })
        ;


    /**
     * prev/next buttons for published posts
     */
    jQuery("#posts_published .prev, #posts_published .next")

        /**
         * Click event for post paging
         * @var jQuery.Event evt - Event object
         * @broadcast posts:paging
         */
        .on("click", function(evt) {
            jQuery.broadcast("posts:paging", jQuery(this).attr("data-fb-cursor"));
            return false;
        })

        ;


    /**
     * prev/next buttons for drafts 
     */
    jQuery("#posts_drafts .prev, #posts_drafts .next")

        /**
         * Click event for post paging
         * @var jQuery.Event evt - Event object
         * @broadcast posts:paging
         */
        .on("click", function(evt) {
            jQuery.broadcast("drafts:paging", jQuery(this).attr("data-fb-cursor"));
            return false;
        })

        ;


   /**
     * Add post button
     */
    jQuery("#post_add")

        /**
         * Click event for bringing up add post modal
         * @broadcast modal:show
         */
        .on("click", function(evt) {
            jQuery.broadcast("modal:show", {});
            return false;
        });

    /**
     * Add post modal
     */
    jQuery(".modal-overlay")

        /**
         * Show modal
         * @var jQuery.Event evt - Event object
         * @broadcast 
         */
        .on("modal:show", function(evt) {
            jQuery(this).fadeIn(300);
            jQuery.broadcast("modal:reset");

            return false;
        })

        /**
         * Hide modal
         * @var jQuery.Event evt - Event object
         */
        .on("modal:hide posts:loaded", function(evt) {
            jQuery(this).fadeOut(300);
            return false;
        })

        /**
         * Reset form
         * @var jQuery.Event evt - Event object
         */
        .on("modal:reset", function(evt) {
            console.log(jQuery(this));

            jQuery("input, textarea", this).val("");
            jQuery("button", this).prop("disabled", false);
            jQuery("input[name=\"type\"]", this).prop("value", "status");

            jQuery("button[for]").removeClass("btn-primary");
            jQuery("button[for=\"status\"]").addClass("btn-primary");
            jQuery("div[fb-form-type]", this).hide();
            jQuery("div[fb-form-type=\"status\"]", this).show();
            return false;
        })



        /**
         * Click event for status, link, etc types
         * Toggles form fields
         */
        .on("click", "button[for]", function(evt) {
            console.log(jQuery(this));

            jQuery(this).siblings().removeClass("btn-primary");
            jQuery(this).addClass("btn-primary");

            jQuery(".modal-overlay div[fb-form-type]").hide();
            jQuery(".modal-overlay div[fb-form-type=\"" + jQuery(this).attr("for") + "\"]").show();

            jQuery(".modal-overlay input[name=\"type\"]").prop("value", jQuery(this).attr("for"));


            /*
            jQuery(".panel-heading .status", this).removeClass("btn-default");
            jQuery(".panel-heading .status", this).removeClass("btn-primary");
            */
            return false;
        })


       

        /**
         * Click event for submit button
         * @var jQuery.Event evt - Event object
         * @broadcast post:add
         */
        .on("click", ".submit", function(evt) {
            // console.log(jQuery(this));

            jQuery(".modal-overlay .operation button").prop("disabled", true);

            var postObj = {};
            jQuery("[fb-form-type]:visible input, [fb-form-type]:visible textarea, input[name=\"type\"]").each(function() {
                postObj[jQuery(this).attr("name")] = (jQuery(this).attr("name") == "source") ? jQuery(this) : jQuery(this).val();
            });

            jQuery.broadcast("post:add", postObj);

            return false;
        })

        /**
         * Click event for save draft button
         * @var jQuery.Event evt - Event object
         * @broadcast draft:add
         */
        .on("click", ".save", function(evt) {
            jQuery(".modal-overlay .operation button").prop("disabled", true);

            var postObj = {};
            jQuery("[fb-form-type]:visible input, [fb-form-type]:visible textarea, input[name=\"type\"]").each(function() {
                postObj[jQuery(this).attr("name")] = (jQuery(this).attr("name") == "source") ? jQuery(this) : jQuery(this).val();
            });

            console.log(postObj);

            jQuery.broadcast("draft:add", postObj);

            return false;
        })

        /**
         * Click event for cancel button
         * @var jQuery.Event evt - Event object
         * @broadcast modal:hide
         */
        .on("click", ".cancel", function(evt) {
            jQuery.broadcast("modal:hide", {});
            return false;
        })


        ;

    /**
     * Loading indicators
     */
    jQuery(".loading")

        .on("post:add draft:add posts:load drafts:load", function(evt) {
            jQuery(this).show();
        })

        .on("posts:loaded drafts:loaded post:deleted draft:deleted modal:reset ", function(evt) {
            jQuery(this).hide();
        })
    ;


});
