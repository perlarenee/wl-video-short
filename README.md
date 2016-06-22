# wl-video-short
A wordpress plugin providing a shortcode for video features with several options

#### Sample Use
```
[videoshort id="anID" video_id="171439497" service="vimeo" video_height="360" video_width="640"  max_height="500" min_height="300" limit_width="true" max_width="1000"  thumb_url="http://fullurl.jpg" thumb_alt="Alt text" thumb_back="#FFFFFF" video_back="#333333" crop_direction="center" video_overlay="Some overlay text" click_label="Click Here" autoplay="true" repeat="true"][/videoshort]
```

#### Attributes/Options
- **id:** [Str] A unique ID
  - Example: UniqueID
- **video_id:** [Str] Vimeo or YouTube ID
  - Example: 171439497
- **service:** [Str] Video provider, youtube or vimeo
  - Example: vimeo
  - Options: youtube/vimeo
- **video_height:** [INT] Original video height
  - Example: 360
- **video_width:** [INT] Original video width
  - Example: 640
- **max_height:** [INT] Maximum height of video area
  - Example: 500
- **min_height:** [INT] Minimum height of video area
  - Example: 300
- **breakpoint:** [INT] Breakpoint width to switch from max-height to min-height
  - Example: 800
- **limit_width:** [BOOL] Limit the video and image or allow full width
  - Example: true
  - Options: true/false
- **max_width:** [INT] If limit_width is true, how wide should the video and image area be
  - Example: 1000
- **thumb_url:** [STR] Full url to the placeholder image
  - Example: http://fullurl.jpg
- **thumb_alt:** [STR] Alt text for the placeholder image
  - Example: Alt text
- **thumb_back:** [STR] Hexadecimal code (with hash) for the background color of the placeholder image
  - Example: #000000
- **video_back:** [STR] Hexadecimal code (with hash) for the background color of the video
  - Example: #333333
- **crop_direction:** [STR] Angle the image and video should crop
  - Example: center
  - Options: top/center/bottom
- **video_overlay:** [STR] Text or HTML content to be centered vertically and horizontally over the video
  - Example: Some content
- **click_label:** [STR] Text or HTML content to be centered vertically and horizontally over the placeholder image and used for the click event
  - Example: Click here
- **autoplay:** [BOOL] Set the video to load without a click event
  - Example: true
  - Options: true/false
- **repeat:** [BOOL] Set the video to loop
  - Example: true
  - Options: true/false