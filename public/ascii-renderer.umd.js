(function(m,_){typeof exports=="object"&&typeof module<"u"?_(exports):typeof define=="function"&&define.amd?define(["exports"],_):(m=typeof globalThis<"u"?globalThis:m||self,_(m.AsciiRenderer={}))})(this,(function(m){"use strict";const _={code:{name:"Code",chars:" .',;:-_~`\"^!|il1\\/()[]{}<>+=?rtfj7vcxzsnu*eo325akIJYLCUTFEPSZ94GVhdbqpX0OQDAKH6wmRN#8WMg&%B@$"},standard:{name:"Standard",chars:" .:-=+*#%@"},blocks:{name:"Blocks",chars:" ░▒▓█"},minimal:{name:"Minimal",chars:" .oO@"},binary:{name:"Binary",chars:" █"},detailed:{name:"Detailed",chars:" .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"},dots:{name:"Dots",chars:" ·•●"},arrows:{name:"Arrows",chars:" ←↙↓↘→↗↑↖"},emoji:{name:"Emoji",chars:"  ░▒▓🌑🌒🌓🌔🌕"}},A="code";function y(i){return[..._[i].chars]}const S=`#version 300 es

in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}
`,M=`#version 300 es
precision highp float;

uniform sampler2D u_video;
uniform sampler2D u_asciiAtlas;

uniform vec2 u_resolution;
uniform vec2 u_charSize;
uniform vec2 u_gridSize;
uniform float u_numChars;

uniform bool u_colored;
uniform float u_blend;
uniform float u_highlight;
uniform float u_brightness;

uniform float u_audioLevel;
uniform float u_audioReactivity;
uniform float u_audioSensitivity;

uniform vec2 u_mouse;
uniform float u_mouseRadius;
uniform vec2 u_trail[18];
uniform int u_trailLength;

uniform vec4 u_ripples[8];
uniform float u_time;
uniform float u_rippleEnabled;
uniform float u_rippleSpeed;

in vec2 v_texCoord;
out vec4 fragColor;

void main() {
  vec2 cellCoord = floor(v_texCoord * u_gridSize);
  vec2 thisCell = cellCoord;

  vec2 cellCenter = (cellCoord + 0.5) / u_gridSize;
  vec4 videoColor = texture(u_video, cellCenter);

  float baseBrightness = dot(videoColor.rgb, vec3(0.299, 0.587, 0.114));

  float minBrightness = mix(0.3, 0.0, u_audioSensitivity);
  float maxBrightness = mix(1.0, 5.0, u_audioSensitivity);
  float audioMultiplier = mix(minBrightness, maxBrightness, u_audioLevel);
  float audioModulated = baseBrightness * audioMultiplier;
  float brightness = mix(baseBrightness, audioModulated, u_audioReactivity);

  float cursorGlow = 0.0;
  float radius = 7.0;

  float aspect = u_charSize.x / u_charSize.y;
  vec2 mouseCell = floor(u_mouse * u_gridSize);
  vec2 diff = (thisCell - mouseCell) * vec2(aspect, 1.0);
  float cellDist = length(diff);
  if (u_mouse.x >= 0.0) {
    cursorGlow = smoothstep(radius, radius * 0.3, cellDist);
  }

  for (int i = 0; i < 18; i++) {
    if (i >= u_trailLength) break;
    vec2 trailPos = u_trail[i];
    if (trailPos.x < 0.0) continue;

    vec2 trailCell = floor(trailPos * u_gridSize);
    vec2 tDiff = (thisCell - trailCell) * vec2(aspect, 1.0);
    float trailDist = length(tDiff);
    float trailR = radius * 0.7;

    cursorGlow = max(cursorGlow, smoothstep(trailR, trailR * 0.3, trailDist));
  }

  float adjustedBrightness = pow(brightness, 1.0 / u_brightness);
  adjustedBrightness = clamp(adjustedBrightness, 0.0, 1.0);

  float visibleGlow = cursorGlow * u_mouseRadius;
  float cellId = dot(cellCoord, vec2(127.1, 311.7));
  float wave = sin(u_time * 0.8 + cellId) * sin(u_time * 1.3 + cellId * 0.7);
  float jitter = wave * 0.08 * (1.0 - visibleGlow);
  adjustedBrightness = clamp(adjustedBrightness + jitter, 0.0, 1.0);

  float charIndex = floor(adjustedBrightness * (u_numChars - 0.001));

  float atlasX = charIndex / u_numChars;
  vec2 cellPos = fract(v_texCoord * u_gridSize);
  vec2 atlasCoord = vec2(atlasX + cellPos.x / u_numChars, cellPos.y);
  vec4 charColor = texture(u_asciiAtlas, atlasCoord);

  float glow = cursorGlow * u_mouseRadius;

  vec3 baseColor;
  if (u_colored) {
    baseColor = videoColor.rgb;
  } else {
    baseColor = vec3(0.0, 1.0, 0.0);
  }

  float bgIntensity = 0.15 + u_highlight * 0.35;
  vec3 bgColor = baseColor * bgIntensity;
  vec3 textColor = baseColor * 1.2;
  vec3 finalColor = mix(bgColor, textColor, charColor.r);

  vec3 litBg = baseColor * 3.0;
  vec3 litText = baseColor * 8.0;
  vec3 litColor = mix(litBg, litText, charColor.r);
  finalColor = mix(finalColor, litColor, glow);

  vec3 blendedColor = mix(finalColor, videoColor.rgb, u_blend);

  fragColor = vec4(blendedColor, 1.0);
}
`;function x(i,e,s){const t=i.createShader(s);return t?(i.shaderSource(t,e),i.compileShader(t),i.getShaderParameter(t,i.COMPILE_STATUS)?t:(console.error("Shader compile error:",i.getShaderInfoLog(t)),i.deleteShader(t),null)):null}function w(i,e,s){const t=i.createProgram();return t?(i.attachShader(t,e),i.attachShader(t,s),i.linkProgram(t),i.getProgramParameter(t,i.LINK_STATUS)?t:(console.error("Program link error:",i.getProgramInfoLog(t)),i.deleteProgram(t),null)):null}function D(i,e){const s=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t=new Float32Array([0,1,1,1,0,0,0,0,1,1,1,0]),n=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,n),i.bufferData(i.ARRAY_BUFFER,s,i.STATIC_DRAW);const o=i.getAttribLocation(e,"a_position");i.enableVertexAttribArray(o),i.vertexAttribPointer(o,2,i.FLOAT,!1,0,0);const r=i.createBuffer();i.bindBuffer(i.ARRAY_BUFFER,r),i.bufferData(i.ARRAY_BUFFER,t,i.STATIC_DRAW);const h=i.getAttribLocation(e,"a_texCoord");i.enableVertexAttribArray(h),i.vertexAttribPointer(h,2,i.FLOAT,!1,0,0)}function P(i){const e=i.createTexture();return e?(i.bindTexture(i.TEXTURE_2D,e),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR_MIPMAP_LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),e):null}function I(i,e,s=64){const t=document.createElement("canvas");t.width=s*e.length,t.height=s;const n=t.getContext("2d");if(!n)return null;n.fillStyle="#000",n.fillRect(0,0,t.width,t.height),n.fillStyle="#fff",n.font=`${s*.8}px monospace`,n.textAlign="center",n.textBaseline="middle";for(let r=0;r<e.length;r++)n.fillText(e[r],r*s+s/2,s/2);const o=i.createTexture();return o?(i.bindTexture(i.TEXTURE_2D,o),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,t),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),o):null}function U(i,e,s){if(i<=0||e<=0||s<=0)return{cols:0,rows:0};const t=Math.max(1,Math.round(s/(i/e)/2));return{cols:s,rows:t}}const b=.6,u={colored:!0,blend:0,highlight:0,brightness:1,charset:A,enableMouse:!0,trailLength:24,enableRipple:!1,rippleSpeed:40,audioEffect:0,audioRange:50,autoPlay:!0,enableSpacebarToggle:!1},g=18,T=8,B=60;class F{container;canvas;video;gl=null;program=null;videoTexture=null;atlasTexture=null;uniforms=null;animationId=0;_isReady=!1;_isPlaying=!1;destroyed=!1;frameCount=0;frameTimes=[];lastFpsTime=performance.now();_stats={fps:0,frameTime:0};_dimensions={cols:80,rows:24};opts;mouse={x:-1,y:-1};trail=[];trailIntervalId=0;lastMoveTime=0;ripples=[];audioContext=null;analyser=null;audioData=null;volume=0;connectedVideo=null;resizeObserver=null;handleMouseMove;handleMouseLeave;handleTouchMove;handleTouchEnd;handleClick;handleKeyDown;handleMetadata;handlePlay;handleStop;handleAudioPlay;handleVideoError;handleContextLost;handleContextRestored;_onError;constructor(e,s){if(this.container=typeof e=="string"?document.querySelector(e)??(()=>{throw new Error(`Container not found: ${e}`)})():e,this._onError=s.onError,this.opts={colored:s.colored??u.colored,blend:s.blend??u.blend,highlight:s.highlight??u.highlight,brightness:s.brightness??u.brightness,charset:s.charset??u.charset,enableMouse:s.enableMouse??u.enableMouse,trailLength:Math.min(s.trailLength??u.trailLength,g),enableRipple:s.enableRipple??u.enableRipple,rippleSpeed:s.rippleSpeed??u.rippleSpeed,audioEffect:s.audioEffect??u.audioEffect,audioRange:s.audioRange??u.audioRange,autoPlay:s.autoPlay??u.autoPlay,enableSpacebarToggle:s.enableSpacebarToggle??u.enableSpacebarToggle,columns:s.columns,onStats:s.onStats,onReady:s.onReady},this.canvas=document.createElement("canvas"),this.canvas.style.display="block",this.canvas.style.maxWidth="100%",this.canvas.style.margin="0 auto",this.video=document.createElement("video"),Object.assign(this.video,{src:s.videoSrc,muted:this.opts.audioEffect===0,loop:!0,playsInline:!0,crossOrigin:"anonymous"}),this.video.style.display="none",this.container.appendChild(this.video),this.container.appendChild(this.canvas),this.handleMouseMove=this.onMouseMove.bind(this),this.handleMouseLeave=this.onMouseLeave.bind(this),this.handleTouchMove=this.onTouchMove.bind(this),this.handleTouchEnd=this.onMouseLeave.bind(this),this.handleClick=this.onClick.bind(this),this.handleKeyDown=this.onKeyDown.bind(this),this.handleMetadata=this.onMetadata.bind(this),this.handlePlay=this.onPlay.bind(this),this.handleStop=this.onStop.bind(this),this.handleAudioPlay=()=>{this.opts.audioEffect>0&&this.connectAudio()},this.handleVideoError=()=>{const t=this.video.error,n=t?`Video error: ${t.message||"format not supported by this browser"}`:"Video failed to load";this._onError?.(n)},this.handleContextLost=t=>{t.preventDefault(),cancelAnimationFrame(this.animationId)},this.handleContextRestored=()=>{this.video.readyState>=1&&this.initWebGL()&&!this.video.paused&&requestAnimationFrame(this.render)},this.video.addEventListener("loadedmetadata",this.handleMetadata),this.video.addEventListener("play",this.handlePlay),this.video.addEventListener("pause",this.handleStop),this.video.addEventListener("ended",this.handleStop),this.video.addEventListener("error",this.handleVideoError),this.canvas.addEventListener("webglcontextlost",this.handleContextLost),this.canvas.addEventListener("webglcontextrestored",this.handleContextRestored),this.video.readyState>=1&&this.onMetadata(),this.opts.enableMouse&&this.addMouseListeners(),this.opts.enableRipple&&this.canvas.addEventListener("click",this.handleClick),this.opts.enableSpacebarToggle&&window.addEventListener("keydown",this.handleKeyDown),this.opts.columns){let t=0;this.resizeObserver=new ResizeObserver(()=>{if(this.video.readyState<1)return;const n=this.container.clientWidth;if(n===t)return;t=n;const o=!this.video.paused;this.initWebGL()&&o&&requestAnimationFrame(()=>this.render())}),this.resizeObserver.observe(this.container)}this.opts.audioEffect>0&&(this.video.addEventListener("play",this.handleAudioPlay),this.video.paused||this.connectAudio())}play(){this.video.play().catch(()=>{})}pause(){this.video.pause()}toggle(){this.video.paused?this.play():this.pause()}get isReady(){return this._isReady}get isPlaying(){return this._isPlaying}get dimensions(){return{...this._dimensions}}get stats(){return{...this._stats}}get canvasElement(){return this.canvas}get videoElement(){return this.video}setOptions(e){let s=!1;if(e.columns!==void 0&&e.columns!==this.opts.columns&&(this.opts.columns=e.columns,s=!0),e.charset!==void 0&&e.charset!==this.opts.charset&&(this.opts.charset=e.charset,s=!0),e.brightness!==void 0&&e.brightness!==this.opts.brightness&&(this.opts.brightness=e.brightness,s=!0),e.videoSrc!==void 0&&(this.video.src=e.videoSrc,s=!0),e.colored!==void 0&&(this.opts.colored=e.colored),e.blend!==void 0&&(this.opts.blend=e.blend),e.highlight!==void 0&&(this.opts.highlight=e.highlight),e.trailLength!==void 0&&(this.opts.trailLength=Math.min(e.trailLength,g)),e.rippleSpeed!==void 0&&(this.opts.rippleSpeed=e.rippleSpeed),e.audioRange!==void 0&&(this.opts.audioRange=e.audioRange),e.onStats!==void 0&&(this.opts.onStats=e.onStats),e.onReady!==void 0&&(this.opts.onReady=e.onReady),this.toggleListener(e.enableMouse,this.opts.enableMouse,()=>this.addMouseListeners(),()=>this.removeMouseListeners(),t=>{this.opts.enableMouse=t}),this.toggleListener(e.enableRipple,this.opts.enableRipple,()=>this.canvas.addEventListener("click",this.handleClick),()=>this.canvas.removeEventListener("click",this.handleClick),t=>{this.opts.enableRipple=t}),this.toggleListener(e.enableSpacebarToggle,this.opts.enableSpacebarToggle,()=>window.addEventListener("keydown",this.handleKeyDown),()=>window.removeEventListener("keydown",this.handleKeyDown),t=>{this.opts.enableSpacebarToggle=t}),e.audioEffect!==void 0){const t=this.opts.audioEffect>0;this.opts.audioEffect=e.audioEffect;const n=this.opts.audioEffect>0;this.video.muted=!n,!t&&n?(this.video.addEventListener("play",this.handleAudioPlay),this.video.paused||this.connectAudio()):t&&!n&&this.video.removeEventListener("play",this.handleAudioPlay)}s&&this.video.readyState>=1&&this.initWebGL()}destroy(){this.destroyed||(this.destroyed=!0,cancelAnimationFrame(this.animationId),clearInterval(this.trailIntervalId),this.video.removeEventListener("loadedmetadata",this.handleMetadata),this.video.removeEventListener("play",this.handlePlay),this.video.removeEventListener("pause",this.handleStop),this.video.removeEventListener("ended",this.handleStop),this.video.removeEventListener("play",this.handleAudioPlay),this.video.removeEventListener("error",this.handleVideoError),this.canvas.removeEventListener("webglcontextlost",this.handleContextLost),this.canvas.removeEventListener("webglcontextrestored",this.handleContextRestored),this.removeMouseListeners(),this.canvas.removeEventListener("click",this.handleClick),window.removeEventListener("keydown",this.handleKeyDown),this.resizeObserver?.disconnect(),this.gl&&(this.videoTexture&&this.gl.deleteTexture(this.videoTexture),this.atlasTexture&&this.gl.deleteTexture(this.atlasTexture),this.program&&this.gl.deleteProgram(this.program)),this.audioContext?.close(),this.video.pause(),this.canvas.parentNode===this.container&&this.container.removeChild(this.canvas),this.video.parentNode===this.container&&this.container.removeChild(this.video))}captureText(){if(!this.video.videoWidth||!this._isReady)return"";const{cols:e,rows:s}=this._dimensions,t=y(this.opts.charset),n=document.createElement("canvas");n.width=e,n.height=s;const o=n.getContext("2d");if(!o)return"";o.drawImage(this.video,0,0,e,s);const{data:r}=o.getImageData(0,0,e,s),h=[];for(let l=0;l<s;l++){let f="";for(let v=0;v<e;v++){const c=(l*e+v)*4,p=(.299*r[c]+.587*r[c+1]+.114*r[c+2])/255,a=Math.min(Math.max(Math.pow(p,1/this.opts.brightness),0),1);f+=t[Math.min(Math.floor(a*t.length),t.length-1)]}h.push(f)}return h.join(`
`)}toggleListener(e,s,t,n,o){e===void 0||e===s||(e?t():n(),o(e))}initWebGL(){if(!this.video.videoWidth)return!1;const e=this.opts.columns,s=this.container.clientWidth||window.innerWidth;let t;e?t=e:t=Math.floor(s/(10*b));const n=U(this.video.videoWidth,this.video.videoHeight,t);if(n.cols<=0||n.rows<=0)return!1;this._dimensions=n;const o=s/(t*b),h=window.innerHeight*.85/n.rows,l=Math.min(o,h),f=window.devicePixelRatio||1,v=l*b,c=n.cols*v,p=n.rows*l;this.canvas.width=Math.round(c*f),this.canvas.height=Math.round(p*f),this.canvas.style.width=c+"px",this.canvas.style.height=p+"px";const a=this.canvas.getContext("webgl2",{antialias:!1,preserveDrawingBuffer:!1});if(!a)return this._onError?.("WebGL2 is not supported by your browser. Please try Chrome, Firefox, or Edge."),!1;this.gl=a;const R=x(a,S,a.VERTEX_SHADER),C=x(a,M,a.FRAGMENT_SHADER);if(!R||!C)return!1;const E=w(a,R,C);if(!E)return!1;this.program=E,a.useProgram(E),D(a,E),this.videoTexture=P(a);const L=y(this.opts.charset);this.atlasTexture=I(a,L,l);const d=this.cacheUniforms(a,E);return this.uniforms=d,a.uniform1i(d.u_video,0),a.uniform1i(d.u_asciiAtlas,1),a.uniform2f(d.u_resolution,c,p),a.uniform2f(d.u_charSize,v,l),a.uniform2f(d.u_gridSize,t,n.rows),a.uniform1f(d.u_numChars,L.length),a.uniform1f(d.u_brightness,this.opts.brightness),a.uniform2f(d.u_mouse,-1,-1),a.uniform1f(d.u_mouseRadius,0),a.uniform1i(d.u_trailLength,0),a.uniform1f(d.u_rippleEnabled,0),a.uniform1f(d.u_audioLevel,0),a.uniform1f(d.u_audioReactivity,0),a.uniform1f(d.u_audioSensitivity,0),a.viewport(0,0,Math.round(c*f),Math.round(p*f)),this._isReady=!0,this.opts.onReady?.(),!0}cacheUniforms(e,s){const t=n=>e.getUniformLocation(s,n);return{u_video:t("u_video"),u_asciiAtlas:t("u_asciiAtlas"),u_resolution:t("u_resolution"),u_charSize:t("u_charSize"),u_gridSize:t("u_gridSize"),u_numChars:t("u_numChars"),u_colored:t("u_colored"),u_blend:t("u_blend"),u_highlight:t("u_highlight"),u_brightness:t("u_brightness"),u_mouse:t("u_mouse"),u_mouseRadius:t("u_mouseRadius"),u_trailLength:t("u_trailLength"),u_trail:Array.from({length:g},(n,o)=>t(`u_trail[${o}]`)),u_time:t("u_time"),u_rippleEnabled:t("u_rippleEnabled"),u_rippleSpeed:t("u_rippleSpeed"),u_ripples:Array.from({length:T},(n,o)=>t(`u_ripples[${o}]`)),u_audioLevel:t("u_audioLevel"),u_audioReactivity:t("u_audioReactivity"),u_audioSensitivity:t("u_audioSensitivity")}}render=()=>{const{gl:e,program:s,uniforms:t,video:n}=this;if(!e||!s||!t||n.paused||n.ended||e.isContextLost())return;const o=performance.now();if(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.videoTexture),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,n),e.generateMipmap(e.TEXTURE_2D),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.atlasTexture),e.uniform1i(t.u_colored,this.opts.colored?1:0),e.uniform1f(t.u_blend,this.opts.blend/100),e.uniform1f(t.u_highlight,this.opts.highlight/100),e.uniform1f(t.u_brightness,this.opts.brightness),e.uniform1f(t.u_time,o/1e3),this.uploadMouseUniforms(e,t),this.uploadRippleUniforms(e,t),this.uploadAudioUniforms(e,t),e.drawArrays(e.TRIANGLES,0,6),this.frameCount++,this.frameTimes.push(performance.now()-o),this.frameTimes.length>60&&this.frameTimes.shift(),o-this.lastFpsTime>=1e3){const r=this.frameTimes.reduce((h,l)=>h+l,0)/this.frameTimes.length;this._stats={fps:this.frameCount,frameTime:r},this.opts.onStats?.(this._stats),this.frameCount=0,this.lastFpsTime=o}this.animationId=requestAnimationFrame(this.render)};addMouseListeners(){this.canvas.addEventListener("mousemove",this.handleMouseMove),this.canvas.addEventListener("mouseleave",this.handleMouseLeave),this.canvas.addEventListener("touchmove",this.handleTouchMove,{passive:!1}),this.canvas.addEventListener("touchend",this.handleTouchEnd),this.trailIntervalId=window.setInterval(()=>{if(this.mouse.x<0)return;const e=this.trail[0];!e||Math.abs(e.x-this.mouse.x)>.005||Math.abs(e.y-this.mouse.y)>.005?(this.lastMoveTime=performance.now(),this.trail.unshift({...this.mouse}),this.trail.length>this.opts.trailLength&&this.trail.pop()):this.trail.length>0&&(this.trail.pop(),this.trail.length>0&&this.trail.pop())},B)}removeMouseListeners(){this.canvas.removeEventListener("mousemove",this.handleMouseMove),this.canvas.removeEventListener("mouseleave",this.handleMouseLeave),this.canvas.removeEventListener("touchmove",this.handleTouchMove),this.canvas.removeEventListener("touchend",this.handleTouchEnd),clearInterval(this.trailIntervalId),this.trailIntervalId=0}onMouseMove(e){const s=this.canvas.getBoundingClientRect();this.mouse={x:(e.clientX-s.left)/s.width,y:(e.clientY-s.top)/s.height},this.lastMoveTime=performance.now()}onMouseLeave(){this.mouse={x:-1,y:-1},this.trail=[],this.lastMoveTime=0}onTouchMove(e){e.preventDefault();const s=e.touches[0];if(!s)return;const t=this.canvas.getBoundingClientRect();this.mouse={x:(s.clientX-t.left)/t.width,y:(s.clientY-t.top)/t.height},this.lastMoveTime=performance.now()}uploadMouseUniforms(e,s){if(!this.opts.enableMouse)return;const t=performance.now()-this.lastMoveTime,n=t<1e3?1:Math.max(0,1-(t-1e3)/500);if(n<=0){e.uniform2f(s.u_mouse,-1,-1),e.uniform1f(s.u_mouseRadius,0),e.uniform1i(s.u_trailLength,0);return}e.uniform2f(s.u_mouse,this.mouse.x,this.mouse.y),e.uniform1f(s.u_mouseRadius,n),e.uniform1i(s.u_trailLength,this.trail.length);for(let o=0;o<g;o++){const r=s.u_trail[o];if(!r)continue;const h=this.trail[o];e.uniform2f(r,h?.x??-1,h?.y??-1)}}onClick(e){if(!this.opts.enableRipple)return;const s=this.canvas.getBoundingClientRect();this.ripples.unshift({x:(e.clientX-s.left)/s.width,y:(e.clientY-s.top)/s.height,startTime:performance.now()/1e3}),this.ripples.length>T&&this.ripples.pop()}uploadRippleUniforms(e,s){if(!this.opts.enableRipple)return;const t=performance.now()/1e3;e.uniform1f(s.u_time,t),e.uniform1f(s.u_rippleEnabled,1),e.uniform1f(s.u_rippleSpeed,this.opts.rippleSpeed);const o=Math.hypot(this._dimensions.cols,this._dimensions.rows)/this.opts.rippleSpeed+1;this.ripples=this.ripples.filter(r=>t-r.startTime<o);for(let r=0;r<T;r++){const h=s.u_ripples[r];if(!h)continue;const l=this.ripples[r];e.uniform4f(h,l?.x??0,l?.y??0,l?.startTime??0,l?1:0)}}connectAudio(){if(this.connectedVideo===this.video&&this.audioContext){this.audioContext.resume();return}try{this.audioContext??=new AudioContext;const e=this.audioContext.createAnalyser();e.fftSize=256,e.smoothingTimeConstant=.8,this.analyser=e,this.audioData=new Uint8Array(e.frequencyBinCount),this.audioContext.createMediaElementSource(this.video).connect(e),e.connect(this.audioContext.destination),this.connectedVideo=this.video,this.audioContext.resume()}catch{}}uploadAudioUniforms(e,s){if(!(this.opts.audioEffect<=0)){if(this.analyser&&this.audioData){this.analyser.getByteFrequencyData(this.audioData);let t=0;for(let n=0;n<this.audioData.length;n++)t+=this.audioData[n];this.volume=this.volume*.7+t/this.audioData.length/255*.3}e.uniform1f(s.u_audioLevel,this.volume),e.uniform1f(s.u_audioReactivity,this.opts.audioEffect/100),e.uniform1f(s.u_audioSensitivity,this.opts.audioRange/100)}}onMetadata(){this.initWebGL(),this.opts.autoPlay&&this.play()}onPlay(){this._isPlaying=!0,this.animationId=requestAnimationFrame(this.render)}onStop(){this._isPlaying=!1,cancelAnimationFrame(this.animationId)}onKeyDown(e){e.code==="Space"&&e.target===document.body&&(e.preventDefault(),this.toggle())}}m.AsciiRenderer=F,Object.defineProperty(m,Symbol.toStringTag,{value:"Module"})}));
