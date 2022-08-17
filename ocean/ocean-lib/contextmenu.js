let $right_clicked_tgt;

$(document).ready(function () {
    

    // disable right click and show custom context menu
    $('body').on('contextmenu', cxt_menu_tgt, function (e) {
        if(e.target.tagName == "IMG")
            return true;
        var id = this.id;
        $("#txt_id").val(id);

        $right_clicked_tgt = $(e.target).parents(".appended-text").get() ?
            $(e.target).parents(".appended-text") 
            : $(e.target);

        // remove the new item effect if there is anything lingering 
        $("li").removeClass("glow");
        $(".label-warning").remove();

        var top = e.pageY + 5;
        var left = e.pageX;

        // Show contextmenu
        $(".context-menu").toggle(100).css({
            top: top + "px",
            left: left + "px"
        });

        // disable default context menu
        return false;
    });

    // Hide context menu
    $(document).bind('contextmenu click', function (e) {
        console.log(e.target.tagName);
        let is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        if($(e.target).parents(".context-menu").length || $(e.target).hasClass('close'))
            return;

        if(["LI", "BUTTON", "INPUT", "SELECT"].includes(e.target.tagName)) {
            return;
        }

        if(!is_safari || !e.ctrlKey) {
            $(".context-menu").hide();
            $("#txt_id").val("");
        }
        
    });

    // disable context-menu from custom menu
    $('.context-menu').bind('contextmenu', function () {
        return false;
    });

    // Clicked context-menu item
    $("body").on("click", ".context-menu li", function(e) {
        // if( !$(e.target).hasClass("close") ) {
        //     $right_clicked_tgt.hide();
        //     $(".context-menu").hide();
        // }
        
        contextmenuClick(e);
    })
});