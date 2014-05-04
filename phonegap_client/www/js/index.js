/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // using my app id and secret as the app access token
        var ACCESS_TOKEN="put_access_token_here";
        var storyTemplate = _.template(document.getElementById("story_template").innerHTML.trim());
        function getGraph(url, data, success) {
            url = "https://graph.facebook.com/v2.0" + url;
            data = _.extend({"access_token" : ACCESS_TOKEN}, data);
            return $.getJSON(url, data, success);
        }

        getGraph("/Cardinals/feed").success(function(data, textStatus, jqXHR) {
            var div = document.createElement("div");
            _.each(data.data, function(story) {
                $(div).append(storyTemplate({"story":story}));
            })
            $("body").append(div);
        });
    }
};