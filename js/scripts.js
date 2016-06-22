//-----------------JQUERY WRAPPERS----------------//
;var NS = {};//declaring ns in outer scope
;(function($) {//extending to include jquery so some functions can be written in jquery
NS.WLFUN = {

//happens on youtube api callback
videoLoad: function(elem){
    
    var videoElem = $(elem);
    var thisID = videoElem.attr('id'); 
    var detail = $("#"+thisID+" .videoPlay");
    var auto = detail.attr('data-auto') == "1" ? true : false;
    
    if ($('#' + thisID + ' .wl_videoImage').length !=0) {
        //console.log('image exists');
        if (auto) {
            //console.log('autoplay');
            NS.WLFUN.imageToIframe(videoElem);
            NS.WLFUN.sizeVideo(videoElem);
        }else{
            //console.log('not autoplay');
            NS.WLFUN.sizeVideoImage(videoElem);
        }
    }else if($('#' + thisID + ' .wl_video').length !=0){
        //console.log('video exists');
        NS.WLFUN.sizeVideo(videoElem);
    }
                    
},
//USE: NS.WLFUN.videoLoad(elem);

imageToIframe: function(elem){
    var thisID = elem.attr('id');
    
    //params
    var detail = $("#"+thisID+" .videoPlay");
    var service = detail.attr('data-service');
    var videoID = detail.attr('data-videoid');
    var height = parseFloat(detail.attr('data-height'));
    var minHeight = parseFloat(detail.attr('data-minheight'));
    var width = parseFloat(detail.attr('data-width'));
    var limit = detail.attr('data-limit') != "" ? detail.attr('data-limit') : false;
    var maxWidth = parseFloat(detail.attr('data-maxwidth'));
    var auto = detail.attr('data-auto') == "1" ? true : false;
    var loop = detail.attr('data-repeat') == "1" ? true : false; 
    var iframeID = thisID + '_iframe';
    var mute = detail.attr('data-mute') == "1" ? true : false;
    var overlay = detail.attr('data-overlay') != "" ? $.parseJSON(detail.attr('data-overlay')) : "";
    var videoBack = detail.attr('data-videobk');
    elem.css({'background-color':videoBack});
    
    //switch between vimeo and youtube
    if (service == 'youtube') {
    
    var iframe = '<div class="wl_videoWrap fluid-width-video-wrapper" style="min-height:' + minHeight+'px; ' + (limit && maxWidth != '' ? 'max-width: ' + maxWidth +'px; ' : '') + '"><iframe id="' + iframeID + '" class="wl_video" width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + videoID + '?vq=hd720&rel=0&autohide=1&controls=0&modestbranding=1&theme=light&hd=1&color=white&enablejsapi=1&showinfo=0&wmode=opaque'+(loop ? '&loop=1&playlist=' + videoID : '') + '&autoplay=1" frameborder="0" allowfullscreen></iframe><div class="wl_videoOverlay"><div class="inner"><div class="inner"><div class="inner">'+overlay+'</div></div></div></div></div>';
    
    //replace image and image wrap with iframe and iframe wrap
    detail.html(iframe);

    //start video
    NS.WLFUN.youtubeInstance(iframeID);
    
    }else if(service=='vimeo'){
    
    var iframe = '<div class="wl_videoWrap fluid-width-video-wrapper" style="min-height:' + minHeight+'px; ' + (limit && maxWidth != '' ? 'max-width: ' + maxWidth +'px; ' : '') + '"><iframe  id="' + iframeID + '" class="wl_video" width="' + width + '" height="' + height + '" src="https://player.vimeo.com/video/' + videoID + '?&title=0&byline=0&portrait=0'+(loop ? '&loop=1' : '')+'&autoplay=1&color=ffffff&api=1" frameborder="0"></iframe><div class="wl_videoOverlay"><div class="inner"><div class="inner"><div class="inner">'+overlay+'</div></div></div></div></div>';
    
    //replace image and image wrap with iframe and iframe wrap
    detail.html(iframe);
    
    //start video
    NS.WLFUN.vimeoInstance(iframeID);
    
    }
},
//USE: NS.WLFUN.imageToIframe(elem);

unslash: function(str){
    return str.replace(/([^:]\/)\/+/g, "$1");
},
//USE: NS.WLFUN.unslash(str);

iframeToImage: function(elem){

    var thisID = elem.attr('id');
    
    //parameters
    var detail = $('#'+thisID+' .videoPlay');
    var limit = detail.attr('data-limit') != "" ? detail.attr('data-limit') : false;
    var maxWidth = parseFloat(detail.attr('data-maxwidth'));
    var minHeight = parseFloat(detail.attr('data-minheight'));
    var height = parseFloat(detail.attr('data-height'));
    var width = parseFloat(detail.attr('data-width'));
    var thumbAlt = detail.attr('data-imgalt');
    var thumbUrl = detail.attr('data-imgurl');
    var imgLabel = $.parseJSON(detail.attr('data-label'));
    var imgID = thisID.replace('wl_video_','wl_videolabel_');
    
    var imgPlaceholder = '<div class="wl_videoImageWrap" style="margin: 0 auto; min-height: ' +minHeight + 'px; ' + (limit ?  'max-width: ' + maxWidth + 'px' : "") + '"><img class="wl_videoImage" src="'+thumbUrl+'" alt="'+thumbAlt+'" width="'+width+'" height="'+height+'" /><div class="wl_videoClick" id="' + imgID + '" ><div class="inner"><div class="inner"><div class="inner">'+imgLabel+'</div></div></div></div></div>';
    
    var imageBack = detail.attr('data-imagebk');
    elem.css({'background-color':imageBack});
    
    detail.html(imgPlaceholder);
    
},
//USE: NS.WLFUN.iframeToImage(elem);

onPlayerStateChange: function(event){
    
var elem = event.target.getIframe();
var iframeID = $(elem).attr('id');
var thisID = iframeID.replace("_iframe","");
var videoElem = $('#' + thisID);
var detail = $('#' + thisID+' .videoPlay');
var loop = detail.attr('data-repeat') == "1" ? true : false;
    
//event.target.stopVideo();
//event.target.pauseVideo();
//event.target.playVideo();
        
switch(event.data) {
case 3:
//console.log('buffering' + thisID);
break;
case 1:
//console.log('playing');
break;
case 2:
//console.log('paused');
break;
case 0:
//console.log('end');

if(!loop){
    //console.log('no loop');
    NS.WLFUN.iframeToImage(videoElem);
    NS.WLFUN.sizeVideoImage(videoElem);
}

break;
default:          
return;
}

},
//USE: NS.WLFUN.onPlayerStateChange(event);

vimeoInstance: function(thisId){
    //with froogaloop
    var iframe =  $("#"+thisId);
    var videoElemId = thisId.replace("_iframe","");
    var videoElem = $("#"+videoElemId);
    var player = new Vimeo.Player(iframe);
    
    var detail = $('#' + videoElemId+' .videoPlay');
    var loop = detail.attr('data-repeat') == "1" ? true : false;
    
    //ready
    player.ready().then(function(){

        //console.log('ready now');
        if (!loop) {
            player.on('playProgress', onPlayProgress);
        }
        
    }).catch(function(error){
        //console.log(error);
    });

    function onPlayProgress(data) {
        //console.log(data.seconds + 's played');
        var seconds = data.seconds;
        var total = data.duration;
        if (seconds >= (data.duration - 1)) {
            NS.WLFUN.iframeToImage($("#"+videoElemId));
            NS.WLFUN.sizeVideoImage($("#"+videoElemId));
        }
    }
    
},
//USE: NS.WLFUN.vimeoInstance(thisId);

youtubeInstance: function(thisId){
    //console.log(thisId);
    var player;
    player = new YT.Player(thisId, {
        events: {
            'onReady': NS.WLFUN.onPlayerReady,
            'onStateChange': NS.WLFUN.onPlayerStateChange
        }
    });
},
//USE: NS.WLFUN.onYouTubeAPIReady(thisId);

onPlayerReady: function(event){
    //console.log('player ready');
    var elem = event.target.getIframe();
    var iframeID = $(elem).attr('id');
    var thisID = iframeID.replace("_iframe","");
    var videoElem = $('#' + thisID+' .videoPlay');
    var mute = videoElem.attr('data-mute') == "1" ? true : false;
    
    if (mute) {
        //console.log('mute');
        event.target.mute();
    } 
},
//USE: NS.WLFUN.onPlayerReady(event);

sizeVideo: function(elem){
    //console.log('sizing video');
    var thisID = elem.attr('id');
    var detail = $("#"+thisID+" .videoPlay");
                
    //params from shortcode
    var crop = detail.attr('data-crop');
    var maxHeight = parseFloat(detail.attr('data-maxheight'));
    var minHeight = parseFloat(detail.attr('data-minheight'));
    
    var videoWrap = $("#"+thisID+" .wl_videoWrap");
    var videoWrapWidth = videoWrap.width();
    var video = $("#"+thisID+" .wl_video");
    var videoOrigHeight = parseFloat(video.attr('height'));
    var videoOrigWidth = parseFloat(video.attr('width'));
    var service = detail.attr('data-service');
    
    //new
    var newWidth = 0;
    var newHeight = 0;
    var newMaxWidth = 0;
    var newMarginLeft = 0;
    var newMarginTop = 0;
    var newLeft = 0;
    var newTop = 0;
    var newBottom = "auto";
    var extraPadding = (service == "vimeo" ? NS.WLFUN.percentage(80,minHeight) : 0);
    
    //determine new video height and width ratio from original values
    var videoHeight = NS.WLFUN.ratio(videoWrapWidth,videoOrigWidth,videoOrigHeight);
    var videoWidth = NS.WLFUN.ratio(minHeight,videoOrigHeight,videoOrigWidth);
    
    //check min width
    if (minHeight >= videoHeight) {
        //console.log('video is smaller than the min height');
        
        //set height/width
        newHeight = minHeight + extraPadding;
        newWidth = videoWidth;
        newMaxWidth = "none";
        newTop = "50%";
        newMarginTop = "-"+(newHeight/2);
        
        //adjust center positioning of video if width is greater than wrapper width
        if (newWidth > videoWrapWidth) {
            //console.log("setting video to offset left and right as it's smaller than min height but wider than screen width");
            newMarginLeft = "-" + (newWidth/2);
            newLeft = "50%";
        }
        
    }else{
        console.log('video is larger than the min height');
        
        //set height/width
        extraPadding = (service == "vimeo" ? NS.WLFUN.percentage(80,videoHeight) : 0);
        newHeight = videoHeight + extraPadding;
        newWidth = videoWrapWidth;
        newMaxWidth = "100%";
         
        if (maxHeight < newHeight) {
            //console.log('video is larger than max height');
            //crop according to parameter
            switch(crop){
                case 'top':
                    //console.log("cropping from top");
                    newTop = 0;
                    newBottom = "auto";
                    newMarginTop = 0;
                    break;
                case 'center':
                    //console.log("cropping from center");
                    newTop = "50%";
                    newBottom = "auto";
                    newMarginTop = "-"+(newHeight/2);
                    break;
                case 'bottom':
                    //console.log("cropping from bottom");
                    newTop = "auto";
                    newBottom = 0;
                    newMarginTop = 0;
                    break;
                default:
                    break;
            };
            
        }else{
            //console.log('video is smaller than max height');
            //do nothing
        }
    }
    
    //set new attributes to the video element
    video.css({'width':newWidth+'px','height':newHeight+'px','max-width':newMaxWidth,'top':newTop,'left':newLeft,'bottom':newBottom,'margin-left':newMarginLeft+'px','margin-top':newMarginTop+'px'});

},
//USE: NS.WLFUN.sizeVideo(elem);

sizeVideoImage: function(elem){
   
    var thisID = elem.attr('id');
    var detail = $("#"+thisID+" .videoPlay");
                
    //params from shortcode
    var crop = detail.attr('data-crop');
    var maxHeight = parseFloat(detail.attr('data-maxheight'));
    var minHeight = parseFloat(detail.attr('data-minheight'));
    
    //var thisID = $(elem).attr('id');
    var imageWrap = $("#"+thisID+" .wl_videoImageWrap");
    var imageWrapWidth = imageWrap.width();
    var image = $("#"+thisID+" .wl_videoImage");
    var imageOrigHeight = parseFloat(image.attr('height'));
    var imageOrigWidth = parseFloat(image.attr('width'));
    
    //new
    var newWidth = 0;
    var newHeight = 0;
    var newMaxWidth = 0;
    var newMarginLeft = 0;
    var newMarginTop = 0;
    var newLeft = 0;
    var newTop = 0;
    var newBottom = "auto";
    
    //determine new image height and width ratio from original values
    var imageHeight = NS.WLFUN.ratio(imageWrapWidth,imageOrigWidth,imageOrigHeight);
    var imageWidth = NS.WLFUN.ratio(minHeight,imageOrigHeight,imageOrigWidth);
    
    //check min width
    if (minHeight >= imageHeight) {
        //console.log('image is smaller than the min height');
        
        //set height/width
        newHeight = minHeight;
        newWidth = imageWidth;
        newMaxWidth = "none";
        
        //adjust center positioning of image if width is greater than wrapper width
        if (newWidth > imageWrapWidth) {
            //console.log("setting image to offset left and right as it's smaller than min height but wider than screen width");
            newMarginLeft = "-" + (newWidth/2);
            newLeft = "50%";
        }
        
    }else{
        //console.log('image is larger than the min height');
        
        //set height/width
        newHeight = imageHeight;
        newWidth = imageWrapWidth;
        newMaxWidth = "100%";
         
        if (maxHeight < imageHeight) {
            //console.log('image is larger than max height');

            //crop according to parameter
            switch(crop){
                case 'top':
                    //console.log("cropping from top");
                    newTop = 0;
                    newBottom = "auto";
                    newMarginTop = 0;
                    break;
                case 'center':
                    //console.log("cropping from center");
                    newTop = "50%";
                    newBottom = "auto";
                    newMarginTop = "-"+(imageHeight/2);
                    break;
                case 'bottom':
                    //console.log("cropping from bottom");
                    newTop = "auto";
                    newBottom = 0;
                    newMarginTop = 0;
                    break;
                default:
                    break;
            };
            
        }else{
            //console.log('image is smaller than max height');
            //do nothing
        }
    }
    
    //set new attributes to the image element
    image.css({'width':newWidth+'px','height':newHeight+'px','max-width':newMaxWidth,'top':newTop,'left':newLeft,'bottom':newBottom,'margin-left':newMarginLeft+'px','margin-top':newMarginTop+'px'});
    
},
//USE: NS.WLFUN.sizeVideoImage(elem);

percentage: function(percentage,source){
    //40% of 1000 = NS.WLFUN.percentage(40,1000); 
    return percentage*(source/100);
},
//USE: NS.WLFUN.percentage(percentage,source);

ratio: function(paramNew,paramOrig,compOrig){
    var ratio = 0; //used for ratio
    var ratio = paramNew / paramOrig; // get ratio for scaling image
    return compOrig * ratio;
}
//USE: NS.WLFUN.ratio(paramNew,paramOrig,compOrig);

};//end WLFUN
})(jQuery);//END WL FUNCTIONS
    
