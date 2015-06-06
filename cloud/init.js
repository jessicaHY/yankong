/**
 * Created by joan on 2015/6/30.
 */

var AclService = require('cloud/service/AclService').service;

AV.Cloud.define("roleInit", function(req, res) {

    var user = new AV.User();
    var userId = "";
    user.setUsername("admin@yankong.com");
    user.setPassword("111111");
    user.setEmail("admin@yankong.com");
    user.set("nickName", "admin");
    user.set("sign", "I am admin");
    user.set("status", 0);
    user.set("gendar", 0);
    user.set("extra", "111111");

    user.signUp(null, {
        success:function(u) {
            userId = u.id;

//            u.setACL(AclService.selfStaffWrite(userId));
//            u.save();

            var adminAcl = new AV.ACL();
            adminAcl.setWriteAccess(userId, true);
            adminAcl.setReadAccess(userId, true);

            var admin = new AV.Role("admin", adminAcl);

            var staffAcl = new AV.ACL();
            staffAcl.setRoleReadAccess(admin, true);
            staffAcl.setRoleWriteAccess(admin, true);
            var staff = new AV.Role("staff", staffAcl);

            var siteAcl = new AV.ACL();
            siteAcl.setRoleReadAccess(staff, true);
            siteAcl.setRoleWriteAccess(staff, true);
            var site = new AV.Role("site", siteAcl);

            admin.getUsers().add(u);
            staff.save();
            site.save();
            admin.save().then(function(obj) {
                staff.getRoles().add(obj); //角色继承
                staff.save();
            });
            res.success("success");
        },
        error:function(u, err) {
            res.error(err.message);
        }
    });

})