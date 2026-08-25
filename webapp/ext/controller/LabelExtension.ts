// import ExtensionAPI from 'sap/fe/core/ExtensionAPI';
// import Context from 'sap/ui/model/odata/v4/Context';
// import MessageToast from 'sap/m/MessageToast';
// import MessageBox from 'sap/m/MessageBox';
// import Dialog from 'sap/m/Dialog';
// import Button from 'sap/m/Button';
// import Select from 'sap/m/Select';
// import Item from 'sap/ui/core/Item';
// import Label from 'sap/m/Label';
// import Input from 'sap/m/Input';
// import DatePicker from 'sap/m/DatePicker';
// import TextArea from 'sap/m/TextArea';
// import SimpleForm from 'sap/ui/layout/form/SimpleForm';

// /**
//  * Generated event handler for Print Label button.
//  */
// export function onPrintLabel(this: ExtensionAPI, context: Context | undefined, selectedContexts: Context[]) {
//     if (!selectedContexts || selectedContexts.length === 0) {
//         MessageToast.show("Please select an Inspection Lot row first.");
//         return;
//     }

//     const oContext = selectedContexts[0];

//     // Backend Protection: Prevent PDF generation if the row is blank
//     const sInspectionLot = oContext.getProperty("InspectionLot");
//     if (!sInspectionLot || sInspectionLot.trim() === "") {
//         MessageBox.error("The selected row does not have a valid Inspection Lot Number. Please check your backend query class.");
//         return;
//     }

//     // 1. UI Elements - Common Fields
//     const oLabelTypeSelect = new Select({
//         selectedKey: "RELEASED", // Set default to Released for a clean initial load
//         items: [
//             new Item({ key: "RELEASED", text: "Released Label" }),
//             new Item({ key: "SAMPLE", text: "Sample Label" }),
//             new Item({ key: "HOLD", text: "Hold Label" }),
//             new Item({ key: "REJECTED", text: "Rejected Label" })
//         ],
//         width: "100%"
//     });

//     const oCompanySelect = new Select({
//         items: [
//             new Item({ key: "NOVENTA", text: "Noventa" }),
//             new Item({ key: "SEARLE", text: "Searle" })
//         ],
//         width: "100%"
//     });

//     const oLabelCountInput = new Input({ type: "Number", value: "1", required: true });

//     // 2. UI Elements - Dynamic Fields (All hidden by default to match "RELEASED")
//     const oSampleQtyInput = new Input({ visible: false, required: true });
//     const oSampleDatePicker = new DatePicker({ visible: false, required: true, valueFormat: "yyyy-MM-dd" });
//     const oHoldReasonInput = new TextArea({ visible: false, required: true, rows: 3 });
//     const oRejectedReasonInput = new TextArea({ visible: false, required: true, rows: 3 });

//     // 3. Validation Logic - Clear Error State on Input
//     const clearErrorState = (oEvent: any) => {
//         const oControl = oEvent.getSource();
//         if (oControl.getValue && oControl.getValue().trim() !== "") {
//             oControl.setValueState("None");
//             oControl.setValueStateText("");
//         }
//     };

//     oLabelCountInput.attachLiveChange(clearErrorState);
//     oSampleQtyInput.attachLiveChange(clearErrorState);
//     oSampleDatePicker.attachChange(clearErrorState);
//     oHoldReasonInput.attachLiveChange(clearErrorState);
//     oRejectedReasonInput.attachLiveChange(clearErrorState);

//     // 4. The Dialog Form Layout (Dynamic labels hidden by default)
//     const oForm = new SimpleForm({
//         editable: true,
//         layout: "ResponsiveGridLayout",
//         content: [
//             new Label({ text: "Label Type" }), oLabelTypeSelect,
//             new Label({ text: "Company Code" }), oCompanySelect,
//             new Label({ text: "Number of Labels", required: true }), oLabelCountInput,
            
