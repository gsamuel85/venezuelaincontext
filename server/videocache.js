/**
 * Created by Guy on 22/5.
 */
'use strict';

var Video = require('../models/video');
var path = require('path');
var fs = require('fs');
var async = require('async');

var videoCache = function() {
    var VIDEO_FILENAME = path.join(__dirname, '../public/videos.json');

    /**
     * Load video data from server and save to local JSON file
     * @param callback - return (err, [String written to file])
     */
    var refreshVideoData = function refreshVideoData(callback) {
        Video.find({}, function(err,videos) {
            if (err) { return callback(err); }
            else {
                var toWrite = JSON.stringify(videos);
                fs.writeFile(VIDEO_FILENAME, toWrite, function(err) {
                    callback(err, toWrite);
                });
            }
        });
    };

    /**
     * Return data for stored videos
     * If the local JSON file doesn't exist, load the data from the server
     * @param callback - return (err, [Array of videos])
     */
    var loadVideosData = function loadVideosData(callback) {
        async.waterfall([
            function exists(cb) {
                fs.exists(VIDEO_FILENAME, function(exists) {
                    cb(null, exists);
                });
            },
            function checkExists(exists, cb) {
                var data = [];
                if (exists) {
                    // Read the file
                    fs.readFile(VIDEO_FILENAME, cb);
                } else {
                    // Load the data from the server
                    refreshVideoData(cb);
                }
            }
        ], function(err, data) {
            if (err) { return callback(err); }
            callback(err, JSON.parse(data.toString()));
        });
    };


    /**
     * Return data for one video
     * @param id
     * @param callback - return (err, video)
     */
    var loadOneVideo = function loadOneVideo(id, callback) {
        loadVideosData(function(err, videos) {
            var found = videos.filter(function(video) {
                return (id === video._id.toString());
            });

            if (found.length === 0) { return callback(true); }
            return callback(null, found[0]);
        });
    };


    return {
        getVideo: function getVideo(id, callback) { loadOneVideo(id, callback); },
        getAllVideos: function getAllVideos(callback) {
            loadVideosData(callback);
        },
        refresh: function refresh() {
            refreshVideoData(function(err, videos) {
                console.log("Updated videos form server");
            });
        }
    };
};

module.exports = videoCache;