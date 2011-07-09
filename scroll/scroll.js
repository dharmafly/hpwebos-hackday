var $window = jQuery(window);

function constructAdjacents(content){
    var adjacentHtml = "<section class=adjacent>foo</section>",
        adjacentBlock = _.map(_.range(4), function(){
            return adjacentHtml;
        }).join("");

    content
        .before(adjacentBlock)
        .after(adjacentBlock)
        .text("bar");
        
    content.siblings().andSelf()
        .each(function(i, section){
            var style = section.style;
        
            /* rows */
            style.top = i < 3 ?
                0 : i < 6 ?
                "100%" :
                "200%";
            
            /* columns */  
            style.left = (i + 3) % 3 === 0 ?
                0 : (i + 2) % 3 === 0 ?
                "100%" :
                "200%";
        });
}

function scrollToElem(elem){
    var offset = elem.offset();
    window.scrollTo(offset.left, offset.top);
}

/////

var content = jQuery("section.content");
constructAdjacents(content);

// Wait for paint
var t = 0,
    interval = 100,
    intervalRef = window.setInterval(function(){
        if (t && window.pageXOffset){
            window.clearInterval(intervalRef);
            return;
        }
        
        scrollToElem(content);
        t += interval;
    }, interval);

jQuery(function(){
    if (window.PalmSystem) {
        window.PalmSystem.stageReady();
    }
});
