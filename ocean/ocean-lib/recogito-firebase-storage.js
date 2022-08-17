!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):((n="undefined"!=typeof globalThis?globalThis:n||self).recogito=n.recogito||{},n.recogito.FirebaseStorage=t())}(this,function(){"use strict";return function(t,n,e){var o=e.collectionName||"annotations",e=e.annotationTarget;firebase.initializeApp(n);function i(n){
    return r.collection(o).where("id","==",n).get().then(function(n){return n.docs[0]})}var r=firebase.firestore();
    r.collection(o) //.where("target.source","==",e)
    .get().then(function(n){
        n=n.docs.map(function(n){return n.data()});
        // t.setAnnotations(n);

        for(var i=0;i< n.length; i++){
            if(n[i].body[0].purpose == "bridge") { // complete bridge
                t.addAnnotation(n[i]);
            }

            else if((n[i].body[0].purpose == "pre-bridge") && (n[i].body[0].author == session_id)) {     // or incomplete bridge made by me 
                pending_bridges.push({
                    "snippet": n[i].target.selector[0].exact,
                    "id": n[i].id
                });

                t.addAnnotation(n[i]);
                addBookmarkDropdown(n[i]);
            }
                
                
        }
            
        document.querySelectorAll(".r6o-annotation").forEach(e => e.id = e.getAttribute("data-id").substr(1));
}),t.on("createAnnotation",function(t){r.collection(o).add(t).catch(function(n){return console.error("Error storing annotation",n,t)})}),t.on("updateAnnotation",function(t,e){i(e.id).then(function(n){return n.ref.update(t)}).catch(function(n){return console.log("Error updating annotation",n,e,t)})}),t.on("deleteAnnotation",function(t){i(t.id).then(function(n){return n.ref.delete()}).catch(function(n){return console.log("Error deleting annotation",n,t)})})}});