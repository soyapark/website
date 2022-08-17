
var myAnnotation = {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'id': 'https://www.example.com/recogito-js-example/foo',
    'type': 'Annotation',
    'body': [{
    'type': 'TextualBody',
    'value': 'This annotation was added via JS.'
    }],
    'target': {
    'selector': [{
        'type': 'TextQuoteSelector',
        'exact': 'that ingenious hero'
    }, {
        'type': 'TextPositionSelector',
        'start': 1138,
        'end': 1157
    }]
    }
};

var zivaAnnotations = [
    {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'id': 'anno1',
    'type': 'Annotation',
    'body': [{
        "purpose": "bridge",
        "type": "TextualBody",
        "value": "4 ZIVA: INTERFACE FOR ELICITING DOMAIN", 
        "href": "#sec-9"
    }],
    'target': {
        'selector': [{
        'type': 'TextQuoteSelector',
        'exact': 'that ingenious hero'
        }, {
        'type': 'TextPositionSelector',
        'start': 981,
        'end': 985
        }]
    }
    },
    {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'id': 'anno2',
    'type': 'Annotation',
    'body': [{
        "purpose": "bridge",
        "type": "TextualBody",
        "value": "4.2 Concept creation",
        "href": "#sec-11",
        "blob": "Creating a taxonomy is an effective way of organizing information [20, 48]. Ziva provides an interface where SMEs can extract domain concepts (R2). Users are asked to categorize each example instance, presented as a card, via a card-sorting activity. Users first group cards by topic (general concepts of the domain such as atmosphere, food, service, price). Cards in each topic are then further divided cards into descriptions referencing specific attributes for a topic (e.g., cool, tasty, kind, high). The interface (Figure 2) was implemented as a drag-and-drop UI using LMDD [2]."
    }],
    'target': {
        'selector': [{
        'type': 'TextQuoteSelector',
        'exact': 'that ingenious hero'
        }, {
        'type': 'TextPositionSelector',
        'start': 1183,
        'end': 1208
        }]
    }
    },
    {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'id': 'anno3',
    'type': 'Annotation',
    'body': [{
        "purpose": "bridge",
        "type": "TextualBody",
        "value": "4.3 Justification-elicitation interface",
        "href": "#sec-12"
    }],
    'target': {
        'selector': [{
        'type': 'TextQuoteSelector',
        'exact': 'that ingenious hero'
        }, {
        'type': 'TextPositionSelector',
        'start': 1213,
        'end': 1246
        }]
    }
    },
    {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'id': 'anno4',
    'type': 'Annotation',
    'body': [{
        "purpose": "bridge",
        "type": "TextualBody",
        "value": "4.1 Representative sampling for instances creation",
        "href": "#sec-10",
        "blob": "As highlighted in the our formative interview, domain experts have limited time for labeling or sharing domain knowledge (R1). Hence, it is important to ask them to review only a few of instances and the sample can cover most concepts in the domain. Ziva extracts such a representative sample of m instances from a large training set of N text instances by the simple method of transforming the original text into ’tf-idf’ space, clustering the result using an algorithm such as k-means (setting k = m), and, for each cluster, returning the text instance closest to the cluster center. This method is not deterministic, but provides a reasonable set of representative instances, for cases where m < < N."
    }],
    'target': {
        'selector': [{
        'type': 'TextQuoteSelector',
        'exact': 'that ingenious hero'
        }, {
        'type': 'TextPositionSelector',
        'start': 1252,
        'end': 1280
        }]
    }
    },
    {
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    'id': 'anno5',
    'type': 'Annotation',
    'body': [{
        "purpose": "bridge",
        "type": "TextualBody",
        "value": "INTRODUCTION",
        "href": "#sec-2",
        "blob": "First, a common bottleneck in developing modern ML technologies is the requirement of a large quantity of labeled data. Second, many steps in an ML development pipeline, from problem definition to feature engineering to model debugging, necessitate an understanding of domain-specific knowledge and requirements."
    }],
    'target': {
        'selector': [{
        'type': 'TextQuoteSelector',
        'exact': 'that ingenious hero'
        }, {
        'type': 'TextPositionSelector',
        'start': 666,
        'end': 686
        }]
    }
    }
];

let session_id = getUrlParameter("user");
let pending_bridges = [];

function addBookmarkDropdown(a) {
    // add option to dropdown at context menu   
    var option = document.createElement("option");
    option.text = a.target.selector[0].exact;
    option.value = a.id;
    var select = document.getElementById("bookmark-nav");
    select.appendChild(option);
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
}

let cxt_menu_tgt = "#outer-container";

