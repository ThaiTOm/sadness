const NodeCache = require("node-cache");
const nodeCache = new NodeCache()
var cache = require('memory-cache');
var newCache = new cache.Cache();
module.exports = { nodeCache, newCache }