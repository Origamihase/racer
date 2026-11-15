/* Mini Adam: Tesla-Navi ferngesteuert – gebaut aus src/ (npm run build). Enthält three.js (MIT). */
(()=>{var jh="170";var y0=0,id=1,_0=2;var yf=1,Qh=2,Ci=3,ss=0,mn=1,gt=2,ts=0,dr=1,rs=2,sd=3,rd=4,M0=5,Ts=100,b0=101,E0=102,w0=103,S0=104,T0=200,A0=201,R0=202,C0=203,wc=204,Sc=205,P0=206,I0=207,L0=208,D0=209,k0=210,U0=211,N0=212,B0=213,H0=214,Tc=0,Ac=1,Rc=2,gr=3,Cc=4,Pc=5,Ic=6,Lc=7,eu=0,F0=1,O0=2,ns=0,z0=1,G0=2,V0=3,tu=4,W0=5,X0=6,q0=7;var _f=300,vr=301,xr=302,Dc=303,kc=304,Za=306,Di=1e3,Cs=1001,Uc=1002,Bn=1003,Y0=1004;var Go=1005;var Nn=1006,Wl=1007;var Ps=1008;var ki=1009,Mf=1010,bf=1011,ao=1012,nu=1013,Is=1014,pi=1015,as=1016,iu=1017,su=1018,yr=1020,Ef=35902,wf=1021,Sf=1022,ii=1023,Tf=1024,Af=1025,fr=1026,_r=1027,ru=1028,ou=1029,Rf=1030,au=1031;var lu=1033,xa=33776,ya=33777,_a=33778,Ma=33779,Nc=35840,Bc=35841,Hc=35842,Fc=35843,Oc=36196,zc=37492,Gc=37496,Vc=37808,Wc=37809,Xc=37810,qc=37811,Yc=37812,Zc=37813,Kc=37814,$c=37815,Jc=37816,jc=37817,Qc=37818,eh=37819,th=37820,nh=37821,ba=36492,ih=36494,sh=36495,Cf=36283,rh=36284,oh=36285,ah=36286;var Ea=2300,lh=2301,Xl=2302,od=2400,ad=2401,ld=2402;var Z0=3200,K0=3201;var cu=0,$0=1,es="",ht="srgb",Rr="srgb-linear",Ka="linear",St="srgb";var Zs=7680;var cd=519,J0=512,j0=513,Q0=514,Pf=515,em=516,tm=517,nm=518,im=519,hd=35044,If=35048;var ud="300 es",Ii=2e3,wa=2001,os=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},fn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],dd=1234567,no=Math.PI/180,lo=180/Math.PI;function Ns(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(fn[i&255]+fn[i>>8&255]+fn[i>>16&255]+fn[i>>24&255]+"-"+fn[e&255]+fn[e>>8&255]+"-"+fn[e>>16&15|64]+fn[e>>24&255]+"-"+fn[t&63|128]+fn[t>>8&255]+"-"+fn[t>>16&255]+fn[t>>24&255]+fn[n&255]+fn[n>>8&255]+fn[n>>16&255]+fn[n>>24&255]).toLowerCase()}function $t(i,e,t){return Math.max(e,Math.min(t,i))}function hu(i,e){return(i%e+e)%e}function sm(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function rm(i,e,t){return i!==e?(t-i)/(e-i):0}function io(i,e,t){return(1-t)*i+t*e}function om(i,e,t,n){return io(i,e,1-Math.exp(-t*n))}function am(i,e=1){return e-Math.abs(hu(i,e*2)-e)}function lm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function cm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function hm(i,e){return i+Math.floor(Math.random()*(e-i+1))}function um(i,e){return i+Math.random()*(e-i)}function dm(i){return i*(.5-Math.random())}function fm(i){i!==void 0&&(dd=i);let e=dd+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function pm(i){return i*no}function mm(i){return i*lo}function gm(i){return(i&i-1)===0&&i!==0}function vm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function xm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function ym(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),m=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*m,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*m,a*c);break;case"ZYZ":i.set(l*m,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function cr(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function _n(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Cr={DEG2RAD:no,RAD2DEG:lo,generateUUID:Ns,clamp:$t,euclideanModulo:hu,mapLinear:sm,inverseLerp:rm,lerp:io,damp:om,pingpong:am,smoothstep:lm,smootherstep:cm,randInt:hm,randFloat:um,randFloatSpread:dm,seededRandom:fm,degToRad:pm,radToDeg:mm,isPowerOfTwo:gm,ceilPowerOfTwo:vm,floorPowerOfTwo:xm,setQuaternionFromProperEuler:ym,normalize:_n,denormalize:cr},ue=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos($t(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},et=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],v=s[0],g=s[3],p=s[6],_=s[1],x=s[4],y=s[7],I=s[2],S=s[5],P=s[8];return r[0]=o*v+a*_+l*I,r[3]=o*g+a*x+l*S,r[6]=o*p+a*y+l*P,r[1]=c*v+h*_+u*I,r[4]=c*g+h*x+u*S,r[7]=c*p+h*y+u*P,r[2]=d*v+f*_+m*I,r[5]=d*g+f*x+m*S,r[8]=d*p+f*y+m*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,m=t*u+n*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/m;return e[0]=u*v,e[1]=(s*c-h*n)*v,e[2]=(a*n-s*o)*v,e[3]=d*v,e[4]=(h*t-s*l)*v,e[5]=(s*r-a*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(o*t-n*r)*v,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(ql.makeScale(e,t)),this}rotate(e){return this.premultiply(ql.makeRotation(-e)),this}translate(e,t){return this.premultiply(ql.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},ql=new et;function Lf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Sa(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function _m(){let i=Sa("canvas");return i.style.display="block",i}var fd={};function eo(i){i in fd||(fd[i]=!0,console.warn(i))}function Mm(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function bm(i){let e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Em(i){let e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var dt={enabled:!0,workingColorSpace:Rr,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===St&&(i.r=Li(i.r),i.g=Li(i.g),i.b=Li(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===St&&(i.r=pr(i.r),i.g=pr(i.g),i.b=pr(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===es?Ka:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Li(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function pr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var pd=[.64,.33,.3,.6,.15,.06],md=[.2126,.7152,.0722],gd=[.3127,.329],vd=new et().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xd=new et().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);dt.define({[Rr]:{primaries:pd,whitePoint:gd,transfer:Ka,toXYZ:vd,fromXYZ:xd,luminanceCoefficients:md,workingColorSpaceConfig:{unpackColorSpace:ht},outputColorSpaceConfig:{drawingBufferColorSpace:ht}},[ht]:{primaries:pd,whitePoint:gd,transfer:St,toXYZ:vd,fromXYZ:xd,luminanceCoefficients:md,outputColorSpaceConfig:{drawingBufferColorSpace:ht}}});var Ks,ch=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ks===void 0&&(Ks=Sa("canvas")),Ks.width=e.width,Ks.height=e.height;let n=Ks.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Ks}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Sa("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Li(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Li(t[n]/255)*255):t[n]=Li(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},wm=0,Ta=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:wm++}),this.uuid=Ns(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Yl(s[o].image)):r.push(Yl(s[o]))}else r=Yl(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function Yl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ch.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Sm=0,Pn=class i extends os{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Cs,s=Cs,r=Nn,o=Ps,a=ii,l=ki,c=i.DEFAULT_ANISOTROPY,h=es){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Sm++}),this.uuid=Ns(),this.name="",this.source=new Ta(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ue(0,0),this.repeat=new ue(1,1),this.center=new ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new et,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==_f)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Di:e.x=e.x-Math.floor(e.x);break;case Cs:e.x=e.x<0?0:1;break;case Uc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Di:e.y=e.y-Math.floor(e.y);break;case Cs:e.y=e.y<0?0:1;break;case Uc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Pn.DEFAULT_IMAGE=null;Pn.DEFAULT_MAPPING=_f;Pn.DEFAULT_ANISOTROPY=1;var Tt=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let x=(c+1)/2,y=(f+1)/2,I=(p+1)/2,S=(h+d)/4,P=(u+v)/4,R=(m+g)/4;return x>y&&x>I?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=S/n,r=P/n):y>I?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=S/s,r=R/s):I<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(I),n=P/r,s=R/r),this.set(n,s,r,t),this}let _=Math.sqrt((g-m)*(g-m)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(g-m)/_,this.y=(u-v)/_,this.z=(d-h)/_,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},hh=class extends os{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Tt(0,0,e,t),this.scissorTest=!1,this.viewport=new Tt(0,0,e,t);let s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Nn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new Pn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Ta(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Gn=class extends hh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Aa=class extends Pn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Bn,this.minFilter=Bn,this.wrapR=Cs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var uh=class extends Pn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Bn,this.minFilter=Bn,this.wrapR=Cs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var qt=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],f=r[o+1],m=r[o+2],v=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=m,e[t+3]=v;return}if(u!==v||l!==d||c!==f||h!==m){let g=1-a,p=l*d+c*f+h*m+u*v,_=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){let I=Math.sqrt(x),S=Math.atan2(I,p*_);g=Math.sin(g*S)/I,a=Math.sin(a*S)/I}let y=a*_;if(l=l*g+d*y,c=c*g+f*y,h=h*g+m*y,u=u*g+v*y,g===1-a){let I=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=I,c*=I,h*=I,u*=I}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],m=r[o+3];return e[t]=a*m+h*u+l*f-c*d,e[t+1]=l*m+h*d+c*u-a*f,e[t+2]=c*m+h*f+a*d-l*u,e[t+3]=h*m-a*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),f=l(s/2),m=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($t(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},C=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(yd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(yd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Zl.copy(this).projectOnVector(e),this.sub(Zl)}reflect(e){return this.sub(Zl.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos($t(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Zl=new C,yd=new qt,Ui=class{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ei.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ei.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ei.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ei):ei.fromBufferAttribute(r,o),ei.applyMatrix4(e.matrixWorld),this.expandByPoint(ei);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Vo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Vo.copy(n.boundingBox)),Vo.applyMatrix4(e.matrixWorld),this.union(Vo)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ei),ei.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(qr),Wo.subVectors(this.max,qr),$s.subVectors(e.a,qr),Js.subVectors(e.b,qr),js.subVectors(e.c,qr),Zi.subVectors(Js,$s),Ki.subVectors(js,Js),ys.subVectors($s,js);let t=[0,-Zi.z,Zi.y,0,-Ki.z,Ki.y,0,-ys.z,ys.y,Zi.z,0,-Zi.x,Ki.z,0,-Ki.x,ys.z,0,-ys.x,-Zi.y,Zi.x,0,-Ki.y,Ki.x,0,-ys.y,ys.x,0];return!Kl(t,$s,Js,js,Wo)||(t=[1,0,0,0,1,0,0,0,1],!Kl(t,$s,Js,js,Wo))?!1:(Xo.crossVectors(Zi,Ki),t=[Xo.x,Xo.y,Xo.z],Kl(t,$s,Js,js,Wo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ei).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ei).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(wi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),wi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),wi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),wi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),wi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),wi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),wi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),wi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(wi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},wi=[new C,new C,new C,new C,new C,new C,new C,new C],ei=new C,Vo=new Ui,$s=new C,Js=new C,js=new C,Zi=new C,Ki=new C,ys=new C,qr=new C,Wo=new C,Xo=new C,_s=new C;function Kl(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){_s.fromArray(i,r);let a=s.x*Math.abs(_s.x)+s.y*Math.abs(_s.y)+s.z*Math.abs(_s.z),l=e.dot(_s),c=t.dot(_s),h=n.dot(_s);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Tm=new Ui,Yr=new C,$l=new C,Ni=class{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Tm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Yr.subVectors(e,this.center);let t=Yr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Yr,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):($l.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Yr.copy(e.center).add($l)),this.expandByPoint(Yr.copy(e.center).sub($l))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Si=new C,Jl=new C,qo=new C,$i=new C,jl=new C,Yo=new C,Ql=new C,co=class{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Si)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Si.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Si.copy(this.origin).addScaledVector(this.direction,t),Si.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Jl.copy(e).add(t).multiplyScalar(.5),qo.copy(t).sub(e).normalize(),$i.copy(this.origin).sub(Jl);let r=e.distanceTo(t)*.5,o=-this.direction.dot(qo),a=$i.dot(this.direction),l=-$i.dot(qo),c=$i.lengthSq(),h=Math.abs(1-o*o),u,d,f,m;if(h>0)if(u=o*l-a,d=o*a-l,m=r*h,u>=0)if(d>=-m)if(d<=m){let v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Jl).addScaledVector(qo,d),f}intersectSphere(e,t){Si.subVectors(e.center,this.origin);let n=Si.dot(this.direction),s=Si.dot(Si)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Si)!==null}intersectTriangle(e,t,n,s,r){jl.subVectors(t,e),Yo.subVectors(n,e),Ql.crossVectors(jl,Yo);let o=this.direction.dot(Ql),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;$i.subVectors(this.origin,e);let l=a*this.direction.dot(Yo.crossVectors($i,Yo));if(l<0)return null;let c=a*this.direction.dot(jl.cross($i));if(c<0||l+c>o)return null;let h=-a*$i.dot(Ql);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},$e=class i{constructor(e,t,n,s,r,o,a,l,c,h,u,d,f,m,v,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,d,f,m,v,g)}set(e,t,n,s,r,o,a,l,c,h,u,d,f,m,v,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/Qs.setFromMatrixColumn(e,0).length(),r=1/Qs.setFromMatrixColumn(e,1).length(),o=1/Qs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,f=o*u,m=a*h,v=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+m*c,t[5]=d-v*c,t[9]=-a*l,t[2]=v-d*c,t[6]=m+f*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,m=c*h,v=c*u;t[0]=d+v*a,t[4]=m*a-f,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-m,t[6]=v+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,m=c*h,v=c*u;t[0]=d-v*a,t[4]=-o*u,t[8]=m+f*a,t[1]=f+m*a,t[5]=o*h,t[9]=v-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,f=o*u,m=a*h,v=a*u;t[0]=l*h,t[4]=m*c-f,t[8]=d*c+v,t[1]=l*u,t[5]=v*c+d,t[9]=f*c-m,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,m=a*l,v=a*c;t[0]=l*h,t[4]=v-d*u,t[8]=m*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*u+m,t[10]=d-v*u}else if(e.order==="XZY"){let d=o*l,f=o*c,m=a*l,v=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+v,t[5]=o*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=a*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Am,e,Rm)}lookAt(e,t,n){let s=this.elements;return kn.subVectors(e,t),kn.lengthSq()===0&&(kn.z=1),kn.normalize(),Ji.crossVectors(n,kn),Ji.lengthSq()===0&&(Math.abs(n.z)===1?kn.x+=1e-4:kn.z+=1e-4,kn.normalize(),Ji.crossVectors(n,kn)),Ji.normalize(),Zo.crossVectors(kn,Ji),s[0]=Ji.x,s[4]=Zo.x,s[8]=kn.x,s[1]=Ji.y,s[5]=Zo.y,s[9]=kn.y,s[2]=Ji.z,s[6]=Zo.z,s[10]=kn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],v=n[6],g=n[10],p=n[14],_=n[3],x=n[7],y=n[11],I=n[15],S=s[0],P=s[4],R=s[8],b=s[12],M=s[1],T=s[5],k=s[9],U=s[13],H=s[2],F=s[6],N=s[10],j=s[14],G=s[3],ce=s[7],pe=s[11],xe=s[15];return r[0]=o*S+a*M+l*H+c*G,r[4]=o*P+a*T+l*F+c*ce,r[8]=o*R+a*k+l*N+c*pe,r[12]=o*b+a*U+l*j+c*xe,r[1]=h*S+u*M+d*H+f*G,r[5]=h*P+u*T+d*F+f*ce,r[9]=h*R+u*k+d*N+f*pe,r[13]=h*b+u*U+d*j+f*xe,r[2]=m*S+v*M+g*H+p*G,r[6]=m*P+v*T+g*F+p*ce,r[10]=m*R+v*k+g*N+p*pe,r[14]=m*b+v*U+g*j+p*xe,r[3]=_*S+x*M+y*H+I*G,r[7]=_*P+x*T+y*F+I*ce,r[11]=_*R+x*k+y*N+I*pe,r[15]=_*b+x*U+y*j+I*xe,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],v=e[7],g=e[11],p=e[15];return m*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*f-n*l*f)+v*(+t*l*f-t*c*d+r*o*d-s*o*f+s*c*h-r*l*h)+g*(+t*c*u-t*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-s*a*h-t*l*u+t*a*d+s*o*u-n*o*d+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],v=e[13],g=e[14],p=e[15],_=u*g*c-v*d*c+v*l*f-a*g*f-u*l*p+a*d*p,x=m*d*c-h*g*c-m*l*f+o*g*f+h*l*p-o*d*p,y=h*v*c-m*u*c+m*a*f-o*v*f-h*a*p+o*u*p,I=m*u*l-h*v*l-m*a*d+o*v*d+h*a*g-o*u*g,S=t*_+n*x+s*y+r*I;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let P=1/S;return e[0]=_*P,e[1]=(v*d*r-u*g*r-v*s*f+n*g*f+u*s*p-n*d*p)*P,e[2]=(a*g*r-v*l*r+v*s*c-n*g*c-a*s*p+n*l*p)*P,e[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*f-n*l*f)*P,e[4]=x*P,e[5]=(h*g*r-m*d*r+m*s*f-t*g*f-h*s*p+t*d*p)*P,e[6]=(m*l*r-o*g*r-m*s*c+t*g*c+o*s*p-t*l*p)*P,e[7]=(o*d*r-h*l*r+h*s*c-t*d*c-o*s*f+t*l*f)*P,e[8]=y*P,e[9]=(m*u*r-h*v*r-m*n*f+t*v*f+h*n*p-t*u*p)*P,e[10]=(o*v*r-m*a*r+m*n*c-t*v*c-o*n*p+t*a*p)*P,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*f-t*a*f)*P,e[12]=I*P,e[13]=(h*v*s-m*u*s+m*n*d-t*v*d-h*n*g+t*u*g)*P,e[14]=(m*a*s-o*v*s-m*n*l+t*v*l+o*n*g-t*a*g)*P,e[15]=(o*u*s-h*a*s+h*n*l-t*u*l-o*n*d+t*a*d)*P,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,m=r*u,v=o*h,g=o*u,p=a*u,_=l*c,x=l*h,y=l*u,I=n.x,S=n.y,P=n.z;return s[0]=(1-(v+p))*I,s[1]=(f+y)*I,s[2]=(m-x)*I,s[3]=0,s[4]=(f-y)*S,s[5]=(1-(d+p))*S,s[6]=(g+_)*S,s[7]=0,s[8]=(m+x)*P,s[9]=(g-_)*P,s[10]=(1-(d+v))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=Qs.set(s[0],s[1],s[2]).length(),o=Qs.set(s[4],s[5],s[6]).length(),a=Qs.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],ti.copy(this);let c=1/r,h=1/o,u=1/a;return ti.elements[0]*=c,ti.elements[1]*=c,ti.elements[2]*=c,ti.elements[4]*=h,ti.elements[5]*=h,ti.elements[6]*=h,ti.elements[8]*=u,ti.elements[9]*=u,ti.elements[10]*=u,t.setFromRotationMatrix(ti),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=Ii){let l=this.elements,c=2*r/(t-e),h=2*r/(n-s),u=(t+e)/(t-e),d=(n+s)/(n-s),f,m;if(a===Ii)f=-(o+r)/(o-r),m=-2*o*r/(o-r);else if(a===wa)f=-o/(o-r),m=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Ii){let l=this.elements,c=1/(t-e),h=1/(n-s),u=1/(o-r),d=(t+e)*c,f=(n+s)*h,m,v;if(a===Ii)m=(o+r)*u,v=-2*u;else if(a===wa)m=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=v,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Qs=new C,ti=new $e,Am=new C(0,0,0),Rm=new C(1,1,1),Ji=new C,Zo=new C,kn=new C,_d=new $e,Md=new qt,ln=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin($t(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$t(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin($t(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-$t(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin($t(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-$t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return _d.makeRotationFromQuaternion(e),this.setFromRotationMatrix(_d,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Md.setFromEuler(this),this.setFromQuaternion(Md,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ln.DEFAULT_ORDER="XYZ";var Ra=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Cm=0,bd=new C,er=new qt,Ti=new $e,Ko=new C,Zr=new C,Pm=new C,Im=new qt,Ed=new C(1,0,0),wd=new C(0,1,0),Sd=new C(0,0,1),Td={type:"added"},Lm={type:"removed"},tr={type:"childadded",child:null},ec={type:"childremoved",child:null},cn=class i extends os{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Cm++}),this.uuid=Ns(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new C,t=new ln,n=new qt,s=new C(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new $e},normalMatrix:{value:new et}}),this.matrix=new $e,this.matrixWorld=new $e,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ra,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return er.setFromAxisAngle(e,t),this.quaternion.multiply(er),this}rotateOnWorldAxis(e,t){return er.setFromAxisAngle(e,t),this.quaternion.premultiply(er),this}rotateX(e){return this.rotateOnAxis(Ed,e)}rotateY(e){return this.rotateOnAxis(wd,e)}rotateZ(e){return this.rotateOnAxis(Sd,e)}translateOnAxis(e,t){return bd.copy(e).applyQuaternion(this.quaternion),this.position.add(bd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ed,e)}translateY(e){return this.translateOnAxis(wd,e)}translateZ(e){return this.translateOnAxis(Sd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ti.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ko.copy(e):Ko.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Zr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ti.lookAt(Zr,Ko,this.up):Ti.lookAt(Ko,Zr,this.up),this.quaternion.setFromRotationMatrix(Ti),s&&(Ti.extractRotation(s.matrixWorld),er.setFromRotationMatrix(Ti),this.quaternion.premultiply(er.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Td),tr.child=e,this.dispatchEvent(tr),tr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Lm),ec.child=e,this.dispatchEvent(ec),ec.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ti.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ti.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ti),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Td),tr.child=e,this.dispatchEvent(tr),tr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zr,e,Pm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zr,Im,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),m=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};cn.DEFAULT_UP=new C(0,1,0);cn.DEFAULT_MATRIX_AUTO_UPDATE=!0;cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ni=new C,Ai=new C,tc=new C,Ri=new C,nr=new C,ir=new C,Ad=new C,nc=new C,ic=new C,sc=new C,rc=new Tt,oc=new Tt,ac=new Tt,As=class i{constructor(e=new C,t=new C,n=new C){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),ni.subVectors(e,t),s.cross(ni);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){ni.subVectors(s,t),Ai.subVectors(n,t),tc.subVectors(e,t);let o=ni.dot(ni),a=ni.dot(Ai),l=ni.dot(tc),c=Ai.dot(Ai),h=Ai.dot(tc),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,m=(o*h-a*l)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Ri)===null?!1:Ri.x>=0&&Ri.y>=0&&Ri.x+Ri.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Ri)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ri.x),l.addScaledVector(o,Ri.y),l.addScaledVector(a,Ri.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return rc.setScalar(0),oc.setScalar(0),ac.setScalar(0),rc.fromBufferAttribute(e,t),oc.fromBufferAttribute(e,n),ac.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(rc,r.x),o.addScaledVector(oc,r.y),o.addScaledVector(ac,r.z),o}static isFrontFacing(e,t,n,s){return ni.subVectors(n,t),Ai.subVectors(e,t),ni.cross(Ai).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ni.subVectors(this.c,this.b),Ai.subVectors(this.a,this.b),ni.cross(Ai).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;nr.subVectors(s,n),ir.subVectors(r,n),nc.subVectors(e,n);let l=nr.dot(nc),c=ir.dot(nc);if(l<=0&&c<=0)return t.copy(n);ic.subVectors(e,s);let h=nr.dot(ic),u=ir.dot(ic);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(nr,o);sc.subVectors(e,r);let f=nr.dot(sc),m=ir.dot(sc);if(m>=0&&f<=m)return t.copy(r);let v=f*c-l*m;if(v<=0&&c>=0&&m<=0)return a=c/(c-m),t.copy(n).addScaledVector(ir,a);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return Ad.subVectors(r,s),a=(u-h)/(u-h+(f-m)),t.copy(s).addScaledVector(Ad,a);let p=1/(g+v+d);return o=v*p,a=d*p,t.copy(n).addScaledVector(nr,o).addScaledVector(ir,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Df={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ji={h:0,s:0,l:0},$o={h:0,s:0,l:0};function lc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var Re=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ht){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,dt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=dt.workingColorSpace){return this.r=e,this.g=t,this.b=n,dt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=dt.workingColorSpace){if(e=hu(e,1),t=$t(t,0,1),n=$t(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=lc(o,r,e+1/3),this.g=lc(o,r,e),this.b=lc(o,r,e-1/3)}return dt.toWorkingColorSpace(this,s),this}setStyle(e,t=ht){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ht){let n=Df[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Li(e.r),this.g=Li(e.g),this.b=Li(e.b),this}copyLinearToSRGB(e){return this.r=pr(e.r),this.g=pr(e.g),this.b=pr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ht){return dt.fromWorkingColorSpace(pn.copy(this),e),Math.round($t(pn.r*255,0,255))*65536+Math.round($t(pn.g*255,0,255))*256+Math.round($t(pn.b*255,0,255))}getHexString(e=ht){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=dt.workingColorSpace){dt.fromWorkingColorSpace(pn.copy(this),t);let n=pn.r,s=pn.g,r=pn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=dt.workingColorSpace){return dt.fromWorkingColorSpace(pn.copy(this),t),e.r=pn.r,e.g=pn.g,e.b=pn.b,e}getStyle(e=ht){dt.fromWorkingColorSpace(pn.copy(this),e);let t=pn.r,n=pn.g,s=pn.b;return e!==ht?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(ji),this.setHSL(ji.h+e,ji.s+t,ji.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(ji),e.getHSL($o);let n=io(ji.h,$o.h,t),s=io(ji.s,$o.s,t),r=io(ji.l,$o.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},pn=new Re;Re.NAMES=Df;var Dm=0,mi=class extends os{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Dm++}),this.uuid=Ns(),this.name="",this.blending=dr,this.side=ss,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wc,this.blendDst=Sc,this.blendEquation=Ts,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Re(0,0,0),this.blendAlpha=0,this.depthFunc=gr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Zs,this.stencilZFail=Zs,this.stencilZPass=Zs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==dr&&(n.blending=this.blending),this.side!==ss&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==wc&&(n.blendSrc=this.blendSrc),this.blendDst!==Sc&&(n.blendDst=this.blendDst),this.blendEquation!==Ts&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==gr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==cd&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Zs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Zs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Zs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},hn=class extends mi{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new Re(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=eu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Xt=new C,Jo=new ue,Nt=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=hd,this.updateRanges=[],this.gpuType=pi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Jo.fromBufferAttribute(this,t),Jo.applyMatrix3(e),this.setXY(t,Jo.x,Jo.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Xt.fromBufferAttribute(this,t),Xt.applyMatrix3(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Xt.fromBufferAttribute(this,t),Xt.applyMatrix4(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Xt.fromBufferAttribute(this,t),Xt.applyNormalMatrix(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Xt.fromBufferAttribute(this,t),Xt.transformDirection(e),this.setXYZ(t,Xt.x,Xt.y,Xt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=cr(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=_n(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=cr(t,this.array)),t}setX(e,t){return this.normalized&&(t=_n(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=cr(t,this.array)),t}setY(e,t){return this.normalized&&(t=_n(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=cr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=_n(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=cr(t,this.array)),t}setW(e,t){return this.normalized&&(t=_n(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=_n(t,this.array),n=_n(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=_n(t,this.array),n=_n(n,this.array),s=_n(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=_n(t,this.array),n=_n(n,this.array),s=_n(s,this.array),r=_n(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==hd&&(e.usage=this.usage),e}};var Ca=class extends Nt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Pa=class extends Nt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Xe=class extends Nt{constructor(e,t,n){super(new Float32Array(e),t,n)}},km=0,zn=new $e,cc=new cn,sr=new C,Un=new Ui,Kr=new Ui,sn=new C,vt=class i extends os{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:km++}),this.uuid=Ns(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Lf(e)?Pa:Ca)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new et().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return zn.makeRotationFromQuaternion(e),this.applyMatrix4(zn),this}rotateX(e){return zn.makeRotationX(e),this.applyMatrix4(zn),this}rotateY(e){return zn.makeRotationY(e),this.applyMatrix4(zn),this}rotateZ(e){return zn.makeRotationZ(e),this.applyMatrix4(zn),this}translate(e,t,n){return zn.makeTranslation(e,t,n),this.applyMatrix4(zn),this}scale(e,t,n){return zn.makeScale(e,t,n),this.applyMatrix4(zn),this}lookAt(e){return cc.lookAt(e),cc.updateMatrix(),this.applyMatrix4(cc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(sr).negate(),this.translate(sr.x,sr.y,sr.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Xe(n,3))}else{for(let n=0,s=t.count;n<s;n++){let r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ui);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];Un.setFromBufferAttribute(r),this.morphTargetsRelative?(sn.addVectors(this.boundingBox.min,Un.min),this.boundingBox.expandByPoint(sn),sn.addVectors(this.boundingBox.max,Un.max),this.boundingBox.expandByPoint(sn)):(this.boundingBox.expandByPoint(Un.min),this.boundingBox.expandByPoint(Un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ni);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){let n=this.boundingSphere.center;if(Un.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Kr.setFromBufferAttribute(a),this.morphTargetsRelative?(sn.addVectors(Un.min,Kr.min),Un.expandByPoint(sn),sn.addVectors(Un.max,Kr.max),Un.expandByPoint(sn)):(Un.expandByPoint(Kr.min),Un.expandByPoint(Kr.max))}Un.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)sn.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(sn));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)sn.fromBufferAttribute(a,c),l&&(sr.fromBufferAttribute(e,c),sn.add(sr)),s=Math.max(s,n.distanceToSquared(sn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Nt(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let R=0;R<n.count;R++)a[R]=new C,l[R]=new C;let c=new C,h=new C,u=new C,d=new ue,f=new ue,m=new ue,v=new C,g=new C;function p(R,b,M){c.fromBufferAttribute(n,R),h.fromBufferAttribute(n,b),u.fromBufferAttribute(n,M),d.fromBufferAttribute(r,R),f.fromBufferAttribute(r,b),m.fromBufferAttribute(r,M),h.sub(c),u.sub(c),f.sub(d),m.sub(d);let T=1/(f.x*m.y-m.x*f.y);isFinite(T)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(T),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(T),a[R].add(v),a[b].add(v),a[M].add(v),l[R].add(g),l[b].add(g),l[M].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let R=0,b=_.length;R<b;++R){let M=_[R],T=M.start,k=M.count;for(let U=T,H=T+k;U<H;U+=3)p(e.getX(U+0),e.getX(U+1),e.getX(U+2))}let x=new C,y=new C,I=new C,S=new C;function P(R){I.fromBufferAttribute(s,R),S.copy(I);let b=a[R];x.copy(b),x.sub(I.multiplyScalar(I.dot(b))).normalize(),y.crossVectors(S,b);let T=y.dot(l[R])<0?-1:1;o.setXYZW(R,x.x,x.y,x.z,T)}for(let R=0,b=_.length;R<b;++R){let M=_[R],T=M.start,k=M.count;for(let U=T,H=T+k;U<H;U+=3)P(e.getX(U+0)),P(e.getX(U+1)),P(e.getX(U+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Nt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new C,r=new C,o=new C,a=new C,l=new C,c=new C,h=new C,u=new C;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),v=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,g),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)sn.fromBufferAttribute(e,t),sn.normalize(),e.setXYZ(t,sn.x,sn.y,sn.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,m=0;for(let v=0,g=l.length;v<g;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new Nt(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Rd=new $e,Ms=new co,jo=new Ni,Cd=new C,Qo=new C,ea=new C,ta=new C,hc=new C,na=new C,Pd=new C,ia=new C,D=class extends cn{constructor(e=new vt,t=new hn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){na.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(hc.fromBufferAttribute(u,e),o?na.addScaledVector(hc,h):na.addScaledVector(hc.sub(t),h))}t.add(na)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),jo.copy(n.boundingSphere),jo.applyMatrix4(r),Ms.copy(e.ray).recast(e.near),!(jo.containsPoint(Ms.origin)===!1&&(Ms.intersectSphere(jo,Cd)===null||Ms.origin.distanceToSquared(Cd)>(e.far-e.near)**2))&&(Rd.copy(r).invert(),Ms.copy(e.ray).applyMatrix4(Rd),!(n.boundingBox!==null&&Ms.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ms)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,v=d.length;m<v;m++){let g=d[m],p=o[g.materialIndex],_=Math.max(g.start,f.start),x=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let y=_,I=x;y<I;y+=3){let S=a.getX(y),P=a.getX(y+1),R=a.getX(y+2);s=sa(this,p,e,n,c,h,u,S,P,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){let _=a.getX(g),x=a.getX(g+1),y=a.getX(g+2);s=sa(this,o,e,n,c,h,u,_,x,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,v=d.length;m<v;m++){let g=d[m],p=o[g.materialIndex],_=Math.max(g.start,f.start),x=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let y=_,I=x;y<I;y+=3){let S=y,P=y+1,R=y+2;s=sa(this,p,e,n,c,h,u,S,P,R),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){let _=g,x=g+1,y=g+2;s=sa(this,o,e,n,c,h,u,_,x,y),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function Um(i,e,t,n,s,r,o,a){let l;if(e.side===mn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===ss,a),l===null)return null;ia.copy(a),ia.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(ia);return c<t.near||c>t.far?null:{distance:c,point:ia.clone(),object:i}}function sa(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,Qo),i.getVertexPosition(l,ea),i.getVertexPosition(c,ta);let h=Um(i,e,t,n,Qo,ea,ta,Pd);if(h){let u=new C;As.getBarycoord(Pd,Qo,ea,ta,u),s&&(h.uv=As.getInterpolatedAttribute(s,a,l,c,u,new ue)),r&&(h.uv1=As.getInterpolatedAttribute(r,a,l,c,u,new ue)),o&&(h.normal=As.getInterpolatedAttribute(o,a,l,c,u,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new C,materialIndex:0};As.getNormal(Qo,ea,ta,d.normal),h.face=d,h.barycoord=u}return h}var Ue=class i extends vt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,t,e,o,r,0),m("z","y","x",1,-1,n,t,-e,o,r,1),m("x","z","y",1,1,e,n,t,s,o,2),m("x","z","y",1,-1,e,n,-t,s,o,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Xe(c,3)),this.setAttribute("normal",new Xe(h,3)),this.setAttribute("uv",new Xe(u,2));function m(v,g,p,_,x,y,I,S,P,R,b){let M=y/P,T=I/R,k=y/2,U=I/2,H=S/2,F=P+1,N=R+1,j=0,G=0,ce=new C;for(let pe=0;pe<N;pe++){let xe=pe*T-U;for(let Ge=0;Ge<F;Ge++){let Ze=Ge*M-k;ce[v]=Ze*_,ce[g]=xe*x,ce[p]=H,c.push(ce.x,ce.y,ce.z),ce[v]=0,ce[g]=0,ce[p]=S>0?1:-1,h.push(ce.x,ce.y,ce.z),u.push(Ge/P),u.push(1-pe/R),j+=1}}for(let pe=0;pe<R;pe++)for(let xe=0;xe<P;xe++){let Ge=d+xe+F*pe,Ze=d+xe+F*(pe+1),V=d+(xe+1)+F*(pe+1),K=d+(xe+1)+F*pe;l.push(Ge,Ze,K),l.push(Ze,V,K),G+=6}a.addGroup(f,G,b),f+=G,d+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Mr(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Mn(i){let e={};for(let t=0;t<i.length;t++){let n=Mr(i[t]);for(let s in n)e[s]=n[s]}return e}function Nm(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function kf(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:dt.workingColorSpace}var Bm={clone:Mr,merge:Mn},Hm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Fm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,jt=class extends mi{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Hm,this.fragmentShader=Fm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Mr(e.uniforms),this.uniformsGroups=Nm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Ia=class extends cn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $e,this.projectionMatrix=new $e,this.projectionMatrixInverse=new $e,this.coordinateSystem=Ii}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Qi=new C,Id=new ue,Ld=new ue,Jt=class extends Ia{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=lo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(no*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return lo*2*Math.atan(Math.tan(no*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Qi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Qi.x,Qi.y).multiplyScalar(-e/Qi.z),Qi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Qi.x,Qi.y).multiplyScalar(-e/Qi.z)}getViewSize(e,t){return this.getViewBounds(e,Id,Ld),t.subVectors(Ld,Id)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(no*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},rr=-90,or=1,dh=class extends cn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Jt(rr,or,e,t);s.layers=this.layers,this.add(s);let r=new Jt(rr,or,e,t);r.layers=this.layers,this.add(r);let o=new Jt(rr,or,e,t);o.layers=this.layers,this.add(o);let a=new Jt(rr,or,e,t);a.layers=this.layers,this.add(a);let l=new Jt(rr,or,e,t);l.layers=this.layers,this.add(l);let c=new Jt(rr,or,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===Ii)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===wa)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},La=class extends Pn{constructor(e,t,n,s,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:vr,super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},fh=class extends Gn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new La(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Nn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ue(5,5,5),r=new jt({name:"CubemapFromEquirect",uniforms:Mr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:mn,blending:ts});r.uniforms.tEquirect.value=t;let o=new D(s,r),a=t.minFilter;return t.minFilter===Ps&&(t.minFilter=Nn),new dh(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},uc=new C,Om=new C,zm=new et,Pi=class{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=uc.subVectors(n,t).cross(Om.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(uc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||zm.getNormalMatrix(e),s=this.coplanarPoint(uc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},bs=new Ni,ra=new C,ho=class{constructor(e=new Pi,t=new Pi,n=new Pi,s=new Pi,r=new Pi,o=new Pi){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ii){let n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],f=s[8],m=s[9],v=s[10],g=s[11],p=s[12],_=s[13],x=s[14],y=s[15];if(n[0].setComponents(l-r,d-c,g-f,y-p).normalize(),n[1].setComponents(l+r,d+c,g+f,y+p).normalize(),n[2].setComponents(l+o,d+h,g+m,y+_).normalize(),n[3].setComponents(l-o,d-h,g-m,y-_).normalize(),n[4].setComponents(l-a,d-u,g-v,y-x).normalize(),t===Ii)n[5].setComponents(l+a,d+u,g+v,y+x).normalize();else if(t===wa)n[5].setComponents(a,u,v,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),bs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),bs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(bs)}intersectsSprite(e){return bs.center.set(0,0,0),bs.radius=.7071067811865476,bs.applyMatrix4(e.matrixWorld),this.intersectsSphere(bs)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(ra.x=s.normal.x>0?e.max.x:e.min.x,ra.y=s.normal.y>0?e.max.y:e.min.y,ra.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ra)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Uf(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Gm(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],v=u[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let v=u[f];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var tt=class i extends vt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,d=t/l,f=[],m=[],v=[],g=[];for(let p=0;p<h;p++){let _=p*d-o;for(let x=0;x<c;x++){let y=x*u-r;m.push(y,-_,0),v.push(0,0,1),g.push(x/a),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let _=0;_<a;_++){let x=_+c*p,y=_+c*(p+1),I=_+1+c*(p+1),S=_+1+c*p;f.push(x,y,S),f.push(y,I,S)}this.setIndex(f),this.setAttribute("position",new Xe(m,3)),this.setAttribute("normal",new Xe(v,3)),this.setAttribute("uv",new Xe(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},Vm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Xm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,qm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ym=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Km=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,$m=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Jm=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,jm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Qm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,eg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,tg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ng=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ig=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,sg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,rg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,og=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ag=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,lg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,cg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,hg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ug=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,dg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,fg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,pg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,mg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,vg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,xg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,yg="gl_FragColor = linearToOutputTexel( gl_FragColor );",_g=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Mg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,bg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Eg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,wg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Sg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Tg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ag=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Rg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Cg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Pg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ig=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Lg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Dg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,kg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ug=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ng=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Bg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Fg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Og=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,zg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Gg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Vg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Wg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Xg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,qg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yg=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zg=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Kg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,$g=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Jg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,jg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Qg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ev=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,tv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,nv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,iv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sv=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,rv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ov=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,av=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,lv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,uv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,dv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,fv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,xv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,yv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,_v=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,bv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ev=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,wv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Sv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Tv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Av=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Rv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Cv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Pv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Iv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Lv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Dv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,kv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Uv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Nv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Bv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Hv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Fv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ov=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,zv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Gv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Vv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Kv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,$v=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Jv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,jv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ex=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tx=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,nx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ix=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,rx=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ox=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ax=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,cx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,hx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ux=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,fx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,px=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gx=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,vx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,xx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,_x=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Mx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,it={alphahash_fragment:Vm,alphahash_pars_fragment:Wm,alphamap_fragment:Xm,alphamap_pars_fragment:qm,alphatest_fragment:Ym,alphatest_pars_fragment:Zm,aomap_fragment:Km,aomap_pars_fragment:$m,batching_pars_vertex:Jm,batching_vertex:jm,begin_vertex:Qm,beginnormal_vertex:eg,bsdfs:tg,iridescence_fragment:ng,bumpmap_pars_fragment:ig,clipping_planes_fragment:sg,clipping_planes_pars_fragment:rg,clipping_planes_pars_vertex:og,clipping_planes_vertex:ag,color_fragment:lg,color_pars_fragment:cg,color_pars_vertex:hg,color_vertex:ug,common:dg,cube_uv_reflection_fragment:fg,defaultnormal_vertex:pg,displacementmap_pars_vertex:mg,displacementmap_vertex:gg,emissivemap_fragment:vg,emissivemap_pars_fragment:xg,colorspace_fragment:yg,colorspace_pars_fragment:_g,envmap_fragment:Mg,envmap_common_pars_fragment:bg,envmap_pars_fragment:Eg,envmap_pars_vertex:wg,envmap_physical_pars_fragment:Ug,envmap_vertex:Sg,fog_vertex:Tg,fog_pars_vertex:Ag,fog_fragment:Rg,fog_pars_fragment:Cg,gradientmap_pars_fragment:Pg,lightmap_pars_fragment:Ig,lights_lambert_fragment:Lg,lights_lambert_pars_fragment:Dg,lights_pars_begin:kg,lights_toon_fragment:Ng,lights_toon_pars_fragment:Bg,lights_phong_fragment:Hg,lights_phong_pars_fragment:Fg,lights_physical_fragment:Og,lights_physical_pars_fragment:zg,lights_fragment_begin:Gg,lights_fragment_maps:Vg,lights_fragment_end:Wg,logdepthbuf_fragment:Xg,logdepthbuf_pars_fragment:qg,logdepthbuf_pars_vertex:Yg,logdepthbuf_vertex:Zg,map_fragment:Kg,map_pars_fragment:$g,map_particle_fragment:Jg,map_particle_pars_fragment:jg,metalnessmap_fragment:Qg,metalnessmap_pars_fragment:ev,morphinstance_vertex:tv,morphcolor_vertex:nv,morphnormal_vertex:iv,morphtarget_pars_vertex:sv,morphtarget_vertex:rv,normal_fragment_begin:ov,normal_fragment_maps:av,normal_pars_fragment:lv,normal_pars_vertex:cv,normal_vertex:hv,normalmap_pars_fragment:uv,clearcoat_normal_fragment_begin:dv,clearcoat_normal_fragment_maps:fv,clearcoat_pars_fragment:pv,iridescence_pars_fragment:mv,opaque_fragment:gv,packing:vv,premultiplied_alpha_fragment:xv,project_vertex:yv,dithering_fragment:_v,dithering_pars_fragment:Mv,roughnessmap_fragment:bv,roughnessmap_pars_fragment:Ev,shadowmap_pars_fragment:wv,shadowmap_pars_vertex:Sv,shadowmap_vertex:Tv,shadowmask_pars_fragment:Av,skinbase_vertex:Rv,skinning_pars_vertex:Cv,skinning_vertex:Pv,skinnormal_vertex:Iv,specularmap_fragment:Lv,specularmap_pars_fragment:Dv,tonemapping_fragment:kv,tonemapping_pars_fragment:Uv,transmission_fragment:Nv,transmission_pars_fragment:Bv,uv_pars_fragment:Hv,uv_pars_vertex:Fv,uv_vertex:Ov,worldpos_vertex:zv,background_vert:Gv,background_frag:Vv,backgroundCube_vert:Wv,backgroundCube_frag:Xv,cube_vert:qv,cube_frag:Yv,depth_vert:Zv,depth_frag:Kv,distanceRGBA_vert:$v,distanceRGBA_frag:Jv,equirect_vert:jv,equirect_frag:Qv,linedashed_vert:ex,linedashed_frag:tx,meshbasic_vert:nx,meshbasic_frag:ix,meshlambert_vert:sx,meshlambert_frag:rx,meshmatcap_vert:ox,meshmatcap_frag:ax,meshnormal_vert:lx,meshnormal_frag:cx,meshphong_vert:hx,meshphong_frag:ux,meshphysical_vert:dx,meshphysical_frag:fx,meshtoon_vert:px,meshtoon_frag:mx,points_vert:gx,points_frag:vx,shadow_vert:xx,shadow_frag:yx,sprite_vert:_x,sprite_frag:Mx},Ee={common:{diffuse:{value:new Re(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new et}},envmap:{envMap:{value:null},envMapRotation:{value:new et},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new et}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new et}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new et},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new et},normalScale:{value:new ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new et},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new et}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new et}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new et}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Re(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Re(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0},uvTransform:{value:new et}},sprite:{diffuse:{value:new Re(16777215)},opacity:{value:1},center:{value:new ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new et},alphaMap:{value:null},alphaMapTransform:{value:new et},alphaTest:{value:0}}},fi={basic:{uniforms:Mn([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.fog]),vertexShader:it.meshbasic_vert,fragmentShader:it.meshbasic_frag},lambert:{uniforms:Mn([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,Ee.lights,{emissive:{value:new Re(0)}}]),vertexShader:it.meshlambert_vert,fragmentShader:it.meshlambert_frag},phong:{uniforms:Mn([Ee.common,Ee.specularmap,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,Ee.lights,{emissive:{value:new Re(0)},specular:{value:new Re(1118481)},shininess:{value:30}}]),vertexShader:it.meshphong_vert,fragmentShader:it.meshphong_frag},standard:{uniforms:Mn([Ee.common,Ee.envmap,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.roughnessmap,Ee.metalnessmap,Ee.fog,Ee.lights,{emissive:{value:new Re(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag},toon:{uniforms:Mn([Ee.common,Ee.aomap,Ee.lightmap,Ee.emissivemap,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.gradientmap,Ee.fog,Ee.lights,{emissive:{value:new Re(0)}}]),vertexShader:it.meshtoon_vert,fragmentShader:it.meshtoon_frag},matcap:{uniforms:Mn([Ee.common,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,Ee.fog,{matcap:{value:null}}]),vertexShader:it.meshmatcap_vert,fragmentShader:it.meshmatcap_frag},points:{uniforms:Mn([Ee.points,Ee.fog]),vertexShader:it.points_vert,fragmentShader:it.points_frag},dashed:{uniforms:Mn([Ee.common,Ee.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:it.linedashed_vert,fragmentShader:it.linedashed_frag},depth:{uniforms:Mn([Ee.common,Ee.displacementmap]),vertexShader:it.depth_vert,fragmentShader:it.depth_frag},normal:{uniforms:Mn([Ee.common,Ee.bumpmap,Ee.normalmap,Ee.displacementmap,{opacity:{value:1}}]),vertexShader:it.meshnormal_vert,fragmentShader:it.meshnormal_frag},sprite:{uniforms:Mn([Ee.sprite,Ee.fog]),vertexShader:it.sprite_vert,fragmentShader:it.sprite_frag},background:{uniforms:{uvTransform:{value:new et},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:it.background_vert,fragmentShader:it.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new et}},vertexShader:it.backgroundCube_vert,fragmentShader:it.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:it.cube_vert,fragmentShader:it.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:it.equirect_vert,fragmentShader:it.equirect_frag},distanceRGBA:{uniforms:Mn([Ee.common,Ee.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:it.distanceRGBA_vert,fragmentShader:it.distanceRGBA_frag},shadow:{uniforms:Mn([Ee.lights,Ee.fog,{color:{value:new Re(0)},opacity:{value:1}}]),vertexShader:it.shadow_vert,fragmentShader:it.shadow_frag}};fi.physical={uniforms:Mn([fi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new et},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new et},clearcoatNormalScale:{value:new ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new et},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new et},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new et},sheen:{value:0},sheenColor:{value:new Re(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new et},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new et},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new et},transmissionSamplerSize:{value:new ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new et},attenuationDistance:{value:0},attenuationColor:{value:new Re(0)},specularColor:{value:new Re(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new et},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new et},anisotropyVector:{value:new ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new et}}]),vertexShader:it.meshphysical_vert,fragmentShader:it.meshphysical_frag};var oa={r:0,b:0,g:0},Es=new ln,bx=new $e;function Ex(i,e,t,n,s,r,o){let a=new Re(0),l=r===!0?0:1,c,h,u=null,d=0,f=null;function m(_){let x=_.isScene===!0?_.background:null;return x&&x.isTexture&&(x=(_.backgroundBlurriness>0?t:e).get(x)),x}function v(_){let x=!1,y=m(_);y===null?p(a,l):y&&y.isColor&&(p(y,1),x=!0);let I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,o):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(_,x){let y=m(x);y&&(y.isCubeTexture||y.mapping===Za)?(h===void 0&&(h=new D(new Ue(1,1,1),new jt({name:"BackgroundCubeMaterial",uniforms:Mr(fi.backgroundCube.uniforms),vertexShader:fi.backgroundCube.vertexShader,fragmentShader:fi.backgroundCube.fragmentShader,side:mn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,S,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Es.copy(x.backgroundRotation),Es.x*=-1,Es.y*=-1,Es.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Es.y*=-1,Es.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(bx.makeRotationFromEuler(Es)),h.material.toneMapped=dt.getTransfer(y.colorSpace)!==St,(u!==y||d!==y.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,f=i.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new D(new tt(2,2),new jt({name:"BackgroundMaterial",uniforms:Mr(fi.background.uniforms),vertexShader:fi.background.vertexShader,fragmentShader:fi.background.fragmentShader,side:ss,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=dt.getTransfer(y.colorSpace)!==St,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=y,d=y.version,f=i.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function p(_,x){_.getRGB(oa,kf(i)),n.buffers.color.setClear(oa.r,oa.g,oa.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(_,x=1){a.set(_),l=x,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(_){l=_,p(a,l)},render:v,addToRenderList:g}}function wx(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(M,T,k,U,H){let F=!1,N=u(U,k,T);r!==N&&(r=N,c(r.object)),F=f(M,U,k,H),F&&m(M,U,k,H),H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(F||o)&&(o=!1,y(M,T,k,U),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return i.createVertexArray()}function c(M){return i.bindVertexArray(M)}function h(M){return i.deleteVertexArray(M)}function u(M,T,k){let U=k.wireframe===!0,H=n[M.id];H===void 0&&(H={},n[M.id]=H);let F=H[T.id];F===void 0&&(F={},H[T.id]=F);let N=F[U];return N===void 0&&(N=d(l()),F[U]=N),N}function d(M){let T=[],k=[],U=[];for(let H=0;H<t;H++)T[H]=0,k[H]=0,U[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:k,attributeDivisors:U,object:M,attributes:{},index:null}}function f(M,T,k,U){let H=r.attributes,F=T.attributes,N=0,j=k.getAttributes();for(let G in j)if(j[G].location>=0){let pe=H[G],xe=F[G];if(xe===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(xe=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(xe=M.instanceColor)),pe===void 0||pe.attribute!==xe||xe&&pe.data!==xe.data)return!0;N++}return r.attributesNum!==N||r.index!==U}function m(M,T,k,U){let H={},F=T.attributes,N=0,j=k.getAttributes();for(let G in j)if(j[G].location>=0){let pe=F[G];pe===void 0&&(G==="instanceMatrix"&&M.instanceMatrix&&(pe=M.instanceMatrix),G==="instanceColor"&&M.instanceColor&&(pe=M.instanceColor));let xe={};xe.attribute=pe,pe&&pe.data&&(xe.data=pe.data),H[G]=xe,N++}r.attributes=H,r.attributesNum=N,r.index=U}function v(){let M=r.newAttributes;for(let T=0,k=M.length;T<k;T++)M[T]=0}function g(M){p(M,0)}function p(M,T){let k=r.newAttributes,U=r.enabledAttributes,H=r.attributeDivisors;k[M]=1,U[M]===0&&(i.enableVertexAttribArray(M),U[M]=1),H[M]!==T&&(i.vertexAttribDivisor(M,T),H[M]=T)}function _(){let M=r.newAttributes,T=r.enabledAttributes;for(let k=0,U=T.length;k<U;k++)T[k]!==M[k]&&(i.disableVertexAttribArray(k),T[k]=0)}function x(M,T,k,U,H,F,N){N===!0?i.vertexAttribIPointer(M,T,k,H,F):i.vertexAttribPointer(M,T,k,U,H,F)}function y(M,T,k,U){v();let H=U.attributes,F=k.getAttributes(),N=T.defaultAttributeValues;for(let j in F){let G=F[j];if(G.location>=0){let ce=H[j];if(ce===void 0&&(j==="instanceMatrix"&&M.instanceMatrix&&(ce=M.instanceMatrix),j==="instanceColor"&&M.instanceColor&&(ce=M.instanceColor)),ce!==void 0){let pe=ce.normalized,xe=ce.itemSize,Ge=e.get(ce);if(Ge===void 0)continue;let Ze=Ge.buffer,V=Ge.type,K=Ge.bytesPerElement,be=V===i.INT||V===i.UNSIGNED_INT||ce.gpuType===nu;if(ce.isInterleavedBufferAttribute){let fe=ce.data,De=fe.stride,Ne=ce.offset;if(fe.isInstancedInterleavedBuffer){for(let Ve=0;Ve<G.locationSize;Ve++)p(G.location+Ve,fe.meshPerAttribute);M.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Ve=0;Ve<G.locationSize;Ve++)g(G.location+Ve);i.bindBuffer(i.ARRAY_BUFFER,Ze);for(let Ve=0;Ve<G.locationSize;Ve++)x(G.location+Ve,xe/G.locationSize,V,pe,De*K,(Ne+xe/G.locationSize*Ve)*K,be)}else{if(ce.isInstancedBufferAttribute){for(let fe=0;fe<G.locationSize;fe++)p(G.location+fe,ce.meshPerAttribute);M.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let fe=0;fe<G.locationSize;fe++)g(G.location+fe);i.bindBuffer(i.ARRAY_BUFFER,Ze);for(let fe=0;fe<G.locationSize;fe++)x(G.location+fe,xe/G.locationSize,V,pe,xe*K,xe/G.locationSize*fe*K,be)}}else if(N!==void 0){let pe=N[j];if(pe!==void 0)switch(pe.length){case 2:i.vertexAttrib2fv(G.location,pe);break;case 3:i.vertexAttrib3fv(G.location,pe);break;case 4:i.vertexAttrib4fv(G.location,pe);break;default:i.vertexAttrib1fv(G.location,pe)}}}}_()}function I(){R();for(let M in n){let T=n[M];for(let k in T){let U=T[k];for(let H in U)h(U[H].object),delete U[H];delete T[k]}delete n[M]}}function S(M){if(n[M.id]===void 0)return;let T=n[M.id];for(let k in T){let U=T[k];for(let H in U)h(U[H].object),delete U[H];delete T[k]}delete n[M.id]}function P(M){for(let T in n){let k=n[T];if(k[M.id]===void 0)continue;let U=k[M.id];for(let H in U)h(U[H].object),delete U[H];delete k[M.id]}}function R(){b(),o=!0,r!==s&&(r=s,c(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:R,resetDefaultState:b,dispose:I,releaseStatesOfGeometry:S,releaseStatesOfProgram:P,initAttributes:v,enableAttribute:g,disableUnusedAttributes:_}}function Sx(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];t.update(f,n,1)}function l(c,h,u,d){if(u===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<c.length;m++)o(c[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let m=0;for(let v=0;v<u;v++)m+=h[v]*d[v];t.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Tx(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let P=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(P){return!(P!==ii&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(P){let R=P===as&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==ki&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==pi&&!R)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=m>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:_,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:I,maxSamples:S}}function Ax(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Pi,a=new et,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{let _=r?0:n,x=_*4,y=p.clippingState||null;l.value=y,y=h(m,d,x,f);for(let I=0;I!==x;++I)y[I]=t[I];p.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,m){let v=u!==null?u.length:0,g=null;if(v!==0){if(g=l.value,m!==!0||g===null){let p=f+v*4,_=d.matrixWorldInverse;a.getNormalMatrix(_),(g===null||g.length<p)&&(g=new Float32Array(p));for(let x=0,y=f;x!==v;++x,y+=4)o.copy(u[x]).applyMatrix4(_,a),o.normal.toArray(g,y),g[y+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}function Rx(i){let e=new WeakMap;function t(o,a){return a===Dc?o.mapping=vr:a===kc&&(o.mapping=xr),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Dc||a===kc)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new fh(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var br=class extends Ia{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},hr=4,Dd=[.125,.215,.35,.446,.526,.582],Rs=20,dc=new br,kd=new Re,fc=null,pc=0,mc=0,gc=!1,Ss=(1+Math.sqrt(5))/2,ar=1/Ss,Ud=[new C(-Ss,ar,0),new C(Ss,ar,0),new C(-ar,0,Ss),new C(ar,0,Ss),new C(0,Ss,-ar),new C(0,Ss,ar),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)],Er=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){fc=this._renderer.getRenderTarget(),pc=this._renderer.getActiveCubeFace(),mc=this._renderer.getActiveMipmapLevel(),gc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Hd(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(fc,pc,mc),this._renderer.xr.enabled=gc,e.scissorTest=!1,aa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===vr||e.mapping===xr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),fc=this._renderer.getRenderTarget(),pc=this._renderer.getActiveCubeFace(),mc=this._renderer.getActiveMipmapLevel(),gc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Nn,minFilter:Nn,generateMipmaps:!1,type:as,format:ii,colorSpace:Rr,depthBuffer:!1},s=Nd(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Nd(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Cx(r)),this._blurMaterial=Px(r,e,t)}return s}_compileMaterial(e){let t=new D(this._lodPlanes[0],e);this._renderer.compile(t,dc)}_sceneToCubeUV(e,t,n,s){let a=new Jt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(kd),h.toneMapping=ns,h.autoClear=!1;let f=new hn({name:"PMREM.Background",side:mn,depthWrite:!1,depthTest:!1}),m=new D(new Ue,f),v=!1,g=e.background;g?g.isColor&&(f.color.copy(g),e.background=null,v=!0):(f.color.copy(kd),v=!0);for(let p=0;p<6;p++){let _=p%3;_===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):_===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));let x=this._cubeSize;aa(s,_*x,p>2?x:0,x,x),h.setRenderTarget(s),v&&h.render(m,a),h.render(e,a)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=g}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===vr||e.mapping===xr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Hd()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bd());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new D(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;aa(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,dc)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Ud[(s-r-1)%Ud.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new D(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Rs-1),v=r/m,g=isFinite(r)?1+Math.floor(h*v):Rs;g>Rs&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Rs}`);let p=[],_=0;for(let P=0;P<Rs;++P){let R=P/v,b=Math.exp(-R*R/2);p.push(b),P===0?_+=b:P<g&&(_+=2*b)}for(let P=0;P<p.length;P++)p[P]=p[P]/_;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:x}=this;d.dTheta.value=m,d.mipInt.value=x-n;let y=this._sizeLods[s],I=3*y*(s>x-hr?s-x+hr:0),S=4*(this._cubeSize-y);aa(t,I,S,3*y,2*y),l.setRenderTarget(t),l.render(u,dc)}};function Cx(i){let e=[],t=[],n=[],s=i,r=i-hr+1+Dd.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-hr?l=Dd[o-i+hr-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,v=3,g=2,p=1,_=new Float32Array(v*m*f),x=new Float32Array(g*m*f),y=new Float32Array(p*m*f);for(let S=0;S<f;S++){let P=S%3*2/3-1,R=S>2?0:-1,b=[P,R,0,P+2/3,R,0,P+2/3,R+1,0,P,R,0,P+2/3,R+1,0,P,R+1,0];_.set(b,v*m*S),x.set(d,g*m*S);let M=[S,S,S,S,S,S];y.set(M,p*m*S)}let I=new vt;I.setAttribute("position",new Nt(_,v)),I.setAttribute("uv",new Nt(x,g)),I.setAttribute("faceIndex",new Nt(y,p)),e.push(I),s>hr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Nd(i,e,t){let n=new Gn(i,e,t);return n.texture.mapping=Za,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function aa(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Px(i,e,t){let n=new Float32Array(Rs),s=new C(0,1,0);return new jt({name:"SphericalGaussianBlur",defines:{n:Rs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:uu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ts,depthTest:!1,depthWrite:!1})}function Bd(){return new jt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:uu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ts,depthTest:!1,depthWrite:!1})}function Hd(){return new jt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:uu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ts,depthTest:!1,depthWrite:!1})}function uu(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ix(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Dc||l===kc,h=l===vr||l===xr;if(c||h){let u=e.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Er(i)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return c&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new Er(i)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Lx(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&eo("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Dx(i,e,t,n){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let m in d.attributes)e.remove(d.attributes[m]);for(let m in d.morphAttributes){let v=d.morphAttributes[m];for(let g=0,p=v.length;g<p;g++)e.remove(v[g])}d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let m in d)e.update(d[m],i.ARRAY_BUFFER);let f=u.morphAttributes;for(let m in f){let v=f[m];for(let g=0,p=v.length;g<p;g++)e.update(v[g],i.ARRAY_BUFFER)}}function c(u){let d=[],f=u.index,m=u.attributes.position,v=0;if(f!==null){let _=f.array;v=f.version;for(let x=0,y=_.length;x<y;x+=3){let I=_[x+0],S=_[x+1],P=_[x+2];d.push(I,S,S,P,P,I)}}else if(m!==void 0){let _=m.array;v=m.version;for(let x=0,y=_.length/3-1;x<y;x+=3){let I=x+0,S=x+1,P=x+2;d.push(I,S,S,P,P,I)}}else return;let g=new(Lf(d)?Pa:Ca)(d,1);g.version=v;let p=r.get(u);p&&e.remove(p),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function kx(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*o),t.update(f,n,1)}function c(d,f,m){m!==0&&(i.drawElementsInstanced(n,f,r,d*o,m),t.update(f,n,m))}function h(d,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];t.update(g,n,1)}function u(d,f,m,v){if(m===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,v,0,m);let p=0;for(let _=0;_<m;_++)p+=f[_]*v[_];t.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Ux(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Nx(i,e,t){let n=new WeakMap,s=new Tt;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let b=function(){P.dispose(),n.delete(a),a.removeEventListener("dispose",b)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],_=a.morphAttributes.color||[],x=0;f===!0&&(x=1),m===!0&&(x=2),v===!0&&(x=3);let y=a.attributes.position.count*x,I=1;y>e.maxTextureSize&&(I=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let S=new Float32Array(y*I*4*u),P=new Aa(S,y,I,u);P.type=pi,P.needsUpdate=!0;let R=x*4;for(let M=0;M<u;M++){let T=g[M],k=p[M],U=_[M],H=y*I*4*M;for(let F=0;F<T.count;F++){let N=F*R;f===!0&&(s.fromBufferAttribute(T,F),S[H+N+0]=s.x,S[H+N+1]=s.y,S[H+N+2]=s.z,S[H+N+3]=0),m===!0&&(s.fromBufferAttribute(k,F),S[H+N+4]=s.x,S[H+N+5]=s.y,S[H+N+6]=s.z,S[H+N+7]=0),v===!0&&(s.fromBufferAttribute(U,F),S[H+N+8]=s.x,S[H+N+9]=s.y,S[H+N+10]=s.z,S[H+N+11]=U.itemSize===4?s.w:1)}}d={count:u,texture:P,size:new ue(y,I)},n.set(a,d),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];let m=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Bx(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var Da=class extends Pn{constructor(e,t,n,s,r,o,a,l,c,h=fr){if(h!==fr&&h!==_r)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===fr&&(n=Is),n===void 0&&h===_r&&(n=yr),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Bn,this.minFilter=l!==void 0?l:Bn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},Nf=new Pn,Fd=new Da(1,1),Bf=new Aa,Hf=new uh,Ff=new La,Od=[],zd=[],Gd=new Float32Array(16),Vd=new Float32Array(9),Wd=new Float32Array(4);function Pr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=Od[s];if(r===void 0&&(r=new Float32Array(s),Od[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Qt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function en(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function $a(i,e){let t=zd[e];t===void 0&&(t=new Int32Array(e),zd[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Hx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Fx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Qt(t,e))return;i.uniform2fv(this.addr,e),en(t,e)}}function Ox(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Qt(t,e))return;i.uniform3fv(this.addr,e),en(t,e)}}function zx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Qt(t,e))return;i.uniform4fv(this.addr,e),en(t,e)}}function Gx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Qt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),en(t,e)}else{if(Qt(t,n))return;Wd.set(n),i.uniformMatrix2fv(this.addr,!1,Wd),en(t,n)}}function Vx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Qt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),en(t,e)}else{if(Qt(t,n))return;Vd.set(n),i.uniformMatrix3fv(this.addr,!1,Vd),en(t,n)}}function Wx(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(Qt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),en(t,e)}else{if(Qt(t,n))return;Gd.set(n),i.uniformMatrix4fv(this.addr,!1,Gd),en(t,n)}}function Xx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function qx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Qt(t,e))return;i.uniform2iv(this.addr,e),en(t,e)}}function Yx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Qt(t,e))return;i.uniform3iv(this.addr,e),en(t,e)}}function Zx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Qt(t,e))return;i.uniform4iv(this.addr,e),en(t,e)}}function Kx(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function $x(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Qt(t,e))return;i.uniform2uiv(this.addr,e),en(t,e)}}function Jx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Qt(t,e))return;i.uniform3uiv(this.addr,e),en(t,e)}}function jx(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Qt(t,e))return;i.uniform4uiv(this.addr,e),en(t,e)}}function Qx(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Fd.compareFunction=Pf,r=Fd):r=Nf,t.setTexture2D(e||r,s)}function ey(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||Hf,s)}function ty(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Ff,s)}function ny(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Bf,s)}function iy(i){switch(i){case 5126:return Hx;case 35664:return Fx;case 35665:return Ox;case 35666:return zx;case 35674:return Gx;case 35675:return Vx;case 35676:return Wx;case 5124:case 35670:return Xx;case 35667:case 35671:return qx;case 35668:case 35672:return Yx;case 35669:case 35673:return Zx;case 5125:return Kx;case 36294:return $x;case 36295:return Jx;case 36296:return jx;case 35678:case 36198:case 36298:case 36306:case 35682:return Qx;case 35679:case 36299:case 36307:return ey;case 35680:case 36300:case 36308:case 36293:return ty;case 36289:case 36303:case 36311:case 36292:return ny}}function sy(i,e){i.uniform1fv(this.addr,e)}function ry(i,e){let t=Pr(e,this.size,2);i.uniform2fv(this.addr,t)}function oy(i,e){let t=Pr(e,this.size,3);i.uniform3fv(this.addr,t)}function ay(i,e){let t=Pr(e,this.size,4);i.uniform4fv(this.addr,t)}function ly(i,e){let t=Pr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function cy(i,e){let t=Pr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function hy(i,e){let t=Pr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function uy(i,e){i.uniform1iv(this.addr,e)}function dy(i,e){i.uniform2iv(this.addr,e)}function fy(i,e){i.uniform3iv(this.addr,e)}function py(i,e){i.uniform4iv(this.addr,e)}function my(i,e){i.uniform1uiv(this.addr,e)}function gy(i,e){i.uniform2uiv(this.addr,e)}function vy(i,e){i.uniform3uiv(this.addr,e)}function xy(i,e){i.uniform4uiv(this.addr,e)}function yy(i,e,t){let n=this.cache,s=e.length,r=$a(t,s);Qt(n,r)||(i.uniform1iv(this.addr,r),en(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||Nf,r[o])}function _y(i,e,t){let n=this.cache,s=e.length,r=$a(t,s);Qt(n,r)||(i.uniform1iv(this.addr,r),en(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||Hf,r[o])}function My(i,e,t){let n=this.cache,s=e.length,r=$a(t,s);Qt(n,r)||(i.uniform1iv(this.addr,r),en(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||Ff,r[o])}function by(i,e,t){let n=this.cache,s=e.length,r=$a(t,s);Qt(n,r)||(i.uniform1iv(this.addr,r),en(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||Bf,r[o])}function Ey(i){switch(i){case 5126:return sy;case 35664:return ry;case 35665:return oy;case 35666:return ay;case 35674:return ly;case 35675:return cy;case 35676:return hy;case 5124:case 35670:return uy;case 35667:case 35671:return dy;case 35668:case 35672:return fy;case 35669:case 35673:return py;case 5125:return my;case 36294:return gy;case 36295:return vy;case 36296:return xy;case 35678:case 36198:case 36298:case 36306:case 35682:return yy;case 35679:case 36299:case 36307:return _y;case 35680:case 36300:case 36308:case 36293:return My;case 36289:case 36303:case 36311:case 36292:return by}}var ph=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=iy(t.type)}},mh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ey(t.type)}},gh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},vc=/(\w+)(\])?(\[|\.)?/g;function Xd(i,e){i.seq.push(e),i.map[e.id]=e}function wy(i,e,t){let n=i.name,s=n.length;for(vc.lastIndex=0;;){let r=vc.exec(n),o=vc.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Xd(t,c===void 0?new ph(a,i,e):new mh(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new gh(a),Xd(t,u)),t=u}}}var mr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);wy(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function qd(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Sy=37297,Ty=0;function Ay(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Yd=new et;function Ry(i){dt._getMatrix(Yd,dt.workingColorSpace,i);let e=`mat3( ${Yd.elements.map(t=>t.toFixed(4))} )`;switch(dt.getTransfer(i)){case Ka:return[e,"LinearTransferOETF"];case St:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Zd(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Ay(i.getShaderSource(e),o)}else return s}function Cy(i,e){let t=Ry(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Py(i,e){let t;switch(e){case z0:t="Linear";break;case G0:t="Reinhard";break;case V0:t="Cineon";break;case tu:t="ACESFilmic";break;case X0:t="AgX";break;case q0:t="Neutral";break;case W0:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var la=new C;function Iy(){dt.getLuminanceCoefficients(la);let i=la.x.toFixed(4),e=la.y.toFixed(4),t=la.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ly(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(to).join(`
`)}function Dy(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ky(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function to(i){return i!==""}function Kd(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function $d(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Uy=/^[ \t]*#include +<([\w\d./]+)>/gm;function vh(i){return i.replace(Uy,By)}var Ny=new Map;function By(i,e){let t=it[e];if(t===void 0){let n=Ny.get(e);if(n!==void 0)t=it[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return vh(t)}var Hy=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jd(i){return i.replace(Hy,Fy)}function Fy(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function jd(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Oy(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===yf?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Qh?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ci&&(e="SHADOWMAP_TYPE_VSM"),e}function zy(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case vr:case xr:e="ENVMAP_TYPE_CUBE";break;case Za:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Gy(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case xr:e="ENVMAP_MODE_REFRACTION";break}return e}function Vy(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case eu:e="ENVMAP_BLENDING_MULTIPLY";break;case F0:e="ENVMAP_BLENDING_MIX";break;case O0:e="ENVMAP_BLENDING_ADD";break}return e}function Wy(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function Xy(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Oy(t),c=zy(t),h=Gy(t),u=Vy(t),d=Wy(t),f=Ly(t),m=Dy(r),v=s.createProgram(),g,p,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(to).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(to).join(`
`),p.length>0&&(p+=`
`)):(g=[jd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(to).join(`
`),p=[jd(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ns?"#define TONE_MAPPING":"",t.toneMapping!==ns?it.tonemapping_pars_fragment:"",t.toneMapping!==ns?Py("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",it.colorspace_pars_fragment,Cy("linearToOutputTexel",t.outputColorSpace),Iy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(to).join(`
`)),o=vh(o),o=Kd(o,t),o=$d(o,t),a=vh(a),a=Kd(a,t),a=$d(a,t),o=Jd(o),a=Jd(a),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===ud?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ud?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let x=_+g+o,y=_+p+a,I=qd(s,s.VERTEX_SHADER,x),S=qd(s,s.FRAGMENT_SHADER,y);s.attachShader(v,I),s.attachShader(v,S),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function P(T){if(i.debug.checkShaderErrors){let k=s.getProgramInfoLog(v).trim(),U=s.getShaderInfoLog(I).trim(),H=s.getShaderInfoLog(S).trim(),F=!0,N=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(F=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,I,S);else{let j=Zd(s,I,"vertex"),G=Zd(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+k+`
`+j+`
`+G)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(U===""||H==="")&&(N=!1);N&&(T.diagnostics={runnable:F,programLog:k,vertexShader:{log:U,prefix:g},fragmentShader:{log:H,prefix:p}})}s.deleteShader(I),s.deleteShader(S),R=new mr(s,v),b=ky(s,v)}let R;this.getUniforms=function(){return R===void 0&&P(this),R};let b;this.getAttributes=function(){return b===void 0&&P(this),b};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(v,Sy)),M},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ty++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=I,this.fragmentShader=S,this}var qy=0,xh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new yh(e),t.set(e,n)),n}},yh=class{constructor(e){this.id=qy++,this.code=e,this.usedTimes=0}};function Yy(i,e,t,n,s,r,o){let a=new Ra,l=new xh,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return c.add(b),b===0?"uv":`uv${b}`}function g(b,M,T,k,U){let H=k.fog,F=U.geometry,N=b.isMeshStandardMaterial?k.environment:null,j=(b.isMeshStandardMaterial?t:e).get(b.envMap||N),G=j&&j.mapping===Za?j.image.height:null,ce=m[b.type];b.precision!==null&&(f=s.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));let pe=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,xe=pe!==void 0?pe.length:0,Ge=0;F.morphAttributes.position!==void 0&&(Ge=1),F.morphAttributes.normal!==void 0&&(Ge=2),F.morphAttributes.color!==void 0&&(Ge=3);let Ze,V,K,be;if(ce){let Et=fi[ce];Ze=Et.vertexShader,V=Et.fragmentShader}else Ze=b.vertexShader,V=b.fragmentShader,l.update(b),K=l.getVertexShaderID(b),be=l.getFragmentShaderID(b);let fe=i.getRenderTarget(),De=i.state.buffers.depth.getReversed(),Ne=U.isInstancedMesh===!0,Ve=U.isBatchedMesh===!0,ot=!!b.map,se=!!b.matcap,he=!!j,L=!!b.aoMap,Pe=!!b.lightMap,Y=!!b.bumpMap,le=!!b.normalMap,ie=!!b.displacementMap,Ie=!!b.emissiveMap,me=!!b.metalnessMap,A=!!b.roughnessMap,E=b.anisotropy>0,W=b.clearcoat>0,J=b.dispersion>0,ae=b.iridescence>0,Q=b.sheen>0,ee=b.transmission>0,ne=E&&!!b.anisotropyMap,re=W&&!!b.clearcoatMap,ke=W&&!!b.clearcoatNormalMap,te=W&&!!b.clearcoatRoughnessMap,ve=ae&&!!b.iridescenceMap,qe=ae&&!!b.iridescenceThicknessMap,Ye=Q&&!!b.sheenColorMap,Le=Q&&!!b.sheenRoughnessMap,ct=!!b.specularMap,nt=!!b.specularColorMap,Rt=!!b.specularIntensityMap,B=ee&&!!b.transmissionMap,we=ee&&!!b.thicknessMap,Z=!!b.gradientMap,oe=!!b.alphaMap,Ae=b.alphaTest>0,Se=!!b.alphaHash,je=!!b.extensions,Ot=ns;b.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(Ot=i.toneMapping);let dn={shaderID:ce,shaderType:b.type,shaderName:b.name,vertexShader:Ze,fragmentShader:V,defines:b.defines,customVertexShaderID:K,customFragmentShaderID:be,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Ve,batchingColor:Ve&&U._colorsTexture!==null,instancing:Ne,instancingColor:Ne&&U.instanceColor!==null,instancingMorph:Ne&&U.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:fe===null?i.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:Rr,alphaToCoverage:!!b.alphaToCoverage,map:ot,matcap:se,envMap:he,envMapMode:he&&j.mapping,envMapCubeUVHeight:G,aoMap:L,lightMap:Pe,bumpMap:Y,normalMap:le,displacementMap:d&&ie,emissiveMap:Ie,normalMapObjectSpace:le&&b.normalMapType===$0,normalMapTangentSpace:le&&b.normalMapType===cu,metalnessMap:me,roughnessMap:A,anisotropy:E,anisotropyMap:ne,clearcoat:W,clearcoatMap:re,clearcoatNormalMap:ke,clearcoatRoughnessMap:te,dispersion:J,iridescence:ae,iridescenceMap:ve,iridescenceThicknessMap:qe,sheen:Q,sheenColorMap:Ye,sheenRoughnessMap:Le,specularMap:ct,specularColorMap:nt,specularIntensityMap:Rt,transmission:ee,transmissionMap:B,thicknessMap:we,gradientMap:Z,opaque:b.transparent===!1&&b.blending===dr&&b.alphaToCoverage===!1,alphaMap:oe,alphaTest:Ae,alphaHash:Se,combine:b.combine,mapUv:ot&&v(b.map.channel),aoMapUv:L&&v(b.aoMap.channel),lightMapUv:Pe&&v(b.lightMap.channel),bumpMapUv:Y&&v(b.bumpMap.channel),normalMapUv:le&&v(b.normalMap.channel),displacementMapUv:ie&&v(b.displacementMap.channel),emissiveMapUv:Ie&&v(b.emissiveMap.channel),metalnessMapUv:me&&v(b.metalnessMap.channel),roughnessMapUv:A&&v(b.roughnessMap.channel),anisotropyMapUv:ne&&v(b.anisotropyMap.channel),clearcoatMapUv:re&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:ke&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:te&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:ve&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:qe&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ye&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:Le&&v(b.sheenRoughnessMap.channel),specularMapUv:ct&&v(b.specularMap.channel),specularColorMapUv:nt&&v(b.specularColorMap.channel),specularIntensityMapUv:Rt&&v(b.specularIntensityMap.channel),transmissionMapUv:B&&v(b.transmissionMap.channel),thicknessMapUv:we&&v(b.thicknessMap.channel),alphaMapUv:oe&&v(b.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(le||E),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!F.attributes.uv&&(ot||oe),fog:!!H,useFog:b.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:De,skinning:U.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:xe,morphTextureStride:Ge,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&T.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ot,decodeVideoTexture:ot&&b.map.isVideoTexture===!0&&dt.getTransfer(b.map.colorSpace)===St,decodeVideoTextureEmissive:Ie&&b.emissiveMap.isVideoTexture===!0&&dt.getTransfer(b.emissiveMap.colorSpace)===St,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===gt,flipSided:b.side===mn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:je&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(je&&b.extensions.multiDraw===!0||Ve)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return dn.vertexUv1s=c.has(1),dn.vertexUv2s=c.has(2),dn.vertexUv3s=c.has(3),c.clear(),dn}function p(b){let M=[];if(b.shaderID?M.push(b.shaderID):(M.push(b.customVertexShaderID),M.push(b.customFragmentShaderID)),b.defines!==void 0)for(let T in b.defines)M.push(T),M.push(b.defines[T]);return b.isRawShaderMaterial===!1&&(_(M,b),x(M,b),M.push(i.outputColorSpace)),M.push(b.customProgramCacheKey),M.join()}function _(b,M){b.push(M.precision),b.push(M.outputColorSpace),b.push(M.envMapMode),b.push(M.envMapCubeUVHeight),b.push(M.mapUv),b.push(M.alphaMapUv),b.push(M.lightMapUv),b.push(M.aoMapUv),b.push(M.bumpMapUv),b.push(M.normalMapUv),b.push(M.displacementMapUv),b.push(M.emissiveMapUv),b.push(M.metalnessMapUv),b.push(M.roughnessMapUv),b.push(M.anisotropyMapUv),b.push(M.clearcoatMapUv),b.push(M.clearcoatNormalMapUv),b.push(M.clearcoatRoughnessMapUv),b.push(M.iridescenceMapUv),b.push(M.iridescenceThicknessMapUv),b.push(M.sheenColorMapUv),b.push(M.sheenRoughnessMapUv),b.push(M.specularMapUv),b.push(M.specularColorMapUv),b.push(M.specularIntensityMapUv),b.push(M.transmissionMapUv),b.push(M.thicknessMapUv),b.push(M.combine),b.push(M.fogExp2),b.push(M.sizeAttenuation),b.push(M.morphTargetsCount),b.push(M.morphAttributeCount),b.push(M.numDirLights),b.push(M.numPointLights),b.push(M.numSpotLights),b.push(M.numSpotLightMaps),b.push(M.numHemiLights),b.push(M.numRectAreaLights),b.push(M.numDirLightShadows),b.push(M.numPointLightShadows),b.push(M.numSpotLightShadows),b.push(M.numSpotLightShadowsWithMaps),b.push(M.numLightProbes),b.push(M.shadowMapType),b.push(M.toneMapping),b.push(M.numClippingPlanes),b.push(M.numClipIntersection),b.push(M.depthPacking)}function x(b,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),b.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),b.push(a.mask)}function y(b){let M=m[b.type],T;if(M){let k=fi[M];T=Bm.clone(k.uniforms)}else T=b.uniforms;return T}function I(b,M){let T;for(let k=0,U=h.length;k<U;k++){let H=h[k];if(H.cacheKey===M){T=H,++T.usedTimes;break}}return T===void 0&&(T=new Xy(i,M,b,r),h.push(T)),T}function S(b){if(--b.usedTimes===0){let M=h.indexOf(b);h[M]=h[h.length-1],h.pop(),b.destroy()}}function P(b){l.remove(b)}function R(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:y,acquireProgram:I,releaseProgram:S,releaseShaderCache:P,programs:h,dispose:R}}function Zy(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Ky(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Qd(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ef(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,d,f,m,v,g){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:v,group:g},i[e]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=v,p.group=g),e++,p}function a(u,d,f,m,v,g){let p=o(u,d,f,m,v,g);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function l(u,d,f,m,v,g){let p=o(u,d,f,m,v,g);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function c(u,d){t.length>1&&t.sort(u||Ky),n.length>1&&n.sort(d||Qd),s.length>1&&s.sort(d||Qd)}function h(){for(let u=e,d=i.length;u<d;u++){let f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function $y(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new ef,i.set(n,[o])):s>=r.length?(o=new ef,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function Jy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new Re};break;case"SpotLight":t={position:new C,direction:new C,color:new Re,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new Re,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new Re,groundColor:new Re};break;case"RectAreaLight":t={color:new Re,position:new C,halfWidth:new C,halfHeight:new C};break}return i[e.id]=t,t}}}function jy(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var Qy=0;function e_(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function t_(i){let e=new Jy,t=jy(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);let s=new C,r=new $e,o=new $e;function a(c){let h=0,u=0,d=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let f=0,m=0,v=0,g=0,p=0,_=0,x=0,y=0,I=0,S=0,P=0;c.sort(e_);for(let b=0,M=c.length;b<M;b++){let T=c[b],k=T.color,U=T.intensity,H=T.distance,F=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)h+=k.r*U,u+=k.g*U,d+=k.b*U;else if(T.isLightProbe){for(let N=0;N<9;N++)n.probe[N].addScaledVector(T.sh.coefficients[N],U);P++}else if(T.isDirectionalLight){let N=e.get(T);if(N.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){let j=T.shadow,G=t.get(T);G.shadowIntensity=j.intensity,G.shadowBias=j.bias,G.shadowNormalBias=j.normalBias,G.shadowRadius=j.radius,G.shadowMapSize=j.mapSize,n.directionalShadow[f]=G,n.directionalShadowMap[f]=F,n.directionalShadowMatrix[f]=T.shadow.matrix,_++}n.directional[f]=N,f++}else if(T.isSpotLight){let N=e.get(T);N.position.setFromMatrixPosition(T.matrixWorld),N.color.copy(k).multiplyScalar(U),N.distance=H,N.coneCos=Math.cos(T.angle),N.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),N.decay=T.decay,n.spot[v]=N;let j=T.shadow;if(T.map&&(n.spotLightMap[I]=T.map,I++,j.updateMatrices(T),T.castShadow&&S++),n.spotLightMatrix[v]=j.matrix,T.castShadow){let G=t.get(T);G.shadowIntensity=j.intensity,G.shadowBias=j.bias,G.shadowNormalBias=j.normalBias,G.shadowRadius=j.radius,G.shadowMapSize=j.mapSize,n.spotShadow[v]=G,n.spotShadowMap[v]=F,y++}v++}else if(T.isRectAreaLight){let N=e.get(T);N.color.copy(k).multiplyScalar(U),N.halfWidth.set(T.width*.5,0,0),N.halfHeight.set(0,T.height*.5,0),n.rectArea[g]=N,g++}else if(T.isPointLight){let N=e.get(T);if(N.color.copy(T.color).multiplyScalar(T.intensity),N.distance=T.distance,N.decay=T.decay,T.castShadow){let j=T.shadow,G=t.get(T);G.shadowIntensity=j.intensity,G.shadowBias=j.bias,G.shadowNormalBias=j.normalBias,G.shadowRadius=j.radius,G.shadowMapSize=j.mapSize,G.shadowCameraNear=j.camera.near,G.shadowCameraFar=j.camera.far,n.pointShadow[m]=G,n.pointShadowMap[m]=F,n.pointShadowMatrix[m]=T.shadow.matrix,x++}n.point[m]=N,m++}else if(T.isHemisphereLight){let N=e.get(T);N.skyColor.copy(T.color).multiplyScalar(U),N.groundColor.copy(T.groundColor).multiplyScalar(U),n.hemi[p]=N,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ee.LTC_FLOAT_1,n.rectAreaLTC2=Ee.LTC_FLOAT_2):(n.rectAreaLTC1=Ee.LTC_HALF_1,n.rectAreaLTC2=Ee.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let R=n.hash;(R.directionalLength!==f||R.pointLength!==m||R.spotLength!==v||R.rectAreaLength!==g||R.hemiLength!==p||R.numDirectionalShadows!==_||R.numPointShadows!==x||R.numSpotShadows!==y||R.numSpotMaps!==I||R.numLightProbes!==P)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=y+I-S,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=P,R.directionalLength=f,R.pointLength=m,R.spotLength=v,R.rectAreaLength=g,R.hemiLength=p,R.numDirectionalShadows=_,R.numPointShadows=x,R.numSpotShadows=y,R.numSpotMaps=I,R.numLightProbes=P,n.version=Qy++)}function l(c,h){let u=0,d=0,f=0,m=0,v=0,g=h.matrixWorldInverse;for(let p=0,_=c.length;p<_;p++){let x=c[p];if(x.isDirectionalLight){let y=n.directional[u];y.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),u++}else if(x.isSpotLight){let y=n.spot[f];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),f++}else if(x.isRectAreaLight){let y=n.rectArea[m];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),o.identity(),r.copy(x.matrixWorld),r.premultiply(g),o.extractRotation(r),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),m++}else if(x.isPointLight){let y=n.point[d];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(g),d++}else if(x.isHemisphereLight){let y=n.hemi[v];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(g),v++}}}return{setup:a,setupView:l,state:n}}function tf(i){let e=new t_(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function n_(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new tf(i),e.set(s,[a])):r>=o.length?(a=new tf(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var _h=class extends mi{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Z0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Mh=class extends mi{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},i_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,s_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function r_(i,e,t){let n=new ho,s=new ue,r=new ue,o=new Tt,a=new _h({depthPacking:K0}),l=new Mh,c={},h=t.maxTextureSize,u={[ss]:mn,[mn]:ss,[gt]:gt},d=new jt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ue},radius:{value:4}},vertexShader:i_,fragmentShader:s_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new vt;m.setAttribute("position",new Nt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new D(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=yf;let p=this.type;this.render=function(S,P,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||S.length===0)return;let b=i.getRenderTarget(),M=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),k=i.state;k.setBlending(ts),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let U=p!==Ci&&this.type===Ci,H=p===Ci&&this.type!==Ci;for(let F=0,N=S.length;F<N;F++){let j=S[F],G=j.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);let ce=G.getFrameExtents();if(s.multiply(ce),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ce.x),s.x=r.x*ce.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ce.y),s.y=r.y*ce.y,G.mapSize.y=r.y)),G.map===null||U===!0||H===!0){let xe=this.type!==Ci?{minFilter:Bn,magFilter:Bn}:{};G.map!==null&&G.map.dispose(),G.map=new Gn(s.x,s.y,xe),G.map.texture.name=j.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();let pe=G.getViewportCount();for(let xe=0;xe<pe;xe++){let Ge=G.getViewport(xe);o.set(r.x*Ge.x,r.y*Ge.y,r.x*Ge.z,r.y*Ge.w),k.viewport(o),G.updateMatrices(j,xe),n=G.getFrustum(),y(P,R,G.camera,j,this.type)}G.isPointLightShadow!==!0&&this.type===Ci&&_(G,R),G.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(b,M,T)};function _(S,P){let R=e.update(v);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,f.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new Gn(s.x,s.y)),d.uniforms.shadow_pass.value=S.map.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(P,null,R,d,v,null),f.uniforms.shadow_pass.value=S.mapPass.texture,f.uniforms.resolution.value=S.mapSize,f.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(P,null,R,f,v,null)}function x(S,P,R,b){let M=null,T=R.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(T!==void 0)M=T;else if(M=R.isPointLight===!0?l:a,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0){let k=M.uuid,U=P.uuid,H=c[k];H===void 0&&(H={},c[k]=H);let F=H[U];F===void 0&&(F=M.clone(),H[U]=F,P.addEventListener("dispose",I)),M=F}if(M.visible=P.visible,M.wireframe=P.wireframe,b===Ci?M.side=P.shadowSide!==null?P.shadowSide:P.side:M.side=P.shadowSide!==null?P.shadowSide:u[P.side],M.alphaMap=P.alphaMap,M.alphaTest=P.alphaTest,M.map=P.map,M.clipShadows=P.clipShadows,M.clippingPlanes=P.clippingPlanes,M.clipIntersection=P.clipIntersection,M.displacementMap=P.displacementMap,M.displacementScale=P.displacementScale,M.displacementBias=P.displacementBias,M.wireframeLinewidth=P.wireframeLinewidth,M.linewidth=P.linewidth,R.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let k=i.properties.get(M);k.light=R}return M}function y(S,P,R,b,M){if(S.visible===!1)return;if(S.layers.test(P.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&M===Ci)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,S.matrixWorld);let U=e.update(S),H=S.material;if(Array.isArray(H)){let F=U.groups;for(let N=0,j=F.length;N<j;N++){let G=F[N],ce=H[G.materialIndex];if(ce&&ce.visible){let pe=x(S,ce,b,M);S.onBeforeShadow(i,S,P,R,U,pe,G),i.renderBufferDirect(R,null,U,pe,S,G),S.onAfterShadow(i,S,P,R,U,pe,G)}}}else if(H.visible){let F=x(S,H,b,M);S.onBeforeShadow(i,S,P,R,U,F,null),i.renderBufferDirect(R,null,U,F,S,null),S.onAfterShadow(i,S,P,R,U,F,null)}}let k=S.children;for(let U=0,H=k.length;U<H;U++)y(k[U],P,R,b,M)}function I(S){S.target.removeEventListener("dispose",I);for(let R in c){let b=c[R],M=S.target.uuid;M in b&&(b[M].dispose(),delete b[M])}}}var o_={[Tc]:Ac,[Rc]:Ic,[Cc]:Lc,[gr]:Pc,[Ac]:Tc,[Ic]:Rc,[Lc]:Cc,[Pc]:gr};function a_(i,e){function t(){let B=!1,we=new Tt,Z=null,oe=new Tt(0,0,0,0);return{setMask:function(Ae){Z!==Ae&&!B&&(i.colorMask(Ae,Ae,Ae,Ae),Z=Ae)},setLocked:function(Ae){B=Ae},setClear:function(Ae,Se,je,Ot,dn){dn===!0&&(Ae*=Ot,Se*=Ot,je*=Ot),we.set(Ae,Se,je,Ot),oe.equals(we)===!1&&(i.clearColor(Ae,Se,je,Ot),oe.copy(we))},reset:function(){B=!1,Z=null,oe.set(-1,0,0,0)}}}function n(){let B=!1,we=!1,Z=null,oe=null,Ae=null;return{setReversed:function(Se){if(we!==Se){let je=e.get("EXT_clip_control");we?je.clipControlEXT(je.LOWER_LEFT_EXT,je.ZERO_TO_ONE_EXT):je.clipControlEXT(je.LOWER_LEFT_EXT,je.NEGATIVE_ONE_TO_ONE_EXT);let Ot=Ae;Ae=null,this.setClear(Ot)}we=Se},getReversed:function(){return we},setTest:function(Se){Se?fe(i.DEPTH_TEST):De(i.DEPTH_TEST)},setMask:function(Se){Z!==Se&&!B&&(i.depthMask(Se),Z=Se)},setFunc:function(Se){if(we&&(Se=o_[Se]),oe!==Se){switch(Se){case Tc:i.depthFunc(i.NEVER);break;case Ac:i.depthFunc(i.ALWAYS);break;case Rc:i.depthFunc(i.LESS);break;case gr:i.depthFunc(i.LEQUAL);break;case Cc:i.depthFunc(i.EQUAL);break;case Pc:i.depthFunc(i.GEQUAL);break;case Ic:i.depthFunc(i.GREATER);break;case Lc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}oe=Se}},setLocked:function(Se){B=Se},setClear:function(Se){Ae!==Se&&(we&&(Se=1-Se),i.clearDepth(Se),Ae=Se)},reset:function(){B=!1,Z=null,oe=null,Ae=null,we=!1}}}function s(){let B=!1,we=null,Z=null,oe=null,Ae=null,Se=null,je=null,Ot=null,dn=null;return{setTest:function(Et){B||(Et?fe(i.STENCIL_TEST):De(i.STENCIL_TEST))},setMask:function(Et){we!==Et&&!B&&(i.stencilMask(Et),we=Et)},setFunc:function(Et,jn,bi){(Z!==Et||oe!==jn||Ae!==bi)&&(i.stencilFunc(Et,jn,bi),Z=Et,oe=jn,Ae=bi)},setOp:function(Et,jn,bi){(Se!==Et||je!==jn||Ot!==bi)&&(i.stencilOp(Et,jn,bi),Se=Et,je=jn,Ot=bi)},setLocked:function(Et){B=Et},setClear:function(Et){dn!==Et&&(i.clearStencil(Et),dn=Et)},reset:function(){B=!1,we=null,Z=null,oe=null,Ae=null,Se=null,je=null,Ot=null,dn=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,f=[],m=null,v=!1,g=null,p=null,_=null,x=null,y=null,I=null,S=null,P=new Re(0,0,0),R=0,b=!1,M=null,T=null,k=null,U=null,H=null,F=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,j=0,G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(G)[1]),N=j>=1):G.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),N=j>=2);let ce=null,pe={},xe=i.getParameter(i.SCISSOR_BOX),Ge=i.getParameter(i.VIEWPORT),Ze=new Tt().fromArray(xe),V=new Tt().fromArray(Ge);function K(B,we,Z,oe){let Ae=new Uint8Array(4),Se=i.createTexture();i.bindTexture(B,Se),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let je=0;je<Z;je++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(we,0,i.RGBA,1,1,oe,0,i.RGBA,i.UNSIGNED_BYTE,Ae):i.texImage2D(we+je,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ae);return Se}let be={};be[i.TEXTURE_2D]=K(i.TEXTURE_2D,i.TEXTURE_2D,1),be[i.TEXTURE_CUBE_MAP]=K(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),be[i.TEXTURE_2D_ARRAY]=K(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),be[i.TEXTURE_3D]=K(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),fe(i.DEPTH_TEST),o.setFunc(gr),Y(!1),le(id),fe(i.CULL_FACE),L(ts);function fe(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function De(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function Ne(B,we){return u[B]!==we?(i.bindFramebuffer(B,we),u[B]=we,B===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=we),B===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=we),!0):!1}function Ve(B,we){let Z=f,oe=!1;if(B){Z=d.get(we),Z===void 0&&(Z=[],d.set(we,Z));let Ae=B.textures;if(Z.length!==Ae.length||Z[0]!==i.COLOR_ATTACHMENT0){for(let Se=0,je=Ae.length;Se<je;Se++)Z[Se]=i.COLOR_ATTACHMENT0+Se;Z.length=Ae.length,oe=!0}}else Z[0]!==i.BACK&&(Z[0]=i.BACK,oe=!0);oe&&i.drawBuffers(Z)}function ot(B){return m!==B?(i.useProgram(B),m=B,!0):!1}let se={[Ts]:i.FUNC_ADD,[b0]:i.FUNC_SUBTRACT,[E0]:i.FUNC_REVERSE_SUBTRACT};se[w0]=i.MIN,se[S0]=i.MAX;let he={[T0]:i.ZERO,[A0]:i.ONE,[R0]:i.SRC_COLOR,[wc]:i.SRC_ALPHA,[k0]:i.SRC_ALPHA_SATURATE,[L0]:i.DST_COLOR,[P0]:i.DST_ALPHA,[C0]:i.ONE_MINUS_SRC_COLOR,[Sc]:i.ONE_MINUS_SRC_ALPHA,[D0]:i.ONE_MINUS_DST_COLOR,[I0]:i.ONE_MINUS_DST_ALPHA,[U0]:i.CONSTANT_COLOR,[N0]:i.ONE_MINUS_CONSTANT_COLOR,[B0]:i.CONSTANT_ALPHA,[H0]:i.ONE_MINUS_CONSTANT_ALPHA};function L(B,we,Z,oe,Ae,Se,je,Ot,dn,Et){if(B===ts){v===!0&&(De(i.BLEND),v=!1);return}if(v===!1&&(fe(i.BLEND),v=!0),B!==M0){if(B!==g||Et!==b){if((p!==Ts||y!==Ts)&&(i.blendEquation(i.FUNC_ADD),p=Ts,y=Ts),Et)switch(B){case dr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case rs:i.blendFunc(i.ONE,i.ONE);break;case sd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case rd:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case dr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case rs:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case sd:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case rd:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}_=null,x=null,I=null,S=null,P.set(0,0,0),R=0,g=B,b=Et}return}Ae=Ae||we,Se=Se||Z,je=je||oe,(we!==p||Ae!==y)&&(i.blendEquationSeparate(se[we],se[Ae]),p=we,y=Ae),(Z!==_||oe!==x||Se!==I||je!==S)&&(i.blendFuncSeparate(he[Z],he[oe],he[Se],he[je]),_=Z,x=oe,I=Se,S=je),(Ot.equals(P)===!1||dn!==R)&&(i.blendColor(Ot.r,Ot.g,Ot.b,dn),P.copy(Ot),R=dn),g=B,b=!1}function Pe(B,we){B.side===gt?De(i.CULL_FACE):fe(i.CULL_FACE);let Z=B.side===mn;we&&(Z=!Z),Y(Z),B.blending===dr&&B.transparent===!1?L(ts):L(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),r.setMask(B.colorWrite);let oe=B.stencilWrite;a.setTest(oe),oe&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Ie(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?fe(i.SAMPLE_ALPHA_TO_COVERAGE):De(i.SAMPLE_ALPHA_TO_COVERAGE)}function Y(B){M!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),M=B)}function le(B){B!==y0?(fe(i.CULL_FACE),B!==T&&(B===id?i.cullFace(i.BACK):B===_0?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):De(i.CULL_FACE),T=B}function ie(B){B!==k&&(N&&i.lineWidth(B),k=B)}function Ie(B,we,Z){B?(fe(i.POLYGON_OFFSET_FILL),(U!==we||H!==Z)&&(i.polygonOffset(we,Z),U=we,H=Z)):De(i.POLYGON_OFFSET_FILL)}function me(B){B?fe(i.SCISSOR_TEST):De(i.SCISSOR_TEST)}function A(B){B===void 0&&(B=i.TEXTURE0+F-1),ce!==B&&(i.activeTexture(B),ce=B)}function E(B,we,Z){Z===void 0&&(ce===null?Z=i.TEXTURE0+F-1:Z=ce);let oe=pe[Z];oe===void 0&&(oe={type:void 0,texture:void 0},pe[Z]=oe),(oe.type!==B||oe.texture!==we)&&(ce!==Z&&(i.activeTexture(Z),ce=Z),i.bindTexture(B,we||be[B]),oe.type=B,oe.texture=we)}function W(){let B=pe[ce];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function J(){try{i.compressedTexImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ae(){try{i.compressedTexImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Q(){try{i.texSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ee(){try{i.texSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ne(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function re(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ke(){try{i.texStorage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function te(){try{i.texStorage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ve(){try{i.texImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function qe(){try{i.texImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ye(B){Ze.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),Ze.copy(B))}function Le(B){V.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),V.copy(B))}function ct(B,we){let Z=c.get(we);Z===void 0&&(Z=new WeakMap,c.set(we,Z));let oe=Z.get(B);oe===void 0&&(oe=i.getUniformBlockIndex(we,B.name),Z.set(B,oe))}function nt(B,we){let oe=c.get(we).get(B);l.get(we)!==oe&&(i.uniformBlockBinding(we,oe,B.__bindingPointIndex),l.set(we,oe))}function Rt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ce=null,pe={},u={},d=new WeakMap,f=[],m=null,v=!1,g=null,p=null,_=null,x=null,y=null,I=null,S=null,P=new Re(0,0,0),R=0,b=!1,M=null,T=null,k=null,U=null,H=null,Ze.set(0,0,i.canvas.width,i.canvas.height),V.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:fe,disable:De,bindFramebuffer:Ne,drawBuffers:Ve,useProgram:ot,setBlending:L,setMaterial:Pe,setFlipSided:Y,setCullFace:le,setLineWidth:ie,setPolygonOffset:Ie,setScissorTest:me,activeTexture:A,bindTexture:E,unbindTexture:W,compressedTexImage2D:J,compressedTexImage3D:ae,texImage2D:ve,texImage3D:qe,updateUBOMapping:ct,uniformBlockBinding:nt,texStorage2D:ke,texStorage3D:te,texSubImage2D:Q,texSubImage3D:ee,compressedTexSubImage2D:ne,compressedTexSubImage3D:re,scissor:Ye,viewport:Le,reset:Rt}}function nf(i,e,t,n){let s=l_(n);switch(t){case wf:return i*e;case Tf:return i*e;case Af:return i*e*2;case ru:return i*e/s.components*s.byteLength;case ou:return i*e/s.components*s.byteLength;case Rf:return i*e*2/s.components*s.byteLength;case au:return i*e*2/s.components*s.byteLength;case Sf:return i*e*3/s.components*s.byteLength;case ii:return i*e*4/s.components*s.byteLength;case lu:return i*e*4/s.components*s.byteLength;case xa:case ya:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case _a:case Ma:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Bc:case Fc:return Math.max(i,16)*Math.max(e,8)/4;case Nc:case Hc:return Math.max(i,8)*Math.max(e,8)/2;case Oc:case zc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Gc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Vc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Wc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Xc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case qc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Yc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Zc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Kc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case $c:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Jc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case jc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Qc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case eh:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case th:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case nh:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case ba:case ih:case sh:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Cf:case rh:return Math.ceil(i/4)*Math.ceil(e/4)*8;case oh:case ah:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function l_(i){switch(i){case ki:case Mf:return{byteLength:1,components:1};case ao:case bf:case as:return{byteLength:2,components:1};case iu:case su:return{byteLength:2,components:4};case Is:case nu:case pi:return{byteLength:4,components:1};case Ef:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function c_(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ue,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(A,E){return f?new OffscreenCanvas(A,E):Sa("canvas")}function v(A,E,W){let J=1,ae=me(A);if((ae.width>W||ae.height>W)&&(J=W/Math.max(ae.width,ae.height)),J<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let Q=Math.floor(J*ae.width),ee=Math.floor(J*ae.height);u===void 0&&(u=m(Q,ee));let ne=E?m(Q,ee):u;return ne.width=Q,ne.height=ee,ne.getContext("2d").drawImage(A,0,0,Q,ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ae.width+"x"+ae.height+") to ("+Q+"x"+ee+")."),ne}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ae.width+"x"+ae.height+")."),A;return A}function g(A){return A.generateMipmaps}function p(A){i.generateMipmap(A)}function _(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function x(A,E,W,J,ae=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let Q=E;if(E===i.RED&&(W===i.FLOAT&&(Q=i.R32F),W===i.HALF_FLOAT&&(Q=i.R16F),W===i.UNSIGNED_BYTE&&(Q=i.R8)),E===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&(Q=i.R8UI),W===i.UNSIGNED_SHORT&&(Q=i.R16UI),W===i.UNSIGNED_INT&&(Q=i.R32UI),W===i.BYTE&&(Q=i.R8I),W===i.SHORT&&(Q=i.R16I),W===i.INT&&(Q=i.R32I)),E===i.RG&&(W===i.FLOAT&&(Q=i.RG32F),W===i.HALF_FLOAT&&(Q=i.RG16F),W===i.UNSIGNED_BYTE&&(Q=i.RG8)),E===i.RG_INTEGER&&(W===i.UNSIGNED_BYTE&&(Q=i.RG8UI),W===i.UNSIGNED_SHORT&&(Q=i.RG16UI),W===i.UNSIGNED_INT&&(Q=i.RG32UI),W===i.BYTE&&(Q=i.RG8I),W===i.SHORT&&(Q=i.RG16I),W===i.INT&&(Q=i.RG32I)),E===i.RGB_INTEGER&&(W===i.UNSIGNED_BYTE&&(Q=i.RGB8UI),W===i.UNSIGNED_SHORT&&(Q=i.RGB16UI),W===i.UNSIGNED_INT&&(Q=i.RGB32UI),W===i.BYTE&&(Q=i.RGB8I),W===i.SHORT&&(Q=i.RGB16I),W===i.INT&&(Q=i.RGB32I)),E===i.RGBA_INTEGER&&(W===i.UNSIGNED_BYTE&&(Q=i.RGBA8UI),W===i.UNSIGNED_SHORT&&(Q=i.RGBA16UI),W===i.UNSIGNED_INT&&(Q=i.RGBA32UI),W===i.BYTE&&(Q=i.RGBA8I),W===i.SHORT&&(Q=i.RGBA16I),W===i.INT&&(Q=i.RGBA32I)),E===i.RGB&&W===i.UNSIGNED_INT_5_9_9_9_REV&&(Q=i.RGB9_E5),E===i.RGBA){let ee=ae?Ka:dt.getTransfer(J);W===i.FLOAT&&(Q=i.RGBA32F),W===i.HALF_FLOAT&&(Q=i.RGBA16F),W===i.UNSIGNED_BYTE&&(Q=ee===St?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT_4_4_4_4&&(Q=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&(Q=i.RGB5_A1)}return(Q===i.R16F||Q===i.R32F||Q===i.RG16F||Q===i.RG32F||Q===i.RGBA16F||Q===i.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function y(A,E){let W;return A?E===null||E===Is||E===yr?W=i.DEPTH24_STENCIL8:E===pi?W=i.DEPTH32F_STENCIL8:E===ao&&(W=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Is||E===yr?W=i.DEPTH_COMPONENT24:E===pi?W=i.DEPTH_COMPONENT32F:E===ao&&(W=i.DEPTH_COMPONENT16),W}function I(A,E){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==Bn&&A.minFilter!==Nn?Math.log2(Math.max(E.width,E.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?E.mipmaps.length:1}function S(A){let E=A.target;E.removeEventListener("dispose",S),R(E),E.isVideoTexture&&h.delete(E)}function P(A){let E=A.target;E.removeEventListener("dispose",P),M(E)}function R(A){let E=n.get(A);if(E.__webglInit===void 0)return;let W=A.source,J=d.get(W);if(J){let ae=J[E.__cacheKey];ae.usedTimes--,ae.usedTimes===0&&b(A),Object.keys(J).length===0&&d.delete(W)}n.remove(A)}function b(A){let E=n.get(A);i.deleteTexture(E.__webglTexture);let W=A.source,J=d.get(W);delete J[E.__cacheKey],o.memory.textures--}function M(A){let E=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(E.__webglFramebuffer[J]))for(let ae=0;ae<E.__webglFramebuffer[J].length;ae++)i.deleteFramebuffer(E.__webglFramebuffer[J][ae]);else i.deleteFramebuffer(E.__webglFramebuffer[J]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[J])}else{if(Array.isArray(E.__webglFramebuffer))for(let J=0;J<E.__webglFramebuffer.length;J++)i.deleteFramebuffer(E.__webglFramebuffer[J]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let J=0;J<E.__webglColorRenderbuffer.length;J++)E.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[J]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let W=A.textures;for(let J=0,ae=W.length;J<ae;J++){let Q=n.get(W[J]);Q.__webglTexture&&(i.deleteTexture(Q.__webglTexture),o.memory.textures--),n.remove(W[J])}n.remove(A)}let T=0;function k(){T=0}function U(){let A=T;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),T+=1,A}function H(A){let E=[];return E.push(A.wrapS),E.push(A.wrapT),E.push(A.wrapR||0),E.push(A.magFilter),E.push(A.minFilter),E.push(A.anisotropy),E.push(A.internalFormat),E.push(A.format),E.push(A.type),E.push(A.generateMipmaps),E.push(A.premultiplyAlpha),E.push(A.flipY),E.push(A.unpackAlignment),E.push(A.colorSpace),E.join()}function F(A,E){let W=n.get(A);if(A.isVideoTexture&&ie(A),A.isRenderTargetTexture===!1&&A.version>0&&W.__version!==A.version){let J=A.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{V(W,A,E);return}}t.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+E)}function N(A,E){let W=n.get(A);if(A.version>0&&W.__version!==A.version){V(W,A,E);return}t.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+E)}function j(A,E){let W=n.get(A);if(A.version>0&&W.__version!==A.version){V(W,A,E);return}t.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+E)}function G(A,E){let W=n.get(A);if(A.version>0&&W.__version!==A.version){K(W,A,E);return}t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+E)}let ce={[Di]:i.REPEAT,[Cs]:i.CLAMP_TO_EDGE,[Uc]:i.MIRRORED_REPEAT},pe={[Bn]:i.NEAREST,[Y0]:i.NEAREST_MIPMAP_NEAREST,[Go]:i.NEAREST_MIPMAP_LINEAR,[Nn]:i.LINEAR,[Wl]:i.LINEAR_MIPMAP_NEAREST,[Ps]:i.LINEAR_MIPMAP_LINEAR},xe={[J0]:i.NEVER,[im]:i.ALWAYS,[j0]:i.LESS,[Pf]:i.LEQUAL,[Q0]:i.EQUAL,[nm]:i.GEQUAL,[em]:i.GREATER,[tm]:i.NOTEQUAL};function Ge(A,E){if(E.type===pi&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===Nn||E.magFilter===Wl||E.magFilter===Go||E.magFilter===Ps||E.minFilter===Nn||E.minFilter===Wl||E.minFilter===Go||E.minFilter===Ps)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,ce[E.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,ce[E.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,ce[E.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,pe[E.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,pe[E.minFilter]),E.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,xe[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Bn||E.minFilter!==Go&&E.minFilter!==Ps||E.type===pi&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){let W=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function Ze(A,E){let W=!1;A.__webglInit===void 0&&(A.__webglInit=!0,E.addEventListener("dispose",S));let J=E.source,ae=d.get(J);ae===void 0&&(ae={},d.set(J,ae));let Q=H(E);if(Q!==A.__cacheKey){ae[Q]===void 0&&(ae[Q]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,W=!0),ae[Q].usedTimes++;let ee=ae[A.__cacheKey];ee!==void 0&&(ae[A.__cacheKey].usedTimes--,ee.usedTimes===0&&b(E)),A.__cacheKey=Q,A.__webglTexture=ae[Q].texture}return W}function V(A,E,W){let J=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(J=i.TEXTURE_3D);let ae=Ze(A,E),Q=E.source;t.bindTexture(J,A.__webglTexture,i.TEXTURE0+W);let ee=n.get(Q);if(Q.version!==ee.__version||ae===!0){t.activeTexture(i.TEXTURE0+W);let ne=dt.getPrimaries(dt.workingColorSpace),re=E.colorSpace===es?null:dt.getPrimaries(E.colorSpace),ke=E.colorSpace===es||ne===re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ke);let te=v(E.image,!1,s.maxTextureSize);te=Ie(E,te);let ve=r.convert(E.format,E.colorSpace),qe=r.convert(E.type),Ye=x(E.internalFormat,ve,qe,E.colorSpace,E.isVideoTexture);Ge(J,E);let Le,ct=E.mipmaps,nt=E.isVideoTexture!==!0,Rt=ee.__version===void 0||ae===!0,B=Q.dataReady,we=I(E,te);if(E.isDepthTexture)Ye=y(E.format===_r,E.type),Rt&&(nt?t.texStorage2D(i.TEXTURE_2D,1,Ye,te.width,te.height):t.texImage2D(i.TEXTURE_2D,0,Ye,te.width,te.height,0,ve,qe,null));else if(E.isDataTexture)if(ct.length>0){nt&&Rt&&t.texStorage2D(i.TEXTURE_2D,we,Ye,ct[0].width,ct[0].height);for(let Z=0,oe=ct.length;Z<oe;Z++)Le=ct[Z],nt?B&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,Le.width,Le.height,ve,qe,Le.data):t.texImage2D(i.TEXTURE_2D,Z,Ye,Le.width,Le.height,0,ve,qe,Le.data);E.generateMipmaps=!1}else nt?(Rt&&t.texStorage2D(i.TEXTURE_2D,we,Ye,te.width,te.height),B&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,te.width,te.height,ve,qe,te.data)):t.texImage2D(i.TEXTURE_2D,0,Ye,te.width,te.height,0,ve,qe,te.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){nt&&Rt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Ye,ct[0].width,ct[0].height,te.depth);for(let Z=0,oe=ct.length;Z<oe;Z++)if(Le=ct[Z],E.format!==ii)if(ve!==null)if(nt){if(B)if(E.layerUpdates.size>0){let Ae=nf(Le.width,Le.height,E.format,E.type);for(let Se of E.layerUpdates){let je=Le.data.subarray(Se*Ae/Le.data.BYTES_PER_ELEMENT,(Se+1)*Ae/Le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,Se,Le.width,Le.height,1,ve,je)}E.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,Le.width,Le.height,te.depth,ve,Le.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Z,Ye,Le.width,Le.height,te.depth,0,Le.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else nt?B&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,Z,0,0,0,Le.width,Le.height,te.depth,ve,qe,Le.data):t.texImage3D(i.TEXTURE_2D_ARRAY,Z,Ye,Le.width,Le.height,te.depth,0,ve,qe,Le.data)}else{nt&&Rt&&t.texStorage2D(i.TEXTURE_2D,we,Ye,ct[0].width,ct[0].height);for(let Z=0,oe=ct.length;Z<oe;Z++)Le=ct[Z],E.format!==ii?ve!==null?nt?B&&t.compressedTexSubImage2D(i.TEXTURE_2D,Z,0,0,Le.width,Le.height,ve,Le.data):t.compressedTexImage2D(i.TEXTURE_2D,Z,Ye,Le.width,Le.height,0,Le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):nt?B&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,Le.width,Le.height,ve,qe,Le.data):t.texImage2D(i.TEXTURE_2D,Z,Ye,Le.width,Le.height,0,ve,qe,Le.data)}else if(E.isDataArrayTexture)if(nt){if(Rt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,we,Ye,te.width,te.height,te.depth),B)if(E.layerUpdates.size>0){let Z=nf(te.width,te.height,E.format,E.type);for(let oe of E.layerUpdates){let Ae=te.data.subarray(oe*Z/te.data.BYTES_PER_ELEMENT,(oe+1)*Z/te.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,oe,te.width,te.height,1,ve,qe,Ae)}E.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,ve,qe,te.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ye,te.width,te.height,te.depth,0,ve,qe,te.data);else if(E.isData3DTexture)nt?(Rt&&t.texStorage3D(i.TEXTURE_3D,we,Ye,te.width,te.height,te.depth),B&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,ve,qe,te.data)):t.texImage3D(i.TEXTURE_3D,0,Ye,te.width,te.height,te.depth,0,ve,qe,te.data);else if(E.isFramebufferTexture){if(Rt)if(nt)t.texStorage2D(i.TEXTURE_2D,we,Ye,te.width,te.height);else{let Z=te.width,oe=te.height;for(let Ae=0;Ae<we;Ae++)t.texImage2D(i.TEXTURE_2D,Ae,Ye,Z,oe,0,ve,qe,null),Z>>=1,oe>>=1}}else if(ct.length>0){if(nt&&Rt){let Z=me(ct[0]);t.texStorage2D(i.TEXTURE_2D,we,Ye,Z.width,Z.height)}for(let Z=0,oe=ct.length;Z<oe;Z++)Le=ct[Z],nt?B&&t.texSubImage2D(i.TEXTURE_2D,Z,0,0,ve,qe,Le):t.texImage2D(i.TEXTURE_2D,Z,Ye,ve,qe,Le);E.generateMipmaps=!1}else if(nt){if(Rt){let Z=me(te);t.texStorage2D(i.TEXTURE_2D,we,Ye,Z.width,Z.height)}B&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ve,qe,te)}else t.texImage2D(i.TEXTURE_2D,0,Ye,ve,qe,te);g(E)&&p(J),ee.__version=Q.version,E.onUpdate&&E.onUpdate(E)}A.__version=E.version}function K(A,E,W){if(E.image.length!==6)return;let J=Ze(A,E),ae=E.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+W);let Q=n.get(ae);if(ae.version!==Q.__version||J===!0){t.activeTexture(i.TEXTURE0+W);let ee=dt.getPrimaries(dt.workingColorSpace),ne=E.colorSpace===es?null:dt.getPrimaries(E.colorSpace),re=E.colorSpace===es||ee===ne?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,re);let ke=E.isCompressedTexture||E.image[0].isCompressedTexture,te=E.image[0]&&E.image[0].isDataTexture,ve=[];for(let oe=0;oe<6;oe++)!ke&&!te?ve[oe]=v(E.image[oe],!0,s.maxCubemapSize):ve[oe]=te?E.image[oe].image:E.image[oe],ve[oe]=Ie(E,ve[oe]);let qe=ve[0],Ye=r.convert(E.format,E.colorSpace),Le=r.convert(E.type),ct=x(E.internalFormat,Ye,Le,E.colorSpace),nt=E.isVideoTexture!==!0,Rt=Q.__version===void 0||J===!0,B=ae.dataReady,we=I(E,qe);Ge(i.TEXTURE_CUBE_MAP,E);let Z;if(ke){nt&&Rt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,we,ct,qe.width,qe.height);for(let oe=0;oe<6;oe++){Z=ve[oe].mipmaps;for(let Ae=0;Ae<Z.length;Ae++){let Se=Z[Ae];E.format!==ii?Ye!==null?nt?B&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae,0,0,Se.width,Se.height,Ye,Se.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae,ct,Se.width,Se.height,0,Se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):nt?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae,0,0,Se.width,Se.height,Ye,Le,Se.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae,ct,Se.width,Se.height,0,Ye,Le,Se.data)}}}else{if(Z=E.mipmaps,nt&&Rt){Z.length>0&&we++;let oe=me(ve[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,we,ct,oe.width,oe.height)}for(let oe=0;oe<6;oe++)if(te){nt?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,ve[oe].width,ve[oe].height,Ye,Le,ve[oe].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,ct,ve[oe].width,ve[oe].height,0,Ye,Le,ve[oe].data);for(let Ae=0;Ae<Z.length;Ae++){let je=Z[Ae].image[oe].image;nt?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae+1,0,0,je.width,je.height,Ye,Le,je.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae+1,ct,je.width,je.height,0,Ye,Le,je.data)}}else{nt?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,Ye,Le,ve[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,ct,Ye,Le,ve[oe]);for(let Ae=0;Ae<Z.length;Ae++){let Se=Z[Ae];nt?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae+1,0,0,Ye,Le,Se.image[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ae+1,ct,Ye,Le,Se.image[oe])}}}g(E)&&p(i.TEXTURE_CUBE_MAP),Q.__version=ae.version,E.onUpdate&&E.onUpdate(E)}A.__version=E.version}function be(A,E,W,J,ae,Q){let ee=r.convert(W.format,W.colorSpace),ne=r.convert(W.type),re=x(W.internalFormat,ee,ne,W.colorSpace),ke=n.get(E),te=n.get(W);if(te.__renderTarget=E,!ke.__hasExternalTextures){let ve=Math.max(1,E.width>>Q),qe=Math.max(1,E.height>>Q);ae===i.TEXTURE_3D||ae===i.TEXTURE_2D_ARRAY?t.texImage3D(ae,Q,re,ve,qe,E.depth,0,ee,ne,null):t.texImage2D(ae,Q,re,ve,qe,0,ee,ne,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),le(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,ae,te.__webglTexture,0,Y(E)):(ae===i.TEXTURE_2D||ae>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ae<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,ae,te.__webglTexture,Q),t.bindFramebuffer(i.FRAMEBUFFER,null)}function fe(A,E,W){if(i.bindRenderbuffer(i.RENDERBUFFER,A),E.depthBuffer){let J=E.depthTexture,ae=J&&J.isDepthTexture?J.type:null,Q=y(E.stencilBuffer,ae),ee=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=Y(E);le(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ne,Q,E.width,E.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,ne,Q,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,Q,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ee,i.RENDERBUFFER,A)}else{let J=E.textures;for(let ae=0;ae<J.length;ae++){let Q=J[ae],ee=r.convert(Q.format,Q.colorSpace),ne=r.convert(Q.type),re=x(Q.internalFormat,ee,ne,Q.colorSpace),ke=Y(E);W&&le(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ke,re,E.width,E.height):le(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ke,re,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,re,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function De(A,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let J=n.get(E.depthTexture);J.__renderTarget=E,(!J.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),F(E.depthTexture,0);let ae=J.__webglTexture,Q=Y(E);if(E.depthTexture.format===fr)le(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ae,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ae,0);else if(E.depthTexture.format===_r)le(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ae,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ae,0);else throw new Error("Unknown depthTexture format")}function Ne(A){let E=n.get(A),W=A.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==A.depthTexture){let J=A.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),J){let ae=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,J.removeEventListener("dispose",ae)};J.addEventListener("dispose",ae),E.__depthDisposeCallback=ae}E.__boundDepthTexture=J}if(A.depthTexture&&!E.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");De(E.__webglFramebuffer,A)}else if(W){E.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[J]),E.__webglDepthbuffer[J]===void 0)E.__webglDepthbuffer[J]=i.createRenderbuffer(),fe(E.__webglDepthbuffer[J],A,!1);else{let ae=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=E.__webglDepthbuffer[J];i.bindRenderbuffer(i.RENDERBUFFER,Q),i.framebufferRenderbuffer(i.FRAMEBUFFER,ae,i.RENDERBUFFER,Q)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=i.createRenderbuffer(),fe(E.__webglDepthbuffer,A,!1);else{let J=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ae=E.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ae),i.framebufferRenderbuffer(i.FRAMEBUFFER,J,i.RENDERBUFFER,ae)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ve(A,E,W){let J=n.get(A);E!==void 0&&be(J.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&Ne(A)}function ot(A){let E=A.texture,W=n.get(A),J=n.get(E);A.addEventListener("dispose",P);let ae=A.textures,Q=A.isWebGLCubeRenderTarget===!0,ee=ae.length>1;if(ee||(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=E.version,o.memory.textures++),Q){W.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(E.mipmaps&&E.mipmaps.length>0){W.__webglFramebuffer[ne]=[];for(let re=0;re<E.mipmaps.length;re++)W.__webglFramebuffer[ne][re]=i.createFramebuffer()}else W.__webglFramebuffer[ne]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){W.__webglFramebuffer=[];for(let ne=0;ne<E.mipmaps.length;ne++)W.__webglFramebuffer[ne]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(ee)for(let ne=0,re=ae.length;ne<re;ne++){let ke=n.get(ae[ne]);ke.__webglTexture===void 0&&(ke.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&le(A)===!1){W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let ne=0;ne<ae.length;ne++){let re=ae[ne];W.__webglColorRenderbuffer[ne]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[ne]);let ke=r.convert(re.format,re.colorSpace),te=r.convert(re.type),ve=x(re.internalFormat,ke,te,re.colorSpace,A.isXRRenderTarget===!0),qe=Y(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,qe,ve,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ne,i.RENDERBUFFER,W.__webglColorRenderbuffer[ne])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),fe(W.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Q){t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),Ge(i.TEXTURE_CUBE_MAP,E);for(let ne=0;ne<6;ne++)if(E.mipmaps&&E.mipmaps.length>0)for(let re=0;re<E.mipmaps.length;re++)be(W.__webglFramebuffer[ne][re],A,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,re);else be(W.__webglFramebuffer[ne],A,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);g(E)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ee){for(let ne=0,re=ae.length;ne<re;ne++){let ke=ae[ne],te=n.get(ke);t.bindTexture(i.TEXTURE_2D,te.__webglTexture),Ge(i.TEXTURE_2D,ke),be(W.__webglFramebuffer,A,ke,i.COLOR_ATTACHMENT0+ne,i.TEXTURE_2D,0),g(ke)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let ne=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ne=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ne,J.__webglTexture),Ge(ne,E),E.mipmaps&&E.mipmaps.length>0)for(let re=0;re<E.mipmaps.length;re++)be(W.__webglFramebuffer[re],A,E,i.COLOR_ATTACHMENT0,ne,re);else be(W.__webglFramebuffer,A,E,i.COLOR_ATTACHMENT0,ne,0);g(E)&&p(ne),t.unbindTexture()}A.depthBuffer&&Ne(A)}function se(A){let E=A.textures;for(let W=0,J=E.length;W<J;W++){let ae=E[W];if(g(ae)){let Q=_(A),ee=n.get(ae).__webglTexture;t.bindTexture(Q,ee),p(Q),t.unbindTexture()}}}let he=[],L=[];function Pe(A){if(A.samples>0){if(le(A)===!1){let E=A.textures,W=A.width,J=A.height,ae=i.COLOR_BUFFER_BIT,Q=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ee=n.get(A),ne=E.length>1;if(ne)for(let re=0;re<E.length;re++)t.bindFramebuffer(i.FRAMEBUFFER,ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+re,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+re,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ee.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ee.__webglFramebuffer);for(let re=0;re<E.length;re++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(ae|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(ae|=i.STENCIL_BUFFER_BIT)),ne){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ee.__webglColorRenderbuffer[re]);let ke=n.get(E[re]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ke,0)}i.blitFramebuffer(0,0,W,J,0,0,W,J,ae,i.NEAREST),l===!0&&(he.length=0,L.length=0,he.push(i.COLOR_ATTACHMENT0+re),A.depthBuffer&&A.resolveDepthBuffer===!1&&(he.push(Q),L.push(Q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,L)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,he))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ne)for(let re=0;re<E.length;re++){t.bindFramebuffer(i.FRAMEBUFFER,ee.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+re,i.RENDERBUFFER,ee.__webglColorRenderbuffer[re]);let ke=n.get(E[re]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ee.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+re,i.TEXTURE_2D,ke,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ee.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){let E=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function Y(A){return Math.min(s.maxSamples,A.samples)}function le(A){let E=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function ie(A){let E=o.render.frame;h.get(A)!==E&&(h.set(A,E),A.update())}function Ie(A,E){let W=A.colorSpace,J=A.format,ae=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||W!==Rr&&W!==es&&(dt.getTransfer(W)===St?(J!==ii||ae!==ki)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),E}function me(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=k,this.setTexture2D=F,this.setTexture2DArray=N,this.setTexture3D=j,this.setTextureCube=G,this.rebindTextures=Ve,this.setupRenderTarget=ot,this.updateRenderTargetMipmap=se,this.updateMultisampleRenderTarget=Pe,this.setupDepthRenderbuffer=Ne,this.setupFrameBufferTexture=be,this.useMultisampledRTT=le}function h_(i,e){function t(n,s=es){let r,o=dt.getTransfer(s);if(n===ki)return i.UNSIGNED_BYTE;if(n===iu)return i.UNSIGNED_SHORT_4_4_4_4;if(n===su)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ef)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Mf)return i.BYTE;if(n===bf)return i.SHORT;if(n===ao)return i.UNSIGNED_SHORT;if(n===nu)return i.INT;if(n===Is)return i.UNSIGNED_INT;if(n===pi)return i.FLOAT;if(n===as)return i.HALF_FLOAT;if(n===wf)return i.ALPHA;if(n===Sf)return i.RGB;if(n===ii)return i.RGBA;if(n===Tf)return i.LUMINANCE;if(n===Af)return i.LUMINANCE_ALPHA;if(n===fr)return i.DEPTH_COMPONENT;if(n===_r)return i.DEPTH_STENCIL;if(n===ru)return i.RED;if(n===ou)return i.RED_INTEGER;if(n===Rf)return i.RG;if(n===au)return i.RG_INTEGER;if(n===lu)return i.RGBA_INTEGER;if(n===xa||n===ya||n===_a||n===Ma)if(o===St)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===xa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ya)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===_a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ma)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===xa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ya)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===_a)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ma)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Nc||n===Bc||n===Hc||n===Fc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Nc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Bc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Hc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Fc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Oc||n===zc||n===Gc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Oc||n===zc)return o===St?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Gc)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Vc||n===Wc||n===Xc||n===qc||n===Yc||n===Zc||n===Kc||n===$c||n===Jc||n===jc||n===Qc||n===eh||n===th||n===nh)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Vc)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Wc)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Xc)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===qc)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Yc)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Zc)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Kc)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===$c)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Jc)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===jc)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Qc)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===eh)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===th)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===nh)return o===St?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ba||n===ih||n===sh)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ba)return o===St?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ih)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===sh)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Cf||n===rh||n===oh||n===ah)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ba)return r.COMPRESSED_RED_RGTC1_EXT;if(n===rh)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===oh)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ah)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===yr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var bh=class extends Jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},ye=class extends cn{constructor(){super(),this.isGroup=!0,this.type="Group"}},u_={type:"move"},so=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ye,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ye,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ye,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let v of e.hand.values()){let g=t.getJointPose(v,n),p=this._getHandJoint(c,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(u_)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ye;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},d_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,f_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Eh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let s=new Pn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new jt({vertexShader:d_,fragmentShader:f_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new D(new tt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},wh=class extends os{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null,v=new Eh,g=t.getContextAttributes(),p=null,_=null,x=[],y=[],I=new ue,S=null,P=new Jt;P.viewport=new Tt;let R=new Jt;R.viewport=new Tt;let b=[P,R],M=new bh,T=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(V){let K=x[V];return K===void 0&&(K=new so,x[V]=K),K.getTargetRaySpace()},this.getControllerGrip=function(V){let K=x[V];return K===void 0&&(K=new so,x[V]=K),K.getGripSpace()},this.getHand=function(V){let K=x[V];return K===void 0&&(K=new so,x[V]=K),K.getHandSpace()};function U(V){let K=y.indexOf(V.inputSource);if(K===-1)return;let be=x[K];be!==void 0&&(be.update(V.inputSource,V.frame,c||o),be.dispatchEvent({type:V.type,data:V.inputSource}))}function H(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",F);for(let V=0;V<x.length;V++){let K=y[V];K!==null&&(y[V]=null,x[V].disconnect(K))}T=null,k=null,v.reset(),e.setRenderTarget(p),f=null,d=null,u=null,s=null,_=null,Ze.stop(),n.isPresenting=!1,e.setPixelRatio(S),e.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(V){r=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(V){a=V,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(V){c=V},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(V){if(s=V,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",H),s.addEventListener("inputsourceschange",F),g.xrCompatible!==!0&&await t.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(I),s.renderState.layers===void 0){let K={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,K),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new Gn(f.framebufferWidth,f.framebufferHeight,{format:ii,type:ki,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let K=null,be=null,fe=null;g.depth&&(fe=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,K=g.stencil?_r:fr,be=g.stencil?yr:Is);let De={colorFormat:t.RGBA8,depthFormat:fe,scaleFactor:r};u=new XRWebGLBinding(s,t),d=u.createProjectionLayer(De),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),_=new Gn(d.textureWidth,d.textureHeight,{format:ii,type:ki,depthTexture:new Da(d.textureWidth,d.textureHeight,be,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Ze.setContext(s),Ze.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function F(V){for(let K=0;K<V.removed.length;K++){let be=V.removed[K],fe=y.indexOf(be);fe>=0&&(y[fe]=null,x[fe].disconnect(be))}for(let K=0;K<V.added.length;K++){let be=V.added[K],fe=y.indexOf(be);if(fe===-1){for(let Ne=0;Ne<x.length;Ne++)if(Ne>=y.length){y.push(be),fe=Ne;break}else if(y[Ne]===null){y[Ne]=be,fe=Ne;break}if(fe===-1)break}let De=x[fe];De&&De.connect(be)}}let N=new C,j=new C;function G(V,K,be){N.setFromMatrixPosition(K.matrixWorld),j.setFromMatrixPosition(be.matrixWorld);let fe=N.distanceTo(j),De=K.projectionMatrix.elements,Ne=be.projectionMatrix.elements,Ve=De[14]/(De[10]-1),ot=De[14]/(De[10]+1),se=(De[9]+1)/De[5],he=(De[9]-1)/De[5],L=(De[8]-1)/De[0],Pe=(Ne[8]+1)/Ne[0],Y=Ve*L,le=Ve*Pe,ie=fe/(-L+Pe),Ie=ie*-L;if(K.matrixWorld.decompose(V.position,V.quaternion,V.scale),V.translateX(Ie),V.translateZ(ie),V.matrixWorld.compose(V.position,V.quaternion,V.scale),V.matrixWorldInverse.copy(V.matrixWorld).invert(),De[10]===-1)V.projectionMatrix.copy(K.projectionMatrix),V.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{let me=Ve+ie,A=ot+ie,E=Y-Ie,W=le+(fe-Ie),J=se*ot/A*me,ae=he*ot/A*me;V.projectionMatrix.makePerspective(E,W,J,ae,me,A),V.projectionMatrixInverse.copy(V.projectionMatrix).invert()}}function ce(V,K){K===null?V.matrixWorld.copy(V.matrix):V.matrixWorld.multiplyMatrices(K.matrixWorld,V.matrix),V.matrixWorldInverse.copy(V.matrixWorld).invert()}this.updateCamera=function(V){if(s===null)return;let K=V.near,be=V.far;v.texture!==null&&(v.depthNear>0&&(K=v.depthNear),v.depthFar>0&&(be=v.depthFar)),M.near=R.near=P.near=K,M.far=R.far=P.far=be,(T!==M.near||k!==M.far)&&(s.updateRenderState({depthNear:M.near,depthFar:M.far}),T=M.near,k=M.far),P.layers.mask=V.layers.mask|2,R.layers.mask=V.layers.mask|4,M.layers.mask=P.layers.mask|R.layers.mask;let fe=V.parent,De=M.cameras;ce(M,fe);for(let Ne=0;Ne<De.length;Ne++)ce(De[Ne],fe);De.length===2?G(M,P,R):M.projectionMatrix.copy(P.projectionMatrix),pe(V,M,fe)};function pe(V,K,be){be===null?V.matrix.copy(K.matrixWorld):(V.matrix.copy(be.matrixWorld),V.matrix.invert(),V.matrix.multiply(K.matrixWorld)),V.matrix.decompose(V.position,V.quaternion,V.scale),V.updateMatrixWorld(!0),V.projectionMatrix.copy(K.projectionMatrix),V.projectionMatrixInverse.copy(K.projectionMatrixInverse),V.isPerspectiveCamera&&(V.fov=lo*2*Math.atan(1/V.projectionMatrix.elements[5]),V.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(V){l=V,d!==null&&(d.fixedFoveation=V),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=V)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(M)};let xe=null;function Ge(V,K){if(h=K.getViewerPose(c||o),m=K,h!==null){let be=h.views;f!==null&&(e.setRenderTargetFramebuffer(_,f.framebuffer),e.setRenderTarget(_));let fe=!1;be.length!==M.cameras.length&&(M.cameras.length=0,fe=!0);for(let Ne=0;Ne<be.length;Ne++){let Ve=be[Ne],ot=null;if(f!==null)ot=f.getViewport(Ve);else{let he=u.getViewSubImage(d,Ve);ot=he.viewport,Ne===0&&(e.setRenderTargetTextures(_,he.colorTexture,d.ignoreDepthValues?void 0:he.depthStencilTexture),e.setRenderTarget(_))}let se=b[Ne];se===void 0&&(se=new Jt,se.layers.enable(Ne),se.viewport=new Tt,b[Ne]=se),se.matrix.fromArray(Ve.transform.matrix),se.matrix.decompose(se.position,se.quaternion,se.scale),se.projectionMatrix.fromArray(Ve.projectionMatrix),se.projectionMatrixInverse.copy(se.projectionMatrix).invert(),se.viewport.set(ot.x,ot.y,ot.width,ot.height),Ne===0&&(M.matrix.copy(se.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),fe===!0&&M.cameras.push(se)}let De=s.enabledFeatures;if(De&&De.includes("depth-sensing")){let Ne=u.getDepthInformation(be[0]);Ne&&Ne.isValid&&Ne.texture&&v.init(e,Ne,s.renderState)}}for(let be=0;be<x.length;be++){let fe=y[be],De=x[be];fe!==null&&De!==void 0&&De.update(fe,K,c||o)}xe&&xe(V,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),m=null}let Ze=new Uf;Ze.setAnimationLoop(Ge),this.setAnimationLoop=function(V){xe=V},this.dispose=function(){}}},ws=new ln,p_=new $e;function m_(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,kf(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,_,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,y)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),v(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?l(g,p,_,x):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===mn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===mn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let _=e.get(p),x=_.envMap,y=_.envMapRotation;x&&(g.envMap.value=x,ws.copy(y),ws.x*=-1,ws.y*=-1,ws.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ws.y*=-1,ws.z*=-1),g.envMapRotation.value.setFromMatrix4(p_.makeRotationFromEuler(ws)),g.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,_,x){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*_,g.scale.value=x*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,_){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===mn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){let _=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function g_(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,x){let y=x.program;n.uniformBlockBinding(_,y)}function c(_,x){let y=s[_.id];y===void 0&&(m(_),y=h(_),s[_.id]=y,_.addEventListener("dispose",g));let I=x.program;n.updateUBOMapping(_,I);let S=e.render.frame;r[_.id]!==S&&(d(_),r[_.id]=S)}function h(_){let x=u();_.__bindingPointIndex=x;let y=i.createBuffer(),I=_.__size,S=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,I,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,y),y}function u(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){let x=s[_.id],y=_.uniforms,I=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let S=0,P=y.length;S<P;S++){let R=Array.isArray(y[S])?y[S]:[y[S]];for(let b=0,M=R.length;b<M;b++){let T=R[b];if(f(T,S,b,I)===!0){let k=T.__offset,U=Array.isArray(T.value)?T.value:[T.value],H=0;for(let F=0;F<U.length;F++){let N=U[F],j=v(N);typeof N=="number"||typeof N=="boolean"?(T.__data[0]=N,i.bufferSubData(i.UNIFORM_BUFFER,k+H,T.__data)):N.isMatrix3?(T.__data[0]=N.elements[0],T.__data[1]=N.elements[1],T.__data[2]=N.elements[2],T.__data[3]=0,T.__data[4]=N.elements[3],T.__data[5]=N.elements[4],T.__data[6]=N.elements[5],T.__data[7]=0,T.__data[8]=N.elements[6],T.__data[9]=N.elements[7],T.__data[10]=N.elements[8],T.__data[11]=0):(N.toArray(T.__data,H),H+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,k,T.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(_,x,y,I){let S=_.value,P=x+"_"+y;if(I[P]===void 0)return typeof S=="number"||typeof S=="boolean"?I[P]=S:I[P]=S.clone(),!0;{let R=I[P];if(typeof S=="number"||typeof S=="boolean"){if(R!==S)return I[P]=S,!0}else if(R.equals(S)===!1)return R.copy(S),!0}return!1}function m(_){let x=_.uniforms,y=0,I=16;for(let P=0,R=x.length;P<R;P++){let b=Array.isArray(x[P])?x[P]:[x[P]];for(let M=0,T=b.length;M<T;M++){let k=b[M],U=Array.isArray(k.value)?k.value:[k.value];for(let H=0,F=U.length;H<F;H++){let N=U[H],j=v(N),G=y%I,ce=G%j.boundary,pe=G+ce;y+=ce,pe!==0&&I-pe<j.storage&&(y+=I-pe),k.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=y,y+=j.storage}}}let S=y%I;return S>0&&(y+=I-S),_.__size=y,_.__cache={},this}function v(_){let x={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(x.boundary=4,x.storage=4):_.isVector2?(x.boundary=8,x.storage=8):_.isVector3||_.isColor?(x.boundary=16,x.storage=12):_.isVector4?(x.boundary=16,x.storage=16):_.isMatrix3?(x.boundary=48,x.storage=48):_.isMatrix4?(x.boundary=64,x.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),x}function g(_){let x=_.target;x.removeEventListener("dispose",g);let y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function p(){for(let _ in s)i.deleteBuffer(s[_]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}var ka=class{constructor(e={}){let{canvas:t=_m(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let m=new Uint32Array(4),v=new Int32Array(4),g=null,p=null,_=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ht,this.toneMapping=ns,this.toneMappingExposure=1;let y=this,I=!1,S=0,P=0,R=null,b=-1,M=null,T=new Tt,k=new Tt,U=null,H=new Re(0),F=0,N=t.width,j=t.height,G=1,ce=null,pe=null,xe=new Tt(0,0,N,j),Ge=new Tt(0,0,N,j),Ze=!1,V=new ho,K=!1,be=!1,fe=new $e,De=new $e,Ne=new C,Ve=new Tt,ot={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},se=!1;function he(){return R===null?G:1}let L=n;function Pe(w,O){return t.getContext(w,O)}try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${jh}`),t.addEventListener("webglcontextlost",oe,!1),t.addEventListener("webglcontextrestored",Ae,!1),t.addEventListener("webglcontextcreationerror",Se,!1),L===null){let O="webgl2";if(L=Pe(O,w),L===null)throw Pe(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Y,le,ie,Ie,me,A,E,W,J,ae,Q,ee,ne,re,ke,te,ve,qe,Ye,Le,ct,nt,Rt,B;function we(){Y=new Lx(L),Y.init(),nt=new h_(L,Y),le=new Tx(L,Y,e,nt),ie=new a_(L,Y),le.reverseDepthBuffer&&d&&ie.buffers.depth.setReversed(!0),Ie=new Ux(L),me=new Zy,A=new c_(L,Y,ie,me,le,nt,Ie),E=new Rx(y),W=new Ix(y),J=new Gm(L),Rt=new wx(L,J),ae=new Dx(L,J,Ie,Rt),Q=new Bx(L,ae,J,Ie),Ye=new Nx(L,le,A),te=new Ax(me),ee=new Yy(y,E,W,Y,le,Rt,te),ne=new m_(y,me),re=new $y,ke=new n_(Y),qe=new Ex(y,E,W,ie,Q,f,l),ve=new r_(y,Q,le),B=new g_(L,Ie,le,ie),Le=new Sx(L,Y,Ie),ct=new kx(L,Y,Ie),Ie.programs=ee.programs,y.capabilities=le,y.extensions=Y,y.properties=me,y.renderLists=re,y.shadowMap=ve,y.state=ie,y.info=Ie}we();let Z=new wh(y,L);this.xr=Z,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let w=Y.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=Y.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(w){w!==void 0&&(G=w,this.setSize(N,j,!1))},this.getSize=function(w){return w.set(N,j)},this.setSize=function(w,O,X=!0){if(Z.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=w,j=O,t.width=Math.floor(w*G),t.height=Math.floor(O*G),X===!0&&(t.style.width=w+"px",t.style.height=O+"px"),this.setViewport(0,0,w,O)},this.getDrawingBufferSize=function(w){return w.set(N*G,j*G).floor()},this.setDrawingBufferSize=function(w,O,X){N=w,j=O,G=X,t.width=Math.floor(w*X),t.height=Math.floor(O*X),this.setViewport(0,0,w,O)},this.getCurrentViewport=function(w){return w.copy(T)},this.getViewport=function(w){return w.copy(xe)},this.setViewport=function(w,O,X,q){w.isVector4?xe.set(w.x,w.y,w.z,w.w):xe.set(w,O,X,q),ie.viewport(T.copy(xe).multiplyScalar(G).round())},this.getScissor=function(w){return w.copy(Ge)},this.setScissor=function(w,O,X,q){w.isVector4?Ge.set(w.x,w.y,w.z,w.w):Ge.set(w,O,X,q),ie.scissor(k.copy(Ge).multiplyScalar(G).round())},this.getScissorTest=function(){return Ze},this.setScissorTest=function(w){ie.setScissorTest(Ze=w)},this.setOpaqueSort=function(w){ce=w},this.setTransparentSort=function(w){pe=w},this.getClearColor=function(w){return w.copy(qe.getClearColor())},this.setClearColor=function(){qe.setClearColor.apply(qe,arguments)},this.getClearAlpha=function(){return qe.getClearAlpha()},this.setClearAlpha=function(){qe.setClearAlpha.apply(qe,arguments)},this.clear=function(w=!0,O=!0,X=!0){let q=0;if(w){let z=!1;if(R!==null){let ge=R.texture.format;z=ge===lu||ge===au||ge===ou}if(z){let ge=R.texture.type,Te=ge===ki||ge===Is||ge===ao||ge===yr||ge===iu||ge===su,Be=qe.getClearColor(),He=qe.getClearAlpha(),Ke=Be.r,Qe=Be.g,Fe=Be.b;Te?(m[0]=Ke,m[1]=Qe,m[2]=Fe,m[3]=He,L.clearBufferuiv(L.COLOR,0,m)):(v[0]=Ke,v[1]=Qe,v[2]=Fe,v[3]=He,L.clearBufferiv(L.COLOR,0,v))}else q|=L.COLOR_BUFFER_BIT}O&&(q|=L.DEPTH_BUFFER_BIT),X&&(q|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",oe,!1),t.removeEventListener("webglcontextrestored",Ae,!1),t.removeEventListener("webglcontextcreationerror",Se,!1),re.dispose(),ke.dispose(),me.dispose(),E.dispose(),W.dispose(),Q.dispose(),Rt.dispose(),B.dispose(),ee.dispose(),Z.dispose(),Z.removeEventListener("sessionstart",Ku),Z.removeEventListener("sessionend",$u),xs.stop()};function oe(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function Ae(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;let w=Ie.autoReset,O=ve.enabled,X=ve.autoUpdate,q=ve.needsUpdate,z=ve.type;we(),Ie.autoReset=w,ve.enabled=O,ve.autoUpdate=X,ve.needsUpdate=q,ve.type=z}function Se(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function je(w){let O=w.target;O.removeEventListener("dispose",je),Ot(O)}function Ot(w){dn(w),me.remove(w)}function dn(w){let O=me.get(w).programs;O!==void 0&&(O.forEach(function(X){ee.releaseProgram(X)}),w.isShaderMaterial&&ee.releaseShaderCache(w))}this.renderBufferDirect=function(w,O,X,q,z,ge){O===null&&(O=ot);let Te=z.isMesh&&z.matrixWorld.determinant()<0,Be=g0(w,O,X,q,z);ie.setMaterial(q,Te);let He=X.index,Ke=1;if(q.wireframe===!0){if(He=ae.getWireframeAttribute(X),He===void 0)return;Ke=2}let Qe=X.drawRange,Fe=X.attributes.position,mt=Qe.start*Ke,Ct=(Qe.start+Qe.count)*Ke;ge!==null&&(mt=Math.max(mt,ge.start*Ke),Ct=Math.min(Ct,(ge.start+ge.count)*Ke)),He!==null?(mt=Math.max(mt,0),Ct=Math.min(Ct,He.count)):Fe!=null&&(mt=Math.max(mt,0),Ct=Math.min(Ct,Fe.count));let Pt=Ct-mt;if(Pt<0||Pt===1/0)return;Rt.setup(z,q,Be,X,He);let Cn,_t=Le;if(He!==null&&(Cn=J.get(He),_t=ct,_t.setIndex(Cn)),z.isMesh)q.wireframe===!0?(ie.setLineWidth(q.wireframeLinewidth*he()),_t.setMode(L.LINES)):_t.setMode(L.TRIANGLES);else if(z.isLine){let Oe=q.linewidth;Oe===void 0&&(Oe=1),ie.setLineWidth(Oe*he()),z.isLineSegments?_t.setMode(L.LINES):z.isLineLoop?_t.setMode(L.LINE_LOOP):_t.setMode(L.LINE_STRIP)}else z.isPoints?_t.setMode(L.POINTS):z.isSprite&&_t.setMode(L.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)_t.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(Y.get("WEBGL_multi_draw"))_t.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let Oe=z._multiDrawStarts,Ei=z._multiDrawCounts,Mt=z._multiDrawCount,Qn=He?J.get(He).bytesPerElement:1,Ys=me.get(q).currentProgram.getUniforms();for(let Dn=0;Dn<Mt;Dn++)Ys.setValue(L,"_gl_DrawID",Dn),_t.render(Oe[Dn]/Qn,Ei[Dn])}else if(z.isInstancedMesh)_t.renderInstances(mt,Pt,z.count);else if(X.isInstancedBufferGeometry){let Oe=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Ei=Math.min(X.instanceCount,Oe);_t.renderInstances(mt,Pt,Ei)}else _t.render(mt,Pt)};function Et(w,O,X){w.transparent===!0&&w.side===gt&&w.forceSinglePass===!1?(w.side=mn,w.needsUpdate=!0,zo(w,O,X),w.side=ss,w.needsUpdate=!0,zo(w,O,X),w.side=gt):zo(w,O,X)}this.compile=function(w,O,X=null){X===null&&(X=w),p=ke.get(X),p.init(O),x.push(p),X.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),w!==X&&w.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights();let q=new Set;return w.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;let ge=z.material;if(ge)if(Array.isArray(ge))for(let Te=0;Te<ge.length;Te++){let Be=ge[Te];Et(Be,X,z),q.add(Be)}else Et(ge,X,z),q.add(ge)}),x.pop(),p=null,q},this.compileAsync=function(w,O,X=null){let q=this.compile(w,O,X);return new Promise(z=>{function ge(){if(q.forEach(function(Te){me.get(Te).currentProgram.isReady()&&q.delete(Te)}),q.size===0){z(w);return}setTimeout(ge,10)}Y.get("KHR_parallel_shader_compile")!==null?ge():setTimeout(ge,10)})};let jn=null;function bi(w){jn&&jn(w)}function Ku(){xs.stop()}function $u(){xs.start()}let xs=new Uf;xs.setAnimationLoop(bi),typeof self<"u"&&xs.setContext(self),this.setAnimationLoop=function(w){jn=w,Z.setAnimationLoop(w),w===null?xs.stop():xs.start()},Z.addEventListener("sessionstart",Ku),Z.addEventListener("sessionend",$u),this.render=function(w,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),Z.enabled===!0&&Z.isPresenting===!0&&(Z.cameraAutoUpdate===!0&&Z.updateCamera(O),O=Z.getCamera()),w.isScene===!0&&w.onBeforeRender(y,w,O,R),p=ke.get(w,x.length),p.init(O),x.push(p),De.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),V.setFromProjectionMatrix(De),be=this.localClippingEnabled,K=te.init(this.clippingPlanes,be),g=re.get(w,_.length),g.init(),_.push(g),Z.enabled===!0&&Z.isPresenting===!0){let ge=y.xr.getDepthSensingMesh();ge!==null&&Vl(ge,O,-1/0,y.sortObjects)}Vl(w,O,0,y.sortObjects),g.finish(),y.sortObjects===!0&&g.sort(ce,pe),se=Z.enabled===!1||Z.isPresenting===!1||Z.hasDepthSensing()===!1,se&&qe.addToRenderList(g,w),this.info.render.frame++,K===!0&&te.beginShadows();let X=p.state.shadowsArray;ve.render(X,w,O),K===!0&&te.endShadows(),this.info.autoReset===!0&&this.info.reset();let q=g.opaque,z=g.transmissive;if(p.setupLights(),O.isArrayCamera){let ge=O.cameras;if(z.length>0)for(let Te=0,Be=ge.length;Te<Be;Te++){let He=ge[Te];ju(q,z,w,He)}se&&qe.render(w);for(let Te=0,Be=ge.length;Te<Be;Te++){let He=ge[Te];Ju(g,w,He,He.viewport)}}else z.length>0&&ju(q,z,w,O),se&&qe.render(w),Ju(g,w,O);R!==null&&(A.updateMultisampleRenderTarget(R),A.updateRenderTargetMipmap(R)),w.isScene===!0&&w.onAfterRender(y,w,O),Rt.resetDefaultState(),b=-1,M=null,x.pop(),x.length>0?(p=x[x.length-1],K===!0&&te.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,_.pop(),_.length>0?g=_[_.length-1]:g=null};function Vl(w,O,X,q){if(w.visible===!1)return;if(w.layers.test(O.layers)){if(w.isGroup)X=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(O);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||V.intersectsSprite(w)){q&&Ve.setFromMatrixPosition(w.matrixWorld).applyMatrix4(De);let Te=Q.update(w),Be=w.material;Be.visible&&g.push(w,Te,Be,X,Ve.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||V.intersectsObject(w))){let Te=Q.update(w),Be=w.material;if(q&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ve.copy(w.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),Ve.copy(Te.boundingSphere.center)),Ve.applyMatrix4(w.matrixWorld).applyMatrix4(De)),Array.isArray(Be)){let He=Te.groups;for(let Ke=0,Qe=He.length;Ke<Qe;Ke++){let Fe=He[Ke],mt=Be[Fe.materialIndex];mt&&mt.visible&&g.push(w,Te,mt,X,Ve.z,Fe)}}else Be.visible&&g.push(w,Te,Be,X,Ve.z,null)}}let ge=w.children;for(let Te=0,Be=ge.length;Te<Be;Te++)Vl(ge[Te],O,X,q)}function Ju(w,O,X,q){let z=w.opaque,ge=w.transmissive,Te=w.transparent;p.setupLightsView(X),K===!0&&te.setGlobalState(y.clippingPlanes,X),q&&ie.viewport(T.copy(q)),z.length>0&&Oo(z,O,X),ge.length>0&&Oo(ge,O,X),Te.length>0&&Oo(Te,O,X),ie.buffers.depth.setTest(!0),ie.buffers.depth.setMask(!0),ie.buffers.color.setMask(!0),ie.setPolygonOffset(!1)}function ju(w,O,X,q){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[q.id]===void 0&&(p.state.transmissionRenderTarget[q.id]=new Gn(1,1,{generateMipmaps:!0,type:Y.has("EXT_color_buffer_half_float")||Y.has("EXT_color_buffer_float")?as:ki,minFilter:Ps,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:dt.workingColorSpace}));let ge=p.state.transmissionRenderTarget[q.id],Te=q.viewport||T;ge.setSize(Te.z,Te.w);let Be=y.getRenderTarget();y.setRenderTarget(ge),y.getClearColor(H),F=y.getClearAlpha(),F<1&&y.setClearColor(16777215,.5),y.clear(),se&&qe.render(X);let He=y.toneMapping;y.toneMapping=ns;let Ke=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),p.setupLightsView(q),K===!0&&te.setGlobalState(y.clippingPlanes,q),Oo(w,X,q),A.updateMultisampleRenderTarget(ge),A.updateRenderTargetMipmap(ge),Y.has("WEBGL_multisampled_render_to_texture")===!1){let Qe=!1;for(let Fe=0,mt=O.length;Fe<mt;Fe++){let Ct=O[Fe],Pt=Ct.object,Cn=Ct.geometry,_t=Ct.material,Oe=Ct.group;if(_t.side===gt&&Pt.layers.test(q.layers)){let Ei=_t.side;_t.side=mn,_t.needsUpdate=!0,Qu(Pt,X,q,Cn,_t,Oe),_t.side=Ei,_t.needsUpdate=!0,Qe=!0}}Qe===!0&&(A.updateMultisampleRenderTarget(ge),A.updateRenderTargetMipmap(ge))}y.setRenderTarget(Be),y.setClearColor(H,F),Ke!==void 0&&(q.viewport=Ke),y.toneMapping=He}function Oo(w,O,X){let q=O.isScene===!0?O.overrideMaterial:null;for(let z=0,ge=w.length;z<ge;z++){let Te=w[z],Be=Te.object,He=Te.geometry,Ke=q===null?Te.material:q,Qe=Te.group;Be.layers.test(X.layers)&&Qu(Be,O,X,He,Ke,Qe)}}function Qu(w,O,X,q,z,ge){w.onBeforeRender(y,O,X,q,z,ge),w.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),z.onBeforeRender(y,O,X,q,w,ge),z.transparent===!0&&z.side===gt&&z.forceSinglePass===!1?(z.side=mn,z.needsUpdate=!0,y.renderBufferDirect(X,O,q,z,w,ge),z.side=ss,z.needsUpdate=!0,y.renderBufferDirect(X,O,q,z,w,ge),z.side=gt):y.renderBufferDirect(X,O,q,z,w,ge),w.onAfterRender(y,O,X,q,z,ge)}function zo(w,O,X){O.isScene!==!0&&(O=ot);let q=me.get(w),z=p.state.lights,ge=p.state.shadowsArray,Te=z.state.version,Be=ee.getParameters(w,z.state,ge,O,X),He=ee.getProgramCacheKey(Be),Ke=q.programs;q.environment=w.isMeshStandardMaterial?O.environment:null,q.fog=O.fog,q.envMap=(w.isMeshStandardMaterial?W:E).get(w.envMap||q.environment),q.envMapRotation=q.environment!==null&&w.envMap===null?O.environmentRotation:w.envMapRotation,Ke===void 0&&(w.addEventListener("dispose",je),Ke=new Map,q.programs=Ke);let Qe=Ke.get(He);if(Qe!==void 0){if(q.currentProgram===Qe&&q.lightsStateVersion===Te)return td(w,Be),Qe}else Be.uniforms=ee.getUniforms(w),w.onBeforeCompile(Be,y),Qe=ee.acquireProgram(Be,He),Ke.set(He,Qe),q.uniforms=Be.uniforms;let Fe=q.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Fe.clippingPlanes=te.uniform),td(w,Be),q.needsLights=x0(w),q.lightsStateVersion=Te,q.needsLights&&(Fe.ambientLightColor.value=z.state.ambient,Fe.lightProbe.value=z.state.probe,Fe.directionalLights.value=z.state.directional,Fe.directionalLightShadows.value=z.state.directionalShadow,Fe.spotLights.value=z.state.spot,Fe.spotLightShadows.value=z.state.spotShadow,Fe.rectAreaLights.value=z.state.rectArea,Fe.ltc_1.value=z.state.rectAreaLTC1,Fe.ltc_2.value=z.state.rectAreaLTC2,Fe.pointLights.value=z.state.point,Fe.pointLightShadows.value=z.state.pointShadow,Fe.hemisphereLights.value=z.state.hemi,Fe.directionalShadowMap.value=z.state.directionalShadowMap,Fe.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Fe.spotShadowMap.value=z.state.spotShadowMap,Fe.spotLightMatrix.value=z.state.spotLightMatrix,Fe.spotLightMap.value=z.state.spotLightMap,Fe.pointShadowMap.value=z.state.pointShadowMap,Fe.pointShadowMatrix.value=z.state.pointShadowMatrix),q.currentProgram=Qe,q.uniformsList=null,Qe}function ed(w){if(w.uniformsList===null){let O=w.currentProgram.getUniforms();w.uniformsList=mr.seqWithValue(O.seq,w.uniforms)}return w.uniformsList}function td(w,O){let X=me.get(w);X.outputColorSpace=O.outputColorSpace,X.batching=O.batching,X.batchingColor=O.batchingColor,X.instancing=O.instancing,X.instancingColor=O.instancingColor,X.instancingMorph=O.instancingMorph,X.skinning=O.skinning,X.morphTargets=O.morphTargets,X.morphNormals=O.morphNormals,X.morphColors=O.morphColors,X.morphTargetsCount=O.morphTargetsCount,X.numClippingPlanes=O.numClippingPlanes,X.numIntersection=O.numClipIntersection,X.vertexAlphas=O.vertexAlphas,X.vertexTangents=O.vertexTangents,X.toneMapping=O.toneMapping}function g0(w,O,X,q,z){O.isScene!==!0&&(O=ot),A.resetTextureUnits();let ge=O.fog,Te=q.isMeshStandardMaterial?O.environment:null,Be=R===null?y.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Rr,He=(q.isMeshStandardMaterial?W:E).get(q.envMap||Te),Ke=q.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Qe=!!X.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),Fe=!!X.morphAttributes.position,mt=!!X.morphAttributes.normal,Ct=!!X.morphAttributes.color,Pt=ns;q.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Pt=y.toneMapping);let Cn=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,_t=Cn!==void 0?Cn.length:0,Oe=me.get(q),Ei=p.state.lights;if(K===!0&&(be===!0||w!==M)){let On=w===M&&q.id===b;te.setState(q,w,On)}let Mt=!1;q.version===Oe.__version?(Oe.needsLights&&Oe.lightsStateVersion!==Ei.state.version||Oe.outputColorSpace!==Be||z.isBatchedMesh&&Oe.batching===!1||!z.isBatchedMesh&&Oe.batching===!0||z.isBatchedMesh&&Oe.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Oe.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Oe.instancing===!1||!z.isInstancedMesh&&Oe.instancing===!0||z.isSkinnedMesh&&Oe.skinning===!1||!z.isSkinnedMesh&&Oe.skinning===!0||z.isInstancedMesh&&Oe.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Oe.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Oe.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Oe.instancingMorph===!1&&z.morphTexture!==null||Oe.envMap!==He||q.fog===!0&&Oe.fog!==ge||Oe.numClippingPlanes!==void 0&&(Oe.numClippingPlanes!==te.numPlanes||Oe.numIntersection!==te.numIntersection)||Oe.vertexAlphas!==Ke||Oe.vertexTangents!==Qe||Oe.morphTargets!==Fe||Oe.morphNormals!==mt||Oe.morphColors!==Ct||Oe.toneMapping!==Pt||Oe.morphTargetsCount!==_t)&&(Mt=!0):(Mt=!0,Oe.__version=q.version);let Qn=Oe.currentProgram;Mt===!0&&(Qn=zo(q,O,z));let Ys=!1,Dn=!1,Wr=!1,It=Qn.getUniforms(),di=Oe.uniforms;if(ie.useProgram(Qn.program)&&(Ys=!0,Dn=!0,Wr=!0),q.id!==b&&(b=q.id,Dn=!0),Ys||M!==w){ie.buffers.depth.getReversed()?(fe.copy(w.projectionMatrix),bm(fe),Em(fe),It.setValue(L,"projectionMatrix",fe)):It.setValue(L,"projectionMatrix",w.projectionMatrix),It.setValue(L,"viewMatrix",w.matrixWorldInverse);let qi=It.map.cameraPosition;qi!==void 0&&qi.setValue(L,Ne.setFromMatrixPosition(w.matrixWorld)),le.logarithmicDepthBuffer&&It.setValue(L,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&It.setValue(L,"isOrthographic",w.isOrthographicCamera===!0),M!==w&&(M=w,Dn=!0,Wr=!0)}if(z.isSkinnedMesh){It.setOptional(L,z,"bindMatrix"),It.setOptional(L,z,"bindMatrixInverse");let On=z.skeleton;On&&(On.boneTexture===null&&On.computeBoneTexture(),It.setValue(L,"boneTexture",On.boneTexture,A))}z.isBatchedMesh&&(It.setOptional(L,z,"batchingTexture"),It.setValue(L,"batchingTexture",z._matricesTexture,A),It.setOptional(L,z,"batchingIdTexture"),It.setValue(L,"batchingIdTexture",z._indirectTexture,A),It.setOptional(L,z,"batchingColorTexture"),z._colorsTexture!==null&&It.setValue(L,"batchingColorTexture",z._colorsTexture,A));let Xr=X.morphAttributes;if((Xr.position!==void 0||Xr.normal!==void 0||Xr.color!==void 0)&&Ye.update(z,X,Qn),(Dn||Oe.receiveShadow!==z.receiveShadow)&&(Oe.receiveShadow=z.receiveShadow,It.setValue(L,"receiveShadow",z.receiveShadow)),q.isMeshGouraudMaterial&&q.envMap!==null&&(di.envMap.value=He,di.flipEnvMap.value=He.isCubeTexture&&He.isRenderTargetTexture===!1?-1:1),q.isMeshStandardMaterial&&q.envMap===null&&O.environment!==null&&(di.envMapIntensity.value=O.environmentIntensity),Dn&&(It.setValue(L,"toneMappingExposure",y.toneMappingExposure),Oe.needsLights&&v0(di,Wr),ge&&q.fog===!0&&ne.refreshFogUniforms(di,ge),ne.refreshMaterialUniforms(di,q,G,j,p.state.transmissionRenderTarget[w.id]),mr.upload(L,ed(Oe),di,A)),q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(mr.upload(L,ed(Oe),di,A),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&It.setValue(L,"center",z.center),It.setValue(L,"modelViewMatrix",z.modelViewMatrix),It.setValue(L,"normalMatrix",z.normalMatrix),It.setValue(L,"modelMatrix",z.matrixWorld),q.isShaderMaterial||q.isRawShaderMaterial){let On=q.uniformsGroups;for(let qi=0,Yi=On.length;qi<Yi;qi++){let nd=On[qi];B.update(nd,Qn),B.bind(nd,Qn)}}return Qn}function v0(w,O){w.ambientLightColor.needsUpdate=O,w.lightProbe.needsUpdate=O,w.directionalLights.needsUpdate=O,w.directionalLightShadows.needsUpdate=O,w.pointLights.needsUpdate=O,w.pointLightShadows.needsUpdate=O,w.spotLights.needsUpdate=O,w.spotLightShadows.needsUpdate=O,w.rectAreaLights.needsUpdate=O,w.hemisphereLights.needsUpdate=O}function x0(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return S},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(w,O,X){me.get(w.texture).__webglTexture=O,me.get(w.depthTexture).__webglTexture=X;let q=me.get(w);q.__hasExternalTextures=!0,q.__autoAllocateDepthBuffer=X===void 0,q.__autoAllocateDepthBuffer||Y.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),q.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,O){let X=me.get(w);X.__webglFramebuffer=O,X.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(w,O=0,X=0){R=w,S=O,P=X;let q=!0,z=null,ge=!1,Te=!1;if(w){let He=me.get(w);if(He.__useDefaultFramebuffer!==void 0)ie.bindFramebuffer(L.FRAMEBUFFER,null),q=!1;else if(He.__webglFramebuffer===void 0)A.setupRenderTarget(w);else if(He.__hasExternalTextures)A.rebindTextures(w,me.get(w.texture).__webglTexture,me.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let Fe=w.depthTexture;if(He.__boundDepthTexture!==Fe){if(Fe!==null&&me.has(Fe)&&(w.width!==Fe.image.width||w.height!==Fe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(w)}}let Ke=w.texture;(Ke.isData3DTexture||Ke.isDataArrayTexture||Ke.isCompressedArrayTexture)&&(Te=!0);let Qe=me.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Qe[O])?z=Qe[O][X]:z=Qe[O],ge=!0):w.samples>0&&A.useMultisampledRTT(w)===!1?z=me.get(w).__webglMultisampledFramebuffer:Array.isArray(Qe)?z=Qe[X]:z=Qe,T.copy(w.viewport),k.copy(w.scissor),U=w.scissorTest}else T.copy(xe).multiplyScalar(G).floor(),k.copy(Ge).multiplyScalar(G).floor(),U=Ze;if(ie.bindFramebuffer(L.FRAMEBUFFER,z)&&q&&ie.drawBuffers(w,z),ie.viewport(T),ie.scissor(k),ie.setScissorTest(U),ge){let He=me.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+O,He.__webglTexture,X)}else if(Te){let He=me.get(w.texture),Ke=O||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,He.__webglTexture,X||0,Ke)}b=-1},this.readRenderTargetPixels=function(w,O,X,q,z,ge,Te){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Be=me.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Te!==void 0&&(Be=Be[Te]),Be){ie.bindFramebuffer(L.FRAMEBUFFER,Be);try{let He=w.texture,Ke=He.format,Qe=He.type;if(!le.textureFormatReadable(Ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!le.textureTypeReadable(Qe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=w.width-q&&X>=0&&X<=w.height-z&&L.readPixels(O,X,q,z,nt.convert(Ke),nt.convert(Qe),ge)}finally{let He=R!==null?me.get(R).__webglFramebuffer:null;ie.bindFramebuffer(L.FRAMEBUFFER,He)}}},this.readRenderTargetPixelsAsync=async function(w,O,X,q,z,ge,Te){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Be=me.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Te!==void 0&&(Be=Be[Te]),Be){let He=w.texture,Ke=He.format,Qe=He.type;if(!le.textureFormatReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!le.textureTypeReadable(Qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=w.width-q&&X>=0&&X<=w.height-z){ie.bindFramebuffer(L.FRAMEBUFFER,Be);let Fe=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Fe),L.bufferData(L.PIXEL_PACK_BUFFER,ge.byteLength,L.STREAM_READ),L.readPixels(O,X,q,z,nt.convert(Ke),nt.convert(Qe),0);let mt=R!==null?me.get(R).__webglFramebuffer:null;ie.bindFramebuffer(L.FRAMEBUFFER,mt);let Ct=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Mm(L,Ct,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Fe),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ge),L.deleteBuffer(Fe),L.deleteSync(Ct),ge}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,O=null,X=0){w.isTexture!==!0&&(eo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,w=arguments[1]);let q=Math.pow(2,-X),z=Math.floor(w.image.width*q),ge=Math.floor(w.image.height*q),Te=O!==null?O.x:0,Be=O!==null?O.y:0;A.setTexture2D(w,0),L.copyTexSubImage2D(L.TEXTURE_2D,X,0,0,Te,Be,z,ge),ie.unbindTexture()},this.copyTextureToTexture=function(w,O,X=null,q=null,z=0){w.isTexture!==!0&&(eo("WebGLRenderer: copyTextureToTexture function signature has changed."),q=arguments[0]||null,w=arguments[1],O=arguments[2],z=arguments[3]||0,X=null);let ge,Te,Be,He,Ke,Qe,Fe,mt,Ct,Pt=w.isCompressedTexture?w.mipmaps[z]:w.image;X!==null?(ge=X.max.x-X.min.x,Te=X.max.y-X.min.y,Be=X.isBox3?X.max.z-X.min.z:1,He=X.min.x,Ke=X.min.y,Qe=X.isBox3?X.min.z:0):(ge=Pt.width,Te=Pt.height,Be=Pt.depth||1,He=0,Ke=0,Qe=0),q!==null?(Fe=q.x,mt=q.y,Ct=q.z):(Fe=0,mt=0,Ct=0);let Cn=nt.convert(O.format),_t=nt.convert(O.type),Oe;O.isData3DTexture?(A.setTexture3D(O,0),Oe=L.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(A.setTexture2DArray(O,0),Oe=L.TEXTURE_2D_ARRAY):(A.setTexture2D(O,0),Oe=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,O.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,O.unpackAlignment);let Ei=L.getParameter(L.UNPACK_ROW_LENGTH),Mt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Qn=L.getParameter(L.UNPACK_SKIP_PIXELS),Ys=L.getParameter(L.UNPACK_SKIP_ROWS),Dn=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,Pt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Pt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,He),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ke),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Qe);let Wr=w.isDataArrayTexture||w.isData3DTexture,It=O.isDataArrayTexture||O.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){let di=me.get(w),Xr=me.get(O),On=me.get(di.__renderTarget),qi=me.get(Xr.__renderTarget);ie.bindFramebuffer(L.READ_FRAMEBUFFER,On.__webglFramebuffer),ie.bindFramebuffer(L.DRAW_FRAMEBUFFER,qi.__webglFramebuffer);for(let Yi=0;Yi<Be;Yi++)Wr&&L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,me.get(w).__webglTexture,z,Qe+Yi),w.isDepthTexture?(It&&L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,me.get(O).__webglTexture,z,Ct+Yi),L.blitFramebuffer(He,Ke,ge,Te,Fe,mt,ge,Te,L.DEPTH_BUFFER_BIT,L.NEAREST)):It?L.copyTexSubImage3D(Oe,z,Fe,mt,Ct+Yi,He,Ke,ge,Te):L.copyTexSubImage2D(Oe,z,Fe,mt,Ct+Yi,He,Ke,ge,Te);ie.bindFramebuffer(L.READ_FRAMEBUFFER,null),ie.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else It?w.isDataTexture||w.isData3DTexture?L.texSubImage3D(Oe,z,Fe,mt,Ct,ge,Te,Be,Cn,_t,Pt.data):O.isCompressedArrayTexture?L.compressedTexSubImage3D(Oe,z,Fe,mt,Ct,ge,Te,Be,Cn,Pt.data):L.texSubImage3D(Oe,z,Fe,mt,Ct,ge,Te,Be,Cn,_t,Pt):w.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,z,Fe,mt,ge,Te,Cn,_t,Pt.data):w.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,z,Fe,mt,Pt.width,Pt.height,Cn,Pt.data):L.texSubImage2D(L.TEXTURE_2D,z,Fe,mt,ge,Te,Cn,_t,Pt);L.pixelStorei(L.UNPACK_ROW_LENGTH,Ei),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Mt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Qn),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ys),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Dn),z===0&&O.generateMipmaps&&L.generateMipmap(Oe),ie.unbindTexture()},this.copyTextureToTexture3D=function(w,O,X=null,q=null,z=0){return w.isTexture!==!0&&(eo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),X=arguments[0]||null,q=arguments[1]||null,w=arguments[2],O=arguments[3],z=arguments[4]||0),eo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,O,X,q,z)},this.initRenderTarget=function(w){me.get(w).__webglFramebuffer===void 0&&A.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?A.setTextureCube(w,0):w.isData3DTexture?A.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?A.setTexture2DArray(w,0):A.setTexture2D(w,0),ie.unbindTexture()},this.resetState=function(){S=0,P=0,R=null,ie.reset(),Rt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ii}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=dt._getDrawingBufferColorSpace(e),t.unpackColorSpace=dt._getUnpackColorSpace()}};var Ua=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Re(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Bi=class extends cn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ln,this.environmentIntensity=1,this.environmentRotation=new ln,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Sh=class extends Pn{constructor(e=null,t=1,n=1,s,r,o,a,l,c=Bn,h=Bn,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var uo=class extends Nt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},lr=new $e,sf=new $e,ca=[],rf=new Ui,v_=new $e,$r=new D,Jr=new Ni,si=class extends D{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new uo(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,v_)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Ui),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,lr),rf.copy(e.boundingBox).applyMatrix4(lr),this.boundingBox.union(rf)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ni),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,lr),Jr.copy(e.boundingSphere).applyMatrix4(lr),this.boundingSphere.union(Jr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if($r.geometry=this.geometry,$r.material=this.material,$r.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Jr.copy(this.boundingSphere),Jr.applyMatrix4(n),e.ray.intersectsSphere(Jr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,lr),sf.multiplyMatrices(n,lr),$r.matrixWorld=sf,$r.raycast(e,ca);for(let o=0,a=ca.length;o<a;o++){let l=ca[o];l.instanceId=r,l.object=this,t.push(l)}ca.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new uo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Sh(new Float32Array(s*this.count),s,this.count,ru,pi));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Th=class extends mi{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new Re(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Na=new C,Ba=new C,of=new $e,jr=new co,ha=new Ni,xc=new C,af=new C,Ah=class extends cn{constructor(e=new vt,t=new Th){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Na.fromBufferAttribute(t,s-1),Ba.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Na.distanceTo(Ba);e.setAttribute("lineDistance",new Xe(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ha.copy(n.boundingSphere),ha.applyMatrix4(s),ha.radius+=r,e.ray.intersectsSphere(ha)===!1)return;of.copy(s).invert(),jr.copy(e.ray).applyMatrix4(of);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=c){let p=h.getX(v),_=h.getX(v+1),x=ua(this,e,jr,l,p,_);x&&t.push(x)}if(this.isLineLoop){let v=h.getX(m-1),g=h.getX(f),p=ua(this,e,jr,l,v,g);p&&t.push(p)}}else{let f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=c){let p=ua(this,e,jr,l,v,v+1);p&&t.push(p)}if(this.isLineLoop){let v=ua(this,e,jr,l,m-1,f);v&&t.push(v)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function ua(i,e,t,n,s,r){let o=i.geometry.attributes.position;if(Na.fromBufferAttribute(o,s),Ba.fromBufferAttribute(o,r),t.distanceSqToSegment(Na,Ba,xc,af)>n)return;xc.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(xc);if(!(l<e.near||l>e.far))return{distance:l,point:af.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}var lf=new C,cf=new C,Ha=class extends Ah{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)lf.fromBufferAttribute(t,s),cf.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+lf.distanceTo(cf);e.setAttribute("lineDistance",new Xe(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Rh=class extends mi{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new Re(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},hf=new $e,Ch=new co,da=new Ni,fa=new C,Fa=class extends cn{constructor(e=new vt,t=new Rh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),da.copy(n.boundingSphere),da.applyMatrix4(s),da.radius+=r,e.ray.intersectsSphere(da)===!1)return;hf.copy(s).invert(),Ch.copy(e.ray).applyMatrix4(hf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let m=d,v=f;m<v;m++){let g=c.getX(m);fa.fromBufferAttribute(u,g),uf(fa,g,l,s,e,t,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let m=d,v=f;m<v;m++)fa.fromBufferAttribute(u,m),uf(fa,m,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function uf(i,e,t,n,s,r,o){let a=Ch.distanceSqToPoint(i);if(a<t){let l=new C;Ch.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Bt=class extends Pn{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Vn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new ue:new C);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new C,s=[],r=[],o=[],a=new C,l=new $e;for(let f=0;f<=e;f++){let m=f/e;s[f]=this.getTangentAt(m,new C)}r[0]=new C,o[0]=new C;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let m=Math.acos($t(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,m))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos($t(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],f*m)),o[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},fo=class extends Vn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new ue){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Ph=class extends fo{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function du(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var pa=new C,yc=new du,_c=new du,Mc=new du,Ih=class extends Vn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new C){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(pa.subVectors(s[0],s[1]).add(s[0]),c=pa);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(pa.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=pa),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),yc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,m,v,g),_c.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,m,v,g),Mc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(yc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),_c.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Mc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(yc.calc(l),_c.calc(l),Mc.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new C().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function df(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function x_(i,e){let t=1-i;return t*t*e}function y_(i,e){return 2*(1-i)*i*e}function __(i,e){return i*i*e}function ro(i,e,t,n){return x_(i,e)+y_(i,t)+__(i,n)}function M_(i,e){let t=1-i;return t*t*t*e}function b_(i,e){let t=1-i;return 3*t*t*i*e}function E_(i,e){return 3*(1-i)*i*i*e}function w_(i,e){return i*i*i*e}function oo(i,e,t,n,s){return M_(i,e)+b_(i,t)+E_(i,n)+w_(i,s)}var Oa=class extends Vn{constructor(e=new ue,t=new ue,n=new ue,s=new ue){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ue){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(oo(e,s.x,r.x,o.x,a.x),oo(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Lh=class extends Vn{constructor(e=new C,t=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new C){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(oo(e,s.x,r.x,o.x,a.x),oo(e,s.y,r.y,o.y,a.y),oo(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},za=class extends Vn{constructor(e=new ue,t=new ue){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ue){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ue){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Dh=class extends Vn{constructor(e=new C,t=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new C){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new C){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ga=class extends Vn{constructor(e=new ue,t=new ue,n=new ue){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ue){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(ro(e,s.x,r.x,o.x),ro(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},kh=class extends Vn{constructor(e=new C,t=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new C){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(ro(e,s.x,r.x,o.x),ro(e,s.y,r.y,o.y),ro(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Va=class extends Vn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ue){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(df(a,l.x,c.x,h.x,u.x),df(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new ue().fromArray(s))}return this}},Uh=Object.freeze({__proto__:null,ArcCurve:Ph,CatmullRomCurve3:Ih,CubicBezierCurve:Oa,CubicBezierCurve3:Lh,EllipseCurve:fo,LineCurve:za,LineCurve3:Dh,QuadraticBezierCurve:Ga,QuadraticBezierCurve3:kh,SplineCurve:Va}),Nh=class extends Vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Uh[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Uh[s.type]().fromJSON(s))}return this}},po=class extends Nh{constructor(e){super(),this.type="Path",this.currentPoint=new ue,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new za(this.currentPoint.clone(),new ue(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new Ga(this.currentPoint.clone(),new ue(e,t),new ue(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new Oa(this.currentPoint.clone(),new ue(e,t),new ue(n,s),new ue(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Va(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new fo(e,t,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},mo=class i extends vt{constructor(e=[new ue(0,-.5),new ue(.5,0),new ue(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=$t(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/t,u=new C,d=new ue,f=new C,m=new C,v=new C,g=0,p=0;for(let _=0;_<=e.length-1;_++)switch(_){case 0:g=e[_+1].x-e[_].x,p=e[_+1].y-e[_].y,f.x=p*1,f.y=-g,f.z=p*0,v.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(v.x,v.y,v.z);break;default:g=e[_+1].x-e[_].x,p=e[_+1].y-e[_].y,f.x=p*1,f.y=-g,f.z=p*0,m.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),l.push(f.x,f.y,f.z),v.copy(m)}for(let _=0;_<=t;_++){let x=n+_*h*s,y=Math.sin(x),I=Math.cos(x);for(let S=0;S<=e.length-1;S++){u.x=e[S].x*y,u.y=e[S].y,u.z=e[S].x*I,o.push(u.x,u.y,u.z),d.x=_/t,d.y=S/(e.length-1),a.push(d.x,d.y);let P=l[3*S+0]*y,R=l[3*S+1],b=l[3*S+0]*I;c.push(P,R,b)}}for(let _=0;_<t;_++)for(let x=0;x<e.length-1;x++){let y=x+_*e.length,I=y,S=y+e.length,P=y+e.length+1,R=y+1;r.push(I,S,R),r.push(P,R,S)}this.setIndex(r),this.setAttribute("position",new Xe(o,3)),this.setAttribute("uv",new Xe(a,2)),this.setAttribute("normal",new Xe(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},Ls=class i extends mo{constructor(e=1,t=1,n=4,s=8){let r=new po;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:s}}static fromJSON(e){return new i(e.radius,e.length,e.capSegments,e.radialSegments)}},un=class i extends vt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],l=[],c=new C,h=new ue;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Xe(o,3)),this.setAttribute("normal",new Xe(a,3)),this.setAttribute("uv",new Xe(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},ze=class i extends vt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,v=[],g=n/2,p=0;_(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new Xe(u,3)),this.setAttribute("normal",new Xe(d,3)),this.setAttribute("uv",new Xe(f,2));function _(){let y=new C,I=new C,S=0,P=(t-e)/n;for(let R=0;R<=r;R++){let b=[],M=R/r,T=M*(t-e)+e;for(let k=0;k<=s;k++){let U=k/s,H=U*l+a,F=Math.sin(H),N=Math.cos(H);I.x=T*F,I.y=-M*n+g,I.z=T*N,u.push(I.x,I.y,I.z),y.set(F,P,N).normalize(),d.push(y.x,y.y,y.z),f.push(U,1-M),b.push(m++)}v.push(b)}for(let R=0;R<s;R++)for(let b=0;b<r;b++){let M=v[b][R],T=v[b+1][R],k=v[b+1][R+1],U=v[b][R+1];(e>0||b!==0)&&(h.push(M,T,U),S+=3),(t>0||b!==r-1)&&(h.push(T,k,U),S+=3)}c.addGroup(p,S,0),p+=S}function x(y){let I=m,S=new ue,P=new C,R=0,b=y===!0?e:t,M=y===!0?1:-1;for(let k=1;k<=s;k++)u.push(0,g*M,0),d.push(0,M,0),f.push(.5,.5),m++;let T=m;for(let k=0;k<=s;k++){let H=k/s*l+a,F=Math.cos(H),N=Math.sin(H);P.x=b*N,P.y=g*M,P.z=b*F,u.push(P.x,P.y,P.z),d.push(0,M,0),S.x=F*.5+.5,S.y=N*.5*M+.5,f.push(S.x,S.y),m++}for(let k=0;k<s;k++){let U=I+k,H=T+k;y===!0?h.push(H,H+1,U):h.push(H+1,H,U),R+=3}c.addGroup(p,R,y===!0?1:2),p+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Hn=class i extends ze{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Bh=class i extends vt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new Xe(r,3)),this.setAttribute("normal",new Xe(r.slice(),3)),this.setAttribute("uv",new Xe(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(_){let x=new C,y=new C,I=new C;for(let S=0;S<t.length;S+=3)f(t[S+0],x),f(t[S+1],y),f(t[S+2],I),l(x,y,I,_)}function l(_,x,y,I){let S=I+1,P=[];for(let R=0;R<=S;R++){P[R]=[];let b=_.clone().lerp(y,R/S),M=x.clone().lerp(y,R/S),T=S-R;for(let k=0;k<=T;k++)k===0&&R===S?P[R][k]=b:P[R][k]=b.clone().lerp(M,k/T)}for(let R=0;R<S;R++)for(let b=0;b<2*(S-R)-1;b++){let M=Math.floor(b/2);b%2===0?(d(P[R][M+1]),d(P[R+1][M]),d(P[R][M])):(d(P[R][M+1]),d(P[R+1][M+1]),d(P[R+1][M]))}}function c(_){let x=new C;for(let y=0;y<r.length;y+=3)x.x=r[y+0],x.y=r[y+1],x.z=r[y+2],x.normalize().multiplyScalar(_),r[y+0]=x.x,r[y+1]=x.y,r[y+2]=x.z}function h(){let _=new C;for(let x=0;x<r.length;x+=3){_.x=r[x+0],_.y=r[x+1],_.z=r[x+2];let y=g(_)/2/Math.PI+.5,I=p(_)/Math.PI+.5;o.push(y,1-I)}m(),u()}function u(){for(let _=0;_<o.length;_+=6){let x=o[_+0],y=o[_+2],I=o[_+4],S=Math.max(x,y,I),P=Math.min(x,y,I);S>.9&&P<.1&&(x<.2&&(o[_+0]+=1),y<.2&&(o[_+2]+=1),I<.2&&(o[_+4]+=1))}}function d(_){r.push(_.x,_.y,_.z)}function f(_,x){let y=_*3;x.x=e[y+0],x.y=e[y+1],x.z=e[y+2]}function m(){let _=new C,x=new C,y=new C,I=new C,S=new ue,P=new ue,R=new ue;for(let b=0,M=0;b<r.length;b+=9,M+=6){_.set(r[b+0],r[b+1],r[b+2]),x.set(r[b+3],r[b+4],r[b+5]),y.set(r[b+6],r[b+7],r[b+8]),S.set(o[M+0],o[M+1]),P.set(o[M+2],o[M+3]),R.set(o[M+4],o[M+5]),I.copy(_).add(x).add(y).divideScalar(3);let T=g(I);v(S,M+0,_,T),v(P,M+2,x,T),v(R,M+4,y,T)}}function v(_,x,y,I){I<0&&_.x===1&&(o[x]=_.x-1),y.x===0&&y.z===0&&(o[x]=I/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function p(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var Wn=class extends po{constructor(e){super(e),this.uuid=Ns(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new po().fromJSON(s))}return this}},S_={triangulate:function(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=Of(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,d,f;if(n&&(r=P_(i,e,r,t)),i.length>80*t){a=c=i[0],l=h=i[1];for(let m=t;m<s;m+=t)u=i[m],d=i[m+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-a,h-l),f=f!==0?32767/f:0}return go(r,o,t,a,l,f,0),o}};function Of(i,e,t,n,s){let r,o;if(s===z_(i,e,t,n)>0)for(r=e;r<t;r+=n)o=ff(r,i[r],i[r+1],o);else for(r=t-n;r>=e;r-=n)o=ff(r,i[r],i[r+1],o);return o&&Ja(o,o.next)&&(xo(o),o=o.next),o}function Ds(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Ja(t,t.next)||Ut(t.prev,t,t.next)===0)){if(xo(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function go(i,e,t,n,s,r,o){if(!i)return;!o&&r&&U_(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?A_(i,n,s,r):T_(i)){e.push(l.i/t|0),e.push(i.i/t|0),e.push(c.i/t|0),xo(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=R_(Ds(i),e,t),go(i,e,t,n,s,r,2)):o===2&&C_(i,e,t,n,s,r):go(Ds(i),e,t,n,s,r,1);break}}}function T_(i){let e=i.prev,t=i,n=i.next;if(Ut(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,d=s>r?s>o?s:o:r>o?r:o,f=a>l?a>c?a:c:l>c?l:c,m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&ur(s,a,r,l,o,c,m.x,m.y)&&Ut(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function A_(i,e,t,n){let s=i.prev,r=i,o=i.next;if(Ut(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,f=a<l?a<c?a:c:l<c?l:c,m=h<u?h<d?h:d:u<d?u:d,v=a>l?a>c?a:c:l>c?l:c,g=h>u?h>d?h:d:u>d?u:d,p=Hh(f,m,e,t,n),_=Hh(v,g,e,t,n),x=i.prevZ,y=i.nextZ;for(;x&&x.z>=p&&y&&y.z<=_;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&ur(a,h,l,u,c,d,x.x,x.y)&&Ut(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==o&&ur(a,h,l,u,c,d,y.x,y.y)&&Ut(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&ur(a,h,l,u,c,d,x.x,x.y)&&Ut(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=_;){if(y.x>=f&&y.x<=v&&y.y>=m&&y.y<=g&&y!==s&&y!==o&&ur(a,h,l,u,c,d,y.x,y.y)&&Ut(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function R_(i,e,t){let n=i;do{let s=n.prev,r=n.next.next;!Ja(s,r)&&zf(s,n,n.next,r)&&vo(s,r)&&vo(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),xo(n),xo(n.next),n=i=r),n=n.next}while(n!==i);return Ds(n)}function C_(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&H_(o,a)){let l=Gf(o,a);o=Ds(o,o.next),l=Ds(l,l.next),go(o,e,t,n,s,r,0),go(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function P_(i,e,t,n){let s=[],r,o,a,l,c;for(r=0,o=e.length;r<o;r++)a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=Of(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(B_(c));for(s.sort(I_),r=0;r<s.length;r++)t=L_(s[r],t);return t}function I_(i,e){return i.x-e.x}function L_(i,e){let t=D_(i,e);if(!t)return e;let n=Gf(t,i);return Ds(n,n.next),Ds(t,t.next)}function D_(i,e){let t=e,n=-1/0,s,r=i.x,o=i.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){let d=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,s=t.x<t.next.x?t:t.next,d===r))return s}t=t.next}while(t!==e);if(!s)return null;let a=s,l=s.x,c=s.y,h=1/0,u;t=s;do r>=t.x&&t.x>=l&&r!==t.x&&ur(o<c?r:n,o,l,c,o<c?n:r,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(r-t.x),vo(t,i)&&(u<h||u===h&&(t.x>s.x||t.x===s.x&&k_(s,t)))&&(s=t,h=u)),t=t.next;while(t!==a);return s}function k_(i,e){return Ut(i.prev,i,e.prev)<0&&Ut(e.next,i,i.next)<0}function U_(i,e,t,n){let s=i;do s.z===0&&(s.z=Hh(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,N_(s)}function N_(i){let e,t,n,s,r,o,a,l,c=1;do{for(t=i,i=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,c*=2}while(o>1);return i}function Hh(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function B_(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function ur(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function H_(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!F_(i,e)&&(vo(i,e)&&vo(e,i)&&O_(i,e)&&(Ut(i.prev,i,e.prev)||Ut(i,e.prev,e))||Ja(i,e)&&Ut(i.prev,i,i.next)>0&&Ut(e.prev,e,e.next)>0)}function Ut(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Ja(i,e){return i.x===e.x&&i.y===e.y}function zf(i,e,t,n){let s=ga(Ut(i,e,t)),r=ga(Ut(i,e,n)),o=ga(Ut(t,n,i)),a=ga(Ut(t,n,e));return!!(s!==r&&o!==a||s===0&&ma(i,t,e)||r===0&&ma(i,n,e)||o===0&&ma(t,i,n)||a===0&&ma(t,e,n))}function ma(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function ga(i){return i>0?1:i<0?-1:0}function F_(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&zf(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function vo(i,e){return Ut(i.prev,i,i.next)<0?Ut(i,e,i.next)>=0&&Ut(i,i.prev,e)>=0:Ut(i,e,i.prev)<0||Ut(i,i.next,e)<0}function O_(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Gf(i,e){let t=new Fh(i.i,i.x,i.y),n=new Fh(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function ff(i,e,t,n){let s=new Fh(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function xo(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Fh(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function z_(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var is=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];pf(e),mf(n,e);let o=e.length;t.forEach(pf);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,mf(n,t[l]);let a=S_.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function pf(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function mf(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var gi=class i extends vt{constructor(e=new Wn([new ue(.5,.5),new ue(-.5,.5),new ue(-.5,-.5),new ue(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new Xe(s,3)),this.setAttribute("uv",new Xe(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,_=t.UVGenerator!==void 0?t.UVGenerator:G_,x,y=!1,I,S,P,R;p&&(x=p.getSpacedPoints(h),y=!0,d=!1,I=p.computeFrenetFrames(h,!1),S=new C,P=new C,R=new C),d||(g=0,f=0,m=0,v=0);let b=a.extractPoints(c),M=b.shape,T=b.holes;if(!is.isClockWise(M)){M=M.reverse();for(let se=0,he=T.length;se<he;se++){let L=T[se];is.isClockWise(L)&&(T[se]=L.reverse())}}let U=is.triangulateShape(M,T),H=M;for(let se=0,he=T.length;se<he;se++){let L=T[se];M=M.concat(L)}function F(se,he,L){return he||console.error("THREE.ExtrudeGeometry: vec does not exist"),se.clone().addScaledVector(he,L)}let N=M.length,j=U.length;function G(se,he,L){let Pe,Y,le,ie=se.x-he.x,Ie=se.y-he.y,me=L.x-se.x,A=L.y-se.y,E=ie*ie+Ie*Ie,W=ie*A-Ie*me;if(Math.abs(W)>Number.EPSILON){let J=Math.sqrt(E),ae=Math.sqrt(me*me+A*A),Q=he.x-Ie/J,ee=he.y+ie/J,ne=L.x-A/ae,re=L.y+me/ae,ke=((ne-Q)*A-(re-ee)*me)/(ie*A-Ie*me);Pe=Q+ie*ke-se.x,Y=ee+Ie*ke-se.y;let te=Pe*Pe+Y*Y;if(te<=2)return new ue(Pe,Y);le=Math.sqrt(te/2)}else{let J=!1;ie>Number.EPSILON?me>Number.EPSILON&&(J=!0):ie<-Number.EPSILON?me<-Number.EPSILON&&(J=!0):Math.sign(Ie)===Math.sign(A)&&(J=!0),J?(Pe=-Ie,Y=ie,le=Math.sqrt(E)):(Pe=ie,Y=Ie,le=Math.sqrt(E/2))}return new ue(Pe/le,Y/le)}let ce=[];for(let se=0,he=H.length,L=he-1,Pe=se+1;se<he;se++,L++,Pe++)L===he&&(L=0),Pe===he&&(Pe=0),ce[se]=G(H[se],H[L],H[Pe]);let pe=[],xe,Ge=ce.concat();for(let se=0,he=T.length;se<he;se++){let L=T[se];xe=[];for(let Pe=0,Y=L.length,le=Y-1,ie=Pe+1;Pe<Y;Pe++,le++,ie++)le===Y&&(le=0),ie===Y&&(ie=0),xe[Pe]=G(L[Pe],L[le],L[ie]);pe.push(xe),Ge=Ge.concat(xe)}for(let se=0;se<g;se++){let he=se/g,L=f*Math.cos(he*Math.PI/2),Pe=m*Math.sin(he*Math.PI/2)+v;for(let Y=0,le=H.length;Y<le;Y++){let ie=F(H[Y],ce[Y],Pe);fe(ie.x,ie.y,-L)}for(let Y=0,le=T.length;Y<le;Y++){let ie=T[Y];xe=pe[Y];for(let Ie=0,me=ie.length;Ie<me;Ie++){let A=F(ie[Ie],xe[Ie],Pe);fe(A.x,A.y,-L)}}}let Ze=m+v;for(let se=0;se<N;se++){let he=d?F(M[se],Ge[se],Ze):M[se];y?(P.copy(I.normals[0]).multiplyScalar(he.x),S.copy(I.binormals[0]).multiplyScalar(he.y),R.copy(x[0]).add(P).add(S),fe(R.x,R.y,R.z)):fe(he.x,he.y,0)}for(let se=1;se<=h;se++)for(let he=0;he<N;he++){let L=d?F(M[he],Ge[he],Ze):M[he];y?(P.copy(I.normals[se]).multiplyScalar(L.x),S.copy(I.binormals[se]).multiplyScalar(L.y),R.copy(x[se]).add(P).add(S),fe(R.x,R.y,R.z)):fe(L.x,L.y,u/h*se)}for(let se=g-1;se>=0;se--){let he=se/g,L=f*Math.cos(he*Math.PI/2),Pe=m*Math.sin(he*Math.PI/2)+v;for(let Y=0,le=H.length;Y<le;Y++){let ie=F(H[Y],ce[Y],Pe);fe(ie.x,ie.y,u+L)}for(let Y=0,le=T.length;Y<le;Y++){let ie=T[Y];xe=pe[Y];for(let Ie=0,me=ie.length;Ie<me;Ie++){let A=F(ie[Ie],xe[Ie],Pe);y?fe(A.x,A.y+x[h-1].y,x[h-1].x+L):fe(A.x,A.y,u+L)}}}V(),K();function V(){let se=s.length/3;if(d){let he=0,L=N*he;for(let Pe=0;Pe<j;Pe++){let Y=U[Pe];De(Y[2]+L,Y[1]+L,Y[0]+L)}he=h+g*2,L=N*he;for(let Pe=0;Pe<j;Pe++){let Y=U[Pe];De(Y[0]+L,Y[1]+L,Y[2]+L)}}else{for(let he=0;he<j;he++){let L=U[he];De(L[2],L[1],L[0])}for(let he=0;he<j;he++){let L=U[he];De(L[0]+N*h,L[1]+N*h,L[2]+N*h)}}n.addGroup(se,s.length/3-se,0)}function K(){let se=s.length/3,he=0;be(H,he),he+=H.length;for(let L=0,Pe=T.length;L<Pe;L++){let Y=T[L];be(Y,he),he+=Y.length}n.addGroup(se,s.length/3-se,1)}function be(se,he){let L=se.length;for(;--L>=0;){let Pe=L,Y=L-1;Y<0&&(Y=se.length-1);for(let le=0,ie=h+g*2;le<ie;le++){let Ie=N*le,me=N*(le+1),A=he+Pe+Ie,E=he+Y+Ie,W=he+Y+me,J=he+Pe+me;Ne(A,E,W,J)}}}function fe(se,he,L){l.push(se),l.push(he),l.push(L)}function De(se,he,L){Ve(se),Ve(he),Ve(L);let Pe=s.length/3,Y=_.generateTopUV(n,s,Pe-3,Pe-2,Pe-1);ot(Y[0]),ot(Y[1]),ot(Y[2])}function Ne(se,he,L,Pe){Ve(se),Ve(he),Ve(Pe),Ve(he),Ve(L),Ve(Pe);let Y=s.length/3,le=_.generateSideWallUV(n,s,Y-6,Y-3,Y-2,Y-1);ot(le[0]),ot(le[1]),ot(le[3]),ot(le[1]),ot(le[2]),ot(le[3])}function Ve(se){s.push(l[se*3+0]),s.push(l[se*3+1]),s.push(l[se*3+2])}function ot(se){r.push(se.x),r.push(se.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return V_(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Uh[s.type]().fromJSON(s)),new i(n,e.options)}},G_={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new ue(r,o),new ue(a,l),new ue(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],m=e[s*3+2],v=e[r*3],g=e[r*3+1],p=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ue(o,1-l),new ue(c,1-u),new ue(d,1-m),new ue(v,1-p)]:[new ue(a,1-l),new ue(h,1-u),new ue(f,1-m),new ue(g,1-p)]}};function V_(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var yo=class i extends Bh{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var Wa=class i extends vt{constructor(e=new Wn([new ue(0,.5),new ue(-.5,-.5),new ue(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],o=[],a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new Xe(s,3)),this.setAttribute("normal",new Xe(r,3)),this.setAttribute("uv",new Xe(o,2));function c(h){let u=s.length/3,d=h.extractPoints(t),f=d.shape,m=d.holes;is.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){let _=m[g];is.isClockWise(_)===!0&&(m[g]=_.reverse())}let v=is.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){let _=m[g];f=f.concat(_)}for(let g=0,p=f.length;g<p;g++){let _=f[g];s.push(_.x,_.y,0),r.push(0,0,1),o.push(_.x,_.y)}for(let g=0,p=v.length;g<p;g++){let _=v[g],x=_[0]+u,y=_[1]+u,I=_[2]+u;n.push(x,y,I),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return W_(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let o=t[e.shapes[s]];n.push(o)}return new i(n,e.curveSegments)}};function W_(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var lt=class i extends vt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new C,d=new C,f=[],m=[],v=[],g=[];for(let p=0;p<=n;p++){let _=[],x=p/n,y=0;p===0&&o===0?y=.5/t:p===n&&l===Math.PI&&(y=-.5/t);for(let I=0;I<=t;I++){let S=I/t;u.x=-e*Math.cos(s+S*r)*Math.sin(o+x*a),u.y=e*Math.cos(o+x*a),u.z=e*Math.sin(s+S*r)*Math.sin(o+x*a),m.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),g.push(S+y,1-x),_.push(c++)}h.push(_)}for(let p=0;p<n;p++)for(let _=0;_<t;_++){let x=h[p][_+1],y=h[p][_],I=h[p+1][_],S=h[p+1][_+1];(p!==0||o>0)&&f.push(x,y,S),(p!==n-1||l<Math.PI)&&f.push(y,I,S)}this.setIndex(f),this.setAttribute("position",new Xe(m,3)),this.setAttribute("normal",new Xe(v,3)),this.setAttribute("uv",new Xe(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var gn=class i extends vt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new C,u=new C,d=new C;for(let f=0;f<=n;f++)for(let m=0;m<=s;m++){let v=m/s*r,g=f/n*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(v),u.y=(e+t*Math.cos(g))*Math.sin(v),u.z=t*Math.sin(g),a.push(u.x,u.y,u.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=s;m++){let v=(s+1)*f+m-1,g=(s+1)*(f-1)+m-1,p=(s+1)*(f-1)+m,_=(s+1)*f+m;o.push(v,g,_),o.push(g,p,_)}this.setIndex(o),this.setAttribute("position",new Xe(a,3)),this.setAttribute("normal",new Xe(l,3)),this.setAttribute("uv",new Xe(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var ft=class extends mi{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Re(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Re(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=cu,this.normalScale=new ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ri=class extends ft{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ue(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return $t(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Re(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Re(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Re(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var Xa=class extends mi{static get type(){return"MeshLambertMaterial"}constructor(e){super(),this.isMeshLambertMaterial=!0,this.color=new Re(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Re(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=cu,this.normalScale=new ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ln,this.combine=eu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function va(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function X_(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var wr=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Oh=class extends wr{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:od,endingEnd:od}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case ad:r=e,a=2*t-n;break;case ld:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ad:o=e,l=2*n-t;break;case ld:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),v=m*m,g=v*m,p=-d*g+2*d*v-d*m,_=(1+d)*g+(-1.5-2*d)*v+(-.5+d)*m+1,x=(-1-f)*g+(1.5+f)*v+.5*m,y=f*g-f*v;for(let I=0;I!==a;++I)r[I]=p*o[h+I]+_*o[c+I]+x*o[l+I]+y*o[u+I];return r}},zh=class extends wr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},Gh=class extends wr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},oi=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=va(t,this.TimeBufferType),this.values=va(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:va(e.times,Array),values:va(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Gh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new zh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Oh(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Ea:t=this.InterpolantFactoryMethodDiscrete;break;case lh:t=this.InterpolantFactoryMethodLinear;break;case Xl:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ea;case this.InterpolantFactoryMethodLinear:return lh;case this.InterpolantFactoryMethodSmooth:return Xl}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&X_(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Xl,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let v=t[u+m];if(v!==t[d+m]||v!==t[f+m]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};oi.prototype.TimeBufferType=Float32Array;oi.prototype.ValueBufferType=Float32Array;oi.prototype.DefaultInterpolation=lh;var ks=class extends oi{constructor(e,t,n){super(e,t,n)}};ks.prototype.ValueTypeName="bool";ks.prototype.ValueBufferType=Array;ks.prototype.DefaultInterpolation=Ea;ks.prototype.InterpolantFactoryMethodLinear=void 0;ks.prototype.InterpolantFactoryMethodSmooth=void 0;var Vh=class extends oi{};Vh.prototype.ValueTypeName="color";var Wh=class extends oi{};Wh.prototype.ValueTypeName="number";var Xh=class extends wr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)qt.slerpFlat(r,0,o,c-a,o,c,l);return r}},qa=class extends oi{InterpolantFactoryMethodLinear(e){return new Xh(this.times,this.values,this.getValueSize(),e)}};qa.prototype.ValueTypeName="quaternion";qa.prototype.InterpolantFactoryMethodSmooth=void 0;var Us=class extends oi{constructor(e,t,n){super(e,t,n)}};Us.prototype.ValueTypeName="string";Us.prototype.ValueBufferType=Array;Us.prototype.DefaultInterpolation=Ea;Us.prototype.InterpolantFactoryMethodLinear=void 0;Us.prototype.InterpolantFactoryMethodSmooth=void 0;var qh=class extends oi{};qh.prototype.ValueTypeName="vector";var Yh=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null}}},q_=new Yh,Zh=class{constructor(e){this.manager=e!==void 0?e:q_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};Zh.DEFAULT_MATERIAL_NAME="__DEFAULT";var _o=class extends cn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Re(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},Sr=class extends _o{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(cn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Re(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},bc=new $e,gf=new C,vf=new C,Ya=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ue(512,512),this.map=null,this.mapPass=null,this.matrix=new $e,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ho,this._frameExtents=new ue(1,1),this._viewportCount=1,this._viewports=[new Tt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;gf.setFromMatrixPosition(e.matrixWorld),t.position.copy(gf),vf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(vf),t.updateMatrixWorld(),bc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(bc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var xf=new $e,Qr=new C,Ec=new C,Kh=class extends Ya{constructor(){super(new Jt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ue(4,2),this._viewportCount=6,this._viewports=[new Tt(2,1,1,1),new Tt(0,1,1,1),new Tt(3,1,1,1),new Tt(1,1,1,1),new Tt(3,0,1,1),new Tt(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Qr.setFromMatrixPosition(e.matrixWorld),n.position.copy(Qr),Ec.copy(n.position),Ec.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Ec),n.updateMatrixWorld(),s.makeTranslation(-Qr.x,-Qr.y,-Qr.z),xf.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(xf)}},Tr=class extends _o{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Kh}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},$h=class extends Ya{constructor(){super(new br(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ar=class extends _o{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(cn.DEFAULT_UP),this.updateMatrix(),this.target=new cn,this.shadow=new $h}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var fu="\\[\\]\\.:\\/",Y_=new RegExp("["+fu+"]","g"),pu="[^"+fu+"]",Z_="[^"+fu.replace("\\.","")+"]",K_=/((?:WC+[\/:])*)/.source.replace("WC",pu),$_=/(WCOD+)?/.source.replace("WCOD",Z_),J_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",pu),j_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",pu),Q_=new RegExp("^"+K_+$_+J_+j_+"$"),e1=["material","materials","bones","map"],Jh=class{constructor(e,t,n){let s=n||Lt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Lt=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Y_,"")}static parseTrackName(e){let t=Q_.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);e1.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Lt.Composite=Jh;Lt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Lt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Lt.prototype.GetterByBindingType=[Lt.prototype._getValue_direct,Lt.prototype._getValue_array,Lt.prototype._getValue_arrayElement,Lt.prototype._getValue_toArray];Lt.prototype.SetterByBindingTypeAndVersioning=[[Lt.prototype._setValue_direct,Lt.prototype._setValue_direct_setNeedsUpdate,Lt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_array,Lt.prototype._setValue_array_setNeedsUpdate,Lt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_arrayElement,Lt.prototype._setValue_arrayElement_setNeedsUpdate,Lt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Lt.prototype._setValue_fromArray,Lt.prototype._setValue_fromArray_setNeedsUpdate,Lt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var rM=new Float32Array(1);typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:jh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=jh);var Hi={uCurve:{value:new ue(0,0)}},t1=`
vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
  mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
  mvPosition = instanceMatrix * mvPosition;
#endif
vec4 cwWorld = modelMatrix * mvPosition;
float cwD = cwWorld.z;
float cwB = cwD * cwD / (1.0 + abs(cwD) * CURVE_K);
cwWorld.x += uCurve.x * cwB;
cwWorld.y += uCurve.y * cwB;
mvPosition = viewMatrix * cwWorld;
gl_Position = projectionMatrix * mvPosition;
`,mu=1/700,Vf="#define CURVE_K "+mu.toFixed(8)+`
`,ja=Vf+`
uniform vec2 uCurve;
vec4 curveWorld(vec4 w) {
  float d = w.z;
  float b = d * d / (1.0 + abs(d) * CURVE_K);
  w.x += uCurve.x * b;
  w.y += uCurve.y * b;
  return w;
}
`;function vi(i){return i.onBeforeCompile=e=>{e.uniforms.uCurve=Hi.uCurve,e.vertexShader=Vf+`uniform vec2 uCurve;
`+e.vertexShader.replace("#include <project_vertex>",t1)},i.customProgramCacheKey=()=>"curved-world",i}var de={std(i){return vi(new ft(i))},lambert(i){return vi(new Xa(i))},basic(i){return vi(new hn(i))},phys(i){return vi(new ri(i))}};var We=(i,e,t)=>i<e?e:i>t?t:i,at=(i,e,t)=>i+(e-i)*t;var ls=(i,e,t)=>{let n=We((t-i)/(e-i),0,1);return n*n*(3-2*n)},_e=(i=0,e=1)=>i+Math.random()*(e-i),Ir=(i,e)=>Math.floor(_e(i,e+1)),Je=i=>i[Math.floor(Math.random()*i.length)],pt=i=>Math.random()<i,In=(i,e,t,n)=>at(i,e,1-Math.exp(-t*n)),xu=i=>i<.5?2*i*i:1-Math.pow(-2*i+2,2)/2;function Mo(i,e){let t=0;for(let s of i)t+=e(s);let n=Math.random()*t;for(let s of i)if(n-=e(s),n<=0)return s;return i[i.length-1]}function Wf(i){let e=i.slice();for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}var gu=new Map;function Qa(i,e){let t=i+":"+e;return gu.has(t)||gu.set(t,new Intl.NumberFormat("de-DE",{minimumFractionDigits:i,maximumFractionDigits:e})),gu.get(t)}var tn=(i,e=0)=>Qa(e,e).format(i),xi=(i,e=2)=>Qa(e,e).format(i/1e3)+" km",Xf=(i,e=0)=>Qa(e,e).format(i)+" \u20AC",Yt=i=>Qa(2,2).format(i)+" \u20AC";function Lr(i){let e=Math.floor(i)%1440,t=Math.floor(e/60),n=e%60;return String(t).padStart(2,"0")+":"+String(n).padStart(2,"0")}function bo(i){let e=Math.max(0,Math.round(i));return Math.floor(e/60)+":"+String(e%60).padStart(2,"0")}function Ln(i){let e=i>>>0;return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function vu(i,e=0){let t=Math.floor(i),n=i-t,s=o=>{let a=Math.sin((o+e*101.3)*127.1)*43758.5453;return a-Math.floor(a)},r=n*n*(3-2*n);return at(s(t),s(t+1),r)*2-1}function cs(i,e=0){return vu(i,e)*.6+vu(i*2.13,e+7)*.3+vu(i*4.7,e+13)*.1}var Yf=8;function Zf(i){Yf=i}function vn(i,e){let t=document.createElement("canvas");return t.width=i,t.height=e,t}function bn(i,{repeat:e=!1,srgb:t=!0,aniso:n=!0}={}){let s=new Bt(i);return t&&(s.colorSpace=ht),e&&(s.wrapS=s.wrapT=Di),n&&(s.anisotropy=Yf),s.needsUpdate=!0,s}function _u(i,e,t,n,s,r=1,o=1){let a=Ln(r),l=i.getImageData(0,0,e,t),c=l.data;for(let h=0;h<t;h+=o)for(let u=0;u<e;u+=o){let d=(a()-.5)*s;for(let f=0;f<o&&h+f<t;f++)for(let m=0;m<o&&u+m<e;m++){let v=((h+f)*e+(u+m))*4;c[v]=n[0]+d,c[v+1]=n[1]+d,c[v+2]=n[2]+d,c[v+3]=255}}i.putImageData(l,0,0)}var Ce={laneWidth:3.75,lanes:4,left:-8.25,right:10.5,width:18.75,texLength:36,laneCenter:i=>-5.625+i*3.75};function Kf(){let t=vn(512,1024),n=t.getContext("2d");_u(n,512,1024,[88,89,92],26,7,1);let s=c=>(c-Ce.left)/Ce.width*512,r=c=>c/Ce.texLength*1024,o=Ln(42);for(let c=0;c<18;c++){let h=o()<.5?64:112;n.fillStyle=`rgba(${h},${h},${h+4},${.1+o()*.1})`;let u=o()*512,d=o()*1024;n.fillRect(u,d,20+o()*90,30+o()*160)}for(let c=0;c<4;c++){let h=Ce.laneCenter(c);for(let u of[-.85,.85]){let d=n.createLinearGradient(s(h+u-.4),0,s(h+u+.4),0);d.addColorStop(0,"rgba(40,40,44,0)"),d.addColorStop(.5,"rgba(40,40,44,0.32)"),d.addColorStop(1,"rgba(40,40,44,0)"),n.fillStyle=d,n.fillRect(s(h+u-.4),0,s(h+u+.4)-s(h+u-.4),1024)}}n.fillStyle="rgba(140,140,140,0.08)",n.fillRect(s(7.5),0,s(Ce.right)-s(7.5),1024);let a="#eceae2";n.fillStyle=a;for(let c=1;c<4;c++){let h=-7.5+c*3.75;for(let u=0;u<Ce.texLength;u+=18)n.fillRect(s(h-.075),r(u),s(h+.075)-s(h-.075),r(6))}n.fillRect(s(-7.5-.3),0,s(-7.5)-s(-7.8),1024),n.fillRect(s(7.5),0,s(7.8)-s(7.5),1024),n.fillRect(s(Ce.right-.35),0,s(Ce.right-.15)-s(Ce.right-.35),1024),n.globalAlpha=.25,$f(n,512,1024,3e3,"rgba(70,70,74,1)",13),n.globalAlpha=1;let l=bn(t,{repeat:!0});return l.repeat.set(1,1),l}function $f(i,e,t,n,s,r){let o=Ln(r);i.fillStyle=s;for(let a=0;a<n;a++)i.fillRect(o()*e,o()*t,1+o()*2,1+o()*2)}function Jf(){let e=vn(1024,1024),t=e.getContext("2d"),n=Ln(99);t.fillStyle="#5f8a3a",t.fillRect(0,0,1024,1024);let s=["#6a9a3c","#7fae45","#5a8434","#c9b24a","#e1cf3a","#8a9a4a","#6f8f3c","#a08a52","#b6a35a","#4f7a30"],r=0;for(;r<1024;){let o=60+n()*180,a=0;for(;a<1024;){let l=80+n()*260;t.fillStyle=s[Math.floor(n()*s.length)],t.fillRect(a,r,l,o),t.strokeStyle="rgba(0,0,0,0.06)",t.lineWidth=2;let c=n()<.5;for(let h=0;h<(c?l:o);h+=7)t.beginPath(),c?(t.moveTo(a+h,r),t.lineTo(a+h,r+o)):(t.moveTo(a,r+h),t.lineTo(a+l,r+h)),t.stroke();a+=l}r+=o}t.strokeStyle="rgba(190,175,140,0.6)",t.lineWidth=5;for(let o=0;o<4;o++)t.beginPath(),t.moveTo(n()*1024,0),t.lineTo(n()*1024,1024),t.stroke();return t.globalAlpha=.18,$f(t,1024,1024,2e4,"rgba(30,50,20,1)",5),t.globalAlpha=1,bn(e,{repeat:!0})}function jf(){let e=vn(256,256),t=e.getContext("2d");return _u(t,256,256,[92,128,58],34,3,2),bn(e,{repeat:!0})}function Qf(){let i=vn(64,64),e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,64);return t.addColorStop(0,"#c9ccd0"),t.addColorStop(.18,"#8d9296"),t.addColorStop(.35,"#dfe2e5"),t.addColorStop(.5,"#9aa0a5"),t.addColorStop(.65,"#e2e4e6"),t.addColorStop(.82,"#8b9094"),t.addColorStop(1,"#bfc3c7"),e.fillStyle=t,e.fillRect(0,0,64,64),e.fillStyle="rgba(60,60,60,0.5)",e.fillRect(30,26,4,12),bn(i,{repeat:!0})}var yu=new Map;function el(i){if(yu.has(i))return yu.get(i);let e=vn(256,56),t=e.getContext("2d");t.fillStyle="#f5f5f0",t.fillRect(0,0,256,56),t.strokeStyle="#111",t.lineWidth=3,t.strokeRect(2,2,252,52),t.fillStyle="#1d3f9a",t.fillRect(3,3,26,50),t.fillStyle="#ffd400",t.beginPath(),t.arc(16,18,7,0,Math.PI*2),t.setLineDash([2,2]),t.strokeStyle="#ffd400",t.lineWidth=2,t.stroke(),t.setLineDash([]),t.fillStyle="#fff",t.font="bold 15px Arial",t.textAlign="center",t.fillText("D",16,47),t.fillStyle="#111",t.font='bold 38px "DIN Alternate", "Arial Narrow", Arial, sans-serif',t.textBaseline="middle",t.fillText(i,142,30);let n=bn(e);return yu.set(i,n),n}function Dr({w:i=512,h:e=512,bg:t=null,color:n="#f4f4f4"}={}){let s=vn(i,e),r=s.getContext("2d");t&&(r.fillStyle=t,r.fillRect(0,0,i,e)),r.fillStyle=n;let o=e*.5,a=[[.18,.1,.12],[.29,.07,.2],[.37,.06,.28],[.44,.08,.36],[.53,.06,.3],[.6,.07,.22],[.68,.06,.26],[.75,.08,.15]];for(let[c,h,u]of a)r.fillRect(i*c,o-e*u,i*h,e*u);return r.fillRect(i*.39,o-e*.36,i*.012,e*.08),r.fillRect(i*.15,o,i*.7,e*.025),r.font=`900 ${Math.round(e*.3)}px "Arial Black", Impact, sans-serif`,r.textAlign="center",r.textBaseline="top",r.fillText("LIVE",i/2,o+e*.05),bn(s)}function ep(){let i=vn(1024,64),e=i.getContext("2d");e.fillStyle="#3b2c22",e.fillRect(0,0,1024,64);let t=Ln(5);for(let n=0;n<90;n++){e.strokeStyle=`rgba(${20+t()*40},${15+t()*25},${10+t()*15},${.3+t()*.4})`,e.lineWidth=1+t()*2,e.beginPath();let s=t()*64;e.moveTo(0,s);for(let r=0;r<=1024;r+=64)e.lineTo(r,s+Math.sin(r*.01+n)*3+(t()-.5)*2);e.stroke()}return bn(i,{repeat:!0})}function tl(i=1){let t=vn(128,128),n=t.getContext("2d");return _u(n,128,128,[200,200,200],70,i,1),bn(t,{repeat:!0,srgb:!1})}function tp(){let e=vn(256,256),t=e.getContext("2d");t.fillStyle="#1b1c1e",t.fillRect(0,0,256,256);let n=256/2,s=t.createRadialGradient(n,n,10,n,n,n);s.addColorStop(0,"#9da2a7"),s.addColorStop(.75,"#7c8186"),s.addColorStop(1,"#4b4f53"),t.fillStyle=s,t.beginPath(),t.arc(n,n,n*.92,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(30,30,30,0.6)",t.lineWidth=6;for(let r=0;r<5;r++){let o=r/5*Math.PI*2;t.beginPath(),t.moveTo(n+Math.cos(o)*30,n+Math.sin(o)*30),t.quadraticCurveTo(n+Math.cos(o+.5)*80,n+Math.sin(o+.5)*80,n+Math.cos(o+.9)*112,n+Math.sin(o+.9)*112),t.stroke()}return t.fillStyle="#2a2c2e",t.beginPath(),t.arc(n,n,20,0,Math.PI*2),t.fill(),bn(e)}function nl(){let e=vn(64,64),t=e.getContext("2d"),n=t.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.5,"rgba(255,255,255,0.4)"),n.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=n,t.fillRect(0,0,64,64),bn(e,{aniso:!1})}function wo(i,{w:e=512,h:t=256,bg:n="#1452a8",fg:s="#ffffff",border:r=!0,arrows:o=null}={}){let a=vn(e,t),l=a.getContext("2d");l.fillStyle=n,Ht(l,0,0,e,t,18),l.fill(),r&&(l.strokeStyle=s,l.lineWidth=7,Ht(l,10,10,e-20,t-20,12),l.stroke()),l.fillStyle=s,l.textBaseline="middle";let c=i.length,h=(t-40)/Math.max(1,c);return i.forEach((u,d)=>{let f=20+h*(d+.5),m=Math.min(h*.62,64);l.font=`bold ${m}px "DIN Alternate", "Arial Narrow", Arial, sans-serif`,typeof u=="string"?(l.textAlign="left",qf(l,u,34,f,e-68)):(l.textAlign="left",qf(l,u.left,34,f,e*.68),u.right&&(l.textAlign="right",l.fillText(u.right,e-34,f)))}),o&&(l.strokeStyle=s,l.lineWidth=9,o.forEach(u=>{let d=e*u;l.beginPath(),l.moveTo(d,t-26),l.lineTo(d,t-70),l.stroke(),l.beginPath(),l.moveTo(d-14,t-58),l.lineTo(d,t-76),l.lineTo(d+14,t-58),l.stroke()})),bn(a)}function qf(i,e,t,n,s){let r=parseFloat(i.font.match(/(\d+(\.\d+)?)px/)[1]);for(;i.measureText(e).width>s&&r>12;)r-=2,i.font=i.font.replace(/\d+(\.\d+)?px/,r+"px");i.fillText(e,t,n)}function Ht(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}function np(i,e){let s=vn(512,320),r=s.getContext("2d");return r.fillStyle="#6b3d22",Ht(r,0,0,512,320,16),r.fill(),r.strokeStyle="#fff",r.lineWidth=6,Ht(r,10,10,492,300,10),r.stroke(),r.fillStyle="#fff",r.textAlign="center",r.textBaseline="middle",r.font="bold 44px Arial, sans-serif",Eo(r,i,512/2,320*.42,452),r.font="30px Arial, sans-serif",Eo(r,e,512/2,320*.72,452),bn(s)}function Eo(i,e,t,n,s){let r=parseFloat(i.font.match(/(\d+(\.\d+)?)px/)[1]);for(;i.measureText(e).width>s&&r>12;)r-=2,i.font=i.font.replace(/\d+(\.\d+)?px/,r+"px");i.fillText(e,t,n)}function ip(i){let t=vn(256,256),n=t.getContext("2d");if(n.clearRect(0,0,256,256),i==="ende"){n.fillStyle="#fff",n.beginPath(),n.arc(128,128,120,0,Math.PI*2),n.fill(),n.strokeStyle="#222",n.lineWidth=4,n.stroke(),n.save(),n.beginPath(),n.arc(128,128,116,0,Math.PI*2),n.clip(),n.strokeStyle="#333",n.lineWidth=8;for(let s=-5;s<=5;s++)n.beginPath(),n.moveTo(40+s*14,236),n.lineTo(236+s*14,40),n.stroke();n.restore()}else n.fillStyle="#d4141b",n.beginPath(),n.arc(128,128,122,0,Math.PI*2),n.fill(),n.fillStyle="#fff",n.beginPath(),n.arc(128,128,92,0,Math.PI*2),n.fill(),n.fillStyle="#111",n.font='bold 92px "DIN Alternate", Arial, sans-serif',n.textAlign="center",n.textBaseline="middle",n.fillText(String(i),128,134);return bn(t)}function sp(i,e,t="#f2f2f2",n="#c8102e"){let o=vn(1024,256),a=o.getContext("2d");a.fillStyle=t,a.fillRect(0,0,1024,256);for(let l=0;l<1024;l+=64)a.fillStyle="rgba(0,0,0,0.05)",a.fillRect(l,0,6,256);return a.fillStyle=n,a.fillRect(0,222,1024,20),a.fillStyle=n,a.font='italic 900 92px "Arial Black", Arial, sans-serif',a.textAlign="center",a.textBaseline="middle",Eo(a,i,1024/2,256*.4,944),a.fillStyle="#333",a.font="bold 34px Arial, sans-serif",Eo(a,e,1024/2,256*.72,904),bn(o)}function rp(i="Abstand halten!"){let n=vn(256,256),s=n.getContext("2d");s.fillStyle="#e9e9e4",s.fillRect(0,0,256,256),s.fillStyle="#c9c9c4",s.fillRect(256/2-2,0,4,256),s.strokeStyle="#9a9a96",s.lineWidth=6,s.strokeRect(6,6,244,244),s.fillStyle="#333",s.font="bold 22px Arial, sans-serif",s.textAlign="center",Eo(s,i,256/2,256*.3,226);for(let r=0;r<256;r+=32)s.fillStyle=r/32%2?"#d01818":"#ffffff",s.fillRect(r,230,32,18);return bn(n)}function op(){let e=vn(64,64),t=e.getContext("2d"),n=t.createImageData(64,64);for(let s=0;s<64;s++)for(let r=0;r<64;r++){let o=(r-32+.5)/32,a=(s-64/2+.5)/(64/2),l=o*o+a*a,c=(s*64+r)*4;if(l<1){let h=Math.sqrt(1-l);n.data[c]=128+o*127*(1-h*.3),n.data[c+1]=128+a*127*(1-h*.3),n.data[c+2]=255*Math.min(1,h*1.6),n.data[c+3]=255*Math.min(1,(1-l)*4)}else n.data[c+3]=0}return t.putImageData(n,0,0),e}var hs=-9,ai=i=>2*hs-i,Mu=140,ap=1700;function n1(i=Mu,e=ap){let t=[],n=i;for(;n>-e;)t.push(n),n-=2+Math.abs(n)*.018;return t.push(-e),t}var i1=n1();function So(i,e=i1){let t=[],n=[],s=[],r=0;for(let a of i){let{a:l,b:c,uv:h}=a;for(let u=0;u<e.length;u++){let d=e[u];t.push(l[0],l[1],d,c[0],c[1],d);let f=h(l[0],l[1],d,0),m=h(c[0],c[1],d,1);n.push(f[0],f[1],m[0],m[1])}for(let u=0;u<e.length-1;u++){let d=r+u*2;a.flip?s.push(d,d+2,d+1,d+1,d+2,d+3):s.push(d,d+1,d+2,d+1,d+3,d+2)}r+=e.length*2}let o=new vt;return o.setAttribute("position",new Xe(t,3)),o.setAttribute("uv",new Xe(n,2)),o.setIndex(s),o.computeVertexNormals(),o}var il=class{constructor(e){this.group=new ye,this.group.name="Road",e.add(this.group),this.s=0,this.wet=0,this.roadTex=Kf(),this.roadMat=de.std({map:this.roadTex,roughness:.88,metalness:0,envMapIntensity:.6});let t=Ce.texLength,n=(N,j,G)=>[(N-Ce.left)/Ce.width,-G/t],s=(N,j,G)=>[(ai(N)-Ce.left)/Ce.width,-G/t],r=So([{a:[Ce.left,0],b:[Ce.right,0],uv:n},{a:[ai(Ce.right),0],b:[ai(Ce.left),0],uv:s}]);this.road=new D(r,this.roadMat),this.road.receiveShadow=!0,this.road.frustumCulled=!1,this.group.add(this.road),this.grassTex=jf(),this.grassTex.repeat.set(1,1),this.grassMat=de.lambert({map:this.grassTex});let o=(N,j,G)=>[N/6,-G/6],a=So([{a:[Ce.right,0],b:[Ce.right+3.2,.15],uv:o},{a:[Ce.right+3.2,.15],b:[36,.25],uv:o},{a:[ai(Ce.left),0],b:[Ce.left,0],uv:o},{a:[-52,.25],b:[ai(Ce.right)-3.2,.15],uv:o},{a:[ai(Ce.right)-3.2,.15],b:[ai(Ce.right),0],uv:o}]);this.verge=new D(a,this.grassMat),this.verge.receiveShadow=!0,this.verge.frustumCulled=!1,this.group.add(this.verge),this.fieldTex=Jf(),this.fieldMat=de.lambert({map:this.fieldTex});let l=(N,j,G)=>[N/160,-G/160],c=So([{a:[36,.25],b:[420,.25],uv:l},{a:[420,.25],b:[2600,-6],uv:l},{a:[-420,.25],b:[-52,.25],uv:l},{a:[-2600,-6],b:[-420,.25],uv:l}]);this.ground=new D(c,this.fieldMat),this.ground.receiveShadow=!0,this.ground.frustumCulled=!1,this.group.add(this.ground),this.railTex=Qf(),this.railMat=de.std({map:this.railTex,metalness:.75,roughness:.38,envMapIntensity:.9,side:gt});let h=(N,j,G,ce)=>[-G/4,ce],u=[],d=(N,j)=>{u.push({a:[N,.52],b:[N,.84],uv:h,flip:j>0}),u.push({a:[N-.08*j,.84],b:[N,.84+.01],uv:h,flip:j<0})};d(hs+.16,1),d(hs-.16,-1),d(Ce.right+.55,-1),d(ai(Ce.right)-.55,1),this.rails=new D(So(u),this.railMat),this.rails.castShadow=!1,this.rails.receiveShadow=!0,this.rails.frustumCulled=!1,this.group.add(this.rails);let f=new Ue(.1,.8,.07);f.translate(0,.4,0);let m=de.std({color:9343896,metalness:.6,roughness:.5});this.postSpacing=2;let v=[hs,Ce.right+.72,ai(Ce.right)-.72],g=Math.floor(700/this.postSpacing);this.posts=new si(f,m,g*v.length);let p=new $e,_=0;for(let N of v)for(let j=0;j<g;j++)p.makeTranslation(N,0,Mu*.5-j*this.postSpacing),this.posts.setMatrixAt(_++,p);this.posts.frustumCulled=!1,this.posts.castShadow=!0,this.group.add(this.posts),this.delinSpacing=50;let x=new ye,y=new Ue(.12,1,.12);y.translate(0,.5,0);let I=new Ue(.125,.25,.125);I.translate(0,.82,0);let S=new tt(.05,.12);S.translate(0,.82,.064);let P=Math.ceil(ap*.6/this.delinSpacing),R=de.std({color:15921902,roughness:.6}),b=de.std({color:1118481,roughness:.6}),M=de.std({color:16752672,emissive:16742912,emissiveIntensity:.9}),T=new si(y,R,P),k=new si(I,b,P),U=new si(S,M,P);for(let N=0;N<P;N++)p.makeTranslation(Ce.right+1.05,.12,Mu*.5-N*this.delinSpacing),T.setMatrixAt(N,p),k.setMatrixAt(N,p),U.setMatrixAt(N,p);for(let N of[T,k,U])N.frustumCulled=!1,x.add(N);this.delin=x,this.group.add(x),this.laneUniforms={uTime:{value:0},uS:{value:0},uOpacity:{value:0},uWarn:{value:0}};let H=new jt({uniforms:{...this.laneUniforms,uCurve:{value:null}},vertexShader:ja+`
        varying vec2 vUv;
        varying float vDist;
        void main() {
          vUv = uv;
          vec4 w = modelMatrix * vec4(position, 1.0);
          vDist = -w.z;
          w = curveWorld(w);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,fragmentShader:`
        uniform float uTime;
        uniform float uS;
        uniform float uOpacity;
        uniform float uWarn;
        varying vec2 vUv;
        varying float vDist;
        void main() {
          float p = uS + vDist;
          float x = vUv.x * 2.0 - 1.0;
          float chev = fract((p + abs(x) * 2.2) / 7.0 - uTime * 0.35);
          chev = smoothstep(0.0, 0.08, chev) * (1.0 - smoothstep(0.18, 0.3, chev));
          float edge = smoothstep(0.82, 0.97, abs(x));
          float wave = exp(-abs(fract((p - uTime * 55.0) / 160.0) - 0.5) * 18.0);
          float a = 0.16 + chev * 0.42 + edge * 0.55 + wave * 0.35;
          float fade = smoothstep(2.0, 12.0, vDist + 6.0) * (1.0 - smoothstep(250.0, 650.0, vDist));
          vec3 col = mix(vec3(0.24, 0.55, 1.0), vec3(0.35, 1.0, 0.75), 0.35 + 0.35 * sin(uTime * 2.0));
          col = mix(col, vec3(1.0, 0.35, 0.2), uWarn);
          gl_FragColor = vec4(col * 1.6, a * fade * uOpacity);
        }`,transparent:!0,depthWrite:!1,blending:rs});H.uniforms.uCurve=Hi.uCurve;let F=So([{a:[Ce.laneCenter(0)-1.8,.025],b:[Ce.laneCenter(0)+1.8,.025],uv:N=>[(N-(Ce.laneCenter(0)-1.8))/3.6,0]}]);this.lane=new D(F,H),this.lane.frustumCulled=!1,this.lane.renderOrder=1,this.lane.visible=!1,this.group.add(this.lane)}setWet(e){this.wet=e,this.roadMat.roughness=.88-e*.62,this.roadMat.color.setScalar(1-e*.42),this.roadMat.envMapIntensity=.6+e*.9,this.railMat.roughness=.38-e*.2,this.grassMat.color.setScalar(1-e*.25),this.fieldMat.color.setScalar(1-e*.28)}update(e,t,n,s,r=0){this.s=e,this.roadTex.offset.y=e/Ce.texLength%1,this.grassTex.offset.y=e/6%1,this.fieldTex.offset.y=e/160%1,this.railTex.offset.x=e/4%1,this.posts.position.z=e%this.postSpacing,this.delin.position.z=e%this.delinSpacing,this.laneUniforms.uTime.value=n,this.laneUniforms.uS.value=e%7e3,this.laneUniforms.uOpacity.value=s,this.laneUniforms.uWarn.value=r,this.lane.visible=s>.001}};var s1=`
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`,r1=`
uniform vec3 uSunDir;
uniform float uOvercast;
uniform vec2 uOffset;
uniform vec3 uFog;
varying vec3 vDir;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 zenith = vec3(0.13, 0.33, 0.82);
  vec3 horizon = vec3(0.62, 0.77, 0.95);
  vec3 col = mix(horizon, zenith, pow(clamp(h, 0.0, 1.0), 0.5));
  float sd = max(dot(d, uSunDir), 0.0);
  float clear = 1.0 - uOvercast;
  col += vec3(1.0, 0.82, 0.55) * pow(sd, 6.0) * 0.28 * clear;
  col += vec3(1.0, 0.92, 0.78) * pow(sd, 90.0) * 1.2 * clear;
  col += vec3(40.0, 35.0, 28.0) * smoothstep(0.99955, 0.9998, sd) * clear;
  if (h > 0.0) {
    vec2 p = d.xz / (h + 0.06) * 0.9 + uOffset;
    float cov = mix(0.56, 0.18, uOvercast);
    float n = fbm(p);
    float c = smoothstep(cov, cov + 0.28, n);
    float shade = 0.72 + 0.28 * fbm(p * 2.1 + 3.0);
    vec3 cloudCol = mix(vec3(1.05, 1.05, 1.08), vec3(0.42, 0.45, 0.5), uOvercast) * shade;
    cloudCol += vec3(1.0, 0.85, 0.6) * pow(sd, 5.0) * 0.5 * clear;
    col = mix(col, cloudCol, c * smoothstep(0.0, 0.1, h) * (0.85 + 0.15 * uOvercast));
  }
  vec3 gray = mix(vec3(0.36, 0.39, 0.44), vec3(0.52, 0.55, 0.6), smoothstep(-0.05, 0.6, h));
  col = mix(col, gray, uOvercast * 0.8);
  col = mix(col, uFog, smoothstep(0.06, -0.02, h));
  gl_FragColor = vec4(col, 1.0);
}`,sl=class{constructor(e,t,{shadows:n=!0,shadowSize:s=2048}={}){this.renderer=e,this.scene=t,this.overcast=0,this.sunDir=new C(.52,.6,.6).normalize(),this.fogClear=new Re(.66,.78,.92),this.fogRain=new Re(.43,.46,.5),this.fogColor=this.fogClear.clone(),this.uniforms={uSunDir:{value:this.sunDir},uOvercast:{value:0},uOffset:{value:new ue(0,0)},uFog:{value:this.fogColor}};let r=new jt({uniforms:this.uniforms,vertexShader:s1,fragmentShader:r1,side:mn,depthWrite:!1,depthTest:!0,fog:!1});if(this.dome=new D(new lt(3e3,40,20),r),this.dome.frustumCulled=!1,this.dome.renderOrder=-10,t.add(this.dome),t.fog=new Ua(this.fogColor,140,1550),this.sun=new Ar(16773340,3),this.sun.castShadow=n,n){this.sun.shadow.mapSize.set(s,s);let a=this.sun.shadow.camera;a.left=-55,a.right=55,a.top=60,a.bottom=-60,a.near=10,a.far=400,this.sun.shadow.bias=-5e-4,this.sun.shadow.normalBias=.04}t.add(this.sun),t.add(this.sun.target),this.hemi=new Sr(12901631,6253125,1.05),t.add(this.hemi),this.hills=this.buildHills(),t.add(this.hills),this.pmrem=new Er(e),this.envScene=new Bi;let o=new D(new lt(50,32,16),r);this.envScene.add(o),this.envGround=new D(new un(48,24).rotateX(-Math.PI/2),new hn({color:new Re(.16,.17,.13)})),this.envGround.position.y=-2,this.envScene.add(this.envGround),this.envTarget=null,this.lastEnvOvercast=-1,this.updateEnv()}buildHills(){let n=[],s=[],r=[],o=new Re().setRGB(.3,.42,.33,ht),a=new Re().setRGB(.5,.6,.7,ht);for(let h=0;h<=320;h++){let u=h/320*Math.PI*2,d=Math.sin(u)*1950,f=-Math.cos(u)*1950,m=25+Math.max(0,cs(h*.09,4)*.5+.5)*150+Math.max(0,cs(h*.31,9))*40;n.push(d,-40,f,d,m,f);let v=o.clone().lerp(a,.25),g=o.clone().lerp(a,.7+.2*Math.sin(h*.05));if(s.push(v.r,v.g,v.b,g.r,g.g,g.b),h<320){let p=h*2;r.push(p,p+2,p+1,p+1,p+2,p+3)}}let l=new vt;l.setAttribute("position",new Xe(n,3)),l.setAttribute("color",new Xe(s,3)),l.setIndex(r),this.hillMat=new hn({vertexColors:!0,fog:!1,side:gt,transparent:!0,opacity:1});let c=new D(l,this.hillMat);return c.frustumCulled=!1,c.renderOrder=-5,c}updateEnv(){this.envTarget&&this.envTarget.dispose(),this.envTarget=this.pmrem.fromScene(this.envScene,.02,.1,100),this.scene.environment=this.envTarget.texture,this.lastEnvOvercast=this.overcast,this.onEnv&&this.onEnv(this.envTarget.texture)}setOvercast(e){this.overcast=We(e,0,1)}update(e,t,n,s){let r=this.overcast;this.uniforms.uOvercast.value=r;let o=this.uniforms.uOffset.value;o.x+=e*.004,o.y=-n*6e-4-s*.002,this.fogColor.copy(this.fogClear).lerp(this.fogRain,r);let a=this.scene.fog;a.near=at(140,18,r),a.far=at(1550,430,r),this.sun.intensity=at(3,.32,r),this.hemi.intensity=at(1.05,1.35,r),this.hemi.color.setRGB(at(.77,.6,r),at(.86,.64,r),at(1,.7,r)),this.hillMat.opacity=1-r,this.hillMat.color.setRGB(1,1,1).lerp(this.fogColor,.15+r*.6),this.hills.visible=r<.98,this.dome.position.copy(t.position);let l=h=>h*h/(1+h*mu),c=Hi.uCurve.value;this.hills.position.set(t.position.x+c.x*l(1950)*.7,c.y*l(1950)*.8,0),this.sun.target.position.set(t.position.x*.5,0,-32),this.sun.position.copy(this.sun.target.position).addScaledVector(this.sunDir,200),this.envGround.material.color.setRGB(at(.16,.1,r),at(.17,.11,r),at(.13,.11,r)),Math.abs(r-this.lastEnvOvercast)>.12&&this.updateEnv()}};function Dt(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new vt,c=0;for(let h=0;h<i.length;++h){let u=i[h],d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(t){let h=0,u=[];for(let d=0;d<i.length;++d){let f=i[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=lp(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let v=0;v<o[h].length;++v)f.push(o[h][v][d]);let m=lp(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}return l}function lp(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new Nt(o,t,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<t;m++){let v=h.getComponent(d,m);a.setComponent(d+u,m,v)}}else o.set(h.array,l);l+=h.count*t}return s!==void 0&&(a.gpuType=s),a}function En(i){let e=i.length;return t=>{if(t<=i[0][0])return i[0][1];if(t>=i[e-1][0])return i[e-1][1];let n=0;for(;n<e-2&&t>i[n+1][0];)n++;let s=i[Math.max(0,n-1)],r=i[n],o=i[n+1],a=i[Math.min(e-1,n+2)],l=o[0]-r[0],c=(t-r[0])/l,h=(o[1]-s[1])/(o[0]-s[0]||1)*l,u=(a[1]-r[1])/(a[0]-r[0]||1)*l,d=c*c,f=d*c;return(2*f-3*d+1)*r[1]+(f-2*d+c)*h+(-2*f+3*d)*o[1]+(f-d)*u}}function rl(i,e,t=.4,n=.335){return s=>{let r=i(s);for(let o of e){let a=s-o;Math.abs(a)<t&&(r=Math.max(r,n+Math.sqrt(t*t-a*a)))}return r}}function ol(i,e=.5,t=.72){return(n,s,r)=>{let o=Math.abs(s);if(o<=e)return r;let a=Math.min(1,(o-e)/(t-e));return r+(i(n)-r)*a*a*(3-2*a)}}function To({w:i,b:e,t,tw:n=.9,bw:s=.96,n:r=4,L:o=4.7,bx:a=null},l,c,h=new C){let u=2/r,d=Math.cos(c),f=Math.sin(c),m=Math.sign(d)*Math.pow(Math.abs(d),u),v=Math.sign(f)*Math.pow(Math.abs(f),u),g=e(l),p=a?a(l,m,g):g,_=Math.max(t(l),p+.002),x=p+(v+1)/2*(_-p),y=v>0?at(1,n,v):at(1,s,-v);return h.set(m*i(l)*y,x,l-o/2)}function Ao(i,e,{ns:t=6,nt:n=16,lift:s=.006,center:r=new C(0,.75,0)}={}){let o=[],a=[],l=new C,c=new C,h=new C,u=new C,d=.001;for(let p=0;p<=n;p++)for(let _=0;_<=t;_++){let[x,y]=e(_/t,p/n);i(x,y,l),i(x+d,y,c).sub(l),i(x,y+d,h).sub(l),u.crossVectors(c,h),u.lengthSq()<1e-14&&u.set(l.x,l.y-r.y,l.z-r.z),u.normalize(),u.x*l.x+u.y*(l.y-r.y)+u.z*(l.z-r.z)<0&&u.negate(),o.push(l.x+u.x*s,l.y+u.y*s,l.z+u.z*s)}for(let p=0;p<n;p++)for(let _=0;_<t;_++){let x=p*(t+1)+_,y=x+1,I=x+t+1,S=I+1;a.push(x,I,y,y,I,S)}let f=new vt;f.setAttribute("position",new Xe(o,3)),f.setIndex(a),f.computeVertexNormals();let m=new C().fromBufferAttribute(f.attributes.normal,Math.floor((t+1)*(n+1)/2)),v=new C().fromBufferAttribute(f.attributes.position,Math.floor((t+1)*(n+1)/2));if(m.x*v.x+m.y*(v.y-r.y)+m.z*(v.z-r.z)<0){let p=f.index.array;for(let _=0;_<p.length;_+=3){let x=p[_+1];p[_+1]=p[_+2],p[_+2]=x}f.computeVertexNormals()}let g=[];for(let p=0;p<=n;p++)for(let _=0;_<=t;_++)g.push(_/t,p/n);return f.setAttribute("uv",new Xe(g,2)),f}function yi({u0:i,u1:e,w:t,b:n,t:s,tw:r=.9,bw:o=.96,n:a=4,segs:l=80,ring:c=28,L:h=4.7,H:u=1.5,caps:d=!0,sampleEnds:f=.55,bx:m=null}){let v=[],g=[],p=[],_=[];for(let T=0;T<=l;T++){let k=T/l,U=(1-Math.cos(Math.PI*k))/2;_.push(i+(e-i)*at(k,U,f))}let x=2/a,y=[];for(let T=0;T<c;T++){let k=T/c*Math.PI*2-Math.PI/2,U=Math.cos(k),H=Math.sin(k);y.push([Math.sign(U)*Math.pow(Math.abs(U),x),Math.sign(H)*Math.pow(Math.abs(H),x)])}for(let T of _){let k=n(T),U=s(T),H=t(T);for(let[F,N]of y){let j=m?m(T,F,k):k,G=Math.max(U,j+.002),ce=j+(N+1)/2*(G-j),pe=N>0?at(1,r,N):at(1,o,-N),xe=F*H*pe;v.push(xe,ce,T-h/2),g.push(xe<0?T/h:1-T/h,ce/u)}}for(let T=0;T<l;T++)for(let k=0;k<c;k++){let U=T*c+k,H=T*c+(k+1)%c,F=(T+1)*c+k,N=(T+1)*c+(k+1)%c;p.push(U,H,F,H,N,F)}let I=new vt;if(I.setAttribute("position",new Xe(v,3)),I.setAttribute("uv",new Xe(g,2)),I.setIndex(p),I.computeVertexNormals(),!d)return I;let S=Array.from(I.attributes.position.array),P=Array.from(I.attributes.normal.array),R=Array.from(I.attributes.uv.array),b=(T,k)=>{let U=S.length/3,H=0,F=0,N=S[T*c*3+2];for(let G=0;G<c;G++){let ce=(T*c+G)*3;H+=S[ce],F+=S[ce+1],S.push(S[ce],S[ce+1],S[ce+2]),P.push(0,0,k?-1:1),R.push(R[(T*c+G)*2],R[(T*c+G)*2+1])}S.push(H/c,F/c,N),P.push(0,0,k?-1:1),R.push(.5,.5);let j=U+c;for(let G=0;G<c;G++){let ce=U+G,pe=U+(G+1)%c;k?p.push(j,pe,ce):p.push(j,ce,pe)}};b(0,!0),b(l,!1);let M=new vt;return M.setAttribute("position",new Xe(S,3)),M.setAttribute("normal",new Xe(P,3)),M.setAttribute("uv",new Xe(R,2)),M.setIndex(p),I.dispose(),M}function xt(i,e){let t=new Re(e),n=i.attributes.position.count,s=new Float32Array(n*3);for(let r=0;r<n;r++)s[r*3]=t.r,s[r*3+1]=t.g,s[r*3+2]=t.b;return i.setAttribute("color",new Nt(s,3)),i}function yt(i,e,t,n,s,r,o=0,a=0,l=0){let c=new Ue(i,e,t);return(o||a||l)&&c.applyMatrix4(new $e().makeRotationFromEuler(new ln(o,a,l))),c.translate(n,s,r),c}function cp(i,e,t=20){let n=[],s=i*.62,r=e/2,o=Math.min(.045,e*.22);n.push(new ue(s,-r)),n.push(new ue(i-o,-r));for(let l=0;l<=4;l++){let c=-Math.PI/2+l/4*(Math.PI/2);n.push(new ue(i-o+Math.cos(c)*o,-r+o+Math.sin(c)*o))}for(let l=0;l<=4;l++){let c=l/4*(Math.PI/2);n.push(new ue(i-o+Math.cos(c)*o,r-o+Math.sin(c)*o))}n.push(new ue(s,r));let a=new mo(n,t);return a.rotateZ(Math.PI/2),a}function Ro(i,e,t,n,s=1,r=20){let o=new un(i,r);return o.rotateY(s>0?Math.PI/2:-Math.PI/2),o.translate(e,t,n),o}var us=null;function o1(){if(us)return us;let i=512,e=document.createElement("canvas");e.width=i,e.height=i;let t=e.getContext("2d");t.fillStyle="#123a8e",t.fillRect(0,0,i,i);let n=Ln(1887),s=22;for(let r=0;r<i/(s*.8)+2;r++)for(let o=0;o<i/(s*1.6)+2;o++){let a=o*s*1.6+r%2*s*.8,l=r*s*.8,c=n()<.16,h=t.createRadialGradient(a,l-s*.3,2,a,l,s);if(c)h.addColorStop(0,"#ffffff"),h.addColorStop(1,"#cfd8e6");else{let u=.85+n()*.3;h.addColorStop(0,`rgb(${40*u},${95*u},${200*u})`),h.addColorStop(1,`rgb(${14*u},${46*u},${130*u})`)}t.fillStyle=h,t.beginPath(),t.arc(a,l,s,0,Math.PI),t.fill(),t.strokeStyle="rgba(5,20,60,0.55)",t.lineWidth=2,t.beginPath(),t.arc(a,l,s,.1,Math.PI-.1),t.stroke()}return us=new Bt(e),us.colorSpace=ht,us.wrapS=us.wrapT=Di,us.repeat.set(2,1),us}function al({curved:i=!0}={}){let e=I=>i?vi(I):I,t=new ye;t.name="Elsa";let n=e(new ft({map:o1(),roughness:.45,metalness:.15})),s=e(new ft({color:1920944,roughness:.5,side:gt})),r=e(new ft({color:16777215,roughness:.25})),o=e(new ft({color:723728,roughness:.2})),a=e(new ft({color:15909424,metalness:.9,roughness:.25,emissive:3811328,emissiveIntensity:.3})),l=e(new ft({color:14169162,roughness:.4})),c=e(new ft({color:15331062,roughness:.5})),h=new D(new lt(.3,32,24),n);h.scale.set(1,1.45,.8),h.position.y=.48,t.add(h);let u=new D(new lt(.29,24,18,-.9,1.8,.9,1.6),c);u.scale.set(1,1.42,.82),u.position.y=.46,u.position.z=.012,t.add(u);let d=new Wn;d.moveTo(0,.12),d.quadraticCurveTo(-.12,.02,-.26,-.08),d.quadraticCurveTo(-.12,-.03,0,-.04),d.quadraticCurveTo(.12,-.03,.26,-.08),d.quadraticCurveTo(.12,.02,0,.12);let f=new D(new gi(d,{depth:.05,bevelEnabled:!0,bevelSize:.015,bevelThickness:.015,bevelSegments:2}),s);f.position.set(0,.08,-.03),t.add(f);let m=new lt(.09,14,10);m.scale(.35,1,.7);let v=new D(m,s),g=new D(m,s);v.position.set(-.3,.42,.02),g.position.set(.3,.42,.02),v.rotation.z=.7,g.rotation.z=-.7,t.add(v,g);let p=new D(new Hn(.08,.22,3),s);p.scale.set(.3,1,1.4),p.position.set(0,.62,-.23),p.rotation.x=-.6,t.add(p);for(let I of[-1,1]){let S=new D(new lt(.085,20,14),r);S.position.set(I*.13,.7,.17);let P=new D(new lt(.045,16,12),o);P.position.set(I*.145,.7,.24);let R=new D(new lt(.014,8,6),r);R.position.set(I*.13+.02,.72,.28),t.add(S,P,R)}let _=new D(new gn(.07,.016,8,20,Math.PI),l);_.rotation.z=Math.PI,_.position.set(0,.56,.235),t.add(_);let x=new ye;x.position.y=.9;let y=new D(new ze(.15,.14,.07,24,1,!0),a);x.add(y);for(let I=0;I<6;I++){let S=I/6*Math.PI*2,P=new ye;P.position.set(Math.sin(S)*.145,.035,Math.cos(S)*.145),P.rotation.y=S;let R=new D(new Hn(.028,.12,6),a);R.position.y=.06;let b=new D(new Hn(.018,.08,5),a);b.position.set(-.03,.04,0),b.rotation.z=.6;let M=b.clone();M.position.x=.03,M.rotation.z=-.6;let T=new D(new lt(.016,8,6),a);T.position.y=.125,P.add(R,b,M,T),x.add(P)}return t.add(x),t.traverse(I=>{I.isMesh&&(I.castShadow=!0)}),t.userData={finL:v,finR:g,crown:x,body:h},t}function ll(i,e,t=0){let n=i.userData;n.finL.rotation.z=.7+Math.sin(e*6)*.35,n.finR.rotation.z=-.7-Math.sin(e*6+1)*.2,i.rotation.z=Math.sin(e*2.2)*.04+t}var Xn=100,fp=17,pp=2,Fi=fp+pp+1,hp=["Gr\xFC\xDFe an Mini Adam!","Linke Spur freischalten: jetzt!","BrunnenTV Fanclub","Malte Malte Malte","Elsa \u2764","Ehrenmenschen-Br\xFCcke","Rechts fahren, Adam!","Wir streamen in Full HD","Live-Eskalationen immer woanders","Ringtennis-Verein gr\xFC\xDFt","Danke f\xFCr alles \u2764","Bimmel hurra!","Kanalpunkte-Wette l\xE4uft"],up=[["Burg Hauneck","Haunetal"],["Wartburg","Eisenach"],["Weser-Skywalk","Beverungen"],["Burg Ronneburg","Ronneburg"],["Elsa","Kassel gr\xFC\xDFt"],["Hochofenwerk Phoenix West","Dortmund"],["BrunnenTV-Studio","Herr Sch\xF6nnbrun"],["Megahub","Lehrte"],["Rh\xF6n","Starlink-Gebiet"],["Zissel","Kassel"],["Skyline","Frankfurt am Main"]],dp=["Kassel","Fulda","Frankfurt","Gifhorn","Hannover","W\xFCrzburg","G\xF6ttingen","Hamburg","Hanau","Siegen","Erlensee","Eisenach","Bad Hersfeld","Dortmund"];function a1(){let i=[],e=new ze(.16,.24,2.4,6);e.translate(0,1.2,0),i.push(xt(e,4862756));let t=[[2.5,4,1.5],[2.05,3.5,3.4],[1.55,3,5.2],[1,2.5,6.8]];for(let[n,s,r]of t){let o=new Hn(n,s,8);o.translate(0,r+s/2,0),i.push(xt(o,2970928))}return Dt(i)}function l1(){let i=[],e=new ze(.2,.3,3.2,6).toNonIndexed();e.translate(0,1.6,0),i.push(xt(e,5914672));let t=[[0,5,0,2.6],[1.3,4.3,.6,1.9],[-1.2,4.5,-.5,2],[.2,6.3,.3,1.7]];for(let[n,s,r,o]of t){let a=new yo(o,1);a.translate(n,s,r),i.push(xt(a,5012020))}return Dt(i)}function c1(){let i=[];for(let[e,t,n,s]of[[0,.7,0,1],[.8,.55,.3,.75],[-.7,.5,-.2,.7]]){let r=new yo(s,1);r.translate(e,t,n),i.push(xt(r,5603127))}return Dt(i)}function h1(){let i=new Ue(1,1,1);return i.translate(0,.5,0),xt(i,16777215)}function u1(){let i=[],t=(f,m,v,g)=>i.push(...f,...m,...v,...f,...v,...g),n=(f,m,v)=>i.push(...f,...m,...v),r=[-.56,1,-.56],o=[.5+.06,1,-.5-.06],a=[.5+.06,1,.5+.06],l=[-.5-.06,1,.5+.06],c=[0,1+.62,-.5-.06],h=[0,1+.62,.5+.06];t(a,o,c,h),t(r,l,h,c),n(l,a,h),n(o,r,c);let u=new vt;u.setAttribute("position",new Xe(i,3)),u.computeVertexNormals();let d=i.length/3;return u.setAttribute("uv",new Xe(new Float32Array(d*2),2)),xt(u,16777215)}var cl=[16777215,14741728,13164744,15794144,13691096,16774364],d1=[15854816,15327951,16184298,15063480,14275788,15720649,14471872],f1=[10698794,9124390,5978926,3816512,11883054,7023136],hl=class{constructor(e){this.track=new ye,this.track.name="Scenery",e.add(this.track),this.slots=Array.from({length:Fi},()=>({k:-1,items:[]})),this.requests=[],this.pools=new Map,this.animated=new Set,this.texCache=new Map,this.gantryInfo=()=>({target:"Kassel",km:42}),this.time=0,this.mats={concrete:de.std({color:12433838,roughness:.92}),concreteDark:de.std({color:9407620,roughness:.95}),steel:de.std({color:10133928,metalness:.7,roughness:.4}),dark:de.std({color:2763566,roughness:.7}),white:de.std({color:15921903,roughness:.6}),orange:de.std({color:15231762,roughness:.6}),grass:de.lambert({color:6261306}),stone:de.std({color:10985102,roughness:.95}),water:de.std({color:10276863,roughness:.05,metalness:.2,transparent:!0,opacity:.55,envMapIntensity:1.5}),redRoof:de.std({color:10698794,roughness:.8}),glassBlue:de.std({color:6258595,metalness:.8,roughness:.15,envMapIntensity:1.2})},this.makeInstanced()}makeInstanced(){let e=de.lambert({vertexColors:!0}),t={conifer:[a1(),90],decid:[l1(),60],bush:[c1(),50],house:[h1(),34],roof:[u1(),34]};this.inst={};let n=new $e().makeScale(0,0,0);for(let[s,[r,o]]of Object.entries(t)){let a=s==="house"?de.lambert({vertexColors:!0}):e,l=new si(r,a,o*Fi);l.frustumCulled=!1,l.castShadow=!0,l.receiveShadow=s==="house"||s==="roof";for(let c=0;c<o*Fi;c++)l.setMatrixAt(c,n),l.setColorAt(c,new Re(1,1,1));l.instanceMatrix.setUsage(If),this.track.add(l),this.inst[s]={mesh:l,cap:o}}}acquire(e,t){this.pools.has(e)||this.pools.set(e,[]);let n=this.pools.get(e),s=n.find(r=>!r.userData.active);return s||(s=t(),s.userData.type=e,n.push(s),this.track.add(s)),s.userData.active=!0,s.visible=!0,s}release(e){e.userData.active=!1,e.visible=!1,this.animated.delete(e),e.userData.onRelease&&e.userData.onRelease()}request(e,t,n={}){let s=Math.random().toString(36).slice(2),r={id:s,type:e,s:t,data:n,built:!1};this.requests.push(r);let o=Math.floor(t/Xn),a=this.slots[(o%Fi+Fi)%Fi];return a.k===o&&this.placeRequest(a,r),s}cancel(e){let t=this.requests.find(n=>n.id===e);t&&!t.built&&(this.requests=this.requests.filter(n=>n!==t))}reset(){for(let e of this.slots){for(let t of e.items)this.release(t);e.items=[],e.k=-1}this.requests=[]}update(e,t){this.time+=t,this.track.position.z=e;let n=Math.floor(e/Xn);for(let s=n-pp;s<=n+fp;s++){if(s<0)continue;let r=(s%Fi+Fi)%Fi;this.slots[r].k!==s&&this.buildSlot(r,s)}for(let s of this.animated){let r=s.userData.animate;r&&r(this.time,t)}this.requests.length>40&&(this.requests=this.requests.filter(s=>s.s>e-500))}buildSlot(e,t){let n=this.slots[e];for(let p of n.items)this.release(p);n.items=[],n.k=t;let s=Ln(t*7919+17),r=t*Xn,o=-r,a={conifer:0,decid:0,bush:0,house:0,roof:0},l=new $e,c=new qt,h=new C,u=new C,d=new Re,f=new C(0,1,0),m=(p,_,x,y,I,S,P,R,b,M)=>{let T=this.inst[p],k=a[p];if(k>=T.cap)return!1;a[p]++,c.setFromAxisAngle(f,S),u.set(R??I,b??I,M??I),l.compose(h.set(_,x,y),c,u);let U=e*T.cap+k;return T.mesh.setMatrixAt(U,l),T.mesh.setColorAt(U,d.setHex(P)),!0},v=this.villageSide(t),g=this.villageSide(t-1)||this.villageSide(t+1);for(let p of[1,-1]){let _=p>0?11:23,x=ls(.05,.38,cs(t/9,_)),y=p>0?17:34;if(v===p)continue;let I=Math.floor(x*46);for(let P=0;P<I;P++){let R=p*(y+4+Math.pow(s(),.7)*120),b=o-s()*Xn,M=.75+s()*.65;s()<.62?m("conifer",R,0,b,M,s()*6,cl[Math.floor(s()*cl.length)]):m("decid",R,0,b,M,s()*6,cl[Math.floor(s()*cl.length)])}let S=3+Math.floor(s()*6);for(let P=0;P<S;P++){let R=p*(y-1+s()*10),b=o-s()*Xn;s()<.55?m("bush",R,0,b,.7+s()*.9,s()*6,16777215):m("decid",R,0,b,.55+s()*.5,s()*6,16777215)}if(x<.3){let P=Math.floor(s()*5);for(let R=0;R<P;R++)m("decid",p*(60+s()*380),0,o-s()*Xn,.9+s()*.8,s()*6,16777215);if(s()<.22){let R=this.acquire("turbine",()=>this.makeTurbine());R.position.set(p*(180+s()*520),0,o-s()*Xn),R.rotation.y=(s()-.5)*.6,R.userData.phase=s()*6,this.animated.add(R),n.items.push(R)}}}if(v){let p=v,_=14+Math.floor(s()*14);for(let x=0;x<_;x++){let y=p*(42+s()*150),I=o-s()*Xn,S=8+s()*5,P=9+s()*6,R=5+s()*3.5,b=(s()<.5?0:Math.PI/2)+(s()-.5)*.3;m("house",y,0,I,1,b,Je(d1),S,R,P),m("roof",y,0,I,1,b,Je(f1),S,R,P)}if(s()<.8){let x=this.acquire("church",()=>this.makeChurch());x.position.set(p*(70+s()*60),0,o-50),x.rotation.y=s()*.5,n.items.push(x)}for(let x=0;x<8;x++)m("decid",p*(40+s()*160),0,o-s()*Xn,.7+s()*.5,s()*6,16777215)}if((v===1||g===1)&&t>2){let p=this.acquire("noisewall",()=>this.makeNoiseWall());p.position.set(Ce.right+2.1,0,o-Xn/2),n.items.push(p)}if(t%5===0&&t>0){let p=this.makeKmSign((r/1e3).toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:1}));p.position.set(Ce.right+1.2,0,o),n.items.push(p)}if(t%20===10){let p=this.acquire("notruf",()=>this.makeNotruf());p.position.set(Ce.right+1.4,0,o-30),n.items.push(p)}if(t%13===7){let p=this.acquire("gantry",()=>this.makeGantry());this.labelGantry(p,s),p.position.set(0,0,o-50),n.items.push(p)}else if(t%23===15){let p=this.acquire("bridge",()=>this.makeBridge());this.labelBridge(p,s),p.position.set(0,0,o-50),n.items.push(p)}else if(t%17===3){let[p,_]=up[Math.floor(s()*up.length)],x=this.acquire("brown",()=>this.makeBrownSign());x.userData.setText(p,_),x.position.set(Ce.right+3.4,0,o-40),n.items.push(x)}else if(t%29===11){let p=this.acquire("blueinfo",()=>this.makeBlueInfo());p.userData.setText(s()<.5?["Rastplatz","Sch\xE4ferborn  2 km"]:["Rastst\xE4tte","Bananensaft  1500 m"]),p.position.set(Ce.right+3.4,0,o-40),n.items.push(p)}for(let p of this.requests)!p.built&&p.s>=r&&p.s<r+Xn&&this.placeRequest(n,p);for(let p of Object.keys(this.inst)){let _=this.inst[p],x=new $e().makeScale(0,0,0);for(let y=a[p];y<_.cap;y++)_.mesh.setMatrixAt(e*_.cap+y,x);_.mesh.instanceMatrix.needsUpdate=!0,_.mesh.instanceColor&&(_.mesh.instanceColor.needsUpdate=!0)}}villageSide(e){return e<4?0:e%37===5||e%37===6?1:e%53===20||e%53===21?-1:0}placeRequest(e,t){t.built=!0;let n=-t.s,s=null;switch(t.type){case"brunnen":s=this.acquire("brunnen",()=>this.makeFountain()),s.position.set(Ce.right+9,0,n),this.animated.add(s);break;case"elsa":s=this.acquire("elsaStatue",()=>this.makeElsaStatue()),s.position.set(Ce.right+8,0,n),this.animated.add(s);break;case"burg":s=this.acquire("burg",()=>this.makeCastle()),s.position.set(160,0,n-60);break;case"skyline":s=this.acquire("skyline",()=>this.makeSkyline()),s.position.set(-150,0,n-250);break;case"sparkasse":s=this.acquire("sparkasse",()=>this.makeSparkasse()),s.userData.setColor(t.data.color||"#d5121e"),s.position.set(Ce.right+16,0,n);break;case"kiosk":s=this.acquire("kiosk",()=>this.makeKiosk()),s.userData.setText(t.data.title||"Currywurst",t.data.sub||"die richtige Bude"),s.position.set(Ce.right+10,0,n);break;case"charger":s=this.acquire("charger",()=>this.makeCharger()),s.position.set(Ce.right+11,0,n);break;case"ziel":s=this.acquire("ziel",()=>this.makeZiel()),s.userData.setText(t.data.title||"Ziel"),s.position.set(Ce.right+3.5,0,n);break;case"blitzer":s=this.acquire("blitzer",()=>this.makeBlitzer()),s.position.set(Ce.right+1.6,0,n);break;case"speed":{s=this.acquire("speed:"+t.data.limit,()=>this.makeSpeedSign(t.data.limit)),s.position.set(0,0,n);break}default:return}s.userData.requestId=t.id,e.items.push(s)}canvasTex(e,t,n,s){if(this.texCache.has(e))return this.texCache.get(e);let r=document.createElement("canvas");r.width=t,r.height=n,s(r.getContext("2d"),t,n);let o=new Bt(r);if(o.colorSpace=ht,o.anisotropy=4,this.texCache.set(e,o),this.texCache.size>90){let a=this.texCache.keys().next().value;this.texCache.get(a).dispose(),this.texCache.delete(a)}return o}makeKmSign(e){let t=new ye;this.kmGeo||(this.kmGeo={post:new Ue(.08,1.4,.08),board:new tt(.5,.38)});let n=new D(this.kmGeo.post,this.mats.steel);n.position.y=.7;let s=this.canvasTex("km:"+e,128,96,(o,a,l)=>{o.fillStyle="#fafaf5",o.fillRect(0,0,a,l),o.strokeStyle="#111",o.lineWidth=5,o.strokeRect(3,3,a-6,l-6),o.fillStyle="#111",o.font="bold 46px Arial, sans-serif",o.textAlign="center",o.textBaseline="middle",o.fillText(e,a/2,l/2+2)}),r=new D(this.kmGeo.board,de.std({map:s,roughness:.6}));return r.position.set(0,1.35,.05),r.rotation.y=-.25,t.add(n,r),t.userData.active=!0,t.userData.onRelease=()=>{r.material.dispose(),this.track.remove(t)},this.track.add(t),t}makeNotruf(){let e=new ye,t=new D(new Ue(.32,1.25,.28),this.mats.orange);t.position.y=.62;let n=new D(new tt(.22,.25),this.mats.white);return n.position.set(0,.95,.142),e.add(t,n),e}makeGantry(){let e=new ye,t=this.mats.steel,n=hs-.4,s=Ce.right+1.6;for(let c of[n,s]){let h=new D(new Ue(.5,7.4,.5),t);h.position.set(c,3.7,0),h.castShadow=!0,e.add(h);let u=new D(new Ue(1.2,.5,1.2),this.mats.concrete);u.position.set(c,.25,0),e.add(u)}let r=s-n;for(let c of[6.3,7.2]){let h=new D(new Ue(r,.22,.22),t);h.position.set((n+s)/2,c,0),h.castShadow=!0,e.add(h)}for(let c=0;c<=12;c++){let h=n+r*c/12,u=new D(new Ue(.08,.9,.08),t);u.position.set(h,6.75,0),u.rotation.z=c%2?.7:-.7,e.add(u)}let o=new D(new tt(7.2,2.7),de.std({roughness:.5}));o.position.set(-3.75,6.6,.2);let a=new D(new tt(7.2,2.7),de.std({roughness:.5}));a.position.set(3.9,6.6,.2);let l=new D(new Ue(14.8,2.8,.12),this.mats.dark);return l.position.set(.07,6.6,.12),e.add(l,o,a),e.userData.panels=[o,a],e}labelGantry(e,t){let n=this.gantryInfo(),[s,r]=e.userData.panels,o=u=>u.toLocaleString("de-DE",{maximumFractionDigits:u<10?1:0})+" km",a=Je(dp),l=Je(dp);l===a&&(l="W\xFCrzburg");let c=wo([{left:n.target,right:o(n.km)},{left:"Navi-Ziel",right:"\u2191"}],{w:768,h:288,arrows:null}),h=wo([{left:a,right:o(5+Math.floor(t()*60))},{left:l,right:o(30+Math.floor(t()*120))}],{w:768,h:288,arrows:null});for(let[u,d]of[[s,c],[r,h]])u.material.map&&u.material.map.dispose(),u.material.map=d,u.material.needsUpdate=!0}makeBridge(){let e=new ye,t=this.mats.concrete,n=-58,s=42,r=new D(new Ue(s-n,1.1,11,20,1,1),t);r.position.set((n+s)/2,6.35,0),r.castShadow=!0,r.receiveShadow=!0,e.add(r);let o=new D(new tt(s-n,11),this.mats.concreteDark);o.rotation.x=Math.PI/2,o.position.set((n+s)/2,5.79,0),e.add(o);for(let l of[hs,Ce.right+3,-31.5])for(let c of[-3.2,3.2]){let h=new D(new ze(.55,.6,5.8,12),t);h.position.set(l,2.9,c),h.castShadow=!0,e.add(h)}for(let l of[n+4,s-4]){let c=new D(new Ue(8,6,13),this.mats.grass);c.position.set(l,3,0),e.add(c)}for(let l of[-5.4,5.4]){let c=new D(new Ue(s-n,.1,.1),this.mats.steel);c.position.set((n+s)/2,7.95,l),e.add(c);for(let h=n;h<=s;h+=2.5){let u=new D(new Ue(.06,1,.06),this.mats.steel);u.position.set(h,7.4,l),e.add(u)}}let a=new D(new tt(9,1.5,8,1),de.std({side:gt,roughness:.9}));return a.position.set(-1.5,6.9,5.6),e.add(a),e.userData.banner=a,e}labelBridge(e,t){let n=hp[Math.floor(t()*hp.length)],s=this.canvasTex("banner:"+n,1024,170,(r,o,a)=>{r.fillStyle="#fbfbf6",r.fillRect(0,0,o,a),r.fillStyle=["#c8102e","#1d4f9a","#111111","#2d7a32"][n.length%4],r.font='bold 92px "Comic Sans MS", "Marker Felt", "Segoe Print", Arial, sans-serif',r.textAlign="center",r.textBaseline="middle";let l=92;for(;r.measureText(n).width>o-60&&l>30;)l-=4,r.font=`bold ${l}px "Comic Sans MS", "Marker Felt", "Segoe Print", Arial, sans-serif`;r.fillText(n,o/2,a/2+4),r.strokeStyle="rgba(0,0,0,0.15)";for(let c=0;c<5;c++)r.beginPath(),r.moveTo(0,Math.random()*a),r.bezierCurveTo(o*.3,Math.random()*a,o*.7,Math.random()*a,o,Math.random()*a),r.stroke()});e.userData.banner.material.map=s,e.userData.banner.material.needsUpdate=!0,e.userData.banner.position.x=-12+t()*20}makeBrownSign(){let e=new ye;for(let n of[-1.3,1.3]){let s=new D(new Ue(.1,3.8,.1),this.mats.steel);s.position.set(n,1.9,0),e.add(s)}let t=new D(new tt(3.4,2.1),de.std({roughness:.6}));return t.position.set(0,2.75,.06),e.add(t),e.rotation.y=-.12,e.userData.setText=(n,s)=>{t.material.map=this.canvasTexFrom("brown:"+n,()=>np(n,s)),t.material.needsUpdate=!0},e}canvasTexFrom(e,t){return this.texCache.has(e)||this.texCache.set(e,t()),this.texCache.get(e)}makeBlueInfo(){let e=new ye;for(let n of[-1.3,1.3]){let s=new D(new Ue(.1,3.6,.1),this.mats.steel);s.position.set(n,1.8,0),e.add(s)}let t=new D(new tt(3.4,1.8),de.std({roughness:.6}));return t.position.set(0,2.7,.06),e.add(t),e.rotation.y=-.12,e.userData.setText=n=>{t.material.map=this.canvasTexFrom("blue:"+n.join("|"),()=>wo(n,{w:512,h:272})),t.material.needsUpdate=!0},e}makeSpeedSign(e){let t=new ye,n=ip(e),s=de.std({map:n,transparent:!0,alphaTest:.4,roughness:.5});for(let r of[Ce.right+1.3,hs]){let o=new D(new ze(.04,.04,2.6,6),this.mats.steel);o.position.set(r,1.3,0);let a=new D(new tt(1,1),s);a.position.set(r,2.5,.05),t.add(o,a)}return t}makeBlitzer(){let e=new ye,t=new D(new Ue(.55,2.7,.55),de.std({color:10331048,metalness:.4,roughness:.5}));t.position.y=1.35;let n=new D(new tt(.36,.5),de.std({color:1053720,metalness:.8,roughness:.1}));n.position.set(0,2.2,.28);let s=new D(new tt(.3,.2),de.basic({color:16777215}));return s.position.set(0,1.75,.28),e.add(t,n,s),e.rotation.y=-.35,e.userData.flash=s,e}makeTurbine(){let e=new ye,t=de.std({color:15987957,roughness:.55}),n=new D(new ze(1.2,2.4,92,12),t);n.position.y=46;let s=new D(new Ue(3.6,3.8,10),t);s.position.set(0,93,-1);let r=new ye;r.position.set(0,93,4.4);let o=new D(new lt(2,12,10),t);o.scale.set(1,1,1.4),r.add(o);let a=new Ue(2.4,46,.5);a.translate(0,24,0);let l=a.attributes.position;for(let c=0;c<l.count;c++){let h=l.getY(c);l.setX(c,l.getX(c)*(1-h/50*.75))}a.computeVertexNormals();for(let c=0;c<3;c++){let h=new D(a,t);h.rotation.z=c/3*Math.PI*2,r.add(h)}return e.add(n,s,r),e.userData.animate=c=>{r.rotation.z=c*1.3+e.userData.phase},e}makeChurch(){let e=new ye,t=de.std({color:15525333,roughness:.9}),n=new D(new Ue(9,8,18),t);n.position.set(0,4,4);let s=new D(new ze(.01,6.8,5,4,1),this.mats.redRoof);s.scale.set(1,1,2),s.rotation.y=Math.PI/4,s.position.set(0,10.5,4);let r=new D(new Ue(4.5,20,4.5),t);r.position.set(0,10,-7);let o=new D(new Hn(3.4,10,4),de.std({color:4087378,roughness:.7}));o.rotation.y=Math.PI/4,o.position.set(0,25,-7);let a=new D(new un(.9,16),de.std({color:1710618}));return a.position.set(0,16,-4.74),e.add(n,s,r,o,a),e.traverse(l=>l.isMesh&&(l.castShadow=!0)),e}makeNoiseWall(){let e=this.canvasTexFrom("noisewall",()=>{let r=document.createElement("canvas");r.width=256,r.height=128;let o=r.getContext("2d");o.fillStyle="#7f8f84",o.fillRect(0,0,256,128);for(let l=0;l<128;l+=8)o.fillStyle=l%16?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.06)",o.fillRect(0,l,256,4);o.fillStyle="#5b6168",o.fillRect(0,0,10,128);let a=new Bt(r);return a.colorSpace=ht,a.wrapS=a.wrapT=Di,a.repeat.set(20,1),a.anisotropy=4,a}),t=de.std({map:e,roughness:.8}),n=new D(new Ue(.3,4.2,Xn,1,1,25),t);n.position.y=2.1,n.castShadow=!0,n.receiveShadow=!0;let s=new ye;return s.add(n),s}makeFountain(){let e=new ye,t=new D(new ze(3.4,3.6,.9,28,1,!0),this.mats.stone);t.position.y=.45;let n=new D(new gn(3.45,.18,8,32),this.mats.stone);n.rotation.x=Math.PI/2,n.position.y=.9;let s=new D(new un(3.35,28),this.mats.water);s.rotation.x=-Math.PI/2,s.position.y=.75;let r=new D(new ze(.35,.5,2.4,14),this.mats.stone);r.position.y=1.2;let o=new D(new ze(1.4,.35,.5,20),this.mats.stone);o.position.y=2.5;let a=de.std({color:14676479,transparent:!0,opacity:.55,roughness:.1,emissive:3364215,emissiveIntensity:.3}),l=new D(new Hn(.25,2.2,12,1,!0),a);l.position.y=3.8,l.rotation.x=Math.PI;let c=new D(new ze(1.45,2.4,1.7,24,1,!0),a);c.position.y=1.65;let h=this.canvasTex("brunnentv",512,200,(f,m,v)=>{f.fillStyle="#3a1f63",Ht(f,0,0,m,v,24),f.fill(),f.fillStyle="#ffd84a",f.font="bold 84px Arial Black, Arial, sans-serif",f.textAlign="center",f.textBaseline="middle",f.fillText("BrunnenTV",m/2,v*.42),f.fillStyle="#ffffff",f.font="34px Arial, sans-serif",f.fillText("mit Herrn Sch\xF6nnbrun \u26F2",m/2,v*.78)}),u=new D(new tt(3.2,1.25),de.std({map:h,roughness:.5}));u.position.set(-4.2,2.3,1.5),u.rotation.y=.5;let d=new D(new Ue(.12,1.8,.12),this.mats.steel);return d.position.set(-4.2,.9,1.4),e.add(t,n,s,r,o,l,c,u,d),e.userData.animate=f=>{l.scale.y=1+Math.sin(f*7)*.08,c.scale.x=c.scale.z=1+Math.sin(f*5)*.03},e}makeElsaStatue(){let e=new ye,t=new D(new ze(1.8,2.1,1.2,20),this.mats.stone);t.position.y=.6;let n=al({curved:!0});n.scale.setScalar(4.2),n.position.y=1.2,n.rotation.y=-.6;let s=this.canvasTex("elsaSign",512,160,(o,a,l)=>{o.fillStyle="#1d3f9a",Ht(o,0,0,a,l,20),o.fill(),o.fillStyle="#f2c230",o.font="bold 66px Arial, sans-serif",o.textAlign="center",o.textBaseline="middle",o.fillText("\u{1F451} Elsa gr\xFC\xDFt!",a/2,l/2+3)}),r=new D(new tt(2.6,.8),de.std({map:s}));return r.position.set(0,.7,2.12),e.add(t,n,r),e.userData.animate=o=>ll(n,o),e}makeCastle(){let e=new ye,t=new D(new Hn(95,42,24,1),de.lambert({color:6063680}));t.position.y=21;let n=de.std({color:12036495,roughness:.95}),s=new D(new Ue(12,30,12),n);s.position.y=57;let r=new D(new Hn(9.5,12,4),this.mats.redRoof);r.rotation.y=Math.PI/4,r.position.y=78,e.add(t,s,r);for(let o=0;o<4;o++){let a=o/4*Math.PI*2+.4,l=new D(new ze(3.5,3.8,20,12),n);l.position.set(Math.sin(a)*18,52,Math.cos(a)*18);let c=new D(new Hn(4.4,8,12),this.mats.redRoof);c.position.set(Math.sin(a)*18,66,Math.cos(a)*18),e.add(l,c);let h=(o+.5)/4*Math.PI*2+.4,u=new D(new Ue(24,12,2),n);u.position.set(Math.sin(h)*13.5,48,Math.cos(h)*13.5),u.rotation.y=h,e.add(u)}return e}makeSkyline(){let e=new ye,t=Ln(69),n=[this.mats.glassBlue,de.std({color:12174028,metalness:.5,roughness:.3}),de.std({color:7305862,metalness:.6,roughness:.25})];for(let s=0;s<16;s++){let r=60+t()*190,o=18+t()*22,a=new D(new Ue(o,r,o),n[s%3]);if(a.position.set(-180+s*26+t()*10,r/2,-t()*120),e.add(a),s===7){let l=new D(new ze(.6,1.2,50,6),this.mats.steel);l.position.set(a.position.x,r+25,a.position.z),e.add(l)}}return e}makeSparkasse(){let e=new ye,t=new D(new Ue(14,7,10),de.std({color:15328991,roughness:.85}));t.position.y=3.5;let n=new D(new tt(12,3),this.mats.glassBlue);n.position.set(0,2.2,5.01),n.rotation.y=0;let s=new D(new tt(8,1.6),de.std({roughness:.5}));return s.position.set(0,6,5.03),e.add(t,n,s),e.rotation.y=-Math.PI/2+.25,e.userData.setColor=r=>{let o=this.canvasTex("spk:"+r,512,100,(a,l,c)=>{a.fillStyle="#ffffff",a.fillRect(0,0,l,c),a.fillStyle=r,a.font="bold 64px Arial, sans-serif",a.textAlign="center",a.textBaseline="middle",a.fillText("Sparkasse",l/2,c/2+3)});s.material.map=o,s.material.needsUpdate=!0},e}makeKiosk(){let e=new ye,t=new D(new Ue(5,3,4),de.std({color:15786160,roughness:.8}));t.position.y=1.5;let n=new D(new Ue(5.4,.2,1.6),de.std({color:13770784,roughness:.7}));n.position.set(0,2.8,2.6),n.rotation.x=.25;let s=new D(new ze(.12,.12,7,8),this.mats.steel);s.position.set(-3.6,3.5,1);let r=new D(new tt(3.2,1.8),de.std({roughness:.5}));return r.position.set(-3.6,6.4,1.13),e.add(t,n,s,r),e.rotation.y=-.4,e.userData.setText=(o,a)=>{let l=this.canvasTex("kiosk:"+o+a,512,288,(c,h,u)=>{c.fillStyle="#fff4d0",Ht(c,0,0,h,u,26),c.fill(),c.strokeStyle="#d22020",c.lineWidth=12,Ht(c,8,8,h-16,u-16,20),c.stroke(),c.fillStyle="#b31515",c.font="bold 72px Arial Black, Arial, sans-serif",c.textAlign="center",c.textBaseline="middle",c.fillText(o,h/2,u*.4),c.fillStyle="#333",c.font="bold 38px Arial, sans-serif",c.fillText(a,h/2,u*.75)});r.material.map=l,r.material.needsUpdate=!0},e}makeCharger(){let e=new ye,t=new D(new Ue(14,.4,6),de.std({color:16053492,roughness:.6}));t.position.y=4.2,e.add(t);for(let s of[-6,6]){let r=new D(new Ue(.3,4.2,.3),this.mats.steel);r.position.set(s,2.1,0),e.add(r)}for(let s=0;s<5;s++){let r=new D(new Ue(.35,1.6,.35),de.std({color:15921906,roughness:.4}));r.position.set(-5+s*2.5,.8,-1.5);let o=new D(new Ue(.36,.25,.36),de.std({color:13638684,emissive:5242880}));o.position.set(-5+s*2.5,1.35,-1.5),e.add(r,o)}let n=new D(new Ue(13.6,.08,5.6),de.basic({color:12575743}));return n.position.y=3.98,e.add(n),e.rotation.y=-.2,e}makeZiel(){let e=new ye;for(let r of[-2.2,2.2]){let o=new D(new ze(.08,.08,4.6,8),this.mats.steel);o.position.set(r,2.3,0),e.add(o)}let t=this.canvasTex("checker",256,64,(r,o,a)=>{for(let l=0;l<4;l++)for(let c=0;c<16;c++)r.fillStyle=(c+l)%2?"#111":"#fff",r.fillRect(c*16,l*16,16,16)}),n=new D(new tt(4.4,.9,10,1),de.std({map:t,side:gt}));n.position.y=4.15;let s=new D(new tt(4.2,1.6),de.std({roughness:.6}));return s.position.y=2.9,s.position.z=.05,e.add(n,s),e.rotation.y=-.15,e.userData.setText=r=>{s.material.map=this.canvasTexFrom("ziel:"+r,()=>wo(["Ziel erreicht:",r],{w:512,h:196,bg:"#1d7a3a"})),s.material.needsUpdate=!0},e}flashBlitzer(e){let t=this.pools.get("blitzer")||[];for(let n of t)n.userData.active&&n.userData.flash.material.color.setScalar(e?30:1)}};var Nr={klein:{L:3.62,half:.83,H:1.5,belt:.93,hood:.78,ws:1.32,re:2.85,ce:3.48,rear:"hatch",axles:[.68,3],wr:.29,cl:.15,nose:.62,weight:8},kompakt:{L:4.26,half:.895,H:1.46,belt:.93,hood:1.05,ws:1.72,re:3.35,ce:4.12,rear:"hatch",axles:[.86,3.5],wr:.31,cl:.16,nose:.6,weight:22},limo:{L:4.78,half:.915,H:1.45,belt:.95,hood:1.32,ws:1.98,re:3.15,ce:3.88,rear:"sedan",axles:[.95,3.8],wr:.32,cl:.15,nose:.6,weight:15},kombi:{L:4.82,half:.915,H:1.5,belt:.95,hood:1.25,ws:1.92,re:4.5,ce:4.74,rear:"wagon",axles:[.95,3.75],wr:.32,cl:.16,nose:.6,weight:18},suv:{L:4.62,half:.94,H:1.68,belt:1.08,hood:1.12,ws:1.78,re:4.2,ce:4.5,rear:"wagon",axles:[.92,3.62],wr:.36,cl:.22,nose:.74,weight:14},sport:{L:4.5,half:.93,H:1.27,belt:.82,hood:1.62,ws:2.25,re:2.9,ce:4.05,rear:"hatch",axles:[1.12,3.62],wr:.33,cl:.12,nose:.48,weight:4},transporter:{L:5.9,half:1,H:2.5,belt:1.2,hood:.78,ws:1.42,re:5.85,ce:5.9,rear:"box",cargo:2.05,axles:[.95,4.6],wr:.36,cl:.2,nose:.78,weight:8},wohnmobil:{L:7,half:1.15,H:3,belt:1.3,hood:.8,ws:1.45,re:6.95,ce:7,rear:"box",cargo:1.9,alkoven:!0,axles:[1,4.9],wr:.38,cl:.22,nose:.8,weight:2}},p1=[[12106946,20],[1118740,20],[15659250,18],[5922662,18],[2310266,10],[10361627,6],[2968122,3],[12099706,2],[15254298,1],[13789470,1],[1929128,2]],mp=["KS-EL 5A","GF-PO 110","FD-BR 1","SI-EG 3","F-SK 2017","MZ-RT 1369","B-AN 333","KS-ZF 33","HU-PA 42","F-AB 1234","DA-HD 1080","OF-RT 333","GF-MA 3","HH-MA 1","FD-VIP 3","K-OE 1337"],fl=[["Pl\xFCsch-Logistik","Wir liefern Mini Adams in ganz Deutschland","#ffffff","#c8102e"],["Brunnenbau Sch\xF6nnbrun","Seit 1887 \u2013 Brunnen mit Gef\xFChl","#e8f1f8","#1d5fa8"],["Rettich-Express","Frisch vom Feld \u2013 13,69 \u20AC das Kilo","#f6f6ee","#3c8d2f"],["Pappkarton & S\xF6hne","Haufenweise Kartons seit 1972","#d8b98a","#5a3b1c"],["Elsa Fischtransporte","Kassel \xB7 frisch & k\xF6niglich","#ffffff","#1d3f9a"],["Bananensaft-Spedition","Gelb ist das neue Schnell","#fff6c0","#c79a00"],["Sprachstudio-Logistik","Wir bringen jede Durchsage an","#f0f0f0","#7a2ca0"],["Konfetti-Transporte","Vorsicht: Rutschgefahr beim \xD6ffnen","#ffffff","#e5307a"],["Ringtennis-Bedarf","Ringe, Netze, Leidenschaft","#eef6ff","#d45a00"],["Kanalpunkte-Kurier","Wetten, dass wir p\xFCnktlich sind?","#f4f4f4","#6c3fc4"],["Leitplanken-Lutz","Wir halten zusammen","#e6e6e6","#444444"],["Schnelle Pommes","Ohne R\xFCckfragen","#fff3d6","#d81e1e"]],gp=["Abstand halten!","Wie fahre ich? 0800-BRUNNEN","Ladung: 33.333 Rettiche","Rechts fahren ist Ehrensache","Mein Wischer zuckt auch","Gr\xFC\xDFe an die Polizei Gifhorn","Nicht hupen, Fahrer tr\xE4umt von Elsa"],ul=null;function ds(){return ul||(ul={body:new Map,glass:de.std({color:1317410,metalness:.6,roughness:.08,envMapIntensity:1.4}),detail:de.std({vertexColors:!0,roughness:.6,metalness:.15}),tail:de.std({color:4196360,emissive:16718354,emissiveIntensity:.55,roughness:.3}),brake:de.std({color:5245450,emissive:16722458,emissiveIntensity:3.2,roughness:.3}),blink:de.std({color:5583616,emissive:16753178,emissiveIntensity:3,roughness:.3}),blueOn:de.std({color:662118,emissive:2250239,emissiveIntensity:5,roughness:.3}),blueOff:de.std({color:1714790,emissive:660800,emissiveIntensity:.4,roughness:.3}),plates:new Map,trailers:new Map},ul)}function dl(i,e=null){let t=ds(),n=i+(e?":"+e.uuid:"");return t.body.has(n)||t.body.set(n,de.std({color:i,map:e,metalness:.45,roughness:.3,envMapIntensity:1.1})),t.body.get(n)}function vp(i){let e=ds();return e.plates.has(i)||e.plates.set(i,de.std({map:el(i),roughness:.6})),e.plates.get(i)}function xp(i){let e=ds();e.tail.emissiveIntensity=i?1.6:.55}var Ur=new Map;function yp(i){if(Ur.has(i))return Ur.get(i);let e=Nr[i],{L:t,half:n,H:s,belt:r,hood:o,ws:a,re:l,ce:c,rear:h,axles:u,wr:d,cl:f,nose:m}=e,v=h==="box",g=[[0,m-.13],[.06,m],[.3,m+.06],[o,r]];h==="sedan"?g.push([c,r+.05],[t-.16,r+.06],[t,r-.1]):g.push([at(o,t,.6),r+.02],[t-.06,r-.02],[t,r-.14]);let p=En(g),_=En([[0,.36],[.08,f+.07],[.28,f],[t-.3,f],[t-.06,f+.1],[t,.4]]),x=rl(_,u,d+.07,d),y=En([[0,n-.22],[.1,n-.08],[.4,n-.02],[.9,n],[t-.9,n],[t-.3,n-.03],[t,n-.1]]),I=[yi({u0:0,u1:t,w:y,b:_,bx:ol(x,.5,.72),t:p,tw:.9,bw:.95,n:4.5,segs:64,ring:24,L:t,H:s})],S=h==="sedan"?r+.07:r+.12,P=v?e.cargo+.02:c,R=[[o-.02,r+.01],[at(o,a,.5),at(r,s,.56)],[a,s-.01]];v?R.push([P,s-.01]):R.push([(a+l)/2,s],[l,s-.015],[at(l,c,.5),at(s,S,.55)],[c,S]);let b=En(R),M=V=>y(V)-.06,T={w:M,b:V=>p(V)-.05,t:b,tw:v?.95:.8,bw:1,n:3.4,L:t},k=yi({u0:o-.02,u1:P,...T,segs:36,ring:22,H:s});if(v)I.push(yi({u0:e.cargo,u1:t,w:V=>y(V)+.01,b:()=>r-.06,t:En([[e.cargo,s-.02],[e.cargo+.3,s],[t,s]]),tw:.97,bw:1,n:7,segs:24,ring:24,L:t,H:s})),e.alkoven?I.push(yi({u0:.45,u1:e.cargo+.2,w:()=>n+.02,b:En([[.45,s-.45],[1.2,s-.7],[e.cargo+.2,s-.72]]),t:()=>s,tw:.98,bw:1,n:6,segs:16,ring:24,L:t,H:s})):I.push(yi({u0:a-.05,u1:e.cargo+.05,w:V=>M(V)*.95+.02,b:V=>b(V)-.07,t:V=>b(V)+.015,tw:.95,bw:1,n:5,segs:10,ring:20,L:t,H:s}));else{let V=(K,be,fe)=>To(T,K,be,fe);I.push(Ao(V,(K,be)=>[at(a-.03,l+.02,be),at(.42,Math.PI-.42,K)],{ns:12,nt:16,lift:.006}))}let U=Dt(I),H=[],F=V=>V-t/2;for(let V of u)for(let K of[-1,1]){let be=n*.45,fe=new ze(d+.07,d+.07,n-be,14,1,!0,0,Math.PI);fe.rotateZ(Math.PI/2),fe.translate(K*(n+be)/2,d,F(V));let De=new un(d+.07,14,0,Math.PI);De.rotateY(Math.PI/2),De.translate(K*be,d,F(V)),H.push(xt(fe,789517),xt(De,789517));let Ne=new ze(d,d,.22,16);Ne.rotateZ(Math.PI/2),Ne.translate(K*(n-.13),d,F(V)),H.push(xt(Ne,1184274)),H.push(xt(Ro(d*.62,K*(n-.015),d,F(V),K,14),10133414))}H.push(xt(yt(n*1.7,.16,.06,0,f+.12,F(.03)),1776413)),H.push(xt(yt(n*1.75,.15,.06,0,f+.16,F(t-.03)),1776413)),H.push(xt(yt(n*.9,.12,.04,0,m-.1,F(.02)),2237222));for(let V of[-1,1]){H.push(xt(yt(.26,.09,.05,V*(n-.25),m-.03,F(.04)),14673646));let K=new lt(1,8,6);K.scale(.1,.06,.07),K.translate(V*(n+.06),r+.05,F(o+.25)),H.push(xt(K,1710620))}let N=Dt(H),j=[],G=h==="box"?.85:r-.08;for(let V of[-1,1])j.push(yt(.32,.12,.05,V*(n-.2),G,F(t)+.01));let ce=Dt(j),pe=V=>Dt([yt(.1,.06,.05,V*(n-.07),G+.11,F(t)+.012),yt(.08,.05,.05,V*(n-.08),m-.03,F(0)-.01),yt(.04,.04,.12,V*(n+.01),r-.15,F(.75))]),xe=new tt(.52,.112);xe.translate(0,h==="box"?.55:Math.max(f+.32,r-.32),F(t)+.035);let Ge=[yt(.42,.08,.22,-.22,s+.05,F((a+l)/2)),yt(.42,.08,.22,.22,s+.05,F((a+l)/2))],Ze={bodyGeo:U,glassGeo:k,detailGeo:N,tailGeo:ce,blinkL:pe(-1),blinkR:pe(1),plateGeo:xe,lightbarGeo:Ge};return Ur.set(i,Ze),Ze}var bu=16.5;function _p(){if(Ur.has("lkw"))return Ur.get("lkw");let i=h=>h-bu/2,e=yi({u0:0,u1:2.3,w:En([[0,1.18],[.12,1.24],[2.3,1.25]]),b:()=>.92,t:En([[0,3.35],[.2,3.62],[.8,3.75],[2.3,3.78]]),tw:.96,bw:1,n:8,segs:14,ring:28,L:bu,H:4}),t=[];t.push(xt(yt(2.2,1.05,.05,0,2.72,i(.06),-.06),1581096));for(let h of[-1,1])t.push(xt(yt(.04,.85,1,h*1.255,2.75,i(.75)),1581096));t.push(xt(yt(2.3,.35,.12,0,.75,i(.05)),2763308)),t.push(xt(yt(1.7,.9,.04,0,1.6,i(.01)),3093046)),t.push(xt(yt(2.4,.12,.35,0,3.4,i(.05),.25),1973792)),t.push(xt(yt(1,.45,5.2,0,.78,i(3.2)),2236964));for(let h of[-1,1]){let u=new ze(.3,.3,1.2,12);u.rotateX(Math.PI/2),u.translate(h*.95,.75,i(3.2)),t.push(xt(u,12172996)),t.push(xt(yt(.3,.12,.08,h*.85,1.25,i(.02)),15199989)),t.push(xt(yt(.08,.55,.06,h*1.38,2.6,i(.55)),1710618)),t.push(xt(yt(.05,.4,9,h*1.24,.95,i(9.3)),10133670))}let n=[[1.35,.52,.32],[4.9,.52,.55],[13.3,.48,.5],[14.6,.48,.5],[15.9,.48,.5]];for(let[h,u,d]of n)for(let f of[-1,1]){let m=new ze(u,u,d,16);m.rotateZ(Math.PI/2),m.translate(f*(1.25-d/2-.02),u,i(h)),t.push(xt(m,1184274)),t.push(xt(Ro(u*.6,f*1.24,u,i(h),f,14),9080726))}t.push(xt(yt(2.4,.15,.12,0,.6,i(16.45)),10133670)),t.push(xt(yt(2.4,.3,13.6,0,1.12,i(9.7)),2829358));let s=Dt(t),r=new Ue(2.55,2.75,13.6);r.translate(0,2.65,i(9.7));let o=Dt([yt(.4,.14,.05,-.95,1.05,i(16.5)+.02),yt(.4,.14,.05,.95,1.05,i(16.5)+.02)]),a=h=>Dt([yt(.14,.12,.05,h*1.17,1.05,i(16.5)+.025),yt(.12,.1,.05,h*1.05,1.25,i(0)-.02),yt(.04,.08,.16,h*1.27,1.25,i(1.9))]),l=new tt(.52,.112);l.translate(0,.85,i(16.5)+.03);let c={bodyGeo:e,detailGeo:s,trailerGeo:r,tailGeo:o,blinkL:a(-1),blinkR:a(1),plateGeo:l};return Ur.set("lkw",c),c}function Mp(i){let e=ds();if(!e.trailers.has(i)){let[t,n,s,r]=fl[i],o=de.std({map:sp(t,n,s,r),roughness:.7}),a=de.std({map:rp(gp[i%gp.length]),roughness:.7}),l=de.std({color:new Re(s),roughness:.75});e.trailers.set(i,[o,o,l,l,a,l])}return e.trailers.get(i)}var kr=null;function bp(){if(kr)return kr;let i=document.createElement("canvas");i.width=1024,i.height=256;let e=i.getContext("2d");e.fillStyle="#d9dde2",e.fillRect(0,0,1024,256);let t=n=>256-n/1.5*256;return e.fillStyle="#1b4ea3",e.fillRect(0,t(.86),1024,t(.42)-t(.86)),e.fillStyle="#d7e64a",e.fillRect(0,t(.88),1024,5),e.fillStyle="#ffffff",e.font="bold 54px Arial, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText("POLIZEI",512,(t(.86)+t(.42))/2+2),e.fillStyle="#1b4ea3",e.font="bold 24px Arial, sans-serif",e.fillText("Gifhorn",512,t(.98)),kr=new Bt(i),kr.colorSpace=ht,kr.anisotropy=4,kr}var pl=class{constructor(e,{color:t,plate:n,company:s}={}){let r=ds();this.kind=e,this.group=new ye,this.brake=!1,this.blinkDir=0,this.police=e==="polizei";let o=e==="polizei"?"kombi":e;if(e==="lkw"){let a=_p();this.length=bu,this.width=2.55,this.height=4;let l=t??Je([15921906,11540504,1920922,15250432,2236962,2976570,14343648]);this.cab=new D(a.bodyGeo,dl(l)),this.details=new D(a.detailGeo,r.detail);let c=s??Math.floor(Math.random()*fl.length);this.company=fl[c][0],this.trailer=new D(a.trailerGeo,Mp(c)),this.tail=new D(a.tailGeo,r.tail),this.blinkL=new D(a.blinkL,r.blink),this.blinkR=new D(a.blinkR,r.blink),this.plate=new D(a.plateGeo,vp(n??Je(mp))),this.group.add(this.cab,this.details,this.trailer,this.tail,this.blinkL,this.blinkR,this.plate),this.trailer.castShadow=!0,this.cab.castShadow=!0}else{let a=yp(o),l=Nr[o];this.length=l.L,this.width=l.half*2+.12,this.height=l.H;let c;this.police?c=dl(16777215,bp()):e==="wohnmobil"?c=dl(16053488):c=dl(t??Mo(p1,h=>h[1])[0]),this.body=new D(a.bodyGeo,c),this.body.castShadow=!0,this.glass=new D(a.glassGeo,r.glass),this.details=new D(a.detailGeo,r.detail),this.tail=new D(a.tailGeo,r.tail),this.blinkL=new D(a.blinkL,r.blink),this.blinkR=new D(a.blinkR,r.blink),this.plate=new D(a.plateGeo,vp(n??(this.police?"GF-3333":Je(mp)))),this.group.add(this.body,this.glass,this.details,this.tail,this.blinkL,this.blinkR,this.plate),this.police&&(this.bar=a.lightbarGeo.map(h=>new D(h,r.blueOff)),this.group.add(...this.bar))}this.blinkL.visible=!1,this.blinkR.visible=!1}setPoliceText(e){if(!this.police)return;if(!this.display){let r=document.createElement("canvas");r.width=512,r.height=96,this.displayCanvas=r,this.displayTex=new Bt(r),this.displayTex.colorSpace=ht;let o=Nr.kombi,a=de.basic({map:this.displayTex,toneMapped:!1});this.display=new D(new tt(.9,.17),a),this.display.position.set(0,o.H-.25,o.L/2-.02),this.display.rotation.x=-.35,this.group.add(this.display)}let t=this.displayCanvas.getContext("2d");t.fillStyle="#050505",t.fillRect(0,0,512,96),t.fillStyle="#ffb21a",t.font='bold 54px "Courier New", monospace',t.textAlign="center",t.textBaseline="middle";let n=(e||"POLIZEI GIFHORN").toUpperCase(),s=54;for(;t.measureText(n).width>490&&s>20;)s-=4,t.font=`bold ${s}px "Courier New", monospace`;t.fillText(n,256,50),this.displayTex.needsUpdate=!0}setBrake(e){e!==this.brake&&(this.brake=e,this.tail.material=e?ds().brake:ds().tail)}setBlink(e){this.blinkDir=e,e||(this.blinkL.visible=!1,this.blinkR.visible=!1)}updateLights(e,t=!1){let n=Math.sin(e*Math.PI*2*1.45)>0;if(this.blinkDir&&(this.blinkL.visible=this.blinkDir<0&&n,this.blinkR.visible=this.blinkDir>0&&n),this.bar){let s=ds(),r=Math.floor(e*7)%4;this.bar[0].material=t&&(r===0||r===2)?s.blueOn:s.blueOff,this.bar[1].material=t&&(r===1||r===3)?s.blueOn:s.blueOff}}};function Eu(i=!0,e=.18){if(i&&Math.random()<e)return"lkw";let t=Object.keys(Nr);return Mo(t,n=>Nr[n].weight)}function Ep(){for(let i of Object.keys(Nr))yp(i);_p();for(let i=0;i<fl.length;i++)Mp(i);bp()}var wu=[[150,205],[128,160],[112,138],[95,120]],Oi=1/3.6,m1=1,ml=class{constructor(e,t){this.scene=e,this.rain=t,this.group=new ye,this.group.name="Traffic",e.add(this.group),this.cars=[],this.oncoming=[],this.pool=new Map,this.difficulty=0,this.leftOpen=!1,this.grip=1,this.t=0,this.events=[],this.policeText=null}acquire(e,t){let n=this.pool.get(e)||[];this.pool.set(e,n);let s=n.find(r=>!r.inUse&&!t);return s||(s=new pl(e,t),n.push(s),this.group.add(s.group)),s.inUse=!0,s.group.visible=!0,s.setBrake(!1),s.setBlink(0),s}releaseVehicle(e){e.inUse=!1,e.group.visible=!1}reset(){for(let e of this.cars)this.releaseVehicle(e.v);for(let e of this.oncoming)this.releaseVehicle(e.v);this.cars=[],this.oncoming=[],this.events=[]}laneSpeed(e,t){if(t)return _e(e===2?86:80,e===2?92:89)*Oi;let[n,s]=wu[e];return _e(n,s+this.difficulty*15)*Oi}spawn(e,t,{kind:n,speed:s,behavior:r="normal",opts:o}={}){let a=n||Eu(t>=2,t===3?.3:.22),l=a==="lkw";l&&t<2&&(t=2+Math.round(Math.random()));let c=this.acquire(a,o),h={id:m1++,v:c,kind:a,truck:l,lane:t,x:Ce.laneCenter(t),s:e,speed:s??this.laneSpeed(t,l),len:c.length,w:c.width,v0:0,change:null,decideIn:_e(.5,2.5),brake:!1,passed:!1,behavior:r,sirens:r==="polizei",careless:pt(.08+this.difficulty*.18),wobble:Math.random()*10};return h.v0=h.speed,r==="polizei"&&c.setPoliceText?.(this.policeText),this.cars.push(h),this.place(h,e),h}spawnOncoming(e,t=!0){let n=Math.floor(Math.random()*4),s=Eu(n>=2,.2),r=this.acquire(s);r.group.rotation.y=Math.PI;let o=s==="lkw",a=o?_e(80,89)*Oi:_e(wu[n][0]-15,wu[n][1])*Oi;this.oncoming.push({v:r,s:e+(t?_e(700,1300):_e(100,1200)),x:ai(Ce.laneCenter(o?2+Math.round(Math.random()):n)),speed:a,len:r.length})}populate(e,t){this.reset();for(let n=0;n<18;n++){let s=wp(this.leftOpen),r=e+40+n*45+_e(0,30);this.laneFree(s,r,30)&&this.spawn(r,s)}for(let n=0;n<10;n++)this.spawnOncoming(e,!1)}laneFree(e,t,n){for(let s of this.cars)if(Co(s,e)&&Math.abs(s.s-t)<n+s.len)return!1;return!0}place(e,t){e.v.group.position.set(e.x,0,-(e.s-t))}update(e,t,n,s){this.t=t,this.events.length=0,this.difficulty=s.difficulty,this.leftOpen=s.leftOpen;let r=s.rain>.3;xp(r);let o=Math.round(at(15,32,this.difficulty));if(this.cars.length<o){let u=wp(this.leftOpen),d=n.s+_e(620,950);this.laneFree(u,d,60)&&this.spawn(d,u)}if(n.speed<34&&pt(e*.35)&&this.cars.length<o+4){let u=this.leftOpen?1:pt(.6)?0:1,d=n.s-_e(150,190);this.laneFree(u,d,40)&&this.spawn(d,u,{speed:_e(170,215)*Oi})}let a=this.cars,l={s:n.s,x:n.x,speed:n.speed,len:n.len,w:n.w,isPlayer:!0};for(let u of a){if(u.decideIn-=e,!u.change&&u.decideIn<=0&&(u.decideIn=_e(.6,1.6),this.decide(u,a,l)),u.change){let _=u.change;if(_.t+=e,_.t<_.delay)u.v.setBlink(_.to<_.from?-1:1);else{let x=We((_.t-_.delay)/_.dur,0,1);u.x=at(Ce.laneCenter(_.from),Ce.laneCenter(_.to),ls(0,1,x)),x>=.5&&(u.lane=_.to),x>=1&&(u.change=null,u.v.setBlink(0))}}let d=this.leader(u,a,l),f=u.truck?1.7:1.25+(u.careless?-.4:0),m=u.truck?.6:1.6,v=2.8,g=3,p=m*(1-Math.pow(u.speed/Math.max(1,u.v0),4));if(d){let _=Math.max(.1,d.s-u.s-(d.len+u.len)/2),x=u.speed-d.speed,y=g+Math.max(0,u.speed*f+u.speed*x/(2*Math.sqrt(m*v)));p-=m*Math.pow(y/_,2),_<4&&x>0&&(p=Math.min(p,-9))}p=We(p,-10,m),u.speed=Math.max(0,u.speed+p*e),u.brake=p<-1.2,u.v.setBrake(u.brake||u.speed<3),u.s+=u.speed*e}for(let u=0;u<a.length;u++)for(let d=u+1;d<a.length;d++){let f=a[u],m=a[d];if(Math.abs(f.x-m.x)>(f.w+m.w)/2-.2)continue;let v=m.s-f.s,g=(f.len+m.len)/2+.5;if(Math.abs(v)<g){let p=v>0?f:m,_=v>0?m:f;p.s=_.s-g,p.speed=Math.min(p.speed,_.speed)}}for(let u of a){let d=Math.abs(u.x-n.x),f=u.s-n.s,m=(u.w+n.w)/2-d,v=(u.len+n.len)/2-Math.abs(f);if(m>.08&&v>.05&&(f<0&&m>.6&&u.speed>n.speed?(u.s=n.s-(u.len+n.len)/2-.4,u.speed=Math.min(u.speed,n.speed*.95)):this.events.push({type:"crash",car:u,ds:f,dx:u.x-n.x,latOverlap:m,lonOverlap:v})),!u.passed&&f<-(u.len+n.len)/2){u.passed=!0;let g=d-(u.w+n.w)/2,p=n.speed-u.speed;g<.85&&g>-.05&&p>6&&this.events.push({type:"nearMiss",car:u,clearance:g,rel:p}),u.behavior==="polizei"&&this.events.push({type:"passPolice",car:u})}f>0&&(u.passed=!1)}let c=[];for(let u of a){let d=u.s-n.s;if(d<-240||d>1250){this.releaseVehicle(u.v);continue}if(c.push(u),this.place(u,n.s),u.v.group.rotation.y=u.change&&u.change.t>u.change.delay?u.change.to>u.change.from?-.035:.035:0,u.v.updateLights(t,u.sirens),r&&d>-10&&d<140){let f=-d+u.len/2;this.rain.emit(u.x,f,u.w,u.speed,u.truck?3:1)}}this.cars=c;let h=[];for(let u of this.oncoming){u.s-=u.speed*e;let d=u.s-n.s;if(d<-200){this.releaseVehicle(u.v),u.v.group.rotation.y=0;continue}u.v.group.position.set(u.x,0,-d),h.push(u)}for(this.oncoming=h;this.oncoming.length<11;)this.spawnOncoming(n.s,!0);return this.events}leader(e,t,n){let s=null,r=1/0,o=e.change&&e.change.t>=e.change.delay?[e.change.from,e.change.to]:[e.lane];for(let l of t){if(l===e)continue;let c=l.s-e.s;c<=0||c>220||c>=r||o.some(h=>Co(l,h))&&(s=l,r=c)}let a=n.s-e.s;return a>0&&a<r&&o.some(l=>Co(n,l))&&(s=n),s}decide(e,t,n){if(e.behavior==="elefant")return;let s=this.leader(e,t,n),r=e.truck?2:0;if(s&&e.lane>r&&s.s-e.s-(s.len+e.len)/2<70&&s.speed<e.v0-2.5){let a=e.lane-1;if(!(e.truck&&a<2)&&this.safe(e,a,t,n))return this.startChange(e,a)}if(e.lane<3&&!(e.truck&&e.lane>=3)){let o=e.lane===0&&this.leftOpen?.65:e.behavior==="schleicher"?.02:.25;if(pt(o)){let a=e.lane+1;if(this.laneClearAhead(e,a,t,n,90)&&this.safe(e,a,t,n))return this.startChange(e,a)}}if(e.careless&&pt(.04+this.difficulty*.12)){let o=e.lane+(pt(.5)?-1:1);o>=r&&o<=3&&this.safe(e,o,t,n,!0)&&this.startChange(e,o)}}laneClearAhead(e,t,n,s,r){for(let o of[...n,s]){if(o===e)continue;let a=o.s-e.s;if(a>-10&&a<r&&Co(o,t))return!1}return!0}safe(e,t,n,s,r=!1){for(let o of[...n,s]){if(o===e||!Co(o,t)&&!(o.change&&o.change.to===t))continue;let a=o.s-e.s,l=(o.len+e.len)/2;if(a>=0){if(a-l<Math.max(8,e.speed*(r?.3:.6)))return!1}else{let c=-a-l,h=o.speed-e.speed,u=o.isPlayer?r?6:14:8;if(c<u+Math.max(0,h)*(r?.6:2.2))return!1}}return!0}startChange(e,t){e.change={from:e.lane,to:t,t:0,delay:e.careless?_e(.15,.5):_e(.9,1.6),dur:e.truck?_e(4,5.5):_e(2.4,3.6)}}megafon(e){let t=0;for(let n of this.cars){let s=n.s-e.s;if(s>0&&s<160&&Math.abs(n.x-e.x)<2.6&&!n.change){let o=[n.lane-1,n.lane+1].filter(a=>a>=(n.truck?2:0)&&a<=3).sort((a,l)=>Math.abs(Ce.laneCenter(l)-e.x)-Math.abs(Ce.laneCenter(a)-e.x))[0];o!==void 0&&(n.change={from:n.lane,to:o,t:0,delay:.3,dur:1.8},t++)}}return t}elefantenrennen(e){let t=e+420;for(let r of this.cars)r.s>t-60&&r.s<t+60&&r.lane>=2&&(this.releaseVehicle(r.v),r.s=-1e9);this.cars=this.cars.filter(r=>r.s>-1e8);let n=this.spawn(t,3,{kind:"lkw",speed:84*Oi,behavior:"elefant"}),s=this.spawn(t+6,2,{kind:"lkw",speed:84.6*Oi,behavior:"elefant"});return setTimeout(()=>{s&&(s.behavior="normal")},26e3),[n,s]}police(e,t){this.policeText=t;let n=this.leftOpen?1:0,s=this.spawn(e-170,n,{kind:"polizei",speed:185*Oi,behavior:"polizei"});return s.v0=185*Oi,s}nearby(e,t=130){let n=[];for(let s of this.cars){let r=s.s-e.s;r>-25&&r<t&&n.push({dx:s.x,ds:r,len:s.len,w:s.w,kind:s.kind,brake:s.brake})}return n}};function Co(i,e){let t=Ce.laneCenter(e),n=Math.max(i.x-i.w/2,t-1.875);return Math.min(i.x+i.w/2,t+1.875)-n>.35}function wp(i){let e=Math.random();return i?e<.08?0:e<.32?1:e<.62?2:3:e<.17?0:e<.4?1:e<.66?2:3}var _i={skin:14263415,skinDark:13208418,black:1315862,shirt:1447448,hair:3811356,beard:2825492,pants:3421498,shoe:986896,white:16250352,mouth:7023141},Su=null;function fs(i,e,{sheen:t=.9,rough:n=.95}={}){Su||(Su=tl(11));let s=new ri({color:i,roughness:n,metalness:0,sheen:t,sheenRoughness:.55,sheenColor:new Re(i).lerp(new Re(16777215),.35),bumpMap:Su,bumpScale:.6});return e?vi(s):s}function Bs(i,e,t={}){let n=new ft({color:i,roughness:.4,metalness:0,...t});return e?vi(n):n}function Po(i,e,t,n=10){return new D(new Ls(i,e,6,n),t)}function wn(i,e,t=18,n=14){return new D(new lt(i,t,n),e)}function Sp({curved:i=!0}={}){let e=new ye;e.name="MiniAdam";let t=fs(_i.skin,i),n=fs(_i.skinDark,i),s=fs(_i.shirt,i,{sheen:.6}),r=fs(_i.black,i,{sheen:.5}),o=fs(_i.hair,i,{sheen:1,rough:1}),a=fs(_i.beard,i,{sheen:1,rough:1}),l=fs(_i.pants,i,{sheen:.7}),c=fs(_i.shoe,i,{sheen:.4}),h=Bs(_i.white,i,{roughness:.25}),u=Bs(657930,i,{roughness:.15}),d=Bs(_i.mouth,i,{roughness:.6}),f=Bs(1710618,i,{roughness:.35,metalness:.4}),m=Bs(3947580,i,{roughness:.8,metalness:.3}),v=Dr({w:256,h:256}),g=new ft({map:v,transparent:!0,roughness:.9,alphaTest:.2});i&&vi(g);let p=new ye;p.name="body",e.add(p);let _=Po(.15,.12,s,14);_.scale.set(1.08,1,.86),_.position.y=.43,p.add(_);let x=new D(new ze(.163,.163,.16,20,1,!0,-.62,1.24),g);x.scale.set(1.08,1,.86),x.position.set(0,.45,0),x.rotation.y=0,p.add(x);let y=new ze(.062,.07,.09,12),I=new D(y,s),S=new D(y,s),P=new ye,R=new ye;P.position.set(-.165,.53,0),R.position.set(.165,.53,0),p.add(P,R);for(let[Y,le,ie]of[[P,I,-1],[R,S,1]]){le.position.set(ie*.015,-.03,0),le.rotation.z=ie*.25,Y.add(le);let Ie=Po(.045,.12,t);Ie.position.set(ie*.03,-.11,0),Ie.rotation.z=ie*.2,Y.add(Ie);let me=new ye;me.position.set(ie*.05,-.205,0);let A=wn(.056,t);A.scale.set(1,.95,.85);let E=wn(.024,t);E.position.set(-ie*.03,.02,.035),me.add(A,E),Y.add(me),Y.userData.hand=me}let b=new ye,M=new D(new ze(.016,.012,.13,12),f);M.position.y=-.02;let T=wn(.03,m,14,10);T.position.y=.065,b.add(M,T),b.position.set(0,.02,.03),R.userData.hand.add(b);let k=new ye;p.add(k);let U=new ye,H=new ye;U.position.set(-.075,.29,0),H.position.set(.075,.29,0),k.add(U,H);for(let Y of[U,H]){let le=Po(.072,.13,l);le.position.y=-.11,Y.add(le);let ie=wn(.075,c);ie.scale.set(1,.7,1.35),ie.position.set(0,-.245,.03),Y.add(ie),Y.userData.shoe=ie,Y.userData.thigh=le}let F=new ye;F.position.y=.745,p.add(F);let N=wn(.16,t,28,22);N.scale.set(1,.96,.95),F.add(N);for(let Y of[-1,1]){let le=wn(.035,t);le.scale.set(.6,1,.8),le.position.set(Y*.158,-.005,-.01),F.add(le)}let j=[[0,0,-.13,.085],[-.08,-.02,-.12,.075],[.08,-.02,-.12,.075],[-.13,.01,-.06,.07],[.13,.01,-.06,.07],[-.145,-.04,0,.055],[.145,-.04,0,.055],[-.05,-.07,-.13,.07],[.05,-.07,-.13,.07],[0,.05,-.12,.08]];for(let[Y,le,ie,Ie]of j){let me=wn(Ie,o,12,10);me.position.set(Y,le,ie),me.scale.set(1,.9,.9),F.add(me)}let G=new D(new lt(.168,26,16,Math.PI/2-1.35,2.7,Math.PI*.53,Math.PI*.4),a);G.scale.set(1,1,1),F.add(G);let ce=wn(.075,a);ce.scale.set(1.25,.8,.9),ce.position.set(0,-.12,.08),F.add(ce);for(let Y of[-1,1]){let le=wn(.05,a,10,8);le.position.set(Y*.13,-.05,.05),le.scale.set(.8,1.4,1),F.add(le)}let pe=Po(.022,.07,a,8);pe.rotation.z=Math.PI/2,pe.position.set(0,-.045,.152),F.add(pe);let xe=wn(.026,d,12,8);xe.scale.set(1.3,.55,.5),xe.position.set(0,-.078,.15),F.add(xe);let Ge=wn(.043,n,16,12);Ge.scale.set(1.05,.95,.9),Ge.position.set(0,-.005,.165),F.add(Ge);let Ze=new ye;F.add(Ze);for(let Y of[-1,1]){let le=wn(.034,h,16,12);le.scale.set(.9,1.1,.5),le.position.set(Y*.055,.045,.142);let ie=wn(.016,u,12,10);ie.position.set(Y*.004,-.004,.158),ie.scale.set(1,1.2,.5);let Ie=wn(.005,h,6,6);Ie.position.set(Y*.004+.006,.006,.166),Ze.add(le,ie,Ie)}for(let Y of[-1,1]){let le=Po(.011,.045,o,6);le.rotation.z=Math.PI/2+Y*.18,le.position.set(Y*.058,.098,.135),F.add(le)}let V=new ye;V.position.y=.025,F.add(V);let K=new D(new lt(.172,26,14,0,Math.PI*2,0,Math.PI*.47),r);K.scale.set(1,.9,1),V.add(K);let be=new D(new ze(.173,.173,.03,26,1,!0),r);be.position.y=.005,V.add(be);let fe=new Wn;fe.moveTo(-.15,0),fe.quadraticCurveTo(-.15,.16,0,.17),fe.quadraticCurveTo(.15,.16,.15,0),fe.lineTo(-.15,0);let De=new D(new gi(fe,{depth:.012,bevelEnabled:!0,bevelThickness:.005,bevelSize:.006,bevelSegments:2}),r);De.rotation.x=Math.PI/2-.12,De.position.set(0,0,.12),V.add(De);let Ne=wn(.018,r,10,8);Ne.position.y=.155,V.add(Ne);let Ve=new D(new ze(.176,.176,.1,20,1,!0,-.5,1),g);Ve.position.y=.065,V.add(Ve);let ot=Bs(14155551,i,{roughness:.6,emissive:3820032,emissiveIntensity:.25}),se=Bs(14211288,i,{roughness:.2,metalness:.6}),he=new ye,L=new D(new ze(.168,.165,.2,18,1,!0),ot);L.scale.set(1.08,1,.88),L.position.y=.43,he.add(L);for(let Y of[.38,.47]){let le=new D(new ze(.17,.17,.022,18,1,!0),se);le.scale.set(1.08,1,.88),le.position.y=Y,he.add(le)}he.visible=!1,p.add(he),e.traverse(Y=>{Y.isMesh&&(Y.castShadow=!0,Y.receiveShadow=!1)});let Pe={root:e,body:p,head:F,armL:P,armR:R,legL:U,legR:H,mic:b,vest:he,eyes:Ze,pose:"stand",setVest(Y){he.visible=!!Y},setPose(Y){Pe.pose=Y,b.visible=Y!=="drive",Y==="drive"?(U.rotation.x=-1.45,H.rotation.x=-1.45,U.position.y=H.position.y=.3,P.rotation.set(-1.15,0,.12),R.rotation.set(-1.15,0,-.12)):(U.rotation.x=H.rotation.x=0,P.rotation.set(0,0,.18),R.rotation.set(-1.9,.35,-.35))},animate(Y,le={}){let ie=le.wave||0,Ie=le.steer||0;if(F.rotation.y=(le.look||0)*.6+Math.sin(Y*.7)*.05,F.rotation.z=Math.sin(Y*1.3)*.03-Ie*.12,F.position.y=.745+Math.sin(Y*2.2)*.004,Pe.pose==="drive"){if(P.rotation.z=.12+Ie*.25,R.rotation.z=-.12+Ie*.25,P.rotation.x=-1.15-Ie*.12,R.rotation.x=-1.15+Ie*.12,ie>0){let me=1-ie;R.rotation.set(.2*ie-1.15*me,0,-.12*me+(2.54+Math.sin(Y*9)*.3)*ie)}}else{P.rotation.z=.18+Math.sin(Y*1.1)*.03,ie>0&&P.rotation.set(-.3*ie,0,.18+2.4*ie+Math.sin(Y*9)*.3*ie);let me=le.talk||0;R.rotation.x=-1.9+Math.sin(Y*6)*.04*me}}};return Pe.setPose("stand"),Pe}var Io=new C;function qn(i,e,t,n,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;Io.copy(e),Io[n]=0,Io.normalize();let c=.5*o/(o+a),h=1-Io.angleTo(i)/l;return Math.sign(Io[t])===1?h*c:a/(o+a)+c+c*(1-h)}var ps=class extends Ue{constructor(e=1,t=1,n=1,s=2,r=.1){if(s=s*2+1,r=Math.min(e/2,t/2,n/2,r),super(1,1,1,s,s,s),s===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let a=new C,l=new C,c=new C(e,t,n).divideScalar(2).subScalar(r),h=this.attributes.position.array,u=this.attributes.normal.array,d=this.attributes.uv.array,f=h.length/6,m=new C,v=.5/s;for(let g=0,p=0;g<h.length;g+=3,p+=2)switch(a.fromArray(h,g),l.copy(a),l.x-=Math.sign(l.x)*v,l.y-=Math.sign(l.y)*v,l.z-=Math.sign(l.z)*v,l.normalize(),h[g+0]=c.x*Math.sign(a.x)+l.x*r,h[g+1]=c.y*Math.sign(a.y)+l.y*r,h[g+2]=c.z*Math.sign(a.z)+l.z*r,u[g+0]=l.x,u[g+1]=l.y,u[g+2]=l.z,Math.floor(g/f)){case 0:m.set(1,0,0),d[p+0]=qn(m,l,"z","y",r,n),d[p+1]=1-qn(m,l,"y","z",r,t);break;case 1:m.set(-1,0,0),d[p+0]=1-qn(m,l,"z","y",r,n),d[p+1]=1-qn(m,l,"y","z",r,t);break;case 2:m.set(0,1,0),d[p+0]=1-qn(m,l,"x","z",r,e),d[p+1]=qn(m,l,"z","x",r,n);break;case 3:m.set(0,-1,0),d[p+0]=1-qn(m,l,"x","z",r,e),d[p+1]=1-qn(m,l,"z","x",r,n);break;case 4:m.set(0,0,1),d[p+0]=1-qn(m,l,"x","y",r,e),d[p+1]=1-qn(m,l,"y","x",r,t);break;case 5:m.set(0,0,-1),d[p+0]=qn(m,l,"x","y",r,e),d[p+1]=1-qn(m,l,"y","x",r,t);break}}};var Yn={length:4.69,width:1.85,height:1.443,wheelR:.335,frontAxleZ:.84-4.69/2,rearAxleZ:3.715-4.69/2,trackHalf:.79,plate:"F-LV 333"},rb=new C(-.37,1.2,.27),Lo=Yn.length,Ap=[.84,3.715],Ru=En([[0,.5],[.03,.56],[.1,.625],[.2,.675],[.45,.73],[.8,.79],[1.2,.86],[1.52,.92],[2.4,.965],[3.3,.995],[3.95,1.03],[4.25,1.05],[4.55,1.055],[4.64,1.04],[4.69,.95]]),Rp=En([[0,.31],[.06,.22],[.15,.18],[.5,.17],[4.3,.18],[4.6,.25],[4.69,.42]]),g1=rl(Rp,Ap,.405,.335),v1=En([[0,.6],[.08,.77],[.25,.86],[.6,.905],[1.2,.925],[3.6,.925],[4.3,.9],[4.6,.845],[4.69,.77]]),x1=En([[1.48,.93],[1.7,1.04],[2,1.2],[2.25,1.35],[2.5,1.415],[2.8,1.44],[3.1,1.44],[3.4,1.415],[3.7,1.3],[3.95,1.17],[4.15,1.075],[4.24,1.045]]),y1=En([[1.48,.8],[1.8,.84],[3.2,.85],[4,.8],[4.24,.74]]);function bt(i){return i-Lo/2}var Cp={w:v1,b:Rp,t:Ru,tw:.9,bw:.94,n:4.6,L:Lo,bx:ol(g1,.48,.7)},_1=3.2,M1=.76,Pp={w:y1,b:i=>Ru(i)-.05,t:x1,tw:M1,bw:1,n:_1,L:Lo},b1=(i,e,t)=>To(Cp,i,e,t),Au=(i,e,t)=>To(Pp,i,e,t),zt=(i,e,t)=>i+(e-i)*t,Hr=.34,Br=(i,e)=>i>0?e:Math.PI-e,E1=[[.05,1.24],[.085,1],[.13,.86],[.24,.8],[.4,.76]],w1=[[.03,1.2],[.025,.86],[.05,.54],[.16,.55],[.4,.7]];function Tp(i,e){let t=Math.min(i.length-1.000001,Math.max(0,e*(i.length-1))),n=Math.floor(t),s=t-n,r=i[Math.max(0,n-1)],o=i[n],a=i[n+1],l=i[Math.min(i.length-1,n+2)],c=h=>.5*(2*o[h]+(-r[h]+a[h])*s+(2*r[h]-5*o[h]+4*a[h]-l[h])*s*s+(-r[h]+3*o[h]-3*a[h]+l[h])*s*s*s);return[c(0),c(1)]}function S1(i,e){let t=Tp(E1,e),n=Tp(w1,e);return[zt(n[0],t[0],i),zt(n[1],t[1],i)]}function Tu(i,e){let t=Hr,n=Math.PI/2,s=new C,r=Math.abs(e);for(let o=0;o<30;o++){let a=(t+n)/2;Au(i,a,s),s.x>r?t=a:n=a}return Au(i,(t+n)/2,s).y}function Ip(){let i=new ye;i.name="Tesla";let e=de.phys({color:395016,metalness:.5,roughness:.34,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:1.25}),t=de.phys({color:329740,metalness:.25,roughness:.04,transparent:!0,opacity:.74,envMapIntensity:2.6,depthWrite:!1}),n=de.std({color:723724,roughness:.8,side:gt}),s=de.std({color:1316118,roughness:.55}),r=de.phys({color:197380,metalness:.3,roughness:.12,clearcoat:1,clearcoatRoughness:.08,side:gt}),o=de.std({color:13162214,emissive:15397887,emissiveIntensity:1.1,roughness:.15,metalness:.2,side:gt}),a=de.phys({color:11450047,metalness:1,roughness:.28,clearcoat:1,clearcoatRoughness:.04,side:gt}),l=de.phys({color:790550,metalness:.5,roughness:.1,clearcoat:1,side:gt}),c=de.std({color:4851206,emissive:16716820,emissiveIntensity:.9,roughness:.25,side:gt}),h=de.std({color:1776414,roughness:.85}),u=de.basic({color:8365256}),d=yi({u0:0,u1:Lo,...Cp,segs:150,ring:44,H:1.5}),f=new D(d,e);f.castShadow=!0,i.add(f);let m=yi({u0:1.48,u1:4.24,...Pp,segs:70,ring:32,H:1.5}),v=new D(m,t);v.renderOrder=2,i.add(v);let g=[],p=(ee,ne)=>Ao(Au,ee,ne);for(let ee of[-1,1])g.push(p((ne,re)=>[zt(zt(1.5,2.25,re),zt(1.6,2.36,re),ne),Br(ee,zt(-.74,Hr+.04,re))],{ns:2,nt:18,lift:.005})),g.push(p((ne,re)=>[zt(2.76,2.88,ne),Br(ee,zt(-.74,Hr+.04,re))],{ns:2,nt:14,lift:.005})),g.push(p((ne,re)=>[zt(zt(4,3.62,re),4.24,ne),Br(ee,zt(-.74,Hr+.04,re))],{ns:8,nt:14,lift:.005})),g.push(p((ne,re)=>[zt(1.52,4.1,re),Br(ee,zt(-.86,-.66,ne))],{ns:2,nt:30,lift:.004}));g.push(p((ee,ne)=>[zt(2.3,4.24,ne),zt(Hr,Math.PI-Hr,ee)],{ns:18,nt:34,lift:.004}));let _=new D(Dt(g),r);_.castShadow=!0,i.add(_);let x=[];for(let ee of Ap)for(let ne of[-1,1]){let re=new ze(.405,.405,.5,22,1,!0,0,Math.PI);re.rotateZ(Math.PI/2),re.translate(ne*.665,.335,bt(ee));let ke=new un(.405,22,0,Math.PI);ke.rotateY(Math.PI/2),ke.translate(ne*.415,.335,bt(ee)),x.push(re,ke)}i.add(new D(Dt(x),n));let y=new D(Dt([yt(.95,.07,.05,0,.3,bt(.02)),yt(1.1,.06,.05,0,.34,bt(4.62))]),s);i.add(y);let I=(ee,ne)=>Ao(b1,ee,ne),S=[],P=[],R=[],b=[];for(let ee of[-1,1]){let ne=(re,ke)=>{let[te,ve]=S1(re,ke);return[te,Br(ee,ve)]};S.push(I(ne,{ns:8,nt:24,lift:.004}));for(let[re,ke]of[[.34,.1],[.58,.11]])P.push(I((te,ve)=>ne(.4+.24*te*Math.cos(ve*Math.PI*2),re+ke*te*Math.sin(ve*Math.PI*2)),{ns:3,nt:18,lift:.006}));R.push(I((re,ke)=>ne(zt(.8,.94,re),zt(.08,.95,ke)),{ns:2,nt:22,lift:.007})),b.push(I((re,ke)=>[zt(4.4,4.672,ke),Br(ee,zt(zt(.5,.36,ke),zt(.78,1,ke),re))],{ns:6,nt:14,lift:.006}))}i.add(new D(Dt(S),a)),i.add(new D(Dt(P),l)),i.add(new D(Dt(R),o));let M=new D(Dt(b),c);i.add(M);let T=de.std({map:el(Yn.plate),roughness:.5}),k=new tt(.52,.112),U=new D(k,T);U.position.set(0,.36,bt(0)-.012),U.rotation.y=Math.PI;let H=new D(k,T);H.position.set(0,.62,bt(Lo)+.004),i.add(U,H);let F=new D(new tt(.34,.34),de.std({map:Dr({w:256,h:256}),transparent:!0,roughness:.4,alphaTest:.3}));F.rotation.x=-Math.PI/2+.08,F.position.set(0,Ru(4.42)+.006,bt(4.42)),i.add(F);let N=[],j=[],G=bt(1.8);for(let ee of[-1,1]){let ne=ee*1,re=1,ke=new lt(1,20,12,Math.PI,Math.PI);ke.scale(.115,.064,.09),ke.translate(ne,re,G),N.push(ke);let te=new gn(1,.06,6,28);te.scale(.112,.062,.12),te.translate(ne,re,G+.002),N.push(te),N.push(yt(.13,.035,.07,ee*.885,.965,G-.005,0,0,ee*.25));let ve=new un(1,28);ve.scale(.104,.055,1),ve.translate(ne,re,G+.004),j.push(ve)}let ce=Dt(N.map(ee=>ee.toNonIndexed()));i.add(new D(ce,e)),i.add(new D(Dt(j),de.std({color:10465988,metalness:1,roughness:.06})));let pe=cp(Yn.wheelR,.235,24),xe=de.std({color:1118481,roughness:.9}),Ge=de.std({map:tp(),roughness:.45,metalness:.5}),Ze=[];for(let ee of[Yn.frontAxleZ,Yn.rearAxleZ])for(let ne of[-1,1]){let re=new ye;re.position.set(ne*Yn.trackHalf,Yn.wheelR,ee);let ke=new D(pe,xe);ke.castShadow=!0;let te=new D(Ro(Yn.wheelR*.7,ne*.119,0,0,ne),Ge);re.add(ke,te),i.add(re),Ze.push(re)}let V=(ee,ne,re,ke,te,ve,qe=0,Ye=.03)=>{let Le=new ps(ee,ne,re,3,Math.min(Ye,ee/2-.001,ne/2-.001,re/2-.001));return qe&&Le.rotateX(qe),Le.translate(ke,te,ve),Le},K=[];K.push(V(1.56,.2,.42,0,.82,bt(1.72),0,.05));for(let ee of[-1,1])K.push(V(.5,.12,.5,ee*.37,.5,bt(2.72),0,.04)),K.push(V(.5,.64,.12,ee*.37,.86,bt(3),-.2,.05)),K.push(V(.27,.19,.1,ee*.37,1.25,bt(3.07),-.1,.045));K.push(V(1.36,.16,.5,0,.5,bt(3.62),0,.04)),K.push(V(1.36,.55,.12,0,.82,bt(3.92),-.18,.05)),K.push(V(.22,.2,.8,0,.55,bt(2.6),0,.04));let be=new D(Dt(K),h);i.add(be);let fe=new D(new tt(.33,.2),u);fe.position.set(0,1,bt(1.93)),fe.rotation.x=-.2,i.add(fe);let De=new D(new gn(.17,.022,10,28),h);De.position.set(-.37,.9,bt(2.15)),De.rotation.x=-.35,i.add(De);let Ne=Sp({curved:!0});Ne.setPose("drive"),Ne.root.position.set(-.37,.4,bt(2.62)),Ne.root.rotation.y=Math.PI,i.add(Ne.root);let Ve=new D(new ze(.2,.22,.07,18),de.phys({color:11538987,roughness:.9,sheen:1,sheenColor:new Re(16737920)}));Ve.position.set(-.37,.59,bt(2.72)),i.add(Ve);let ot=new D(new ze(.18,.2,.07,18),de.phys({color:1920928,roughness:.9,sheen:1,sheenColor:new Re(7842047)}));ot.position.set(-.37,.655,bt(2.71)),i.add(ot);let se=new Tr(16773597,0,2.2,1.5);se.position.set(-.2,1.3,bt(2.4)),i.add(se);let he=[],L=2.5,Pe=Tu(L,0),Y=new ze(.05,.055,.012,20);Y.translate(0,Pe+.004,bt(L)),he.push(Y);let le=new ze(.012,.016,.03,10);le.translate(0,Pe+.024,bt(L)),he.push(le),he.push(V(.12,.068,.1,0,Pe+.07,bt(L),0,.012));let ie=3.45;for(let ee=0;ee<3;ee++){let ne=-.18+ee*.18,re=Tu(ie,ne),ke=new ze(.03,.034,.014,16);ke.translate(ne,re+.005,bt(ie)),he.push(ke);let te=new ze(.005,.009,.17,8);te.translate(0,.085,0),te.rotateX(.22),te.translate(ne,re+.01,bt(ie)),he.push(te);let ve=new lt(.009,8,6);ve.translate(0,.17,0),ve.rotateX(.22),ve.translate(ne,re+.01,bt(ie)),he.push(ve)}i.add(new D(Dt(he.map(ee=>ee.index?ee.toNonIndexed():ee)),s));let Ie=new D(new un(.025,14),de.std({color:2241348,metalness:.9,roughness:.1}));Ie.position.set(0,Pe+.07,bt(L)-.051),Ie.rotation.y=Math.PI,i.add(Ie);let me=new D(new lt(.008,8,6),de.basic({color:16720418}));me.position.set(.04,Pe+.092,bt(L)-.048),i.add(me);let A=new ye,E=de.std({color:15921906,roughness:.5}),W=new D(new ze(.29,.27,.035,28),E);W.rotation.x=-.35,W.position.y=.16;let J=new D(new ze(.025,.03,.16,8),E);J.position.y=.08,A.add(W,J),A.position.set(0,Tu(3.05,0),bt(3.05)),A.visible=!1,i.add(A),i.traverse(ee=>{ee.isMesh&&ee!==v&&(ee.castShadow=!0)});let ae=0,Q=!1;return{root:i,adam:Ne,glass:t,wheels:Ze,cabinLight:se,recLed:me,setStarlink(ee){A.visible=!!ee},setVest(ee){Ne.setVest(ee)},setBrake(ee){ee!==Q&&(Q=ee,c.emissiveIntensity=ee?3.2:.9)},update(ee,ne,re,ke){ae-=ne*ee/Yn.wheelR;for(let te=0;te<Ze.length;te++)Ze[te].rotation.x=ae,te<2&&(Ze[te].rotation.y=-re*.35);me.visible=Math.sin(ke*4)>-.2}}}var on=256,gl=class{constructor(){this.group=new ye,this.group.name="NOMI",this.canvas=document.createElement("canvas"),this.canvas.width=on,this.canvas.height=on,this.ctx=this.canvas.getContext("2d"),this.tex=new Bt(this.canvas),this.tex.colorSpace=ht;let e=.066,t=new D(new ze(.03,.042,.03,24),new ft({color:1381914,metalness:.6,roughness:.35}));t.position.y=.015,this.group.add(t),this.head=new ye,this.head.position.y=.03+e*.92,this.group.add(this.head);let n=new D(new lt(e,40,28),new ri({color:460810,metalness:.3,roughness:.18,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:1.6}));this.head.add(n);let s=.72,r=new lt(e*1.004,32,24,Math.PI/2-s,2*s,Math.PI/2-s,2*s),o=r.attributes.position,a=r.attributes.uv,l=e*Math.sin(s)*2;for(let h=0;h<o.count;h++)a.setXY(h,o.getX(h)/l+.5,o.getY(h)/l+.5);this.faceMat=new hn({map:this.tex,toneMapped:!1});let c=new D(r,this.faceMat);this.head.add(c),this.ring=new D(new gn(.036,.003,8,32),new hn({color:6737151,toneMapped:!1,transparent:!0,opacity:.6})),this.ring.rotation.x=Math.PI/2,this.ring.position.y=.031,this.group.add(this.ring),this.mood="idle",this.moodTimer=0,this.talk=0,this.talkTimer=0,this.yaw=0,this.targetYaw=0,this.lookX=0,this.lookTarget=0,this.blink=0,this.nextBlink=2,this.idleYaw=-.06,this.bounce=0,this.lastDraw=-1,this.draw(0)}setMood(e,t=2.5){this.mood=e,this.moodTimer=t,this.bounce=1}speak(e=2.5){this.talkTimer=Math.max(this.talkTimer,e),this.bounce=1}glance(e,t=1.5){this.lookTarget=We(e,-1,1),this.glanceTimer=t}update(e,t,n){this.moodTimer>0&&(this.moodTimer-=e,this.moodTimer<=0&&(this.mood="idle")),this.glanceTimer>0&&(this.glanceTimer-=e,this.glanceTimer<=0&&(this.lookTarget=0)),this.talkTimer=Math.max(0,this.talkTimer-e),this.talk=In(this.talk,this.talkTimer>0?1:0,8,e),this.targetYaw=this.talkTimer>0?n:this.idleYaw+this.lookTarget*.7+Math.sin(t*.37)*.06,this.yaw=In(this.yaw,this.targetYaw,5,e),this.lookX=In(this.lookX,this.talkTimer>0?0:this.lookTarget,6,e),this.bounce=Math.max(0,this.bounce-e*2.2),this.head.rotation.y=this.yaw,this.head.rotation.x=-.24+Math.sin(t*9)*.03*this.talk-Math.sin(this.bounce*Math.PI)*.12,this.head.position.y=.03+.066*.92+Math.sin(this.bounce*Math.PI*2)*.006,this.ring.material.opacity=.35+.4*this.talk+.15*Math.sin(t*2),this.nextBlink-=e,this.nextBlink<=0&&(this.blink=1,this.nextBlink=2.5+Math.random()*4),this.blink=Math.max(0,this.blink-e*7),t-this.lastDraw>1/30&&(this.lastDraw=t,this.draw(t),this.tex.needsUpdate=!0)}draw(e){let t=this.ctx;t.clearRect(0,0,on,on);let n=t.createRadialGradient(on*.42,on*.36,10,on/2,on/2,on*.5);n.addColorStop(0,"#16202a"),n.addColorStop(.7,"#06080b"),n.addColorStop(1,"#030405"),t.fillStyle=n,t.beginPath(),t.arc(on/2,on/2,on*.49,0,Math.PI*2),t.fill();let s=this.mood,r=on/2+this.lookX*34,o=on/2+4+Math.sin(e*10)*4*this.talk,a=46;t.save(),t.shadowColor="rgba(160,220,255,0.9)",t.shadowBlur=14,t.strokeStyle="#ffffff",t.fillStyle="#ffffff",t.lineWidth=11,t.lineCap="round",t.lineJoin="round";let l=s==="idle"||s==="talk"?this.blink:0;for(let c of[-1,1]){let h=r+c*a;this.drawEye(t,s,h,o,c,l,e)}t.restore(),t.fillStyle="rgba(255,255,255,0.07)",t.beginPath(),t.ellipse(on*.38,on*.26,on*.22,on*.09,-.5,0,Math.PI*2),t.fill()}drawEye(e,t,n,s,r,o,a){let c=70;switch(t){case"happy":e.beginPath(),e.arc(n,s+12,24,Math.PI*1.1,Math.PI*1.9),e.stroke();return;case"love":this.heart(e,n,s,26+Math.sin(a*8)*3);return;case"dizzy":{e.beginPath();for(let h=0;h<Math.PI*5;h+=.2){let u=3+h*2.6,d=n+Math.cos(h+a*6*r)*u,f=s+Math.sin(h+a*6*r)*u;h===0?e.moveTo(d,f):e.lineTo(d,f)}e.lineWidth=7,e.stroke();return}case"surprised":e.beginPath(),e.arc(n,s,30,0,Math.PI*2),e.stroke(),e.beginPath(),e.arc(n,s,9,0,Math.PI*2),e.fill();return;case"sleep":e.beginPath(),e.moveTo(n-22,s+6),e.lineTo(n+22,s+6),e.stroke();return;case"worried":e.save(),e.translate(n,s),e.rotate(r*-.35),Cu(e,-38/2,-c/2+8,38,c-16,18),e.stroke(),e.restore();return;case"think":r<0?(e.beginPath(),e.moveTo(n-20,s),e.lineTo(n+20,s),e.stroke()):(Cu(e,n-38/2,s-c/2,38,c,18),e.stroke());return;case"wink":if(r>0){e.beginPath(),e.arc(n,s+12,22,Math.PI*1.1,Math.PI*1.9),e.stroke();return}break;default:break}c=Math.max(8,c*(1-o*.92)),Cu(e,n-38/2,s-c/2,38,c,Math.min(18,c/2)),e.stroke()}heart(e,t,n,s){e.beginPath(),e.moveTo(t,n+s*.9),e.bezierCurveTo(t-s*1.4,n-s*.1,t-s*.6,n-s*1.1,t,n-s*.35),e.bezierCurveTo(t+s*.6,n-s*1.1,t+s*1.4,n-s*.1,t,n+s*.9),e.fill()}};function Cu(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}var xn=1024,Zn=640,an=372,T1={bg:"#eceef0",panel:"#f4f5f6",text:"#1d1f22",sub:"#6b7078",lane:"#c3c7cc",car:"#9aa0a8",land:"#efece6",road:"#ffffff",roadCase:"#d4d0c8",hwy:"#ffd36a",hwyCase:"#d9a640",water:"#a9d3ec",park:"#cfe7c4",town:"#e2ddd5",route:"#2f6fe4",routeCase:"#1e4fb0",dock:"#1b1c1f",card:"rgba(32,34,38,0.92)"},A1={bg:"#141518",panel:"#1b1c20",text:"#f2f3f5",sub:"#9097a1",lane:"#4a4f57",car:"#6d737c",land:"#25272b",road:"#3a3d43",roadCase:"#2c2e33",hwy:"#8a6d2c",hwyCase:"#5d4a20",water:"#1d3550",park:"#233428",town:"#2f3136",route:"#4c8dff",routeCase:"#2a5fc0",dock:"#0c0d0f",card:"rgba(10,11,13,0.92)"};function Sn(i){return 900*cs(i/3200,5)+260*cs(i/950,8)}var vl=class{constructor(){this.canvas=document.createElement("canvas"),this.canvas.width=xn,this.canvas.height=Zn,this.ctx=this.canvas.getContext("2d"),this.texture=new Bt(this.canvas),this.texture.colorSpace=ht,this.texture.anisotropy=8,this.zoom=.16,this.acc=0,this.spin=0,this.featureCache=new Map}update(e,t){this.acc+=e,this.spin+=e,!(this.acc<1/15)&&(this.acc=0,this.draw(t),this.texture.needsUpdate=!0)}draw(e){let t=this.ctx,n=e.dark?A1:T1;this.T=n,t.save(),t.fillStyle=n.bg,t.fillRect(0,0,xn,Zn),this.drawMap(t,e,n),this.drawCarPanel(t,e,n),this.drawTopBar(t,e,n),this.drawDock(t,e,n),e.funkloch>0&&(t.fillStyle=`rgba(120,120,120,${.35*e.funkloch})`,t.fillRect(an,0,xn-an,Zn-64),t.fillStyle="#ffffff",t.font="bold 34px Arial, sans-serif",t.textAlign="center",t.fillText("Keine Verbindung",an+(xn-an)/2,300),t.font="24px Arial, sans-serif",t.fillText("Mobilfunk wird neu geb\xFCndelt \u2026",an+(xn-an)/2,340)),t.restore()}drawCarPanel(e,t,n){e.fillStyle=n.panel,e.fillRect(0,0,an,Zn),e.textBaseline="alphabetic",e.font='600 26px "Helvetica Neue", Arial, sans-serif',e.textAlign="left",["P","R","N","D"].forEach((x,y)=>{e.fillStyle=x==="D"?n.text:n.sub,e.font=(x==="D"?"700 28px":"500 24px")+' "Helvetica Neue", Arial, sans-serif',e.fillText(x,26+y*30,78)});let r=196,o=56;e.strokeStyle=n.text,e.lineWidth=3,Ht(e,r,o,60,26,5),e.stroke(),e.fillStyle=n.text,e.fillRect(r+60,o+8,5,10);let a=We(t.battery,0,100);e.fillStyle=a<15?"#e0301e":a<30?"#f0a020":"#34c759",e.fillRect(r+4,o+4,52*(a/100),18),e.fillStyle=n.text,e.font='600 26px "Helvetica Neue", Arial, sans-serif',e.fillText(Math.round(a)+" %",r+76,79),e.textAlign="center",e.font='600 104px "Helvetica Neue", Arial, sans-serif',e.fillStyle=n.text,e.fillText(String(Math.round(t.speedKmh)),an/2,196),e.font='500 26px "Helvetica Neue", Arial, sans-serif',e.fillStyle=n.sub,e.fillText("km/h",an/2,232),t.limit&&(e.save(),e.translate(an-58,150),e.fillStyle="#fff",e.beginPath(),e.arc(0,0,34,0,Math.PI*2),e.fill(),e.strokeStyle="#d4141b",e.lineWidth=8,e.stroke(),e.fillStyle="#111",e.font="bold 30px Arial, sans-serif",e.textBaseline="middle",e.fillText(String(t.limit),0,2),e.restore());let l=262,c=Zn-78,h=an/2,u=l,d=(x,y)=>{let S=1/(1+(We(y,-18,120)+18)/26),P=at(u+6,c,S*1.05);return[h+x*30*S,P,S]},f=t.playerX,m=[-7.5,-3.75,0,3.75,7.5];if(t.leftLane>0){e.fillStyle=`rgba(62,120,255,${.25+.15*Math.sin(this.spin*6)})`,e.beginPath();let x=d(-7.5-f,-18);e.moveTo(x[0],x[1]);for(let y=-18;y<=120;y+=6)x=d(-7.5-f,y),e.lineTo(x[0],x[1]);for(let y=120;y>=-18;y-=6)x=d(-3.75-f,y),e.lineTo(x[0],x[1]);e.fill()}if(m.forEach((x,y)=>{e.strokeStyle=n.lane,e.lineWidth=y===0||y===4?4:3,e.setLineDash(y===0||y===4?[]:[14,14]),e.beginPath();for(let I=-18;I<=120;I+=4){let S=d(x-f,I);I===-18?e.moveTo(S[0],S[1]):e.lineTo(S[0],S[1])}e.stroke()}),e.setLineDash([]),t.leftLane<=0){let x=d(-5.625-f,40);e.font=`${Math.round(30*x[2]+12)}px "Segoe UI Emoji", "Noto Color Emoji", sans-serif`,e.textAlign="center",e.fillText("\u{1F512}",x[0],x[1])}let v=(t.cars||[]).filter(x=>x.ds>-18&&x.ds<120).sort((x,y)=>y.ds-x.ds);for(let x of v){let y=d(x.dx-f,x.ds-x.len/2),I=d(x.dx-f,x.ds+x.len/2),S=x.w*30*y[2];e.fillStyle=x.kind==="polizei"?"#5c7ed6":n.car,Ht(e,y[0]-S/2,I[1],S,Math.max(4,y[1]-I[1]),Math.min(8,S/3)),e.fill(),x.brake&&(e.fillStyle="#ff3b30",e.fillRect(y[0]-S/2,y[1]-4,S,4))}let g=d(0,0),p=d(0,4.7),_=1.85*30*g[2];e.fillStyle="#111214",Ht(e,g[0]-_/2,p[1],_,g[1]-p[1],10),e.fill(),e.fillStyle="rgba(120,150,190,0.8)",Ht(e,g[0]-_*.36,p[1]+(g[1]-p[1])*.18,_*.72,(g[1]-p[1])*.28,6),e.fill(),e.textAlign="center",e.font='600 24px "Helvetica Neue", Arial, sans-serif',t.leftLane>0?(e.fillStyle="#2f6fe4",e.fillText("Linke Spur frei \xB7 "+Math.ceil(t.leftLane)+" s",an/2,Zn-86)):(e.fillStyle=n.sub,e.fillText("Rechtsfahrgebot aktiv",an/2,Zn-86))}features(e){if(this.featureCache.has(e))return this.featureCache.get(e);let t=Ln(e*977+3),n=e*600,s={roads:[],towns:[],parks:[],water:null,exit:null};if(t()<.55){let o=n+t()*600,a=(t()-.5)*1.2;s.roads.push({s:o,a,len:1500+t()*2500}),t()<.6&&(s.exit=o)}if(t()<.35){let o=t()<.5?-1:1;s.towns.push({s:n+t()*600,x:o*(300+t()*900),r:120+t()*220,seed:e})}let r=Math.floor(t()*3);for(let o=0;o<r;o++)s.parks.push({s:n+t()*600,x:(t()<.5?-1:1)*(200+t()*1400),r:150+t()*400,k:t()});return t()<.12&&(s.water={s:n+t()*600,a:(t()-.5)*.8}),this.featureCache.set(e,s),this.featureCache.size>80&&this.featureCache.delete(this.featureCache.keys().next().value),s}drawMap(e,t,n){let s=t.navi||{},r=an,o=xn-an,a=Zn-64;e.save(),e.beginPath(),e.rect(r,0,o,a),e.clip(),e.fillStyle=n.land,e.fillRect(r,0,o,a);let l=t.s,c=Math.max(0,s.remaining??3e3),h=We(330/Math.max(c+250,400),.07,.42);this.zoom=at(this.zoom,h,.08);let u=this.zoom,d=r+o/2,f=a*.8,m=Sn(l),v=(Sn(l+25)-Sn(l-25))/50,g=Math.atan(v),p=(R,b)=>{let M=R-m,T=-(b-l),k=Math.cos(-g),U=Math.sin(-g);return[d+(M*k-T*U)*u,f+(M*U+T*k)*u]},_=l-a*.25/u-600,x=l+a*.9/u+600,y=Math.floor(_/600),I=Math.floor(x/600);for(let R=y;R<=I;R++){let b=this.features(R);for(let M of b.parks){let[T,k]=p(Sn(M.s)+M.x,M.s);e.fillStyle=n.park,e.beginPath(),e.ellipse(T,k,M.r*u,M.r*u*(.6+M.k*.6),M.k*3,0,Math.PI*2),e.fill()}if(b.water){e.strokeStyle=n.water,e.lineWidth=Math.max(5,60*u),e.beginPath();let M=b.water.s,T=b.water.a;for(let k=-6;k<=6;k++){let U=Sn(M)+k*400,H=M+k*400*Math.tan(T)+Math.sin(k)*80,[F,N]=p(U,H);k===-6?e.moveTo(F,N):e.lineTo(F,N)}e.stroke()}for(let M of b.towns){let T=Ln(M.seed);e.fillStyle=n.town;let[k,U]=p(Sn(M.s)+M.x,M.s);e.beginPath(),e.arc(k,U,M.r*u,0,Math.PI*2),e.fill(),e.strokeStyle=n.road,e.lineWidth=3;for(let H=0;H<6;H++){e.beginPath();let F=T()*Math.PI;e.moveTo(k-Math.cos(F)*M.r*u,U-Math.sin(F)*M.r*u),e.lineTo(k+Math.cos(F)*M.r*u,U+Math.sin(F)*M.r*u),e.stroke()}}}for(let R=y;R<=I;R++){let b=this.features(R);for(let M of b.roads){let T=Sn(M.s),k=p(T-Math.cos(M.a)*M.len,M.s-Math.sin(M.a)*M.len),U=p(T+Math.cos(M.a)*M.len,M.s+Math.sin(M.a)*M.len);e.strokeStyle=n.roadCase,e.lineWidth=9,e.beginPath(),e.moveTo(k[0],k[1]),e.lineTo(U[0],U[1]),e.stroke(),e.strokeStyle=n.road,e.lineWidth=6,e.stroke()}}let S=[];for(let R=_;R<=x;R+=40/Math.max(u,.05))S.push(p(Sn(R),R));let P=(R,b,M)=>{e.strokeStyle=b,e.lineWidth=M,e.lineJoin="round",e.lineCap="round",e.beginPath(),R.forEach((T,k)=>k?e.lineTo(T[0],T[1]):e.moveTo(T[0],T[1])),e.stroke()};if(P(S,n.hwyCase,17),P(S,n.hwy,12),s.target){let R=s.recalc||0,b=l+c,M=s.side||1,T=[];if(s.wende&&s.wendeS>l){for(let k=l;k<=s.wendeS;k+=30)T.push(p(Sn(k)+6,k));for(let k=0;k<=8;k++){let U=k/8*Math.PI;T.push(p(Sn(s.wendeS)+6-(1-Math.cos(U))*70,s.wendeS+Math.sin(U)*120))}for(let k=s.wendeS;k>=l-900;k-=30)T.push(p(Sn(k)-134,k))}else{let k=Math.max(l,b-260);for(let F=l;F<=k;F+=Math.max(20,12/u))T.push(p(Sn(F),F));let U=Sn(k),H=Sn(b)+M*520;for(let F=1;F<=10;F++){let N=F/10;T.push(p(at(U,H,N*N),at(k,b+120,N)))}}if(R<1&&(e.globalAlpha=1-R,P(T,n.routeCase,15),P(T,n.route,10),e.globalAlpha=1),!s.wende){let[k,U]=p(Sn(b)+M*520,b+120);k>r-40&&k<xn+40&&U>-40&&U<a+40&&(e.fillStyle="#e8352b",e.beginPath(),e.arc(k,U-26,15,Math.PI,0),e.lineTo(k,U),e.closePath(),e.fill(),e.fillStyle="#fff",e.beginPath(),e.arc(k,U-26,6,0,Math.PI*2),e.fill())}}if(e.save(),e.translate(d,f),e.fillStyle="rgba(47,111,228,0.18)",e.beginPath(),e.arc(0,0,34,0,Math.PI*2),e.fill(),e.fillStyle="#ffffff",e.beginPath(),e.moveTo(0,-24),e.lineTo(17,18),e.lineTo(0,8),e.lineTo(-17,18),e.closePath(),e.fill(),e.fillStyle="#2f6fe4",e.beginPath(),e.moveTo(0,-18),e.lineTo(12,13),e.lineTo(0,5),e.lineTo(-12,13),e.closePath(),e.fill(),e.restore(),s.recalc>0&&(e.fillStyle=`rgba(255,255,255,${.5*s.recalc})`,e.fillRect(r,0,o,a),e.save(),e.translate(d,a*.45),e.strokeStyle="#2f6fe4",e.lineWidth=8,e.lineCap="round",e.beginPath(),e.arc(0,0,34,this.spin*6,this.spin*6+4.2),e.stroke(),e.restore(),e.fillStyle="#1d1f22",e.font='bold 32px "Helvetica Neue", Arial, sans-serif',e.textAlign="center",e.fillText("Route wird neu berechnet \u2026",d,a*.45+80)),s.target){e.fillStyle=n.card,Ht(e,r+18,70,o-36,118,16),e.fill(),e.fillStyle="#ffffff",e.textAlign="left",e.font='bold 30px "Helvetica Neue", Arial, sans-serif';let R=s.wende&&s.wendeS>l?"Bitte wenden":c>400?"A7 folgen":"Ausfahrt nehmen",b=s.wende&&s.wendeS>l?s.wendeS-l:Math.max(0,c-260);e.fillText(this.arrowFor(R)+"  "+R,r+38,112),e.font='600 28px "Helvetica Neue", Arial, sans-serif',e.textAlign="right",e.fillText(Lp(b),xn-36,112),e.textAlign="left",e.font='26px "Helvetica Neue", Arial, sans-serif';let M=Lp(c)+" \xB7 "+(s.eta||""),T=e.measureText(M).width;e.fillStyle="#c9d6ff",Dp(e,"\u{1F3C1} "+s.target,r+38,160,xn-36-T-26-(r+38),20),e.font='26px "Helvetica Neue", Arial, sans-serif',e.textAlign="right",e.fillStyle="#ffffff",e.fillText(M,xn-36,160),e.fillStyle="rgba(200,16,46,0.94)",Ht(e,r+18,a-74,o-36,56,14),e.fill(),e.fillStyle="#ffffff",e.textAlign="left",e.font='bold 24px "Helvetica Neue", Arial, sans-serif',Dp(e,"\u{1F4E1} Ferngesteuert von "+(s.bidder||"\u2014"),r+34,a-38,o-210),e.textAlign="right",e.font='bold 26px "Helvetica Neue", Arial, sans-serif',e.fillText(s.bid||"",xn-36,a-38)}e.restore()}arrowFor(e){return e==="Bitte wenden"?"\u21B6":e==="Ausfahrt nehmen"?"\u2197":"\u2191"}drawTopBar(e,t,n){e.fillStyle=t.dark?"rgba(20,21,24,0.85)":"rgba(244,245,246,0.88)",e.fillRect(an,0,xn-an,50),e.fillStyle=n.text,e.font='600 24px "Helvetica Neue", Arial, sans-serif',e.textAlign="left",e.textBaseline="middle",e.fillText("\u{1F464} Mini Adam",an+20,26),e.textAlign="right",e.fillText(t.clock+"   "+t.temp+" \xB0C   "+(t.funkloch>0?"Kein Netz":"LTE \u2582\u2584\u2586\u2588"),xn-18,26),e.textBaseline="alphabetic"}drawDock(e,t,n){e.fillStyle=n.dock,e.fillRect(0,Zn-64,xn,64),e.fillStyle="#e6e8eb",e.font='30px "Segoe UI Emoji", "Noto Color Emoji", sans-serif',e.textAlign="center",e.textBaseline="middle",["\u{1F697}","\u2744\uFE0F","\u{1F3B5}","\u{1F4DE}","\u{1F4E1}","\u{1F327}\uFE0F","\u2699\uFE0F"].forEach((r,o)=>e.fillText(r,70+o*90,Zn-32)),e.font='600 26px "Helvetica Neue", Arial, sans-serif',e.fillStyle="#e6e8eb",e.fillText("21,0 \xB0",xn-150,Zn-32),e.fillStyle=t.wiperOn?"#4c8dff":"#e6e8eb",e.fillText(t.wiperOn?"Wischer: Auto (Beta)":"",xn-360,Zn-32),e.textBaseline="alphabetic"}};function Lp(i){return i>=1e3?tn(i/1e3,i>=1e4?0:1)+" km":Math.max(0,Math.round(i/10)*10)+" m"}function Dp(i,e,t,n,s,r=14){let o=parseFloat(i.font.match(/(\d+)px/)[1]);for(;i.measureText(e).width>s&&o>r;)o-=2,i.font=i.font.replace(/\d+px/,o+"px");if(i.measureText(e).width>s){let a=e;for(;a.length>4&&i.measureText(a+"\u2026").width>s;)a=a.slice(0,-1);e=a.trimEnd()+"\u2026"}i.fillText(e,t,n)}var R1=new C(-.37,1.2,.27),C1=-.12,ms=(()=>{let i=new C(0,.9,-.88),e=new C(0,1.38,-.095),t=e.clone().sub(i),n=t.length();t.normalize();let s=new C(1,0,0),r=new C().crossVectors(t,s).normalize();return{base:i,top:e,U:t,X:s,N:r,length:n,halfBase:.74,halfTop:.63}})(),Fr=[{pivot:new C(-.64,.884,-.905),length:.62,max:1.95},{pivot:new C(.06,.884,-.905),length:.56,max:1.75}];function kp(i){return new ri({color:i,roughness:.95,sheen:1,sheenRoughness:.5,sheenColor:new Re(i).lerp(new Re(16777215),.35),bumpMap:tl(5),bumpScale:.5})}function Pu(i,e,t,n,s,r=0){let o=new C().subVectors(e,i),a=o.length(),l=.5,c=new Ls(l,Math.max(.001,a/Math.max(t,n)-2*l),6,16);c.scale(t,Math.max(t,n),n),c.translate(0,a/2,0),r&&c.rotateY(r);let h=new D(c,s);return h.position.copy(i),h.quaternion.setFromUnitVectors(new C(0,1,0),o.normalize()),h}var xl=class{constructor(){this.scene=new Bi,this.root=new ye,this.root.name="Cockpit",this.scene.add(this.root),this.hemi=new Sr(13163775,4208428,1.25),this.scene.add(this.hemi),this.sun=new Ar(16773340,2),this.scene.add(this.sun),this.scene.add(this.sun.target),this.fill=new Tr(16774376,.25,2.5,1.2),this.fill.position.set(-.2,1.25,.1),this.root.add(this.fill);let e={dashTop:new ft({color:1908257,roughness:.86}),dash:new ft({color:1579292,roughness:.62}),vent:new ft({color:328966,roughness:.9}),wood:new ft({map:ep(),roughness:.42,color:14271664}),pillar:new ft({color:2500394,roughness:.95}),door:new ft({color:1776671,roughness:.68}),chrome:new ft({color:12172738,metalness:1,roughness:.22}),rim:new ft({color:1250069,roughness:.52}),spoke:new ft({color:2829360,metalness:.55,roughness:.32}),black:new ft({color:723724,roughness:.3,metalness:.2}),skin:kp(14263415),sleeve:kp(1447448),wiper:new ft({color:1315860,roughness:.6,metalness:.4})};this.M=e,this.buildDash(e),this.buildPillars(e),this.buildDoor(e),this.buildWheel(e),this.buildScreen(e),this.buildMirrors(e),this.buildWipers(e),this.buildExtras(e),this.nomi=new gl,this.nomi.group.position.set(-.225,.913,-.66),this.nomi.group.scale.setScalar(1.3),this.root.add(this.nomi.group),this.steer=0,this.wheelAngle=0,this.elsaWobble=0,this.elsaVel=0,this.headOffset=new C,this.shake=0}buildDash(e){let t=new Wn,n=[[-.92,.882],[-.86,.9],[-.5,.913],[-.455,.905],[-.42,.875],[-.405,.85],[-.405,.8],[-.43,.793],[-.43,.776],[-.395,.77],[-.335,.62],[-.35,.42],[-.92,.42]];t.moveTo(n[0][0],n[0][1]);for(let h=1;h<n.length;h++)t.lineTo(n[h][0],n[h][1]);t.closePath();let s=1.6,r=new gi(t,{depth:s,bevelEnabled:!1,curveSegments:4});r.rotateY(-Math.PI/2),r.translate(s/2,0,0);let o=new D(r,e.dashTop);this.root.add(o);let a=new Ue(1.5,.05,.012),l=new D(a,e.wood);l.position.set(.02,.826,-.399),this.root.add(l);let c=new D(new Ue(1.52,.014,.02),e.vent);c.position.set(.02,.785,-.425),this.root.add(c);for(let h of[-.62,.62]){let u=new D(new Ue(.18,.004,.08),e.vent);u.position.set(h,.912,-.78),this.root.add(u)}}buildPillars(e){let t=ms;for(let s of[-1,1]){let r=new C(s*.765,t.base.y-.07,t.base.z-.03),o=new C(s*.64,t.top.y+.015,t.top.z+0);this.root.add(Pu(r,o,.085,.06,e.pillar));let a=new C(s*.68,t.top.y+.035,.8);this.root.add(Pu(o,a,.08,.07,e.pillar))}let n=new D(new ps(1.34,.06,.12,3,.025),e.pillar);n.position.set(0,t.top.y+.02,t.top.z+.03),this.root.add(n)}buildDoor(e){let t=new ye,n=new D(new Ue(.07,.56,1.35),e.door);n.position.set(-.8,.7,-.08),t.add(n);let s=new D(new ps(.075,.06,1.3,3,.025),e.dash);s.position.set(-.775,.975,-.06),t.add(s);let r=new D(new Ue(.1,.05,.4),e.dashTop);r.position.set(-.73,.76,.15),t.add(r);let o=new D(new Ue(.012,.04,.8),e.wood);o.position.set(-.762,.9,-.1),t.add(o);let a=new D(new Ue(.012,.018,.04),e.black);a.position.set(-.76,.86,-.32),t.add(a),this.root.add(t)}buildWheel(e){let t=new ye;t.position.set(-.37,.865,-.2),t.rotation.x=-.5,this.root.add(t);let n=new ye;t.add(n),this.wheel=n;let s=.17,r=new gn(s,.023,14,56);r.scale(1,.94,1.15),n.add(new D(r,e.rim));for(let f of[-1,1]){let m=new D(new Ue(.12,.034,.02),e.spoke);m.position.set(f*.115,-.01,-.005),n.add(m);let v=new D(new ze(.012,.012,.01,16),e.black);v.rotation.x=Math.PI/2,v.position.set(f*.11,-.01,.009),n.add(v)}let o=new D(new Ue(.035,.11,.02),e.spoke);o.position.set(0,-.1,-.005),n.add(o);let a=new ze(.065,.07,.04,28);a.rotateX(Math.PI/2),a.scale(1.25,.85,1);let l=new D(a,e.rim);l.position.set(0,-.008,-.01),n.add(l);let c=new D(new tt(.075,.075),new ft({map:Dr({w:256,h:256}),transparent:!0,roughness:.4,alphaTest:.2}));c.position.set(0,-.004,.011),n.add(c);let h=new D(new ze(.035,.045,.24,14),e.dash);h.rotation.x=Math.PI/2,h.position.set(0,-.01,-.13),t.add(h);for(let f of[-1,1]){let m=new D(new ze(.007,.006,.14,8),e.black);m.rotation.z=f*(Math.PI/2-.25),m.position.set(f*.09,0,-.08),t.add(m)}this.hands=[];for(let f of[-1,1]){let m=f*1.32,v=new ye;v.position.set(Math.sin(m)*s,Math.cos(m)*s,.012),v.rotation.z=-m;let g=new D(new lt(.048,18,14),e.skin);g.scale.set(1.05,.85,.85),g.position.set(0,.005,.014);let p=new D(new lt(.019,12,10),e.skin);p.position.set(-f*.03,-.012,.035);let _=new D(new lt(.04,14,10),e.skin);_.scale.set(1,.7,.6),_.position.set(0,.01,-.025),v.add(g,p,_),n.add(v),this.hands.push(v)}this.arms=[];let u=new Ls(.036,1,6,14),d=new ze(.052,.058,1,16,1,!0);for(let f of[-1,1]){let m=new D(u,e.sleeve),v=new D(d,e.sleeve);this.root.add(m,v),this.arms.push({arm:m,sleeve:v,shoulder:new C(-.37+f*.25,.84,.3)})}}buildScreen(e){this.screen=new vl;let t=new ye;t.position.set(0,1.03,-.465),t.rotation.x=-.16;let n=new D(new Ue(.352,.226,.018),e.black);n.position.z=-.01;let s=new D(new tt(.336,.21),new hn({map:this.screen.texture,toneMapped:!1}));s.position.z=5e-4;let r=new D(new Ue(.06,.08,.03),e.dash);r.position.set(0,-.13,-.03),t.add(n,s,r),this.root.add(t),this.displayMat=s.material}buildMirrors(e){let s=new Wn,r=.03;s.moveTo(-.245/2+r,-.072/2),s.lineTo(.245/2-r,-.072/2),s.quadraticCurveTo(.245/2,-.072/2,.245/2,-.072/2+r),s.lineTo(.245/2,.072/2-r),s.quadraticCurveTo(.245/2,.072/2,.245/2-r,.072/2),s.lineTo(-.245/2+r,.072/2),s.quadraticCurveTo(-.245/2,.072/2,-.245/2,.072/2-r),s.lineTo(-.245/2,-.072/2+r),s.quadraticCurveTo(-.245/2,-.072/2,-.245/2+r,-.072/2);let o=new Wa(s,6),a=o.attributes.uv,l=o.attributes.position;for(let K=0;K<a.count;K++)a.setXY(K,1-(l.getX(K)/.245+.5),l.getY(K)/.072+.5);this.mirrorMat=new hn({color:16777215});let c=new ye;c.position.set(-.08,1.235,-.225),c.rotation.set(-.06,-.18,0);let h=new D(o,this.mirrorMat);h.position.z=.021;let u=new gi(s,{depth:.022,bevelEnabled:!0,bevelSize:.006,bevelThickness:.006,bevelSegments:2});u.translate(0,0,-.012);let d=new D(u,e.black);c.add(d,h),this.root.add(c);let f=ms,m=new $e().makeBasis(f.X,f.U,f.N.clone().negate()).setPosition(f.base),v=new Wn,g=-.07,p=.075,_=.14,x=.79,y=.95;v.moveTo(g-p+.025,x),v.lineTo(g+p-.025,x),v.quadraticCurveTo(g+p,x,g+p+.003,x+.025),v.lineTo(g+_,y),v.lineTo(g-_,y),v.lineTo(g-p-.003,x+.025),v.quadraticCurveTo(g-p,x,g-p+.025,x);let I=new gi(v,{depth:.014,bevelEnabled:!0,bevelSize:.006,bevelThickness:.006,bevelSegments:2,curveSegments:6});I.translate(0,0,.007),I.applyMatrix4(m);let S=new D(I,e.dash),P=(K,be,fe)=>new C(K,be,fe).applyMatrix4(m),R=P(-.08,.805,.024),b=new C(-.08,1.258,-.243),M=b.clone().sub(R),T=new ze(.008,.011,M.length(),10);T.translate(0,M.length()/2,0);let k=new D(T,e.black);k.position.copy(R),k.quaternion.setFromUnitVectors(new C(0,1,0),M.normalize());let U=new D(new lt(.013,12,8),e.black);U.position.copy(b),this.root.add(S,k,U),this.mirrorHousing={toGlass:m,onGlass:P};let H=new ye;H.position.set(-1,1.045,-.6),H.rotation.y=.62;let F=new ri({color:329223,metalness:.5,roughness:.3,clearcoat:1,side:gt}),N=new lt(1,28,16,Math.PI,Math.PI);N.scale(.122,.07,.075);let j=new D(N,F),G=new gn(1,.07,8,40);G.scale(.117,.066,.1);let ce=new D(G,F);ce.position.z=.002;let pe=new un(1,32);pe.scale(.107,.058,1);let xe=pe.attributes.uv,Ge=pe.attributes.position;for(let K=0;K<xe.count;K++)xe.setXY(K,1-(Ge.getX(K)/.214+.5)*.42,Ge.getY(K)/.116+.5);this.sideMirrorMat=new hn({color:16777215});let Ze=new D(pe,this.sideMirrorMat);Ze.position.z=.004,H.add(j,ce,Ze);let V=Pu(new C(-.79,.985,-.635),new C(-.905,1.035,-.665),.05,.035,F);this.root.add(H,V)}setMirrorTexture(e){this.mirrorMat.map=e,this.mirrorMat.needsUpdate=!0,this.sideMirrorMat.map=e,this.sideMirrorMat.needsUpdate=!0}buildWipers(e){let t=ms,n=new $e().makeBasis(t.X,t.U,t.N.clone().negate()),s=new qt().setFromRotationMatrix(n);this.wiperObjs=Fr.map(r=>{let o=new ye;o.position.copy(r.pivot).addScaledVector(t.N,.02),o.quaternion.copy(s);let a=new ye;o.add(a);let l=new D(new Ue(r.length,.016,.012),e.wiper);l.position.set(r.length/2,0,-.012);let c=new D(new Ue(r.length*.92,.022,.008),e.wiper);return c.position.set(r.length*.52,.01,-.001),a.add(l,c),this.root.add(o),a})}buildExtras(e){let t=new ye;t.position.copy(this.mirrorHousing.onGlass(-.105,.875,.049));let n=new D(new ps(.06,.044,.036,2,.006),e.black),s=new D(new ze(.013,.013,.012,16),new ft({color:1714746,metalness:.9,roughness:.1}));s.rotation.x=Math.PI/2,s.position.z=-.022,this.recLed=new D(new lt(.0055,10,8),new hn({color:16719904,toneMapped:!1})),this.recLed.position.set(.019,-.008,.0175);let r=new D(new Ue(.03,.02,.03),e.black);r.position.set(0,.026,-.004),t.add(n,s,this.recLed,r),this.root.add(t),this.elsa=al({curved:!1}),this.elsa.scale.setScalar(.11),this.elsaSpring=new ye,this.elsaSpring.position.set(-.6,.913,-.68),this.elsaSpring.rotation.y=.5;let o=new D(new ze(.018,.022,.012,16),e.black);this.elsaSpring.add(o,this.elsa),this.elsa.position.y=.008,this.elsaSpring.visible=!1,this.root.add(this.elsaSpring);let a=new tt(.012,.008);this.confetti=new si(a,new ft({side:gt,roughness:.6}),400),this.confetti.count=0,this.confetti.frustumCulled=!1,this.root.add(this.confetti)}addConfetti(e=40){let t=ms,n=new $e().makeBasis(t.X,t.U,t.N.clone().negate()),s=new qt().setFromRotationMatrix(n),r=new $e,o=new qt,a=new qt,l=[16726891,16765503,3919532,5934574,16747586,11828479,16777215],c=new Re;for(let h=0;h<e&&this.confetti.count<400;h++){let u=Math.random()*t.length*.9+.03,d=t.halfBase+(t.halfTop-t.halfBase)*(u/t.length)-.05,f=(Math.random()*2-1)*d,m=t.base.clone().addScaledVector(t.U,u);m.x=f,m.addScaledVector(t.N,-.006),a.setFromAxisAngle(new C(0,0,1),Math.random()*Math.PI),o.copy(s).multiply(a),r.compose(m,o,new C(1,1,1).multiplyScalar(.7+Math.random()*.8));let v=this.confetti.count++;this.confetti.setMatrixAt(v,r),this.confetti.setColorAt(v,c.setHex(l[v%l.length]))}this.confetti.instanceMatrix.needsUpdate=!0,this.confetti.instanceColor&&(this.confetti.instanceColor.needsUpdate=!0)}clearConfetti(){this.confetti.count=0}setElsa(e){this.elsaSpring.visible=!!e}placeCamera(e,t,n,s,r,o){this.shake=Math.max(0,this.shake-o*1.6);let a=Math.min(1,s/60)*.0025+this.shake*.03;this.headOffset.x=In(this.headOffset.x,We(-r*.006,-.05,.05),4,o);let l=this.headOffset.x+(Math.sin(n*37)*.5+Math.sin(n*23)*.5)*a,c=(Math.sin(n*29)+Math.sin(n*13.3))*.5*a+Math.sin(n*1.4)*.003,h=R1.clone().add(new C(l,c,0));h.applyMatrix4(t),e.position.copy(h);let u=new qt().setFromRotationMatrix(t),d=new ln(C1+c*2,this.headOffset.x*.6+Math.sin(n*.31)*.004,-r*.0025+l*2,"YXZ");e.quaternion.copy(u).multiply(new qt().setFromEuler(d))}update(e){let{dt:t,t:n}=e;this.wheelAngle=In(this.wheelAngle,e.steer*1.25,10,t),this.wheel.rotation.z=-this.wheelAngle,this.root.updateMatrixWorld(!0);let s=new $e().copy(this.root.matrixWorld).invert(),r=new C,o=new C;if(this.arms.forEach((l,c)=>{this.hands[c].getWorldPosition(r),r.applyMatrix4(s),o.subVectors(r,l.shoulder);let h=o.length();o.normalize();let u=new qt().setFromUnitVectors(new C(0,1,0),o);l.arm.position.copy(l.shoulder).addScaledVector(o,h/2-.01),l.arm.quaternion.copy(u),l.arm.scale.set(1,(h-.04)/1.086,1),l.sleeve.position.copy(l.shoulder).addScaledVector(o,.08),l.sleeve.quaternion.copy(u),l.sleeve.scale.set(1,.22,1)}),e.wiperAngles&&(this.wiperObjs[0].rotation.z=e.wiperAngles[0],this.wiperObjs[1].rotation.z=e.wiperAngles[1]),this.elsaSpring.visible){let h=-60*this.elsaWobble-3.5*this.elsaVel-(e.latAcc||0)*.9;this.elsaVel+=h*t,this.elsaWobble+=this.elsaVel*t,this.elsaWobble=We(this.elsaWobble,-.6,.6),this.elsa.rotation.z=this.elsaWobble,ll(this.elsa,n,this.elsaWobble)}this.recLed.visible=Math.sin(n*3.5)>-.3;let a=e.overcast||0;e.sunDir&&(this.sun.position.copy(this.root.position).addScaledVector(e.sunDir,10),this.sun.target.position.copy(this.root.position)),this.sun.intensity=2.1*(1-a*.85),this.hemi.intensity=1.2-a*.25,this.nomi.update(t,n,-.16),this.screen.update(t,e.screen)}};var Or=640,Hs=360,Fs=160,Os=90,yl=class{constructor(){this.canvas=document.createElement("canvas"),this.canvas.width=Or,this.canvas.height=Hs,this.ctx=this.canvas.getContext("2d"),this.texture=new Bt(this.canvas),this.texture.generateMipmaps=!1,this.texture.minFilter=Nn,this.film=document.createElement("canvas"),this.film.width=Fs,this.film.height=Os,this.fctx=this.film.getContext("2d"),this.fctx.fillStyle="#000",this.fctx.fillRect(0,0,Fs,Os),this.filmTex=new Bt(this.film),this.filmTex.generateMipmaps=!1,this.filmTex.minFilter=Nn,this.sprite=op(),this.drops=[],this.intensity=0,this.firmware=0,this.enabled=!0,this.wiper={angle:0,mode:"park",t:0,dur:0,amp:0,queue:0,pause:0,prevAngle:0},this.autoTimer=2.5,this.onEvent=null,this.tmp=new C,this.camPos=new C,this.twitches=0,this.wipes=0,this.dirty=!0}setRain(e){this.intensity=We(e,0,1)}setFirmware(e){this.firmware=e}get angles(){let e=this.wiper.angle;return[e*(Fr[0].max/2.15),e*(Fr[1].max/2.15)]}manual(){if(this.wiper.mode!=="park")return null;let e=[.18,.42,.62,.82][this.firmware]??.18;return pt(e)?(this.startSweep(),"wipe"):(this.startTwitch(1+Math.floor(Math.random()*2)),"twitch")}startTwitch(e=1){this.wiper.mode="twitch",this.wiper.t=0,this.wiper.dur=_e(.18,.3),this.wiper.amp=_e(.28,.66),this.wiper.queue=e-1,this.twitches++,this.onEvent&&this.onEvent("twitch")}startSweep(){this.wiper.mode="sweep",this.wiper.t=0,this.wiper.dur=1,this.wiper.amp=2.15,this.wipes++,this.onEvent&&this.onEvent("wipe")}update(e,{speed:t,camera:n,carMatrix:s}){let r=this.wiper;if(r.prevAngle=r.angle,this.intensity>.05&&r.mode==="park"&&(this.autoTimer-=e,this.autoTimer<=0)){this.autoTimer=_e(1.4,3.8)/(.6+this.intensity*.6);let h=[0,.18,.36,.55][this.firmware]??0;pt(h)?this.startSweep():this.startTwitch(1+Math.floor(Math.random()*3))}if(r.mode==="twitch"){r.t+=e;let h=r.t/r.dur;r.angle=h<1?r.amp*Math.sin(Math.PI*h)*(1-.3*h):0,h>=1&&(r.angle=0,r.queue>0?(r.queue--,r.mode="pause",r.pause=_e(.08,.25)):r.mode="park")}else if(r.mode==="pause")r.pause-=e,r.pause<=0&&(r.mode="twitch",r.t=0,r.dur=_e(.15,.28),r.amp=_e(.2,.55));else if(r.mode==="sweep"){r.t+=e;let h=r.t/r.dur;r.angle=h<1?r.amp*Math.sin(Math.PI*Math.min(1,h))**.8:0,h>=1&&(r.angle=0,r.mode="park")}let o=ms;if(this.intensity>0){let u=this.intensity*(22+t*1.3)*e;for(;u>0;){if(Math.random()<u){let d=Math.random()*o.length,f=at(o.halfBase,o.halfTop,d/o.length),m=Math.random()<.08;this.drops.push({x:(Math.random()*2-1)*f,u:d,r:m?_e(.006,.011):_e(.0022,.0058),life:0})}u-=1}}let a=Math.max(0,t-14)*.0055;for(let h of this.drops){h.life+=e;let u=We((h.r-.003)/.006,0,1);h.u+=(a*u-(1-Math.min(1,t/14))*.02*u)*e,h.x+=Math.sin(h.life*3+h.r*1e3)*.002*u*e*(t/30)}this.drops=this.drops.filter(h=>h.u>-.02&&h.u<o.length+.02&&!(this.intensity<.01&&h.life>6));let l=Math.min(r.prevAngle,r.angle),c=Math.max(r.prevAngle,r.angle);if(c>.01&&c-l>1e-4){let h=r.mode!=="sweep";for(let u=0;u<Fr.length;u++){let d=Fr[u],f=d.max/2.15,m=l*f-.04,v=c*f+.04,g=d.pivot.x,p=this.pivotU(d.pivot);this.drops=this.drops.filter(_=>{let x=_.x-g,y=_.u-p,I=Math.hypot(x,y);if(I<.06||I>d.length+.015)return!0;let S=Math.atan2(y,x);return!(S>=m&&S<=v)}),this.paintFilm(n,s,d,l*f,c*f,h)}}this.drops.length>520&&this.drops.splice(0,this.drops.length-520),this.fctx.globalCompositeOperation="source-over",this.fctx.fillStyle=`rgba(0,0,0,${We(e*.35,0,1)})`,this.fctx.fillRect(0,0,Fs,Os),this.intensity>0&&(this.fctx.fillStyle=`rgba(255,255,255,${e*.05*this.intensity})`,this.fctx.fillRect(0,0,Fs,Os)),this.filmTex.needsUpdate=!0,this.draw(n,s)}pivotU(e){let t=ms;return this.tmp.copy(e).sub(t.base).dot(t.U)}glassToScreen(e,t,n,s,r){let o=ms;this.tmp.copy(o.base).addScaledVector(o.U,t),this.tmp.x=e,this.tmp.applyMatrix4(s);let a=this.tmp.distanceTo(n.position);return this.tmp.project(n),r.x=(this.tmp.x*.5+.5)*Or,r.y=(.5-this.tmp.y*.5)*Hs,r.z=this.tmp.z,r.d=a,r}paintFilm(e,t,n,s,r,o){let a=this.pivotU(n.pivot),l=[],c={x:0,y:0},h=6;for(let d=0;d<=h;d++){let f=s+(r-s)*d/h;this.glassToScreen(n.pivot.x+Math.cos(f)*n.length,a+Math.sin(f)*n.length,e,t,c),l.push([c.x*(Fs/Or),c.y*(Os/Hs)])}this.glassToScreen(n.pivot.x,a,e,t,c);let u=this.fctx;u.beginPath(),u.moveTo(c.x*(Fs/Or),c.y*(Os/Hs));for(let d of l)u.lineTo(d[0],d[1]);u.closePath(),o?(u.globalCompositeOperation="lighter",u.fillStyle=`rgba(255,255,255,${.06+this.intensity*.12})`,u.fill()):(u.globalCompositeOperation="destination-out",u.fillStyle="rgba(0,0,0,0.85)",u.fill(),u.globalCompositeOperation="source-over",u.fillStyle="#000",u.fill()),u.globalCompositeOperation="source-over"}draw(e,t){let n=this.ctx;if(n.clearRect(0,0,Or,Hs),!this.enabled||this.drops.length===0){this.texture.needsUpdate=!0;return}let s=Hs/2/Math.tan(Cr.degToRad(e.fov)/2),r={x:0,y:0,z:0,d:1};for(let o of this.drops){if(this.glassToScreen(o.x,o.u,e,t,r),r.z>1)continue;let a=Math.max(1.2,o.r/r.d*s*2.3),l=1+Math.min(2.2,o.life<.4?0:o.r>.004?.35:0);n.drawImage(this.sprite,r.x-a,r.y-a*l,a*2,a*2*l)}this.texture.needsUpdate=!0}clear(){this.drops=[],this.fctx.fillStyle="#000",this.fctx.fillRect(0,0,Fs,Os),this.filmTex.needsUpdate=!0,this.ctx.clearRect(0,0,Or,Hs),this.texture.needsUpdate=!0}};function Up(i,e){return new jt({uniforms:{tScene:{value:i},tDrops:{value:e.texture},tFilm:{value:e.filmTex},uDrops:{value:1},uRain:{value:0},uTexel:{value:new ue(1/1280,1/720)},uFlash:{value:0},uFlashColor:{value:new Re(1,1,1)},uFade:{value:0},uGreen:{value:0},uGlitch:{value:0},uTime:{value:0},uVignette:{value:.35},uSat:{value:1.08}},vertexShader:`
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,fragmentShader:`
      uniform sampler2D tScene;
      uniform sampler2D tDrops;
      uniform sampler2D tFilm;
      uniform float uDrops;
      uniform float uRain;
      uniform vec2 uTexel;
      uniform float uFlash;
      uniform vec3 uFlashColor;
      uniform float uFade;
      uniform float uGreen;
      uniform float uGlitch;
      uniform float uTime;
      uniform float uVignette;
      uniform float uSat;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        if (uGlitch > 0.0) {
          float band = floor(uv.y * 30.0) + floor(uTime * 24.0);
          float r = fract(sin(band * 91.7) * 4375.85);
          uv.x += (r - 0.5) * 0.08 * uGlitch * step(0.6, r);
        }
        vec4 d = texture2D(tDrops, uv) * uDrops;
        float mask = clamp(d.a * (0.4 + d.b), 0.0, 1.0);
        vec2 n = (d.rg - 0.5) * 2.0;
        float film = texture2D(tFilm, uv).r * uDrops;
        vec2 suv = uv - n * mask * 0.06;
        vec3 col = texture2D(tScene, suv).rgb;
        float blur = film * 2.6 + mask * 0.7 + uRain * 0.25 * uDrops;
        if (blur > 0.04) {
          vec3 acc = col;
          for (int i = 0; i < 8; i++) {
            float a = float(i) * 0.7853 + 0.3;
            vec2 o = vec2(cos(a), sin(a)) * uTexel * (2.0 + blur * 7.0);
            acc += texture2D(tScene, suv + o).rgb;
          }
          col = mix(col, acc / 9.0, clamp(blur, 0.0, 1.0));
        }
        float l = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(col, vec3(l) * 1.02 + 0.03, clamp(film * 0.45, 0.0, 0.6));
        col *= 1.0 - mask * 0.22 * (1.0 - n.y * 0.5);
        col += mask * pow(max(0.0, n.y), 4.0) * 0.35;
        col = mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, uSat);
        col = mix(col, uFlashColor * 4.0, clamp(uFlash, 0.0, 1.0));
        vec2 vc = vUv - 0.5;
        col *= 1.0 - dot(vc, vc) * uVignette;
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        float g = dot(gl_FragColor.rgb, vec3(0.3, 0.6, 0.1));
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.08, 1.0, 0.25) * (0.3 + g), uGreen * 0.65);
        gl_FragColor.rgb *= 1.0 - uFade;
      }`,depthTest:!1,depthWrite:!1})}var _l=class{constructor(e,t=2600){let n=new Float32Array(t*2*3),s=new Float32Array(t*2);for(let d=0;d<t;d++){let f=Math.random()*60-30,m=Math.random()*24,v=Math.random()*70-55;for(let g=0;g<2;g++)n[(d*2+g)*3]=f,n[(d*2+g)*3+1]=m,n[(d*2+g)*3+2]=v,s[d*2+g]=g}let r=new vt;r.setAttribute("position",new Nt(n,3)),r.setAttribute("aEnd",new Nt(s,1)),this.uniforms={uTime:{value:0},uSpeed:{value:0},uS:{value:0},uCam:{value:new C},uOpacity:{value:0}};let o=new jt({uniforms:this.uniforms,vertexShader:`
        attribute float aEnd;
        uniform float uTime;
        uniform float uSpeed;
        uniform float uS;
        uniform vec3 uCam;
        varying float vA;
        void main() {
          vec3 p = position;
          float fall = 11.0;
          p.y = mod(p.y - uTime * fall, 24.0);
          p.z = mod(p.z + uS, 70.0) - 55.0;
          p.x += uCam.x;
          vec3 vel = vec3(0.0, -fall, uSpeed);
          p += normalize(vel) * aEnd * (0.35 + uSpeed * 0.012);
          vA = 1.0 - smoothstep(10.0, 24.0, abs(p.z + 10.0));
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        }`,fragmentShader:`
        uniform float uOpacity;
        varying float vA;
        void main() { gl_FragColor = vec4(vec3(0.75, 0.8, 0.88), uOpacity * vA * 0.5); }`,transparent:!0,depthWrite:!1});this.lines=new Ha(r,o),this.lines.frustumCulled=!1,this.lines.visible=!1,e.add(this.lines),this.maxSpray=700;let a=new Float32Array(this.maxSpray*3),l=new Float32Array(this.maxSpray),c=new Float32Array(this.maxSpray),h=new vt;h.setAttribute("position",new Nt(a,3)),h.setAttribute("aAlpha",new Nt(l,1)),h.setAttribute("aSize",new Nt(c,1)),this.sprayData=[],this.sprayGeo=h;let u=new jt({uniforms:{tDot:{value:nl()},uCurve:Hi.uCurve,uScale:{value:600}},vertexShader:ja+`
        attribute float aAlpha;
        attribute float aSize;
        uniform float uScale;
        varying float vA;
        void main() {
          vec4 w = curveWorld(modelMatrix * vec4(position, 1.0));
          vec4 mv = viewMatrix * w;
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * uScale / max(1.0, -mv.z);
          vA = aAlpha;
        }`,fragmentShader:`
        uniform sampler2D tDot;
        varying float vA;
        void main() {
          float a = texture2D(tDot, gl_PointCoord).a;
          gl_FragColor = vec4(vec3(0.82, 0.85, 0.9), a * vA);
        }`,transparent:!0,depthWrite:!1});this.spray=new Fa(h,u),this.spray.frustumCulled=!1,e.add(this.spray),this.intensity=0}setPixelScale(e){this.spray.material.uniforms.uScale.value=e*.9}emit(e,t,n,s,r=1){if(this.intensity<.15)return;let o=Math.round(r*this.intensity*2);for(let a=0;a<o&&this.sprayData.length<this.maxSpray;a++)this.sprayData.push({x:e+(Math.random()-.5)*n,y:.25+Math.random()*.3,z:t,vx:(Math.random()-.5)*1.2,vy:.6+Math.random()*1.4,vz:s*.9,life:0,max:.8+Math.random()*.8,size:1.2+Math.random()*1.6})}update(e,t,{speed:n,s,camX:r,intensity:o}){this.intensity=o;let a=this.uniforms;a.uTime.value=t,a.uSpeed.value=n,a.uS.value=s%70,a.uCam.value.x=r,a.uOpacity.value=o,this.lines.visible=o>.02;let l=this.sprayGeo.attributes.position.array,c=this.sprayGeo.attributes.aAlpha.array,h=this.sprayGeo.attributes.aSize.array,u=0,d=[];for(let f of this.sprayData)f.life+=e,!(f.life>f.max)&&(f.x+=f.vx*e,f.y+=f.vy*e,f.vy-=.8*e,f.z+=(n-f.vz*Math.exp(-f.life*2))*e,f.size+=e*2.2,d.push(f),l[u*3]=f.x,l[u*3+1]=f.y,l[u*3+2]=f.z,c[u]=.32*(1-f.life/f.max)*this.intensity,h[u]=f.size,u++);this.sprayData=d,this.sprayGeo.setDrawRange(0,u),this.sprayGeo.attributes.position.needsUpdate=!0,this.sprayGeo.attributes.aAlpha.needsUpdate=!0,this.sprayGeo.attributes.aSize.needsUpdate=!0,this.spray.visible=u>0}};var Ml=class{constructor(){this.ctx=null,this.enabled=!0,this.volume=.8,this.ready=!1,this.duck=1}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let e=window.AudioContext||window.webkitAudioContext;if(!e)return;let t=new e;this.ctx=t,this.master=t.createGain(),this.master.gain.value=this.enabled?this.volume:0;let n=t.createDynamicsCompressor();n.threshold.value=-14,n.ratio.value=4,this.master.connect(n).connect(t.destination),this.sfx=t.createGain(),this.sfx.connect(this.master),this.amb=t.createGain(),this.amb.connect(this.master);let s=t.sampleRate*2,r=t.createBuffer(1,s,t.sampleRate),o=r.getChannelData(0);for(let m=0;m<s;m++)o[m]=Math.random()*2-1;this.noiseBuf=r;let a=()=>{let m=t.createBufferSource();return m.buffer=r,m.loop=!0,m.start(),m};this.motor=t.createGain(),this.motor.gain.value=0;let l=t.createBiquadFilter();l.type="bandpass",l.Q.value=2,this.motorFilter=l,this.oscA=t.createOscillator(),this.oscA.type="sawtooth",this.oscB=t.createOscillator(),this.oscB.type="sine",this.oscA.connect(l),this.oscB.connect(l),l.connect(this.motor).connect(this.amb),this.oscA.start(),this.oscB.start(),this.whine=t.createOscillator(),this.whine.type="sine",this.whineGain=t.createGain(),this.whineGain.gain.value=0,this.whine.connect(this.whineGain).connect(this.amb),this.whine.start();let c=a();this.roadFilter=t.createBiquadFilter(),this.roadFilter.type="lowpass",this.roadGain=t.createGain(),this.roadGain.gain.value=0,c.connect(this.roadFilter).connect(this.roadGain).connect(this.amb);let h=a();this.windFilter=t.createBiquadFilter(),this.windFilter.type="bandpass",this.windFilter.frequency.value=700,this.windFilter.Q.value=.6,this.windGain=t.createGain(),this.windGain.gain.value=0,h.connect(this.windFilter).connect(this.windGain).connect(this.amb);let u=a(),d=t.createBiquadFilter();d.type="highpass",d.frequency.value=1800,this.rainGain=t.createGain(),this.rainGain.gain.value=0,u.connect(d).connect(this.rainGain).connect(this.amb),this.siren=t.createOscillator(),this.siren.type="triangle",this.sirenGain=t.createGain(),this.sirenGain.gain.value=0;let f=t.createBiquadFilter();f.type="lowpass",f.frequency.value=2200,this.siren.connect(f).connect(this.sirenGain).connect(this.sfx),this.siren.start(),this.ready=!0,this.rainTick=0}setEnabled(e){this.enabled=e,this.master&&this.master.gain.setTargetAtTime(e?this.volume:0,this.ctx.currentTime,.05)}update(e,{speed:t,throttle:n,rain:s,sirenLevel:r,inCabin:o=!0,paused:a=!1}){if(!this.ready)return;let l=this.ctx.currentTime,c=a?0:t,h=o?1:.7,u=this.duck;this.oscA.frequency.setTargetAtTime(60+c*7.5,l,.05),this.oscB.frequency.setTargetAtTime(120+c*15,l,.05),this.motorFilter.frequency.setTargetAtTime(300+c*30,l,.05),this.motor.gain.setTargetAtTime(a?0:(.012+n*.03+c*4e-4)*h*u,l,.08),this.whine.frequency.setTargetAtTime(500+c*48,l,.05),this.whineGain.gain.setTargetAtTime(a?0:(.0025+n*.006)*Math.min(1,c/8)*u,l,.08),this.roadFilter.frequency.setTargetAtTime(200+c*22,l,.1),this.roadGain.gain.setTargetAtTime(a?0:We(c/60,0,1)*.11*h*u,l,.1),this.windGain.gain.setTargetAtTime(a?0:We((c/65)**2,0,1)*.08*u,l,.1),this.windFilter.frequency.setTargetAtTime(500+c*14,l,.1),this.rainGain.gain.setTargetAtTime(a?0:s*.05*(.7+c/120),l,.3),!a&&s>.1&&(this.rainTick-=e,this.rainTick<=0&&(this.rainTick=.02+Math.random()*.12/s,this.tick(2e3+Math.random()*3e3,.012*s)));let d=l%1.4<.7;this.siren.frequency.setTargetAtTime(d?440:587,l,.01),this.sirenGain.gain.setTargetAtTime(a?0:r*.05,l,.1)}env(e,t,n,s,r){e.gain.setValueAtTime(1e-4,t),e.gain.exponentialRampToValueAtTime(s,t+n),e.gain.exponentialRampToValueAtTime(1e-4,t+n+r)}tone(e,t=.2,n="sine",s=.15,r=0,o=null){if(!this.ready)return;let a=this.ctx,l=a.currentTime+r,c=a.createOscillator();c.type=n,c.frequency.setValueAtTime(e,l),o&&c.frequency.exponentialRampToValueAtTime(o,l+t);let h=a.createGain();this.env(h,l,.008,s,t),c.connect(h).connect(this.sfx),c.start(l),c.stop(l+t+.05)}noiseBurst(e,t,{type:n="lowpass",freq:s=1e3,q:r=.7,when:o=0,slideTo:a=null}={}){if(!this.ready)return;let l=this.ctx,c=l.currentTime+o,h=l.createBufferSource();h.buffer=this.noiseBuf;let u=l.createBiquadFilter();u.type=n,u.frequency.setValueAtTime(s,c),a&&u.frequency.exponentialRampToValueAtTime(a,c+e),u.Q.value=r;let d=l.createGain();this.env(d,c,.01,t,e),h.connect(u).connect(d).connect(this.sfx),h.start(c,Math.random()),h.stop(c+e+.05)}tick(e,t){this.tone(e,.03,"sine",t)}nomiChime(){this.tone(1318.5,.35,"sine",.09),this.tone(987.8,.5,"sine",.08,.14),this.tone(2637,.2,"sine",.02,0)}naviAlert(){this.tone(880,.12,"sine",.1),this.tone(1174.7,.18,"sine",.1,.13)}pling(){this.tone(1567.98,.25,"triangle",.08),this.tone(2093,.4,"sine",.06,.06)}coin(){this.tone(987.8,.08,"square",.04),this.tone(1318.5,.3,"square",.04,.07)}chime(){[523.25,659.25,783.99,1046.5].forEach((e,t)=>this.tone(e,.25,"triangle",.07,t*.07))}bad(){this.tone(330,.25,"sawtooth",.05,0,180)}crash(){this.tone(70,.5,"sine",.5,0,30),this.noiseBurst(.45,.4,{freq:1800,slideTo:300}),this.noiseBurst(.25,.18,{type:"bandpass",freq:3500,q:3,when:.03})}scrape(){this.noiseBurst(.35,.12,{type:"bandpass",freq:2600,q:6})}whoosh(){this.noiseBurst(.5,.18,{type:"bandpass",freq:400,slideTo:2500,q:1.5})}wiperTwitch(){this.tone(75,.12,"sawtooth",.05),this.noiseBurst(.08,.03,{type:"bandpass",freq:900,q:4})}wiperSweep(){this.tone(70,.9,"sawtooth",.035),this.tone(1400,.35,"sine",.012,.2,1800)}horn(){this.tone(415,.45,"square",.06),this.tone(523,.45,"square",.05)}blinker(){this.tone(2400,.02,"square",.03)}flash(){this.noiseBurst(.05,.15,{type:"highpass",freq:3e3}),this.tone(3200,.6,"sine",.02,.05,6e3)}megafon(){this.tone(900,.4,"square",.04,0,1300)}click(){this.tone(1200,.04,"square",.02)}jingle(){[523.25,659.25,783.99,1046.5,987.77,1046.5].forEach((t,n)=>this.tone(t,.22,"triangle",.06,n*.12))}brunnenJingle(){[392,523.25,659.25,523.25,784].forEach((e,t)=>this.tone(e,.3,"sine",.07,t*.16)),this.noiseBurst(1.2,.03,{type:"highpass",freq:4e3,when:.1})}record(){[659.25,783.99,987.77,1318.5].forEach((e,t)=>this.tone(e,.35,"triangle",.08,t*.1))}confetti(){this.noiseBurst(.15,.3,{type:"lowpass",freq:600});for(let e=0;e<8;e++)this.tone(1500+Math.random()*2500,.05,"sine",.02,.1+e*.04)}};var Bp="Mini Adam",Hp="Tesla-Navi ferngesteuert",Fp="Live-Eskalationen immer woanders!",Iu=[{name:"Tesla Supercharger Erlensee",note:"Hier begann am 30.01.2021 das allererste Navi-Experiment.",km:[1.6,3.2]},{name:"Hochofenwerk Phoenix West, Dortmund",note:"Ziel des ersten Navi-Streams (429,16 km).",km:[2.2,4]},{name:"Burg Hauneck, Haunetal",note:"Das erste Ziel, das 2022 wirklich erreicht wurde.",km:[1.8,3.4]},{name:"Megahub Lehrte",note:"G\xFCterbahnhof. Der Chat war erleichtert.",km:[1.8,3.6]},{name:"Arnhem (Niederlande)",note:"Kurz mal Ausland.",km:[2.5,4.6]},{name:"Gifhorn, Supermarkt-Parkplatz",note:"Historisch bedeutsam. Polizei Gifhorn gr\xFC\xDFt.",km:[2,3.8],special:"gifhorn"},{name:"Liberec (Tschechien)",note:"Ziemlich weit. Wird bestimmt gleich \xFCberboten.",km:[6,8.5]},{name:"Wartburg, Eisenach",note:"Mit Automat f\xFCr 0-Euro-Geldscheine.",km:[1.8,3.5]},{name:"Drive-In: Pommes ohne R\xFCckfragen",note:"Die legend\xE4re Drive-In-Wette.",km:[1.4,2.6],special:"pommes"},{name:"Malte in Norderstedt abholen",note:"Die Bahn f\xE4llt mal wieder aus.",km:[2.6,4.8],special:"malte"},{name:"Burg Ronneburg",note:"Burgen gehen immer.",km:[1.6,3]},{name:"Rastplatz Sch\xE4ferborn Ost",note:"Endstation der dritten Navi-Runde.",km:[1.4,2.8]},{name:"Weser-Skywalk, Beverungen",note:"Aussicht mit Wackelfaktor.",km:[2,3.6]},{name:"Ionity-Ladestation Kirchheim",note:"Strom tanken mit Stil.",km:[1.5,3],special:"charger"},{name:"Tesla Supercharger Mogendorf",note:"Hier endete die 723-km-Tour 2021.",km:[1.8,3.2],special:"charger"},{name:"K\xF6ln",note:"Wo genau? Egal, Hauptsache K\xF6ln.",km:[2.2,4]},{name:"Siegen",note:"Wurde schon oft gespendet. Setzt sich fast nie durch.",km:[2,3.5],special:"siegen",weight:.25},{name:"Bispingen",note:"Schnee im Sommer.",km:[2.4,4.2]},{name:"Sizilien (wegen Monte)",note:"Ein ganz normaler Ostersamstag.",km:[8,11]},{name:"Gardasee",note:"Die Oster-Tour l\xE4sst gr\xFC\xDFen.",km:[5,7]},{name:"Burg Staufen",note:"Silvester-Feeling.",km:[2.2,3.8]},{name:"Kassel \u2013 Elsa besuchen",note:"Spirit-Animal von SkylineTV LIVE.",km:[2,3.8],special:"elsa"},{name:"Fulda",note:"Startort der VIP-Edition.",km:[1.6,3]},{name:"Frankfurt am Main \u2013 Skyline",note:"Heimat von SkylineTV.",km:[2.4,4.4]},{name:"Bad Soden-Salm\xFCnster (Popcorn an der Lades\xE4ule)",note:"Haushaltsger\xE4te an der E-S\xE4ule testen.",km:[1.6,3],special:"charger"},{name:"Bischofsheim in der Rh\xF6n (Starlink)",note:"Erster Starlink-IRL-Stream der Welt.",km:[2.2,3.8]},{name:"Dortmund \u2013 die richtige Currywurstbude",note:"Diesmal ganz sicher die richtige.",km:[1.8,3.2],special:"bude"},{name:"Ein sehr sch\xF6ner Brunnen",note:"F\xFCr eine neue Folge BrunnenTV.",km:[1.4,2.8],special:"brunnen"},{name:"Meister Propper abholen",note:"Er ist ganz bestimmt gleich da.",km:[1.6,3],special:"propper"},{name:"Sparkasse (Farbe pr\xFCfen)",note:"Der Wissenschaftliche Dienst braucht Daten.",km:[1.4,2.6],special:"sparkasse"}],Op=["rot","blau","wei\xDF","rot (wie immer)","\xFCberraschend orange"],P1=["Ebbelwoi","Handk\xE4s","Brunnen","Schnitzel","Navi","Pl\xFCsch","Rettich","Elsa","Sparkassen","Blinker","Wischer","Kassel","Fulda","Gifhorn","Mainz","Rasthof","Akku","Supercharger","Dampfcola","Bananensaft","Kanalpunkte","Pommes","Funkloch","Drohnen","Starlink","Spurwechsel","Autobahn","Leitplanken","Ortsspenden","Rahmen","FullHD","Konfetti","Megafon","Ringtennis","Pandam\xFCtzen"],I1=["_FFM","77","_HD","3000","333","_Fan","fahrer","freund","hesse","_LIVE","42","_93","k\xF6nig","prinzessin","opa","tante","kumpel","_VIP","2017","liebe","meister","_on_tour","1337","xd"];function zi(){return Je(P1)+Je(I1)}function zp(i){let e=0;for(let t=0;t<i.length;t++)e=(e*31+i.charCodeAt(t))%360;return`hsl(${e}, 75%, 68%)`}var bl={james:{name:"James",icon:"\u{1F4B6}",role:"Finanz-Bot"},claudia:{name:"Claudia",icon:"\u2699\uFE0F",role:"Aktions-Bot"},victoria:{name:"Victoria",icon:"\u{1F3C6}",role:"Sieges-B\xF6ttin"},hugo:{name:"Hugo",icon:"\u23F0",role:"Hilfs-Bot"},nora:{name:"Nora",icon:"\u{1F5A5}\uFE0F",role:"Server-Bot"}},wt={ambient:["Gr\xFC\xDFe aus {city}! \u{1F44B}","Hallo Mini Adam \u2764","Ist das Bild wirklich Full HD?","Wo seid ihr gerade?","Welche Farbe hat die Sparkasse hier?","Gibt es in {city} einen Ringtennis-Verein?","Rechts fahren, Adam! \u{1F605}","Sch\xF6ne Landschaft heute","Wie viel Akku noch?","Wann kommt Meister Propper?","Malte Malte Malte Malte Malte","Erz\xE4hl mal die Raab-Story!","Das Bild ist so scharf \u{1F60D}","Elsa \u2764\u{1F438}","BrunnenTV wann?","Bananensaft-Pause? \u{1F34C}","Kappandram\xE4\xDFige Zusammenfassung bitte, bin grad erst rein","Wir sind auf der Autobahn und streamen in Full HD! \u{1F3B6}","Wohin fahren wir eigentlich?","Das Navi-Ziel \xE4ndert sich eh gleich wieder","Gr\xFC\xDFe ans Sprachstudio!","Danke an alle Ehrenmenschen \u{1F64F}","Tic Tac jemand?","Pandam\xFCtze aufsetzen!","Ich biete 1 Cent mehr \u{1F911}","Was ist eigentlich im Kofferraum?","Gr\xFC\xDFe an die Polizei Gifhorn \u{1F46E}","Ist das die A7?","Sch\xF6ner Tesla \u{1F5A4}","Der Wischer ist auch nur ein Mensch","Nils wei\xDF bestimmt, wann wir das letzte Mal hier waren","Bester Stream der Woche","Die Pl\xFCsch-H\xE4nde am Lenkrad \u{1F602}","Gleich kommt bestimmt ein Brunnen","Tesla-Taxi spielen wann?","Erster! (nicht)","Falsche Bude? \u{1F602}","Wer hat das Navi so eingestellt","Adam, schreib mal eine Zahl in den Chat","Was l\xE4uft da im Radio?","Live-Eskalationen immer woanders \u{1F525}"],leftLane:["LINKS IST FREI!!! \u2B05\uFE0F","Endlich linke Spur \u{1F680}","Gib ihm!","Eine Minute Freiheit!","Danke f\xFCr die Freischaltung!","\u2B05\uFE0F\u2B05\uFE0F\u2B05\uFE0F","Jetzt aber links!","Linke Spur, Baby!"],leftLaneEnd:["Und wieder rechts \u{1F605}","Rechtsfahrgebot!","War sch\xF6n, solange es ging","Nochmal freischalten!"],naviChanged:["Wer war das? \u{1F602}","Nicht schon wieder!","\xDCberboten! \u{1F911}","Navi ferngesteuert \u{1F525}","Wendeman\xF6ver incoming","Das Navi wei\xDF auch nicht mehr weiter","Ich biete 1 Cent mehr","Klassiker","Jetzt aber wirklich!","NEIN \u{1F602}"],naviReached:["ANGEKOMMEN! \u{1F389}","Geschafft!!!","Und jetzt?","Gibt es hier eine Sparkasse?","Wo ist der Guide?","Ziel erreicht \u{1F3C1}"],crash:["Rezeption!","Uff \u{1F648}","Das gibt \xC4rger","Polizei Gifhorn ist unterwegs \u{1F693}","Blechschaden!","Hoffentlich hat das keiner gesehen","Eskalation! \u{1F602}","Das war die falsche Spur"],nearMiss:["WAS WAR DAS \u{1F631}","Knapp!!!","Millimeterarbeit","CLIP!","Clip it!","Puh\u2026","Mutig!"],rainStart:["Regen \u{1F327}","Jetzt wird es spannend","Wischer.exe reagiert nicht","Auto-Wischer (Beta) \u{1F602}","Der Herr mit den Schirmen freut sich","Ab jetzt gibt es Regenzulage!"],wiper:["Der Wischer zuckt wieder \u{1F602}","Der Wischer wischt nicht, der winkt nur","Software-Update wann?","Das ist kein Bug, das ist ein Feature","Wischer-Firmware 0.1 Beta","Mach doch einfach manuell!","Der Wischer ist sch\xFCchtern"],police:["POLIZEI GIFHORN \u{1F693}","Polizei Gifhorn kommt!","Benehmen jetzt!","Ganz ruhig bleiben\u2026","\u{1F46E}\u{1F46E}\u{1F46E}"],funkloch:["F","F","F","Ton f","/cam2","F","Bild weg?","F"],funklochBack:["\u2714\uFE0F","\u2714\uFE0F","\u2714\uFE0F Bild ist wieder da","Da ist es wieder \u2714\uFE0F"],frog:["\u{1F438}","\u{1F438}\u{1F438}","Frosch!","\u{1F438} HDMI-Kabel?"],blitzer:["\u{1F4F8}","L\xE4cheln! \u{1F4F8}","Das Foto kommt in einen Rahmen","Tsch\xFCss, du Betr\xFCger!","Teures Selfie"],elefant:["Elefantenrennen \u{1F418}\u{1F418}","Das dauert\u2026","\xDCberholverbot wann?","Die stehen ja fast"],trunk:["Kofferraum auf! \u{1F602}","Was ist da drin?","Bitspende-Eskalation","Konfetti im Kofferraum?"],brunnen:["BRUNNENTV!!!","Herr Sch\xF6nnbrun!","Brunnen gesichtet! \u26F2","Neue Folge BrunnenTV!"],elsa:["ELSA!!! \u2764\u{1F438}","Elsa \u2764","Spirit-Animal gesichtet!","\u{1F451}\u{1F41F}"],record:["REKORD!!! \u{1F389}","Neuer Zuschauerrekord!","Diesmal ohne Viewer-Bots \u{1F916}","Hype!"],banana:["\u{1F34C}\u{1F34C}\u{1F34C}","Bananensaft-Power!","Lecker \u{1F34C}"],koriander:["B\xE4h, Koriander \u{1F922}","Nicht der Koriander!","Wer hat da Koriander bestellt?"],shoulder:["Standstreifen?! \u{1F631}","Polizei Gifhorn!!","Das ist keine Fahrspur!"],fiveJobs:["Job erledigt \u2705","Weiter so!","Noch ein Job weniger"],rahmen:["Sch\xF6ner Rahmen \u{1F602}","Ich sehe nichts mehr","Bestes Geld ever","Danke f\xFCr den Rahmen!"],zahl:()=>pt(.75)?L1():String(Ir(10,9999))};function L1(){let i=Ir(2,4),e="";for(let t=0;t<i;t++)e+=pt(.62)?"3":String(Ir(0,9));return e.includes("3")||(e="3"+e.slice(1)),e}function Lu(i,e={}){return i.replace(/\{(\w+)\}/g,(t,n)=>e[n]!==void 0?e[n]:Je(D1))}var D1=["Fulda","Kassel","Gifhorn","Mainz","K\xF6ln","Siegen","Hanau","Darmstadt","Bielefeld","Buxtehude","Konstanz","Augsburg","Bremen","N\xFCrnberg","Hamburg","L\xFCbeck","Trier","Erlensee"];function Gp(i){return i>=100?"ALTER!":i>=50?"Mittelalter":i>=33?"Drittel-Alter":i>=25?"Viertel-Alter":i>=20?"F\xFCnftel-Alter":i>=10?"Zehntel-Alter":null}var zs={kassandra:{label:"Fr\xE4ulein Kassandra",pitch:1.35,rate:1},weronika:{label:"Weronika",pitch:1.1,rate:.95},karla:{label:"Karla",pitch:1,rate:1.05},william:{label:"Br\xFCll-William",pitch:.55,rate:1.12},board:{label:"NOMI",pitch:1.18,rate:1.04},schoennbrun:{label:"Herr Sch\xF6nnbrun",pitch:.45,rate:.82}},Vp=[{voice:"kassandra",text:"Treffen sich zwei Unterhosen. Fragt die eine: Warst du im Urlaub? Du bist so braun."},{voice:"karla",text:"Hallo Mini Adam, liebe Gr\xFC\xDFe aus {city}. Dachs gr\xFC\xDFt Efeu."},{voice:"william",text:"Mini Adam, bitte einmal hupen! Bimmel hurra!"},{voice:"weronika",text:"Hier spricht Meister Propper. Ich bin in f\xFCnf Minuten da."},{voice:"karla",text:"Gr\xFC\xDFe an das Sprachstudio und an alle Ehrenmenschen!"},{voice:"weronika",text:"Mini Adam, wann gibt es endlich eine neue Folge BrunnenTV?"},{voice:"kassandra",text:"Liebe Gr\xFC\xDFe an Elsa!"},{voice:"karla",text:"Gibt es in {city} eigentlich einen Ringtennis-Verein?"},{voice:"weronika",text:"Welche Farbe hat die Sparkasse in {city}?"},{voice:"william",text:"Mini Adam, erz\xE4hl doch mal die Raab-Story!"},{voice:"karla",text:"Wir sind auf der Autobahn und streamen in Full HD!"},{voice:"william",text:"Ich biete einen Cent mehr. Neues Ziel: {city}."},{voice:"kassandra",text:"Bitte rechts fahren. Mit freundlichen Gr\xFC\xDFen, die Polizei Gifhorn."},{voice:"weronika",text:"Mini Adam, du f\xE4hrst besser als jedes Navi."},{voice:"karla",text:"Hallo Mini Adam! Schreib mal eine Zahl in den Chat. Aber bitte ohne Drei."},{voice:"william",text:"Kappandram\xE4\xDFige Zusammenfassung bitte! Ich war beim Schwimmunterricht."}],Wp=[{voice:"karla",text:"Guten Tag, hier ist der Herr mit den Schirmen. Ich w\xFCrde meine Schirme gerne heute noch abholen."},{voice:"weronika",text:"Mini Adam, dein Scheibenwischer winkt mir gerade zu. Ich winke zur\xFCck!"},{voice:"kassandra",text:"Achtung, Achtung. Der automatische Scheibenwischer befindet sich weiterhin in der Beta-Phase."}],Kn={leftLane:"Die linke Fahrspur ist freigeschaltet.",leftLaneEnd:"Die linke Fahrspur ist wieder gesperrt. Bitte rechts fahren.",naviChanged:"Das Navi-Ziel wurde ge\xE4ndert.",arrived:"Sie haben Ihr Ziel erreicht.",rain:"Regen erkannt. Automatische Scheibenwischer aktiviert.",lowBattery:"Akku schwach. Bitte bald laden.",veryLowBattery:"Akku fast leer. Die Stream-Technik schaltet gleich ab.",elefant:"Achtung. Elefantenrennen voraus.",blitzer:"Hinweis: Tempolimit. Station\xE4rer Blitzer voraus.",shoulder:"Hinweis: Der Standstreifen ist keine Fahrspur.",funkloch:"Verbindung schwach. Mobilfunk wird neu geb\xFCndelt."},Xp=[{id:"rosen",name:"Rosenrahmen",price:12,dur:9},{id:"rettich",name:"Rettichrahmen",price:13.69,dur:9},{id:"pommes",name:"Pommes-Rahmen",price:5,dur:7},{id:"pappkarton",name:"Pappkartonhaufen",price:10,dur:8},{id:"haelfte",name:"Bildh\xE4lfte abdecken",price:10,dur:3.5},{id:"elsa",name:"Elsa auf den Bildschirm zaubern",price:2.9,dur:6},{id:"burger",name:"Burger-Rahmen",price:14,dur:8},{id:"candy",name:"Candy-Rahmen",price:10,dur:8},{id:"lego",name:"Lego-Rahmen",price:12,dur:8},{id:"briefmarken",name:"Briefmarken-Rahmen",price:10.01,dur:8},{id:"chips",name:"Chipsrahmen",price:5,dur:7},{id:"keinerechte",name:"Keine-Rechte-Bildrahmen",price:10,dur:7},{id:"kuerbis",name:"K\xFCrbis im Stream",price:4.9,dur:6}],Np=[{km:0,job:"Brownietester",src:"19.03.2020, Ersatzstream im Homeoffice"},{km:1,job:"M\xFCnzentwerter auf dem Jahrmarkt",src:"23.01.2020, Emskirchen"},{km:2,job:"Plumpsklo-Ingenieur",src:"20.09.2018, M\xFCnster"},{km:3,job:"Baut k\xFCnstliche Maulwurfstunnel",src:"02.01.2020, Cuxhaven"},{km:4,job:"Bildumdreher im Frankfurter Kunstmuseum",src:"05.03.2020, Werne"},{km:5,job:"Krokodilw\xE4chter im Frankfurter Zoo",src:"26.05.2019, Fulda"},{km:6.5,job:"Qualit\xE4tssicherung f\xFCr Schilder (pr\xFCft die Druckaufl\xF6sung)",src:"30.03.2017, M\xFCnchen"},{km:8,job:"Wartet Schornsteine in Wolkenkratzern",src:"13.12.2019, Salzburg"},{km:10,job:"Richtet WLAN in Flugzeugen ein",src:"25.07.2019, Karlsruhe"},{km:12,job:"Schreibt die Algorithmen f\xFCr die roten und orangenen Bereiche bei Google Maps",src:"23.05.2019, Freising"},{km:15,job:"Statistische Modelle f\xFCr die Endzeit der Benzintankstellen",src:"07.10.2022, Golfen im Park"},{km:20,job:"Teilchenbeschleuniger",src:"06.02.2021, Tesla-Navi ferngesteuert"}];function qp(i){let e=Np[0];for(let t of Np)i>=t.km&&(e=t);return e}var Yp=[{id:"left20",text:"20 Sekunden auf der freigeschalteten linken Spur",goal:20,stat:"leftLaneTime"},{id:"navi1",text:"Ein Navi-Ziel erreichen",goal:1,stat:"naviReached"},{id:"near3",text:"3\xD7 haarscharf \xFCberholen",goal:3,stat:"nearMisses"},{id:"speed200",text:"200 km/h fahren",goal:200,stat:"maxSpeedKmh"},{id:"banana2",text:"2\xD7 Bananensaft einsammeln",goal:2,stat:"bananas"},{id:"clean5",text:"5 km ohne Blechschaden",goal:5e3,stat:"cleanDistance"},{id:"changes3",text:"3 Navi-\xC4nderungen \xFCberstehen",goal:3,stat:"naviChanges"},{id:"viewers1000",text:"1.000 Zuschauer erreichen",goal:1e3,stat:"maxViewers"},{id:"charge2",text:"2 Lade-Ringe einsammeln",goal:2,stat:"charges"},{id:"dist8",text:"8 km Strecke schaffen",goal:8e3,stat:"distance"},{id:"blitzfrei",text:"An einem Blitzer vorbei, ohne geblitzt zu werden",goal:1,stat:"blitzerClean"},{id:"rain1",text:"1 km im Regen fahren",goal:1e3,stat:"rainDistance"}],Do=[{id:"boost",icon:"\u26A1",name:"Beschleunigungs-Boost",cat:"Leistung",prices:[300,700,1500],desc:"Over-the-Air-Update f\xFCr mehr Bums. Zieht los wie der Chat bei einer Ortsspende.",effect:i=>`Beschleunigung +${i*20} %`},{id:"vmax",icon:"\u{1F3C1}",name:"Tempo-Freischaltung",cat:"Leistung",prices:[400,900,1900],desc:"Hebt die Software-Drossel auf. Stufe 3 ist der Performance-Modus.",effect:i=>`H\xF6chstgeschwindigkeit ${[200,215,233,261][i]} km/h`},{id:"akku",icon:"\u{1F50B}",name:"Akku-Puffer",cat:"Akku",prices:[350,800,1600],desc:"Mehr nutzbare kWh. Offiziell bleibt es nat\xFCrlich beim 75-kWh-Akku.",effect:i=>`${75+i*4} kWh nutzbar`},{id:"encoder",icon:"\u{1F4E1}",name:"Stream-Technik-Update",cat:"Akku",prices:[300,700,1400],desc:"Telekom, Vodafone und O\u2082 werden effizienter geb\xFCndelt. Die Technik im Kofferraum frisst weniger Strom.",effect:i=>`Stromverbrauch der Stream-Technik \u2212${i*15} %`},{id:"reifen",icon:"\u{1F6DE}",name:"Sportreifen",cat:"Fahrwerk",prices:[350,900],desc:"Mehr Grip f\xFCr schnelle Spurwechsel, auch bei Regen.",effect:i=>`Spurwechsel +${i*12} %, besserer Nassgrip`},{id:"polster",icon:"\u{1F9F8}",name:"Pl\xFCsch-Polster",cat:"Fahrwerk",prices:[500,1300],desc:"Rundum-Polsterung aus original Mini-Adam-Pl\xFCsch. Steckt einen Rempler mehr weg.",effect:i=>`${3+i} Karosserie-Punkte`},{id:"wischer",icon:"\u{1F327}\uFE0F",name:"Wischer-Firmware (Beta)",cat:"Sicht",prices:[250,600,1200],desc:"Der automatische Wischer wischt jetzt manchmal. Manchmal. Zucken bleibt Kult.",effect:i=>["Version 0.1 Beta: zuckt nur","Version 11.1 Beta: wischt ab und zu","Version 11.2 Beta: wischt \xF6fter","Version 12 (immer noch Beta)"][i]},{id:"megafon",icon:"\u{1F4E2}",name:"Megafon",cat:"Spa\xDF",prices:[450],desc:"Wie in Gifhorn: Mit einer Megafon-Durchsage macht der Verkehr vor dir Platz. Taste H.",effect:()=>"Autos vor dir wechseln die Spur"},{id:"starlink",icon:"\u{1F6F0}\uFE0F",name:"Starlink-Sch\xFCssel",cat:"Spa\xDF",prices:[1100],desc:"Wie beim ersten Starlink-IRL-Stream der Welt: keine Funkl\xF6cher, mehr Zuschauer, mehr Spenden.",effect:()=>"Keine Funkl\xF6cher, +25 % Zuschauer, +20 % Spenden"},{id:"linksspur",icon:"\u2B05\uFE0F",name:"Linke-Spur-Sammelaktion",cat:"Spa\xDF",prices:[400,1e3],desc:"Die Community sammelt flei\xDFiger: Die linke Spur wird \xF6fter freigeschaltet und zahlt besser.",effect:i=>`Linke-Spur-Bonus +${i*25} %, h\xE4ufiger`},{id:"elsa",icon:"\u{1F451}",name:"Wackel-Elsa",cat:"Deko",prices:[120],desc:"Das Spirit-Animal von SkylineTV LIVE als Wackelfigur f\xFCrs Armaturenbrett.",effect:()=>"Wackelt bei jeder Kurve mit"},{id:"weste",icon:"\u{1F9BA}",name:"Warnweste",cat:"Deko",prices:[90],desc:"F\xFCr Mini Adam. Bringt nichts, sieht aber sehr professionell aus.",effect:()=>"Sichtbar beim Drohnenflug"},{id:"konfetti",icon:"\u{1F389}",name:"Konfetti-Kanone",cat:"Deko",prices:[200],desc:"Knallt bei jedem erreichten Ziel. Ein paar Schnipsel kleben danach an der Scheibe \u2013 wie 2022.",effect:()=>"Konfetti bei Navi-Zielen"}],El=Object.fromEntries(Do.map(i=>[i.id,i.prices.length])),Zp=[["Fahrer","Mini Adam"],["Kamera","station\xE4r"],["Drohne","die Drohne"],["Sprachstudio","das Sprachstudio"],["Scheibenwischer","Auto-Wischer (Beta)"],["Navigation","ferngesteuert vom Chat"]];function Kp(i=1,e=30){let t=_e(i,e);return pt(.15)?13.69:pt(.1)?3.33:Math.round(t*100)/100}var wl=class{constructor(){if(this.supported=typeof window<"u"&&"speechSynthesis"in window&&typeof SpeechSynthesisUtterance<"u",this.enabled=!0,this.voices=[],this.queue=[],this.busy=!1,this.current=null,this.supported){let e=()=>{let t=window.speechSynthesis.getVoices();this.voices=t.filter(n=>/^de(-|_|$)/i.test(n.lang))};e(),window.speechSynthesis.onvoiceschanged=e}}pickVoice(e){if(!this.voices.length)return null;let t={board:[/Google Deutsch/i,/Anna/i,/Hedda/i,/Katja/i,/Petra/i,/Helena/i],kassandra:[/Anna/i,/Google Deutsch/i,/Katja/i,/Hedda/i],weronika:[/Hedda/i,/Petra/i,/Google Deutsch/i],karla:[/Katja/i,/Google Deutsch/i,/Anna/i],william:[/Stefan/i,/Markus/i,/Yannick/i,/Conrad/i,/Google Deutsch/i],schoennbrun:[/Stefan/i,/Markus/i,/Yannick/i,/Conrad/i]}[e]||[];for(let n of t){let s=this.voices.find(r=>n.test(r.name));if(s)return s}return this.voices[0]}estimate(e,t=1){return Math.max(1.2,e.length/14/t)}say(e,t="board",n={}){let s=zs[t]||zs.board,r=this.estimate(e,s.rate),o={text:e,voiceKey:t,opts:n,dur:r};if(n.priority)this.queue=this.queue.filter(a=>a.opts.priority),this.current&&!this.current.opts.priority&&this.cancelCurrent(),this.queue.unshift(o);else{if(this.queue.length>2)return r;this.queue.push(o)}return this.pump(),r}cancelCurrent(){if(this.supported)try{window.speechSynthesis.cancel()}catch{}this.current?.timer&&clearTimeout(this.current.timer);let e=this.current;this.current=null,this.busy=!1,e?.opts.onEnd?.()}pump(){if(this.busy||!this.queue.length)return;let e=this.queue.shift();this.busy=!0,this.current=e;let t=zs[e.voiceKey]||zs.board;e.opts.onStart?.(e.dur);let n=()=>{this.current===e&&(e.timer&&clearTimeout(e.timer),this.current=null,this.busy=!1,e.opts.onEnd?.(),setTimeout(()=>this.pump(),250))};if(this.supported&&this.enabled&&this.voices.length)try{let s=new SpeechSynthesisUtterance(e.text);s.lang="de-DE";let r=this.pickVoice(e.voiceKey);r&&(s.voice=r),s.pitch=t.pitch,s.rate=t.rate,s.volume=1,s.onend=n,s.onerror=n,window.speechSynthesis.speak(s),e.timer=setTimeout(n,(e.dur+4)*1e3);return}catch{}e.timer=setTimeout(n,e.dur*1e3)}stopAll(){this.queue=[],this.cancelCurrent()}pause(e){if(this.supported)try{e?window.speechSynthesis.pause():window.speechSynthesis.resume()}catch{}}};var Sl=class{constructor(){this.keys=new Set,this.pressed=new Set,this.touch={left:!1,right:!1,gas:!1,brake:!1},this.steer=0,this.throttle=0,this.brake=0,this.anyKey=!1,this.lastDevice="keyboard";let e={ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right",ArrowUp:"gas",KeyW:"gas",ArrowDown:"brake",KeyS:"brake",Space:"horn",KeyE:"wiper",KeyH:"megafon",Escape:"pause",KeyP:"pause",KeyV:"camera",KeyM:"mute",Enter:"confirm",KeyC:"chat"};this.map=e,window.addEventListener("keydown",t=>{let n=e[t.code];t.target&&/input|textarea|select/i.test(t.target.tagName)||(this.anyKey=!0,this.lastDevice="keyboard",n&&(this.keys.has(n)||this.pressed.add(n),this.keys.add(n),["left","right","gas","brake","horn"].includes(n)&&t.preventDefault()))}),window.addEventListener("keyup",t=>{let n=e[t.code];n&&this.keys.delete(n)}),window.addEventListener("blur",()=>this.keys.clear()),this.padPrev={}}bindTouch(e,t){let n=r=>{r.preventDefault(),this.lastDevice="touch",t in this.touch?this.touch[t]=!0:this.pressed.add(t)},s=r=>{r.preventDefault(),t in this.touch&&(this.touch[t]=!1)};e.addEventListener("pointerdown",n),e.addEventListener("pointerup",s),e.addEventListener("pointercancel",s),e.addEventListener("pointerleave",s)}poll(){let e=0,t=0,n=0;(this.keys.has("left")||this.touch.left)&&(e-=1),(this.keys.has("right")||this.touch.right)&&(e+=1),(this.keys.has("gas")||this.touch.gas)&&(t=1),(this.keys.has("brake")||this.touch.brake)&&(n=1);let s=navigator.getGamepads?navigator.getGamepads():[];for(let r of s){if(!r)continue;let o=r.axes[0]||0;Math.abs(o)>.15&&(e=o,this.lastDevice="gamepad");let a=r.buttons[7]?.value||0,l=r.buttons[6]?.value||0;a>.05&&(t=Math.max(t,a)),l>.05&&(n=Math.max(n,l)),r.buttons[12]?.pressed&&(t=1),r.buttons[13]?.pressed&&(n=1);let c=(h,u)=>{let d=!!r.buttons[h]?.pressed;d&&!this.padPrev[h]&&(this.pressed.add(u),this.anyKey=!0),this.padPrev[h]=d};c(0,"horn"),c(2,"wiper"),c(3,"megafon"),c(9,"pause"),c(1,"camera")}this.steer=Math.max(-1,Math.min(1,e)),this.throttle=t,this.brake=n}take(e){return this.pressed.has(e)?(this.pressed.delete(e),!0):!1}endFrame(){this.pressed.clear(),this.anyKey=!1}};var Du="mini-adam-tesla-navi-v1",Gs={wallet:0,upgrades:{},best:{distance:0,earned:0,viewers:0},stats:{runs:0,totalKm:0,naviReached:0,crashes:0,leftLaneEuro:0},settings:{sound:!0,speech:!0,chat:!0,quality:"auto",volume:.8},seenIntro:!1};function $p(){try{let i=localStorage.getItem(Du);if(!i)return structuredClone(Gs);let e=JSON.parse(i);return{...structuredClone(Gs),...e,best:{...Gs.best,...e.best||{}},stats:{...Gs.stats,...e.stats||{}},settings:{...Gs.settings,...e.settings||{}},upgrades:{...e.upgrades||{}}}}catch{return structuredClone(Gs)}}function Vs(i){try{return localStorage.setItem(Du,JSON.stringify(i)),!0}catch{return!1}}function Jp(){try{localStorage.removeItem(Du)}catch{}return structuredClone(Gs)}var Tl=1/3.6,k1=[200,215,233,261],ku=-7.8,jp=10,U1=7.9,Al=class{constructor(){this.reset({})}reset(e={}){let t=n=>e[n]||0;this.upgrades=e,this.vmaxBase=k1[Math.min(3,t("vmax"))]*Tl,this.accelMul=1+.2*t("boost"),this.capacity=75+4*t("akku"),this.streamDrain=.1*(1-.15*t("encoder")),this.latMul=1+.12*t("reifen"),this.wetGrip=.66+.13*t("reifen"),this.maxHits=3+t("polster"),this.s=0,this.x=Ce.laneCenter(3),this.vx=0,this.speed=95*Tl,this.yaw=0,this.latAcc=0,this.steer=0,this.throttle=0,this.braking=0,this.battery=100,this.hits=0,this.cooldown=0,this.len=Yn.length,this.w=Yn.width,this.shoulderTime=0,this.scrapeCooldown=0,this.sugar=0,this.wobble=0,this.limiter=0,this.empty=!1,this.events=[]}get kmh(){return this.speed*3.6}get vmax(){return this.vmaxBase*(this.sugar>0?1.08:1)}get lane(){return We(Math.round((this.x+5.625)/3.75),0,3)}get inLeftLane(){return this.x<-3.75-.35}get onShoulder(){return this.x>U1}update(e,t,n={}){this.events.length=0;let s=n.wet||0,r=1-s*(1-this.wetGrip);this.cooldown=Math.max(0,this.cooldown-e),this.scrapeCooldown=Math.max(0,this.scrapeCooldown-e),this.sugar=Math.max(0,this.sugar-e),this.wobble=Math.max(0,this.wobble-e);let o=this.speed/55,a=.25*o*o*(.4+.6*Math.max(this.throttle,.35)),l=(this.streamDrain+a)*(75/this.capacity);this.battery=Math.max(0,this.battery-l*e),this.empty=this.battery<=0;let c=this.empty?0:We(t.throttle,0,1),h=We(t.brake,0,1);this.throttle=In(this.throttle,c,8,e),this.braking=h;let u=this.speed,d=this.vmax,f=0;if(c>.02&&u<d){let x=We(u/d,0,1);f+=c*5.4*this.accelMul*Math.max(.12,1-Math.pow(x,2.6))}h>.02&&(f-=h*9.5*(1-s*.18)),c<=.02&&h<=.02&&(f-=.12+11e-5*u*u+(this.empty?1.4:0)),u>d&&(f=Math.min(f,-1.5)),this.speed=Math.max(0,u+f*e),u<=d&&this.speed>d&&(this.speed=d);let m=We(t.steer,-1,1);this.wobble>0&&(m+=Math.sin(this.wobble*9)*.35),this.steer=In(this.steer,m,14,e);let v=We(this.speed/12,0,1),g=4.3*this.latMul*r*v,p;if(Math.abs(m)>.08)p=m*g;else{let x=Ce.laneCenter(this.lane);p=We((x-this.x)*2,-1.9,1.9)*v}let _=this.vx;if(this.vx=In(this.vx,p,8.5*r,e),this.latAcc=(this.vx-_)/Math.max(e,1e-4),this.x+=this.vx*e,this.x<ku||this.x>jp){let x=this.x<ku?-1:1;this.x=x<0?ku:jp;let y=Math.abs(this.vx)>1.2;this.vx=-x*Math.min(1.5,Math.abs(this.vx)*.4),this.scrapeCooldown<=0&&(this.scrapeCooldown=.6,this.speed*=y?.9:.97,this.events.push({type:"rail",side:x,hard:y}))}this.onShoulder&&this.speed>5?this.shoulderTime+=e:this.shoulderTime=Math.max(0,this.shoulderTime-e*2),this.yaw=We(Math.atan2(this.vx,Math.max(this.speed,4)),-.22,.22),this.s+=this.speed*e}collide(e){if(this.cooldown>0)return!1;let t=e.car,n=e.lonOverlap>e.latOverlap*1.6;if(!n&&e.ds>0)this.s=t.s-(t.len+this.len)/2-.35,this.speed=Math.max(0,Math.min(this.speed,t.speed)-4),t.speed+=2.5;else if(!n&&e.ds<0)this.speed+=2,t.speed=Math.max(0,this.speed-4),t.s=this.s-(t.len+this.len)/2-.4;else{let s=e.dx>0?-1:1;this.x+=s*(e.latOverlap+.12),this.vx=s*3.2,this.speed*=.93,t.speed*=.97}return this.hits++,this.cooldown=1.6,!0}charge(e){this.battery=Math.min(100,this.battery+e),this.empty=!1}};function Uu(i){if(!i)return"";if(i.short)return i.short;let e=i.name.split(/[,(–:]/)[0].trim();return e.length>24?e.slice(0,23)+"\u2026":e}var N1={rot:"#d5121e",blau:"#1d5fbf",wei\u00DF:"#f2f2f2","rot (wie immer)":"#d5121e","\xFCberraschend orange":"#f07a12"},Rl=class{constructor(e){this.scenery=e,this.requests=[],this.reset(0)}reset(e){for(let t of this.requests)this.scenery.cancel(t);this.requests=[],this.bid=.01,this.changes=0,this.history=[],this.set(e,Iu[0],"Mini Adam",{first:!0})}pickTarget(){let e=this.target;return Mo(Iu.filter(t=>t!==e),t=>t.weight??1)}overbid(e,t){let n=pt(.18)?Math.floor(_e(2,12)):1;this.bid=Math.round((this.bid+n*.01)*100)/100,this.changes++;let s=this.pickTarget();return this.set(e,s,t),s}set(e,t,n,{first:s=!1}={}){for(let r of this.requests)this.scenery.cancel(r);this.requests=[],this.target=t,this.bidder=n,this.km=_e(t.km[0],t.km[1]),this.startS=e,this.targetS=e+this.km*1e3,this.recalc=s?0:1,this.wende=!s&&pt(.28),this.wendeS=e+_e(380,820),this.arrived=!1,this.side=pt(.5)?1:-1,this.sparkColor=Je(Op),this.history.push({name:t.name,bidder:n,bid:this.bid}),this.history.length>12&&this.history.shift(),this.placeLandmarks()}placeLandmarks(){let e=this.target,t=this.targetS,n=(s,r,o)=>this.requests.push(this.scenery.request(s,r,o));switch(n("ziel",t,{title:Uu(e)}),e.special){case"brunnen":n("brunnen",t-70);break;case"elsa":n("elsa",t-70);break;case"sparkasse":n("sparkasse",t-90,{color:N1[this.sparkColor]||"#d5121e"});break;case"pommes":n("kiosk",t-80,{title:"Drive-In",sub:"Pommes ohne R\xFCckfragen"});break;case"bude":n("kiosk",t-80,{title:"Currywurst",sub:"die richtige Bude (wirklich!)"});break;case"charger":n("charger",t-80);break;default:break}/Burg|Wartburg/.test(e.name)&&n("burg",t-40),/Frankfurt/.test(e.name)&&n("skyline",t)}get remaining(){return Math.max(0,this.targetS-this._s)}update(e,t){this._s=t;let n=[];return this.recalc=Math.max(0,this.recalc-e/2.4),this.wende&&t>this.wendeS&&(this.wende=!1,this.recalc=.8,n.push({type:"wendeIgnored"})),!this.arrived&&t>=this.targetS&&(this.arrived=!0,n.push({type:"arrived",target:this.target,km:this.km})),n}screen(e,t,n){let s=Math.max(0,this.targetS-e),r=t+s/We(n,20,70)*.5;return{target:this.arrived?"Ziel erreicht \u2013 warte auf neues Gebot \u2026":this.target.name,remaining:s,recalc:this.recalc,side:this.side,wende:this.wende,wendeS:this.wendeS,eta:this.arrived?"":"Ankunft "+Lr(r),bidder:this.bidder,bid:Yt(this.bid)}}};var B1=["POLIZEI GIFHORN","GUTE FAHRT, ADAM!","GIFHORN GR\xDCSST","BITTE L\xC4CHELN"],Cl=class{constructor(e){Object.assign(this,e),this.player=new Al,this.navi=new Rl(this.scenery),this.scenery.gantryInfo=()=>({target:Uu(this.navi.target),km:Math.max(.1,(this.navi.targetS-this.player.s)/1e3)}),this.running=!1,this.over=null}start(e){this.save=e;let t=e.upgrades||{};this.up=t;let n=this.player;n.reset(t),this.t=0,this.money=0,this.breakdown={},this.over=null,this.running=!0,this.queue=[],this.clock=18*60,this.viewers=240,this.hype=0,this.peakViewers=240,this.recordShown=!1,this.lastHorn=-99,this.megafonCd=0,this.leftTick=0,this.chatT=1.5,this.donationT=_e(6,10),this.stats={leftLaneTime:0,naviReached:0,nearMisses:0,maxSpeedKmh:0,bananas:0,cleanDistance:0,naviChanges:0,maxViewers:0,charges:0,distance:0,blitzerClean:0,rainDistance:0,crashes:0,koriander:0,fines:0,wipes:0,twitches:0,photos:0},this.jobs=Wf(Yp).slice(0,5).map(r=>({...r,done:!1,progress:0})),this.allJobsPaid=!1;let s=t.linksspur||0;this.left={open:!1,timer:0,next:_e(22,30),warned:!1,glow:0,rg:0,grace:0,bonusMul:1+.25*s,freq:1-.14*s,earned:0},this.weather={level:0,target:0,active:!1,dur:0,cool:0,announced:!1,regenzulage:!1},this.T={bid:_e(38,52),durchsage:_e(28,40),rahmen:_e(70,100),funkloch:_e(110,170),frog:_e(160,260),trunk:_e(120,200),numbers:_e(80,130),police:_e(200,300),wiperChat:0},this.S={blitzer:_e(3e3,3800),elefant:_e(3200,4200),landmark:_e(1400,2e3),charge:_e(700,1e3),banana:_e(1100,1500),koriander:_e(2200,2800)},this.blitzer=null,this.landmark=null,this.funkloch=0,this.policeCar=null,this.shoulderWarned=!1,this.batteryWarned=0,this.lastHugo=0,this.scenery.reset(),this.navi.reset(0),this.traffic.reset(),this.traffic.populate(0,n.speed),this.pickups.reset(),this.speech.stopAll(),this.windshield.clear(),this.windshield.setRain(0),this.windshield.setFirmware(t.wischer||0),this.windshield.onEvent=r=>this.onWiper(r),this.cockpit.clearConfetti(),this.cockpit.setElsa(!!t.elsa),this.ui.reset?.(),this.ui.jobs(this.jobs),this.bot("hugo","Der Stream l\xE4uft! Viel Spa\xDF beim Zuschauen."),this.later(1.2,()=>this.chat("Hallo Mini Adam \u2764")),this.later(2,()=>this.chat("Wohin fahren wir heute?")),this.later(3.2,()=>this.bot("james",`Startgebot: ${Yt(this.navi.bid)} \u2013 Ziel: ${this.navi.target.name}`))}startDemo(){this.running=!1,this.over=null,this.demoT=0,this.player.reset({}),this.player.x=1.875,this.player.speed=118*Tl,this.weather={level:0,target:0,active:!1,dur:0,cool:0,announced:!1,regenzulage:!1},this.left={open:!1,timer:0,glow:0},this.sirenLevel=0,this.scenery.reset(),this.navi.reset(0),this.traffic.reset(),this.traffic.populate(0,this.player.speed),this.pickups.reset()}demo(e,t){this.demoT+=e;let n=this.player;n.update(e,t,{wet:0}),n.battery=100,n.hits=0,this.navi.update(e,n.s),this.navi.arrived&&this.navi.overbid(n.s,"Demo"),this.traffic.update(e,this.demoT,n,{difficulty:.15,leftOpen:!1,rain:0})}later(e,t){this.queue.push({at:this.t+e,fn:t})}chat(e,t=zi(),n={}){this.ui.chat&&this.ui.chat({name:t,text:Lu(e),...n})}bot(e,t){let n=bl[e];this.ui.chat({name:n.name,text:t,bot:e,icon:n.icon})}burst(e,t=3,n=2.5){let s=typeof e=="function"?null:e;for(let r=0;r<t;r++)this.later(_e(.1,n),()=>this.chat(s?Je(s):e()))}say(e,t="talk",{priority:n=!0}={}){this.audio.nomiChime();let s=this.cockpit.nomi;s.setMood(t,3.2);let r=()=>{let o=this.speech.say(e,"board",{priority:n,onStart:a=>s.speak(a)});this.ui.nomi(e,o+.8)};this.running?this.later(.35,r):r()}earn(e,t,{mult:n=!0,silent:s=!1}={}){if(e<=0)return 0;let r=n&&this.weather.regenzulage?1.5:1,o=e*r;return this.money+=o,this.breakdown[t]=(this.breakdown[t]||0)+o,s||this.ui.money(o,t),o}fine(e,t){let n=Math.min(this.money,e);this.money-=n,this.breakdown[t]=(this.breakdown[t]||0)-n,this.stats.fines+=n,this.ui.money(-e,t),this.audio.bad()}donate(e,t,n){let s=this.earn(t*(this.up.starlink?1.2:1),"Spenden",{silent:!0});this.bot("james",`${e} hat ${Yt(s)} ${n?"f\xFCr \xBB"+n+"\xAB ":""}gespendet!`),this.ui.money(s,"Spende"),this.audio.pling();let r=Gp(s);return r&&this.later(.6,()=>this.chat(r+(s>=33?" \u{1F631}":""))),this.hype+=s*2,s}update(e,t,n){if(!this.running)return;this.t+=e;let s=this.player,r=this.stats,o=this.weather;if(this.queue.length){let h=this.t,u=this.queue.filter(d=>d.at<=h);if(u.length){this.queue=this.queue.filter(d=>d.at>h);for(let d of u)d.fn()}}let a=s.s;s.update(e,t,{wet:o.level});let l=s.s-a;for(let h of s.events)h.type==="rail"&&(this.audio.scrape(),this.fx.shake(h.hard?.5:.2),h.hard&&pt(.4)&&this.chat(Je(["Leitplanke! \u{1F62C}","Uff, die Leitplanke","Kratz kratz"])));r.distance=s.s,r.maxSpeedKmh=Math.max(r.maxSpeedKmh,s.kmh),r.cleanDistance+=l,o.level>.3&&(r.rainDistance+=l),this.clock+=e*.5,this.megafonCd=Math.max(0,this.megafonCd-e),t.horn&&this.honk(),t.wiper&&this.manualWiper(),t.megafon&&this.useMegafon();let c=this.traffic.update(e,this.t,s,{difficulty:We(s.s/16e3,0,1),leftOpen:this.left.open,rain:o.level});for(let h of c)h.type==="crash"?this.onCrash(h):h.type==="nearMiss"?this.onNearMiss(h):h.type==="passPolice"&&this.chat(Je(["Polizei \xFCberholt?! Mutig! \u{1F605}","Tsch\xFCss Polizei Gifhorn \u{1F44B}","Das gibt einen Eintrag ins Fahrtenbuch"]));this.over||(this.sirenLevel=0,this.policeCar&&(this.traffic.cars.includes(this.policeCar)?this.sirenLevel=We(1-Math.abs(this.policeCar.s-s.s)/260,0,1):this.policeCar=null),this.updateLeftLane(e),this.updateWeather(e,l),this.updateNavi(e),this.updateEvents(e),this.updatePickups(e,n),this.updateViewers(e),this.updateChat(e),this.updateJobs(),s.shoulderTime>1.2&&!this.shoulderWarned&&(this.shoulderWarned=!0,this.say(Kn.shoulder,"worried"),this.burst(wt.shoulder,2,1.5)),s.shoulderTime>4.5&&(s.shoulderTime=0,this.fine(10,"Verwarngeld"),this.ui.toast("\u{1F693} Standstreifen: 10 \u20AC Verwarngeld","bad"),this.callPolice("STANDSTREIFEN? NEIN!")),s.shoulderTime<=0&&(this.shoulderWarned=!1),s.battery<20&&this.batteryWarned<1&&(this.batteryWarned=1,this.say(Kn.lowBattery,"worried"),this.chat(Je(["Akku! \u{1F50B}","Wo ist der n\xE4chste Supercharger?","Lade-Ringe einsammeln!"]))),s.battery<7&&this.batteryWarned<2&&(this.batteryWarned=2,this.say(Kn.veryLowBattery,"worried")),s.empty&&s.speed<1.5&&this.end("akku"))}updateLeftLane(e){let t=this.left,n=this.player;if(!t.open)t.next-=e,t.next<=0&&this.openLeftLane();else{if(t.timer-=e,n.inLeftLane){let s=1.25*(.45+.55*We(n.speed/50,0,1.3))*t.bonusMul,r=this.earn(s*e,"Linke Spur",{silent:!0});t.earned+=r,this.leftTick+=r,this.stats.leftLaneTime+=e,this.leftTick>=1&&(this.ui.money(this.leftTick,"Linke Spur"),this.leftTick=0)}t.timer<=10&&!t.warned&&(t.warned=!0,this.ui.banner("\u23F3 Linke Spur: noch 10 Sekunden",2.5)),t.timer<=0&&this.closeLeftLane()}t.glow=In(t.glow,t.open?1:0,3,e),t.grace=Math.max(0,t.grace-e),!t.open&&n.inLeftLane&&t.grace<=0?(t.rg+=e,t.rg>7&&!t.rgWarned&&(t.rgWarned=!0,this.ui.toast("\u26A0\uFE0F Rechtsfahrgebot! Die linke Spur ist gesperrt.","bad"),this.callPolice("BITTE RECHTS FAHREN"),this.burst(["Rechts fahren! \u{1F605}","Rechtsfahrgebot!","Polizei Gifhorn kommt\u2026"],2,1.5)),t.rg>15&&(t.rg=0,t.rgWarned=!1,this.fine(10,"Verwarngeld"),this.ui.toast("\u{1F693} Rechtsfahrgebot missachtet: 10 \u20AC Verwarngeld","bad"))):(t.rg=Math.max(0,t.rg-e*2),t.rg<=0&&(t.rgWarned=!1))}openLeftLane(){let e=this.left;e.open=!0,e.timer=60,e.warned=!1;let t=zi();this.say(Kn.leftLane,"happy"),this.audio.chime(),this.later(.2,()=>this.donate(t,Je([3.33,5,2.5,10,4.2]),"Linke Spur freischalten")),this.burst(wt.leftLane,3,3),this.ui.banner("\u2B05\uFE0F Linke Spur freigeschaltet!",4,"Eine Minute Bonusguthaben auf der ganz linken Spur"),this.hype+=40}closeLeftLane(){let e=this.left;e.open=!1,e.next=_e(45,70)*e.freq,e.grace=5,this.say(Kn.leftLaneEnd,"idle"),e.earned>.5&&this.ui.toast(`\u2B05\uFE0F Linke Spur: ${Yt(e.earned)} Bonusguthaben`,"good"),e.earned=0,this.burst(wt.leftLaneEnd,2,2.5)}updateWeather(e,t){let n=this.weather,s=this.player;if(n.active)n.dur-=e,n.dur<=0&&(n.active=!1,n.target=0,n.cool=_e(60,100),this.later(8,()=>this.chat(Je(["Endlich trocken \u2600\uFE0F","Regen vorbei!","Der Wischer hat sich erholt"]))));else{n.cool-=e;let o=s.s>=4e3&&this.stats.cleanDistance>=2500;n.cool<=0&&(o||s.s>=7500)&&(n.active=!0,n.target=_e(.6,1),n.dur=_e(95,150),n.announced=!1)}let r=n.target>n.level?.07:.05;n.level+=We(n.target-n.level,-r*e,r*e),n.active&&!n.announced&&n.level>.12&&(n.announced=!0,this.say(Kn.rain,"worried"),this.burst(wt.rainStart,3,4),this.later(4,()=>this.ui.banner("\u{1F327}\uFE0F Regenzulage!",4,"Solange es regnet, gibt es 1,5-fach Guthaben")),this.audio.whoosh()),n.regenzulage=n.level>.3,this.windshield.setRain(n.level)}onWiper(e){e==="twitch"?(this.audio.wiperTwitch(),this.stats.twitches++):(this.audio.wiperSweep(),this.stats.wipes++),this.running&&e==="twitch"&&this.T.wiperChat<=0&&this.weather.level>.2&&pt(.3)&&(this.T.wiperChat=14,this.chat(Je(wt.wiper)))}manualWiper(){let e=this.windshield.manual();e==="wipe"?this.ui.toast("\u{1F327}\uFE0F Wisch! Klare Sicht.","info"):e==="twitch"&&(this.ui.toast("\u{1F327}\uFE0F Der Wischer zuckt nur \u2026","info"),pt(.4)&&this.chat(Je(wt.wiper)))}updateNavi(e){let t=this.player;if(this.T.bid<=0)if(this.T.bid=_e(36,72),pt(.16)){let n=zi();this.bot("james",`${n} bietet ${Yt(this.navi.bid+.01)} \u2013 neues Ziel: Siegen`),this.chat(Je(["SIEGEN!","Siegen? \u{1F440}","Diesmal Siegen!"])),this.later(2.2,()=>this.changeNavi(!0))}else this.changeNavi(!1);for(let n of this.navi.update(e,t.s))n.type==="wendeIgnored"?(this.say("Route wird neu berechnet.","think",{priority:!1}),pt(.6)&&this.chat(Je(["Wenden auf der Autobahn? \u{1F602}","Bitte wenden\u2026 nein!","Das Navi gibt nicht auf"]))):n.type==="arrived"&&this.onArrive(n)}changeNavi(e){let t=this.player,n=zi(),s=this.navi.overbid(t.s,n);this.stats.naviChanges++,this.bot("james",`${n} bietet ${Yt(this.navi.bid)} \u2013 neues Ziel: ${s.name}`),e&&this.later(.8,()=>this.chat(Je(["Siegen wurde \xFCberboten. Wie immer \u{1F602}","Nicht schon wieder Siegen verpasst","Klassiker"]))),this.say(Kn.naviChanged,"think"),this.audio.naviAlert(),this.burst(wt.naviChanged,2,3),s.special==="siegen"&&this.later(1.4,()=>this.chat("SIEGEN SETZT SICH DURCH?! \u{1F631}")),this.navi.wende&&this.later(3.5,()=>this.ui.toast("\u21A9\uFE0F Navi: \u201EBitte wenden\u201C \u2013 auf der Autobahn?","info")),this.ui.toast(`\u{1F4CD} Neues Navi-Ziel: ${s.name} (${tn(this.navi.km,1)} km)`,"info"),this.hype+=25}onArrive(e){let t=this.player,n=e.target;this.stats.naviReached++;let s=Math.round(20+e.km*14);switch(n.special==="siegen"&&(s*=2),this.say(Kn.arrived,"love"),this.audio.jingle(),this.earn(s,"Navi-Ziele"),this.ui.banner(`\u{1F3C1} Ziel erreicht: ${n.name}`,4),this.burst(wt.naviReached,4,3),this.hype+=120,this.up.konfetti&&(this.cockpit.addConfetti(70),this.audio.confetti(),this.later(1,()=>this.chat("KONFETTI! \u{1F389}"))),n.special){case"charger":t.charge(35),this.ui.toast("\u{1F50C} Schnell geladen: +35 % Akku","good"),this.stats.charges++;break;case"gifhorn":this.later(1.5,()=>this.callPolice("GIFHORN GR\xDCSST!"));break;case"brunnen":this.later(1.2,()=>this.speech.say("Ein sehr sch\xF6ner Brunnen. Vielen Dank.","schoennbrun")),this.audio.brunnenJingle(),this.burst(wt.brunnen,3,2);break;case"elsa":this.burst(wt.elsa,3,2);break;case"propper":this.later(4.5,()=>this.say("Meister Propper ist leider noch nicht da.","worried",{priority:!1})),this.later(6,()=>this.chat(Je(["Wie immer \u{1F602}","Er ist bestimmt gleich da","F\xFCnf Minuten noch!"])));break;case"malte":this.burst(["Malte Malte Malte Malte","MALTE!","MaLTE","Malte ist eingestiegen \u2714\uFE0F"],5,3);break;case"siegen":this.burst(["SIEGEN!!! Es ist tats\xE4chlich passiert \u{1F631}","Geschichte wurde geschrieben","Doppelter Bonus f\xFCr Siegen!"],3,2);break;case"sparkasse":this.later(1.5,()=>this.ui.chat({name:"Wissenschaftlicher Dienst",text:`\u{1F52C} Ergebnis: Die Sparkasse ist ${this.navi.sparkColor}.`,bot:"claudia",icon:"\u{1F52C}"}));break;case"pommes":this.earn(10,"Navi-Ziele"),this.burst(["Pommes ohne R\xFCckfragen \u{1F35F}","Mit Mayo!","Keine R\xFCckfragen!"],3,2);break;case"bude":this.burst(["Diesmal die richtige Bude! \u{1F32D}","Falsche Bude? \u{1F602}","Currywurst!"],3,2);break;default:break}this.T.bid=Math.min(this.T.bid,_e(6,10))}updateEvents(e){let t=this.player,n=this.T;for(let r of Object.keys(n))n[r]-=e;if(n.durchsage<=0){n.durchsage=_e(48,85);let r=this.weather.level>.3&&pt(.5)?Wp:Vp,o=Je(r),a=Lu(o.text),l=zi();this.donate(l,3,"Sprachdurchsage"),this.later(1.2,()=>{let c=this.speech.say(a,o.voice);this.ui.durchsage(zs[o.voice].label,a,c+1,l)})}if(n.rahmen<=0&&t.s>1e3){n.rahmen=_e(75,130);let r=Je(Xp),o=zi();this.donate(o,r.price,r.name),this.ui.rahmen(r,o),this.later(2,()=>this.chat(Je(wt.rahmen)))}if(this.funkloch>0&&(this.funkloch-=e,this.funkloch<=0&&(this.ui.funkloch(!1),this.burst(wt.funklochBack,3,1.5))),n.funkloch<=0&&t.s>1500&&(n.funkloch=_e(120,220),this.up.starlink?pt(.5)&&this.chat(Je(["Starlink sei Dank: kein Funkloch \u{1F6F0}\uFE0F","Bild bleibt stabil \u2714\uFE0F","Starlink \u{1F525}"])):(this.funkloch=_e(2.2,3.2),this.fx.glitch(this.funkloch),this.ui.funkloch(!0),this.burst(wt.funkloch,5,1.6),pt(.5)&&this.later(.5,()=>this.say(Kn.funkloch,"worried",{priority:!1})))),n.frog<=0&&(n.frog=_e(170,300),this.fx.green(1.4),this.burst(wt.frog,4,1.5)),n.trunk<=0&&t.s>2e3){n.trunk=_e(140,220);let r=zi();this.donate(r,5,"Kofferraum \xF6ffnen"),this.fx.trunk(7),this.burst(wt.trunk,3,2.5)}if(n.numbers<=0){n.numbers=_e(90,150),this.bot("claudia","Kanalpunkte-Aktion: Mini Adam m\xF6chte eine Zahl im Chat sehen!");let r=[];for(let a=0;a<Ir(6,9);a++)r.push(wt.zahl());r.forEach((a,l)=>this.later(.6+l*_e(.2,.45),()=>this.chat(a)));let o=r.find((a,l)=>r.indexOf(a)!==l);o&&this.later(4.5,()=>this.chat(`Synchron mit ${o}! \u{1F91D}`))}if(n.police<=0&&t.s>2500&&(n.police=_e(220,340),this.callPolice(Je(B1))),!this.blitzer&&t.s>this.S.blitzer){let r=t.s;this.blitzer={limitS:r+520,camS:r+1120,endS:r+1300,announced:!1,checked:!1},this.scenery.request("speed",this.blitzer.limitS,{limit:120}),this.scenery.request("blitzer",this.blitzer.camS),this.scenery.request("speed",this.blitzer.endS,{limit:"ende"})}if(this.blitzer){let r=this.blitzer;!r.announced&&t.s>r.limitS-180&&(r.announced=!0,this.say(Kn.blitzer,"wink")),!r.checked&&t.s>r.camS&&(r.checked=!0,t.kmh>126?(this.fx.flash(1),this.audio.flash(),this.scenery.flashBlitzer(!0),this.later(.15,()=>this.scenery.flashBlitzer(!1)),this.stats.photos++,this.later(.6,()=>{this.fine(15,"Bu\xDFgeld"),this.ui.photo(Math.round(t.kmh),Lr(this.clock))}),this.burst(wt.blitzer,3,2),this.cockpit.nomi.setMood("surprised",2)):(this.stats.blitzerClean++,this.earn(5,"Vorbildlich"),this.ui.toast("\u{1F4F8} Nicht geblitzt \u2013 vorbildlich!","good"))),t.s>r.endS+50&&(this.blitzer=null,this.S.blitzer=t.s+_e(2600,4200))}if(t.s>this.S.elefant&&(this.S.elefant=t.s+_e(3200,5200),this.traffic.elefantenrennen(t.s),this.say(Kn.elefant,"worried",{priority:!1}),this.later(3,()=>this.burst(wt.elefant,3,3))),!this.landmark&&t.s>this.S.landmark){let r=pt(.55)?"brunnen":"elsa",o=t.s+1500;this.landmark={type:r,s:o,seen:!1,greeted:!1},this.scenery.request(r,o)}if(this.landmark){let r=this.landmark,o=r.s-t.s;!r.seen&&o<260&&(r.seen=!0,this.burst(r.type==="brunnen"?wt.brunnen:wt.elsa,3,2),this.ui.toast(r.type==="brunnen"?"\u26F2 Ein Brunnen! Hupen f\xFCr BrunnenTV (Leertaste)":"\u{1F451} Elsa! Hupen zum Gr\xFC\xDFen (Leertaste)","info")),!r.greeted&&o<220&&o>-40&&this.t-this.lastHorn<.3&&(r.greeted=!0,r.type==="brunnen"?(this.earn(10,"BrunnenTV"),this.audio.brunnenJingle(),this.later(.5,()=>this.speech.say("Ein sehr sch\xF6ner Brunnen.","schoennbrun")),this.ui.toast("\u26F2 BrunnenTV-Bonus!","good")):(this.earn(10,"Elsa-Gru\xDF"),this.cockpit.nomi.setMood("love",2.5),this.ui.toast("\u{1F451} Elsa winkt zur\xFCck!","good")),this.hype+=60),o<-80&&(this.landmark=null,this.S.landmark=t.s+_e(2400,3800))}let s=Math.floor(this.clock/60);s!==this.lastHugo&&this.t>5&&(this.lastHugo=s,s===21?this.bot("hugo","21 Uhr: Ortsspenden-Schluss! \u2026 Verl\xE4ngerung um 5 Minuten \u{1F609}"):s===22?this.bot("hugo","Eigentlich w\xE4re jetzt Sendeschluss. Wir fahren einfach weiter!"):s>=19&&this.bot("hugo",`Es ist ${s} Uhr. Sendezeit l\xE4uft.`))}callPolice(e){this.policeCar||(this.policeCar=this.traffic.police(this.player.s,e),this.burst(wt.police,3,2.5),this.later(1,()=>this.cockpit.nomi.setMood("worried",2.5)))}updatePickups(e,t){let n=this.player,s=this.S;n.s>s.charge&&(s.charge=n.s+_e(900,1500),this.pickups.spawnAhead("charge",n.s,this.traffic)),n.s>s.banana&&(s.banana=n.s+_e(1200,1900),this.pickups.spawnAhead("banana",n.s,this.traffic)),n.s>s.koriander&&(s.koriander=n.s+_e(1300,2300),this.pickups.spawnAhead("koriander",n.s,this.traffic));for(let r of this.pickups.update(e,this.t,n,t))r.type==="charge"?(n.charge(12),this.stats.charges++,this.audio.chime(),this.ui.toast("\u26A1 Lade-Ring: +12 % Akku","good")):r.type==="banana"?(this.stats.bananas++,n.sugar=6,this.audio.coin(),this.earn(15,"Bananensaft"),this.ui.toast("\u{1F34C} Bananensaft! Zuckerschub","good"),pt(.7)&&this.chat(Je(wt.banana))):(this.stats.koriander++,n.wobble=2.2,this.fine(5,"Koriander"),this.ui.toast("\u{1F33F} Koriander \u2026 b\xE4h!","bad"),this.cockpit.nomi.setMood("dizzy",2.5),this.burst(wt.koriander,2,1.5))}updateViewers(e){let t=this.player,n=t.s/1e3;this.hype*=Math.exp(-e*.04);let s=220+95*n+25*Math.sin(this.t/23)+this.hype;this.up.starlink&&(s*=1.25),this.funkloch>0&&(s*=.8),this.viewers=In(this.viewers,s,.4,e),this.peakViewers=Math.max(this.peakViewers,this.viewers),this.stats.maxViewers=this.peakViewers;let r=Math.max(500,this.save.best.viewers||0);if(!this.recordShown&&this.viewers>r&&t.s>1500&&(this.recordShown=!0,this.bot("victoria",`Neuer Zuschauerrekord: ${tn(Math.round(this.viewers))} Zuschauer!`),this.audio.record(),this.burst(wt.record,4,2.5),this.ui.banner("\u{1F3C6} Neuer Zuschauerrekord!",3.5),this.up.konfetti&&this.cockpit.addConfetti(30)),this.donationT-=e,this.donationT<=0){this.donationT=_e(8,17)*We(500/Math.max(this.viewers,1),.5,1.5);let o=zi(),a=Kp(1,22);this.donate(o,a),pt(.35)&&this.later(.9,()=>this.chat(Je(["Danke!","Ehrenmensch \u{1F64F}","Bimmel hurra!","F\xFCnftel-Alter","\u2764"])))}}updateChat(e){this.chatT-=e,this.chatT<=0&&(this.chatT=_e(1.3,3.4)*We(600/Math.max(this.viewers,1),.6,1.4),this.chat(Je(wt.ambient)))}updateJobs(){let e=this.stats,t=!1;for(let n of this.jobs){if(n.done)continue;let s=e[n.stat]||0,r=We(s/n.goal,0,1);Math.abs(r-n.progress)>.01&&(t=!0),n.progress=r,s>=n.goal-.5&&(n.done=!0,n.progress=1,t=!0,this.earn(25,"Jobs",{mult:!1}),this.ui.toast(`\u2705 Job erledigt: ${n.text}`,"good"),this.audio.chime(),this.chat(Je(wt.fiveJobs)))}t&&this.ui.jobs(this.jobs),!this.allJobsPaid&&this.jobs.every(n=>n.done)&&(this.allJobsPaid=!0,this.earn(100,"Jobs",{mult:!1}),this.bot("victoria","You had 5 Jobs \u2013 und alle erledigt! 100 \u20AC Bonus!"),this.audio.record(),this.ui.banner("\u{1F3C6} Alle 5 Jobs erledigt!",4))}honk(){this.audio.horn(),this.lastHorn=this.t,pt(.12)&&this.chat(Je(["Bimmel hurra! \u{1F4EF}","HUP HUP","Hupkonzert!"]))}useMegafon(){if(!this.up.megafon){this.ui.toast("\u{1F4E2} Das Megafon gibt es im Tesla-Shop","info");return}if(this.megafonCd>0){this.ui.toast(`\u{1F4E2} Megafon l\xE4dt noch (${Math.ceil(this.megafonCd)} s)`,"info");return}this.megafonCd=15,this.audio.megafon();let e=this.traffic.megafon(this.player);this.speech.say("Achtung, Achtung! Bitte machen Sie die Spur frei!","william"),this.ui.toast(e?`\u{1F4E2} ${e} Fahrzeug${e>1?"e machen":" macht"} Platz`:"\u{1F4E2} Durchsage!","info"),this.chat(Je(["Wie in Gifhorn \u{1F4E2}","MEGAFON \u{1F602}","Platz da!"]))}onCrash(e){let t=this.player;if(!t.collide(e))return;this.stats.crashes++,this.stats.cleanDistance=0,this.audio.crash(),this.fx.shake(1),this.cockpit.nomi.setMood("dizzy",3);let n=t.maxHits-t.hits;if(this.ui.damage(t.hits,t.maxHits),e.car.behavior==="polizei"&&this.chat("Ausgerechnet die Polizei Gifhorn \u{1F631}"),this.burst(wt.crash,3,2),n<=0){this.end("werkstatt");return}this.ui.toast(n===1?"\u{1F9F8} Rempler! Nur noch ein Karosserie-Punkt!":`\u{1F9F8} Rempler! Noch ${n} Karosserie-Punkte`,"bad")}onNearMiss(e){this.stats.nearMisses++,this.earn(3,"Haarscharf",{silent:!0}),this.ui.money(3,"Haarscharf"),this.hype+=15,pt(.5)&&this.chat(Je(wt.nearMiss))}end(e){if(this.over)return;this.running=!1;let t=this.player,n=t.s/1e3;this.over={reason:e,distance:t.s,money:Math.max(0,Math.round(this.money*100)/100),breakdown:{...this.breakdown},jobs:this.jobs.map(s=>({text:s.text,done:s.done})),stats:{...this.stats},peakViewers:Math.round(this.peakViewers),beruf:qp(n),time:this.t,clock:Lr(this.clock),naviHistory:this.navi.history.slice(-5)},this.speech.stopAll(),e==="akku"?this.say("Akku leer. Die Stream-Technik verabschiedet sich.","sleep"):e==="werkstatt"&&this.say("Bitte einen Werkstatttermin vereinbaren.","dizzy")}screenState(){let e=this.player,t=this.weather,n=this.blitzer&&e.s>this.blitzer.limitS&&e.s<this.blitzer.endS?120:null;return{dark:t.level>.45,battery:e.battery,speedKmh:e.kmh,limit:n,playerX:e.x,leftLane:this.left.open?this.left.timer:0,cars:this.traffic.nearby(e,125),s:e.s,navi:this.navi.screen(e.s,this.clock,e.speed),clock:Lr(this.clock),temp:Math.round(17-t.level*6),funkloch:this.funkloch>0?1:0,wiperOn:t.level>.05}}};function Nu(i,e,t){let n=document.createElement("canvas");n.width=i,n.height=e,t(n.getContext("2d"),i,e);let s=new Bt(n);return s.colorSpace=ht,s.anisotropy=4,s}function H1(){return Nu(256,384,(i,e,t)=>{i.translate(e/2,0),i.beginPath(),i.moveTo(-26,40),i.lineTo(26,40),i.lineTo(26,92),i.quadraticCurveTo(84,120,84,180),i.lineTo(84,340),i.quadraticCurveTo(84,370,54,370),i.lineTo(-54,370),i.quadraticCurveTo(-84,370,-84,340),i.lineTo(-84,180),i.quadraticCurveTo(-84,120,-26,92),i.closePath(),i.fillStyle="rgba(255,255,255,0.9)",i.fill(),i.lineWidth=8,i.strokeStyle="#3a2a10",i.stroke(),i.save(),i.clip();let n=i.createLinearGradient(-84,0,84,0);n.addColorStop(0,"#f2c419"),n.addColorStop(.5,"#ffe45c"),n.addColorStop(1,"#e8b30e"),i.fillStyle=n,i.fillRect(-90,150,180,230),i.restore(),i.fillStyle="#2e7d32",Ht(i,-32,14,64,32,8),i.fill(),i.fillStyle="#ffffff",Ht(i,-70,205,140,110,14),i.fill(),i.strokeStyle="#3a2a10",i.lineWidth=5,i.stroke(),i.beginPath(),i.moveTo(-44,228),i.quadraticCurveTo(-30,292,46,270),i.quadraticCurveTo(-6,270,-26,226),i.closePath(),i.fillStyle="#ffd21f",i.fill(),i.strokeStyle="#6b4a00",i.lineWidth=4,i.stroke(),i.fillStyle="#3a2a10",i.font="bold 22px Arial, sans-serif",i.textAlign="center",i.fillText("BANANENSAFT",0,306),i.fillStyle="rgba(255,255,255,0.55)",Ht(i,-70,140,14,190,7),i.fill()})}function F1(){return Nu(320,320,(i,e,t)=>{i.translate(e/2,t/2+30),i.strokeStyle="#4f8a2b",i.lineWidth=7,i.lineCap="round";let n=[];for(let r=0;r<7;r++){let o=-Math.PI/2+(r-3)*.32,a=95+r%3*18,l=Math.cos(o)*a,c=Math.sin(o)*a;i.beginPath(),i.moveTo(0,110),i.quadraticCurveTo(l*.3,20,l,c),i.stroke(),n.push([l,c])}let s=(r,o,a,l)=>{i.save(),i.translate(r,o),i.rotate(l),i.beginPath();for(let c=0;c<=12;c++){let h=c/12*Math.PI*2,u=a*(c%2?.62:1);i.lineTo(Math.cos(h)*u,Math.sin(h)*u*.9)}i.closePath(),i.fillStyle="#3f9b2f",i.fill(),i.strokeStyle="#215c18",i.lineWidth=4,i.stroke(),i.restore()};n.forEach(([r,o],a)=>{s(r,o,34,a),s(r*.7+18,o*.7,22,a+1)}),i.fillStyle="#c62828",Ht(i,-46,82,92,34,8),i.fill(),i.fillStyle="#fff",i.font="bold 20px Arial, sans-serif",i.textAlign="center",i.fillText("KORIANDER",0,106)})}function O1(){return Nu(256,256,(i,e,t)=>{i.translate(e/2,t/2),i.beginPath(),i.moveTo(18,-110),i.lineTo(-62,14),i.lineTo(-8,14),i.lineTo(-24,110),i.lineTo(62,-22),i.lineTo(8,-22),i.closePath(),i.fillStyle="#eaffef",i.shadowColor="#4dff9a",i.shadowBlur=24,i.fill(),i.shadowBlur=0,i.lineWidth=6,i.strokeStyle="#1faa5a",i.stroke()})}var Pl=class{constructor(e){this.group=new ye,this.group.name="Pickups",e.add(this.group),this.items=[],this.pool={charge:[],banana:[],koriander:[]};let t=nl();this.mats={ring:de.basic({color:new Re(.25,2.2,.9),toneMapped:!0}),bolt:de.basic({map:O1(),transparent:!0,depthWrite:!1,side:gt}),bottle:de.basic({map:H1(),transparent:!0,alphaTest:.05,side:gt}),koriander:de.basic({map:F1(),transparent:!0,alphaTest:.05,side:gt}),glowG:de.basic({map:t,color:5635993,transparent:!0,depthWrite:!1,blending:rs,opacity:.8}),glowY:de.basic({map:t,color:16765773,transparent:!0,depthWrite:!1,blending:rs,opacity:.6}),glowR:de.basic({map:t,color:16736320,transparent:!0,depthWrite:!1,blending:rs,opacity:.35})},this.geo={ring:new gn(.95,.09,10,40),plane:new tt(1,1)}}make(e){let t=new ye,n=this.mats;if(e==="charge"){let s=new D(this.geo.ring,n.ring);s.position.y=1.15;let r=new D(this.geo.plane,n.bolt);r.scale.setScalar(1.1),r.position.y=1.15;let o=new D(this.geo.plane,n.glowG);o.scale.setScalar(3.2),o.position.y=1.15,t.add(o,s,r),t.userData.spin=s,t.userData.face=[r,o]}else if(e==="banana"){let s=new D(this.geo.plane,n.bottle);s.scale.set(.95,1.42,1),s.position.y=.95;let r=new D(this.geo.plane,n.glowY);r.scale.setScalar(2.6),r.position.y=.95,t.add(r,s),t.userData.face=[s,r]}else{let s=new D(this.geo.plane,n.koriander);s.scale.setScalar(1.35),s.position.y=.85;let r=new D(this.geo.plane,n.glowR);r.scale.setScalar(2.4),r.position.y=.85,t.add(r,s),t.userData.face=[s,r]}return this.group.add(t),t}spawn(e,t,n){let s=this.pool[e],r=s.find(a=>!a.userData.inUse);r||(r=this.make(e),s.push(r)),r.userData.inUse=!0,r.visible=!0,r.scale.setScalar(1);let o={type:e,s:t,x:Ce.laneCenter(n),lane:n,obj:r,taken:!1,fade:0,phase:Math.random()*6};return this.items.push(o),o}spawnAhead(e,t,n,s=650){let r=t+s+_e(0,120),o=[0,1,2,3].filter(a=>n.laneFree(a,r,26));return o.length?this.spawn(e,r,Je(o)):null}reset(){for(let e of this.items)e.obj.visible=!1,e.obj.userData.inUse=!1;this.items=[]}update(e,t,n,s){let r=[],o=[];for(let a of this.items){let l=a.s-n.s;if(l<-30||a.taken&&a.fade>.4){a.obj.visible=!1,a.obj.userData.inUse=!1;continue}o.push(a);let c=a.obj;c.position.set(a.x,Math.sin(t*2.2+a.phase)*.08,-l),c.userData.spin&&(c.userData.spin.rotation.y=t*1.8+a.phase);let h=Math.atan2(s.position.x-a.x,s.position.z+l);for(let u of c.userData.face)u.rotation.y=h;a.taken?(a.fade+=e,c.scale.setScalar(1+a.fade*3),c.position.y+=a.fade*4):Math.abs(l)<2.7&&Math.abs(a.x-n.x)<1.55&&(a.taken=!0,r.push(a))}return this.items=o,r}};function Me(i,e,t,n){let s=document.createElement(i);return e&&(s.className=e),n!==void 0&&(s.textContent=n),t&&t.appendChild(s),s}var z1={rosen:"\u{1F339}",pommes:"\u{1F35F}",burger:"\u{1F354}",candy:"\u{1F36C}",chips:"\u{1F954}",kuerbis:"\u{1F383}"},Il=class{constructor(e){this.root=e,this.hud=Me("div","hud hidden",e),this.hud.id="hud";let t=Me("div","hud-info",this.hud),n=Me("div","live-row",t);this.liveBadge=Me("span","live-badge",n,"\u25CF LIVE"),this.viewersEl=Me("span","viewers",n,"\u{1F441} 0"),this.timeEl=Me("span","streamtime",n,"0:00");let s=Me("div","stat-rows",t),r=(c,h)=>{let u=Me("div","stat",s);Me("span","stat-icon",u,c);let d=Me("span","stat-val",u,"");return h&&Me("span","stat-label",u,h),d};this.distEl=r("\u{1F4CF}",""),this.recordEl=Me("span","stat-sub",this.distEl.parentNode,""),this.speedEl=r("\u{1F697}",""),this.moneyRow=r("\u{1F4B6}","Guthaben"),this.moneyPops=Me("div","money-pops",this.moneyRow.parentNode),this.batteryEl=r("\u{1F50B}",""),this.batteryBar=Me("span","battery-bar",this.batteryEl.parentNode),this.batteryFill=Me("span","battery-fill",this.batteryBar),this.damageEl=r("\u{1F9F8}",""),this.jobsEl=Me("div","jobs-mini",t),this.zulageEl=Me("div","zulage hidden",t,"\u{1F327}\uFE0F Regenzulage \xD71,5"),this.leftLaneEl=Me("div","leftlane hidden",this.hud),this.leftLaneText=Me("div","leftlane-text",this.leftLaneEl,"");let o=Me("div","leftlane-bar",this.leftLaneEl);this.leftLaneFill=Me("div","leftlane-fill",o),this.naviEl=Me("div","navi-line",this.hud,""),this.nomiEl=Me("div","nomi-sub hidden",this.hud);let a=Me("span","nomi-eyes",this.nomiEl);Me("i","",a),Me("i","",a),this.nomiText=Me("span","nomi-text",this.nomiEl,""),this.bannerEl=Me("div","banner hidden",this.hud,""),this.toastsEl=Me("div","toasts",this.hud),this.chatEl=Me("div","chat",this.hud);let l=Me("div","chat-head",this.chatEl);Me("span","",l,"Live-Chat"),this.chatCount=Me("span","chat-count",l,""),this.chatList=Me("div","chat-list",this.chatEl),this.durchsageEl=Me("div","durchsage hidden",this.hud),this.funklochEl=Me("div","funkloch hidden",this.hud),Me("div","funkloch-icon",this.funklochEl,"\u{1F4E1}"),Me("div","funkloch-text",this.funklochEl,"Verbindung verloren \u2013 Telekom, Vodafone und O\u2082 werden neu geb\xFCndelt \u2026"),this.photoEl=Me("div","photo hidden",this.hud),this.rahmenEl=Me("div","rahmen-layer",this.hud),this.cameraHint=Me("div","camera-hint hidden",this.hud,""),this.chatOn=!0,this.lastHud=0,this.toasts=[],this.bannerT=0,this.nomiT=0,this.durchsageT=0,this.photoT=0,this.rahmenList=[],this.photos=[],this.moneyShown=0}show(e){this.hud.classList.toggle("hidden",!e)}setChat(e){this.chatOn=e,this.chatEl.classList.toggle("hidden",!e)}reset(){this.chatList.textContent="",this.toastsEl.textContent="",this.rahmenEl.textContent="",this.moneyPops.textContent="",this.toasts=[],this.rahmenList=[],this.photos=[],this.bannerEl.classList.add("hidden"),this.nomiEl.classList.add("hidden"),this.durchsageEl.classList.add("hidden"),this.funklochEl.classList.add("hidden"),this.photoEl.classList.add("hidden"),this.liveBadge.classList.remove("offline"),this.bannerT=this.nomiT=this.durchsageT=this.photoT=0}chat({name:e,text:t,bot:n,icon:s}){let r=Me("div","msg"+(n?" bot bot-"+n:""),this.chatList);if(n){Me("span","bot-icon",r,s||bl[n]?.icon||"\u{1F916}");let o=Me("span","name",r,e);o.style.color="#ffd76a",Me("span","bot-tag",r,"BOT")}else{let o=Me("span","name",r,e);o.style.color=zp(e)}for(Me("span","text",r,t);this.chatList.childElementCount>36;)this.chatList.firstElementChild.remove();this.chatList.scrollTop=this.chatList.scrollHeight}toast(e,t="info"){let n=Me("div","toast toast-"+t,this.toastsEl,e);for(this.toasts.push({el:n,t:3.6});this.toasts.length>4;)this.toasts.shift().el.remove()}banner(e,t=3,n=""){this.bannerEl.textContent=e,n&&Me("div","banner-sub",this.bannerEl,n),this.bannerEl.classList.remove("hidden"),this.bannerEl.classList.remove("pop"),this.bannerEl.offsetWidth,this.bannerEl.classList.add("pop"),this.bannerT=t}nomi(e,t=3){this.nomiText.textContent=e,this.nomiEl.classList.remove("hidden"),this.nomiT=Math.max(2.2,t)}money(e,t){let n=Me("div","money-pop "+(e>=0?"plus":"minus"),this.moneyPops,(e>=0?"+":"\u2212")+Yt(Math.abs(e))+(t?" \xB7 "+t:""));for(setTimeout(()=>n.remove(),1900);this.moneyPops.childElementCount>4;)this.moneyPops.firstElementChild.remove()}durchsage(e,t,n,s){this.durchsageEl.textContent="";let r=Me("div","durchsage-head",this.durchsageEl,`\u{1F399}\uFE0F Sprachdurchsage von ${s} \xB7 Stimme: ${e}`);r.title=e,Me("div","durchsage-text",this.durchsageEl,"\xBB"+t+"\xAB"),this.durchsageEl.classList.remove("hidden"),this.durchsageT=We(n,3,14)}funkloch(e){this.funklochEl.classList.toggle("hidden",!e),this.liveBadge.classList.toggle("offline",e),this.liveBadge.textContent=e?"\u25CF OFFLINE":"\u25CF LIVE"}damage(e,t){this.damageEl.parentNode.classList.remove("shake"),this.damageEl.offsetWidth,this.damageEl.parentNode.classList.add("shake")}jobs(e){this.jobsEl.textContent="",Me("span","jobs-title",this.jobsEl,"You had 5 Jobs");for(let t of e){let n=Me("div","job"+(t.done?" done":""),this.jobsEl);if(Me("span","job-box",n,t.done?"\u2714":""),Me("span","job-text",n,t.text),!t.done&&t.progress>0){let s=Me("span","job-bar",n);Me("span","job-fill",s).style.width=Math.round(t.progress*100)+"%"}}}rahmen(e,t){let n=Me("div","rahmen rahmen-"+e.id,this.rahmenEl),s=Me("div","rahmen-caption",n,`${e.name} \xB7 ${Yt(e.price)} von ${t}`);s.title=e.name;let r=z1[e.id];if(r){for(let a of["top","bottom","left","right"]){let l=Me("div","strip strip-"+a,n);for(let c=0;c<22;c++)Me("span","",l,r)}e.id==="kuerbis"&&n.classList.add("corner-only")}else if(e.id==="pappkarton"){let o=Me("div","boxes",n);for(let a=0;a<26;a++){let l=Me("span","box",o,"");l.style.left=a%13*7.8+(a>=13?3.5:0)+"%",l.style.bottom=(a>=13?11:0)+Math.random()*2+"%",l.style.transform=`rotate(${(Math.random()-.5)*16}deg)`,l.style.animationDelay=(a*.05).toFixed(2)+"s"}}else if(e.id==="haelfte"){let o=Math.random()<.5?"left":"right";Me("div","half half-"+o,n,"Bildh\xE4lfte abgedeckt")}else if(e.id==="elsa")Me("div","elsa-fly",n,"");else if(e.id==="lego")for(let o of["top","bottom","left","right"]){let a=Me("div","strip lego strip-"+o,n);for(let l=0;l<18;l++)Me("span","brick b"+l%4,a,"")}else if(e.id==="briefmarken")Me("div","stamp-frame",n,"");else if(e.id==="keinerechte")for(let o of["top","bottom","left","right"]){let a=Me("div","strip norights strip-"+o,n),l=o==="top"||o==="bottom"?6:3;for(let c=0;c<l;c++)Me("span","",a,"\xA9 Keine Rechte")}else if(e.id==="rettich")for(let o of["top","bottom","left","right"]){let a=Me("div","strip strip-"+o,n);for(let l=0;l<16;l++)Me("span","rettich",a,"")}this.rahmenList.push({el:n,t:e.dur})}photo(e,t,n){if(this.photoEl.textContent="",e){let s=Me("img","",this.photoEl);s.src=e,s.alt="Blitzerfoto",this.photos.push({url:e,kmh:t,clock:n})}Me("div","photo-cap",this.photoEl,`\u{1F4F8} ${t} km/h \xB7 ${n} Uhr`),Me("div","photo-sub",this.photoEl,"Das Foto kommt in einen Rahmen."),this.photoEl.classList.remove("hidden"),this.photoT=6}cameraLabel(e){this.cameraHint.textContent=e,this.cameraHint.classList.remove("hidden"),clearTimeout(this.camTimer),this.camTimer=setTimeout(()=>this.cameraHint.classList.add("hidden"),1600)}update(e,t){for(let c of this.toasts)c.t-=e;for(;this.toasts.length&&this.toasts[0].t<=0;)this.toasts.shift().el.remove();this.bannerT>0&&(this.bannerT-=e,this.bannerT<=0&&this.bannerEl.classList.add("hidden")),this.nomiT>0&&(this.nomiT-=e,this.nomiT<=0&&this.nomiEl.classList.add("hidden")),this.durchsageT>0&&(this.durchsageT-=e,this.durchsageT<=0&&this.durchsageEl.classList.add("hidden")),this.photoT>0&&(this.photoT-=e,this.photoT<=0&&this.photoEl.classList.add("hidden"));for(let c of this.rahmenList)c.t-=e,c.t<.6&&c.el.classList.add("out"),c.t<=0&&c.el.remove();if(this.rahmenList=this.rahmenList.filter(c=>c.t>0),this.lastHud-=e,this.lastHud>0||!t)return;this.lastHud=.1;let n=t.player;this.viewersEl.textContent="\u{1F441} "+tn(Math.round(t.viewers)),this.timeEl.textContent=bo(t.t),this.distEl.textContent=xi(n.s);let s=t.save.best.distance||0;this.recordEl.textContent=n.s>s&&s>0?"\u{1F3C6} neuer Rekord!":s>0?"Rekord "+xi(s):"",this.recordEl.classList.toggle("record",n.s>s&&s>0),this.speedEl.textContent=Math.round(n.kmh)+" km/h",this.moneyRow.textContent=Yt(t.money),this.batteryEl.textContent=Math.round(n.battery)+" %",this.batteryFill.style.width=We(n.battery,0,100)+"%",this.batteryFill.className="battery-fill"+(n.battery<15?" low":n.battery<30?" mid":"");let r=Math.max(0,n.maxHits-n.hits);this.damageEl.textContent="\u2665".repeat(r)+"\u2661".repeat(Math.max(0,n.maxHits-r)),this.damageEl.title="Karosserie-Punkte",this.zulageEl.classList.toggle("hidden",!t.weather.regenzulage);let o=t.left;if(this.leftLaneEl.classList.toggle("hidden",!o.open),o.open){let c=n.inLeftLane;this.leftLaneText.textContent=(c?"\u2B05\uFE0F Linke Spur: Bonus l\xE4uft! ":"\u2B05\uFE0F Linke Spur frei! ")+Math.ceil(o.timer)+" s",this.leftLaneEl.classList.toggle("active",c),this.leftLaneEl.classList.toggle("warn",o.timer<10),this.leftLaneFill.style.width=We(o.timer/60,0,1)*100+"%"}let a=t.navi,l=Math.max(0,a.targetS-n.s);this.naviEl.textContent=a.arrived?"\u{1F4CD} Ziel erreicht \u2013 warte auf das n\xE4chste Gebot \u2026":`\u{1F4CD} ${a.target.name} \xB7 ${xi(l,l<1e4?1:0)} \xB7 Gebot ${Yt(a.bid)} von ${a.bidder}`,this.chatCount.textContent=tn(Math.round(t.viewers))+" Zuschauer"}};function $(i,e,t,n){let s=document.createElement(i);return e&&(s.className=e),n!==void 0&&(s.textContent=n),t&&t.appendChild(s),s}function Zt(i,e,t,n=""){let s=$("button","btn "+n,i,e);return s.type="button",s.dataset.action=t,s}var Qp={akku:{title:"Akku leer",sub:"Die Stream-Technik im Kofferraum hat den letzten Strom bekommen."},werkstatt:{title:"Ab in die Werkstatt",sub:"Zu viele Rempler \u2013 der Tesla braucht eine kleine Pause. Mini Adam winkt trotzdem in die Kamera."},quit:{title:"Stream beendet",sub:"Mini Adam hat den Stream vorzeitig beendet."}},e0=["Linke Spur","Navi-Ziele","Spenden","Jobs","Bananensaft","Haarscharf","BrunnenTV","Elsa-Gru\xDF","Vorbildlich","Bu\xDFgeld","Verwarngeld","Koriander"],Ll=class{constructor(e,t){this.root=$("div","screens",e),this.h=t,this.screens={},this.current=null,this.stack=[];for(let n of["title","pause","over","shop","about","controls","settings"]){let s=$("section","screen screen-"+n+" hidden",this.root);this.screens[n]=s}this.root.addEventListener("click",n=>{let s=n.target.closest("[data-action]");!s||s.disabled||(this.h.click?.(),this.action(s.dataset.action,s))}),window.addEventListener("keydown",n=>this.onKey(n))}get open(){return!!this.current}show(e,t){this.current&&this.current!==e&&this.screens[this.current].classList.add("hidden"),this.current=e,this.data=t;let n=this.screens[e];this["render_"+e](n,t),n.classList.remove("hidden"),this.root.classList.add("active"),this.root.classList.toggle("dim",e!=="title"),requestAnimationFrame(()=>{(n.querySelector(".btn.primary:not([disabled])")||n.querySelector(".btn:not([disabled])"))?.focus({preventScroll:!0})})}push(e,t){this.current&&this.stack.push({name:this.current,data:this.data}),this.show(e,t)}back(){let e=this.stack.pop();e?this.show(e.name,e.name==="title"||e.name==="pause"||e.name==="over"?this.refreshData(e):e.data):this.h.back?.(this.current)}refreshData(e){return this.h.dataFor?this.h.dataFor(e.name,e.data):e.data}hide(){this.current&&this.screens[this.current].classList.add("hidden"),this.current=null,this.stack=[],this.root.classList.remove("active","dim")}action(e,t){switch(e){case"back":this.back();break;case"shop":case"about":case"controls":case"settings":this.push(e,this.h.dataFor?this.h.dataFor(e):null);break;case"buy":{let n=t.dataset.id;if(this.h.buy(n)){this.render_shop(this.screens.shop,this.h.dataFor("shop"));let s=this.screens.shop.querySelector(`[data-id="${n}"]`);(s&&!s.disabled?s:this.screens.shop.querySelector(".btn.back"))?.focus({preventScroll:!0})}break}case"toggle":{this.h.setting(t.dataset.key,t.dataset.on!=="1"),this.render_settings(this.screens.settings,this.h.dataFor("settings")),this.screens.settings.querySelector(`[data-key="${t.dataset.key}"]`)?.focus({preventScroll:!0});break}case"quality":this.h.setting("quality",t.dataset.value),this.render_settings(this.screens.settings,this.h.dataFor("settings")),this.screens.settings.querySelector(`[data-value="${t.dataset.value}"]`)?.focus({preventScroll:!0});break;case"reset":t.dataset.confirm==="1"?(this.h.resetSave(),this.render_settings(this.screens.settings,this.h.dataFor("settings"))):(t.dataset.confirm="1",t.textContent="Wirklich alles l\xF6schen? Nochmal klicken",t.classList.add("danger"));break;default:this.h.action?.(e,t)}}onKey(e){if(!this.current||e.target&&/input/i.test(e.target.tagName)&&e.code!=="Escape")return;let t=this.screens[this.current],n=[...t.querySelectorAll(".btn:not([disabled]), input[type=range]")],s=n.indexOf(document.activeElement);if(e.code==="ArrowDown"||e.code==="ArrowRight"||e.code==="KeyS"||e.code==="KeyD"){if(e.target.type==="range"&&(e.code==="ArrowRight"||e.code==="KeyD"))return;e.preventDefault(),n[(s+1+n.length)%n.length]?.focus()}else if(e.code==="ArrowUp"||e.code==="ArrowLeft"||e.code==="KeyW"||e.code==="KeyA"){if(e.target.type==="range"&&(e.code==="ArrowLeft"||e.code==="KeyA"))return;e.preventDefault(),n[(s-1+n.length)%n.length]?.focus()}else if(e.code==="Escape"||e.code==="Backspace")e.preventDefault(),this.current==="pause"?this.h.action("resume"):this.current!=="title"&&this.current!=="over"&&this.back();else if(e.code==="Enter"||e.code==="Space"){if(document.activeElement&&n.includes(document.activeElement))return;e.preventDefault(),(t.querySelector(".btn.primary:not([disabled])")||n[0])?.click()}}pad(e,t,n){if(!this.current)return;let r=[...this.screens[this.current].querySelectorAll(".btn:not([disabled])")],o=r.indexOf(document.activeElement);e&&r[(o+e+r.length)%r.length]?.focus(),t&&(document.activeElement&&r.includes(document.activeElement)?document.activeElement:r[0])?.click(),n&&(this.current==="pause"?this.h.action("resume"):this.current!=="title"&&this.current!=="over"&&this.back())}render_title(e,t){e.textContent="";let n=$("div","title-card",e),s=$("div","title-logo",n);$("span","title-live",s,"\u25CF LIVE"),$("h1","",n,Bp),$("h2","",n,Hp),$("p","tagline",n,Fp);let r=$("div","menu",n);Zt(r,"\u25B6  Losfahren","start","primary"),Zt(r,"\u{1F6D2}  Tesla-Shop","shop"),Zt(r,"\u{1F3AE}  Steuerung","controls"),Zt(r,"\u2699\uFE0F  Einstellungen","settings"),Zt(r,"\u2139\uFE0F  \xDCber das Spiel","about");let o=$("div","title-stats",n);$("span","",o,"\u{1F4B6} "+Yt(t.wallet)+" Guthaben"),$("span","",o,"\u{1F3C6} Rekord "+xi(t.best.distance||0)),$("span","",o,"\u{1F6E3}\uFE0F "+xi((t.stats.totalKm||0)*1e3,1)+" gesamt"),$("div","title-hint",e,"Enter: Losfahren \xB7 Pfeiltasten oder WASD: fahren \xB7 Esc: Pause")}render_pause(e,t){e.textContent="";let n=$("div","card pause-card",e);$("h2","",n,"\u23F8 Pause"),$("p","sub",n,"Kappandram\xE4\xDFige Zusammenfassung f\xFCr alle, die gerade erst reingekommen sind:");let s=$("div","summary-grid",n),r=(l,c)=>{let h=$("div","sum",s);$("span","k",h,l),$("span","v",h,c)};r("Strecke",xi(t.player.s)),r("Guthaben dieser Fahrt",Yt(t.money)),r("Navi-Ziel",t.navi.target.name),r("Navi-\xC4nderungen",tn(t.stats.naviChanges)),r("Zuschauer",tn(Math.round(t.viewers))),r("Sendezeit",bo(t.t));let o=$("div","job-list",n);$("h3","",o,"You had 5 Jobs");for(let l of t.jobs){let c=$("div","job"+(l.done?" done":""),o);$("span","job-box",c,l.done?"\u2714":""),$("span","",c,l.text)}let a=$("div","menu row",n);Zt(a,"\u25B6 Weiterfahren","resume","primary"),Zt(a,"\u21BB Neustart","restart"),Zt(a,"\u2699\uFE0F Einstellungen","settings"),Zt(a,"\u23F9 Stream beenden","quit")}render_over(e,t){e.textContent="";let n=$("div","card over-card",e),s=Qp[t.reason]||Qp.quit;$("div","abspann-tag",n,"ABSPANN"),$("h2","",n,s.title),$("p","sub",n,s.sub);let r=$("div","over-big",n),o=$("div","over-dist",r);$("span","num",o,xi(t.distance)),$("span","lbl",o,t.newRecord?"\u{1F3C6} Neuer Rekord!":"Rekord: "+xi(t.best));let a=$("div","over-money",r);$("span","num",a,"+"+Yt(t.money)),$("span","lbl",a,"Guthaben \xB7 jetzt "+Yt(t.wallet));let l=$("div","menu row over-menu",n);Zt(l,"\u21BB Nochmal fahren","restart","primary"),Zt(l,"\u{1F6D2} Tesla-Shop","shop"),Zt(l,"\u{1F3E0} Hauptmen\xFC","menu");let c=$("div","over-cols",n),h=$("div","over-col",c);$("h3","",h,"Abrechnung");let u=Object.keys(t.breakdown).sort((p,_)=>{let x=e0.indexOf(p),y=e0.indexOf(_);return(x<0?99:x)-(y<0?99:y)});for(let p of u){let _=t.breakdown[p];if(Math.abs(_)<.005)continue;let x=$("div","bd"+(_<0?" minus":""),h);$("span","",x,p),$("span","",x,(_<0?"\u2212":"+")+Yt(Math.abs(_)))}$("h3","",h,"You had 5 Jobs");for(let p of t.jobs){let _=$("div","job"+(p.done?" done":""),h);$("span","job-box",_,p.done?"\u2714":""),$("span","",_,p.text)}let d=$("div","over-col",c);$("h3","",d,"Statistik");let f=t.stats,m=(p,_)=>{let x=$("div","bd",d);$("span","",x,p),$("span","",x,_)};m("Navi-Ziele erreicht",tn(f.naviReached)),m("Navi-\xC4nderungen",tn(f.naviChanges)),m("Haarscharf \xFCberholt",tn(f.nearMisses)),m("Rempler",tn(f.crashes)),m("H\xF6chstgeschwindigkeit",tn(Math.round(f.maxSpeedKmh))+" km/h"),m("Zuschauer-Spitze",tn(t.peakViewers)),m("Wischer: gezuckt / gewischt",tn(f.twitches)+" / "+tn(f.wipes)),m("Sendezeit",bo(t.time)+" (bis "+t.clock+" Uhr)");let v=$("div","beruf",d);if($("div","beruf-k",v,"Erlogene Berufsbezeichnung des Tages"),$("div","beruf-v",v,"Mini Adam, "+t.beruf.job),$("div","beruf-src",v,"(aus dem Stream vom "+t.beruf.src+")"),t.photos&&t.photos.length){$("h3","",d,"Blitzerfotos");let p=$("div","over-photos",d);for(let _ of t.photos.slice(-3)){let x=$("figure","",p),y=$("img","",x);y.src=_.url,y.alt="Blitzerfoto",$("figcaption","",x,_.kmh+" km/h")}}let g=$("div","crew",n);for(let[p,_]of Zp){let x=$("div","crew-row",g);$("span","k",x,p),$("span","v",x,_)}}render_shop(e,t){e.textContent="";let n=$("div","card shop-card",e),s=$("div","shop-head",n);$("h2","",s,"\u{1F6D2} Tesla-Shop"),$("div","wallet",s,"\u{1F4B6} "+Yt(t.wallet)),$("p","sub",n,"Upgrades f\xFCr den schwarzen Model 3 Long Range AWD. Bezahlt wird mit Bonusguthaben aus dem Live-Bereich.");let r=$("div","shop-grid",n);for(let a of Do){let l=t.upgrades[a.id]||0,c=El[a.id],h=$("div","shop-item"+(l>=c?" maxed":""),r),u=$("div","shop-top",h);$("span","shop-icon",u,a.icon);let d=$("div","shop-title",u);$("div","shop-name",d,a.name),$("div","shop-cat",d,a.cat);let f=$("div","pips",h);for(let v=0;v<c;v++)$("span","pip"+(v<l?" on":""),f);$("p","shop-desc",h,a.desc);let m=$("div","shop-eff",h);if(l>0&&$("div","now",m,"Aktuell: "+a.effect(l)),l<c&&$("div","next",m,(l>0?"N\xE4chste Stufe: ":"Bringt: ")+a.effect(l+1)),l<c){let v=a.prices[l],g=Zt(h,(t.wallet>=v?"Kaufen \xB7 ":"Fehlt noch \xB7 ")+Xf(v),"buy",t.wallet>=v?"buy":"buy poor");g.dataset.id=a.id,t.wallet<v&&(g.disabled=!0)}else $("div","maxed-tag",h,"Ausgebaut \u2714")}let o=$("div","menu row",n);Zt(o,"\u2190 Zur\xFCck","back","back primary")}render_controls(e){e.textContent="";let t=$("div","card",e);$("h2","",t,"\u{1F3AE} Steuerung");let n=$("div","controls-grid",t),s=[["Lenken","\u2190 \u2192 oder A D","Linker Stick","\u25C0 \u25B6"],["Strom geben","\u2191 oder W","RT oder Steuerkreuz \u2191","Gas"],["Bremsen","\u2193 oder S","LT oder Steuerkreuz \u2193","Bremse"],["Hupen (Brunnen & Elsa gr\xFC\xDFen)","Leertaste","A","\u{1F4EF}"],["Scheibenwischer von Hand","E","X","\u{1F327}\uFE0F"],["Megafon (aus dem Shop)","H","Y","\u{1F4E2}"],["Kamera (Cockpit / Drohne)","V","B","\u{1F3A5}"],["Chat ein/aus","C","\u2013","\u2013"],["Ton aus","M","\u2013","\u2013"],["Pause","Esc oder P","Start","\u23F8"]],r=$("div","crow head",n);for(let l of["Aktion","Tastatur","Gamepad","Touch"])$("span","",r,l);for(let l of s){let c=$("div","crow",n);for(let h of l)$("span","",c,h)}let o=$("div","tips",t);$("h3","",o,"Tipps");for(let l of["Wenn NOMI sagt \u201EDie linke Fahrspur ist freigeschaltet.\u201C, gibt es auf der ganz linken Spur Bonusguthaben \u2013 eine Minute lang.","Danach gilt wieder das Rechtsfahrgebot. Sonst kommt die Polizei Gifhorn.","Das Navi-Ziel \xE4ndert sich st\xE4ndig \u2013 jeder neue Zuschauer bietet einen Cent mehr. Erreichte Ziele bringen Guthaben.","Lade-Ringe f\xFCllen den Akku. Bananensaft ist super, Koriander leider nicht.","Wer gut f\xE4hrt, bekommt Regen \u2013 mit Regenzulage. Der automatische Wischer ist allerdings noch in der Beta."])$("p","",o,"\u2022 "+l);let a=$("div","menu row",t);Zt(a,"\u2190 Zur\xFCck","back","primary")}render_settings(e,t){e.textContent="";let n=$("div","card settings-card",e);$("h2","",n,"\u2699\uFE0F Einstellungen");let s=$("div","settings-list",n),r=(d,f,m)=>{let v=$("div","set-row",s);$("span","",v,f);let g=Zt(v,m?"An":"Aus","toggle",m?"on":"off");g.dataset.key=d,g.dataset.on=m?"1":"0"};r("sound","Ger\xE4usche",t.sound),r("speech","Sprachausgabe (NOMI und Sprachdurchsagen)",t.speech),r("chat","Live-Chat anzeigen",t.chat);let o=$("div","set-row",s);$("span","",o,"Lautst\xE4rke");let a=$("input","range",o);a.type="range",a.min="0",a.max="1",a.step="0.05",a.value=String(t.volume),a.addEventListener("input",()=>this.h.setting("volume",parseFloat(a.value)));let l=$("div","set-row",s);$("span","",l,"Grafik");let c=$("div","seg",l);for(let[d,f]of[["auto","Automatisch"],["hoch","Hoch"],["mittel","Mittel"],["niedrig","Niedrig"]]){let m=Zt(c,f,"quality",t.quality===d?"on":"off");m.dataset.value=d}t.speechSupported||$("p","note",n,"Hinweis: Dieser Browser hat keine deutsche Sprachausgabe \u2013 NOMI spricht dann nur per Untertitel.");let h=$("div","set-row",s);$("span","",h,"Spielstand"),Zt(h,"Spielstand zur\xFCcksetzen","reset","off");let u=$("div","menu row",n);Zt(u,"\u2190 Zur\xFCck","back","primary")}render_about(e){e.textContent="";let t=$("div","card about-card",e);$("h2","",t,"\u2139\uFE0F \xDCber das Spiel");let n=a=>$("p","",t,a);n("\u201EMini Adam \u2013 Tesla-Navi ferngesteuert\u201C ist ein liebevolles, nicht-kommerzielles Fan-Spiel rund um SkylineTV LIVE. Mini Adam \u2013 der Pl\xFCsch-Adam mit Kappe, Bart und LIVE-Shirt \u2013 f\xE4hrt den schwarzen Tesla Model 3 Long Range AWD mit 75-kWh-Akku \xFCber die Autobahn, w\xE4hrend der Chat das Navi fernsteuert."),n("Fast alle Witze stammen aus dem SkylineTV LIVE Wiki: die freigeschaltete linke Spur, das Navi-Bieten mit einem Cent mehr, BrunnenTV mit Herrn Sch\xF6nnbrun, Elsa, die Polizei Gifhorn, Meister Propper (kommt gleich), Malte, die Sparkassen-Farbe, Rahmen aus dem Live-Bereich, Sprachdurchsagen von Fr\xE4ulein Kassandra und Br\xFCll-William, Bananensaft statt Koriander, \u201EYou had 5 Jobs\u201C und die erlogenen Berufsbezeichnungen im Abspann."),n("NOMI ist der Boardcomputer auf dem Armaturenbrett. Alle Grafiken, Ger\xE4usche und Stimmen entstehen direkt im Browser \u2013 ohne Bilder- oder Tondateien.");let s=$("a","link",t,"SkylineTV LIVE Wiki \xF6ffnen");s.href="https://skylinetv.live/wiki/index.php?title=Hauptseite",s.target="_blank",s.rel="noopener";let r=$("div","tribute",t);$("span","heart",r,"\u{1F5A4}"),$("span","",r,"In Erinnerung an Adam Wolke \u2013 danke f\xFCr die Live-Eskalationen.");let o=$("div","menu row",t);Zt(o,"\u2190 Zur\xFCck","back","primary")}};var ko={hoch:{pr:1.5,msaa:4,shadows:!0,shadowSize:2048,mirrorEvery:1},mittel:{pr:1,msaa:4,shadows:!0,shadowSize:1024,mirrorEvery:2},niedrig:{pr:.75,msaa:0,shadows:!1,shadowSize:1024,mirrorEvery:3}},Gu=/[?&]debug/.test(location.search),Ol=document.getElementById("app"),Hu=document.getElementById("loading"),st=$p(),Kt=st.settings;function o0(){let i=Kt.quality;return i==="auto"?{...ko.hoch,pr:Math.min(window.devicePixelRatio||1,1.25),auto:!0}:{...ko[i]||ko.mittel,pr:Math.min(window.devicePixelRatio||1,(ko[i]||ko.mittel).pr)}}var An=o0(),ut;try{ut=new ka({antialias:!0,powerPreference:"high-performance"})}catch(i){throw Hu.innerHTML='<div class="load-card"><h1>Mini Adam</h1><p>WebGL konnte nicht gestartet werden. Bitte eine aktuelle Version von Google Chrome verwenden und die Hardware-Beschleunigung einschalten.</p></div>',i}var Gi=An.pr;ut.setPixelRatio(Gi);ut.setSize(window.innerWidth,window.innerHeight);ut.toneMapping=tu;ut.toneMappingExposure=1;ut.outputColorSpace=ht;ut.shadowMap.enabled=An.shadows;ut.shadowMap.type=Qh;ut.shadowMap.autoUpdate=!1;ut.domElement.id="view";Ol.prepend(ut.domElement);Zf(ut.capabilities.getMaxAnisotropy());var ui=new Bi,At=new Jt(58,window.innerWidth/window.innerHeight,.25,3200),zr=new Jt(58,window.innerWidth/window.innerHeight,.012,20),Bu=new Jt(26,512/192,.6,700),Uo=new Jt(24,16/9,.2,900),Xs=new sl(ut,ui,{shadows:An.shadows,shadowSize:An.shadowSize}),Fu=new il(ui),Vu=new hl(ui),zl=new _l(ui),qs=new ml(ui,zl),G1=new Pl(ui);Ep();var Rn=Ip();ui.add(Rn.root);var Wt=new xl;Wt.scene.environment=Xs.envTarget.texture;Xs.onEnv=i=>{Wt.scene.environment=i};var Vr=new yl,Wi=new ue;function a0(){return ut.getDrawingBufferSize(Wi),Wi}a0();var No=new Gn(Wi.x,Wi.y,{type:as,samples:An.msaa,depthBuffer:!0}),Wu=new Gn(512,192,{type:as,samples:0,depthBuffer:!0});Wt.setMirrorTexture(Wu.texture);var l0=Up(No.texture,Vr),c0=new Bi,h0=new D(new tt(2,2),l0);h0.frustumCulled=!1;c0.add(h0);var V1=new br(-1,1,1,-1,0,1),Jn=l0.uniforms,W1=(()=>{let i=document.createElement("canvas");i.width=512,i.height=192;let e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,192);t.addColorStop(0,"#2a2c30"),t.addColorStop(1,"#141517"),e.fillStyle=t,e.fillRect(0,0,512,192),e.fillStyle="#0c0c0d",e.fillRect(0,0,512,34);let n=(r,o,a,l,c,h)=>{e.fillStyle=c,Ht(e,r,o,a,l,8),e.fill(),e.fillStyle="#e8e8e8",e.font="bold 15px Arial, sans-serif",e.textAlign="center",e.fillText(h,r+a/2,o+l/2+5)};n(24,70,120,84,"#3b3f46","Akku-Pack"),n(160,92,96,62,"#20242a","Router"),n(272,60,92,94,"#5a2a2a","KONFETTI"),n(380,84,110,70,"#1e3550","LTE \xD73"),e.strokeStyle="#d4a21a",e.lineWidth=3;for(let r=0;r<4;r++)e.beginPath(),e.moveTo(140+r*8,120),e.bezierCurveTo(180,175-r*6,330,178,380,120+r*6),e.stroke();e.fillStyle="#ff4d4d",e.font="bold 18px Arial, sans-serif",e.textAlign="left",e.fillText("\u25CF REC  Kofferraum offen",18,24);let s=new Bt(i);return s.colorSpace=ht,s.repeat.x=-1,s.offset.x=1,s})(),Gl=document.createElement("canvas");Gl.width=360;Gl.height=270;var Ws=Gl.getContext("2d"),yn=new Ml;yn.enabled=Kt.sound;yn.volume=Kt.volume;var vs=new wl;vs.enabled=Kt.speech;var nn=new Sl,kt=new Il(Ol);kt.setChat(Kt.chat);var Xu=document.createElement("div");Xu.className="touch";for(let[i,e,t]of[["left","\u25C0","t-left"],["right","\u25B6","t-right"],["brake","Bremse","t-brake"],["gas","Strom","t-gas"],["horn","\u{1F4EF}","t-small t-horn"],["wiper","\u{1F327}\uFE0F","t-small t-wiper"],["megafon","\u{1F4E2}","t-small t-megafon"],["camera","\u{1F3A5}","t-small t-camera"],["pause","\u23F8","t-small t-pause"]]){let n=document.createElement("button");n.type="button",n.className=t,n.textContent=e,Xu.appendChild(n),nn.bindTouch(n,i)}Ol.appendChild(Xu);var Ul=null,Ft={flash:0,glitch:0,green:0,trunk:0,fade:0,fadeTarget:0},X1={flash:(i=1)=>{Ft.flash=Math.max(Ft.flash,i)},glitch:i=>{Ft.glitch=Math.max(Ft.glitch,i)},green:i=>{Ft.green=Math.max(Ft.green,i)},shake:i=>{Wt.shake=Math.max(Wt.shake,i)},trunk:i=>{Ft.trunk=i,Wt.mirrorMat.map=W1,Wt.mirrorMat.needsUpdate=!0}},q1={reset:()=>kt.reset(),chat:i=>kt.chat(i),toast:(i,e)=>kt.toast(i,e),banner:(i,e,t)=>kt.banner(i,e,t),nomi:(i,e)=>kt.nomi(i,e),money:(i,e)=>kt.money(i,e),durchsage:(i,e,t,n)=>kt.durchsage(i,e,t,n),rahmen:(i,e)=>kt.rahmen(i,e),funkloch:i=>kt.funkloch(i),damage:(i,e)=>kt.damage(i,e),jobs:i=>kt.jobs(i),photo:(i,e)=>{Ul={kmh:i,clock:e}}},rt=new Cl({traffic:qs,scenery:Vu,road:Fu,sky:Xs,rain:zl,windshield:Vr,cockpit:Wt,audio:yn,speech:vs,ui:q1,fx:X1,pickups:G1}),Gt="loading",Vi="cockpit",Vt=0,Xi=!1,qu=null,Ou=!1,Fn=new Ll(Ol,{click:()=>{yn.init(),yn.click()},action:i=>{i==="start"||i==="restart"?u0():i==="resume"?d0():i==="quit"?(Xi=!1,Fn.hide(),rt.end("quit")):i==="menu"&&Y1()},back:()=>{},dataFor:(i,e)=>i==="shop"?{wallet:st.wallet,upgrades:st.upgrades}:i==="settings"?{...Kt,speechSupported:vs.supported}:i==="title"?st:i==="pause"?rt:i==="over"&&qu||e,buy:i=>{let e=Do.find(s=>s.id===i),t=st.upgrades[i]||0;if(!e||t>=El[i])return!1;let n=e.prices[t];return st.wallet<n?(yn.bad(),!1):(st.wallet=Math.round((st.wallet-n)*100)/100,st.upgrades[i]=t+1,Vs(st),yn.coin(),Bo(),!0)},setting:(i,e)=>{Kt[i]=e,st.settings=Kt,Vs(st),Bl(i)},resetSave:()=>{let i=Jp();for(let e of Object.keys(st))delete st[e];Object.assign(st,i),Kt=st.settings,Vs(st),Bo(),Bl()}});function Bo(){let i=st.upgrades;Rn.setStarlink(!!i.starlink),Rn.setVest(!!i.weste),Wt.setElsa(!!i.elsa)}function Bl(i){if(yn.enabled=Kt.sound,yn.volume=Kt.volume,yn.setEnabled(Kt.sound),vs.enabled=Kt.speech,Kt.speech||vs.stopAll(),kt.setChat(Kt.chat),!i||i==="quality"){let e=An;An=o0(),Gi=An.pr,e.shadows!==An.shadows&&(ut.shadowMap.enabled=An.shadows,Xs.sun.castShadow=An.shadows,ui.traverse(t=>{t.material&&(Array.isArray(t.material)?t.material:[t.material]).forEach(n=>n.needsUpdate=!0)})),No.samples=An.msaa,No.dispose(),Fo()}}function Y1(){Gt="title",Vt=0,Xi=!1,Vi="cockpit",kt.show(!1),vs.stopAll(),rt.startDemo(),Bo(),Fn.hide(),Fn.show("title",st)}function u0(){yn.init(),Fn.hide(),Xi=!1,rt.start(st),Bo(),Gt="intro",Vt=0,Ou=!1,Vi="cockpit",kt.show(!1),Ft.fade=1,nn.pressed.clear()}function d0(){Xi=!1,Fn.hide(),vs.pause(!1),nn.pressed.clear(),nn.keys.clear()}function Yu(){Gt!=="drive"||Xi||(Xi=!0,vs.pause(!0),Fn.show("pause",rt))}function Z1(){let i=rt.over,e=i.distance/1e3,t=st.best.distance||0,n=i.distance>t&&i.distance>50;st.wallet=Math.round((st.wallet+i.money)*100)/100,st.best.distance=Math.max(t,i.distance),st.best.earned=Math.max(st.best.earned||0,i.money),st.best.viewers=Math.max(st.best.viewers||0,i.peakViewers),st.stats.runs++,st.stats.totalKm+=e,st.stats.naviReached+=i.stats.naviReached,st.stats.crashes+=i.stats.crashes,st.stats.leftLaneEuro+=i.breakdown["Linke Spur"]||0,Vs(st),qu={...i,newRecord:n,best:st.best.distance,wallet:st.wallet,photos:kt.photos.slice()}}var ci={lane:2,cool:0};function t0(i,e,t=!0){let n=rt.player;ci.cool-=i;let s=null,r=1/0;for(let h of qs.cars){let u=h.s-n.s;u>0&&u<70&&Math.abs(h.x-n.x)<2.3&&u<r&&(s=h,r=u)}if(t&&s&&r<55&&ci.cool<=0){let h=f=>f>=1&&f<=3&&qs.cars.every(m=>Math.abs(m.x-Ce.laneCenter(f))>2.4||m.s-n.s<-22||m.s-n.s>48),u=n.lane,d=[u-1,u+1].filter(h);d.length&&(ci.lane=d[0],ci.cool=3)}if(ci.cool<=-8&&ci.lane<3){let h=ci.lane+1;qs.cars.every(u=>Math.abs(u.x-Ce.laneCenter(h))>2.4||u.s-n.s<-22||u.s-n.s>60)&&(ci.lane=h,ci.cool=3)}let o=Ce.laneCenter(ci.lane)-n.x,a=Math.abs(o)>.25?We(o*.9,-1,1):0,l=n.kmh<e?.6:0,c=0;return s&&r<40&&s.speed<n.speed&&(l=0,c=We((n.speed-s.speed)/8+(40-r)/40,0,1)),{steer:a,throttle:l,brake:c,horn:!1,wiper:!1,megafon:!1}}var hi=new $e,Dl=new C,kl=new qt,n0=new ln,K1=new C(1,1,1),$1=new C,Ho=new C,Mi={pos:new C(0,4,10),look:new C(0,1,-10),init:!1};function Gr(){let i=rt.player;Dl.set(i.x,0,0),n0.set(0,-i.yaw,We(i.latAcc*.0025,-.03,.03),"YXZ"),kl.setFromEuler(n0),hi.compose(Dl,kl,K1),Rn.root.position.copy(Dl),Rn.root.quaternion.copy(kl),Wt.root.position.copy(Dl),Wt.root.quaternion.copy(kl)}function Hl(i){let e=window.innerWidth/window.innerHeight,t=Cr.degToRad(86),n=Math.max(Cr.degToRad(i),2*Math.atan(Math.tan(t/2)/e));At.fov=We(Cr.radToDeg(n),50,78),At.aspect=e,At.updateProjectionMatrix()}function Fl(i){return $1.copy(i).applyMatrix4(hi)}function Nl(i,e){let t=rt.player,n,s;if(e==="orbit"){let o=Vt*.16+.9;n=new C(Math.sin(o)*8.5,2.4+Math.sin(Vt*.3)*.6,Math.cos(o)*8.5),s=new C(0,.9,0)}else n=new C(-t.vx*.25,3.3,9.2),s=new C(0,1,-14);n.applyMatrix4(hi),s.applyMatrix4(hi),Mi.init||(Mi.pos.copy(n),Mi.look.copy(s),Mi.init=!0);let r=1-Math.exp(-i*(e==="orbit"?3:6));Mi.pos.lerp(n,r),Mi.look.lerp(s,r),At.position.copy(Mi.pos),Wt.shake>0&&(At.position.y+=Math.sin(Vt*60)*Wt.shake*.08),At.lookAt(Mi.look),Hl(50)}var gs=[{t:0,pos:[-6.2,2.4,-9.5],look:[-.25,.95,0]},{t:2.4,pos:[-2.7,1.55,-3.4],look:[-.37,1.12,.22]},{t:4.6,pos:[-1.72,1.26,.2],look:[-.37,1.16,.28]}],$n=4.85,Zu=6.3;function J1(i){let e=gs[0],t=gs[gs.length-1];for(let s=0;s<gs.length-1;s++)if(i>=gs[s].t&&i<=gs[s+1].t){e=gs[s],t=gs[s+1];break}if(i>t.t)return{pos:new C(...t.pos),look:new C(...t.look)};let n=xu(We((i-e.t)/(t.t-e.t),0,1));return{pos:new C().fromArray(e.pos).lerp(new C().fromArray(t.pos),n),look:new C().fromArray(e.look).lerp(new C().fromArray(t.look),n)}}function j1(i){let e=Vt;if(e<$n){let{pos:n,look:s}=J1(e);return n.applyMatrix4(hi),s.applyMatrix4(hi),At.position.copy(n),At.lookAt(s),Hl(44),"outside"}Wt.placeCamera(At,hi,e,rt.player.speed,0,i);let t=xu(We((e-$n)/(Zu-$n),0,1));return At.rotateOnWorldAxis(Ho.set(0,1,0),(1-t)*1.05),Hl(58),"inside"}function Fo(){ut.setPixelRatio(Gi),ut.setSize(window.innerWidth,window.innerHeight),a0(),No.setSize(Wi.x,Wi.y),Jn.uTexel.value.set(1/Wi.x,1/Wi.y),At.aspect=window.innerWidth/window.innerHeight,At.updateProjectionMatrix(),zl.setPixelScale(Wi.y)}window.addEventListener("resize",Fo);Fo();var li={acc:0,n:0,cool:3};function Q1(i){if(!An.auto||Gt==="loading"||(li.acc+=i,li.n++,li.cool-=i,li.n<40))return;let e=li.acc/li.n;if(li.acc=0,li.n=0,li.cool>0)return;let t=Math.min(window.devicePixelRatio||1,1.5);e>1/45&&Gi>.55?(Gi=Math.max(.55,Gi-.12),li.cool=1.5,Fo()):e<1/75&&Gi<t&&(Gi=Math.min(t,Gi+.06),li.cool=3,Fo())}var i0=0;function f0(i,{cockpitOn:e,drops:t}){Rn.root.visible=!e,ut.shadowMap.needsUpdate=An.shadows,ut.setRenderTarget(No),ut.render(ui,i),ut.setRenderTarget(null),Jn.uDrops.value=t?1:0,ut.render(c0,V1)}function eM(i){i0++,i&&Ft.trunk<=0&&i0%An.mirrorEvery===0&&(Bu.position.copy(Fl(Ho.set(0,1.32,.9))),Bu.lookAt(Fl(Ho.set(0,1.05,40))),Rn.root.visible=!1,ut.setRenderTarget(Wu),ut.render(ui,Bu)),Ul&&(tM(Ul),Ul=null),f0(At,{cockpitOn:i,drops:i}),i&&(zr.position.copy(At.position),zr.quaternion.copy(At.quaternion),zr.fov=At.fov,zr.aspect=At.aspect,zr.updateProjectionMatrix(),ut.autoClear=!1,ut.clearDepth(),ut.render(Wt.scene,zr),ut.autoClear=!0)}function tM({kmh:i,clock:e}){Uo.aspect=window.innerWidth/window.innerHeight,Uo.updateProjectionMatrix(),Uo.position.copy(Fl(Ho.set(2.6,1.55,-10.5))),Uo.lookAt(Fl(Ho.set(-.3,1.05,-.3)));let t=Rn.cabinLight.intensity;Rn.cabinLight.intensity=3.5;let n=Jn.uFlash.value;Jn.uFlash.value=.025,f0(Uo,{cockpitOn:!1,drops:!1}),Jn.uFlash.value=n,Rn.cabinLight.intensity=t;let s=ut.domElement.width,r=ut.domElement.height,o=r*.8,a=o*(4/3);Ws.drawImage(ut.domElement,(s-a)/2,(r-o)/2,a,o,0,0,360,270),Ws.fillStyle="rgba(0,0,0,0.55)",Ws.fillRect(0,238,360,32),Ws.fillStyle="#ffd21f",Ws.font='bold 17px "Courier New", monospace',Ws.textAlign="left",Ws.fillText(`${i} km/h   ${e}   ERLAUBT 120`,10,260);let l=null;try{l=Gl.toDataURL("image/jpeg",.82)}catch{l=null}kt.photo(l,i,e)}var zu=performance.now(),Tn=0,s0={prev:{}};function nM(){let i=navigator.getGamepads?navigator.getGamepads():[];for(let e of i){if(!e)continue;let t=a=>!!e.buttons[a]?.pressed,n=e.axes[1]||0,s={up:t(12)||n<-.6,down:t(13)||n>.6,a:t(0),b:t(1),start:t(9)},r=a=>s[a]&&!s0.prev[a],o=0;r("up")&&(o=-1),r("down")&&(o=1),(o||r("a")||r("b")||r("start"))&&Fn.pad(o,r("a")||r("start")&&Fn.current!=="pause",r("b")||r("start")&&Fn.current==="pause"),s0.prev=s;return}}function p0(i){requestAnimationFrame(p0);let e=(i-zu)/1e3;zu=i,!(Gu&&window.__MA&&window.__MA.frozen)&&(e>0||(e=1/60),e=Math.min(e,1/20),m0(e),Q1(e))}function m0(i,{render:e=!0}={}){Tn+=i,Vt+=i,nn.poll(),Fn.open&&nM();let t=rt.player,n=null,s=!1,r=0,o=0;switch(nn.take("mute")&&(Kt.sound=!Kt.sound,Bl("sound"),Vs(st),kt.toast(Kt.sound?"\u{1F50A} Ton an":"\u{1F507} Ton aus","info")),nn.take("chat")&&(Kt.chat=!Kt.chat,Bl("chat"),Vs(st)),Gt){case"title":{n=t0(i,118),rt.demo(i,n),Gr(),Nl(i,"orbit"),r=Math.max(0,Math.sin(Tn*.5))>.85?1:0,o=Math.sin(Tn*.4)*.6;break}case"intro":{(nn.anyKey||nn.take("confirm"))&&(Ou=!0),Ou&&Vt<$n-.25&&(Vt=$n-.25),n=t0(i,100,!1),ci.lane=3,rt.update(i,n,At),Gr(),s=j1(i)==="inside",r=ls(1.4,2.4,Vt)*(1-ls(4.2,4.7,Vt)),o=ls(1,2.6,Vt)*1;let u=Vt;Ft.fade=u<.6?1-u/.6:u>$n-.25&&u<$n?(u-($n-.25))/.25:u>=$n&&u<$n+.35?1-(u-$n)/.35:0,!rt._greeted&&u>=$n&&(rt._greeted=!0,yn.whoosh(),rt.say("Hallo Mini Adam! Der Stream l\xE4uft. Gute Fahrt!","happy")),u>.4&&!rt._introChime&&(rt._introChime=!0,yn.nomiChime()),Vt>=Zu&&(Gt="drive",Vt=0,kt.show(!0),kt.toast("Tipp: \u2190 \u2192 lenken \xB7 \u2191 Strom \xB7 \u2193 Bremse \xB7 V Kamera","info"));break}case"drive":{if(Xi){Gr(),Vi==="cockpit"&&Wt.placeCamera(At,hi,Tn,0,0,0),s=Vi==="cockpit";break}if(nn.take("pause")){Yu();break}nn.take("camera")&&(Vi=Vi==="cockpit"?"drone":"cockpit",Mi.init=!1,kt.cameraLabel(Vi==="cockpit"?"\u{1F3A5} Cockpit":"\u{1F3A5} Drohne")),n={steer:nn.steer,throttle:nn.throttle,brake:nn.brake,horn:nn.take("horn"),wiper:nn.take("wiper"),megafon:nn.take("megafon")},rt.update(i,n,At),Gr(),Vi==="cockpit"?(Wt.placeCamera(At,hi,Tn,t.speed,t.latAcc,i),Hl(58),s=!0):Nl(i,"follow"),rt.over&&(Gt="ending",Vt=0,Mi.init=!1,Z1());break}case"ending":case"over":{let h={steer:0,throttle:0,brake:.5,horn:!1,wiper:!1,megafon:!1};t.update(i,h,{wet:rt.weather.level}),qs.update(i,Tn,t,{difficulty:.2,leftOpen:!1,rain:rt.weather.level}),Gr(),Nl(i,"orbit"),r=Vt>1?1:0,o=Math.sin(Vt*.5)*.8,Gt==="ending"&&Vt>2.6&&(Gt="over",kt.show(!1),Fn.show("over",qu));break}default:break}let a=t.s,l=rt.weather?rt.weather.level:0,c=Xi;if(!c){let h=Hi.uCurve.value;h.x=125e-6*(.62*Math.sin(a/1900+1.3)+.38*Math.sin(a/740+.4)),h.y=45e-6*Math.sin(a/1300+2.1)*(.5+.5*Math.sin(a/3100));let u=rt.left||{glow:0};Fu.update(a,i,Tn,u.glow||0,u.open&&u.timer<10?1:0),Fu.setWet(l),Vu.update(a,i),Xs.setOvercast(l*.95),zl.update(i,Tn,{speed:t.speed,s:a,camX:At.position.x,intensity:l}),Rn.update(i,t.speed,t.steer,Tn),Rn.setBrake(t.braking>.1||t.speed<1),Rn.adam.animate(Tn,{steer:t.steer,wave:r,look:o}),Rn.cabinLight.intensity=s?0:Gt==="title"||Gt==="intro"||Gt==="ending"||Gt==="over"?2.2:.6,Vr.update(i,{speed:t.speed,camera:At,carMatrix:hi}),Wt.update({dt:i,t:Tn,steer:t.steer,latAcc:t.latAcc,wiperAngles:Vr.angles,sunDir:Xs.sunDir,overcast:l,screen:rt.screenState?iM():null}),Ft.trunk>0&&(Ft.trunk-=i,Ft.trunk<=0&&Wt.setMirrorTexture(Wu.texture))}Xs.update(c?0:i,At,a,Tn),yn.update(i,{speed:t.speed,throttle:t.throttle,rain:l,sirenLevel:rt.sirenLevel||0,inCabin:s,paused:c||Gt==="over"}),Ft.flash=Math.max(0,Ft.flash-i*3.5),Ft.glitch=Math.max(0,Ft.glitch-i),Ft.green=Math.max(0,Ft.green-i),Jn.uTime.value=Tn,Jn.uRain.value=l,Jn.uFlash.value=Ft.flash,Jn.uGlitch.value=Ft.glitch>0?.6+.4*Math.sin(Tn*40):0,Jn.uGreen.value=Ft.green>0?Math.sin(Tn*26)>.2?1:.15:0,Jn.uFade.value=Gt==="intro"?We(Ft.fade,0,1):0,Jn.uSat.value=1.08-l*.25,Gu&&window.__MA&&window.__MA.camHook&&window.__MA.camHook(At,hi),document.body.classList.toggle("playing",Gt==="drive"&&!Xi),e&&eM(s),kt.update(i,Gt==="drive"||Gt==="intro"?rt:null),nn.endFrame()}function iM(){try{return rt.running||rt.over?rt.screenState():r0()}catch{return r0()}}function r0(){let i=rt.player;return{dark:!1,battery:100,speedKmh:i.kmh,limit:null,playerX:i.x,leftLane:0,cars:qs.nearby(i,125),s:i.s,navi:rt.navi.screen(i.s,18*60,i.speed),clock:"18:00",temp:17,funkloch:0,wiperOn:!1}}window.addEventListener("pointerdown",()=>yn.init());window.addEventListener("keydown",()=>yn.init());document.addEventListener("visibilitychange",()=>{document.hidden&&Yu()});function sM(){Bo(),rt.startDemo(),Gr(),Nl(.016,"orbit");try{ut.compile(ui,At),ut.compile(Wt.scene,At)}catch{}Gt="title",Fn.show("title",st),Hu.classList.add("done"),setTimeout(()=>Hu.remove(),800),requestAnimationFrame(i=>{zu=i,p0(i)})}Gu&&(window.__MA={game:rt,traffic:qs,scenery:Vu,cockpit:Wt,windshield:Vr,tesla:Rn,ui:kt,menus:Fn,input:nn,renderer:ut,camera:At,save:st,get state(){return Gt},set view(i){Vi=i},start:()=>u0(),skipIntro:()=>{Vt=Zu},step:(i,e=1/30)=>{let t=Math.round(i/e);for(let n=0;n<t;n++)m0(e,{render:n===t-1})},setState:(i,e=0)=>{Gt=i,Vt=e},rain:i=>{rt.weather.active=i>0,rt.weather.target=i,rt.weather.level=i,rt.weather.dur=999,Vr.setRain(i)},pause:()=>Yu(),resume:()=>d0()});sM();})();
