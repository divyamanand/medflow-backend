"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashRefresh = hashRefresh;
const crypto_1 = require("crypto");
function hashRefresh(token) {
    return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
}
