//-----------------JQUERY WRAPPERS----------------//
;var NS = {};//declaring ns in outer scope
;(function($) {//extending to include jquery so some functions can be written in jquery
NS.WLFUN = {

//happens on video api callback
videoLoad: function(elem){
    
    var videoElem = $(elem);
    var thisID = videoElem.attr('id'); 
    var detail = $("#"+thisID+" .videoPlay");
    var auto = detail.attr('data-auto') == "1" ? true : false;
    
    if ($('#' + thisID + ' .wl_videoImageWrap').length !=0 && $('#' + thisID + ' .wl_videoImageWrap').css('display') == 'block') {
        //console.log('image exists');
        if (auto && $('#' + thisID + ' .wl_video').length == 0) {
            console.log('autoplay');
            NS.WLFUN.sizeVideoImage(videoElem);
            NS.WLFUN.imageToIframe(videoElem);
        }else{
            //console.log('not autoplay');
            NS.WLFUN.sizeVideoImage(videoElem);
        }
    }
             
},
//USE: NS.WLFUN.videoLoad(elem);

imageToIframe: function(elem){
    var thisID = elem.attr('id');
    
    //console.log('image to iframe function');
    
    //params
    var detail = $("#"+thisID+" .videoPlay");
    var service = detail.attr('data-service');
    var videoID = detail.attr('data-videoid');
    var height = parseFloat(detail.attr('data-height'));
    var minHeight = parseFloat(detail.attr('data-minheight'));
    var width = parseFloat(detail.attr('data-width'));
    var limit = detail.attr('data-limit') == "1" ? true : false;
    var maxWidth = parseFloat(detail.attr('data-maxwidth'));
    var auto = detail.attr('data-auto') == "1" ? true : false;
    var loop = detail.attr('data-repeat') == "1" ? true : false; 
    var iframeID = thisID + '_iframe';
    var mute = detail.attr('data-mute') == "1" ? true : false;
    var overlay = detail.attr('data-overlay') != "" ? $.parseJSON(detail.attr('data-overlay')) : "";
    var videoBack = detail.attr('data-videobk');
    
    //display loading image
    NS.WLFUN.startLoading(thisID);
    
    elem.css({'background-color':videoBack});
    
    //switch between vimeo and youtube
    if (service == 'youtube') {
    //min-height:' + minHeight+'px; 
    if ($('iframe#'+iframeID).length == 0) {
        var iframe = '<div class="wl_videoWrap fluid-width-video-wrapper" style="' + (limit && maxWidth != '' ? 'max-width: ' + maxWidth +'px; ' : '') + ' background-color: ' + videoBack + '; "><iframe style="background-color: ' + videoBack + ';" id="' + iframeID + '" class="wl_video" width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + videoID + '?vq=hd720&rel=0&autohide=1&controls=0&modestbranding=1&theme=light&hd=1&color=white&enablejsapi=1&showinfo=0&wmode=opaque'+(loop ? '&loop=1&playlist=' + videoID : '') + '&autoplay=1" frameborder="0"></iframe><div class="wl_videoOverlay"><div class="inner"><div class="inner"><div class="inner">'+overlay+'</div></div></div></div></div>';
        //replace image and image wrap with iframe and iframe wrap
        detail.prepend(iframe);
    }
    
    //load
    NS.WLFUN.youtubeInstance(iframeID);
    
    }else if(service=='vimeo'){
    
        if ($('iframe#'+iframeID).length == 0) {
            var iframe = '<div class="wl_videoWrap fluid-width-video-wrapper" style="' + (limit && maxWidth != '' ? 'max-width: ' + maxWidth +'px; ' : '') + '"><iframe  id="' + iframeID + '" class="wl_video" style="background-color: ' + videoBack + '; " width="' + width + '" height="' + height + '" src="https://player.vimeo.com/video/' + videoID + '?&title=0&byline=0&portrait=0'+(loop ? '&loop=1' : '')+'&autoplay=1&color=ffffff&autopause=0&api=1" frameborder="0"></iframe><div class="wl_videoOverlay"><div class="inner"><div class="inner"><div class="inner">'+overlay+'</div></div></div></div></div>';
        //replace image and image wrap with iframe and iframe wrap
            detail.prepend(iframe);
        }
    
    NS.WLFUN.vimeoInstance(iframeID);

    }
    
},
//USE: NS.WLFUN.imageToIframe(elem);

unslash: function(str){
    return str.replace(/([^:]\/)\/+/g, "$1");
},
//USE: NS.WLFUN.unslash(str);

iframeToImage: function(elem){

    //console.log('iframe to image function');
    
    var thisID = elem.attr('id');
    
    //parameters
    var detail = $('#'+thisID+' .videoPlay');
    var limit = detail.attr('data-limit') == 1 ? true : false;
    var imgBack = detail.attr('data-imagebk');
    var maxWidth = parseFloat(detail.attr('data-maxwidth'));
    var minHeight = parseFloat(detail.attr('data-minheight'));
    var height = parseFloat(detail.attr('data-height'));
    var width = parseFloat(detail.attr('data-width'));
    var thumbAlt = detail.attr('data-imgalt');
    var thumbUrl = detail.attr('data-imgurl');
    var imgLabel = $.parseJSON(detail.attr('data-label'));
    var imgID = thisID.replace('wl_video_','wl_videolabel_');
    var service = detail.attr('data-service');
    
    //var imgPlaceholder = '<div class="wl_videoImageWrap" style="margin: 0 auto;  backgroud-color: ' + imgBack + '; ' + (limit ?  'max-width: ' + maxWidth + 'px' : "") + '"><img class="wl_videoImage" src="'+thumbUrl+'" alt="'+thumbAlt+'" width="'+width+'" height="'+height+'" /><div class="wl_videoClick" id="' + imgID + '" ><div class="inner"><div class="inner"><div class="inner">'+imgLabel+'</div></div></div></div></div>';
        
    var imageBack = detail.attr('data-imagebk');
    elem.css({'background-color':imageBack});
    
    //detail.html(imgPlaceholder);
    NS.WLFUN.sizeVideoImage(elem);
    $('#'+thisID + ' .wl_videoImageWrap').fadeIn('slow');
    
    if (service == "youtube") {
        //remove the video altogether if youtube. can't find another way yet of reinitializing
       $('#'+thisID+' .wl_videoWrap').remove();
    }
    
},
//USE: NS.WLFUN.iframeToImage(elem);

onPlayerStateChange: function(event, image = true, video=true){

//console.log('on player state change');

var elem = event.target.getIframe();
var iframeID = $(elem).attr('id');
var thisID = iframeID.replace("_iframe","");
var videoElem = $('#' + thisID);
var detail = $('#' + thisID+' .videoPlay');
var loop = detail.attr('data-repeat') == "1" ? true : false;

var begun = function(){
    //console.log('action begun');
    //hide loading image
    NS.WLFUN.stopLoading(thisID);
    NS.WLFUN.sizeVideo(videoElem);
    $('#'+thisID + ' .wl_videoImageWrap').fadeOut('slow');
}
var done = function(){
    //console.log('action done');
    NS.WLFUN.iframeToImage(videoElem);
}

//console.log(videoElem);
//event.target.stopVideo();
//event.target.pauseVideo();
//event.target.playVideo();

switch(event.data) {
case 3:
//console.log('buffering');
break;
case 1:
//console.log('event playing');

if (image) { 

    //hide image on start
    NS.WLFUN.youtubeTimer(event,1,'lt',begun);
    
    if(!loop){
    //console.log('no loop');
    //hide video on end
    NS.WLFUN.youtubeTimer(event,(event.target.getDuration()-2),'gt',done);
    }
    
    image = false;
}

break;
case 2:
//console.log('event paused');
break;
case 0:
//console.log('event end');
break;
default:          
return;
}

},
//USE: NS.WLFUN.onPlayerStateChange(event);

youtubeTimer: function(event,test,operator,action){
    //console.log(hello);
    var result = false;
    //console.log(hello);
    setTimeout(function(){
        
        var currentTime = event.target.getCurrentTime();
        
        //console.log(currentTime);
        //console.log(hello);
        
        if (operator == 'gt') {
            if (currentTime > test) {
                //console.log('greater then');
                action();
            }else{
                console.log('continuing');
                NS.WLFUN.youtubeTimer(event,test,operator,action);
            }
        }else if (operator == 'lt') {
            if (currentTime < test ) {
                //console.log('less then');
                action();
            }else{
                //console.log('continuing');
                NS.WLFUN.youtubeTimer(event,test,operator,action);
            }
        }
        
    },100);
    
},
//USE: NS.WLFUN.youtubeTimer(event,event.target.getCurrentTime(),'gt');

vimeoInstance: function(thisId, image = true, video = true){
    //with froogaloop
    var iframe =  $("#"+thisId);
    var videoElemId = thisId.replace("_iframe","");
    var videoElem = $("#"+videoElemId);
    var player = new Vimeo.Player(iframe);
    
    var detail = $('#' + videoElemId+' .videoPlay');
    var loop = detail.attr('data-repeat') == "1" ? true : false;
    var mute = detail.attr('data-mute') == "1" ? true : false;
    
    //NS.WLFUN.sizeVideo(videoElem);
    
    player.play().then(function(){
        //console.log('playing');
    }).catch(function(error){
        console.log(error);
    });
    
    //ready
    player.ready().then(function(){
        
        //console.log('ready now');
        player.on('playProgress', onPlayProgress);
        
        //set mute
        if (mute) {
            player.setVolume(0);
        }
        
       
    }).catch(function(error){
        console.log(error);
    });

    function onPlayProgress(data) {
        //console.log(data.seconds + 's played');
        var seconds = data.seconds;
        var total = data.duration;
        
        //show video when the video has started...meaning it's fully loaded
        if (seconds >= 0.01 && image) {
            //console.log('load video');
            
            NS.WLFUN.sizeVideo(videoElem);
            //NS.WLFUN.videoLoad(videoElem);
            
            $('#'+videoElemId + ' .wl_videoImageWrap').fadeOut('slow');
            NS.WLFUN.stopLoading(videoElemId);
            
            //console.log('hiding loading2');
            image = false;
        }
        
        //reset to image
        
        if (seconds >= (data.duration - 1) && video && !loop) {
            //console.log('load image');
            $('#'+videoElemId + ' .wl_videoImageWrap').fadeIn('slow');
            //NS.WLFUN.iframeToImage($("#"+videoElemId));
            //NS.WLFUN.sizeVideoImage($("#"+videoElemId));
            video = false;
        }
    }
    
},
//USE: NS.WLFUN.vimeoInstance(thisId);

startLoading: function(thisID){
    
    $("#"+thisID+" .loading").fadeIn('slow',function(){
        var rotation = function (){
        $("#"+thisID+" .loading").rotate({
          angle:0, 
          animateTo:360, 
          callback: rotation
        });
        }
        rotation();
    });
    
},
//USE: NS.WLFUN.startLoading(thisID);

stopLoading: function(thisID){
    $("#"+thisID+" .loading").fadeOut('slow',function(){
        $("#"+thisID+" .loading").stopRotate();
    });
},
//USE: NS.WLFUN.stopLoading(thisID);

youtubeInstance: function(thisId){
    //console.log('youtube instance');
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
    var videoWrapHeight = videoWrap.height();
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
    if (minHeight > videoHeight) {
        //console.log('video is smaller than the min height');
        
        //set height/width
        newHeight = minHeight + extraPadding;
        newWidth = videoWidth;
        newMaxWidth = "none";
        newTop = "50%";
        newMarginTop = "-" + (newHeight/2);
        
        //adjust center positioning of video if width is greater than wrapper width
        if (newWidth > videoWrapWidth) {
            //console.log("setting video to offset left and right as it's smaller than min height but wider than screen width");
            newMarginLeft = "-" + (newWidth/2);
            newLeft = "50%";
        }
        
    }else{
        //console.log('video is larger than the min height');
        
        //set height/width
        if (videoHeight < videoWrapHeight) {
            
            extraPadding = (service == "vimeo" ? NS.WLFUN.percentage(80,videoWrapHeight) : 0);
            newHeight = videoWrapHeight + extraPadding;
            //console.log('height: '+videoWrapHeight);
            
            videoWidth = NS.WLFUN.ratio(videoWrapHeight,videoOrigHeight,videoOrigWidth);
            newWidth = videoWidth;
            newMaxWidth = "none";
            
            //adjust center positioning of video if width is greater than wrapper width
            if (newWidth > videoWrapWidth) {
                newMarginLeft = "-" + (newWidth/2);
                newLeft = "50%";
            }
            
        }else{
            
            //console.log('video taller than max height');
            
            newMaxWidth = "100%";
            newWidth = videoWrapWidth;
            extraPadding = (service == "vimeo" ? NS.WLFUN.percentage(80,videoHeight) : 0);
            newHeight = videoHeight + extraPadding;

        }
        
        //crop according to parameter
        switch(crop){
            case 'top':
                //console.log("cropping video from top");
                newTop = 0-(extraPadding/2);
                newBottom = "auto";
                newMarginTop = 0;
                break;
            case 'center':
                //console.log("cropping video from center");
                newTop = "50%";
                newBottom = "auto";
                newMarginTop = "-"+(newHeight/2);
                break;
            case 'bottom':
                //console.log("cropping video from bottom");
                newTop = "auto";
                newBottom = 0-(extraPadding/2);
                newMarginTop = 0;
                break;
            default:
                break;
        };
        
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
    
    var imageWrap = $("#"+thisID+" .wl_videoImageWrap");
    var imageWrapWidth = imageWrap.width();
    var imageWrapHeight = imageWrap.height();
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
        //check if image is taller than current videoElem height

        if (imageHeight < imageWrapHeight) {

            //console.log('lesser'+imageWrapHeight);
            imageWidth = NS.WLFUN.ratio(imageWrapHeight,imageOrigHeight,imageOrigWidth);
            
            newHeight = imageWrapHeight;
            newWidth = imageWidth;
            newMaxWidth = 'none';
            
            //adjust center positioning of image if width is greater than wrapper width
            if (newWidth >= imageWrapWidth) {
                
                //console.log("setting image to offset left and right as it's smaller than min height but wider than screen width");
                newMarginLeft = "-" + (newWidth/2);
                newLeft = "50%";
                
            }
            
        }else{
            //console.log('greater'+elemHeight);
            //set height/width
            newHeight = imageHeight;
            newWidth = imageWrapWidth;
            newMaxWidth = "100%";
        }
        
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
        //console.log('youtube video init');
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
});

});//end doc ready

//ON RESIZE
$(window).resize(function() {

//load video and banner adj
if ($('.wl_videoElem').length != 0) {
    $('.wl_videoElem').each(function(){
        //resize
        var thisID = $(this).attr('id');
        
        if ($('#' + thisID + ' .wl_videoImage').length !=0 && $('#' + thisID + ' .wl_videoImageWrap').css('display') == 'block') {
            //console.log('image visible');
            NS.WLFUN.sizeVideoImage($(this));
        }else if($('#' + thisID + ' .wl_video').length !=0 && $('#' + thisID + ' .wl_videoImageWrap').css('display') == 'none'){
            //console.log('image hidden')
            NS.WLFUN.sizeVideo($(this));
        }
        
    });
}

});//end resize

});
})(jQuery);