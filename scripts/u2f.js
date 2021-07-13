"use strict";!function(e){var t=-1!==navigator.userAgent.indexOf("Firefox")||-1!==navigator.userAgent.indexOf("Gecko/"),o=!(void 0===e.u2f||!e.u2f.register);if(t&&o)e.u2f.isSupported=!0;else{var r,n=e.u2f||{};n.isSupported=!!(void 0!==n&&n.register||"undefined"!=typeof chrome&&chrome.runtime),n.EXTENSION_ID="kmendfapggjehodndflmmgagdbamhnfd",n.MessageTypes={U2F_REGISTER_REQUEST:"u2f_register_request",U2F_REGISTER_RESPONSE:"u2f_register_response",U2F_SIGN_REQUEST:"u2f_sign_request",U2F_SIGN_RESPONSE:"u2f_sign_response",U2F_GET_API_VERSION_REQUEST:"u2f_get_api_version_request",U2F_GET_API_VERSION_RESPONSE:"u2f_get_api_version_response"},n.ErrorCodes={OK:0,OTHER_ERROR:1,BAD_REQUEST:2,CONFIGURATION_UNSUPPORTED:3,DEVICE_INELIGIBLE:4,TIMEOUT:5},n.U2fRequest,n.U2fResponse,n.Error,n.Transport,n.Transports,n.SignRequest,n.SignResponse,n.RegisterRequest,n.RegisterResponse,n.RegisteredKey,n.GetJsApiVersionResponse,n.getMessagePort=function(e){if("undefined"!=typeof chrome&&chrome.runtime){var t={type:n.MessageTypes.U2F_SIGN_REQUEST,signRequests:[]};chrome.runtime.sendMessage(n.EXTENSION_ID,t,(function(){chrome.runtime.lastError?n.getIframePort_(e):n.getChromeRuntimePort_(e)}))}else n.isAndroidChrome_()?n.getAuthenticatorPort_(e):n.isIosChrome_()?n.getIosPort_(e):n.getIframePort_(e)},n.isAndroidChrome_=function(){var e=navigator.userAgent;return-1!=e.indexOf("Chrome")&&-1!=e.indexOf("Android")},n.isIosChrome_=function(){return["iPhone","iPad","iPod"].indexOf(navigator.platform)>-1},n.getChromeRuntimePort_=function(e){var t=chrome.runtime.connect(n.EXTENSION_ID,{includeTlsChannelId:!0});setTimeout((function(){e(new n.WrappedChromeRuntimePort_(t))}),0)},n.getAuthenticatorPort_=function(e){setTimeout((function(){e(new n.WrappedAuthenticatorPort_)}),0)},n.getIosPort_=function(e){setTimeout((function(){e(new n.WrappedIosPort_)}),0)},n.WrappedChromeRuntimePort_=function(e){this.port_=e},n.formatSignRequest_=function(e,t,o,s,i){if(void 0===r||r<1.1){for(var a=[],p=0;p<o.length;p++)a[p]={version:o[p].version,challenge:t,keyHandle:o[p].keyHandle,appId:e};return{type:n.MessageTypes.U2F_SIGN_REQUEST,signRequests:a,timeoutSeconds:s,requestId:i}}return{type:n.MessageTypes.U2F_SIGN_REQUEST,appId:e,challenge:t,registeredKeys:o,timeoutSeconds:s,requestId:i}},n.formatRegisterRequest_=function(e,t,o,s,i){if(void 0===r||r<1.1){for(var a=0;a<o.length;a++)o[a].appId=e;var p=[];for(a=0;a<t.length;a++)p[a]={version:t[a].version,challenge:o[0],keyHandle:t[a].keyHandle,appId:e};return{type:n.MessageTypes.U2F_REGISTER_REQUEST,signRequests:p,registerRequests:o,timeoutSeconds:s,requestId:i}}return{type:n.MessageTypes.U2F_REGISTER_REQUEST,appId:e,registerRequests:o,registeredKeys:t,timeoutSeconds:s,requestId:i}},n.WrappedChromeRuntimePort_.prototype.postMessage=function(e){this.port_.postMessage(e)},n.WrappedChromeRuntimePort_.prototype.addEventListener=function(e,t){var o=e.toLowerCase();"message"==o||"onmessage"==o?this.port_.onMessage.addListener((function(e){t({data:e})})):console.error("WrappedChromeRuntimePort only supports onMessage")},n.WrappedAuthenticatorPort_=function(){this.requestId_=-1,this.requestObject_=null},n.WrappedAuthenticatorPort_.prototype.postMessage=function(e){var t=n.WrappedAuthenticatorPort_.INTENT_URL_BASE_+";S.request="+encodeURIComponent(JSON.stringify(e))+";end";document.location=t},n.WrappedAuthenticatorPort_.prototype.getPortType=function(){return"WrappedAuthenticatorPort_"},n.WrappedAuthenticatorPort_.prototype.addEventListener=function(e,t){if("message"==e.toLowerCase()){window.addEventListener("message",this.onRequestUpdate_.bind(this,t),!1)}else console.error("WrappedAuthenticatorPort only supports message")},n.WrappedAuthenticatorPort_.prototype.onRequestUpdate_=function(e,t){var o=JSON.parse(t.data),r=(o.intentURL,o.errorCode,null);o.hasOwnProperty("data")&&(r=JSON.parse(o.data)),e({data:r})},n.WrappedAuthenticatorPort_.INTENT_URL_BASE_="intent:#Intent;action=com.google.android.apps.authenticator.AUTHENTICATE",n.WrappedIosPort_=function(){},n.WrappedIosPort_.prototype.postMessage=function(e){var t=JSON.stringify(e),o="u2f://auth?"+encodeURI(t);location.replace(o)},n.WrappedIosPort_.prototype.getPortType=function(){return"WrappedIosPort_"},n.WrappedIosPort_.prototype.addEventListener=function(e,t){"message"!==e.toLowerCase()&&console.error("WrappedIosPort only supports message")},n.getIframePort_=function(e){var t="chrome-extension://"+n.EXTENSION_ID,o=document.createElement("iframe");o.src=t+"/u2f-comms.html",o.setAttribute("style","display:none"),document.body.appendChild(o);var r=new MessageChannel,s=function(t){"ready"==t.data?(r.port1.removeEventListener("message",s),e(r.port1)):console.error('First event on iframe port was not "ready"')};r.port1.addEventListener("message",s),r.port1.start(),o.addEventListener("load",(function(){o.contentWindow.postMessage("init",t,[r.port2])}))},n.EXTENSION_TIMEOUT_SEC=30,n.port_=null,n.waitingForPort_=[],n.reqCounter_=0,n.callbackMap_={},n.getPortSingleton_=function(e){n.port_?e(n.port_):(0==n.waitingForPort_.length&&n.getMessagePort((function(e){for(n.port_=e,n.port_.addEventListener("message",n.responseHandler_);n.waitingForPort_.length;)n.waitingForPort_.shift()(n.port_)})),n.waitingForPort_.push(e))},n.responseHandler_=function(e){var t=e.data,o=t.requestId;if(o&&n.callbackMap_[o]){var r=n.callbackMap_[o];delete n.callbackMap_[o],r(t.responseData)}else console.error("Unknown or missing requestId in response.")},n.sign=function(e,t,o,s,i){void 0===r?n.getApiVersion((function(a){r=void 0===a.js_api_version?0:a.js_api_version,console.log("Extension JS API Version: ",r),n.sendSignRequest(e,t,o,s,i)})):n.sendSignRequest(e,t,o,s,i)},n.sendSignRequest=function(e,t,o,r,s){n.getPortSingleton_((function(i){var a=++n.reqCounter_;n.callbackMap_[a]=r;var p=void 0!==s?s:n.EXTENSION_TIMEOUT_SEC,u=n.formatSignRequest_(e,t,o,p,a);i.postMessage(u)}))},n.register=function(e,t,o,s,i){void 0===r?n.getApiVersion((function(a){r=void 0===a.js_api_version?0:a.js_api_version,console.log("Extension JS API Version: ",r),n.sendRegisterRequest(e,t,o,s,i)})):n.sendRegisterRequest(e,t,o,s,i)},n.sendRegisterRequest=function(e,t,o,r,s){n.getPortSingleton_((function(i){var a=++n.reqCounter_;n.callbackMap_[a]=r;var p=void 0!==s?s:n.EXTENSION_TIMEOUT_SEC,u=n.formatRegisterRequest_(e,o,t,p,a);i.postMessage(u)}))},n.getApiVersion=function(e,t){n.getPortSingleton_((function(o){if(o.getPortType){var r;switch(o.getPortType()){case"WrappedIosPort_":case"WrappedAuthenticatorPort_":r=1.1;break;default:r=0}e({js_api_version:r})}else{var s=++n.reqCounter_;n.callbackMap_[s]=e;var i={type:n.MessageTypes.U2F_GET_API_VERSION_REQUEST,timeoutSeconds:void 0!==t?t:n.EXTENSION_TIMEOUT_SEC,requestId:s};o.postMessage(i)}}))},e.u2f=n}}(this);