
var AV = require('leanengine');
var AclService = AV.Object.extend('AclService', {
    _staffAcl: null,
    _adminAcl: null,
    _staffWriteAcl: null,
    constructor: function(){
        var STAFF_ROLE = 'staff';
        var ADMIN_ROLE = 'admin'

        this._staffAcl = new AV.ACL();
        this._staffAcl.setRoleWriteAccess(STAFF_ROLE, true);
        this._staffAcl.setRoleReadAccess(STAFF_ROLE, true);

        this._adminAcl = new AV.ACL();
        this._adminAcl.setRoleWriteAccess(ADMIN_ROLE, true);
        this._adminAcl.setRoleReadAccess(ADMIN_ROLE, true);

        this._staffWriteAcl = new AV.ACL();
        this._staffWriteAcl.setRoleWriteAccess(STAFF_ROLE, true);
        this._staffWriteAcl.setPublicReadAccess(true);
    },
    staff: function(){
        return this._staffAcl;
    },
    admin: function(){
        return this._adminAcl;
    },
    staffWrite: function() {
        return this._staffWriteAcl;
    },
    selfStaffWrite: function(userId) {
        var acl = new AV.ACL();
        acl.setRoleWriteAccess('staff', true);
        acl.setPublicReadAccess(true);
        acl.setWriteAccess(userId, true);
        return acl;
    }
});


exports.service = new AclService();