(function () {
    let bridge_start = false;
    let bridge_snippet = "";
    
    let ok_clicked = false;
    let src_id;
    let jump_src_id;

    let tabID = 1;
    let currentTabID = 0;
    let scrollTab = [{"name": "Main", "loc": 0}];

    if(session_id == "[Your") {
        alert("Wrong user name. Please try the link with your name.");
        $("body").hide();
        return;
    } else if(!session_id) {
        alert("Wrong URL. Please contact Soya for a correct link.");
        $("body").hide();
        return;
    }

    // ctrl-f detection
    var keydown = null;
    $(window).keydown(function(e) {
        if ( ( e.keyCode == 70 && ( e.ctrlKey || e.metaKey ) ) ||
             ( e.keyCode == 191 ) ) {
            keydown = new Date().getTime();
        }
        
        return true;
    }).blur(function() {
        if ( keydown !== null ) {
            var delta = new Date().getTime() - keydown;
            if ( delta > 0 && delta < 1000 )
                document.dispatchEvent(new CustomEvent('ctrlF', { detail: {
                    "ctrlF": "text-search"
                }}));
            
            keydown = null;
        }
    });

    $("body").on("click", ".context-menu li", function(e) {
        if(e.target !== e.currentTarget) return;

        openTab( $(e.target).attr("tabID") );

        document.dispatchEvent(new CustomEvent("openTab", { detail: {
            tabID: $(e.target).attr("tabID")
        }}));
    });

    $("body").on("click", "span.close", function(e) {
        // remove tab
        let to_removed = $(e.target).parents("li").attr("tabID");
        $(`.context-menu ul li[tabID=${to_removed}]`).remove();

        if(to_removed == currentTabID)
            openTab(0);
    })

    // create a new tab from dropdown
    $("body").on("change", "#bookmark-nav", function () {
        if(this.value == "default") {
            // no jump 
            return;
        }

        document.querySelector(`[data-id='${this.value}']`).id = (this.value[0] == "#" ? this.value.substr(1) : this.value);

        // create a new tab
        createNewTab($(this.value).offset().top, $(`[value=${this.value}]`).text())
    });

    var ColorSelectorWidget = function(args) {
        // 1. Find a current color setting in the annotation, if any
        var currentColorBody = args.annotation ? 
            args.annotation.bodies.find(function(b) {
            return b.purpose == 'highlighting';
            }) : null;

        // 2. Keep the value in a variable
        var currentColorValue = currentColorBody ? currentColorBody.value : null;

        // 3. Triggers callbacks on user action
        var addTag = function(evt) {
            if (currentColorBody) {
            args.onUpdateBody(currentColorBody, {
                type: 'TextualBody',
                purpose: 'highlighting',
                value: evt.target.dataset.tag
            });
            } else { 
            args.onAppendBody({
                type: 'TextualBody',
                purpose: 'highlighting',
                value: evt.target.dataset.tag
            });
            }
        }

        // 4. This part renders the UI elements
        var createButton = function(value) {
            var button = document.createElement('button');

            if (value == currentColorValue)
            button.className = 'selected';

            button.dataset.tag = value;
            button.style.backgroundColor = value;
            button.addEventListener('click', addTag); 
            return button;
        }

        var container = document.createElement('div');
        container.className = 'colorselector-widget';
        
        var button1 = createButton('RED');
        var button2 = createButton('GREEN');
        var button3 = createButton('BLUE');

        container.appendChild(button1);
        container.appendChild(button2);
        container.appendChild(button3);

        return container;
    }

    var BridgeWidget = function(args) {
        // for safari, if the context menu is open, don't open the widget
        if($(".context-menu").css("display") == "block")
            $(".r6o-editor").hide();
            

        // Check if there is already bridge here
        var currentBridges = args.annotation ? 
            args.annotation.bodies.find(function(b) {
            return b.purpose == 'bridge' || b.purpose == 'tagging';
            }) : null;  

        var currentPreBridges = args.annotation ? 
            args.annotation.bodies.find(function(b) {
            return b.purpose.includes('pre-bridge');
            }) : null;  

        var currentPreSelect = args.annotation ? 
            args.annotation.bodies.find(function(b) {
            return b.purpose == 'pre-select';
            }) : null;  

        var currentMaterials = args.annotation ? 
            args.annotation.bodies.find(function(b) {
            return b.purpose == 'material';
            }) : null;  
    
        if(currentBridges)
            document.dispatchEvent(new CustomEvent("openBridge", { detail: {
                id: args.annotation.id,
                created_by: currentBridges.author
            }}));

        else if(currentPreBridges)
            document.dispatchEvent(new CustomEvent("openPreBridge", { detail: {
                id: args.annotation.id,
                created_by: currentPreBridges.author
            }}));

        else if(currentPreSelect)
            document.dispatchEvent(new CustomEvent("openPreSelect", { detail: {
                id: args.annotation.id,
                created_by: currentPreSelect.author
            }}));
        
        else if(currentMaterials)
            document.dispatchEvent(new CustomEvent("openMaterial", { detail: {
                id: args.annotation.id,
                created_by: "ocean"
            }}));

    // Triggers callbacks when they click the button
    var addTag = function(evt) {
        // args.onAppendBody({
        //   type: 'TextualBody',
        //   purpose: 'pre-bridge',
        //   value: evt.target.dataset.tag,
        //   author: "soya"
        // });

        args.onUpdateBody({
        type: 'TextualBody',
        purpose: 'pre-bridge',
        value: "GREY",
        author: session_id
        });

        // args.onSaveAndClose({
        //   type: 'TextualBody',
        //   purpose: 'pre-bridge',
        //   value: "GREY",
        //   author: "soya"
        // });

        bridge_start = true;
        bridge_snippet = args.annotation.target.selector[0].exact;

        // add another pending bridges
        // pending_bridges.push( bridge_snippet );

        // r.addAnnotation(args);
        // debugger;

        // document.getElementById('ok-btn').click()
    }

    var createNewTabButton = function(clone=false) {
        var button = document.createElement('button');

        button.style.fontSize = "17px";
        button.dataset.tag = 'YELLOW';
        button.addEventListener('click', function(e) {
            e.preventDefault();

            let tab_target = clone ? args.annotation.id : currentBridges.href;

            if(!clone) 
                highlightHref(tab_target);
            else 
                $(".r6o-editor").hide();

            // jump to the end of bridge and create a tab there, and open up a contextmenu at the cursor
            // set proper name for the new tab
            let new_tab_name = $(`[data-id="${tab_target}"]`).text();
            new_tab_name = new_tab_name == "that ingenious hero" ? $(args.annotation.id).text().split(" ") : new_tab_name.split(" ");
            new_tab_name = new_tab_name.length > 3 ? new_tab_name.slice(0, 3).join(" ") + " ...": new_tab_name.join(" ");

            // if opening a new tab for figure, adjust the offset so it starts from figure not the caption
            if(args.annotation.id.includes("fig")) {
                createNewTab($(`[data-id="${tab_target}"]`).parents("figure").offset().top, new_tab_name, !clone);  
            }
            else 
                createNewTab($(`[data-id="${tab_target}"]`).offset().top, new_tab_name, !clone);            

            // figure 1 heuristics 
            if(tab_target == "#fig1")
                $(".context-menu").toggle(100).css({
                    top: ($(`.fig1-anchor`).offset().top + 19) + "px",
                    left: $(`.fig1-anchor`).offset().left + "px"
                });
            else
            $(".context-menu").toggle(100).css({
                top: ($(`[data-id="${tab_target}"]`).offset().top + 19) + "px",
                left: $(`[data-id="${tab_target}"]`).offset().left + "px"
            });

            this.parentNode.removeChild(this);
            let s = document.createElement("span");
            s.textContent = "A new tab is created!";

            container.appendChild(s);

            document.dispatchEvent(new CustomEvent(clone? "createNewTab" : "openInNewTab", { detail: {
                id: args.annotation.id,
                created_by: (currentBridges || currentPreBridges) ? (currentPreBridges ? currentPreBridges.author: currentBridges.author): "ocean"
            }}));
        });
        button.textContent = clone? "Create a new tab" : "Open in new tab";
        return button;
    }

    var finishBridge = function(evt) {
        if(currentPreBridges)
            args.onUpdateBody(currentPreBridges, {
                type: 'TextualBody',
                purpose: 'pre-bridge2', // change the purpose to trigger re-rendering of pop-up
                author: session_id,
                ocean_id: args.annotation.id,
                snippet: evt.target.textContent,
                bookmarkToBookmark: true
            });

        else if(currentPreSelect)
            args.onUpdateBody(currentPreSelect, {
                type: 'TextualBody',
                purpose: 'bridge',
                author: session_id,
                ocean_id: "ocean" + Math.random(),
                snippet: evt.target.textContent
            });

        src_id = evt.target.dataset.src_id;
        
    }

    var finishBridgeButton = function(value) {
        var button = document.createElement('button');

        button.classList.add("bridge-end-btn");
        button.style.fontSize = "17px";
        button.dataset.tag = 'YELLOW';
        button.dataset.src_id = value.id;
        button.addEventListener('click', finishBridge); 
        button.textContent = value.snippet;
        return button;
    }

    var container = document.createElement('div');
    container.className = 'bridgeselector-widget';
    // debugger;
    // if bridge exist, don't allow users to add more
    if(currentBridges && currentBridges.purpose == "tagging") {
        // no op

    } else if(currentBridges && currentBridges.purpose == "bridge") {
        if(currentBridges.value && currentBridges.href) {
        // hide Ok and cancel button at the tooltip
        document.getElementById("ok-btn").style.visibility = "hidden";
        document.getElementById("cancel-btn").style.visibility = "hidden";

        if(!currentBridges.blob) {
            let a = document.createElement('a');
            a.href = currentBridges.href;

            let t = document.createElement('input');
            t.type = "button";

            t.value = currentBridges.value;
            a.appendChild(t);
            container.appendChild(a);
        }
        else {
            let t = document.createElement('span');

            t.textContent = "Link to: "

            container.appendChild(t);
            container.appendChild( document.createElement("br") );

            t = document.createElement('span');
            
            t.textContent = currentBridges.blob;
            
            container.appendChild(t);

            // let a = document.createElement('a');
            // a.href = currentBridges.href;

            // t = document.createElement('input');
            // t.type = "button";

            // t.value = "Go to " + currentBridges.value;

            let author_tag = document.createElement("i");
            author_tag.textContent = " Created by " + (currentBridges.author == session_id? "me":currentBridges.author); 
            container.appendChild( author_tag);
            container.appendChild( document.createElement("br") );

            // Jump to another end of bridge
            let a = document.createElement("button");
            a.textContent = "Jump to " + currentBridges.value;
            a.style.fontSize = "17px";
            a.style.marginRight = "5px";

            a.addEventListener('click', function() {
                document.querySelector(`[data-id='${currentBridges.href}']`).id = (currentBridges.href[0] == "#" ? currentBridges.href.substr(1) : currentBridges.href);

                highlightHref(currentBridges.href);
                
                jump_src_id = args.annotation.id;
                location.href = currentBridges.href;
            }); 
            // a.appendChild(t);
            container.appendChild(a);

            // Create a tab from this bookmark 
            let tabButton= createNewTabButton();
             
            container.appendChild(tabButton);
        }
        
        } else {
            // Right after bridge is created for bridge ends
            document.getElementById("ok-btn").disabled = false;

            let src_annotations = r.getAnnotations().filter(an => an.body[0].href == args.annotation.id);
            if(args.annotation.id && src_annotations.length) {
                let t = document.createElement('span');
                
                t.textContent = "Link from: " + src_annotations[0].target.selector[0].exact;
                
                container.appendChild(t);
                container.appendChild( document.createElement("br") );

                t = document.createElement('span');
                
                t.textContent = "Jump to occurrence: ";
                
                container.appendChild(t);

                // from all the sources
                // remove redundant links
                $.each(r.getAnnotations().filter(an => (an.body[0].href == args.annotation.id)).reduce((unique, o) => {
                    if(!unique.some(obj => obj.target.selector[1].start === o.target.selector[1].start)) {
                      unique.push(o);
                    }
                    return unique;
                },[]), function(i, v) {
                    let a = document.createElement("button");
                    let el = `[data-id="${v.id}"]`;

                    // Get which section is from
                    $(el).parents('section[id]').each(function (i, e) {
                        if($(e).find("> header").length == 0) return;
                        a.textContent = $(e).find("> header .title-info").text().trim();
                    })

                    if(!a.textContent) a.textContent = "Abstract";

                    if(!$(el).attr("id"))
                        $(el).attr("id", "ocean" + Math.random());

                    a.style.fontSize = "17px";
                    a.style.marginRight = "5px";
                    a.addEventListener('click', function() {
                        highlightHref("#" + $(el).attr("id"));
                        // go to the part of the content that is citing
                        location.href = "#" + $(el).attr("id");
                    }); 
                    container.appendChild(a);
                });

                container.appendChild(document.createElement('hr'));

                // create a new tab
                let tab_btn = createNewTabButton(true);
                container.appendChild(tab_btn);
            }
            
            else {
                let t = document.createElement('span');

                t.textContent = `Press OK to create the link to "${currentBridges.snippet}"`;
                container.appendChild(t);
            }
         
        
        }
        
    } 
    else if(currentPreBridges || currentPreSelect) {
        if(currentPreBridges && currentPreBridges.bookmarkToBookmark) {
            document.getElementById("ok-btn").disabled = false;

            let t = document.createElement('span');
            
            t.textContent = `Press OK to create the link to "${currentPreBridges.snippet}"`;
            container.appendChild(t);
        }
        else {
            let rdo = document.createElement('input');
            rdo.type = "radio";
            rdo.name= "bridge-ctl";
            rdo.id = "start-bridge"
            rdo.checked = true;
            rdo.addEventListener('change', function() {
                document.getElementById("ok-btn").disabled = false;
    
                document.querySelectorAll(".bridge-end-btn").forEach(e => e.parentNode.removeChild(e));
            });
    
            let l = document.createElement('label');
            l.htmlFor = "start-bridge";
            l.textContent = currentPreBridges? "Your bookmark (only visible to you)" : "Add a bookmark";
    
            container.appendChild(rdo);
            container.appendChild(l);
    
            container.appendChild(document.createElement('br'));
    
            
    
            if(pending_bridges.length) {
                rdo = document.createElement('input');
                rdo.type = "radio";
                rdo.name= "bridge-ctl";
                rdo.id = "end-bridge"
                rdo.addEventListener('change', function() {
                    document.getElementById("ok-btn").disabled = true;
    
                    // bridge finishing buttons 
                    pending_bridges.filter(p => p.id != args.annotation.id).map(p => {
                        var button1 = finishBridgeButton(p);
                        
                        document.querySelector("#link-btn-container").appendChild(button1);
                        return null;
                    })
                });
    
                l = document.createElement('label');
                l.htmlFor = "end-bridge";
                l.textContent = "Link from another bookmark: "
    
                container.appendChild(rdo);
                container.appendChild(l);
    
                let link_btn_container = document.createElement('div');
                link_btn_container.id = "link-btn-container";
    
                container.appendChild(link_btn_container);
    
                // container.appendChild(document.createElement('br'));
            } 
    
            container.appendChild(document.createElement('hr'));
    
            if(currentPreBridges) {
                // create a new tab option
                let tab_btn = createNewTabButton(true);
                container.appendChild(tab_btn);    
            }
        }
        
        
    } 
    else if (currentMaterials) {
        let t = document.createElement('span');
        
        t.textContent = "Link from: "
        
        container.appendChild(t);
        container.appendChild( document.createElement("br") );

        // fig, tables or footnotes
        $(`a[href="${args.annotation.id}"]`).each(function( index, el ) {
            // el == this
            let a = document.createElement("button");
            
            // Get which section is from
            $(el).parents('section[id]').each(function (i, e) {
                if($(e).find("> header").length == 0) return;
                a.textContent = $(e).find("> header .title-info").text().trim();
            })

            if(!$(el).attr("id"))
                $(el).attr("id", "ocean" + Math.random());

            a.style.fontSize = "17px";
            a.style.marginRight = "5px";
            a.addEventListener('click', function() {
                highlightHref("#" + $(el).attr("id"));

                // go to the part of the content that is citing
                location.href = "#" + $(el).attr("id");
            }); 
            container.appendChild(a);
        });

        container.appendChild(document.createElement('hr'));

        // create a new tab
        let tab_btn = createNewTabButton(true);
        container.appendChild(tab_btn);

        
    } else  {
        args.onAppendBody({
        type: 'TextualBody',
        purpose: 'pre-select',
        value: "GREY",
        author: session_id
        });

        // bridge_start = true;
        // bridge_snippet = args.annotation.target.selector[0].exact;

        // // add another pending bridges
        // pending_bridges.push( bridge_snippet );

    }
    

    return container;
    }

    /** A matching formatter that sets the color according to the 'highlighting' body value **/
    var ColorFormatter = function(annotation) {
    var highlightBody = annotation.bodies.find(function(b) {
        return b.purpose.includes("bridge");
    });

    if (highlightBody)
        return highlightBody.value;
    }


    // Intialize Recogito
    var r = Recogito.init({
        content: 'content', // Element id or DOM node to attach to
        locale: 'auto',
        // readOn ly: true,
        widgets: [
            // { widget: 'COMMENT' },
            // ColorSelectorWidget,
            BridgeWidget,
            // { widget: 'TAG', vocabulary: ['Place', 'Person', 'Event', 'Organization', 'Animal'] }
        ],
        formatter: ColorFormatter
    });

    $(".bibUl li select").remove();

    // find all citations
    $(".bibUl li").each(function( index, el ) {
        // $(".bibUl li, .table-number, .figure-number").each(function( index, el ) {
            // el == this
    
        let c = $(el).html();
        $(el).empty();

        let s = $("<span></span>");
        s.html(c);
        $(el).append(s);
    });

    var firebaseConfig = {
    apiKey: "AIzaSyCTua642g885yQ_lqck4F7fwTwqlrYKfF4",
    authDomain: "ocean-78725.firebaseapp.com",
    projectId: "ocean-78725",
    storageBucket: "ocean-78725.appspot.com",
    messagingSenderId: "109351838437",
    appId: "1:109351838437:web:a96c9d256173e20d63ea0c"
    };

    

    var settings = {
        annotationTarget: "test",  // mandatory
        collectionName: COLLECTION_NAME // optional (default = 'annotations')
    }

    // Init the storage plugin
    recogito.FirebaseStorage(r, firebaseConfig, settings);


    var db = firebase.firestore();
    let init = true;
    
    // let init = false;

    firebase.auth().signInAnonymously()
      .then(() => {
        // Signed in..
        console.log("signed in");
        // var db = firebase.firestore();


        // // Init the storage plugin
        // recogito.FirebaseStorage(r, firebaseConfig, settings);




      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        debugger;
        // ...
      });




    // add annotations programatically from Table & Figure captions to the part it is referenced

    // load lazily for citations since they are so many
    $('a.bib').click(function(e) {
        let prev_sib = $($(e.target).attr("href")).prev("li"), next_sib = $($(e.target).attr("href")).next("li");
        
        if(prev_sib.length && (prev_sib.find(`[data-id="#${prev_sib[0].id}"]`).length == 0))
            addLinktoMaterial( prev_sib );
        if($($(e.target).attr("href")).find("span.r6o-annotation").length == 0)
            addLinktoMaterial( $($(e.target).attr("href")) );
        if(next_sib.length && (next_sib.find(`[data-id="#${next_sib[0].id}"]`).length == 0))
            addLinktoMaterial( next_sib );
    })   
    
    $('.bibUl li').click(function(e) {
        let prev_sib = $(e.currentTarget).prev("li"), next_sib = $(e.currentTarget).next("li");
        
        if(prev_sib.length && (prev_sib.find(`[data-id="#${prev_sib[0].id}"]`).length == 0))
            addLinktoMaterial( prev_sib );
        if($(e.currentTarget).find(`[data-id="#${e.currentTarget.id}"]`).length == 0)
            addLinktoMaterial( $(e.currentTarget) );
        if(next_sib.length && (next_sib.find(`[data-id="#${next_sib[0].id}"]`).length == 0))
            addLinktoMaterial( next_sib );
    })     

                
                
    // find all the figs & tables
    $(".table-number, .figure-number").each(function( index, el ) {
    // $(".bibUl li, .table-number, .figure-number").each(function( index, el ) {
        // el == this

        addLinktoMaterial($(el));
    });
   

    // listen to add event from db
    db.collection(COLLECTION_NAME)
    .onSnapshot((doc) => {
        // if(!init) {
        //     debugger;
        //     init = !init;

        //     return; 
        // }
        if(!doc.docChanges) return;
        doc.docChanges().forEach(function(change) {
            if (change.type === "added") {
                // change.doc here is new a new document added by me
                // if it is grey, don't add it to the other clients' end
                if((change.doc.data().body[0].author != session_id) && (change.doc.data().body[0].purpose == "bridge"))
                    r.addAnnotation(change.doc.data());
            } else if (change.type === "removed") {
                // change.doc here is new a new document removed by me
                if(r.getAnnotations().length != doc.docChanges().length)
                    r.removeAnnotation(change.doc.data());
            } else {
            // updated
            if((change.doc.data().body[0].author != session_id) && (change.doc.data().body[0].purpose == "bridge"))
                r.addAnnotation(change.doc.data());
            }
        });
    });

    r.on('createAnnotation', function (a) {
        // alert('created'); 
        ok_clicked = true;
        console.log("created");
        console.log(r.getAnnotations());      

    if(a.body[0].purpose == "pre-select") {
        let bridge_snippet = a.target.selector[0].exact;

        // add another pending bridges
        pending_bridges.push({
        "snippet": bridge_snippet,
        "id": a.id
        });
        
        r.removeAnnotation(a);

        a.body[0] = {
        "purpose": "pre-bridge",
        "value": "GREY",
        "blob": a.target.selector[0].exact,
        "author": session_id
        }
        
        r.addAnnotation(a);

        // manually update the old annotation from db since the updateAnnotation event is not triggered
        db.collection(COLLECTION_NAME).where("id","==", a.id).get().then(function(querySnapshot) {
            querySnapshot.docs[0].ref.update({
            body: [a.body[0]]
            });   
        })

        addBookmarkDropdown(a);

    } else if (a.body[0].purpose == "bridge") {
        createNewBridge(a);
    }

    document.querySelector(`[data-id='${a.id}']`).id = (a.id[0] == "#" ? a.id.substr(1) : a.id);
    
    if(a.body[0].purpose == "pre-bridge") {
        document.dispatchEvent(new CustomEvent("createBookmark", { detail: {
            id: a.id
        }}));
    }
    });

    r.on('deleteAnnotation', function (a) {
        // remove option from dropdowns
        $(`option[value="${a.id}"]`).remove();
        
        // remove from pending bridges
        pending_bridges = pending_bridges.filter(p => p.id != a.id)
    });
    
    
    r.on('updateAnnotation', function (a, previous) {
        // when bookmark became link

        // update a's purpose to bridge
        // find the source annotation `data-id` and update the another end
        let a_cpy = {...a};
        
        r.removeAnnotation(a_cpy);

        a_cpy.body[0] = {
        "purpose": "bridge",
        "value": "here",
        "blob": a_cpy.target.selector[0].exact,
        "author": session_id
        }
        
        r.addAnnotation(a_cpy);
        
        pending_bridges = pending_bridges.filter(p => p.id != a_cpy.id)

        // manually update the old annotation from db since the updateAnnotation event is not triggered
        db.collection(COLLECTION_NAME).where("id","==", a_cpy.id).get().then(function(querySnapshot) {
            querySnapshot.docs[0].ref.update({
            body: [a_cpy.body[0]]
            });   
        })
      
        // update source bookmarks
        createNewBridge(a_cpy);
    });

    // Wire the Add/Update/Remove buttons
    // document.getElementById('add-annotation').addEventListener('click', function () {
    //   r.addAnnotation(myAnnotation);
    // });

    // document.getElementById('update-annotation').addEventListener('click', function () {
    //   r.addAnnotation(Object.assign({}, myAnnotation, {
    //     'body': [{
    //       'type': 'TextualBody',
    //       'value': 'This annotation was added via JS, and has been updated now.'
    //     }],
    //     'target': {
    //       'selector': [{
    //         'type': 'TextQuoteSelector',
    //         'exact': 'ingenious hero who'
    //       }, {
    //         'type': 'TextPositionSelector',
    //         'start': 43,
    //         'end': 61
    //       }]
    //     }
    //   }));
    // });

    // document.getElementById('remove-annotation').addEventListener('click', function () {
    //   r.removeAnnotation(myAnnotation);
    // });

    // $('div').mouseup(function() {
        
    // });

    function addLinktoMaterial(el) {
        let annotaton_template = {
            '@context': 'http://www.w3.org/ns/anno.jsonld',
            'id': 'anno2',
            'type': 'Annotation',
            'body': [{
                "purpose": "material",
                "type": "TextualBody",
                "value": "RED"
            }],
            'target': {
                'selector': [{
                'type': 'TextQuoteSelector',
                'exact': 'that ingenious hero'
                }, {
                'type': 'TextPositionSelector',
                'start': 1183,
                'end': 1208
                }]
            }
        };
        
        let loc = []; 
        if(el.parents(".table-caption").length) {
            loc = getIndicesOf(el.parents(".table-caption").text(), $("#content").text());
        } else {
            loc = getIndicesOf(el.text(), $("#content").text());
            console.log(el.text(),  loc);
        }
        
    
        let a = JSON.parse(JSON.stringify(annotaton_template));
        // Object.assign(a, annotaton_template)
    
        a.id = "#" + (el.attr("id") || el.parents(".table-responsive").attr("id") || el.parents("figure").attr("id"));
        a.target.selector[1] = {...{
            'type': 'TextPositionSelector',
            'start': loc[0],
            'end': loc[0] + $.trim(el.text()).length
        }}
        r.addAnnotation({...a});
        // debugger;
        
        $(`[data-id="${a.id}"]`).each(function(i, el) {
            if(($(el).parents('figure').length == 0) && ($(el).parents('.table-caption').length == 0) && ($(el).parents('.bibUl').length == 0))
                $(el).remove();
        })
    }

    
    
    function getIndicesOf(searchStr, str, caseSensitive) {
        var searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        var startIndex = 0, index, indices = [];
        if (!caseSensitive) {
            str = str.toLowerCase();
            searchStr = searchStr.toLowerCase();
        }
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    }

    function createNewBridge(a) {
        // find the source annotation `data-id` and update the another end
        let src_annotation = r.getAnnotations().filter(an => an.id == src_id)[0];
        
        r.removeAnnotation(src_annotation);

        src_annotation.body[0] = {
        "purpose": "bridge",
        "href": a.id,
        "value": "here",
        "blob": a.target.selector[0].exact,
        "author": session_id
        }
        
        r.addAnnotation(src_annotation);
        
        

        // manually update the old annotation from db since the updateAnnotation event is not triggered
        db.collection(COLLECTION_NAME).where("id","==", src_annotation.id).get().then(function(querySnapshot) {
            querySnapshot.docs[0].ref.update({
            body: [src_annotation.body[0]]
            });   
        })

        // remove the pending bridges
        pending_bridges = pending_bridges.filter(p => p.id != src_annotation.id)
        
        // add a highlight to newly added annotation
        document.querySelectorAll(".r6o-annotation").forEach(e => e.classList.remove("highlighted"));
        document.querySelectorAll(`[data-id='${a.id}']`).forEach(e => e.classList.add("highlighted"));


        // if the term is appeared multiple times, add bridges from the occurence 
        let term = src_annotation.target.selector[0].exact;
        let occurences = getIndicesOf(term, $("#content").text());
        
        // temporarily add to only first ten
        occurences = occurences.slice(0, 10);
        occurences.forEach(function(e) {
            
            if(src_annotation.target.selector[1].start == e)
                return;

            // if this occurence is in the target part, skip this occurence 
            if(Math.max(e, a.target.selector[1].start) <= Math.min(e + term.length, a.target.selector[1].end))
                return;

            let extra_annon = JSON.parse(JSON.stringify(src_annotation));
            extra_annon.id = "#ocean" + Math.random();
            extra_annon.target.selector[1] = {
                'type': 'TextPositionSelector',
                'start': e,
                'end': e + term.length
            };
            r.addAnnotation(extra_annon);

            // save it to db
            db.collection(COLLECTION_NAME).add(
                extra_annon
            )
        })

        // remove from dropdown
        $(`option[value="${src_annotation.id}"]`).remove();

        document.dispatchEvent(new CustomEvent("createBridge", { detail: {
            id: src_annotation.id
        }}));
        
    }

    function createNewTab(loc=0, tab_name="New tab", scroll=true) {
        $("li").removeClass("glow");
        $(".label-warning").remove();

        // add the new tab after Main tab
        $(`<li class="glow" tabID=${tabID}>${tab_name} <span class="label label-warning" style="color:black">New</span> <span class="close"></span></li>`).insertAfter(".context-menu ul li:first");

        scrollTab.push({
            "name": tab_name,
            "loc": loc
        });

        if(scroll) {
            // do effect of flashing only when "open in new tab"
            $("body").css("visibility", "hidden");
            sleep(300).then(() => {
                // Do something after the sleep!
                $("body").css("visibility", "visible");
            });

            openTab(tabID, scroll);
        }
        
        tabID++;
        
    }

    function highlightHref(tgt_href) {
        document.querySelectorAll(".r6o-annotation, a").forEach(e => e.classList.remove("highlighted"));

        document.getElementById(tgt_href.substring(1)).classList.add("highlighted");
        document.querySelectorAll(`[data-id='${tgt_href}']`).forEach(e => e.classList.add("highlighted"));
    }

    function openTab(inTabID, scroll=true) {
        // save the current tab position
        scrollTab[currentTabID].loc = $(window).scrollTop();

        currentTabID = inTabID;

        // make the contextmenu follow the scroll
        $(".context-menu").css({
            top: ($(".context-menu").offset().top + scrollTab[inTabID].loc - $(window).scrollTop()) + "px"
        });

        // open the selected tab
        if(scroll)
            $(window).scrollTop(scrollTab[inTabID].loc);

        $(`.context-menu ul li`).removeClass('selected');
        $(`.context-menu ul li[tabID=${currentTabID}]`).addClass('selected');
    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }  

    

    function getSelectedText() {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (document.selection) {
            return document.selection.createRange().text;
        }
        return '';}
    // Switch annotation mode (annotation/relationships)
    var annotationMode = 'ANNOTATION'; // or 'RELATIONS'

    // var toggleModeBtn = document.getElementById('toggle-mode');
    // toggleModeBtn.addEventListener('click', function () {
    //   if (annotationMode === 'ANNOTATION') {
    //     toggleModeBtn.innerHTML = 'MODE: RELATIONS';
    //     annotationMode = 'RELATIONS';
    //   } else {
    //     toggleModeBtn.innerHTML = 'MODE: ANNOTATION';
    //     annotationMode = 'ANNOTATION';
    //   }

    //   r.setMode(annotationMode);
    // });
})();

function contextmenuClick(e) {
    debugger;
    // swith tab 
}
