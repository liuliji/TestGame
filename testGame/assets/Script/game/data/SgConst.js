window.g_CONST = null;

function SgConst() {
    this.MsgData=require('MsgData');
    this.StorageConst=require('StorageConst');
}

SgConst.getInstance = function () {
    if (!g_CONST)
        g_CONST = new SgConst();
    return g_CONST;
}
window.sgCONST = SgConst.getInstance();
window.sgc = window.sgCONST;