//YouTube API callback to init video when ready
function onYouTubeIframeAPIReady() {
    var videoElems = document.querySelectorAll('.wl_videoElem.video-youtube');
    if (videoElems.length != 0) {
        //console.log(videoElems.length);
        for(var i=0;i<videoElems.length;i++){
            NS.WLFUN.videoLoad(videoElems[i]);
        }
    }
}
      
jQuery.noConflict();
(function( $ ) {
$(function() {

//-----------------ON WINDOW LOAD----------------//
jQuery(window).on('load',  function() {

});//END WINDOW ON LOAD

//----------------ON DOCUMENT READY--------------//
jQuery(document).ready(function(){

//-----------------INIT-----------------//

//load images or videos if they exist and if not youtube
if ($('.wl_videoElem.video-vimeo').length != 0) {
    $('.wl_videoElem.video-vimeo').each(function(){
        NS.WLFUN.videoLoad($(this));
    });
}

//click event...for dynamic elements
$('.wl_videoElem').on('click','.wl_videoClick', function(){
    var thisID = $(this).attr('id');
    var parentID = thisID.replace('wl_videolabel_','wl_video_');
    var thisElem = $('#'+parentID);
    NS.WLFUN.imageToIframe(thisElem);
    NS.WLFUN.videoLoad(thisElem);
});

});//end doc ready

//ON RESIZE
$(window).resize(function() {

//load video and banner adj
if ($('.wl_videoElem').length != 0) {
    $('.wl_videoElem').each(function(){
        //resize
        var thisID = $(this).attr('id');
        if ($('#' + thisID + ' .wl_videoImage').length !=0) {
            NS.WLFUN.sizeVideoImage($(this));
        }else if($('#' + thisID + ' .wl_video').length !=0){
            NS.WLFUN.sizeVideo($(this));
        }
    });
}

});//end resize

});
})(jQuery);