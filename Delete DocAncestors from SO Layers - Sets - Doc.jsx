/*

Delete DocAncestors from SO Layers - Sets - Doc.jsx
Version 1.0, Stephen Marsh 8th May 2021

Standing on the shoulders of giants - this script is a combination of scripts from various authors
https://community.adobe.com/t5/photoshop/inflated-jpg-file-size-photoshop-document-ancestors-metadata/m-p/8055434
https://feedback.photoshop.com/photoshop_family/topics/rasterize_all_smart_objects_in_a_psd_file_to_shrink_down_its_size

*/

#target photoshop

var doc = app.activeDocument;
doc.suspendHistory("Delete Ancestors Metadata", "processSOLayers(doc)");

function processSOLayers(theParent) {

    for (var m = theParent.layers.length - 1; m >= 0; m--) {
        var theLayer = theParent.layers[m];

        if (theLayer.typename === "ArtLayer") {
            if (theLayer.kind === LayerKind.SMARTOBJECT) {
                var theVisibility = theLayer.visible;
                doc.activeLayer = theLayer;

                app.runMenuItem(stringIDToTypeID('placedLayerEditContents'));
                deleteDocAncestors();
                app.activeDocument.close(SaveOptions.SAVECHANGES);
                //alert("SO doc cleaned");

                theLayer.visible = theVisibility;
            }

        } else {
            processSOLayers(theLayer);
        }
    }
    return;
}

deleteDocAncestors();
//alert("Parent doc cleaned");

function deleteDocAncestors() {
    if (ExternalObject.AdobeXMPScript === undefined) ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    var xmp = new XMPMeta(activeDocument.xmpMetadata.rawData);
    xmp.deleteProperty(XMPConst.NS_PHOTOSHOP, "DocumentAncestors");
    app.activeDocument.xmpMetadata.rawData = xmp.serialize();
}
