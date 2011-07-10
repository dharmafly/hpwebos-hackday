(function(){
    "use strict";

    var $window = jQuery(window),
        body = document.body,
        $body = jQuery(body),
        width = window.innerWidth,
        height = window.innerHeight,
        content = jQuery("section.content"),
        myScroll;

    /////

    function constructAdjacents(content){
        var adjacentHtml = "<section class=adjacent></section>",
            adjacentBlock = _.map(_.range(4), function(){
                return adjacentHtml;
            }).join("");

        content
            .before(adjacentBlock)
            .after(adjacentBlock);
            
        content.siblings().andSelf()
            .each(function(i, section){
                var style = section.style;
            
                /* rows */
                style.top = i < 3 ?
                    0 : i < 6 ?
                    height + "px" :
                    height * 2 + "px";
                
                /* columns */  
                style.left = (i + 3) % 3 === 0 ?
                    0 : (i + 2) % 3 === 0 ?
                    width + "px" :
                    width * 2 + "px";
                    
                style.width = width + "px";
                style.height = height + "px";
            });
            
        content.parent()
            .width(width * 3)
            .height(height * 3);
    }

    function scrollToElem(elem){
        var offset = elem.offset();
        window.scroll(offset.left, offset.top);
    }

    function initInternalScroller(){
        content.append("<div id=internalscroller></div>");
    }
    
    function init() {
	    setTimeout(function () {
		    window.s = myScroll = new iScroll("scroller", {hideScrollbar:true, snap: "section", bounce:false});
		    myScroll.scrollToElement(content[0], 0);
		    
		    initInternalScroller();
		    body.style.visibility = "visible";
	    }, 100);
    }

    /////

    body.style.visibility = "hidden";
    constructAdjacents(content);
    jQuery(init);
}());
