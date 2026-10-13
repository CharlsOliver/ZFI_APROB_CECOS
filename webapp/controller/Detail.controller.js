sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "aprobacioncecos/model/formatter",
    'sap/m/MessageToast',
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (Controller, formatter, MessageToast, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("aprobacioncecos.controller.Detail", {

        formatter: formatter,

        onInit: function () {
            this.initizializarCampos();
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);

            if (sap.ushell && sap.ushell.Container) {
                this.oUser = sap.ushell.Container.getUser();
                this.sUserId = this.oUser.getId();
            } else {
                this.sUserId = "HFigueiras";
            }
            console.log("Usuario Fiori:", this.sUserId);
        },

        _onObjectMatched: function (oEvent) {
            var sCentroId = oEvent.getParameter("arguments").centro;
            this.onResetFields();

            if (!sCentroId) {
                return;
            }

            this.getView().bindElement({
                path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").centro),
                model: "Solicitudes"
            });

            this.Solicitud = this.getView().getBindingContext('Solicitudes').getObject();
            if (!this.Solicitud) {
                this.Solicitud = undefined
                this.mCentro.setData([])
                this.oRouter.navTo("RouteEmpty", {}, true);
            } else {
                this.onShowColumns(this.Solicitud["Id_proc"]);
                this.onLoadDetail();
                if (this.Solicitud["Id_proc"] === "0001") {
                    this.mCentro.setData(this.Solicitud["Headceco_nav"]["results"])
                } else if (this.Solicitud["Id_proc"] === "0002") {
                    this.mCentro.setData(this.Solicitud["Headcebe_nav"]["results"])
                } else if (this.Solicitud["Id_proc"] === "0003") {
                    this.mCentro.setData(this.Solicitud["Headceges_nav"]["results"])
                }
            }
        },

        initizializarCampos: function () {
            this.txtCentroCosto = "Centros de Costo";
            this.txtCentroBeneficio = "Centro de Beneficio";
            this.txtCentroGestor = "Centro Gestor";

            this.tableTitle = this.getView().byId("tableTitle");
            this.txtColIdCeco = this.getView().byId("txtColIdCeco");
            this.txtIdCecoDir = this.getView().byId("txtIdCecoDir");
            this.txtIdCecoCtrl = this.getView().byId("txtIdCecoCtrl");
            this.colIdCeco = this.getView().byId("colIdCeco");
            this.colDescripcion = this.getView().byId("colDescripcion");
            this.colUsuario = this.getView().byId("colUsuario");
            this.colResponsable = this.getView().byId("colResponsable");
            this.colDepartamento = this.getView().byId("colDepartamento");
            this.colSociedad = this.getView().byId("colSociedad");
            this.colJerarquia = this.getView().byId("colJerarquia");
            this.colClase = this.getView().byId("colClase");
            this.colFuncional = this.getView().byId("colFuncional");
            this.colMoneda = this.getView().byId("colMoneda");
            this.colCebe = this.getView().byId("colCebe");
            this.itfControl = this.getView().byId("itfControl");

            this.tableTitle.setText(this.txtCentroCosto);
            this.txtColIdCeco.setText(this.txtCentroCosto);
            this.txtIdCecoDir.setText(this.txtCentroCosto);
            this.txtIdCecoCtrl.setText(this.txtCentroCosto);
            this.itfControl.setVisible(true);

            this.idIconTabBar = this.getView().byId("idIconTabBar");
            this.mCentro = this.getOwnerComponent().getModel("Centro");
            this.mDireccion = this.getOwnerComponent().getModel("Direccion");
            this.mBloqueo = this.getOwnerComponent().getModel("Bloqueo");
            this.mSolicitudes = this.getOwnerComponent().getModel("Solicitudes");

            this.ZSERV_CBG_APROV_SRV = this.getOwnerComponent().getModel("ZSERV_CBG_APROV_SRV");
            this.ZSERV_CBG_GETDATA_SRV = this.getOwnerComponent().getModel("ZSERV_CBG_GETDATA_SRV");
            this.ZSERV_CBG_GET_BLOQDIR_SRV = this.getOwnerComponent().getModel("ZSERV_CBG_GET_BLOQDIR_SRV");
        },

        onShowColumns: function (proceso) {
            // Mapeo de textos según proceso
            const textos = {
                "0001": this.txtCentroCosto,
                "0002": this.txtCentroBeneficio,
                "0003": this.txtCentroGestor
            };

            // Configuración de visibilidad por columna para cada proceso
            const columnasVisibilidad = {
                "0001": {
                    colDescripcion: true,
                    colUsuario: true,
                    colResponsable: true,
                    colDepartamento: true,
                    colSociedad: true,
                    colJerarquia: true,
                    colClase: true,
                    colFuncional: true,
                    colMoneda: true,
                    colCebe: true,
                    itfControl: true
                },
                "0002": {
                    colDescripcion: true,
                    colUsuario: true,
                    colResponsable: true,
                    colDepartamento: true,
                    colSociedad: false,
                    colJerarquia: true,
                    colClase: false,
                    colFuncional: false,
                    colMoneda: false,
                    colCebe: false,
                    itfControl: false
                },
                "0003": {
                    colDescripcion: true,
                    colUsuario: true,
                    colResponsable: true,
                    colDepartamento: false,
                    colSociedad: true,
                    colJerarquia: true,
                    colClase: false,
                    colFuncional: false,
                    colMoneda: false,
                    colCebe: false,
                    itfControl: false
                }
            };

            // Solo proceder si el proceso está definido
            if (!textos[proceso]) return;

            // Actualizar textos
            const texto = textos[proceso];
            this.tableTitle.setText(texto);
            this.txtColIdCeco.setText(texto);
            this.txtIdCecoDir.setText(texto);
            this.txtIdCecoCtrl.setText(texto);

            // Actualizar visibilidad columnas
            const visibilidad = columnasVisibilidad[proceso];
            for (const col in visibilidad) {
                this[col].setVisible(visibilidad[col]);
            }
        },

        onProcesarSolicitud: function (oEvent) {
            const that = this;
            const oView = this.getView();
            oView.setBusy(true);

            const sAprobada = oEvent.getSource().getCustomData()[0].getValue(); // "TRUE" | "FALSE"

            // Armado del body
            const buildBody = (aprobada, comentario) => ({
                User: that.sUserId,
                HeadIds_nav: [{
                    Id_proc: that.Solicitud.Id_proc,
                    Id_flow: that.Solicitud.Id_flow,
                    Id: that.Solicitud.Id,
                    Aprobada: aprobada,
                    Fecha: that.Solicitud.Fecha,
                    Nivaut: that.Solicitud.Nivaut,
                    ...(comentario ? { Comentario: comentario } : {})
                }]
            });

            // Llamada al servicio
            const send = (body, successText) => {
                that.ZSERV_CBG_APROV_SRV.create("/HeadSet", body, {
                    headers: { "Content-Type": "application/json;charset=utf-8" },
                    success: function (response) {
                        sap.m.MessageToast.show(successText);
                        oView.setBusy(false);
                        that.oRouter.navTo("RouteMaster", {}, true);
                    },
                    error: function (error) {
                        console.log(error);
                        sap.m.MessageToast.show("Ocurrió un error al procesar la solicitud.");
                        oView.setBusy(false);
                    }
                });
            };

            // Confirmación de aprobación (sin comentarios)
            if (sAprobada === "TRUE") {
                oView.setBusy(false);
                sap.m.MessageBox.confirm("¿Deseas aprobar la solicitud?", {
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                    onClose: function (action) {
                        if (action === sap.m.MessageBox.Action.OK) {
                            oView.setBusy(true);
                            const body = buildBody(sAprobada, null);
                            send(body, "Solicitud aprobada con éxito.");
                        }
                    }
                });
                return;
            }

            // Rechazo: pedir comentario obligatorio
            if (sAprobada === "FALSE") {
                oView.setBusy(false);

                const oDialog = new sap.m.Dialog({
                    title: "Motivo del rechazo",
                    type: "Message",
                    contentWidth: "25rem",
                    content: [
                        new sap.m.TextArea("idRechazoComentario", {
                            width: "100%",
                            rows: 6,
                            placeholder: "Escribe el motivo del rechazo...",
                            liveChange: function (oEvt) {
                                const val = oEvt.getParameter("value") || "";
                                oDialog.getBeginButton().setEnabled(val.trim().length > 0);
                            }
                        })
                    ],
                    beginButton: new sap.m.Button({
                        text: "Rechazar",
                        type: "Reject",
                        enabled: false,
                        press: function () {
                            const comentario = sap.ui.getCore().byId("idRechazoComentario").getValue().trim();
                            oDialog.close();
                            oView.setBusy(true);
                            const body = buildBody(sAprobada, comentario);
                            send(body, "Solicitud rechazada con éxito.");
                        }
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancelar",
                        press: function () { oDialog.close(); }
                    }),
                    afterClose: function () { oDialog.destroy(); }
                });

                oDialog.open();
                return;
            }

            // Fallback por si viniera otro valor:
            const body = buildBody(sAprobada, null);
            send(body, "Solicitud procesada con éxito.");
        },

        onResetFields: function () {
            this.mCentro.setData([]);
            this.mDireccion.setData([]);
            this.mBloqueo.setData([]);
            this.idIconTabBar.setSelectedKey("datos")
        },

        onLoadDetail: function(){
			const that = this;
            var aFilter = [];
            aFilter.push(new Filter("Id", FilterOperator.EQ, this.Solicitud["Id"]));

			this.ZSERV_CBG_GET_BLOQDIR_SRV.read("/InputSet", {
                filters: aFilter,
				urlParameters: {
					"$expand": "Bloqueo_nav,Dir_nav",
					"format": "json"
				},
				success: function (response) {
					if(response.results.length > 0){
                        const results = response.results.map(head => {
                            const normalize = (items) => {
                                return items.map(it => {
                                    const obj = { ...it };

                                    if (obj.Cbg_id) {
                                        obj.centro = obj.Cbg_id;
                                        delete obj.Cbg_id;
                                    }
                                    if (obj.Name4) {
                                        obj.colonia = obj.Name4;
                                        delete obj.Name4;
                                    }
                                    if (obj.Stras) {
                                        obj.calle = obj.Stras;
                                        delete obj.Stras;
                                    }
                                    if (obj.Ort01) {
                                        obj.poblacion = obj.Ort01;
                                        delete obj.Ort01;
                                    }
                                    if (obj.Pstlz) {
                                        obj.codigoPostal = obj.Pstlz;
                                        delete obj.Pstlz;
                                    }
                                    if (obj.Regio) {
                                        obj.region = obj.Regio;
                                        delete obj.Regio;
                                    }
                                    if (obj.Land) {
                                        obj.pais = obj.Land;
                                        delete obj.Land;
                                    }

                                    if (obj.Ibcrp) {
                                        obj.costesPrimariosReales = obj.Ibcrp;
                                        delete obj.Ibcrp;
                                    }
                                    if (obj.Ibpcp) {
                                        obj.costesPrimariosPlanificados = obj.Ibpcp;
                                        delete obj.Ibpcp;
                                    }
                                    if (obj.Ibcrs) {
                                        obj.costesSecundariosReales = obj.Ibcrs;
                                        delete obj.Ibcrs;
                                    }
                                    if (obj.Ibpcs) {
                                        obj.costesSecundariosPlanificados = obj.Ibpcs;
                                        delete obj.Ibpcs;
                                    }
                                    if (obj.Ibci) {
                                        obj.ingresosReales = obj.Ibci;
                                        delete obj.Ibci;
                                    }
                                    if (obj.Ibpi) {
                                        obj.ingresosPlanificados = obj.Ibpi;
                                        delete obj.Ibpi;
                                    }
                                    if (obj.Ibac) {
                                        obj.comprometido = obj.Ibac;
                                        delete obj.Ibac;
                                    }

                                    return obj;
                                });
                            };

                            if (head.Dir_nav?.results) {
                                head.Dir_nav.results = normalize(head.Dir_nav.results);
                            }
                            if (head.Bloqueo_nav?.results) {
                                head.Bloqueo_nav.results = normalize(head.Bloqueo_nav.results);
                            }

                            return head;
					    });

                        that.mDireccion.setData(results[0]["Dir_nav"]?.results);
                        that.mBloqueo.setData(results[0]["Bloqueo_nav"]?.results);
                    }
				},
				error: function (error) {
					console.log(error)
				}
			});
		},
    });
});
