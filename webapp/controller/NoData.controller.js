sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("aprobacioncecos.controller.NoData", {
        onInit: function () { 
             this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
             this.oRouter.navTo("RouteMaster", {}, true);
        },
    });
});
