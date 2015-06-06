/**
 * Created by lj on 15-6-5.
 */

var RandomUtil = AV.Object.extend("RandomUtil", {
    randomAscii: function(min, max) {
        var c = max - min + 1;
        return String.fromCharCode(Math.floor(Math.random() * c + min));
    }
});


exports.RandomUtil = new RandomUtil();