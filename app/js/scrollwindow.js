(function(){
    "use strict";

    var $window = jQuery(window),
        body = document.body,
        $body = jQuery(body),
        width = window.innerWidth,
        height = window.innerHeight,
        content = jQuery("section.content"),
        allSections,
        myScroll;

    /////

    function constructAdjacents(content){
        var adjacentHtml = "<section class=adjacent><div class=articles-container></div></section>",
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
            
        allSections = jQuery("section.content, section.adjacent");
    }

    function scrollToElem(elem){
        var offset = elem.offset();
        window.scroll(offset.left, offset.top);
    }
    
    function makeElementVisible(elem){
        allSections.css("visibility", "hidden");
        elem.css("visibility", "visible");
    }
    
    function init() {
	    setTimeout(function () {
		    window.myScroll = myScroll = new iScroll("scroller", {vScrollbar:false, hScrollbar:false, hideScrollbar:true, snap: "section", onScrollEnd:function(){
		        var x = Math.abs(myScroll.x),
		            y = Math.abs(myScroll.y),
		            halfWidth = width / 2,
		            halfHeight = height / 2;
		        
		        allSections.each(function(i, el){
	                var elem = jQuery(el),
	                    left = parseInt(elem.css("left"), 10),
	                    top = parseInt(elem.css("top"), 10);
	                    
	                if (left - halfWidth < x && left + halfWidth > x && top - halfHeight < y && top + halfHeight > y){
	                    makeElementVisible(elem);
	                    return false;
	                }
	            });
		        
		    }});
		    myScroll.scrollToElement(content[0], 0);
		    body.style.visibility = "visible";
	    }, 100);
    }

    /////

    body.style.visibility = "hidden";
    constructAdjacents(content);
    jQuery(init);
}());
