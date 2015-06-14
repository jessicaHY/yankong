/**
 * Created by joan on 2014/5/8.
 */


var AV = require('leanengine');
var QueryService    = require('./QueryService').service;
var UserService     = require('./UserService').service;
var result          = require('../utils/resultJson').result;
var AclService      = require('./AclService').service;
var _               = require('underscore');

var CrabTreeNode = AV.Object.extend("CrabTreeNode", {
    nodeName: null,
    childList: null,
    constructor: function(nodeName) {
        this.nodeName = nodeName;
        this.childList = [];
    },
    isLeaf: function() {
        return this.nodeName == null;
    },
    hasLeaf: function() {
        var flag = false;
        this.childList.forEach(function(value) {
                if(value.isLeaf()) {
                    flag = true;
                    return false;
                }
           })
        return flag;
    },
    delLeaf: function() {
       for( var i = 0; i < this.childList.size(); i++) {
            var node = this.childList[i];
           if(node.isLeaf()) {
               this.childList.splice(i, 1);
               return;
           }
        }
    },
    addChildNode : function(treeNode) {
        this.childList.push(treeNode);
    },

    findTreeNode: function(name) {/* 找到一颗树中某个节点 */
        var node = this;
        for(var i = name.length; i >= 0; i --) {
            var word = "" + name.charAt(i);
            node = this._findNode(node, word);
        }
        return node;
    },

    _findNode: function(node, word) {
        if(node.nodeName == word) {
            return node;
        }
        if (node.childList.isEmpty) {
            return null;
        } else {
            for(var i = 0; i < node.childList.length; i++) {
                var child = node.childList[i];
                var resultNode = child.findTreeNode(word);
                if(resultNode)
                    return resultNode;
            }
        }
        return null;
    }
});

