const NodeCache = require("node-cache");
const nodeCache = new NodeCache();

var cache = require('memory-cache');
var newCache = new cache.Cache();

// newCache save post like
// cacheNode save comment like, Notifications

module.exports = { nodeCache, newCache }