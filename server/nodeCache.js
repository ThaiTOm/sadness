const NodeCache = require("node-cache");
const nodeCache = new NodeCache();

var cache = require('memory-cache');
var newCache = new cache.Cache();

const memcachePlus = require("memcache-plus")
const cm = new memcachePlus()
// memcache save session data to generate name of user, user online, offline
// newCache save post like
// cacheNode save comment like, Notifications

module.exports = { nodeCache, newCache, cm }