var CrabTreeHandler = AV.Object.extend("CrabTreeHandler", {}, {
    cmap : {
    },

    addCrabTree: function(name) {
        var last = name.charAt(name.length - 1);
        var nowNode = this.cmap[last];
        if(!nowNode) {
            nowNode = new CrabTreeNode(last);
            this.cmap[last] = nowNode;
        }
        for(var i = name.length - 2; i>=0; i--) {
            var word = name.charAt(i);
            var wordNode = this._getNode(nowNode, word);
            if(! wordNode) {
                wordNode = new CrabTreeNode(word);
                nowNode.childList.push(wordNode);
            }
            nowNode = wordNode;
        }
        if(!nowNode.hasLeaf()) {
            nowNode.childList.push(new CrabTreeNode(null));//添加终结点
        }
    },
    delCrabTree: function(name) {
        var last = name.charAt(name.length - 1);//用最后一个字来查
        var nowNode = this.cmap[last];
        if(nowNode == null)
            return;

        if(name == last && nowNode.hasLeaf()) {//该关键词只有一个字
            nowNode.delLeaf(null);
            if(nowNode.childList.length == 0) {
                delete this.cmap.last;
            }
            return;
        }
        for(var i = name.length - 2; i>=0; i--) {
            var word = name.charAt(i);
            var wordNode = this._getNode(nowNode, word);
            if(!wordNode) {
                return;
            }
            if(i == 0 && wordNode.hasLeaf()) {//到了词的第一个字，并且多叉树有树叶
                wordNode.delLeaf(null);
                if(wordNode.childList.length == 0) {
                    nowNode.delLeaf(word);
                }
                return;
            }
            if(wordNode.childList.length == 1) {//关键词有多个字，但是子节点只有一个
                nowNode.delLeaf(word);
                return;
            }
            nowNode = wordNode;
        }
    },
    _getNode : function(nowNode, word) {
        nowNode.childList.forEach(function(node) {
            if(!node.isLeaf() && node.nodeName == word ) {
                return node;
            }
        })
        return null;
    },
    filterCrabWords: function(content) {
        if(this.isEmptyCrabMap()) {
            CrabService.reloadAll();
        }

        var crabList = this.getCrabList(content);
        if(!crabList || crabList.length == 0) {
            return content;
        }
        var map = {};
        crabList.forEach(function(value) {
            map[value] = value;
        })
        map.forEach(function(value, key) {
            content = content.replaceAll(filter(key), "[crab]" + key + "[/crab]");
        })
        return content;
    },
    filterKey: function(key) {
        return key.replaceAll(/\*/, /\\*/).replaceAll(/\?/, /\\?/).replaceAll(/\+/, /\\+/);
    },
    getCrabList : function(content) {
        if(!content || content == ''){
            return [];
        }
        var crabList = [];
        for(var i = content.length - 1; i>=0;) {
            if(this.isCrab(content.charAt(i))) {
                var len = this.checkKeyWords(content, i);
                if(len > 0) {
                    crabList.push(content.substring(i - len + 1 < 0 ? 0 : i- len + 1, i + 1));
                    i -= len;
                }
                i--;
            } else {
                i--;
            }
        }
        return crabList;
    },
    isCrab: function(word) {
      return this.cmap[word];
    },
    checkKeyWords : function(content, begin) {
        var res = 0;
        var nowNode = this.cmap[content.charAt(begin)];
        if(!nowNode) {
            return res;
        }
        if(nowNode.isLeaf() || nowNode.hasLeaf()) {//是终节点或者有终节点
            return 1;
        }
        var have = false;
        for(var i = begin - 1; i >= 0; i--) {
            have = false;
            for(var j = 0; j < nowNode.childList.length; j++) {
                var node = nowNode.childList[j];
                if(node.nodeName == content.charAt(i)) {
                    have = true;
                    nowNode = node;
                    res ++;
                    if(node.hasLeaf() || node.isLeaf()) {//是终节点或者有终节点
                        return res + 1;
                    }
                    break;
                }
            }
            if(!have) {
                break;
            }
        }
        return 0;
    },
    clearCrabMap: function() {
      this.cmap = {};
    },
    isEmptyCrabMap: function() {
        return _.isEmpty(this.cmap);
    }
});
var CrabService = AV.Object.extend("CrabService" , {
    constructor : function() {
        this.CrabModel = AV.Object.extend('Crab');
        this.reloadAll();
    },

    reloadAll: function() {
        console.log("reload all");
        if(CrabTreeHandler.isEmptyCrabMap()) {
            CrabTreeHandler.clearCrabMap();
            return new AV.Query(this.CrabModel).equalTo("status", OBJECTSTATUS.NORMAL).limit(1000).find().then(
                function(list) {
                    list.forEach(function(crab) {
                        if(crab.get("name") && crab.get("name") != '') {
                            CrabTreeHandler.addCrabTree(crab.get("name"));
                        }
                    })
                    return result.success();
                }, function(error) {
                    console.error( error );
                    return result.failServerFail();
                }
            )
        }
    },

    listCrab: function(page, count) {
        return QueryService.list( this.CrabModel, page, count, {
            status: OBJECTSTATUS.NORMAL
        });
    },
    addCrab: function(name) {
        var self = this;
        if(!name || name.length < 2) {
            return AV.Promise.error(result.failParamError());
        }

        return QueryService.add( this.CrabModel, {
            name: name,
            status: OBJECTSTATUS.NORMAL,
            ACL : AclService.staffWrite()
        }, {
            name: name
        }, true);
    },
    editCrab: function(objectId, name) {
        if(!name || name.length == 0) {
            return AV.Promise.error(result.failParamError());
        }

        return QueryService.update(this.CrabModel, objectId, {
            name: name,
            status: OBJECTSTATUS.NORMAL
        });
    },
    delCrab: function(objectId) {
        return QueryService.remove(this.CrabModel, objectId);
    },
    getCrab: function(key, value) {
        return QueryService.get(this.CrabModel, key, value);
    },
    _addCrab: function(name) {
        return QueryService.add( this.CrabModel, {
            name: name,
            status: OBJECTSTATUS.NORMAL,
            ACL : AclService.staffWrite()
        });
    }
});

var service = new CrabService();

//service.addCrab('长狗专卖\r').then(function( crab ){
//    console.log( crab )
//}, function( err ){
//    console.log( err )
//});

exports.service = service;
exports.CrabTreeHandler = CrabTreeHandler;