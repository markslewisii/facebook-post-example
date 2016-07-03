jQuery(document).ready(
function() {




    /* UI widgets */
    // profile dropdown
    jQuery('#profilesBtn').dropdown();

    // date range slider
    /*
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    jQuery("#date_slider").dateRangeSlider({
        bounds: {min: new Date(2012, 0, 1), max: new Date(2012, 11, 31, 12, 59, 59)},
        defaultValues: {min: 0, max: 0},
        scales: [{
            first: function(value){ return value; },
            end: function(value) {return value; },
            next: function(value){
                var next = new Date(value);
                return new Date(next.setMonth(value.getMonth() + 1));
            },
            label: function(value){
                return months[value.getMonth()];
            },
            format: function(tickContainer, tickStart, tickEnd){
                tickContainer.addClass("sliderTick");
            }
        }]
    });
    */


    /* turn off form submission */

    /**
     * Hidden div for data loading and display
     */
    jQuery("#api")
        .on("fb:login", function(evt) {

            // load profile menu entry template
            Handlebars.loadTemplate('/_views/profile-entry.hbs')
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

        .on("fb:logout", function(evt) {
            FB.logout();
            return false;
        })

        .on("profile:load", function(evt, data) {
            console.log("profile:load");
            console.log(data);
            // set jumbotron


            Handlebars.loadTemplate('/_views/profile-jumbo.hbs')
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
            FB.getPosts(data.id, {is_published: true}, function(response) {
                if (!response || response.error) {
                    // error
                } else {

                    jQuery.broadcast("posts:load", response);
                }
            });


            // load drafts
            if (FB.isMe(data.id)) {
                jQuery.broadcast("drafts:hasnot");
            } else {
                FB.getPosts(data.id, {is_published: false}, function(response) {
                    if (!response || response.error) {
                        // error
                    } else {
                        console.log("drafts:load");
                        console.log(response);

                            jQuery.broadcast("drafts:load", response);

                    }
                });
            }


            // load drafts
            return false;
        })

        .on("posts:paging", function(evt, cursorLink) {

            FB.nextPrev(cursorLink, function(response) {
                if (!response || response.error) {
                    // error
                } else {
                    if (response.data.length > 0) {
                        jQuery.broadcast("posts:load", response);
                    } else {
                        jQuery.broadcast("posts:nomore", response);
                    }
                }
            });         
            return false;

        })
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
                            jQuery.broadcast("posts:load", response);
                            jQuery.broadcast("modal:hide", response);
                        }
                    });
                }
            });
            return false;
        })

        /* add draft */
        .on("draft:add", function(evt, data) {
            console.log("adding draft");
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
                            jQuery.broadcast("drafts:load", response);
                            jQuery.broadcast("modal:hide", response);
                        }
                    });
                }
            });
            return false;
        })

        /* update post */
        .on("post:update", function(evt, data) {
            postID = data.postID;
            data.postID = null;
            FB.updatePost(FB.getCurrentPageID(), postID, function(response) {
            });
        })

        /* delete post */
        .on("post:delete", function(evt, postID) {
            console.log("post:delete");
            console.log(postID);

            FB.deletePost(FB.getCurrentPageID(), postID, function(response) {
                if (response.success == true) {
                    console.log("fadeOut:" + postID);
                    jQuery(".posts div[data-fb-postid=\"" + postID + "\"]").fadeOut(300);
                    jQuery.broadcast("post:deleted", postID);
                }
            });
        })

        /* pubblish post */
        .on("post:publish", function(evt, postID) {
            console.log("post:publish");
            console.log(postID);

            FB.updatePost(FB.getCurrentPageID(), postID, {is_published: true}, function(response) {
                // console.log(response);
                if (response.success == true) {
                    console.log("fadeout:" + postID);
                    jQuery(".posts div[data-fb-postid=\"" + postID + "\"]").fadeOut(300);
                    jQuery.broadcast("post:published", postID);
                }
            });

        })

        .on("post:published", function (evt, postID) {

            FB.getPosts(FB.getCurrentPageID(), {is_published: true}, function(response) {
                if (!response || response.error) {
                    // error
                } else {
                    jQuery.broadcast("posts:load", response);
                }
            });
        })

        ;


    /* login/logout buttons */
    jQuery('#fbLogin')
        .on("fb:login", function() {
            jQuery(this).hide();
            return false;
        })
        .on("fb:logout", document, function() {
            jQuery(this).show();
            return false;
        })
        .on('click', function() {
            FB.login(function() {}, {scope: "user_posts,manage_pages,read_insights,publish_actions,publish_pages"});
            return false;
        });

    jQuery('#fbLogout')
        .on("fb:login",function() {
            jQuery(this).show();
            return false;
        })
        .on("fb:logout",function() {
            jQuery(this).hide();
            return false;
        })
        .on('click', function() {
            jQuery.broadcast("fb:logout");
            return false;
        });

    /* dropdown */
    jQuery("#profilesBtn")
        .on("fb:login",function() {
            jQuery(this).show();
            return false;
        })
        .on("fb:logout",function() {
            jQuery(this).hide();
            jQuery("[aria-labelledby=\"profilesBtn\"] li[role!=\"separator\"]").remove();
            return false;
        });

    /* dropdown event when selecting profile */
    jQuery("[aria-labelledby=\"profilesBtn\"]")
        .on("click", "li a", function() {
            jQuery.broadcast("profile:load", {id: jQuery(this).attr("data-fb-pageid"), name: jQuery(".name", this).text()});
            jQuery(this).parent().collapse('hide');
            // return false;
        });

    /* loading posts */
    jQuery("#posts_published")
        .on("posts:load", function(evt, response) {
            console.log("#posts_published->posts:load");
            console.log(response);
            jQuery("#posts_published .posts").empty();

            // display posts
            Handlebars.loadTemplate('/_views/post-entry.hbs')
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

                        jQuery("#posts_published .posts").append(hbTemplate({
                                                            id: response.data[i].id,
                                                            date: response.data[i].created_time,
                                                            message: response.data[i].message,
                                                            link: response.data[i].link,
                                                            story: response.data[i].story,
                                                            type: response.data[i].type,
                                                            views: views
                                                        }));
                                
                    }       
                })
                .catch(function() {
                    // error
                });

            // set prev/next
            jQuery("#posts_published .prev").attr("data-fb-cursor", response.paging.previous);
            jQuery("#posts_published .next").attr("data-fb-cursor", response.paging.next);
            return false;
        })
        .on("post:load", function(evt, response) {
            console.log("post:load");
            console.log(response);
            return false;
        })
        .on("post:published", function(evt, response) {
        })
        .on("drafts:has", function(evt, response) {
            jQuery(this).parent().removeClass("col-md-12").addClass("col-md-6");
        })
        .on("drafts:hasnot", function(evt, response) {
            jQuery(this).parent().removeClass("col-md-6").addClass("col-md-12");
        })
        ;

    /* loading drafts */
    jQuery("#posts_drafts")

        .on("drafts:load", function(evt, response) {
            // console.log("#posts_drafts->drafts:load");
            // console.log(response);

            jQuery(".posts", this).empty();

            if (response.data.length == 0) { // no drafts
                jQuery.broadcast("drafts:hasnot");
                return false;
            } else {
                jQuery.broadcast("drafts:has");
            }

            Handlebars.loadTemplate('/_views/post-entry.hbs')
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

                        jQuery("#posts_drafts .posts").append(hbTemplate({
                                                            id: response.data[i].id,
                                                            date: response.data[i].created_time,
                                                            message: response.data[i].message,
                                                            link: response.data[i].link,
                                                            story: response.data[i].story,
                                                            views: views,
                                                            type: response.data[i].type,
                                                            is_draft: true
                                                        }));
                                
                    }       
                })
                .catch(function() {
                    // error
                });

            // set prev/next
            jQuery(".prev", this).attr("data-fb-cursor", response.paging.previous);
            jQuery(".next", this).attr("data-fb-cursor", response.paging.next);
            return false;

        })
        .on("drafts:has", function(evt, response) {
            jQuery(this).parent().show();
            return false;
        })
        .on("drafts:hasnot", function(evt, response) {
            jQuery(this).parent().hide();
            return false;
        })
        ;



    
    
    jQuery(".posts")
        /* delete post */
        .on("click", "button.delete", function(evt, response) {
            console.log("delete post");
            console.log(jQuery(this).closest(".panel").attr("data-fb-postid"));

            jQuery.broadcast("post:delete", jQuery(this).closest(".panel").attr("data-fb-postid"));
        })

        /* remove post after deletion */
        .on("post:deleted", function(evt, postID) {
            console.log("post:deleted");
            console.log(postID);

            FB.deletePost(postID, function(response) {
                if (response.success == true) jQuery.broadcast("post:deleted", postID);
            });
        })

        /* publish post */
        .on("click", "button.publish", function(evt, response) {
            console.log("publish post");
            console.log(jQuery(this).closest(".panel").attr("data-fb-postid"));

            jQuery.broadcast("post:publish", jQuery(this).closest(".panel").attr("data-fb-postid"));
        })
        ;


    /* paging buttons */
    jQuery(".prev,.next")
        .on("click", function() {
            console.log("prevnext");
            jQuery.broadcast("posts:paging", jQuery(this).attr("data-fb-cursor"));
            return false;
        });


    /* add post */
    jQuery("#post_add")
        .on("click", function(evt) {
            jQuery.broadcast("modal:show", {});
            return false;
        });

    /* post add modal */
    jQuery(".modal-overlay")
        .on("modal:show", function(evt) {
            jQuery(this).fadeIn(300);
            return false;
        })
        .on("modal:hide posts:load", function(evt) {
            jQuery(this).fadeOut(300);
            return false;
        })
        .on("click", ".submit", function(evt) {
            // console.log(jQuery(this));
            jQuery.broadcast("post:add", {
                message: jQuery(".modal-overlay textarea[name=\"message\"]").val()
            });
            return false;
        })
        .on("click", ".save", function(evt) {
            // console.log(jQuery(this));
            jQuery.broadcast("draft:add", {
                message: jQuery(".modal-overlay textarea[name=\"message\"]").val()
            });
            return false;
        })
        .on("click", ".cancel", function(evt) {
            jQuery.broadcast("modal:hide", {});
            return false;
        });
});