<?php
/*
Plugin Name: WL Video Short
Description: A custom shortcode for video features with optional initial image and custom 'click' text/html and overlay text/html
Author: Web Locomotive
Author URI: http://weblocomotive.com
Version: 1.0
*/

//enqueue scripts
function wl_video_short_enqueue() {
	wp_register_style( 'wl_video_short-css', plugins_url('css/styles.css',__FILE__));
    wp_register_script('youtube-api','https://www.youtube.com/iframe_api',array(), '1.0.0', false );
	wp_register_script('vimeo-api','https://player.vimeo.com/api/player.js',array(),'1.0.0',false);
	wp_register_script('wl_video_short-js', plugins_url('js/scripts.js',__FILE__),array(), '1.0.0', true );
	wp_enqueue_style('wl_video_short-css');
	wp_enqueue_script('wl_video_short-js');
}
add_action( 'wp_enqueue_scripts', 'wl_video_short_enqueue' );


//shortcode
function videoshort_function($atts, $content = null){
	
	$atts = shortcode_atts( 
    array(
        'id' => 'uniqueId', //Unique ID
		
		//vimeo defaults
		'video_id' => '171439497', //youtube or vimeo id
		'service' => 'vimeo', //Video hosting service...either youtube or vimeo
		'video_height' => "360", //Int. original youtube or vimeo height (used for ratio)
        'video_width' => "640", //Int. original youtube or vimeo width (used for ratio)
		
		//youtube defaults
		/*
		'video_id' => 'dqTtoTK6kMk', //youtube or vimeo id
		'service' => 'youtube', //Video hosting service...either youtube or vimeo
		'video_height' => "315", //Int. original youtube or vimeo height (used for ratio)
		'video_width' => "560", //Int. original youtube or vimeo weight (used for ratio)
		*/
		
		'max_height' => "500", //Int. height to limit height of banner/video area
        'min_height' => "400", //Int. minimum height
		'breakpoint' => '800',//Int. Breakpoint to adjust min-height
		'limit_width' => "true", //True or false. limit (restrict to the 'max_width') or not (set as full width) the video and image
        'max_width' => "1000", //Int. if limit_width is true, how wide should the video/image be?
		'thumb_url' => 'http://dev.thepianospot.net/wp-content/uploads/2016/06/videoPlace.jpg', //Url
        'thumb_alt' => 'Video Placeholder', //Alt for thumbnail image
        'thumb_back' => '#CCCCCC', //Hexadecimal code (with hash). set this to match the image if limit is set to true
		'video_back' => "#000000", //Hexadecimal code (with hash). set this to match the video if video is set to true
		'crop_direction' => 'center', //Top, center or bottom. crop direction
		'click_label' => 'Click here', //Text to use as the click link
        'autoplay' => "false", //True or false. Should the video load as soon as api loads or should a click be required
        'repeat' => "false", //True or false. Works perfectly on vimeo but youtube includes a black screen at the end of the video which can't be gotten rid of. If vimeo is used and repeat is set to false, vimeo's sponsored video screen shows brieftly. To remove this the vimeo video should be uploaded to a vimeo pro account and the settings should be adjusted there. I've managed to remove it by stripping the last second off the video...this means a video used for this should include an extra 1 second at the end
		'mute' => "true" //True or false. Works on youtube but not vimeo. on vimeo the video should be muted in vimeo's video manager
    ),
	$atts
	);
	
    $id = $atts['id'];
    $videoId = $atts['video_id'];
    $videoHeight = $atts['video_height'];
    $videoWidth = $atts['video_width'];
    $videoBack = $atts['video_back'];
    $maxHeight = $atts['max_height'];
    $minHeight = $atts['min_height'];
	$breakpoint = $atts['breakpoint'];
    $limitWidth = $atts['limit_width'] == "true" ? true : false;
    $maxWidth = $atts['max_width'];
    $autoplay = $atts['autoplay'] == "true" ? true : false;
    $repeat = $atts['repeat'] == "true" ? true : false;
    $clickLabel = htmlentities($atts['click_label'],ENT_QUOTES);
    $clickLabelSlashed = json_encode($clickLabel);
	$videoOverlay = $content;
	$videoOverlaySlashed = json_encode($videoOverlay);
    $thumbUrl = $atts['thumb_url']; 
    $thumbAlt = $atts['thumb_alt'];
    $thumbBack = $atts['thumb_back'];
    //$crop = $atts['crop'] == "true" ? true : false;
    $cropDirection = $atts['crop_direction'];
	$service = $atts['service'];
	$mute = $atts['mute'] == "true" ? true : false;

	//enqueue apis as needed
	switch($service){
		case 'youtube':
			wp_enqueue_script('youtube-api');
			break;
		case 'vimeo':
			wp_enqueue_script('vimeo-api');
			break;
		default:
			break;
	}
	
	//inline css
	$inline = "
	<style type='text/css' scoped>
	#wl_video_" . $id . " .wl_videoImageWrap,#wl_video_" . $id . " .wl_videoWrap.fluid-width-video-wrapper {
		min-height: " . $maxHeight . "px;
	}
	@media all and (max-width: " . $breakpoint . "px){
		#wl_video_" . $id . " .wl_videoImageWrap,#wl_video_" . $id . " .wl_videoWrap.fluid-width-video-wrapper {
			min-height: " . $minHeight . "px;
		}
	}
	</style>";
	
	//construct
    $output = "";
	
    $imageWrapClass = "wl_videoImageWrap";
    $imageClass = "wl_videoImage";

	$output .= $inline;
	
    //video params and placeholder
    $output .= "
    <div class='wl_videoElem video-".$service."' id='wl_video_" . $id . "' style='max-height: " . $maxHeight . "px; min-height:" . $minHeight . "px; ". ($limitWidth ? "background-color: ".$thumbBack . ";" : "") . "'>
    
    <div class='videoPlay' 
	data-service='" . $service . "'
	data-mute='" . ($mute ? "1" : "0") . "'
	data-maxwidth='" . $maxWidth . "'
	data-maxheight='" . $maxHeight . "'
	data-minheight='" . $minHeight . "'
	data-auto='" . ($autoplay ? '1' : '0') . "'
	data-repeat='" . ($repeat ? '1' : '0') . "'
	data-crop='" . $cropDirection . "'
	data-id='videoPlay_" . $id . "'
	data-videoid='" . $videoId . "'
	data-width='" . $videoWidth . "'
	data-height='" . $videoHeight . "'
	data-imgurl='" . $thumbUrl . "'
	data-imgalt='" . $thumbAlt . "'
	data-label='[" . $clickLabelSlashed . "]'
	data-overlay='[" . $videoOverlaySlashed."]'
	data-limit='" . ($limitWidth ? '1' : '0') . "'
	data-imagebk='" . $thumbBack . "'
	data-videobk='" . $videoBack . "'
	>";
	
    //placeholder image
	$output .= '<div class="' . $imageWrapClass . '" style="' . ($limitWidth ? 'max-width: ' . $maxWidth . 'px; margin: 0 auto;' : '') . '  max-height: '.$maxHeight.'px;">
		<img class="' . $imageClass . '" width="' . $videoWidth . '" height="'.$videoHeight.'" alt="' . $thumbAlt . '" src="' . $thumbUrl . '" />
		
		<div class="wl_videoClick" id="wl_videolabel_' . $id . '" ><div class="inner"><div class="inner"><div class="inner">
		'.$clickLabel.'
		</div></div></div></div>
		
	</div>';
		
    $output .= '</div>
    </div>';
    
	return $output;
}
add_shortcode('videoshort', 'videoshort_function' );
//USE: [videoshort id="anID" video_id="171439497" service="vimeo" video_height="360" video_width="640"  max_height="500" min_height="300" breakpoint="800" limit_width="true" max_width="1000"  thumb_url="http://fullurl.jpg" thumb_alt="Alt text" thumb_back="#FFFFFF" video_back="#333333" crop_direction="center" click_label="Click Here" autoplay="true" repeat="true"]<h2>Title</h2><p>Lorum ipsum</p><a href="#">Clicky</a>[/videoshort]