//             // Dynamic Rows
//             new Label({ text: "Sample Quantity", required: true, visible: false }), oSampleQtyInput,
//             new Label({ text: "Sample Date", required: true, visible: false }), oSampleDatePicker,
//             new Label({ text: "Hold Reason", required: true, visible: false }), oHoldReasonInput,
//             new Label({ text: "Rejected Reason", required: true, visible: false }), oRejectedReasonInput
//         ]
//     });

//     // 5. Standalone Visibility Logic
//     const updateDialogVisibility = () => {
//         const sKey = oLabelTypeSelect.getSelectedKey();
//         const aFormContent = oForm.getContent();
        
//         // Toggle Inputs
//         oSampleQtyInput.setVisible(sKey === "SAMPLE");
//         oSampleDatePicker.setVisible(sKey === "SAMPLE");
//         oHoldReasonInput.setVisible(sKey === "HOLD");
//         oRejectedReasonInput.setVisible(sKey === "REJECTED");
        
//         // Toggle Labels
//         (aFormContent[6] as Label).setVisible(sKey === "SAMPLE");   // Sample Qty Label
//         (aFormContent[8] as Label).setVisible(sKey === "SAMPLE");   // Sample Date Label
//         (aFormContent[10] as Label).setVisible(sKey === "HOLD");    // Hold Reason Label
//         (aFormContent[12] as Label).setVisible(sKey === "REJECTED"); // Rejected Reason Label

//         // Clear existing error states when switching
//         [oSampleQtyInput, oSampleDatePicker, oHoldReasonInput, oRejectedReasonInput].forEach(control => {
//             control.setValueState("None");
//         });
//     };

//     // Attach the function to the dropdown change event
//     oLabelTypeSelect.attachChange(updateDialogVisibility);

//     // 6. The Dialog wrapper
//     const oDialog = new Dialog({
//         title: "Print QM Label",
//         contentWidth: "400px",
//         content: oForm,
//         beginButton: new Button({
//             type: "Emphasized",
//             text: "Print",
//             press: async () => {
//                 const sType = oLabelTypeSelect.getSelectedKey();
//                 let bValidationError = false;

//                 // Validate Label Count
//                 if (!oLabelCountInput.getValue()) {
//                     oLabelCountInput.setValueState("Error");
//                     oLabelCountInput.setValueStateText("Required");
//                     bValidationError = true;
//                 }

//                 // Type-Specific Validation
//                 if (sType === "SAMPLE") {
//                     if (!oSampleQtyInput.getValue().trim()) { oSampleQtyInput.setValueState("Error"); bValidationError = true; }
//                     if (!oSampleDatePicker.getValue()) { oSampleDatePicker.setValueState("Error"); bValidationError = true; }
//                 } else if (sType === "HOLD") {
//                     if (!oHoldReasonInput.getValue().trim()) { oHoldReasonInput.setValueState("Error"); bValidationError = true; }
//                 } else if (sType === "REJECTED") {
//                     if (!oRejectedReasonInput.getValue().trim()) { oRejectedReasonInput.setValueState("Error"); bValidationError = true; }
//                 }

//                 if (bValidationError) {
//                     MessageToast.show("Please fill in all mandatory fields.");
//                     return;
//                 }

//                 oDialog.setBusy(true);

//                 try {
//                     let sActionName = "";
//                     if (sType === "SAMPLE") sActionName = "com.sap.gateway.srvd.zqm_olabel_sd.v0001.PrintSample";
//                     if (sType === "HOLD") sActionName = "com.sap.gateway.srvd.zqm_olabel_sd.v0001.PrintHold";
//                     if (sType === "RELEASED") sActionName = "com.sap.gateway.srvd.zqm_olabel_sd.v0001.PrintReleased";
//                     if (sType === "REJECTED") sActionName = "com.sap.gateway.srvd.zqm_olabel_sd.v0001.PrintRejected";

//                     const oModel = oContext.getModel() as any;
//                     const oOperation = oModel.bindContext(`${sActionName}(...)`, oContext);

