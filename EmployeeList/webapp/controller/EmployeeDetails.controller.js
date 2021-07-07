//@ts-nocheck

sap.ui.define([

    "sap/ui/core/mvc/Controller",
    "logaligroup/EmployeeList/model/formatter",
    "sap/m/MessageBox"

], function (Controller, formatter, MessageBox) {


    function onInit() {
        this._bus = sap.ui.getCore().getEventBus();

    };

    function onCreateIncidence() {

        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.EmployeeList.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var index = odata.length;
        odata.push({ index: index + 1, _ValidateDate: false, EnabledSave: false });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);
    };

    function onDeleteIncidence(oEvent) {

        var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();

        MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmDeleteIncidence"), {
                    onClose: function(oAction) {
                        if (oAction === "OK" ){
                            this._bus.publish("incidence", "onDeleteIncidence", {
                              IncidenceId: contextObj.IncidenceId,
                              SapId: contextObj.SapId,
                              EmployeeId: contextObj.EmployeeId
                        });
                    }
                }.bind(this)
              });
            };

    function onSaveIncidence(oEvent) {
        var incidence = oEvent.getSource().getParent().getParent();
        var incidenceRow = incidence.getBindingContext("incidenceModel");
        this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });
    };

    function updateIncidenceCreationDate(oEvent) {

        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();
        let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

        if (!oEvent.getSource().isValidValue()) {
            contextObj._ValidateDate = false;
            contextObj.CreationDateState = "Error";
            MessageBox.error(oResourceBundle.getText("errorCreationDateValue"), {
                title: "Error",
                onClose: null,
                styleClass: "",
                actions: MessageBox.Action.Close,
                emphasizeAction: null,
                initialFocus: null,
                textDirection: sap.ui.core.TextAlign.Inherit
            });
        } else {
            contextObj.CreationDateX = true;
            contextObj._ValidateDate = true;
            contextObj.CreationDateState = "None";
        };
            if (oEvent.getSource().isValidValue() && contextObj.Reason){
                contextObj.EnabledSave= true;
            } else {
                contextObj.EnabledSave= false;
            };
        context.getModel().refresh();
    };

    function updateIncidenceReason(oEvent) {

        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();

        if (oEvent.getSource().getValue()) {
            contextObj.ReasonX = true;
            contextObj.ReasonState = "None";
        } else {
            contextObj.ReasonState = "Error";
        };
            if (contextObj._ValidateDate && oEvent.getSource().getValue()) {
                contextObj.EnabledSave= true;
            } else {
                contextObj.EnabledSave= false;
            };

        context.getModel().refresh(); 
    };

    function updateIncidenceType(oEvent) {
        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();
    
        if (contextObj._ValidateDate && contextObj.Reason) {
                contextObj.EnabledSave= true;
            } else {
                contextObj.EnabledSave= false;
            };
            contextObj.TypeX = true;
            context.getModel().refresh(); 
    };

    var EmployeeDetails = Controller.extend("logaligroup.EmployeeList.controller.Main", {});

    EmployeeDetails.prototype.onInit = onInit;
    EmployeeDetails.prototype.onCreateIncidence = onCreateIncidence;
    EmployeeDetails.prototype.Formatter = formatter;
    EmployeeDetails.prototype.onDeleteIncidence = onDeleteIncidence;
    EmployeeDetails.prototype.onSaveIncidence = onSaveIncidence;
    EmployeeDetails.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
    EmployeeDetails.prototype.updateIncidenceReason = updateIncidenceReason;
    EmployeeDetails.prototype.updateIncidenceType = updateIncidenceType;
    return EmployeeDetails;
});


