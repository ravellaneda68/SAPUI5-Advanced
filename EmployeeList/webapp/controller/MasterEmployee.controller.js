//@ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
    */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        function onInit() {
            this._bus = sap.ui.getCore().getEventBus();
                     
        };

        function onFilter() {

            var oJSONCountries = this.getView().getModel("jsonCountries").getData();
            var filters = [];

            if (oJSONCountries.EmployeeId !== "") {
                filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
            }

            if (oJSONCountries.CountryKey !== "") {
                filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
            }

            var oList = this.getView().byId("tableEmployee");
            var oBinding = oList.getBinding("items");
            oBinding.filter(filters);
        };

        function onClearFilter() {
            var oModel = this.getView().getModel("jsonCountries");
            oModel.setProperty("/EmployeeId", "");
            oModel.setProperty("/CountryKey", "");

        };

        function showPostalCode(oEvent) {
            var itemPressed = oEvent.getSource();
            var oContext = itemPressed.getBindingContext("jsonEmployees");
            var objectContext = oContext.getObject();
            var msg = 'Codigo Postal:';

            sap.m.MessageToast.show(msg, {
                duration: 3000,
                width: "8rem"
            });

            sap.m.MessageToast.show(objectContext.PostalCode, {
                duration: 3000,
                width: "6rem",
                my: "center center"
            });
        }

        function onShowCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", true);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", true);
        };

        function onHideCity() {
            var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
            oJSONModelConfig.setProperty("/visibleCity", false);
            oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
            oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
        };

        function showOrders(oEvent) {

            // Get Selected Controller
            var iconPressed = oEvent.getSource();

            // Get Context from Model
            var oContext = iconPressed.getBindingContext("odataNorthwind.svc");

            if (!this._oDialogOrders) {
                this._oDialogOrders = sap.ui.xmlfragment("logaligroup.EmployeeList.fragment.DialogOrders", this);
                this.getView().addDependent(this._oDialogOrders);
            };

            // Dialog Binding to the context to have access to data of selected item
            this._oDialogOrders.bindElement("odataNorthwind.svc>" + oContext.getPath());
            this._oDialogOrders.open();
        };

        function onCloseOrders() {
            this._oDialogOrders.close();

        };

        function showEmployee(oEvent) {
            var path = oEvent.getSource().getBindingContext("odataNorthwind.svc").getPath();
            this._bus.publish("flexible", "showEmployee", path);
        }

        var Main = Controller.extend("logaligroup.EmployeeList.controller.MasterEmployee", {});

        Main.prototype.onValidate = function () {
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                // inputEmployee.setDescription("OK");
                this.getView().byId("labelCountry").setVisible(true);
                this.getView().byId("slCountry").setVisible(true);
            } else {
                //  inputEmployee.setDescription("NOT OK");
                this.getView().byId("labelCountry").setVisible(false);
                this.getView().byId("slCountry").setVisible(false);
            }
        };
        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onClearFilter = onClearFilter;
        Main.prototype.showPostalCode = showPostalCode;
        Main.prototype.onShowCity = onShowCity;
        Main.prototype.onHideCity = onHideCity;
        Main.prototype.showOrders = showOrders;
        Main.prototype.onCloseOrders = onCloseOrders;
        Main.prototype.showEmployee = showEmployee;
        return Main;
    });