//                     oOperation.setParameter("CompanyCode", oCompanySelect.getSelectedKey());
//                     oOperation.setParameter("LabelCount", parseInt(oLabelCountInput.getValue(), 10));

//                     if (sType === "SAMPLE") {
//                         oOperation.setParameter("SampleQty", oSampleQtyInput.getValue().trim());
//                         oOperation.setParameter("SampleDate", oSampleDatePicker.getValue());
//                     } else if (sType === "HOLD") {
//                         oOperation.setParameter("HoldReason", oHoldReasonInput.getValue().trim());
//                     } else if (sType === "REJECTED") {
//                         oOperation.setParameter("RejectedReason", oRejectedReasonInput.getValue().trim());
//                     }

//                     await oOperation.execute();
//                     const oResultContext = oOperation.getBoundContext();
//                     const oData = oResultContext.getObject();

//                     if (oData && oData.FileContent) {
//                         downloadPdf(oData.FileContent, oData.FileName || "Label.pdf", oData.MimeType || "application/pdf");
//                         oDialog.close();
//                     } else {
//                         MessageBox.error("PDF generation failed on the backend.");
//                     }

//                 } catch (error: any) {
//                     MessageBox.error(error.message || "An error occurred while generating the document.");
//                 } finally {
//                     oDialog.setBusy(false);
//                 }
//             }
//         }),
//         endButton: new Button({
//             text: "Cancel",
//             press: () => oDialog.close()
//         }),
//         afterClose: () => oDialog.destroy()
//     });

//     oDialog.open();
// }

// /**
//  * Helper function to trigger browser download from Base64 string.
//  */
// function downloadPdf(base64Content: string, fileName: string, mimeType: string) {
//     // 1. Convert OData V4 Base64URL to Standard Base64
//     let safeBase64 = base64Content.replace(/-/g, '+').replace(/_/g, '/');
    
//     // 2. Pad with '=' if the length is not a multiple of 4
//     while (safeBase64.length % 4) {
//         safeBase64 += '=';
//     }

//     // 3. Safely decode the string
//     const byteCharacters = atob(safeBase64);
//     const byteArrays = [];

//     for (let offset = 0; offset < byteCharacters.length; offset += 512) {
//         const slice = byteCharacters.slice(offset, offset + 512);
//         const byteNumbers = new Array(slice.length);
//         for (let i = 0; i < slice.length; i++) {
//             byteNumbers[i] = slice.charCodeAt(i);
//         }
//         const byteArray = new Uint8Array(byteNumbers);
//         byteArrays.push(byteArray);
//     }

//     const blob = new Blob(byteArrays, { type: mimeType });
//     const url = URL.createObjectURL(blob);
    
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = fileName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
// }

import ExtensionAPI from 'sap/fe/core/ExtensionAPI';
import Context from 'sap/ui/model/odata/v4/Context';
import MessageToast from 'sap/m/MessageToast';
import MessageBox from 'sap/m/MessageBox';
import Dialog from 'sap/m/Dialog';
import Button from 'sap/m/Button';
import Select from 'sap/m/Select';
import Item from 'sap/ui/core/Item';
import Label from 'sap/m/Label';
import Input from 'sap/m/Input';
import DatePicker from 'sap/m/DatePicker';
import TextArea from 'sap/m/TextArea';
import SimpleForm from 'sap/ui/layout/form/SimpleForm';
import HTML from 'sap/ui/core/HTML'; // Added for the preview iframe

