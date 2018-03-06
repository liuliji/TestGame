cc.Class({
    extends: cc.Component,

    properties: {
        label:cc.Label,
    },

    // use this for initialization
    onLoad: function () {

    },
    setLabelString:function (string) {
        this.label.string=string;
    },
    setLabelColor:function (color) {
        this.label.node.setColor(color);
    },
    setLabelFontSize:function (fontSize) {
        this.label.fontSize=fontSize;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
