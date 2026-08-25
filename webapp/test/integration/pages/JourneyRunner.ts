import JourneyRunner from "sap/fe/test/JourneyRunner";
import ListReport from "sap/fe/test/ListReport";
import ObjectPage from "sap/fe/test/ObjectPage";
import CustomLabelParameterListGenerated from "./LabelParameterList.gen";
import CustomLabelParameterObjectPageGenerated from "./LabelParameterObjectPage.gen";

const runner = new JourneyRunner({
    launchUrl: sap.ui.require.toUrl("zqm/zqmolabel") + "/test/flp.html#app-preview",
    pages: {
        onTheLabelParameterListGenerated: new ListReport(
            {
                appId: "zqm.zqmolabel",
                componentId: "LabelParameterList",
                entitySet: "",
                contextPath: "/LabelParameter"
            },
            CustomLabelParameterListGenerated
        ),
        onTheLabelParameterObjectPageGenerated: new ObjectPage(
            {
                appId: "zqm.zqmolabel",
                componentId: "LabelParameterObjectPage",
                entitySet: "",
                contextPath: "/LabelParameter"
            },
            CustomLabelParameterObjectPageGenerated
        )
    },
    async: true
});

export default runner;