export function onPrintLabel(this: ExtensionAPI, context: Context | undefined, selectedContexts: Context[]) {
    // 1. Check if nothing is selected
    if (!selectedContexts || selectedContexts.length === 0) {
        MessageToast.show("Please select an Inspection Lot row first.");
        return;
    }

    // 2. NEW: Prevent multiple selections
    if (selectedContexts.length > 1) {
        MessageBox.warning("Please select only one Inspection Lot to proceed with printing.");
        return;
    }

    // 3. Safe to proceed with the single selected row
    const oContext = selectedContexts[0];

    const sInspectionLot = oContext.getProperty("InspectionLot");
    if (!sInspectionLot || sInspectionLot.trim() === "") {
        MessageBox.error("The selected row does not have a valid Inspection Lot Number. Please check your backend query class.");
        return;
    }

    // ... (the rest of your UI Elements and Dialog code continues below)
    // 1. UI Elements - Common Fields
    const oLabelTypeSelect = new Select({
        selectedKey: "RELEASED", 
        items: [
            new Item({ key: "RELEASED", text: "Released Label" }),
            new Item({ key: "SAMPLE", text: "Sample Label" }),
            new Item({ key: "HOLD", text: "Hold Label" }),
            new Item({ key: "REJECTED", text: "Rejected Label" })
        ],
        width: "100%"
    });

    const oCompanySelect = new Select({
        items: [
            new Item({ key: "NOVENTA", text: "Noventa" }),
            new Item({ key: "SEARLE", text: "Searle" })
        ],
        width: "100%"
    });

    const oLabelCountInput = new Input({ type: "Number", value: "1", required: true });

    // 2. UI Elements - Dynamic Fields
    const oSampleQtyInput = new Input({ visible: false, required: true });
    const oSampleDatePicker = new DatePicker({ visible: false, required: true, valueFormat: "yyyy-MM-dd" });
    
    const oHoldReasonInput = new TextArea({ visible: false, required: true, rows: 3 });
    const oHoldDatePicker = new DatePicker({ visible: false, required: true, valueFormat: "yyyy-MM-dd" });
    
    const oReleasedDatePicker = new DatePicker({ visible: true, required: true, valueFormat: "yyyy-MM-dd" });
    
    const oRejectedReasonInput = new TextArea({ visible: false, required: true, rows: 3 });
    const oRejectedDatePicker = new DatePicker({ visible: false, required: true, valueFormat: "yyyy-MM-dd" });

    // 3. Validation Logic - Clear Error State on Input
    const clearErrorState = (oEvent: any) => {
        const oControl = oEvent.getSource();
        if (oControl.getValue && oControl.getValue().trim() !== "") {
            oControl.setValueState("None");
            oControl.setValueStateText("");
        }
    };

    oLabelCountInput.attachLiveChange(clearErrorState);
    oSampleQtyInput.attachLiveChange(clearErrorState);
    oSampleDatePicker.attachChange(clearErrorState);
    oHoldReasonInput.attachLiveChange(clearErrorState);
    oHoldDatePicker.attachChange(clearErrorState);
    oReleasedDatePicker.attachChange(clearErrorState);
    oRejectedReasonInput.attachLiveChange(clearErrorState);
    oRejectedDatePicker.attachChange(clearErrorState);

    // 4. The Dialog Form Layout
    const oForm = new SimpleForm({
        editable: true,
        layout: "ResponsiveGridLayout",
        content: [
            new Label({ text: "Label Type" }), oLabelTypeSelect,
            new Label({ text: "Company Code" }), oCompanySelect,
            new Label({ text: "Number of Labels", required: true }), oLabelCountInput,
            
            // Dynamic Rows
            new Label({ text: "Sample Quantity", required: true, visible: false }), oSampleQtyInput,      // Index 6
            new Label({ text: "Sample Date", required: true, visible: false }), oSampleDatePicker,        // Index 8
            new Label({ text: "Hold Reason", required: true, visible: false }), oHoldReasonInput,         // Index 10
            new Label({ text: "Hold Date", required: true, visible: false }), oHoldDatePicker,            // Index 12
            new Label({ text: "Released Date", required: true, visible: true }), oReleasedDatePicker,     // Index 14
            new Label({ text: "Rejected Reason", required: true, visible: false }), oRejectedReasonInput, // Index 16
            new Label({ text: "Rejected Date", required: true, visible: false }), oRejectedDatePicker     // Index 18
        ]
    });

    // 5. Standalone Visibility Logic
    const updateDialogVisibility = () => {
        const sKey = oLabelTypeSelect.getSelectedKey();
        const aFormContent = oForm.getContent();
        
        oSampleQtyInput.setVisible(sKey === "SAMPLE");
        oSampleDatePicker.setVisible(sKey === "SAMPLE");
        oHoldReasonInput.setVisible(sKey === "HOLD");
        oHoldDatePicker.setVisible(sKey === "HOLD");
        oReleasedDatePicker.setVisible(sKey === "RELEASED");
        oRejectedReasonInput.setVisible(sKey === "REJECTED");
        oRejectedDatePicker.setVisible(sKey === "REJECTED");
        
        (aFormContent[6] as Label).setVisible(sKey === "SAMPLE");  
        (aFormContent[8] as Label).setVisible(sKey === "SAMPLE");  
        (aFormContent[10] as Label).setVisible(sKey === "HOLD");   
        (aFormContent[12] as Label).setVisible(sKey === "HOLD");   
        (aFormContent[14] as Label).setVisible(sKey === "RELEASED"); 
        (aFormContent[16] as Label).setVisible(sKey === "REJECTED"); 
        (aFormContent[18] as Label).setVisible(sKey === "REJECTED"); 

        [oSampleQtyInput, oSampleDatePicker, oHoldReasonInput, oHoldDatePicker, oReleasedDatePicker, oRejectedReasonInput, oRejectedDatePicker].forEach(control => {
            control.setValueState("None");
        });
    };

    oLabelTypeSelect.attachChange(updateDialogVisibility);

    // 6. The Dialog wrapper
    const oDialog = new Dialog({
        title: "Print QM Label",
        contentWidth: "400px",
        content: oForm,
        beginButton: new Button({
            type: "Emphasized",
            text: "Generate Preview", // Updated button text
            press: async () => {
                const sType = oLabelTypeSelect.getSelectedKey();
                let bValidationError = false;

                if (!oLabelCountInput.getValue()) { oLabelCountInput.setValueState("Error"); bValidationError = true; }

                if (sType === "SAMPLE") {
                    if (!oSampleQtyInput.getValue().trim()) { oSampleQtyInput.setValueState("Error"); bValidationError = true; }
                    if (!oSampleDatePicker.getValue()) { oSampleDatePicker.setValueState("Error"); bValidationError = true; }
                } else if (sType === "HOLD") {
                    if (!oHoldReasonInput.getValue().trim()) { oHoldReasonInput.setValueState("Error"); bValidationError = true; }
                    if (!oHoldDatePicker.getValue()) { oHoldDatePicker.setValueState("Error"); bValidationError = true; }
                } else if (sType === "RELEASED") {
                    if (!oReleasedDatePicker.getValue()) { oReleasedDatePicker.setValueState("Error"); bValidationError = true; }
                } else if (sType === "REJECTED") {
                    if (!oRejectedReasonInput.getValue().trim()) { oRejectedReasonInput.setValueState("Error"); bValidationError = true; }
                    if (!oRejectedDatePicker.getValue()) { oRejectedDatePicker.setValueState("Error"); bValidationError = true; }
                }

                if (bValidationError) {
                    MessageToast.show("Please fill in all mandatory fields.");
                    return;
                }

                oDialog.setBusy(true);

                try {
                    let sActionName = "";
                    if (sType === "SAMPLE") sActionName = "com.sap.gateway.srvd.zqm_olabel_sd.v0001.PrintSample";
                    if (sType === "HOLD") sActionName = "com.sap.gateway.srvd.zqm_olabel_sd.v0001.PrintHold";
                    if (sType === "RELEASED") sActionName = "com.sap.gateway.srvd.zqm_olabel_sd.v0001.PrintReleased";
                    if (sType === "REJECTED") sActionName = "com.sap.gateway.srvd.zqm_olabel_sd.v0001.PrintRejected";

                    const oModel = oContext.getModel() as any;
                    const oOperation = oModel.bindContext(`${sActionName}(...)`, oContext);

                    oOperation.setParameter("CompanyCode", oCompanySelect.getSelectedKey());
                    oOperation.setParameter("LabelCount", parseInt(oLabelCountInput.getValue(), 10));

                    if (sType === "SAMPLE") {
                        oOperation.setParameter("SampleQty", oSampleQtyInput.getValue().trim());
                        oOperation.setParameter("SampleDate", oSampleDatePicker.getValue());
                    } else if (sType === "HOLD") {
                        oOperation.setParameter("HoldReason", oHoldReasonInput.getValue().trim());
                        oOperation.setParameter("HoldDate", oHoldDatePicker.getValue());
                    } else if (sType === "RELEASED") {
                        oOperation.setParameter("ReleasedDate", oReleasedDatePicker.getValue());
                    } else if (sType === "REJECTED") {
                        oOperation.setParameter("RejectedReason", oRejectedReasonInput.getValue().trim());
                        oOperation.setParameter("RejectedDate", oRejectedDatePicker.getValue());
                    }

                    await oOperation.execute();
                    const oResultContext = oOperation.getBoundContext();
                    const oData = oResultContext.getObject();

                    if (oData && oData.FileContent) {
                        const fileName = oData.FileName || "Label.pdf";
                        const mimeType = oData.MimeType || "application/pdf";
                        
                        // Get URL and close the input dialog
                        const pdfUrl = getPdfBlobUrl(oData.FileContent, mimeType);
                        oDialog.close();

                        // --- LAUNCH PREVIEW DIALOG ---
                        const pdfViewer = new HTML({
                            content: `<iframe src="${pdfUrl}" width="100%" height="580px" style="border: none;"></iframe>`
                        });

                        const previewDialog = new Dialog({
                            title: `Label Preview - ${sType}`,
                            contentWidth: "1000px",
                            contentHeight: "700px",
                            content: [pdfViewer],
                            beginButton: new Button({
                                text: "Download PDF",
                                type: "Emphasized",
                                press: () => {
                                    const link = document.createElement("a");
                                    link.href = pdfUrl;
                                    link.download = fileName;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }
                            }),
                            endButton: new Button({
                                text: "Close",
                                press: () => {
                                    previewDialog.close();
                                }
                            }),
                            afterClose: () => {
                                previewDialog.destroy();
                                URL.revokeObjectURL(pdfUrl); // Clean up memory
                            }
                        });

                        previewDialog.open();
                        MessageToast.show("Preview generated successfully.");

                    } else {
                        MessageBox.error("PDF generation failed on the backend.");
                    }

                } catch (error: any) {
                    MessageBox.error(error.message || "An error occurred while generating the document.");
                } finally {
                    oDialog.setBusy(false);
                }
            }
        }),
        endButton: new Button({
            text: "Cancel",
            press: () => oDialog.close()
        }),
        afterClose: () => oDialog.destroy()
    });

    oDialog.open();
}

// --- STANDARD PDF HELPER FROM COA PROJECT ---
function getPdfBlobUrl(base64: string, mimeType: string): string {
    if (!base64) {
        throw new Error("Empty PDF content received.");
    }

    let cleanedBase64 = String(base64).trim();

    // Remove data URL prefix if present
    if (cleanedBase64.includes(",")) {
        cleanedBase64 = cleanedBase64.split(",")[1];
    }

    // Convert base64url to normal base64
    cleanedBase64 = cleanedBase64.replace(/-/g, "+").replace(/_/g, "/");

    // Remove whitespace/newlines
    cleanedBase64 = cleanedBase64.replace(/\s/g, "");

    // Add missing padding
    while (cleanedBase64.length % 4 !== 0) {
        cleanedBase64 += "=";
    }

    const byteCharacters = window.atob(cleanedBase64);
    const byteNumbers: number[] = [];

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType || "application/pdf" });

    return URL.createObjectURL(blob);
}