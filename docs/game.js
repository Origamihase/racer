/* Mini Adam: Tesla-Navi ferngesteuert – gebaut aus src/ (npm run build). Enthält three.js (MIT). */
(()=>{var du="170";var z0=0,Md=1,G0=2;var Hf=1,fu=2,Li=3,rs=0,xn=1,ft=2,ns=0,yr=1,os=2,Ed=3,wd=4,pu=5,Ls=100,V0=101,W0=102,X0=103,q0=104,Y0=200,mu=201,Z0=202,K0=203,Hc=204,vo=205,$0=206,J0=207,j0=208,Q0=209,em=210,tm=211,nm=212,im=213,sm=214,Fc=0,Oc=1,zc=2,Er=3,Gc=4,Vc=5,Wc=6,Xc=7,gu=0,rm=1,om=2,is=0,am=1,lm=2,cm=3,vu=4,hm=5,um=6,dm=7;var Ff=300,wr=301,Sr=302,qc=303,Yc=304,nl=306,Ni=1e3,Us=1001,Zc=1002,An=1003,fm=1004;var Ko=1005;var zn=1006,sc=1007;var Ns=1008;var Bi=1009,Of=1010,zf=1011,xo=1012,xu=1013,Bs=1014,mi=1015,cs=1016,yu=1017,_u=1018,Tr=1020,Gf=35902,Vf=1021,Wf=1022,si=1023,Xf=1024,qf=1025,_r=1026,Ar=1027,bu=1028,Mu=1029,Yf=1030,Eu=1031;var wu=1033,Sa=33776,Ta=33777,Aa=33778,Ra=33779,Kc=35840,$c=35841,Jc=35842,jc=35843,Qc=36196,eh=37492,th=37496,nh=37808,ih=37809,sh=37810,rh=37811,oh=37812,ah=37813,lh=37814,ch=37815,hh=37816,uh=37817,dh=37818,fh=37819,ph=37820,mh=37821,Ca=36492,gh=36494,vh=36495,Zf=36283,xh=36284,yh=36285,_h=36286;var Pa=2300,bh=2301,rc=2302,Sd=2400,Td=2401,Ad=2402;var pm=3200,mm=3201;var Su=0,gm=1,ts="",ht="srgb",Nr="srgb-linear",il="linear",Tt="srgb";var tr=7680;var Rd=519,vm=512,xm=513,ym=514,Kf=515,_m=516,bm=517,Mm=518,Em=519,Cd=35044,$f=35048;var Pd="300 es",ki=2e3,Ia=2001,as=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let s=this._listeners[e];if(s!==void 0){let r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let n=this._listeners[e.type];if(n!==void 0){e.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}},gn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Id=1234567,uo=Math.PI/180,Rr=180/Math.PI;function Gs(){let i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(gn[i&255]+gn[i>>8&255]+gn[i>>16&255]+gn[i>>24&255]+"-"+gn[e&255]+gn[e>>8&255]+"-"+gn[e>>16&15|64]+gn[e>>24&255]+"-"+gn[t&63|128]+gn[t>>8&255]+"-"+gn[t>>16&255]+gn[t>>24&255]+gn[n&255]+gn[n>>8&255]+gn[n>>16&255]+gn[n>>24&255]).toLowerCase()}function en(i,e,t){return Math.max(e,Math.min(t,i))}function Tu(i,e){return(i%e+e)%e}function wm(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Sm(i,e,t){return i!==e?(t-i)/(e-i):0}function fo(i,e,t){return(1-t)*i+t*e}function Tm(i,e,t,n){return fo(i,e,1-Math.exp(-t*n))}function Am(i,e=1){return e-Math.abs(Tu(i,e*2)-e)}function Rm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Cm(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Pm(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Im(i,e){return i+Math.random()*(e-i)}function Lm(i){return i*(.5-Math.random())}function Dm(i){i!==void 0&&(Id=i);let e=Id+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function km(i){return i*uo}function Um(i){return i*Rr}function Nm(i){return(i&i-1)===0&&i!==0}function Bm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Hm(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Fm(i,e,t,n,s){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),m=o((n-e)/2);switch(s){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*m,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*m,a*c);break;case"ZYZ":i.set(l*m,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function gr(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Sn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Br={DEG2RAD:uo,RAD2DEG:Rr,generateUUID:Gs,clamp:en,euclideanModulo:Tu,mapLinear:wm,inverseLerp:Sm,lerp:fo,damp:Tm,pingpong:Am,smoothstep:Rm,smootherstep:Cm,randInt:Pm,randFloat:Im,randFloatSpread:Lm,seededRandom:Dm,degToRad:km,radToDeg:Um,isPowerOfTwo:Nm,ceilPowerOfTwo:Bm,floorPowerOfTwo:Hm,setQuaternionFromProperEuler:Fm,normalize:Sn,denormalize:gr},ue=class i{constructor(e=0,t=0){i.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(en(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},rt=class i{constructor(e,t,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],v=s[0],g=s[3],p=s[6],y=s[1],_=s[4],x=s[7],I=s[2],T=s[5],S=s[8];return r[0]=o*v+a*y+l*I,r[3]=o*g+a*_+l*T,r[6]=o*p+a*x+l*S,r[1]=c*v+h*y+u*I,r[4]=c*g+h*_+u*T,r[7]=c*p+h*x+u*S,r[2]=d*v+f*y+m*I,r[5]=d*g+f*_+m*T,r[8]=d*p+f*x+m*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,m=t*u+n*d+s*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/m;return e[0]=u*v,e[1]=(s*c-h*n)*v,e[2]=(a*n-s*o)*v,e[3]=d*v,e[4]=(h*t-s*l)*v,e[5]=(s*r-a*t)*v,e[6]=f*v,e[7]=(n*l-c*t)*v,e[8]=(o*t-n*r)*v,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(oc.makeScale(e,t)),this}rotate(e){return this.premultiply(oc.makeRotation(-e)),this}translate(e,t){return this.premultiply(oc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},oc=new rt;function Jf(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function La(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Om(){let i=La("canvas");return i.style.display="block",i}var Ld={};function co(i){i in Ld||(Ld[i]=!0,console.warn(i))}function zm(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}function Gm(i){let e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Vm(i){let e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}var dt={enabled:!0,workingColorSpace:Nr,spaces:{},convert:function(i,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===Tt&&(i.r=Ui(i.r),i.g=Ui(i.g),i.b=Ui(i.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(i.applyMatrix3(this.spaces[e].toXYZ),i.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Tt&&(i.r=br(i.r),i.g=br(i.g),i.b=br(i.b))),i},fromWorkingColorSpace:function(i,e){return this.convert(i,this.workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ts?il:this.spaces[i].transfer},getLuminanceCoefficients:function(i,e=this.workingColorSpace){return i.fromArray(this.spaces[e].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,e,t){return i.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Ui(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function br(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Dd=[.64,.33,.3,.6,.15,.06],kd=[.2126,.7152,.0722],Ud=[.3127,.329],Nd=new rt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bd=new rt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);dt.define({[Nr]:{primaries:Dd,whitePoint:Ud,transfer:il,toXYZ:Nd,fromXYZ:Bd,luminanceCoefficients:kd,workingColorSpaceConfig:{unpackColorSpace:ht},outputColorSpaceConfig:{drawingBufferColorSpace:ht}},[ht]:{primaries:Dd,whitePoint:Ud,transfer:Tt,toXYZ:Nd,fromXYZ:Bd,luminanceCoefficients:kd,outputColorSpaceConfig:{drawingBufferColorSpace:ht}}});var nr,Mh=class{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{nr===void 0&&(nr=La("canvas")),nr.width=e.width,nr.height=e.height;let n=nr.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=nr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=La("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ui(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ui(t[n]/255)*255):t[n]=Ui(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Wm=0,Da=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wm++}),this.uuid=Gs(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ac(s[o].image)):r.push(ac(s[o]))}else r=ac(s);n.url=r}return t||(e.images[this.uuid]=n),n}};function ac(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Mh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Xm=0,Rn=class i extends as{constructor(e=i.DEFAULT_IMAGE,t=i.DEFAULT_MAPPING,n=Us,s=Us,r=zn,o=Ns,a=si,l=Bi,c=i.DEFAULT_ANISOTROPY,h=ts){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xm++}),this.uuid=Gs(),this.name="",this.source=new Da(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ue(0,0),this.repeat=new ue(1,1),this.center=new ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new rt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ff)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ni:e.x=e.x-Math.floor(e.x);break;case Us:e.x=e.x<0?0:1;break;case Zc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ni:e.y=e.y-Math.floor(e.y);break;case Us:e.y=e.y<0?0:1;break;case Zc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Rn.DEFAULT_IMAGE=null;Rn.DEFAULT_MAPPING=Ff;Rn.DEFAULT_ANISOTROPY=1;var At=class i{constructor(e=0,t=0,n=0,s=1){i.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],v=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let _=(c+1)/2,x=(f+1)/2,I=(p+1)/2,T=(h+d)/4,S=(u+v)/4,R=(m+g)/4;return _>x&&_>I?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=T/n,r=S/n):x>I?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=T/s,r=R/s):I<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(I),n=S/r,s=R/r),this.set(n,s,r,t),this}let y=Math.sqrt((g-m)*(g-m)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(g-m)/y,this.y=(u-v)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Eh=class extends as{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new At(0,0,e,t),this.scissorTest=!1,this.viewport=new At(0,0,e,t);let s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:zn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let r=new Rn(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let t=Object.assign({},e.texture.image);return this.texture.source=new Da(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Xn=class extends Eh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},ka=class extends Rn{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=Us,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var wh=class extends Rn{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=An,this.minFilter=An,this.wrapR=Us,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var $t=class{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],f=r[o+1],m=r[o+2],v=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=m,e[t+3]=v;return}if(u!==v||l!==d||c!==f||h!==m){let g=1-a,p=l*d+c*f+h*m+u*v,y=p>=0?1:-1,_=1-p*p;if(_>Number.EPSILON){let I=Math.sqrt(_),T=Math.atan2(I,p*y);g=Math.sin(g*T)/I,a=Math.sin(a*T)/I}let x=a*y;if(l=l*g+d*x,c=c*g+f*x,h=h*g+m*x,u=u*g+v*x,g===1-a){let I=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=I,c*=I,h*=I,u*=I}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],m=r[o+3];return e[t]=a*m+h*u+l*f-c*d,e[t+1]=l*m+h*d+c*u-a*f,e[t+2]=c*m+h*f+a*d-l*u,e[t+3]=h*m-a*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),f=l(s/2),m=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(en(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*s+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},C=class i{constructor(e=0,t=0,n=0){i.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Hd.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Hd.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),h=2*(a*t-r*s),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return lc.copy(this).projectOnVector(e),this.sub(lc)}reflect(e){return this.sub(lc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(en(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},lc=new C,Hd=new $t,Hi=class{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ti.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ti.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ti.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ti):ti.fromBufferAttribute(r,o),ti.applyMatrix4(e.matrixWorld),this.expandByPoint(ti);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),$o.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),$o.copy(n.boundingBox)),$o.applyMatrix4(e.matrixWorld),this.union($o)}let s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ti),ti.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(to),Jo.subVectors(this.max,to),ir.subVectors(e.a,to),sr.subVectors(e.b,to),rr.subVectors(e.c,to),Ki.subVectors(sr,ir),$i.subVectors(rr,sr),Ss.subVectors(ir,rr);let t=[0,-Ki.z,Ki.y,0,-$i.z,$i.y,0,-Ss.z,Ss.y,Ki.z,0,-Ki.x,$i.z,0,-$i.x,Ss.z,0,-Ss.x,-Ki.y,Ki.x,0,-$i.y,$i.x,0,-Ss.y,Ss.x,0];return!cc(t,ir,sr,rr,Jo)||(t=[1,0,0,0,1,0,0,0,1],!cc(t,ir,sr,rr,Jo))?!1:(jo.crossVectors(Ki,$i),t=[jo.x,jo.y,jo.z],cc(t,ir,sr,rr,Jo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ti).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ti).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Ai[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Ai[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Ai[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Ai[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Ai[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Ai[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Ai[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Ai[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Ai),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}},Ai=[new C,new C,new C,new C,new C,new C,new C,new C],ti=new C,$o=new Hi,ir=new C,sr=new C,rr=new C,Ki=new C,$i=new C,Ss=new C,to=new C,Jo=new C,jo=new C,Ts=new C;function cc(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ts.fromArray(i,r);let a=s.x*Math.abs(Ts.x)+s.y*Math.abs(Ts.y)+s.z*Math.abs(Ts.z),l=e.dot(Ts),c=t.dot(Ts),h=n.dot(Ts);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var qm=new Hi,no=new C,hc=new C,Fi=class{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):qm.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;no.subVectors(e,this.center);let t=no.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(no,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(hc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(no.copy(e.center).add(hc)),this.expandByPoint(no.copy(e.center).sub(hc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}},Ri=new C,uc=new C,Qo=new C,Ji=new C,dc=new C,ea=new C,fc=new C,yo=class{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ri)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ri.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ri.copy(this.origin).addScaledVector(this.direction,t),Ri.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){uc.copy(e).add(t).multiplyScalar(.5),Qo.copy(t).sub(e).normalize(),Ji.copy(this.origin).sub(uc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Qo),a=Ji.dot(this.direction),l=-Ji.dot(Qo),c=Ji.lengthSq(),h=Math.abs(1-o*o),u,d,f,m;if(h>0)if(u=o*l-a,d=o*a-l,m=r*h,u>=0)if(d>=-m)if(d<=m){let v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(uc).addScaledVector(Qo,d),f}intersectSphere(e,t){Ri.subVectors(e.center,this.origin);let n=Ri.dot(this.direction),s=Ri.dot(Ri)-n*n,r=e.radius*e.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Ri)!==null}intersectTriangle(e,t,n,s,r){dc.subVectors(t,e),ea.subVectors(n,e),fc.crossVectors(dc,ea);let o=this.direction.dot(fc),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ji.subVectors(this.origin,e);let l=a*this.direction.dot(ea.crossVectors(Ji,ea));if(l<0)return null;let c=a*this.direction.dot(dc.cross(Ji));if(c<0||l+c>o)return null;let h=-a*Ji.dot(fc);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Je=class i{constructor(e,t,n,s,r,o,a,l,c,h,u,d,f,m,v,g){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,h,u,d,f,m,v,g)}set(e,t,n,s,r,o,a,l,c,h,u,d,f,m,v,g){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=v,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,s=1/or.setFromMatrixColumn(e,0).length(),r=1/or.setFromMatrixColumn(e,1).length(),o=1/or.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,f=o*u,m=a*h,v=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+m*c,t[5]=d-v*c,t[9]=-a*l,t[2]=v-d*c,t[6]=m+f*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,m=c*h,v=c*u;t[0]=d+v*a,t[4]=m*a-f,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-m,t[6]=v+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,m=c*h,v=c*u;t[0]=d-v*a,t[4]=-o*u,t[8]=m+f*a,t[1]=f+m*a,t[5]=o*h,t[9]=v-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,f=o*u,m=a*h,v=a*u;t[0]=l*h,t[4]=m*c-f,t[8]=d*c+v,t[1]=l*u,t[5]=v*c+d,t[9]=f*c-m,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,m=a*l,v=a*c;t[0]=l*h,t[4]=v-d*u,t[8]=m*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*u+m,t[10]=d-v*u}else if(e.order==="XZY"){let d=o*l,f=o*c,m=a*l,v=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+v,t[5]=o*h,t[9]=f*u-m,t[2]=m*u-f,t[6]=a*h,t[10]=v*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ym,e,Zm)}lookAt(e,t,n){let s=this.elements;return Fn.subVectors(e,t),Fn.lengthSq()===0&&(Fn.z=1),Fn.normalize(),ji.crossVectors(n,Fn),ji.lengthSq()===0&&(Math.abs(n.z)===1?Fn.x+=1e-4:Fn.z+=1e-4,Fn.normalize(),ji.crossVectors(n,Fn)),ji.normalize(),ta.crossVectors(Fn,ji),s[0]=ji.x,s[4]=ta.x,s[8]=Fn.x,s[1]=ji.y,s[5]=ta.y,s[9]=Fn.y,s[2]=ji.z,s[6]=ta.z,s[10]=Fn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],v=n[6],g=n[10],p=n[14],y=n[3],_=n[7],x=n[11],I=n[15],T=s[0],S=s[4],R=s[8],M=s[12],b=s[1],P=s[5],k=s[9],U=s[13],H=s[2],G=s[6],N=s[10],$=s[14],z=s[3],ne=s[7],le=s[11],me=s[15];return r[0]=o*T+a*b+l*H+c*z,r[4]=o*S+a*P+l*G+c*ne,r[8]=o*R+a*k+l*N+c*le,r[12]=o*M+a*U+l*$+c*me,r[1]=h*T+u*b+d*H+f*z,r[5]=h*S+u*P+d*G+f*ne,r[9]=h*R+u*k+d*N+f*le,r[13]=h*M+u*U+d*$+f*me,r[2]=m*T+v*b+g*H+p*z,r[6]=m*S+v*P+g*G+p*ne,r[10]=m*R+v*k+g*N+p*le,r[14]=m*M+v*U+g*$+p*me,r[3]=y*T+_*b+x*H+I*z,r[7]=y*S+_*P+x*G+I*ne,r[11]=y*R+_*k+x*N+I*le,r[15]=y*M+_*U+x*$+I*me,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],m=e[3],v=e[7],g=e[11],p=e[15];return m*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*f-n*l*f)+v*(+t*l*f-t*c*d+r*o*d-s*o*f+s*c*h-r*l*h)+g*(+t*c*u-t*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-s*a*h-t*l*u+t*a*d+s*o*u-n*o*d+n*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],m=e[12],v=e[13],g=e[14],p=e[15],y=u*g*c-v*d*c+v*l*f-a*g*f-u*l*p+a*d*p,_=m*d*c-h*g*c-m*l*f+o*g*f+h*l*p-o*d*p,x=h*v*c-m*u*c+m*a*f-o*v*f-h*a*p+o*u*p,I=m*u*l-h*v*l-m*a*d+o*v*d+h*a*g-o*u*g,T=t*y+n*_+s*x+r*I;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/T;return e[0]=y*S,e[1]=(v*d*r-u*g*r-v*s*f+n*g*f+u*s*p-n*d*p)*S,e[2]=(a*g*r-v*l*r+v*s*c-n*g*c-a*s*p+n*l*p)*S,e[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*f-n*l*f)*S,e[4]=_*S,e[5]=(h*g*r-m*d*r+m*s*f-t*g*f-h*s*p+t*d*p)*S,e[6]=(m*l*r-o*g*r-m*s*c+t*g*c+o*s*p-t*l*p)*S,e[7]=(o*d*r-h*l*r+h*s*c-t*d*c-o*s*f+t*l*f)*S,e[8]=x*S,e[9]=(m*u*r-h*v*r-m*n*f+t*v*f+h*n*p-t*u*p)*S,e[10]=(o*v*r-m*a*r+m*n*c-t*v*c-o*n*p+t*a*p)*S,e[11]=(h*a*r-o*u*r-h*n*c+t*u*c+o*n*f-t*a*f)*S,e[12]=I*S,e[13]=(h*v*s-m*u*s+m*n*d-t*v*d-h*n*g+t*u*g)*S,e[14]=(m*a*s-o*v*s-m*n*l+t*v*l+o*n*g-t*a*g)*S,e[15]=(o*u*s-h*a*s+h*n*l-t*u*l-o*n*d+t*a*d)*S,this}scale(e){let t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){let s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,m=r*u,v=o*h,g=o*u,p=a*u,y=l*c,_=l*h,x=l*u,I=n.x,T=n.y,S=n.z;return s[0]=(1-(v+p))*I,s[1]=(f+x)*I,s[2]=(m-_)*I,s[3]=0,s[4]=(f-x)*T,s[5]=(1-(d+p))*T,s[6]=(g+y)*T,s[7]=0,s[8]=(m+_)*S,s[9]=(g-y)*S,s[10]=(1-(d+v))*S,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){let s=this.elements,r=or.set(s[0],s[1],s[2]).length(),o=or.set(s[4],s[5],s[6]).length(),a=or.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],ni.copy(this);let c=1/r,h=1/o,u=1/a;return ni.elements[0]*=c,ni.elements[1]*=c,ni.elements[2]*=c,ni.elements[4]*=h,ni.elements[5]*=h,ni.elements[6]*=h,ni.elements[8]*=u,ni.elements[9]*=u,ni.elements[10]*=u,t.setFromRotationMatrix(ni),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=ki){let l=this.elements,c=2*r/(t-e),h=2*r/(n-s),u=(t+e)/(t-e),d=(n+s)/(n-s),f,m;if(a===ki)f=-(o+r)/(o-r),m=-2*o*r/(o-r);else if(a===Ia)f=-o/(o-r),m=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=ki){let l=this.elements,c=1/(t-e),h=1/(n-s),u=1/(o-r),d=(t+e)*c,f=(n+s)*h,m,v;if(a===ki)m=(o+r)*u,v=-2*u;else if(a===Ia)m=r*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=v,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},or=new C,ni=new Je,Ym=new C(0,0,0),Zm=new C(1,1,1),ji=new C,ta=new C,Fn=new C,Fd=new Je,Od=new $t,fn=class i{constructor(e=0,t=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(en(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-en(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(en(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-en(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(en(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-en(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Fd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Fd,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Od.setFromEuler(this),this.setFromQuaternion(Od,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};fn.DEFAULT_ORDER="XYZ";var Ua=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Km=0,zd=new C,ar=new $t,Ci=new Je,na=new C,io=new C,$m=new C,Jm=new $t,Gd=new C(1,0,0),Vd=new C(0,1,0),Wd=new C(0,0,1),Xd={type:"added"},jm={type:"removed"},lr={type:"childadded",child:null},pc={type:"childremoved",child:null},tn=class i extends as{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Km++}),this.uuid=Gs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let e=new C,t=new fn,n=new $t,s=new C(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Je},normalMatrix:{value:new rt}}),this.matrix=new Je,this.matrixWorld=new Je,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ua,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ar.setFromAxisAngle(e,t),this.quaternion.multiply(ar),this}rotateOnWorldAxis(e,t){return ar.setFromAxisAngle(e,t),this.quaternion.premultiply(ar),this}rotateX(e){return this.rotateOnAxis(Gd,e)}rotateY(e){return this.rotateOnAxis(Vd,e)}rotateZ(e){return this.rotateOnAxis(Wd,e)}translateOnAxis(e,t){return zd.copy(e).applyQuaternion(this.quaternion),this.position.add(zd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Gd,e)}translateY(e){return this.translateOnAxis(Vd,e)}translateZ(e){return this.translateOnAxis(Wd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ci.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?na.copy(e):na.set(e,t,n);let s=this.parent;this.updateWorldMatrix(!0,!1),io.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ci.lookAt(io,na,this.up):Ci.lookAt(na,io,this.up),this.quaternion.setFromRotationMatrix(Ci),s&&(Ci.extractRotation(s.matrixWorld),ar.setFromRotationMatrix(Ci),this.quaternion.premultiply(ar.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Xd),lr.child=e,this.dispatchEvent(lr),lr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(jm),pc.child=e,this.dispatchEvent(pc),pc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ci.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ci.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ci),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Xd),lr.child=e,this.dispatchEvent(lr),lr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(io,e,$m),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(io,Jm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){let n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),m=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let s=e.children[n];this.add(s.clone())}return this}};tn.DEFAULT_UP=new C(0,1,0);tn.DEFAULT_MATRIX_AUTO_UPDATE=!0;tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ii=new C,Pi=new C,mc=new C,Ii=new C,cr=new C,hr=new C,qd=new C,gc=new C,vc=new C,xc=new C,yc=new At,_c=new At,bc=new At,Ds=class i{constructor(e=new C,t=new C,n=new C){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),ii.subVectors(e,t),s.cross(ii);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){ii.subVectors(s,t),Pi.subVectors(n,t),mc.subVectors(e,t);let o=ii.dot(ii),a=ii.dot(Pi),l=ii.dot(mc),c=Pi.dot(Pi),h=Pi.dot(mc),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,m=(o*h-a*l)*d;return r.set(1-f-m,m,f)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Ii)===null?!1:Ii.x>=0&&Ii.y>=0&&Ii.x+Ii.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,Ii)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ii.x),l.addScaledVector(o,Ii.y),l.addScaledVector(a,Ii.z),l)}static getInterpolatedAttribute(e,t,n,s,r,o){return yc.setScalar(0),_c.setScalar(0),bc.setScalar(0),yc.fromBufferAttribute(e,t),_c.fromBufferAttribute(e,n),bc.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(yc,r.x),o.addScaledVector(_c,r.y),o.addScaledVector(bc,r.z),o}static isFrontFacing(e,t,n,s){return ii.subVectors(n,t),Pi.subVectors(e,t),ii.cross(Pi).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ii.subVectors(this.c,this.b),Pi.subVectors(this.a,this.b),ii.cross(Pi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return i.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,s=this.b,r=this.c,o,a;cr.subVectors(s,n),hr.subVectors(r,n),gc.subVectors(e,n);let l=cr.dot(gc),c=hr.dot(gc);if(l<=0&&c<=0)return t.copy(n);vc.subVectors(e,s);let h=cr.dot(vc),u=hr.dot(vc);if(h>=0&&u<=h)return t.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(cr,o);xc.subVectors(e,r);let f=cr.dot(xc),m=hr.dot(xc);if(m>=0&&f<=m)return t.copy(r);let v=f*c-l*m;if(v<=0&&c>=0&&m<=0)return a=c/(c-m),t.copy(n).addScaledVector(hr,a);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return qd.subVectors(r,s),a=(u-h)/(u-h+(f-m)),t.copy(s).addScaledVector(qd,a);let p=1/(g+v+d);return o=v*p,a=d*p,t.copy(n).addScaledVector(cr,o).addScaledVector(hr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},jf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qi={h:0,s:0,l:0},ia={h:0,s:0,l:0};function Mc(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}var ke=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ht){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,dt.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=dt.workingColorSpace){return this.r=e,this.g=t,this.b=n,dt.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=dt.workingColorSpace){if(e=Tu(e,1),t=en(t,0,1),n=en(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Mc(o,r,e+1/3),this.g=Mc(o,r,e),this.b=Mc(o,r,e-1/3)}return dt.toWorkingColorSpace(this,s),this}setStyle(e,t=ht){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ht){let n=jf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ui(e.r),this.g=Ui(e.g),this.b=Ui(e.b),this}copyLinearToSRGB(e){return this.r=br(e.r),this.g=br(e.g),this.b=br(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ht){return dt.fromWorkingColorSpace(vn.copy(this),e),Math.round(en(vn.r*255,0,255))*65536+Math.round(en(vn.g*255,0,255))*256+Math.round(en(vn.b*255,0,255))}getHexString(e=ht){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=dt.workingColorSpace){dt.fromWorkingColorSpace(vn.copy(this),t);let n=vn.r,s=vn.g,r=vn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=dt.workingColorSpace){return dt.fromWorkingColorSpace(vn.copy(this),t),e.r=vn.r,e.g=vn.g,e.b=vn.b,e}getStyle(e=ht){dt.fromWorkingColorSpace(vn.copy(this),e);let t=vn.r,n=vn.g,s=vn.b;return e!==ht?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Qi),this.setHSL(Qi.h+e,Qi.s+t,Qi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Qi),e.getHSL(ia);let n=fo(Qi.h,ia.h,t),s=fo(Qi.s,ia.s,t),r=fo(Qi.l,ia.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},vn=new ke;ke.NAMES=jf;var Qm=0,gi=class extends as{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qm++}),this.uuid=Gs(),this.name="",this.blending=yr,this.side=rs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Hc,this.blendDst=vo,this.blendEquation=Ls,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ke(0,0,0),this.blendAlpha=0,this.depthFunc=Er,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Rd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=tr,this.stencilZFail=tr,this.stencilZPass=tr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==yr&&(n.blending=this.blending),this.side!==rs&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Hc&&(n.blendSrc=this.blendSrc),this.blendDst!==vo&&(n.blendDst=this.blendDst),this.blendEquation!==Ls&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Er&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Rd&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==tr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==tr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==tr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}},ln=class extends gi{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.combine=gu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Zt=new C,sa=new ue,Ht=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Cd,this.updateRanges=[],this.gpuType=mi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)sa.fromBufferAttribute(this,t),sa.applyMatrix3(e),this.setXY(t,sa.x,sa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Zt.fromBufferAttribute(this,t),Zt.applyMatrix3(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Zt.fromBufferAttribute(this,t),Zt.applyMatrix4(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Zt.fromBufferAttribute(this,t),Zt.applyNormalMatrix(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Zt.fromBufferAttribute(this,t),Zt.transformDirection(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=gr(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Sn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=gr(t,this.array)),t}setX(e,t){return this.normalized&&(t=Sn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=gr(t,this.array)),t}setY(e,t){return this.normalized&&(t=Sn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=gr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Sn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=gr(t,this.array)),t}setW(e,t){return this.normalized&&(t=Sn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Sn(t,this.array),n=Sn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Sn(t,this.array),n=Sn(n,this.array),s=Sn(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Sn(t,this.array),n=Sn(n,this.array),s=Sn(s,this.array),r=Sn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Cd&&(e.usage=this.usage),e}};var Na=class extends Ht{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var Ba=class extends Ht{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Ye=class extends Ht{constructor(e,t,n){super(new Float32Array(e),t,n)}},eg=0,Wn=new Je,Ec=new tn,ur=new C,On=new Hi,so=new Hi,an=new C,xt=class i extends as{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:eg++}),this.uuid=Gs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Jf(e)?Ba:Na)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new rt().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Wn.makeRotationFromQuaternion(e),this.applyMatrix4(Wn),this}rotateX(e){return Wn.makeRotationX(e),this.applyMatrix4(Wn),this}rotateY(e){return Wn.makeRotationY(e),this.applyMatrix4(Wn),this}rotateZ(e){return Wn.makeRotationZ(e),this.applyMatrix4(Wn),this}translate(e,t,n){return Wn.makeTranslation(e,t,n),this.applyMatrix4(Wn),this}scale(e,t,n){return Wn.makeScale(e,t,n),this.applyMatrix4(Wn),this}lookAt(e){return Ec.lookAt(e),Ec.updateMatrix(),this.applyMatrix4(Ec.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ur).negate(),this.translate(ur.x,ur.y,ur.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let s=0,r=e.length;s<r;s++){let o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ye(n,3))}else{for(let n=0,s=t.count;n<s;n++){let r=e[n];t.setXYZ(n,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Hi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){let r=t[n];On.setFromBufferAttribute(r),this.morphTargetsRelative?(an.addVectors(this.boundingBox.min,On.min),this.boundingBox.expandByPoint(an),an.addVectors(this.boundingBox.max,On.max),this.boundingBox.expandByPoint(an)):(this.boundingBox.expandByPoint(On.min),this.boundingBox.expandByPoint(On.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){let n=this.boundingSphere.center;if(On.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];so.setFromBufferAttribute(a),this.morphTargetsRelative?(an.addVectors(On.min,so.min),On.expandByPoint(an),an.addVectors(On.max,so.max),On.expandByPoint(an)):(On.expandByPoint(so.min),On.expandByPoint(so.max))}On.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)an.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(an));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)an.fromBufferAttribute(a,c),l&&(ur.fromBufferAttribute(e,c),an.add(ur)),s=Math.max(s,n.distanceToSquared(an))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ht(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],l=[];for(let R=0;R<n.count;R++)a[R]=new C,l[R]=new C;let c=new C,h=new C,u=new C,d=new ue,f=new ue,m=new ue,v=new C,g=new C;function p(R,M,b){c.fromBufferAttribute(n,R),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,b),d.fromBufferAttribute(r,R),f.fromBufferAttribute(r,M),m.fromBufferAttribute(r,b),h.sub(c),u.sub(c),f.sub(d),m.sub(d);let P=1/(f.x*m.y-m.x*f.y);isFinite(P)&&(v.copy(h).multiplyScalar(m.y).addScaledVector(u,-f.y).multiplyScalar(P),g.copy(u).multiplyScalar(f.x).addScaledVector(h,-m.x).multiplyScalar(P),a[R].add(v),a[M].add(v),a[b].add(v),l[R].add(g),l[M].add(g),l[b].add(g))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let R=0,M=y.length;R<M;++R){let b=y[R],P=b.start,k=b.count;for(let U=P,H=P+k;U<H;U+=3)p(e.getX(U+0),e.getX(U+1),e.getX(U+2))}let _=new C,x=new C,I=new C,T=new C;function S(R){I.fromBufferAttribute(s,R),T.copy(I);let M=a[R];_.copy(M),_.sub(I.multiplyScalar(I.dot(M))).normalize(),x.crossVectors(T,M);let P=x.dot(l[R])<0?-1:1;o.setXYZW(R,_.x,_.y,_.z,P)}for(let R=0,M=y.length;R<M;++R){let b=y[R],P=b.start,k=b.count;for(let U=P,H=P+k;U<H;U+=3)S(e.getX(U+0)),S(e.getX(U+1)),S(e.getX(U+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ht(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new C,r=new C,o=new C,a=new C,l=new C,c=new C,h=new C,u=new C;if(e)for(let d=0,f=e.count;d<f;d+=3){let m=e.getX(d+0),v=e.getX(d+1),g=e.getX(d+2);s.fromBufferAttribute(t,m),r.fromBufferAttribute(t,v),o.fromBufferAttribute(t,g),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)an.fromBufferAttribute(e,t),an.normalize(),e.setXYZ(t,an.x,an.y,an.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,m=0;for(let v=0,g=l.length;v<g;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new Ht(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone(t));let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Yd=new Je,As=new yo,ra=new Fi,Zd=new C,oa=new C,aa=new C,la=new C,wc=new C,ca=new C,Kd=new C,ha=new C,D=class extends tn{constructor(e=new xt,t=new ln){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);let a=this.morphTargetInfluences;if(r&&a){ca.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(wc.fromBufferAttribute(u,e),o?ca.addScaledVector(wc,h):ca.addScaledVector(wc.sub(t),h))}t.add(ca)}return t}raycast(e,t){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ra.copy(n.boundingSphere),ra.applyMatrix4(r),As.copy(e.ray).recast(e.near),!(ra.containsPoint(As.origin)===!1&&(As.intersectSphere(ra,Zd)===null||As.origin.distanceToSquared(Zd)>(e.far-e.near)**2))&&(Yd.copy(r).invert(),As.copy(e.ray).applyMatrix4(Yd),!(n.boundingBox!==null&&As.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,As)))}_computeIntersections(e,t,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,v=d.length;m<v;m++){let g=d[m],p=o[g.materialIndex],y=Math.max(g.start,f.start),_=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let x=y,I=_;x<I;x+=3){let T=a.getX(x),S=a.getX(x+1),R=a.getX(x+2);s=ua(this,p,e,n,c,h,u,T,S,R),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){let y=a.getX(g),_=a.getX(g+1),x=a.getX(g+2);s=ua(this,o,e,n,c,h,u,y,_,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,v=d.length;m<v;m++){let g=d[m],p=o[g.materialIndex],y=Math.max(g.start,f.start),_=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let x=y,I=_;x<I;x+=3){let T=x,S=x+1,R=x+2;s=ua(this,p,e,n,c,h,u,T,S,R),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,t.push(s))}}else{let m=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let g=m,p=v;g<p;g+=3){let y=g,_=g+1,x=g+2;s=ua(this,o,e,n,c,h,u,y,_,x),s&&(s.faceIndex=Math.floor(g/3),t.push(s))}}}};function tg(i,e,t,n,s,r,o,a){let l;if(e.side===xn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===rs,a),l===null)return null;ha.copy(a),ha.applyMatrix4(i.matrixWorld);let c=t.ray.origin.distanceTo(ha);return c<t.near||c>t.far?null:{distance:c,point:ha.clone(),object:i}}function ua(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,oa),i.getVertexPosition(l,aa),i.getVertexPosition(c,la);let h=tg(i,e,t,n,oa,aa,la,Kd);if(h){let u=new C;Ds.getBarycoord(Kd,oa,aa,la,u),s&&(h.uv=Ds.getInterpolatedAttribute(s,a,l,c,u,new ue)),r&&(h.uv1=Ds.getInterpolatedAttribute(r,a,l,c,u,new ue)),o&&(h.normal=Ds.getInterpolatedAttribute(o,a,l,c,u,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new C,materialIndex:0};Ds.getNormal(oa,aa,la,d.normal),h.face=d,h.barycoord=u}return h}var Fe=class i extends xt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,t,e,o,r,0),m("z","y","x",1,-1,n,t,-e,o,r,1),m("x","z","y",1,1,e,n,t,s,o,2),m("x","z","y",1,-1,e,n,-t,s,o,3),m("x","y","z",1,-1,e,t,n,s,r,4),m("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Ye(c,3)),this.setAttribute("normal",new Ye(h,3)),this.setAttribute("uv",new Ye(u,2));function m(v,g,p,y,_,x,I,T,S,R,M){let b=x/S,P=I/R,k=x/2,U=I/2,H=T/2,G=S+1,N=R+1,$=0,z=0,ne=new C;for(let le=0;le<N;le++){let me=le*P-U;for(let Ie=0;Ie<G;Ie++){let Ke=Ie*b-k;ne[v]=Ke*y,ne[g]=me*_,ne[p]=H,c.push(ne.x,ne.y,ne.z),ne[v]=0,ne[g]=0,ne[p]=T>0?1:-1,h.push(ne.x,ne.y,ne.z),u.push(Ie/S),u.push(1-le/R),$+=1}}for(let le=0;le<R;le++)for(let me=0;me<S;me++){let Ie=d+me+G*le,Ke=d+me+G*(le+1),Z=d+(me+1)+G*(le+1),fe=d+(me+1)+G*le;l.push(Ie,Ke,fe),l.push(Ke,Z,fe),z+=6}a.addGroup(f,z,M),f+=z,d+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Cr(i){let e={};for(let t in i){e[t]={};for(let n in i[t]){let s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Tn(i){let e={};for(let t=0;t<i.length;t++){let n=Cr(i[t]);for(let s in n)e[s]=n[s]}return e}function ng(i){let e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Qf(i){let e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:dt.workingColorSpace}var ig={clone:Cr,merge:Tn},sg=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,rg=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Xt=class extends gi{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sg,this.fragmentShader=rg,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Cr(e.uniforms),this.uniformsGroups=ng(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},Ha=class extends tn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Je,this.projectionMatrix=new Je,this.projectionMatrixInverse=new Je,this.coordinateSystem=ki}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},es=new C,$d=new ue,Jd=new ue,Kt=class extends Ha{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Rr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(uo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Rr*2*Math.atan(Math.tan(uo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){es.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(es.x,es.y).multiplyScalar(-e/es.z),es.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(es.x,es.y).multiplyScalar(-e/es.z)}getViewSize(e,t){return this.getViewBounds(e,$d,Jd),t.subVectors(Jd,$d)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(uo*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},dr=-90,fr=1,Sh=class extends tn{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Kt(dr,fr,e,t);s.layers=this.layers,this.add(s);let r=new Kt(dr,fr,e,t);r.layers=this.layers,this.add(r);let o=new Kt(dr,fr,e,t);o.layers=this.layers,this.add(o);let a=new Kt(dr,fr,e,t);a.layers=this.layers,this.add(a);let l=new Kt(dr,fr,e,t);l.layers=this.layers,this.add(l);let c=new Kt(dr,fr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===ki)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ia)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},Fa=class extends Rn{constructor(e,t,n,s,r,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:wr,super(e,t,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Th=class extends Xn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Fa(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:zn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Fe(5,5,5),r=new Xt({name:"CubemapFromEquirect",uniforms:Cr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:xn,blending:ns});r.uniforms.tEquirect.value=t;let o=new D(s,r),a=t.minFilter;return t.minFilter===Ns&&(t.minFilter=zn),new Sh(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}},Sc=new C,og=new C,ag=new rt,Di=class{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let s=Sc.subVectors(n,t).cross(og.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(Sc),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||ag.getNormalMatrix(e),s=this.coplanarPoint(Sc).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Rs=new Fi,da=new C,_o=class{constructor(e=new Di,t=new Di,n=new Di,s=new Di,r=new Di,o=new Di){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=ki){let n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],f=s[8],m=s[9],v=s[10],g=s[11],p=s[12],y=s[13],_=s[14],x=s[15];if(n[0].setComponents(l-r,d-c,g-f,x-p).normalize(),n[1].setComponents(l+r,d+c,g+f,x+p).normalize(),n[2].setComponents(l+o,d+h,g+m,x+y).normalize(),n[3].setComponents(l-o,d-h,g-m,x-y).normalize(),n[4].setComponents(l-a,d-u,g-v,x-_).normalize(),t===ki)n[5].setComponents(l+a,d+u,g+v,x+_).normalize();else if(t===Ia)n[5].setComponents(a,u,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Rs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Rs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Rs)}intersectsSprite(e){return Rs.center.set(0,0,0),Rs.radius=.7071067811865476,Rs.applyMatrix4(e.matrixWorld),this.intersectsSphere(Rs)}intersectsSphere(e){let t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let s=t[n];if(da.x=s.normal.x>0?e.max.x:e.min.x,da.y=s.normal.y>0?e.max.y:e.min.y,da.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(da)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function ep(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function lg(i){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,a),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,m)=>f.start-m.start);let d=0;for(let f=1;f<u.length;f++){let m=u[d],v=u[f];v.start<=m.start+m.count+1?m.count=Math.max(m.count,v.start+v.count-m.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,m=u.length;f<m;f++){let v=u[f];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var $e=class i extends xt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=e/a,d=t/l,f=[],m=[],v=[],g=[];for(let p=0;p<h;p++){let y=p*d-o;for(let _=0;_<c;_++){let x=_*u-r;m.push(x,-y,0),v.push(0,0,1),g.push(_/a),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<a;y++){let _=y+c*p,x=y+c*(p+1),I=y+1+c*(p+1),T=y+1+c*p;f.push(_,x,T),f.push(x,I,T)}this.setIndex(f),this.setAttribute("position",new Ye(m,3)),this.setAttribute("normal",new Ye(v,3)),this.setAttribute("uv",new Ye(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.width,e.height,e.widthSegments,e.heightSegments)}},cg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hg=`#ifdef USE_ALPHAHASH
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
#endif`,ug=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,dg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,pg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,mg=`#ifdef USE_AOMAP
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
#endif`,gg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,vg=`#ifdef USE_BATCHING
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
#endif`,xg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_g=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bg=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Mg=`#ifdef USE_IRIDESCENCE
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
#endif`,Eg=`#ifdef USE_BUMPMAP
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
#endif`,wg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Sg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ag=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Rg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Pg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ig=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Lg=`#define PI 3.141592653589793
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
} // validated`,Dg=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,kg=`vec3 transformedNormal = objectNormal;
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
#endif`,Ug=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ng=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Fg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Og=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zg=`#ifdef USE_ENVMAP
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
#endif`,Gg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Vg=`#ifdef USE_ENVMAP
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
#endif`,Wg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xg=`#ifdef USE_ENVMAP
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
#endif`,qg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$g=`#ifdef USE_GRADIENTMAP
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
}`,Jg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Qg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ev=`uniform bool receiveShadow;
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
#endif`,tv=`#ifdef USE_ENVMAP
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
#endif`,nv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,iv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,sv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ov=`PhysicalMaterial material;
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
#endif`,av=`struct PhysicalMaterial {
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
}`,lv=`
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
#endif`,cv=`#if defined( RE_IndirectDiffuse )
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
#endif`,hv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,uv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,dv=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,mv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,gv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,vv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,xv=`#if defined( USE_POINTS_UV )
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
#endif`,yv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_v=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bv=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Mv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ev=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wv=`#ifdef USE_MORPHTARGETS
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
#endif`,Sv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Av=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Rv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Iv=`#ifdef USE_NORMALMAP
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
#endif`,Lv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Dv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,kv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Uv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Nv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Hv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Fv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ov=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Vv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Wv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Xv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,qv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Yv=`float getShadowMask() {
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
}`,Zv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Kv=`#ifdef USE_SKINNING
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
#endif`,$v=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jv=`#ifdef USE_SKINNING
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
#endif`,jv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Qv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ex=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,nx=`#ifdef USE_TRANSMISSION
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
#endif`,ix=`#ifdef USE_TRANSMISSION
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
#endif`,sx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ox=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ax=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,lx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,cx=`uniform sampler2D t2D;
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
}`,hx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ux=`#ifdef ENVMAP_TYPE_CUBE
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
}`,dx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,px=`#include <common>
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
}`,mx=`#if DEPTH_PACKING == 3200
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
}`,gx=`#define DISTANCE
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
}`,vx=`#define DISTANCE
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
}`,xx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_x=`uniform float scale;
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
}`,bx=`uniform vec3 diffuse;
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
}`,Mx=`#include <common>
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
}`,Ex=`uniform vec3 diffuse;
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
}`,wx=`#define LAMBERT
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
}`,Sx=`#define LAMBERT
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
}`,Tx=`#define MATCAP
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
}`,Ax=`#define MATCAP
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
}`,Rx=`#define NORMAL
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
}`,Cx=`#define NORMAL
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
}`,Px=`#define PHONG
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
}`,Ix=`#define PHONG
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
}`,Lx=`#define STANDARD
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
}`,Dx=`#define STANDARD
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
}`,kx=`#define TOON
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
}`,Ux=`#define TOON
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
}`,Nx=`uniform float size;
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
}`,Bx=`uniform vec3 diffuse;
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
}`,Hx=`#include <common>
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
}`,Fx=`uniform vec3 color;
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
}`,Ox=`uniform float rotation;
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
}`,zx=`uniform vec3 diffuse;
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
}`,at={alphahash_fragment:cg,alphahash_pars_fragment:hg,alphamap_fragment:ug,alphamap_pars_fragment:dg,alphatest_fragment:fg,alphatest_pars_fragment:pg,aomap_fragment:mg,aomap_pars_fragment:gg,batching_pars_vertex:vg,batching_vertex:xg,begin_vertex:yg,beginnormal_vertex:_g,bsdfs:bg,iridescence_fragment:Mg,bumpmap_pars_fragment:Eg,clipping_planes_fragment:wg,clipping_planes_pars_fragment:Sg,clipping_planes_pars_vertex:Tg,clipping_planes_vertex:Ag,color_fragment:Rg,color_pars_fragment:Cg,color_pars_vertex:Pg,color_vertex:Ig,common:Lg,cube_uv_reflection_fragment:Dg,defaultnormal_vertex:kg,displacementmap_pars_vertex:Ug,displacementmap_vertex:Ng,emissivemap_fragment:Bg,emissivemap_pars_fragment:Hg,colorspace_fragment:Fg,colorspace_pars_fragment:Og,envmap_fragment:zg,envmap_common_pars_fragment:Gg,envmap_pars_fragment:Vg,envmap_pars_vertex:Wg,envmap_physical_pars_fragment:tv,envmap_vertex:Xg,fog_vertex:qg,fog_pars_vertex:Yg,fog_fragment:Zg,fog_pars_fragment:Kg,gradientmap_pars_fragment:$g,lightmap_pars_fragment:Jg,lights_lambert_fragment:jg,lights_lambert_pars_fragment:Qg,lights_pars_begin:ev,lights_toon_fragment:nv,lights_toon_pars_fragment:iv,lights_phong_fragment:sv,lights_phong_pars_fragment:rv,lights_physical_fragment:ov,lights_physical_pars_fragment:av,lights_fragment_begin:lv,lights_fragment_maps:cv,lights_fragment_end:hv,logdepthbuf_fragment:uv,logdepthbuf_pars_fragment:dv,logdepthbuf_pars_vertex:fv,logdepthbuf_vertex:pv,map_fragment:mv,map_pars_fragment:gv,map_particle_fragment:vv,map_particle_pars_fragment:xv,metalnessmap_fragment:yv,metalnessmap_pars_fragment:_v,morphinstance_vertex:bv,morphcolor_vertex:Mv,morphnormal_vertex:Ev,morphtarget_pars_vertex:wv,morphtarget_vertex:Sv,normal_fragment_begin:Tv,normal_fragment_maps:Av,normal_pars_fragment:Rv,normal_pars_vertex:Cv,normal_vertex:Pv,normalmap_pars_fragment:Iv,clearcoat_normal_fragment_begin:Lv,clearcoat_normal_fragment_maps:Dv,clearcoat_pars_fragment:kv,iridescence_pars_fragment:Uv,opaque_fragment:Nv,packing:Bv,premultiplied_alpha_fragment:Hv,project_vertex:Fv,dithering_fragment:Ov,dithering_pars_fragment:zv,roughnessmap_fragment:Gv,roughnessmap_pars_fragment:Vv,shadowmap_pars_fragment:Wv,shadowmap_pars_vertex:Xv,shadowmap_vertex:qv,shadowmask_pars_fragment:Yv,skinbase_vertex:Zv,skinning_pars_vertex:Kv,skinning_vertex:$v,skinnormal_vertex:Jv,specularmap_fragment:jv,specularmap_pars_fragment:Qv,tonemapping_fragment:ex,tonemapping_pars_fragment:tx,transmission_fragment:nx,transmission_pars_fragment:ix,uv_pars_fragment:sx,uv_pars_vertex:rx,uv_vertex:ox,worldpos_vertex:ax,background_vert:lx,background_frag:cx,backgroundCube_vert:hx,backgroundCube_frag:ux,cube_vert:dx,cube_frag:fx,depth_vert:px,depth_frag:mx,distanceRGBA_vert:gx,distanceRGBA_frag:vx,equirect_vert:xx,equirect_frag:yx,linedashed_vert:_x,linedashed_frag:bx,meshbasic_vert:Mx,meshbasic_frag:Ex,meshlambert_vert:wx,meshlambert_frag:Sx,meshmatcap_vert:Tx,meshmatcap_frag:Ax,meshnormal_vert:Rx,meshnormal_frag:Cx,meshphong_vert:Px,meshphong_frag:Ix,meshphysical_vert:Lx,meshphysical_frag:Dx,meshtoon_vert:kx,meshtoon_frag:Ux,points_vert:Nx,points_frag:Bx,shadow_vert:Hx,shadow_frag:Fx,sprite_vert:Ox,sprite_frag:zx},Se={common:{diffuse:{value:new ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new rt},alphaMap:{value:null},alphaMapTransform:{value:new rt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new rt}},envmap:{envMap:{value:null},envMapRotation:{value:new rt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new rt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new rt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new rt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new rt},normalScale:{value:new ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new rt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new rt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new rt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new rt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new rt},alphaTest:{value:0},uvTransform:{value:new rt}},sprite:{diffuse:{value:new ke(16777215)},opacity:{value:1},center:{value:new ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new rt},alphaMap:{value:null},alphaMapTransform:{value:new rt},alphaTest:{value:0}}},pi={basic:{uniforms:Tn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.fog]),vertexShader:at.meshbasic_vert,fragmentShader:at.meshbasic_frag},lambert:{uniforms:Tn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new ke(0)}}]),vertexShader:at.meshlambert_vert,fragmentShader:at.meshlambert_frag},phong:{uniforms:Tn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new ke(0)},specular:{value:new ke(1118481)},shininess:{value:30}}]),vertexShader:at.meshphong_vert,fragmentShader:at.meshphong_frag},standard:{uniforms:Tn([Se.common,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.roughnessmap,Se.metalnessmap,Se.fog,Se.lights,{emissive:{value:new ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:at.meshphysical_vert,fragmentShader:at.meshphysical_frag},toon:{uniforms:Tn([Se.common,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.gradientmap,Se.fog,Se.lights,{emissive:{value:new ke(0)}}]),vertexShader:at.meshtoon_vert,fragmentShader:at.meshtoon_frag},matcap:{uniforms:Tn([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,{matcap:{value:null}}]),vertexShader:at.meshmatcap_vert,fragmentShader:at.meshmatcap_frag},points:{uniforms:Tn([Se.points,Se.fog]),vertexShader:at.points_vert,fragmentShader:at.points_frag},dashed:{uniforms:Tn([Se.common,Se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:at.linedashed_vert,fragmentShader:at.linedashed_frag},depth:{uniforms:Tn([Se.common,Se.displacementmap]),vertexShader:at.depth_vert,fragmentShader:at.depth_frag},normal:{uniforms:Tn([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,{opacity:{value:1}}]),vertexShader:at.meshnormal_vert,fragmentShader:at.meshnormal_frag},sprite:{uniforms:Tn([Se.sprite,Se.fog]),vertexShader:at.sprite_vert,fragmentShader:at.sprite_frag},background:{uniforms:{uvTransform:{value:new rt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:at.background_vert,fragmentShader:at.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new rt}},vertexShader:at.backgroundCube_vert,fragmentShader:at.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:at.cube_vert,fragmentShader:at.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:at.equirect_vert,fragmentShader:at.equirect_frag},distanceRGBA:{uniforms:Tn([Se.common,Se.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:at.distanceRGBA_vert,fragmentShader:at.distanceRGBA_frag},shadow:{uniforms:Tn([Se.lights,Se.fog,{color:{value:new ke(0)},opacity:{value:1}}]),vertexShader:at.shadow_vert,fragmentShader:at.shadow_frag}};pi.physical={uniforms:Tn([pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new rt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new rt},clearcoatNormalScale:{value:new ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new rt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new rt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new rt},sheen:{value:0},sheenColor:{value:new ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new rt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new rt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new rt},transmissionSamplerSize:{value:new ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new rt},attenuationDistance:{value:0},attenuationColor:{value:new ke(0)},specularColor:{value:new ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new rt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new rt},anisotropyVector:{value:new ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new rt}}]),vertexShader:at.meshphysical_vert,fragmentShader:at.meshphysical_frag};var fa={r:0,b:0,g:0},Cs=new fn,Gx=new Je;function Vx(i,e,t,n,s,r,o){let a=new ke(0),l=r===!0?0:1,c,h,u=null,d=0,f=null;function m(y){let _=y.isScene===!0?y.background:null;return _&&_.isTexture&&(_=(y.backgroundBlurriness>0?t:e).get(_)),_}function v(y){let _=!1,x=m(y);x===null?p(a,l):x&&x.isColor&&(p(x,1),_=!0);let I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,o):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(y,_){let x=m(_);x&&(x.isCubeTexture||x.mapping===nl)?(h===void 0&&(h=new D(new Fe(1,1,1),new Xt({name:"BackgroundCubeMaterial",uniforms:Cr(pi.backgroundCube.uniforms),vertexShader:pi.backgroundCube.vertexShader,fragmentShader:pi.backgroundCube.fragmentShader,side:xn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,T,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Cs.copy(_.backgroundRotation),Cs.x*=-1,Cs.y*=-1,Cs.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Cs.y*=-1,Cs.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Gx.makeRotationFromEuler(Cs)),h.material.toneMapped=dt.getTransfer(x.colorSpace)!==Tt,(u!==x||d!==x.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,f=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new D(new $e(2,2),new Xt({name:"BackgroundMaterial",uniforms:Cr(pi.background.uniforms),vertexShader:pi.background.vertexShader,fragmentShader:pi.background.fragmentShader,side:rs,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=dt.getTransfer(x.colorSpace)!==Tt,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=x,d=x.version,f=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,_){y.getRGB(fa,Qf(i)),n.buffers.color.setClear(fa.r,fa.g,fa.b,_,o)}return{getClearColor:function(){return a},setClearColor:function(y,_=1){a.set(y),l=_,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(a,l)},render:v,addToRenderList:g}}function Wx(i,e){let t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),r=s,o=!1;function a(b,P,k,U,H){let G=!1,N=u(U,k,P);r!==N&&(r=N,c(r.object)),G=f(b,U,k,H),G&&m(b,U,k,H),H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(G||o)&&(o=!1,x(b,P,k,U),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return i.createVertexArray()}function c(b){return i.bindVertexArray(b)}function h(b){return i.deleteVertexArray(b)}function u(b,P,k){let U=k.wireframe===!0,H=n[b.id];H===void 0&&(H={},n[b.id]=H);let G=H[P.id];G===void 0&&(G={},H[P.id]=G);let N=G[U];return N===void 0&&(N=d(l()),G[U]=N),N}function d(b){let P=[],k=[],U=[];for(let H=0;H<t;H++)P[H]=0,k[H]=0,U[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:k,attributeDivisors:U,object:b,attributes:{},index:null}}function f(b,P,k,U){let H=r.attributes,G=P.attributes,N=0,$=k.getAttributes();for(let z in $)if($[z].location>=0){let le=H[z],me=G[z];if(me===void 0&&(z==="instanceMatrix"&&b.instanceMatrix&&(me=b.instanceMatrix),z==="instanceColor"&&b.instanceColor&&(me=b.instanceColor)),le===void 0||le.attribute!==me||me&&le.data!==me.data)return!0;N++}return r.attributesNum!==N||r.index!==U}function m(b,P,k,U){let H={},G=P.attributes,N=0,$=k.getAttributes();for(let z in $)if($[z].location>=0){let le=G[z];le===void 0&&(z==="instanceMatrix"&&b.instanceMatrix&&(le=b.instanceMatrix),z==="instanceColor"&&b.instanceColor&&(le=b.instanceColor));let me={};me.attribute=le,le&&le.data&&(me.data=le.data),H[z]=me,N++}r.attributes=H,r.attributesNum=N,r.index=U}function v(){let b=r.newAttributes;for(let P=0,k=b.length;P<k;P++)b[P]=0}function g(b){p(b,0)}function p(b,P){let k=r.newAttributes,U=r.enabledAttributes,H=r.attributeDivisors;k[b]=1,U[b]===0&&(i.enableVertexAttribArray(b),U[b]=1),H[b]!==P&&(i.vertexAttribDivisor(b,P),H[b]=P)}function y(){let b=r.newAttributes,P=r.enabledAttributes;for(let k=0,U=P.length;k<U;k++)P[k]!==b[k]&&(i.disableVertexAttribArray(k),P[k]=0)}function _(b,P,k,U,H,G,N){N===!0?i.vertexAttribIPointer(b,P,k,H,G):i.vertexAttribPointer(b,P,k,U,H,G)}function x(b,P,k,U){v();let H=U.attributes,G=k.getAttributes(),N=P.defaultAttributeValues;for(let $ in G){let z=G[$];if(z.location>=0){let ne=H[$];if(ne===void 0&&($==="instanceMatrix"&&b.instanceMatrix&&(ne=b.instanceMatrix),$==="instanceColor"&&b.instanceColor&&(ne=b.instanceColor)),ne!==void 0){let le=ne.normalized,me=ne.itemSize,Ie=e.get(ne);if(Ie===void 0)continue;let Ke=Ie.buffer,Z=Ie.type,fe=Ie.bytesPerElement,ve=Z===i.INT||Z===i.UNSIGNED_INT||ne.gpuType===xu;if(ne.isInterleavedBufferAttribute){let ce=ne.data,be=ce.stride,Oe=ne.offset;if(ce.isInstancedInterleavedBuffer){for(let qe=0;qe<z.locationSize;qe++)p(z.location+qe,ce.meshPerAttribute);b.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let qe=0;qe<z.locationSize;qe++)g(z.location+qe);i.bindBuffer(i.ARRAY_BUFFER,Ke);for(let qe=0;qe<z.locationSize;qe++)_(z.location+qe,me/z.locationSize,Z,le,be*fe,(Oe+me/z.locationSize*qe)*fe,ve)}else{if(ne.isInstancedBufferAttribute){for(let ce=0;ce<z.locationSize;ce++)p(z.location+ce,ne.meshPerAttribute);b.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let ce=0;ce<z.locationSize;ce++)g(z.location+ce);i.bindBuffer(i.ARRAY_BUFFER,Ke);for(let ce=0;ce<z.locationSize;ce++)_(z.location+ce,me/z.locationSize,Z,le,me*fe,me/z.locationSize*ce*fe,ve)}}else if(N!==void 0){let le=N[$];if(le!==void 0)switch(le.length){case 2:i.vertexAttrib2fv(z.location,le);break;case 3:i.vertexAttrib3fv(z.location,le);break;case 4:i.vertexAttrib4fv(z.location,le);break;default:i.vertexAttrib1fv(z.location,le)}}}}y()}function I(){R();for(let b in n){let P=n[b];for(let k in P){let U=P[k];for(let H in U)h(U[H].object),delete U[H];delete P[k]}delete n[b]}}function T(b){if(n[b.id]===void 0)return;let P=n[b.id];for(let k in P){let U=P[k];for(let H in U)h(U[H].object),delete U[H];delete P[k]}delete n[b.id]}function S(b){for(let P in n){let k=n[P];if(k[b.id]===void 0)continue;let U=k[b.id];for(let H in U)h(U[H].object),delete U[H];delete k[b.id]}}function R(){M(),o=!0,r!==s&&(r=s,c(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:R,resetDefaultState:M,dispose:I,releaseStatesOfGeometry:T,releaseStatesOfProgram:S,initAttributes:v,enableAttribute:g,disableUnusedAttributes:y}}function Xx(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),t.update(h,n,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let m=0;m<u;m++)f+=h[m];t.update(f,n,1)}function l(c,h,u,d){if(u===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<c.length;m++)o(c[m],h[m],d[m]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let m=0;for(let v=0;v<u;v++)m+=h[v]*d[v];t.update(m,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function qx(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let S=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(S){return!(S!==si&&n.convert(S)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(S){let R=S===cs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(S!==Bi&&n.convert(S)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&S!==mi&&!R)}function l(S){if(S==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),y=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),_=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=m>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:v,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:y,maxVaryings:_,maxFragmentUniforms:x,vertexTextures:I,maxSamples:T}}function Yx(i){let e=this,t=null,n=0,s=!1,r=!1,o=new Di,a=new rt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,v=u.clipIntersection,g=u.clipShadows,p=i.get(u);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{let y=r?0:n,_=y*4,x=p.clippingState||null;l.value=x,x=h(m,d,_,f);for(let I=0;I!==_;++I)x[I]=t[I];p.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,m){let v=u!==null?u.length:0,g=null;if(v!==0){if(g=l.value,m!==!0||g===null){let p=f+v*4,y=d.matrixWorldInverse;a.getNormalMatrix(y),(g===null||g.length<p)&&(g=new Float32Array(p));for(let _=0,x=f;_!==v;++_,x+=4)o.copy(u[_]).applyMatrix4(y,a),o.normal.toArray(g,x),g[x+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}function Zx(i){let e=new WeakMap;function t(o,a){return a===qc?o.mapping=wr:a===Yc&&(o.mapping=Sr),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===qc||a===Yc)if(e.has(o)){let l=e.get(o).texture;return t(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Th(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Pr=class extends Ha{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},vr=4,jd=[.125,.215,.35,.446,.526,.582],ks=20,Tc=new Pr,Qd=new ke,Ac=null,Rc=0,Cc=0,Pc=!1,Is=(1+Math.sqrt(5))/2,pr=1/Is,ef=[new C(-Is,pr,0),new C(Is,pr,0),new C(-pr,0,Is),new C(pr,0,Is),new C(0,Is,-pr),new C(0,Is,pr),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)],Ir=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Ac=this._renderer.getRenderTarget(),Rc=this._renderer.getActiveCubeFace(),Cc=this._renderer.getActiveMipmapLevel(),Pc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=sf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=nf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ac,Rc,Cc),this._renderer.xr.enabled=Pc,e.scissorTest=!1,pa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===wr||e.mapping===Sr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ac=this._renderer.getRenderTarget(),Rc=this._renderer.getActiveCubeFace(),Cc=this._renderer.getActiveMipmapLevel(),Pc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:zn,minFilter:zn,generateMipmaps:!1,type:cs,format:si,colorSpace:Nr,depthBuffer:!1},s=tf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=tf(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Kx(r)),this._blurMaterial=$x(r,e,t)}return s}_compileMaterial(e){let t=new D(this._lodPlanes[0],e);this._renderer.compile(t,Tc)}_sceneToCubeUV(e,t,n,s){let a=new Kt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Qd),h.toneMapping=is,h.autoClear=!1;let f=new ln({name:"PMREM.Background",side:xn,depthWrite:!1,depthTest:!1}),m=new D(new Fe,f),v=!1,g=e.background;g?g.isColor&&(f.color.copy(g),e.background=null,v=!0):(f.color.copy(Qd),v=!0);for(let p=0;p<6;p++){let y=p%3;y===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):y===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));let _=this._cubeSize;pa(s,y*_,p>2?_:0,_,_),h.setRenderTarget(s),v&&h.render(m,a),h.render(e,a)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=u,e.background=g}_textureToCubeUV(e,t){let n=this._renderer,s=e.mapping===wr||e.mapping===Sr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=sf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=nf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new D(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;pa(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Tc)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let r=1;r<s;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=ef[(s-r-1)%ef.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new D(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ks-1),v=r/m,g=isFinite(r)?1+Math.floor(h*v):ks;g>ks&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${ks}`);let p=[],y=0;for(let S=0;S<ks;++S){let R=S/v,M=Math.exp(-R*R/2);p.push(M),S===0?y+=M:S<g&&(y+=2*M)}for(let S=0;S<p.length;S++)p[S]=p[S]/y;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:_}=this;d.dTheta.value=m,d.mipInt.value=_-n;let x=this._sizeLods[s],I=3*x*(s>_-vr?s-_+vr:0),T=4*(this._cubeSize-x);pa(t,I,T,3*x,2*x),l.setRenderTarget(t),l.render(u,Tc)}};function Kx(i){let e=[],t=[],n=[],s=i,r=i-vr+1+jd.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);t.push(a);let l=1/a;o>i-vr?l=jd[o-i+vr-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,v=3,g=2,p=1,y=new Float32Array(v*m*f),_=new Float32Array(g*m*f),x=new Float32Array(p*m*f);for(let T=0;T<f;T++){let S=T%3*2/3-1,R=T>2?0:-1,M=[S,R,0,S+2/3,R,0,S+2/3,R+1,0,S,R,0,S+2/3,R+1,0,S,R+1,0];y.set(M,v*m*T),_.set(d,g*m*T);let b=[T,T,T,T,T,T];x.set(b,p*m*T)}let I=new xt;I.setAttribute("position",new Ht(y,v)),I.setAttribute("uv",new Ht(_,g)),I.setAttribute("faceIndex",new Ht(x,p)),e.push(I),s>vr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function tf(i,e,t){let n=new Xn(i,e,t);return n.texture.mapping=nl,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function pa(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function $x(i,e,t){let n=new Float32Array(ks),s=new C(0,1,0);return new Xt({name:"SphericalGaussianBlur",defines:{n:ks,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Au(),fragmentShader:`

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
		`,blending:ns,depthTest:!1,depthWrite:!1})}function nf(){return new Xt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Au(),fragmentShader:`

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
		`,blending:ns,depthTest:!1,depthWrite:!1})}function sf(){return new Xt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Au(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ns,depthTest:!1,depthWrite:!1})}function Au(){return`

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
	`}function Jx(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===qc||l===Yc,h=l===wr||l===Sr;if(c||h){let u=e.get(a),d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new Ir(i)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{let f=a.image;return c&&f&&f.height>0||h&&f&&s(f)?(t===null&&(t=new Ir(i)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function jx(i){let e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let s=t(n);return s===null&&co("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Qx(i,e,t,n){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let m in d.attributes)e.remove(d.attributes[m]);for(let m in d.morphAttributes){let v=d.morphAttributes[m];for(let g=0,p=v.length;g<p;g++)e.remove(v[g])}d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let m in d)e.update(d[m],i.ARRAY_BUFFER);let f=u.morphAttributes;for(let m in f){let v=f[m];for(let g=0,p=v.length;g<p;g++)e.update(v[g],i.ARRAY_BUFFER)}}function c(u){let d=[],f=u.index,m=u.attributes.position,v=0;if(f!==null){let y=f.array;v=f.version;for(let _=0,x=y.length;_<x;_+=3){let I=y[_+0],T=y[_+1],S=y[_+2];d.push(I,T,T,S,S,I)}}else if(m!==void 0){let y=m.array;v=m.version;for(let _=0,x=y.length/3-1;_<x;_+=3){let I=_+0,T=_+1,S=_+2;d.push(I,T,T,S,S,I)}}else return;let g=new(Jf(d)?Ba:Na)(d,1);g.version=v;let p=r.get(u);p&&e.remove(p),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function ey(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*o),t.update(f,n,1)}function c(d,f,m){m!==0&&(i.drawElementsInstanced(n,f,r,d*o,m),t.update(f,n,m))}function h(d,f,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,m);let g=0;for(let p=0;p<m;p++)g+=f[p];t.update(g,n,1)}function u(d,f,m,v){if(m===0)return;let g=e.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],v[p]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,v,0,m);let p=0;for(let y=0;y<m;y++)p+=f[y]*v[y];t.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function ty(i){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function ny(i,e,t){let n=new WeakMap,s=new At;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let M=function(){S.dispose(),n.delete(a),a.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],y=a.morphAttributes.color||[],_=0;f===!0&&(_=1),m===!0&&(_=2),v===!0&&(_=3);let x=a.attributes.position.count*_,I=1;x>e.maxTextureSize&&(I=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let T=new Float32Array(x*I*4*u),S=new ka(T,x,I,u);S.type=mi,S.needsUpdate=!0;let R=_*4;for(let b=0;b<u;b++){let P=g[b],k=p[b],U=y[b],H=x*I*4*b;for(let G=0;G<P.count;G++){let N=G*R;f===!0&&(s.fromBufferAttribute(P,G),T[H+N+0]=s.x,T[H+N+1]=s.y,T[H+N+2]=s.z,T[H+N+3]=0),m===!0&&(s.fromBufferAttribute(k,G),T[H+N+4]=s.x,T[H+N+5]=s.y,T[H+N+6]=s.z,T[H+N+7]=0),v===!0&&(s.fromBufferAttribute(U,G),T[H+N+8]=s.x,T[H+N+9]=s.y,T[H+N+10]=s.z,T[H+N+11]=U.itemSize===4?s.w:1)}}d={count:u,texture:S,size:new ue(x,I)},n.set(a,d),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];let m=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function iy(i,e,t,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}var Oa=class extends Rn{constructor(e,t,n,s,r,o,a,l,c,h=_r){if(h!==_r&&h!==Ar)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===_r&&(n=Bs),n===void 0&&h===Ar&&(n=Tr),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:An,this.minFilter=l!==void 0?l:An,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},tp=new Rn,rf=new Oa(1,1),np=new ka,ip=new wh,sp=new Fa,of=[],af=[],lf=new Float32Array(16),cf=new Float32Array(9),hf=new Float32Array(4);function Hr(i,e,t){let n=i[0];if(n<=0||n>0)return i;let s=e*t,r=of[s];if(r===void 0&&(r=new Float32Array(s),of[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function nn(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function sn(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function sl(i,e){let t=af[e];t===void 0&&(t=new Int32Array(e),af[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function sy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function ry(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(nn(t,e))return;i.uniform2fv(this.addr,e),sn(t,e)}}function oy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(nn(t,e))return;i.uniform3fv(this.addr,e),sn(t,e)}}function ay(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(nn(t,e))return;i.uniform4fv(this.addr,e),sn(t,e)}}function ly(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(nn(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),sn(t,e)}else{if(nn(t,n))return;hf.set(n),i.uniformMatrix2fv(this.addr,!1,hf),sn(t,n)}}function cy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(nn(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),sn(t,e)}else{if(nn(t,n))return;cf.set(n),i.uniformMatrix3fv(this.addr,!1,cf),sn(t,n)}}function hy(i,e){let t=this.cache,n=e.elements;if(n===void 0){if(nn(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),sn(t,e)}else{if(nn(t,n))return;lf.set(n),i.uniformMatrix4fv(this.addr,!1,lf),sn(t,n)}}function uy(i,e){let t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function dy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(nn(t,e))return;i.uniform2iv(this.addr,e),sn(t,e)}}function fy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(nn(t,e))return;i.uniform3iv(this.addr,e),sn(t,e)}}function py(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(nn(t,e))return;i.uniform4iv(this.addr,e),sn(t,e)}}function my(i,e){let t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function gy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(nn(t,e))return;i.uniform2uiv(this.addr,e),sn(t,e)}}function vy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(nn(t,e))return;i.uniform3uiv(this.addr,e),sn(t,e)}}function xy(i,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(nn(t,e))return;i.uniform4uiv(this.addr,e),sn(t,e)}}function yy(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(rf.compareFunction=Kf,r=rf):r=tp,t.setTexture2D(e||r,s)}function _y(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||ip,s)}function by(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||sp,s)}function My(i,e,t){let n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||np,s)}function Ey(i){switch(i){case 5126:return sy;case 35664:return ry;case 35665:return oy;case 35666:return ay;case 35674:return ly;case 35675:return cy;case 35676:return hy;case 5124:case 35670:return uy;case 35667:case 35671:return dy;case 35668:case 35672:return fy;case 35669:case 35673:return py;case 5125:return my;case 36294:return gy;case 36295:return vy;case 36296:return xy;case 35678:case 36198:case 36298:case 36306:case 35682:return yy;case 35679:case 36299:case 36307:return _y;case 35680:case 36300:case 36308:case 36293:return by;case 36289:case 36303:case 36311:case 36292:return My}}function wy(i,e){i.uniform1fv(this.addr,e)}function Sy(i,e){let t=Hr(e,this.size,2);i.uniform2fv(this.addr,t)}function Ty(i,e){let t=Hr(e,this.size,3);i.uniform3fv(this.addr,t)}function Ay(i,e){let t=Hr(e,this.size,4);i.uniform4fv(this.addr,t)}function Ry(i,e){let t=Hr(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Cy(i,e){let t=Hr(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Py(i,e){let t=Hr(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Iy(i,e){i.uniform1iv(this.addr,e)}function Ly(i,e){i.uniform2iv(this.addr,e)}function Dy(i,e){i.uniform3iv(this.addr,e)}function ky(i,e){i.uniform4iv(this.addr,e)}function Uy(i,e){i.uniform1uiv(this.addr,e)}function Ny(i,e){i.uniform2uiv(this.addr,e)}function By(i,e){i.uniform3uiv(this.addr,e)}function Hy(i,e){i.uniform4uiv(this.addr,e)}function Fy(i,e,t){let n=this.cache,s=e.length,r=sl(t,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||tp,r[o])}function Oy(i,e,t){let n=this.cache,s=e.length,r=sl(t,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||ip,r[o])}function zy(i,e,t){let n=this.cache,s=e.length,r=sl(t,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||sp,r[o])}function Gy(i,e,t){let n=this.cache,s=e.length,r=sl(t,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||np,r[o])}function Vy(i){switch(i){case 5126:return wy;case 35664:return Sy;case 35665:return Ty;case 35666:return Ay;case 35674:return Ry;case 35675:return Cy;case 35676:return Py;case 5124:case 35670:return Iy;case 35667:case 35671:return Ly;case 35668:case 35672:return Dy;case 35669:case 35673:return ky;case 5125:return Uy;case 36294:return Ny;case 36295:return By;case 36296:return Hy;case 35678:case 36198:case 36298:case 36306:case 35682:return Fy;case 35679:case 36299:case 36307:return Oy;case 35680:case 36300:case 36308:case 36293:return zy;case 36289:case 36303:case 36311:case 36292:return Gy}}var Ah=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ey(t.type)}},Rh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Vy(t.type)}},Ch=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(e,t[a.id],n)}}},Ic=/(\w+)(\])?(\[|\.)?/g;function uf(i,e){i.seq.push(e),i.map[e.id]=e}function Wy(i,e,t){let n=i.name,s=n.length;for(Ic.lastIndex=0;;){let r=Ic.exec(n),o=Ic.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){uf(t,c===void 0?new Ah(a,i,e):new Rh(a,i,e));break}else{let u=t.map[a];u===void 0&&(u=new Ch(a),uf(t,u)),t=u}}}var Mr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Wy(r,o,this)}}setValue(e,t,n,s){let r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){let s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){let n=[];for(let s=0,r=e.length;s!==r;++s){let o=e[s];o.id in t&&n.push(o)}return n}};function df(i,e,t){let n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}var Xy=37297,qy=0;function Yy(i,e){let t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var ff=new rt;function Zy(i){dt._getMatrix(ff,dt.workingColorSpace,i);let e=`mat3( ${ff.elements.map(t=>t.toFixed(4))} )`;switch(dt.getTransfer(i)){case il:return[e,"LinearTransferOETF"];case Tt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function pf(i,e,t){let n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Yy(i.getShaderSource(e),o)}else return s}function Ky(i,e){let t=Zy(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function $y(i,e){let t;switch(e){case am:t="Linear";break;case lm:t="Reinhard";break;case cm:t="Cineon";break;case vu:t="ACESFilmic";break;case um:t="AgX";break;case dm:t="Neutral";break;case hm:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var ma=new C;function Jy(){dt.getLuminanceCoefficients(ma);let i=ma.x.toFixed(4),e=ma.y.toFixed(4),t=ma.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function jy(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ho).join(`
`)}function Qy(i){let e=[];for(let t in i){let n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function e1(i,e){let t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(e,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function ho(i){return i!==""}function mf(i,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function gf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var t1=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ph(i){return i.replace(t1,i1)}var n1=new Map;function i1(i,e){let t=at[e];if(t===void 0){let n=n1.get(e);if(n!==void 0)t=at[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ph(t)}var s1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function vf(i){return i.replace(s1,r1)}function r1(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function xf(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function o1(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Hf?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===fu?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Li&&(e="SHADOWMAP_TYPE_VSM"),e}function a1(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case wr:case Sr:e="ENVMAP_TYPE_CUBE";break;case nl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function l1(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Sr:e="ENVMAP_MODE_REFRACTION";break}return e}function c1(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case gu:e="ENVMAP_BLENDING_MULTIPLY";break;case rm:e="ENVMAP_BLENDING_MIX";break;case om:e="ENVMAP_BLENDING_ADD";break}return e}function h1(i){let e=i.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function u1(i,e,t,n){let s=i.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=o1(t),c=a1(t),h=l1(t),u=c1(t),d=h1(t),f=jy(t),m=Qy(r),v=s.createProgram(),g,p,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(ho).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(ho).join(`
`),p.length>0&&(p+=`
`)):(g=[xf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ho).join(`
`),p=[xf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==is?"#define TONE_MAPPING":"",t.toneMapping!==is?at.tonemapping_pars_fragment:"",t.toneMapping!==is?$y("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",at.colorspace_pars_fragment,Ky("linearToOutputTexel",t.outputColorSpace),Jy(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ho).join(`
`)),o=Ph(o),o=mf(o,t),o=gf(o,t),a=Ph(a),a=mf(a,t),a=gf(a,t),o=vf(o),a=vf(a),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",t.glslVersion===Pd?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Pd?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let _=y+g+o,x=y+p+a,I=df(s,s.VERTEX_SHADER,_),T=df(s,s.FRAGMENT_SHADER,x);s.attachShader(v,I),s.attachShader(v,T),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function S(P){if(i.debug.checkShaderErrors){let k=s.getProgramInfoLog(v).trim(),U=s.getShaderInfoLog(I).trim(),H=s.getShaderInfoLog(T).trim(),G=!0,N=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(G=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,I,T);else{let $=pf(s,I,"vertex"),z=pf(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+k+`
`+$+`
`+z)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(U===""||H==="")&&(N=!1);N&&(P.diagnostics={runnable:G,programLog:k,vertexShader:{log:U,prefix:g},fragmentShader:{log:H,prefix:p}})}s.deleteShader(I),s.deleteShader(T),R=new Mr(s,v),M=e1(s,v)}let R;this.getUniforms=function(){return R===void 0&&S(this),R};let M;this.getAttributes=function(){return M===void 0&&S(this),M};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(v,Xy)),b},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=qy++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=I,this.fragmentShader=T,this}var d1=0,Ih=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Lh(e),t.set(e,n)),n}},Lh=class{constructor(e){this.id=d1++,this.code=e,this.usedTimes=0}};function f1(i,e,t,n,s,r,o){let a=new Ua,l=new Ih,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return c.add(M),M===0?"uv":`uv${M}`}function g(M,b,P,k,U){let H=k.fog,G=U.geometry,N=M.isMeshStandardMaterial?k.environment:null,$=(M.isMeshStandardMaterial?t:e).get(M.envMap||N),z=$&&$.mapping===nl?$.image.height:null,ne=m[M.type];M.precision!==null&&(f=s.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));let le=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,me=le!==void 0?le.length:0,Ie=0;G.morphAttributes.position!==void 0&&(Ie=1),G.morphAttributes.normal!==void 0&&(Ie=2),G.morphAttributes.color!==void 0&&(Ie=3);let Ke,Z,fe,ve;if(ne){let wt=pi[ne];Ke=wt.vertexShader,Z=wt.fragmentShader}else Ke=M.vertexShader,Z=M.fragmentShader,l.update(M),fe=l.getVertexShaderID(M),ve=l.getFragmentShaderID(M);let ce=i.getRenderTarget(),be=i.state.buffers.depth.getReversed(),Oe=U.isInstancedMesh===!0,qe=U.isBatchedMesh===!0,tt=!!M.map,se=!!M.matcap,he=!!$,L=!!M.aoMap,Ne=!!M.lightMap,W=!!M.bumpMap,X=!!M.normalMap,j=!!M.displacementMap,xe=!!M.emissiveMap,pe=!!M.metalnessMap,A=!!M.roughnessMap,E=M.anisotropy>0,V=M.clearcoat>0,Q=M.dispersion>0,re=M.iridescence>0,te=M.sheen>0,He=M.transmission>0,Ee=E&&!!M.anisotropyMap,Re=V&&!!M.clearcoatMap,lt=V&&!!M.clearcoatNormalMap,ge=V&&!!M.clearcoatRoughnessMap,Be=re&&!!M.iridescenceMap,K=re&&!!M.iridescenceThicknessMap,de=te&&!!M.sheenColorMap,ie=te&&!!M.sheenRoughnessMap,Ae=!!M.specularMap,Le=!!M.specularColorMap,nt=!!M.specularIntensityMap,B=He&&!!M.transmissionMap,Te=He&&!!M.thicknessMap,J=!!M.gradientMap,oe=!!M.alphaMap,De=M.alphaTest>0,Ce=!!M.alphaHash,it=!!M.extensions,Ot=is;M.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(Ot=i.toneMapping);let mn={shaderID:ne,shaderType:M.type,shaderName:M.name,vertexShader:Ke,fragmentShader:Z,defines:M.defines,customVertexShaderID:fe,customFragmentShaderID:ve,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:qe,batchingColor:qe&&U._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&U.instanceColor!==null,instancingMorph:Oe&&U.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ce===null?i.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:Nr,alphaToCoverage:!!M.alphaToCoverage,map:tt,matcap:se,envMap:he,envMapMode:he&&$.mapping,envMapCubeUVHeight:z,aoMap:L,lightMap:Ne,bumpMap:W,normalMap:X,displacementMap:d&&j,emissiveMap:xe,normalMapObjectSpace:X&&M.normalMapType===gm,normalMapTangentSpace:X&&M.normalMapType===Su,metalnessMap:pe,roughnessMap:A,anisotropy:E,anisotropyMap:Ee,clearcoat:V,clearcoatMap:Re,clearcoatNormalMap:lt,clearcoatRoughnessMap:ge,dispersion:Q,iridescence:re,iridescenceMap:Be,iridescenceThicknessMap:K,sheen:te,sheenColorMap:de,sheenRoughnessMap:ie,specularMap:Ae,specularColorMap:Le,specularIntensityMap:nt,transmission:He,transmissionMap:B,thicknessMap:Te,gradientMap:J,opaque:M.transparent===!1&&M.blending===yr&&M.alphaToCoverage===!1,alphaMap:oe,alphaTest:De,alphaHash:Ce,combine:M.combine,mapUv:tt&&v(M.map.channel),aoMapUv:L&&v(M.aoMap.channel),lightMapUv:Ne&&v(M.lightMap.channel),bumpMapUv:W&&v(M.bumpMap.channel),normalMapUv:X&&v(M.normalMap.channel),displacementMapUv:j&&v(M.displacementMap.channel),emissiveMapUv:xe&&v(M.emissiveMap.channel),metalnessMapUv:pe&&v(M.metalnessMap.channel),roughnessMapUv:A&&v(M.roughnessMap.channel),anisotropyMapUv:Ee&&v(M.anisotropyMap.channel),clearcoatMapUv:Re&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:lt&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ge&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Be&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:K&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:de&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:ie&&v(M.sheenRoughnessMap.channel),specularMapUv:Ae&&v(M.specularMap.channel),specularColorMapUv:Le&&v(M.specularColorMap.channel),specularIntensityMapUv:nt&&v(M.specularIntensityMap.channel),transmissionMapUv:B&&v(M.transmissionMap.channel),thicknessMapUv:Te&&v(M.thicknessMap.channel),alphaMapUv:oe&&v(M.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(X||E),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!G.attributes.uv&&(tt||oe),fog:!!H,useFog:M.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:be,skinning:U.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:me,morphTextureStride:Ie,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ot,decodeVideoTexture:tt&&M.map.isVideoTexture===!0&&dt.getTransfer(M.map.colorSpace)===Tt,decodeVideoTextureEmissive:xe&&M.emissiveMap.isVideoTexture===!0&&dt.getTransfer(M.emissiveMap.colorSpace)===Tt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===ft,flipSided:M.side===xn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:it&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(it&&M.extensions.multiDraw===!0||qe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return mn.vertexUv1s=c.has(1),mn.vertexUv2s=c.has(2),mn.vertexUv3s=c.has(3),c.clear(),mn}function p(M){let b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(let P in M.defines)b.push(P),b.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(y(b,M),_(b,M),b.push(i.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function y(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function _(M,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),M.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reverseDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),M.push(a.mask)}function x(M){let b=m[M.type],P;if(b){let k=pi[b];P=ig.clone(k.uniforms)}else P=M.uniforms;return P}function I(M,b){let P;for(let k=0,U=h.length;k<U;k++){let H=h[k];if(H.cacheKey===b){P=H,++P.usedTimes;break}}return P===void 0&&(P=new u1(i,b,M,r),h.push(P)),P}function T(M){if(--M.usedTimes===0){let b=h.indexOf(M);h[b]=h[h.length-1],h.pop(),M.destroy()}}function S(M){l.remove(M)}function R(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:x,acquireProgram:I,releaseProgram:T,releaseShaderCache:S,programs:h,dispose:R}}function p1(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function m1(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function yf(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function _f(){let i=[],e=0,t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u,d,f,m,v,g){let p=i[e];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:v,group:g},i[e]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=v,p.group=g),e++,p}function a(u,d,f,m,v,g){let p=o(u,d,f,m,v,g);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):t.push(p)}function l(u,d,f,m,v,g){let p=o(u,d,f,m,v,g);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function c(u,d){t.length>1&&t.sort(u||m1),n.length>1&&n.sort(d||yf),s.length>1&&s.sort(d||yf)}function h(){for(let u=e,d=i.length;u<d;u++){let f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function g1(){let i=new WeakMap;function e(n,s){let r=i.get(n),o;return r===void 0?(o=new _f,i.set(n,[o])):s>=r.length?(o=new _f,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function v1(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new ke};break;case"SpotLight":t={position:new C,direction:new C,color:new ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new ke,groundColor:new ke};break;case"RectAreaLight":t={color:new ke,position:new C,halfWidth:new C,halfHeight:new C};break}return i[e.id]=t,t}}}function x1(){let i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}var y1=0;function _1(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function b1(i){let e=new v1,t=x1(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);let s=new C,r=new Je,o=new Je;function a(c){let h=0,u=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let f=0,m=0,v=0,g=0,p=0,y=0,_=0,x=0,I=0,T=0,S=0;c.sort(_1);for(let M=0,b=c.length;M<b;M++){let P=c[M],k=P.color,U=P.intensity,H=P.distance,G=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=k.r*U,u+=k.g*U,d+=k.b*U;else if(P.isLightProbe){for(let N=0;N<9;N++)n.probe[N].addScaledVector(P.sh.coefficients[N],U);S++}else if(P.isDirectionalLight){let N=e.get(P);if(N.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let $=P.shadow,z=t.get(P);z.shadowIntensity=$.intensity,z.shadowBias=$.bias,z.shadowNormalBias=$.normalBias,z.shadowRadius=$.radius,z.shadowMapSize=$.mapSize,n.directionalShadow[f]=z,n.directionalShadowMap[f]=G,n.directionalShadowMatrix[f]=P.shadow.matrix,y++}n.directional[f]=N,f++}else if(P.isSpotLight){let N=e.get(P);N.position.setFromMatrixPosition(P.matrixWorld),N.color.copy(k).multiplyScalar(U),N.distance=H,N.coneCos=Math.cos(P.angle),N.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),N.decay=P.decay,n.spot[v]=N;let $=P.shadow;if(P.map&&(n.spotLightMap[I]=P.map,I++,$.updateMatrices(P),P.castShadow&&T++),n.spotLightMatrix[v]=$.matrix,P.castShadow){let z=t.get(P);z.shadowIntensity=$.intensity,z.shadowBias=$.bias,z.shadowNormalBias=$.normalBias,z.shadowRadius=$.radius,z.shadowMapSize=$.mapSize,n.spotShadow[v]=z,n.spotShadowMap[v]=G,x++}v++}else if(P.isRectAreaLight){let N=e.get(P);N.color.copy(k).multiplyScalar(U),N.halfWidth.set(P.width*.5,0,0),N.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=N,g++}else if(P.isPointLight){let N=e.get(P);if(N.color.copy(P.color).multiplyScalar(P.intensity),N.distance=P.distance,N.decay=P.decay,P.castShadow){let $=P.shadow,z=t.get(P);z.shadowIntensity=$.intensity,z.shadowBias=$.bias,z.shadowNormalBias=$.normalBias,z.shadowRadius=$.radius,z.shadowMapSize=$.mapSize,z.shadowCameraNear=$.camera.near,z.shadowCameraFar=$.camera.far,n.pointShadow[m]=z,n.pointShadowMap[m]=G,n.pointShadowMatrix[m]=P.shadow.matrix,_++}n.point[m]=N,m++}else if(P.isHemisphereLight){let N=e.get(P);N.skyColor.copy(P.color).multiplyScalar(U),N.groundColor.copy(P.groundColor).multiplyScalar(U),n.hemi[p]=N,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Se.LTC_FLOAT_1,n.rectAreaLTC2=Se.LTC_FLOAT_2):(n.rectAreaLTC1=Se.LTC_HALF_1,n.rectAreaLTC2=Se.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let R=n.hash;(R.directionalLength!==f||R.pointLength!==m||R.spotLength!==v||R.rectAreaLength!==g||R.hemiLength!==p||R.numDirectionalShadows!==y||R.numPointShadows!==_||R.numSpotShadows!==x||R.numSpotMaps!==I||R.numLightProbes!==S)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=x+I-T,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=S,R.directionalLength=f,R.pointLength=m,R.spotLength=v,R.rectAreaLength=g,R.hemiLength=p,R.numDirectionalShadows=y,R.numPointShadows=_,R.numSpotShadows=x,R.numSpotMaps=I,R.numLightProbes=S,n.version=y1++)}function l(c,h){let u=0,d=0,f=0,m=0,v=0,g=h.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){let _=c[p];if(_.isDirectionalLight){let x=n.directional[u];x.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),u++}else if(_.isSpotLight){let x=n.spot[f];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),f++}else if(_.isRectAreaLight){let x=n.rectArea[m];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(g),o.identity(),r.copy(_.matrixWorld),r.premultiply(g),o.extractRotation(r),x.halfWidth.set(_.width*.5,0,0),x.halfHeight.set(0,_.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),m++}else if(_.isPointLight){let x=n.point[d];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(g),d++}else if(_.isHemisphereLight){let x=n.hemi[v];x.direction.setFromMatrixPosition(_.matrixWorld),x.direction.transformDirection(g),v++}}}return{setup:a,setupView:l,state:n}}function bf(i){let e=new b1(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function M1(i){let e=new WeakMap;function t(s,r=0){let o=e.get(s),a;return o===void 0?(a=new bf(i),e.set(s,[a])):r>=o.length?(a=new bf(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var Dh=class extends gi{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=pm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},kh=class extends gi{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}},E1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,w1=`uniform sampler2D shadow_pass;
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
}`;function S1(i,e,t){let n=new _o,s=new ue,r=new ue,o=new At,a=new Dh({depthPacking:mm}),l=new kh,c={},h=t.maxTextureSize,u={[rs]:xn,[xn]:rs,[ft]:ft},d=new Xt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ue},radius:{value:4}},vertexShader:E1,fragmentShader:w1}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new xt;m.setAttribute("position",new Ht(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new D(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Hf;let p=this.type;this.render=function(T,S,R){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;let M=i.getRenderTarget(),b=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),k=i.state;k.setBlending(ns),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let U=p!==Li&&this.type===Li,H=p===Li&&this.type!==Li;for(let G=0,N=T.length;G<N;G++){let $=T[G],z=$.shadow;if(z===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);let ne=z.getFrameExtents();if(s.multiply(ne),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ne.x),s.x=r.x*ne.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ne.y),s.y=r.y*ne.y,z.mapSize.y=r.y)),z.map===null||U===!0||H===!0){let me=this.type!==Li?{minFilter:An,magFilter:An}:{};z.map!==null&&z.map.dispose(),z.map=new Xn(s.x,s.y,me),z.map.texture.name=$.name+".shadowMap",z.camera.updateProjectionMatrix()}i.setRenderTarget(z.map),i.clear();let le=z.getViewportCount();for(let me=0;me<le;me++){let Ie=z.getViewport(me);o.set(r.x*Ie.x,r.y*Ie.y,r.x*Ie.z,r.y*Ie.w),k.viewport(o),z.updateMatrices($,me),n=z.getFrustum(),x(S,R,z.camera,$,this.type)}z.isPointLightShadow!==!0&&this.type===Li&&y(z,R),z.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(M,b,P)};function y(T,S){let R=e.update(v);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Xn(s.x,s.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(S,null,R,d,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(S,null,R,f,v,null)}function _(T,S,R,M){let b=null,P=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(P!==void 0)b=P;else if(b=R.isPointLight===!0?l:a,i.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){let k=b.uuid,U=S.uuid,H=c[k];H===void 0&&(H={},c[k]=H);let G=H[U];G===void 0&&(G=b.clone(),H[U]=G,S.addEventListener("dispose",I)),b=G}if(b.visible=S.visible,b.wireframe=S.wireframe,M===Li?b.side=S.shadowSide!==null?S.shadowSide:S.side:b.side=S.shadowSide!==null?S.shadowSide:u[S.side],b.alphaMap=S.alphaMap,b.alphaTest=S.alphaTest,b.map=S.map,b.clipShadows=S.clipShadows,b.clippingPlanes=S.clippingPlanes,b.clipIntersection=S.clipIntersection,b.displacementMap=S.displacementMap,b.displacementScale=S.displacementScale,b.displacementBias=S.displacementBias,b.wireframeLinewidth=S.wireframeLinewidth,b.linewidth=S.linewidth,R.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let k=i.properties.get(b);k.light=R}return b}function x(T,S,R,M,b){if(T.visible===!1)return;if(T.layers.test(S.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===Li)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);let U=e.update(T),H=T.material;if(Array.isArray(H)){let G=U.groups;for(let N=0,$=G.length;N<$;N++){let z=G[N],ne=H[z.materialIndex];if(ne&&ne.visible){let le=_(T,ne,M,b);T.onBeforeShadow(i,T,S,R,U,le,z),i.renderBufferDirect(R,null,U,le,T,z),T.onAfterShadow(i,T,S,R,U,le,z)}}}else if(H.visible){let G=_(T,H,M,b);T.onBeforeShadow(i,T,S,R,U,G,null),i.renderBufferDirect(R,null,U,G,T,null),T.onAfterShadow(i,T,S,R,U,G,null)}}let k=T.children;for(let U=0,H=k.length;U<H;U++)x(k[U],S,R,M,b)}function I(T){T.target.removeEventListener("dispose",I);for(let R in c){let M=c[R],b=T.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}var T1={[Fc]:Oc,[zc]:Wc,[Gc]:Xc,[Er]:Vc,[Oc]:Fc,[Wc]:zc,[Xc]:Gc,[Vc]:Er};function A1(i,e){function t(){let B=!1,Te=new At,J=null,oe=new At(0,0,0,0);return{setMask:function(De){J!==De&&!B&&(i.colorMask(De,De,De,De),J=De)},setLocked:function(De){B=De},setClear:function(De,Ce,it,Ot,mn){mn===!0&&(De*=Ot,Ce*=Ot,it*=Ot),Te.set(De,Ce,it,Ot),oe.equals(Te)===!1&&(i.clearColor(De,Ce,it,Ot),oe.copy(Te))},reset:function(){B=!1,J=null,oe.set(-1,0,0,0)}}}function n(){let B=!1,Te=!1,J=null,oe=null,De=null;return{setReversed:function(Ce){if(Te!==Ce){let it=e.get("EXT_clip_control");Te?it.clipControlEXT(it.LOWER_LEFT_EXT,it.ZERO_TO_ONE_EXT):it.clipControlEXT(it.LOWER_LEFT_EXT,it.NEGATIVE_ONE_TO_ONE_EXT);let Ot=De;De=null,this.setClear(Ot)}Te=Ce},getReversed:function(){return Te},setTest:function(Ce){Ce?ce(i.DEPTH_TEST):be(i.DEPTH_TEST)},setMask:function(Ce){J!==Ce&&!B&&(i.depthMask(Ce),J=Ce)},setFunc:function(Ce){if(Te&&(Ce=T1[Ce]),oe!==Ce){switch(Ce){case Fc:i.depthFunc(i.NEVER);break;case Oc:i.depthFunc(i.ALWAYS);break;case zc:i.depthFunc(i.LESS);break;case Er:i.depthFunc(i.LEQUAL);break;case Gc:i.depthFunc(i.EQUAL);break;case Vc:i.depthFunc(i.GEQUAL);break;case Wc:i.depthFunc(i.GREATER);break;case Xc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}oe=Ce}},setLocked:function(Ce){B=Ce},setClear:function(Ce){De!==Ce&&(Te&&(Ce=1-Ce),i.clearDepth(Ce),De=Ce)},reset:function(){B=!1,J=null,oe=null,De=null,Te=!1}}}function s(){let B=!1,Te=null,J=null,oe=null,De=null,Ce=null,it=null,Ot=null,mn=null;return{setTest:function(wt){B||(wt?ce(i.STENCIL_TEST):be(i.STENCIL_TEST))},setMask:function(wt){Te!==wt&&!B&&(i.stencilMask(wt),Te=wt)},setFunc:function(wt,Qn,Si){(J!==wt||oe!==Qn||De!==Si)&&(i.stencilFunc(wt,Qn,Si),J=wt,oe=Qn,De=Si)},setOp:function(wt,Qn,Si){(Ce!==wt||it!==Qn||Ot!==Si)&&(i.stencilOp(wt,Qn,Si),Ce=wt,it=Qn,Ot=Si)},setLocked:function(wt){B=wt},setClear:function(wt){mn!==wt&&(i.clearStencil(wt),mn=wt)},reset:function(){B=!1,Te=null,J=null,oe=null,De=null,Ce=null,it=null,Ot=null,mn=null}}}let r=new t,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},u={},d=new WeakMap,f=[],m=null,v=!1,g=null,p=null,y=null,_=null,x=null,I=null,T=null,S=new ke(0,0,0),R=0,M=!1,b=null,P=null,k=null,U=null,H=null,G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,$=0,z=i.getParameter(i.VERSION);z.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(z)[1]),N=$>=1):z.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),N=$>=2);let ne=null,le={},me=i.getParameter(i.SCISSOR_BOX),Ie=i.getParameter(i.VIEWPORT),Ke=new At().fromArray(me),Z=new At().fromArray(Ie);function fe(B,Te,J,oe){let De=new Uint8Array(4),Ce=i.createTexture();i.bindTexture(B,Ce),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let it=0;it<J;it++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(Te,0,i.RGBA,1,1,oe,0,i.RGBA,i.UNSIGNED_BYTE,De):i.texImage2D(Te+it,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,De);return Ce}let ve={};ve[i.TEXTURE_2D]=fe(i.TEXTURE_2D,i.TEXTURE_2D,1),ve[i.TEXTURE_CUBE_MAP]=fe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ve[i.TEXTURE_2D_ARRAY]=fe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ve[i.TEXTURE_3D]=fe(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ce(i.DEPTH_TEST),o.setFunc(Er),W(!1),X(Md),ce(i.CULL_FACE),L(ns);function ce(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function be(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function Oe(B,Te){return u[B]!==Te?(i.bindFramebuffer(B,Te),u[B]=Te,B===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=Te),B===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=Te),!0):!1}function qe(B,Te){let J=f,oe=!1;if(B){J=d.get(Te),J===void 0&&(J=[],d.set(Te,J));let De=B.textures;if(J.length!==De.length||J[0]!==i.COLOR_ATTACHMENT0){for(let Ce=0,it=De.length;Ce<it;Ce++)J[Ce]=i.COLOR_ATTACHMENT0+Ce;J.length=De.length,oe=!0}}else J[0]!==i.BACK&&(J[0]=i.BACK,oe=!0);oe&&i.drawBuffers(J)}function tt(B){return m!==B?(i.useProgram(B),m=B,!0):!1}let se={[Ls]:i.FUNC_ADD,[V0]:i.FUNC_SUBTRACT,[W0]:i.FUNC_REVERSE_SUBTRACT};se[X0]=i.MIN,se[q0]=i.MAX;let he={[Y0]:i.ZERO,[mu]:i.ONE,[Z0]:i.SRC_COLOR,[Hc]:i.SRC_ALPHA,[em]:i.SRC_ALPHA_SATURATE,[j0]:i.DST_COLOR,[$0]:i.DST_ALPHA,[K0]:i.ONE_MINUS_SRC_COLOR,[vo]:i.ONE_MINUS_SRC_ALPHA,[Q0]:i.ONE_MINUS_DST_COLOR,[J0]:i.ONE_MINUS_DST_ALPHA,[tm]:i.CONSTANT_COLOR,[nm]:i.ONE_MINUS_CONSTANT_COLOR,[im]:i.CONSTANT_ALPHA,[sm]:i.ONE_MINUS_CONSTANT_ALPHA};function L(B,Te,J,oe,De,Ce,it,Ot,mn,wt){if(B===ns){v===!0&&(be(i.BLEND),v=!1);return}if(v===!1&&(ce(i.BLEND),v=!0),B!==pu){if(B!==g||wt!==M){if((p!==Ls||x!==Ls)&&(i.blendEquation(i.FUNC_ADD),p=Ls,x=Ls),wt)switch(B){case yr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case os:i.blendFunc(i.ONE,i.ONE);break;case Ed:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wd:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case yr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case os:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Ed:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wd:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}y=null,_=null,I=null,T=null,S.set(0,0,0),R=0,g=B,M=wt}return}De=De||Te,Ce=Ce||J,it=it||oe,(Te!==p||De!==x)&&(i.blendEquationSeparate(se[Te],se[De]),p=Te,x=De),(J!==y||oe!==_||Ce!==I||it!==T)&&(i.blendFuncSeparate(he[J],he[oe],he[Ce],he[it]),y=J,_=oe,I=Ce,T=it),(Ot.equals(S)===!1||mn!==R)&&(i.blendColor(Ot.r,Ot.g,Ot.b,mn),S.copy(Ot),R=mn),g=B,M=!1}function Ne(B,Te){B.side===ft?be(i.CULL_FACE):ce(i.CULL_FACE);let J=B.side===xn;Te&&(J=!J),W(J),B.blending===yr&&B.transparent===!1?L(ns):L(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),r.setMask(B.colorWrite);let oe=B.stencilWrite;a.setTest(oe),oe&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),xe(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?ce(i.SAMPLE_ALPHA_TO_COVERAGE):be(i.SAMPLE_ALPHA_TO_COVERAGE)}function W(B){b!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),b=B)}function X(B){B!==z0?(ce(i.CULL_FACE),B!==P&&(B===Md?i.cullFace(i.BACK):B===G0?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):be(i.CULL_FACE),P=B}function j(B){B!==k&&(N&&i.lineWidth(B),k=B)}function xe(B,Te,J){B?(ce(i.POLYGON_OFFSET_FILL),(U!==Te||H!==J)&&(i.polygonOffset(Te,J),U=Te,H=J)):be(i.POLYGON_OFFSET_FILL)}function pe(B){B?ce(i.SCISSOR_TEST):be(i.SCISSOR_TEST)}function A(B){B===void 0&&(B=i.TEXTURE0+G-1),ne!==B&&(i.activeTexture(B),ne=B)}function E(B,Te,J){J===void 0&&(ne===null?J=i.TEXTURE0+G-1:J=ne);let oe=le[J];oe===void 0&&(oe={type:void 0,texture:void 0},le[J]=oe),(oe.type!==B||oe.texture!==Te)&&(ne!==J&&(i.activeTexture(J),ne=J),i.bindTexture(B,Te||ve[B]),oe.type=B,oe.texture=Te)}function V(){let B=le[ne];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function Q(){try{i.compressedTexImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function re(){try{i.compressedTexImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function te(){try{i.texSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function He(){try{i.texSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ee(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Re(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function lt(){try{i.texStorage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ge(){try{i.texStorage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Be(){try{i.texImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function K(){try{i.texImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function de(B){Ke.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),Ke.copy(B))}function ie(B){Z.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),Z.copy(B))}function Ae(B,Te){let J=c.get(Te);J===void 0&&(J=new WeakMap,c.set(Te,J));let oe=J.get(B);oe===void 0&&(oe=i.getUniformBlockIndex(Te,B.name),J.set(B,oe))}function Le(B,Te){let oe=c.get(Te).get(B);l.get(Te)!==oe&&(i.uniformBlockBinding(Te,oe,B.__bindingPointIndex),l.set(Te,oe))}function nt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ne=null,le={},u={},d=new WeakMap,f=[],m=null,v=!1,g=null,p=null,y=null,_=null,x=null,I=null,T=null,S=new ke(0,0,0),R=0,M=!1,b=null,P=null,k=null,U=null,H=null,Ke.set(0,0,i.canvas.width,i.canvas.height),Z.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:ce,disable:be,bindFramebuffer:Oe,drawBuffers:qe,useProgram:tt,setBlending:L,setMaterial:Ne,setFlipSided:W,setCullFace:X,setLineWidth:j,setPolygonOffset:xe,setScissorTest:pe,activeTexture:A,bindTexture:E,unbindTexture:V,compressedTexImage2D:Q,compressedTexImage3D:re,texImage2D:Be,texImage3D:K,updateUBOMapping:Ae,uniformBlockBinding:Le,texStorage2D:lt,texStorage3D:ge,texSubImage2D:te,texSubImage3D:He,compressedTexSubImage2D:Ee,compressedTexSubImage3D:Re,scissor:de,viewport:ie,reset:nt}}function Mf(i,e,t,n){let s=R1(n);switch(t){case Vf:return i*e;case Xf:return i*e;case qf:return i*e*2;case bu:return i*e/s.components*s.byteLength;case Mu:return i*e/s.components*s.byteLength;case Yf:return i*e*2/s.components*s.byteLength;case Eu:return i*e*2/s.components*s.byteLength;case Wf:return i*e*3/s.components*s.byteLength;case si:return i*e*4/s.components*s.byteLength;case wu:return i*e*4/s.components*s.byteLength;case Sa:case Ta:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Aa:case Ra:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case $c:case jc:return Math.max(i,16)*Math.max(e,8)/4;case Kc:case Jc:return Math.max(i,8)*Math.max(e,8)/2;case Qc:case eh:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case th:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case nh:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ih:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case sh:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case rh:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case oh:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ah:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case lh:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case ch:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case hh:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case uh:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case dh:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case fh:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case ph:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case mh:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ca:case gh:case vh:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Zf:case xh:return Math.ceil(i/4)*Math.ceil(e/4)*8;case yh:case _h:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function R1(i){switch(i){case Bi:case Of:return{byteLength:1,components:1};case xo:case zf:case cs:return{byteLength:2,components:1};case yu:case _u:return{byteLength:2,components:4};case Bs:case xu:case mi:return{byteLength:4,components:1};case Gf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function C1(i,e,t,n,s,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ue,h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(A,E){return f?new OffscreenCanvas(A,E):La("canvas")}function v(A,E,V){let Q=1,re=pe(A);if((re.width>V||re.height>V)&&(Q=V/Math.max(re.width,re.height)),Q<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let te=Math.floor(Q*re.width),He=Math.floor(Q*re.height);u===void 0&&(u=m(te,He));let Ee=E?m(te,He):u;return Ee.width=te,Ee.height=He,Ee.getContext("2d").drawImage(A,0,0,te,He),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+te+"x"+He+")."),Ee}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),A;return A}function g(A){return A.generateMipmaps}function p(A){i.generateMipmap(A)}function y(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function _(A,E,V,Q,re=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let te=E;if(E===i.RED&&(V===i.FLOAT&&(te=i.R32F),V===i.HALF_FLOAT&&(te=i.R16F),V===i.UNSIGNED_BYTE&&(te=i.R8)),E===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(te=i.R8UI),V===i.UNSIGNED_SHORT&&(te=i.R16UI),V===i.UNSIGNED_INT&&(te=i.R32UI),V===i.BYTE&&(te=i.R8I),V===i.SHORT&&(te=i.R16I),V===i.INT&&(te=i.R32I)),E===i.RG&&(V===i.FLOAT&&(te=i.RG32F),V===i.HALF_FLOAT&&(te=i.RG16F),V===i.UNSIGNED_BYTE&&(te=i.RG8)),E===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(te=i.RG8UI),V===i.UNSIGNED_SHORT&&(te=i.RG16UI),V===i.UNSIGNED_INT&&(te=i.RG32UI),V===i.BYTE&&(te=i.RG8I),V===i.SHORT&&(te=i.RG16I),V===i.INT&&(te=i.RG32I)),E===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(te=i.RGB8UI),V===i.UNSIGNED_SHORT&&(te=i.RGB16UI),V===i.UNSIGNED_INT&&(te=i.RGB32UI),V===i.BYTE&&(te=i.RGB8I),V===i.SHORT&&(te=i.RGB16I),V===i.INT&&(te=i.RGB32I)),E===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(te=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(te=i.RGBA16UI),V===i.UNSIGNED_INT&&(te=i.RGBA32UI),V===i.BYTE&&(te=i.RGBA8I),V===i.SHORT&&(te=i.RGBA16I),V===i.INT&&(te=i.RGBA32I)),E===i.RGB&&V===i.UNSIGNED_INT_5_9_9_9_REV&&(te=i.RGB9_E5),E===i.RGBA){let He=re?il:dt.getTransfer(Q);V===i.FLOAT&&(te=i.RGBA32F),V===i.HALF_FLOAT&&(te=i.RGBA16F),V===i.UNSIGNED_BYTE&&(te=He===Tt?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&(te=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(te=i.RGB5_A1)}return(te===i.R16F||te===i.R32F||te===i.RG16F||te===i.RG32F||te===i.RGBA16F||te===i.RGBA32F)&&e.get("EXT_color_buffer_float"),te}function x(A,E){let V;return A?E===null||E===Bs||E===Tr?V=i.DEPTH24_STENCIL8:E===mi?V=i.DEPTH32F_STENCIL8:E===xo&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Bs||E===Tr?V=i.DEPTH_COMPONENT24:E===mi?V=i.DEPTH_COMPONENT32F:E===xo&&(V=i.DEPTH_COMPONENT16),V}function I(A,E){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==An&&A.minFilter!==zn?Math.log2(Math.max(E.width,E.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?E.mipmaps.length:1}function T(A){let E=A.target;E.removeEventListener("dispose",T),R(E),E.isVideoTexture&&h.delete(E)}function S(A){let E=A.target;E.removeEventListener("dispose",S),b(E)}function R(A){let E=n.get(A);if(E.__webglInit===void 0)return;let V=A.source,Q=d.get(V);if(Q){let re=Q[E.__cacheKey];re.usedTimes--,re.usedTimes===0&&M(A),Object.keys(Q).length===0&&d.delete(V)}n.remove(A)}function M(A){let E=n.get(A);i.deleteTexture(E.__webglTexture);let V=A.source,Q=d.get(V);delete Q[E.__cacheKey],o.memory.textures--}function b(A){let E=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(E.__webglFramebuffer[Q]))for(let re=0;re<E.__webglFramebuffer[Q].length;re++)i.deleteFramebuffer(E.__webglFramebuffer[Q][re]);else i.deleteFramebuffer(E.__webglFramebuffer[Q]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[Q])}else{if(Array.isArray(E.__webglFramebuffer))for(let Q=0;Q<E.__webglFramebuffer.length;Q++)i.deleteFramebuffer(E.__webglFramebuffer[Q]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let Q=0;Q<E.__webglColorRenderbuffer.length;Q++)E.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[Q]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let V=A.textures;for(let Q=0,re=V.length;Q<re;Q++){let te=n.get(V[Q]);te.__webglTexture&&(i.deleteTexture(te.__webglTexture),o.memory.textures--),n.remove(V[Q])}n.remove(A)}let P=0;function k(){P=0}function U(){let A=P;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),P+=1,A}function H(A){let E=[];return E.push(A.wrapS),E.push(A.wrapT),E.push(A.wrapR||0),E.push(A.magFilter),E.push(A.minFilter),E.push(A.anisotropy),E.push(A.internalFormat),E.push(A.format),E.push(A.type),E.push(A.generateMipmaps),E.push(A.premultiplyAlpha),E.push(A.flipY),E.push(A.unpackAlignment),E.push(A.colorSpace),E.join()}function G(A,E){let V=n.get(A);if(A.isVideoTexture&&j(A),A.isRenderTargetTexture===!1&&A.version>0&&V.__version!==A.version){let Q=A.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Z(V,A,E);return}}t.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+E)}function N(A,E){let V=n.get(A);if(A.version>0&&V.__version!==A.version){Z(V,A,E);return}t.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+E)}function $(A,E){let V=n.get(A);if(A.version>0&&V.__version!==A.version){Z(V,A,E);return}t.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+E)}function z(A,E){let V=n.get(A);if(A.version>0&&V.__version!==A.version){fe(V,A,E);return}t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+E)}let ne={[Ni]:i.REPEAT,[Us]:i.CLAMP_TO_EDGE,[Zc]:i.MIRRORED_REPEAT},le={[An]:i.NEAREST,[fm]:i.NEAREST_MIPMAP_NEAREST,[Ko]:i.NEAREST_MIPMAP_LINEAR,[zn]:i.LINEAR,[sc]:i.LINEAR_MIPMAP_NEAREST,[Ns]:i.LINEAR_MIPMAP_LINEAR},me={[vm]:i.NEVER,[Em]:i.ALWAYS,[xm]:i.LESS,[Kf]:i.LEQUAL,[ym]:i.EQUAL,[Mm]:i.GEQUAL,[_m]:i.GREATER,[bm]:i.NOTEQUAL};function Ie(A,E){if(E.type===mi&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===zn||E.magFilter===sc||E.magFilter===Ko||E.magFilter===Ns||E.minFilter===zn||E.minFilter===sc||E.minFilter===Ko||E.minFilter===Ns)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,ne[E.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,ne[E.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,ne[E.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,le[E.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,le[E.minFilter]),E.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,me[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===An||E.minFilter!==Ko&&E.minFilter!==Ns||E.type===mi&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){let V=e.get("EXT_texture_filter_anisotropic");i.texParameterf(A,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function Ke(A,E){let V=!1;A.__webglInit===void 0&&(A.__webglInit=!0,E.addEventListener("dispose",T));let Q=E.source,re=d.get(Q);re===void 0&&(re={},d.set(Q,re));let te=H(E);if(te!==A.__cacheKey){re[te]===void 0&&(re[te]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,V=!0),re[te].usedTimes++;let He=re[A.__cacheKey];He!==void 0&&(re[A.__cacheKey].usedTimes--,He.usedTimes===0&&M(E)),A.__cacheKey=te,A.__webglTexture=re[te].texture}return V}function Z(A,E,V){let Q=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(Q=i.TEXTURE_3D);let re=Ke(A,E),te=E.source;t.bindTexture(Q,A.__webglTexture,i.TEXTURE0+V);let He=n.get(te);if(te.version!==He.__version||re===!0){t.activeTexture(i.TEXTURE0+V);let Ee=dt.getPrimaries(dt.workingColorSpace),Re=E.colorSpace===ts?null:dt.getPrimaries(E.colorSpace),lt=E.colorSpace===ts||Ee===Re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,lt);let ge=v(E.image,!1,s.maxTextureSize);ge=xe(E,ge);let Be=r.convert(E.format,E.colorSpace),K=r.convert(E.type),de=_(E.internalFormat,Be,K,E.colorSpace,E.isVideoTexture);Ie(Q,E);let ie,Ae=E.mipmaps,Le=E.isVideoTexture!==!0,nt=He.__version===void 0||re===!0,B=te.dataReady,Te=I(E,ge);if(E.isDepthTexture)de=x(E.format===Ar,E.type),nt&&(Le?t.texStorage2D(i.TEXTURE_2D,1,de,ge.width,ge.height):t.texImage2D(i.TEXTURE_2D,0,de,ge.width,ge.height,0,Be,K,null));else if(E.isDataTexture)if(Ae.length>0){Le&&nt&&t.texStorage2D(i.TEXTURE_2D,Te,de,Ae[0].width,Ae[0].height);for(let J=0,oe=Ae.length;J<oe;J++)ie=Ae[J],Le?B&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,ie.width,ie.height,Be,K,ie.data):t.texImage2D(i.TEXTURE_2D,J,de,ie.width,ie.height,0,Be,K,ie.data);E.generateMipmaps=!1}else Le?(nt&&t.texStorage2D(i.TEXTURE_2D,Te,de,ge.width,ge.height),B&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ge.width,ge.height,Be,K,ge.data)):t.texImage2D(i.TEXTURE_2D,0,de,ge.width,ge.height,0,Be,K,ge.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Le&&nt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Te,de,Ae[0].width,Ae[0].height,ge.depth);for(let J=0,oe=Ae.length;J<oe;J++)if(ie=Ae[J],E.format!==si)if(Be!==null)if(Le){if(B)if(E.layerUpdates.size>0){let De=Mf(ie.width,ie.height,E.format,E.type);for(let Ce of E.layerUpdates){let it=ie.data.subarray(Ce*De/ie.data.BYTES_PER_ELEMENT,(Ce+1)*De/ie.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,Ce,ie.width,ie.height,1,Be,it)}E.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,ie.width,ie.height,ge.depth,Be,ie.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,J,de,ie.width,ie.height,ge.depth,0,ie.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Le?B&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,J,0,0,0,ie.width,ie.height,ge.depth,Be,K,ie.data):t.texImage3D(i.TEXTURE_2D_ARRAY,J,de,ie.width,ie.height,ge.depth,0,Be,K,ie.data)}else{Le&&nt&&t.texStorage2D(i.TEXTURE_2D,Te,de,Ae[0].width,Ae[0].height);for(let J=0,oe=Ae.length;J<oe;J++)ie=Ae[J],E.format!==si?Be!==null?Le?B&&t.compressedTexSubImage2D(i.TEXTURE_2D,J,0,0,ie.width,ie.height,Be,ie.data):t.compressedTexImage2D(i.TEXTURE_2D,J,de,ie.width,ie.height,0,ie.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Le?B&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,ie.width,ie.height,Be,K,ie.data):t.texImage2D(i.TEXTURE_2D,J,de,ie.width,ie.height,0,Be,K,ie.data)}else if(E.isDataArrayTexture)if(Le){if(nt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Te,de,ge.width,ge.height,ge.depth),B)if(E.layerUpdates.size>0){let J=Mf(ge.width,ge.height,E.format,E.type);for(let oe of E.layerUpdates){let De=ge.data.subarray(oe*J/ge.data.BYTES_PER_ELEMENT,(oe+1)*J/ge.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,oe,ge.width,ge.height,1,Be,K,De)}E.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ge.width,ge.height,ge.depth,Be,K,ge.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,de,ge.width,ge.height,ge.depth,0,Be,K,ge.data);else if(E.isData3DTexture)Le?(nt&&t.texStorage3D(i.TEXTURE_3D,Te,de,ge.width,ge.height,ge.depth),B&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ge.width,ge.height,ge.depth,Be,K,ge.data)):t.texImage3D(i.TEXTURE_3D,0,de,ge.width,ge.height,ge.depth,0,Be,K,ge.data);else if(E.isFramebufferTexture){if(nt)if(Le)t.texStorage2D(i.TEXTURE_2D,Te,de,ge.width,ge.height);else{let J=ge.width,oe=ge.height;for(let De=0;De<Te;De++)t.texImage2D(i.TEXTURE_2D,De,de,J,oe,0,Be,K,null),J>>=1,oe>>=1}}else if(Ae.length>0){if(Le&&nt){let J=pe(Ae[0]);t.texStorage2D(i.TEXTURE_2D,Te,de,J.width,J.height)}for(let J=0,oe=Ae.length;J<oe;J++)ie=Ae[J],Le?B&&t.texSubImage2D(i.TEXTURE_2D,J,0,0,Be,K,ie):t.texImage2D(i.TEXTURE_2D,J,de,Be,K,ie);E.generateMipmaps=!1}else if(Le){if(nt){let J=pe(ge);t.texStorage2D(i.TEXTURE_2D,Te,de,J.width,J.height)}B&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Be,K,ge)}else t.texImage2D(i.TEXTURE_2D,0,de,Be,K,ge);g(E)&&p(Q),He.__version=te.version,E.onUpdate&&E.onUpdate(E)}A.__version=E.version}function fe(A,E,V){if(E.image.length!==6)return;let Q=Ke(A,E),re=E.source;t.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+V);let te=n.get(re);if(re.version!==te.__version||Q===!0){t.activeTexture(i.TEXTURE0+V);let He=dt.getPrimaries(dt.workingColorSpace),Ee=E.colorSpace===ts?null:dt.getPrimaries(E.colorSpace),Re=E.colorSpace===ts||He===Ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re);let lt=E.isCompressedTexture||E.image[0].isCompressedTexture,ge=E.image[0]&&E.image[0].isDataTexture,Be=[];for(let oe=0;oe<6;oe++)!lt&&!ge?Be[oe]=v(E.image[oe],!0,s.maxCubemapSize):Be[oe]=ge?E.image[oe].image:E.image[oe],Be[oe]=xe(E,Be[oe]);let K=Be[0],de=r.convert(E.format,E.colorSpace),ie=r.convert(E.type),Ae=_(E.internalFormat,de,ie,E.colorSpace),Le=E.isVideoTexture!==!0,nt=te.__version===void 0||Q===!0,B=re.dataReady,Te=I(E,K);Ie(i.TEXTURE_CUBE_MAP,E);let J;if(lt){Le&&nt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Te,Ae,K.width,K.height);for(let oe=0;oe<6;oe++){J=Be[oe].mipmaps;for(let De=0;De<J.length;De++){let Ce=J[De];E.format!==si?de!==null?Le?B&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,De,0,0,Ce.width,Ce.height,de,Ce.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,De,Ae,Ce.width,Ce.height,0,Ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Le?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,De,0,0,Ce.width,Ce.height,de,ie,Ce.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,De,Ae,Ce.width,Ce.height,0,de,ie,Ce.data)}}}else{if(J=E.mipmaps,Le&&nt){J.length>0&&Te++;let oe=pe(Be[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Te,Ae,oe.width,oe.height)}for(let oe=0;oe<6;oe++)if(ge){Le?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,Be[oe].width,Be[oe].height,de,ie,Be[oe].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,Ae,Be[oe].width,Be[oe].height,0,de,ie,Be[oe].data);for(let De=0;De<J.length;De++){let it=J[De].image[oe].image;Le?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,De+1,0,0,it.width,it.height,de,ie,it.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,De+1,Ae,it.width,it.height,0,de,ie,it.data)}}else{Le?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,de,ie,Be[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,Ae,de,ie,Be[oe]);for(let De=0;De<J.length;De++){let Ce=J[De];Le?B&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,De+1,0,0,de,ie,Ce.image[oe]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,De+1,Ae,de,ie,Ce.image[oe])}}}g(E)&&p(i.TEXTURE_CUBE_MAP),te.__version=re.version,E.onUpdate&&E.onUpdate(E)}A.__version=E.version}function ve(A,E,V,Q,re,te){let He=r.convert(V.format,V.colorSpace),Ee=r.convert(V.type),Re=_(V.internalFormat,He,Ee,V.colorSpace),lt=n.get(E),ge=n.get(V);if(ge.__renderTarget=E,!lt.__hasExternalTextures){let Be=Math.max(1,E.width>>te),K=Math.max(1,E.height>>te);re===i.TEXTURE_3D||re===i.TEXTURE_2D_ARRAY?t.texImage3D(re,te,Re,Be,K,E.depth,0,He,Ee,null):t.texImage2D(re,te,Re,Be,K,0,He,Ee,null)}t.bindFramebuffer(i.FRAMEBUFFER,A),X(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,re,ge.__webglTexture,0,W(E)):(re===i.TEXTURE_2D||re>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,re,ge.__webglTexture,te),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ce(A,E,V){if(i.bindRenderbuffer(i.RENDERBUFFER,A),E.depthBuffer){let Q=E.depthTexture,re=Q&&Q.isDepthTexture?Q.type:null,te=x(E.stencilBuffer,re),He=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Ee=W(E);X(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ee,te,E.width,E.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ee,te,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,te,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,He,i.RENDERBUFFER,A)}else{let Q=E.textures;for(let re=0;re<Q.length;re++){let te=Q[re],He=r.convert(te.format,te.colorSpace),Ee=r.convert(te.type),Re=_(te.internalFormat,He,Ee,te.colorSpace),lt=W(E);V&&X(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,lt,Re,E.width,E.height):X(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,lt,Re,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,Re,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function be(A,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,A),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let Q=n.get(E.depthTexture);Q.__renderTarget=E,(!Q.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),G(E.depthTexture,0);let re=Q.__webglTexture,te=W(E);if(E.depthTexture.format===_r)X(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,re,0,te):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,re,0);else if(E.depthTexture.format===Ar)X(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,re,0,te):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function Oe(A){let E=n.get(A),V=A.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==A.depthTexture){let Q=A.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),Q){let re=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,Q.removeEventListener("dispose",re)};Q.addEventListener("dispose",re),E.__depthDisposeCallback=re}E.__boundDepthTexture=Q}if(A.depthTexture&&!E.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");be(E.__webglFramebuffer,A)}else if(V){E.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[Q]),E.__webglDepthbuffer[Q]===void 0)E.__webglDepthbuffer[Q]=i.createRenderbuffer(),ce(E.__webglDepthbuffer[Q],A,!1);else{let re=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,te=E.__webglDepthbuffer[Q];i.bindRenderbuffer(i.RENDERBUFFER,te),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,te)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=i.createRenderbuffer(),ce(E.__webglDepthbuffer,A,!1);else{let Q=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=E.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,re),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,re)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function qe(A,E,V){let Q=n.get(A);E!==void 0&&ve(Q.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&Oe(A)}function tt(A){let E=A.texture,V=n.get(A),Q=n.get(E);A.addEventListener("dispose",S);let re=A.textures,te=A.isWebGLCubeRenderTarget===!0,He=re.length>1;if(He||(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=E.version,o.memory.textures++),te){V.__webglFramebuffer=[];for(let Ee=0;Ee<6;Ee++)if(E.mipmaps&&E.mipmaps.length>0){V.__webglFramebuffer[Ee]=[];for(let Re=0;Re<E.mipmaps.length;Re++)V.__webglFramebuffer[Ee][Re]=i.createFramebuffer()}else V.__webglFramebuffer[Ee]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){V.__webglFramebuffer=[];for(let Ee=0;Ee<E.mipmaps.length;Ee++)V.__webglFramebuffer[Ee]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(He)for(let Ee=0,Re=re.length;Ee<Re;Ee++){let lt=n.get(re[Ee]);lt.__webglTexture===void 0&&(lt.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&X(A)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let Ee=0;Ee<re.length;Ee++){let Re=re[Ee];V.__webglColorRenderbuffer[Ee]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[Ee]);let lt=r.convert(Re.format,Re.colorSpace),ge=r.convert(Re.type),Be=_(Re.internalFormat,lt,ge,Re.colorSpace,A.isXRRenderTarget===!0),K=W(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,K,Be,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ee,i.RENDERBUFFER,V.__webglColorRenderbuffer[Ee])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),ce(V.__webglDepthRenderbuffer,A,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(te){t.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),Ie(i.TEXTURE_CUBE_MAP,E);for(let Ee=0;Ee<6;Ee++)if(E.mipmaps&&E.mipmaps.length>0)for(let Re=0;Re<E.mipmaps.length;Re++)ve(V.__webglFramebuffer[Ee][Re],A,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,Re);else ve(V.__webglFramebuffer[Ee],A,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Ee,0);g(E)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(He){for(let Ee=0,Re=re.length;Ee<Re;Ee++){let lt=re[Ee],ge=n.get(lt);t.bindTexture(i.TEXTURE_2D,ge.__webglTexture),Ie(i.TEXTURE_2D,lt),ve(V.__webglFramebuffer,A,lt,i.COLOR_ATTACHMENT0+Ee,i.TEXTURE_2D,0),g(lt)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let Ee=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Ee=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Ee,Q.__webglTexture),Ie(Ee,E),E.mipmaps&&E.mipmaps.length>0)for(let Re=0;Re<E.mipmaps.length;Re++)ve(V.__webglFramebuffer[Re],A,E,i.COLOR_ATTACHMENT0,Ee,Re);else ve(V.__webglFramebuffer,A,E,i.COLOR_ATTACHMENT0,Ee,0);g(E)&&p(Ee),t.unbindTexture()}A.depthBuffer&&Oe(A)}function se(A){let E=A.textures;for(let V=0,Q=E.length;V<Q;V++){let re=E[V];if(g(re)){let te=y(A),He=n.get(re).__webglTexture;t.bindTexture(te,He),p(te),t.unbindTexture()}}}let he=[],L=[];function Ne(A){if(A.samples>0){if(X(A)===!1){let E=A.textures,V=A.width,Q=A.height,re=i.COLOR_BUFFER_BIT,te=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,He=n.get(A),Ee=E.length>1;if(Ee)for(let Re=0;Re<E.length;Re++)t.bindFramebuffer(i.FRAMEBUFFER,He.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,He.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,He.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,He.__webglFramebuffer);for(let Re=0;Re<E.length;Re++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(re|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(re|=i.STENCIL_BUFFER_BIT)),Ee){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,He.__webglColorRenderbuffer[Re]);let lt=n.get(E[Re]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,lt,0)}i.blitFramebuffer(0,0,V,Q,0,0,V,Q,re,i.NEAREST),l===!0&&(he.length=0,L.length=0,he.push(i.COLOR_ATTACHMENT0+Re),A.depthBuffer&&A.resolveDepthBuffer===!1&&(he.push(te),L.push(te),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,L)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,he))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Ee)for(let Re=0;Re<E.length;Re++){t.bindFramebuffer(i.FRAMEBUFFER,He.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.RENDERBUFFER,He.__webglColorRenderbuffer[Re]);let lt=n.get(E[Re]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,He.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Re,i.TEXTURE_2D,lt,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,He.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){let E=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function W(A){return Math.min(s.maxSamples,A.samples)}function X(A){let E=n.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function j(A){let E=o.render.frame;h.get(A)!==E&&(h.set(A,E),A.update())}function xe(A,E){let V=A.colorSpace,Q=A.format,re=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||V!==Nr&&V!==ts&&(dt.getTransfer(V)===Tt?(Q!==si||re!==Bi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),E}function pe(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=k,this.setTexture2D=G,this.setTexture2DArray=N,this.setTexture3D=$,this.setTextureCube=z,this.rebindTextures=qe,this.setupRenderTarget=tt,this.updateRenderTargetMipmap=se,this.updateMultisampleRenderTarget=Ne,this.setupDepthRenderbuffer=Oe,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=X}function P1(i,e){function t(n,s=ts){let r,o=dt.getTransfer(s);if(n===Bi)return i.UNSIGNED_BYTE;if(n===yu)return i.UNSIGNED_SHORT_4_4_4_4;if(n===_u)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Gf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Of)return i.BYTE;if(n===zf)return i.SHORT;if(n===xo)return i.UNSIGNED_SHORT;if(n===xu)return i.INT;if(n===Bs)return i.UNSIGNED_INT;if(n===mi)return i.FLOAT;if(n===cs)return i.HALF_FLOAT;if(n===Vf)return i.ALPHA;if(n===Wf)return i.RGB;if(n===si)return i.RGBA;if(n===Xf)return i.LUMINANCE;if(n===qf)return i.LUMINANCE_ALPHA;if(n===_r)return i.DEPTH_COMPONENT;if(n===Ar)return i.DEPTH_STENCIL;if(n===bu)return i.RED;if(n===Mu)return i.RED_INTEGER;if(n===Yf)return i.RG;if(n===Eu)return i.RG_INTEGER;if(n===wu)return i.RGBA_INTEGER;if(n===Sa||n===Ta||n===Aa||n===Ra)if(o===Tt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Sa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ta)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Aa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ra)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Sa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ta)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Aa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ra)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Kc||n===$c||n===Jc||n===jc)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Kc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===$c)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Jc)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===jc)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Qc||n===eh||n===th)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Qc||n===eh)return o===Tt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===th)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===nh||n===ih||n===sh||n===rh||n===oh||n===ah||n===lh||n===ch||n===hh||n===uh||n===dh||n===fh||n===ph||n===mh)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===nh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ih)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===sh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===rh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===oh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ah)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===lh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ch)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===hh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===uh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===dh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===fh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ph)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===mh)return o===Tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ca||n===gh||n===vh)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Ca)return o===Tt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===gh)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===vh)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Zf||n===xh||n===yh||n===_h)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ca)return r.COMPRESSED_RED_RGTC1_EXT;if(n===xh)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===yh)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===_h)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Tr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}var Uh=class extends Kt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}},we=class extends tn{constructor(){super(),this.isGroup=!0,this.type="Group"}},I1={type:"move"},po=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new we,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new we,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new we,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let v of e.hand.values()){let g=t.getJointPose(v,n),p=this._getHandJoint(c,v);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(I1)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new we;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},L1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,D1=`
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

}`,Nh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){let s=new Rn,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Xt({vertexShader:L1,fragmentShader:D1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new D(new $e(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Bh=class extends as{constructor(e,t){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null,v=new Nh,g=t.getContextAttributes(),p=null,y=null,_=[],x=[],I=new ue,T=null,S=new Kt;S.viewport=new At;let R=new Kt;R.viewport=new At;let M=[S,R],b=new Uh,P=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let fe=_[Z];return fe===void 0&&(fe=new po,_[Z]=fe),fe.getTargetRaySpace()},this.getControllerGrip=function(Z){let fe=_[Z];return fe===void 0&&(fe=new po,_[Z]=fe),fe.getGripSpace()},this.getHand=function(Z){let fe=_[Z];return fe===void 0&&(fe=new po,_[Z]=fe),fe.getHandSpace()};function U(Z){let fe=x.indexOf(Z.inputSource);if(fe===-1)return;let ve=_[fe];ve!==void 0&&(ve.update(Z.inputSource,Z.frame,c||o),ve.dispatchEvent({type:Z.type,data:Z.inputSource}))}function H(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",G);for(let Z=0;Z<_.length;Z++){let fe=x[Z];fe!==null&&(x[Z]=null,_[Z].disconnect(fe))}P=null,k=null,v.reset(),e.setRenderTarget(p),f=null,d=null,u=null,s=null,y=null,Ke.stop(),n.isPresenting=!1,e.setPixelRatio(T),e.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",H),s.addEventListener("inputsourceschange",G),g.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(I),s.renderState.layers===void 0){let fe={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,fe),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Xn(f.framebufferWidth,f.framebufferHeight,{format:si,type:Bi,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let fe=null,ve=null,ce=null;g.depth&&(ce=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=g.stencil?Ar:_r,ve=g.stencil?Tr:Bs);let be={colorFormat:t.RGBA8,depthFormat:ce,scaleFactor:r};u=new XRWebGLBinding(s,t),d=u.createProjectionLayer(be),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Xn(d.textureWidth,d.textureHeight,{format:si,type:Bi,depthTexture:new Oa(d.textureWidth,d.textureHeight,ve,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Ke.setContext(s),Ke.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return v.getDepthTexture()};function G(Z){for(let fe=0;fe<Z.removed.length;fe++){let ve=Z.removed[fe],ce=x.indexOf(ve);ce>=0&&(x[ce]=null,_[ce].disconnect(ve))}for(let fe=0;fe<Z.added.length;fe++){let ve=Z.added[fe],ce=x.indexOf(ve);if(ce===-1){for(let Oe=0;Oe<_.length;Oe++)if(Oe>=x.length){x.push(ve),ce=Oe;break}else if(x[Oe]===null){x[Oe]=ve,ce=Oe;break}if(ce===-1)break}let be=_[ce];be&&be.connect(ve)}}let N=new C,$=new C;function z(Z,fe,ve){N.setFromMatrixPosition(fe.matrixWorld),$.setFromMatrixPosition(ve.matrixWorld);let ce=N.distanceTo($),be=fe.projectionMatrix.elements,Oe=ve.projectionMatrix.elements,qe=be[14]/(be[10]-1),tt=be[14]/(be[10]+1),se=(be[9]+1)/be[5],he=(be[9]-1)/be[5],L=(be[8]-1)/be[0],Ne=(Oe[8]+1)/Oe[0],W=qe*L,X=qe*Ne,j=ce/(-L+Ne),xe=j*-L;if(fe.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(xe),Z.translateZ(j),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),be[10]===-1)Z.projectionMatrix.copy(fe.projectionMatrix),Z.projectionMatrixInverse.copy(fe.projectionMatrixInverse);else{let pe=qe+j,A=tt+j,E=W-xe,V=X+(ce-xe),Q=se*tt/A*pe,re=he*tt/A*pe;Z.projectionMatrix.makePerspective(E,V,Q,re,pe,A),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ne(Z,fe){fe===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(fe.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let fe=Z.near,ve=Z.far;v.texture!==null&&(v.depthNear>0&&(fe=v.depthNear),v.depthFar>0&&(ve=v.depthFar)),b.near=R.near=S.near=fe,b.far=R.far=S.far=ve,(P!==b.near||k!==b.far)&&(s.updateRenderState({depthNear:b.near,depthFar:b.far}),P=b.near,k=b.far),S.layers.mask=Z.layers.mask|2,R.layers.mask=Z.layers.mask|4,b.layers.mask=S.layers.mask|R.layers.mask;let ce=Z.parent,be=b.cameras;ne(b,ce);for(let Oe=0;Oe<be.length;Oe++)ne(be[Oe],ce);be.length===2?z(b,S,R):b.projectionMatrix.copy(S.projectionMatrix),le(Z,b,ce)};function le(Z,fe,ve){ve===null?Z.matrix.copy(fe.matrixWorld):(Z.matrix.copy(ve.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(fe.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(fe.projectionMatrix),Z.projectionMatrixInverse.copy(fe.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Rr*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return v.texture!==null},this.getDepthSensingMesh=function(){return v.getMesh(b)};let me=null;function Ie(Z,fe){if(h=fe.getViewerPose(c||o),m=fe,h!==null){let ve=h.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let ce=!1;ve.length!==b.cameras.length&&(b.cameras.length=0,ce=!0);for(let Oe=0;Oe<ve.length;Oe++){let qe=ve[Oe],tt=null;if(f!==null)tt=f.getViewport(qe);else{let he=u.getViewSubImage(d,qe);tt=he.viewport,Oe===0&&(e.setRenderTargetTextures(y,he.colorTexture,d.ignoreDepthValues?void 0:he.depthStencilTexture),e.setRenderTarget(y))}let se=M[Oe];se===void 0&&(se=new Kt,se.layers.enable(Oe),se.viewport=new At,M[Oe]=se),se.matrix.fromArray(qe.transform.matrix),se.matrix.decompose(se.position,se.quaternion,se.scale),se.projectionMatrix.fromArray(qe.projectionMatrix),se.projectionMatrixInverse.copy(se.projectionMatrix).invert(),se.viewport.set(tt.x,tt.y,tt.width,tt.height),Oe===0&&(b.matrix.copy(se.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),ce===!0&&b.cameras.push(se)}let be=s.enabledFeatures;if(be&&be.includes("depth-sensing")){let Oe=u.getDepthInformation(ve[0]);Oe&&Oe.isValid&&Oe.texture&&v.init(e,Oe,s.renderState)}}for(let ve=0;ve<_.length;ve++){let ce=x[ve],be=_[ve];ce!==null&&be!==void 0&&be.update(ce,fe,c||o)}me&&me(Z,fe),fe.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:fe}),m=null}let Ke=new ep;Ke.setAnimationLoop(Ie),this.setAnimationLoop=function(Z){me=Z},this.dispose=function(){}}},Ps=new fn,k1=new Je;function U1(i,e){function t(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Qf(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,y,_,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,x)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),v(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?l(g,p,y,_):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,t(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===xn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,t(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===xn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,t(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,t(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let y=e.get(p),_=y.envMap,x=y.envMapRotation;_&&(g.envMap.value=_,Ps.copy(x),Ps.x*=-1,Ps.y*=-1,Ps.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Ps.y*=-1,Ps.z*=-1),g.envMapRotation.value.setFromMatrix4(k1.makeRotationFromEuler(Ps)),g.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,y,_){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*y,g.scale.value=_*.5,p.map&&(g.map.value=p.map,t(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,t(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,t(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,y){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===xn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=y.texture,g.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function v(g,p){let y=e.get(p).light;g.referencePosition.value.setFromMatrixPosition(y.matrixWorld),g.nearDistance.value=y.shadow.camera.near,g.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function N1(i,e,t,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,_){let x=_.program;n.uniformBlockBinding(y,x)}function c(y,_){let x=s[y.id];x===void 0&&(m(y),x=h(y),s[y.id]=x,y.addEventListener("dispose",g));let I=_.program;n.updateUBOMapping(y,I);let T=e.render.frame;r[y.id]!==T&&(d(y),r[y.id]=T)}function h(y){let _=u();y.__bindingPointIndex=_;let x=i.createBuffer(),I=y.__size,T=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,I,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,x),x}function u(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){let _=s[y.id],x=y.uniforms,I=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let T=0,S=x.length;T<S;T++){let R=Array.isArray(x[T])?x[T]:[x[T]];for(let M=0,b=R.length;M<b;M++){let P=R[M];if(f(P,T,M,I)===!0){let k=P.__offset,U=Array.isArray(P.value)?P.value:[P.value],H=0;for(let G=0;G<U.length;G++){let N=U[G],$=v(N);typeof N=="number"||typeof N=="boolean"?(P.__data[0]=N,i.bufferSubData(i.UNIFORM_BUFFER,k+H,P.__data)):N.isMatrix3?(P.__data[0]=N.elements[0],P.__data[1]=N.elements[1],P.__data[2]=N.elements[2],P.__data[3]=0,P.__data[4]=N.elements[3],P.__data[5]=N.elements[4],P.__data[6]=N.elements[5],P.__data[7]=0,P.__data[8]=N.elements[6],P.__data[9]=N.elements[7],P.__data[10]=N.elements[8],P.__data[11]=0):(N.toArray(P.__data,H),H+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,k,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,_,x,I){let T=y.value,S=_+"_"+x;if(I[S]===void 0)return typeof T=="number"||typeof T=="boolean"?I[S]=T:I[S]=T.clone(),!0;{let R=I[S];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return I[S]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function m(y){let _=y.uniforms,x=0,I=16;for(let S=0,R=_.length;S<R;S++){let M=Array.isArray(_[S])?_[S]:[_[S]];for(let b=0,P=M.length;b<P;b++){let k=M[b],U=Array.isArray(k.value)?k.value:[k.value];for(let H=0,G=U.length;H<G;H++){let N=U[H],$=v(N),z=x%I,ne=z%$.boundary,le=z+ne;x+=ne,le!==0&&I-le<$.storage&&(x+=I-le),k.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=x,x+=$.storage}}}let T=x%I;return T>0&&(x+=I-T),y.__size=x,y.__cache={},this}function v(y){let _={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(_.boundary=4,_.storage=4):y.isVector2?(_.boundary=8,_.storage=8):y.isVector3||y.isColor?(_.boundary=16,_.storage=12):y.isVector4?(_.boundary=16,_.storage=16):y.isMatrix3?(_.boundary=48,_.storage=48):y.isMatrix4?(_.boundary=64,_.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),_}function g(y){let _=y.target;_.removeEventListener("dispose",g);let x=o.indexOf(_.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function p(){for(let y in s)i.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}var za=class{constructor(e={}){let{canvas:t=Om(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let m=new Uint32Array(4),v=new Int32Array(4),g=null,p=null,y=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ht,this.toneMapping=is,this.toneMappingExposure=1;let x=this,I=!1,T=0,S=0,R=null,M=-1,b=null,P=new At,k=new At,U=null,H=new ke(0),G=0,N=t.width,$=t.height,z=1,ne=null,le=null,me=new At(0,0,N,$),Ie=new At(0,0,N,$),Ke=!1,Z=new _o,fe=!1,ve=!1,ce=new Je,be=new Je,Oe=new C,qe=new At,tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},se=!1;function he(){return R===null?z:1}let L=n;function Ne(w,F){return t.getContext(w,F)}try{let w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${du}`),t.addEventListener("webglcontextlost",oe,!1),t.addEventListener("webglcontextrestored",De,!1),t.addEventListener("webglcontextcreationerror",Ce,!1),L===null){let F="webgl2";if(L=Ne(F,w),L===null)throw Ne(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let W,X,j,xe,pe,A,E,V,Q,re,te,He,Ee,Re,lt,ge,Be,K,de,ie,Ae,Le,nt,B;function Te(){W=new jx(L),W.init(),Le=new P1(L,W),X=new qx(L,W,e,Le),j=new A1(L,W),X.reverseDepthBuffer&&d&&j.buffers.depth.setReversed(!0),xe=new ty(L),pe=new p1,A=new C1(L,W,j,pe,X,Le,xe),E=new Zx(x),V=new Jx(x),Q=new lg(L),nt=new Wx(L,Q),re=new Qx(L,Q,xe,nt),te=new iy(L,re,Q,xe),de=new ny(L,X,A),ge=new Yx(pe),He=new f1(x,E,V,W,X,nt,ge),Ee=new U1(x,pe),Re=new g1,lt=new M1(W),K=new Vx(x,E,V,j,te,f,l),Be=new S1(x,te,X),B=new N1(L,xe,X,j),ie=new Xx(L,W,xe),Ae=new ey(L,W,xe),xe.programs=He.programs,x.capabilities=X,x.extensions=W,x.properties=pe,x.renderLists=Re,x.shadowMap=Be,x.state=j,x.info=xe}Te();let J=new Bh(x,L);this.xr=J,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let w=W.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){let w=W.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return z},this.setPixelRatio=function(w){w!==void 0&&(z=w,this.setSize(N,$,!1))},this.getSize=function(w){return w.set(N,$)},this.setSize=function(w,F,q=!0){if(J.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}N=w,$=F,t.width=Math.floor(w*z),t.height=Math.floor(F*z),q===!0&&(t.style.width=w+"px",t.style.height=F+"px"),this.setViewport(0,0,w,F)},this.getDrawingBufferSize=function(w){return w.set(N*z,$*z).floor()},this.setDrawingBufferSize=function(w,F,q){N=w,$=F,z=q,t.width=Math.floor(w*q),t.height=Math.floor(F*q),this.setViewport(0,0,w,F)},this.getCurrentViewport=function(w){return w.copy(P)},this.getViewport=function(w){return w.copy(me)},this.setViewport=function(w,F,q,Y){w.isVector4?me.set(w.x,w.y,w.z,w.w):me.set(w,F,q,Y),j.viewport(P.copy(me).multiplyScalar(z).round())},this.getScissor=function(w){return w.copy(Ie)},this.setScissor=function(w,F,q,Y){w.isVector4?Ie.set(w.x,w.y,w.z,w.w):Ie.set(w,F,q,Y),j.scissor(k.copy(Ie).multiplyScalar(z).round())},this.getScissorTest=function(){return Ke},this.setScissorTest=function(w){j.setScissorTest(Ke=w)},this.setOpaqueSort=function(w){ne=w},this.setTransparentSort=function(w){le=w},this.getClearColor=function(w){return w.copy(K.getClearColor())},this.setClearColor=function(){K.setClearColor.apply(K,arguments)},this.getClearAlpha=function(){return K.getClearAlpha()},this.setClearAlpha=function(){K.setClearAlpha.apply(K,arguments)},this.clear=function(w=!0,F=!0,q=!0){let Y=0;if(w){let O=!1;if(R!==null){let ye=R.texture.format;O=ye===wu||ye===Eu||ye===Mu}if(O){let ye=R.texture.type,Pe=ye===Bi||ye===Bs||ye===xo||ye===Tr||ye===yu||ye===_u,ze=K.getClearColor(),Ge=K.getClearAlpha(),Qe=ze.r,st=ze.g,Ve=ze.b;Pe?(m[0]=Qe,m[1]=st,m[2]=Ve,m[3]=Ge,L.clearBufferuiv(L.COLOR,0,m)):(v[0]=Qe,v[1]=st,v[2]=Ve,v[3]=Ge,L.clearBufferiv(L.COLOR,0,v))}else Y|=L.COLOR_BUFFER_BIT}F&&(Y|=L.DEPTH_BUFFER_BIT),q&&(Y|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",oe,!1),t.removeEventListener("webglcontextrestored",De,!1),t.removeEventListener("webglcontextcreationerror",Ce,!1),Re.dispose(),lt.dispose(),pe.dispose(),E.dispose(),V.dispose(),te.dispose(),nt.dispose(),B.dispose(),He.dispose(),J.dispose(),J.removeEventListener("sessionstart",pd),J.removeEventListener("sessionend",md),ws.stop()};function oe(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function De(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;let w=xe.autoReset,F=Be.enabled,q=Be.autoUpdate,Y=Be.needsUpdate,O=Be.type;Te(),xe.autoReset=w,Be.enabled=F,Be.autoUpdate=q,Be.needsUpdate=Y,Be.type=O}function Ce(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function it(w){let F=w.target;F.removeEventListener("dispose",it),Ot(F)}function Ot(w){mn(w),pe.remove(w)}function mn(w){let F=pe.get(w).programs;F!==void 0&&(F.forEach(function(q){He.releaseProgram(q)}),w.isShaderMaterial&&He.releaseShaderCache(w))}this.renderBufferDirect=function(w,F,q,Y,O,ye){F===null&&(F=tt);let Pe=O.isMesh&&O.matrixWorld.determinant()<0,ze=H0(w,F,q,Y,O);j.setMaterial(Y,Pe);let Ge=q.index,Qe=1;if(Y.wireframe===!0){if(Ge=re.getWireframeAttribute(q),Ge===void 0)return;Qe=2}let st=q.drawRange,Ve=q.attributes.position,vt=st.start*Qe,Ct=(st.start+st.count)*Qe;ye!==null&&(vt=Math.max(vt,ye.start*Qe),Ct=Math.min(Ct,(ye.start+ye.count)*Qe)),Ge!==null?(vt=Math.max(vt,0),Ct=Math.min(Ct,Ge.count)):Ve!=null&&(vt=Math.max(vt,0),Ct=Math.min(Ct,Ve.count));let Lt=Ct-vt;if(Lt<0||Lt===1/0)return;nt.setup(O,Y,ze,q,Ge);let Dn,Mt=ie;if(Ge!==null&&(Dn=Q.get(Ge),Mt=Ae,Mt.setIndex(Dn)),O.isMesh)Y.wireframe===!0?(j.setLineWidth(Y.wireframeLinewidth*he()),Mt.setMode(L.LINES)):Mt.setMode(L.TRIANGLES);else if(O.isLine){let We=Y.linewidth;We===void 0&&(We=1),j.setLineWidth(We*he()),O.isLineSegments?Mt.setMode(L.LINES):O.isLineLoop?Mt.setMode(L.LINE_LOOP):Mt.setMode(L.LINE_STRIP)}else O.isPoints?Mt.setMode(L.POINTS):O.isSprite&&Mt.setMode(L.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)Mt.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(W.get("WEBGL_multi_draw"))Mt.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{let We=O._multiDrawStarts,Ti=O._multiDrawCounts,Et=O._multiDrawCount,ei=Ge?Q.get(Ge).bytesPerElement:1,er=pe.get(Y).currentProgram.getUniforms();for(let Hn=0;Hn<Et;Hn++)er.setValue(L,"_gl_DrawID",Hn),Mt.render(We[Hn]/ei,Ti[Hn])}else if(O.isInstancedMesh)Mt.renderInstances(vt,Lt,O.count);else if(q.isInstancedBufferGeometry){let We=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Ti=Math.min(q.instanceCount,We);Mt.renderInstances(vt,Lt,Ti)}else Mt.render(vt,Lt)};function wt(w,F,q){w.transparent===!0&&w.side===ft&&w.forceSinglePass===!1?(w.side=xn,w.needsUpdate=!0,Zo(w,F,q),w.side=rs,w.needsUpdate=!0,Zo(w,F,q),w.side=ft):Zo(w,F,q)}this.compile=function(w,F,q=null){q===null&&(q=w),p=lt.get(q),p.init(F),_.push(p),q.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),w!==q&&w.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(p.pushLight(O),O.castShadow&&p.pushShadow(O))}),p.setupLights();let Y=new Set;return w.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;let ye=O.material;if(ye)if(Array.isArray(ye))for(let Pe=0;Pe<ye.length;Pe++){let ze=ye[Pe];wt(ze,q,O),Y.add(ze)}else wt(ye,q,O),Y.add(ye)}),_.pop(),p=null,Y},this.compileAsync=function(w,F,q=null){let Y=this.compile(w,F,q);return new Promise(O=>{function ye(){if(Y.forEach(function(Pe){pe.get(Pe).currentProgram.isReady()&&Y.delete(Pe)}),Y.size===0){O(w);return}setTimeout(ye,10)}W.get("KHR_parallel_shader_compile")!==null?ye():setTimeout(ye,10)})};let Qn=null;function Si(w){Qn&&Qn(w)}function pd(){ws.stop()}function md(){ws.start()}let ws=new ep;ws.setAnimationLoop(Si),typeof self<"u"&&ws.setContext(self),this.setAnimationLoop=function(w){Qn=w,J.setAnimationLoop(w),w===null?ws.stop():ws.start()},J.addEventListener("sessionstart",pd),J.addEventListener("sessionend",md),this.render=function(w,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(J.cameraAutoUpdate===!0&&J.updateCamera(F),F=J.getCamera()),w.isScene===!0&&w.onBeforeRender(x,w,F,R),p=lt.get(w,_.length),p.init(F),_.push(p),be.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Z.setFromProjectionMatrix(be),ve=this.localClippingEnabled,fe=ge.init(this.clippingPlanes,ve),g=Re.get(w,y.length),g.init(),y.push(g),J.enabled===!0&&J.isPresenting===!0){let ye=x.xr.getDepthSensingMesh();ye!==null&&ic(ye,F,-1/0,x.sortObjects)}ic(w,F,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort(ne,le),se=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,se&&K.addToRenderList(g,w),this.info.render.frame++,fe===!0&&ge.beginShadows();let q=p.state.shadowsArray;Be.render(q,w,F),fe===!0&&ge.endShadows(),this.info.autoReset===!0&&this.info.reset();let Y=g.opaque,O=g.transmissive;if(p.setupLights(),F.isArrayCamera){let ye=F.cameras;if(O.length>0)for(let Pe=0,ze=ye.length;Pe<ze;Pe++){let Ge=ye[Pe];vd(Y,O,w,Ge)}se&&K.render(w);for(let Pe=0,ze=ye.length;Pe<ze;Pe++){let Ge=ye[Pe];gd(g,w,Ge,Ge.viewport)}}else O.length>0&&vd(Y,O,w,F),se&&K.render(w),gd(g,w,F);R!==null&&(A.updateMultisampleRenderTarget(R),A.updateRenderTargetMipmap(R)),w.isScene===!0&&w.onAfterRender(x,w,F),nt.resetDefaultState(),M=-1,b=null,_.pop(),_.length>0?(p=_[_.length-1],fe===!0&&ge.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?g=y[y.length-1]:g=null};function ic(w,F,q,Y){if(w.visible===!1)return;if(w.layers.test(F.layers)){if(w.isGroup)q=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(F);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||Z.intersectsSprite(w)){Y&&qe.setFromMatrixPosition(w.matrixWorld).applyMatrix4(be);let Pe=te.update(w),ze=w.material;ze.visible&&g.push(w,Pe,ze,q,qe.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||Z.intersectsObject(w))){let Pe=te.update(w),ze=w.material;if(Y&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),qe.copy(w.boundingSphere.center)):(Pe.boundingSphere===null&&Pe.computeBoundingSphere(),qe.copy(Pe.boundingSphere.center)),qe.applyMatrix4(w.matrixWorld).applyMatrix4(be)),Array.isArray(ze)){let Ge=Pe.groups;for(let Qe=0,st=Ge.length;Qe<st;Qe++){let Ve=Ge[Qe],vt=ze[Ve.materialIndex];vt&&vt.visible&&g.push(w,Pe,vt,q,qe.z,Ve)}}else ze.visible&&g.push(w,Pe,ze,q,qe.z,null)}}let ye=w.children;for(let Pe=0,ze=ye.length;Pe<ze;Pe++)ic(ye[Pe],F,q,Y)}function gd(w,F,q,Y){let O=w.opaque,ye=w.transmissive,Pe=w.transparent;p.setupLightsView(q),fe===!0&&ge.setGlobalState(x.clippingPlanes,q),Y&&j.viewport(P.copy(Y)),O.length>0&&Yo(O,F,q),ye.length>0&&Yo(ye,F,q),Pe.length>0&&Yo(Pe,F,q),j.buffers.depth.setTest(!0),j.buffers.depth.setMask(!0),j.buffers.color.setMask(!0),j.setPolygonOffset(!1)}function vd(w,F,q,Y){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Y.id]===void 0&&(p.state.transmissionRenderTarget[Y.id]=new Xn(1,1,{generateMipmaps:!0,type:W.has("EXT_color_buffer_half_float")||W.has("EXT_color_buffer_float")?cs:Bi,minFilter:Ns,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:dt.workingColorSpace}));let ye=p.state.transmissionRenderTarget[Y.id],Pe=Y.viewport||P;ye.setSize(Pe.z,Pe.w);let ze=x.getRenderTarget();x.setRenderTarget(ye),x.getClearColor(H),G=x.getClearAlpha(),G<1&&x.setClearColor(16777215,.5),x.clear(),se&&K.render(q);let Ge=x.toneMapping;x.toneMapping=is;let Qe=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),p.setupLightsView(Y),fe===!0&&ge.setGlobalState(x.clippingPlanes,Y),Yo(w,q,Y),A.updateMultisampleRenderTarget(ye),A.updateRenderTargetMipmap(ye),W.has("WEBGL_multisampled_render_to_texture")===!1){let st=!1;for(let Ve=0,vt=F.length;Ve<vt;Ve++){let Ct=F[Ve],Lt=Ct.object,Dn=Ct.geometry,Mt=Ct.material,We=Ct.group;if(Mt.side===ft&&Lt.layers.test(Y.layers)){let Ti=Mt.side;Mt.side=xn,Mt.needsUpdate=!0,xd(Lt,q,Y,Dn,Mt,We),Mt.side=Ti,Mt.needsUpdate=!0,st=!0}}st===!0&&(A.updateMultisampleRenderTarget(ye),A.updateRenderTargetMipmap(ye))}x.setRenderTarget(ze),x.setClearColor(H,G),Qe!==void 0&&(Y.viewport=Qe),x.toneMapping=Ge}function Yo(w,F,q){let Y=F.isScene===!0?F.overrideMaterial:null;for(let O=0,ye=w.length;O<ye;O++){let Pe=w[O],ze=Pe.object,Ge=Pe.geometry,Qe=Y===null?Pe.material:Y,st=Pe.group;ze.layers.test(q.layers)&&xd(ze,F,q,Ge,Qe,st)}}function xd(w,F,q,Y,O,ye){w.onBeforeRender(x,F,q,Y,O,ye),w.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),O.onBeforeRender(x,F,q,Y,w,ye),O.transparent===!0&&O.side===ft&&O.forceSinglePass===!1?(O.side=xn,O.needsUpdate=!0,x.renderBufferDirect(q,F,Y,O,w,ye),O.side=rs,O.needsUpdate=!0,x.renderBufferDirect(q,F,Y,O,w,ye),O.side=ft):x.renderBufferDirect(q,F,Y,O,w,ye),w.onAfterRender(x,F,q,Y,O,ye)}function Zo(w,F,q){F.isScene!==!0&&(F=tt);let Y=pe.get(w),O=p.state.lights,ye=p.state.shadowsArray,Pe=O.state.version,ze=He.getParameters(w,O.state,ye,F,q),Ge=He.getProgramCacheKey(ze),Qe=Y.programs;Y.environment=w.isMeshStandardMaterial?F.environment:null,Y.fog=F.fog,Y.envMap=(w.isMeshStandardMaterial?V:E).get(w.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&w.envMap===null?F.environmentRotation:w.envMapRotation,Qe===void 0&&(w.addEventListener("dispose",it),Qe=new Map,Y.programs=Qe);let st=Qe.get(Ge);if(st!==void 0){if(Y.currentProgram===st&&Y.lightsStateVersion===Pe)return _d(w,ze),st}else ze.uniforms=He.getUniforms(w),w.onBeforeCompile(ze,x),st=He.acquireProgram(ze,Ge),Qe.set(Ge,st),Y.uniforms=ze.uniforms;let Ve=Y.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ve.clippingPlanes=ge.uniform),_d(w,ze),Y.needsLights=O0(w),Y.lightsStateVersion=Pe,Y.needsLights&&(Ve.ambientLightColor.value=O.state.ambient,Ve.lightProbe.value=O.state.probe,Ve.directionalLights.value=O.state.directional,Ve.directionalLightShadows.value=O.state.directionalShadow,Ve.spotLights.value=O.state.spot,Ve.spotLightShadows.value=O.state.spotShadow,Ve.rectAreaLights.value=O.state.rectArea,Ve.ltc_1.value=O.state.rectAreaLTC1,Ve.ltc_2.value=O.state.rectAreaLTC2,Ve.pointLights.value=O.state.point,Ve.pointLightShadows.value=O.state.pointShadow,Ve.hemisphereLights.value=O.state.hemi,Ve.directionalShadowMap.value=O.state.directionalShadowMap,Ve.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ve.spotShadowMap.value=O.state.spotShadowMap,Ve.spotLightMatrix.value=O.state.spotLightMatrix,Ve.spotLightMap.value=O.state.spotLightMap,Ve.pointShadowMap.value=O.state.pointShadowMap,Ve.pointShadowMatrix.value=O.state.pointShadowMatrix),Y.currentProgram=st,Y.uniformsList=null,st}function yd(w){if(w.uniformsList===null){let F=w.currentProgram.getUniforms();w.uniformsList=Mr.seqWithValue(F.seq,w.uniforms)}return w.uniformsList}function _d(w,F){let q=pe.get(w);q.outputColorSpace=F.outputColorSpace,q.batching=F.batching,q.batchingColor=F.batchingColor,q.instancing=F.instancing,q.instancingColor=F.instancingColor,q.instancingMorph=F.instancingMorph,q.skinning=F.skinning,q.morphTargets=F.morphTargets,q.morphNormals=F.morphNormals,q.morphColors=F.morphColors,q.morphTargetsCount=F.morphTargetsCount,q.numClippingPlanes=F.numClippingPlanes,q.numIntersection=F.numClipIntersection,q.vertexAlphas=F.vertexAlphas,q.vertexTangents=F.vertexTangents,q.toneMapping=F.toneMapping}function H0(w,F,q,Y,O){F.isScene!==!0&&(F=tt),A.resetTextureUnits();let ye=F.fog,Pe=Y.isMeshStandardMaterial?F.environment:null,ze=R===null?x.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Nr,Ge=(Y.isMeshStandardMaterial?V:E).get(Y.envMap||Pe),Qe=Y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,st=!!q.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Ve=!!q.morphAttributes.position,vt=!!q.morphAttributes.normal,Ct=!!q.morphAttributes.color,Lt=is;Y.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Lt=x.toneMapping);let Dn=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Mt=Dn!==void 0?Dn.length:0,We=pe.get(Y),Ti=p.state.lights;if(fe===!0&&(ve===!0||w!==b)){let Vn=w===b&&Y.id===M;ge.setState(Y,w,Vn)}let Et=!1;Y.version===We.__version?(We.needsLights&&We.lightsStateVersion!==Ti.state.version||We.outputColorSpace!==ze||O.isBatchedMesh&&We.batching===!1||!O.isBatchedMesh&&We.batching===!0||O.isBatchedMesh&&We.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&We.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&We.instancing===!1||!O.isInstancedMesh&&We.instancing===!0||O.isSkinnedMesh&&We.skinning===!1||!O.isSkinnedMesh&&We.skinning===!0||O.isInstancedMesh&&We.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&We.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&We.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&We.instancingMorph===!1&&O.morphTexture!==null||We.envMap!==Ge||Y.fog===!0&&We.fog!==ye||We.numClippingPlanes!==void 0&&(We.numClippingPlanes!==ge.numPlanes||We.numIntersection!==ge.numIntersection)||We.vertexAlphas!==Qe||We.vertexTangents!==st||We.morphTargets!==Ve||We.morphNormals!==vt||We.morphColors!==Ct||We.toneMapping!==Lt||We.morphTargetsCount!==Mt)&&(Et=!0):(Et=!0,We.__version=Y.version);let ei=We.currentProgram;Et===!0&&(ei=Zo(Y,F,O));let er=!1,Hn=!1,Qr=!1,Dt=ei.getUniforms(),fi=We.uniforms;if(j.useProgram(ei.program)&&(er=!0,Hn=!0,Qr=!0),Y.id!==M&&(M=Y.id,Hn=!0),er||b!==w){j.buffers.depth.getReversed()?(ce.copy(w.projectionMatrix),Gm(ce),Vm(ce),Dt.setValue(L,"projectionMatrix",ce)):Dt.setValue(L,"projectionMatrix",w.projectionMatrix),Dt.setValue(L,"viewMatrix",w.matrixWorldInverse);let Yi=Dt.map.cameraPosition;Yi!==void 0&&Yi.setValue(L,Oe.setFromMatrixPosition(w.matrixWorld)),X.logarithmicDepthBuffer&&Dt.setValue(L,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&Dt.setValue(L,"isOrthographic",w.isOrthographicCamera===!0),b!==w&&(b=w,Hn=!0,Qr=!0)}if(O.isSkinnedMesh){Dt.setOptional(L,O,"bindMatrix"),Dt.setOptional(L,O,"bindMatrixInverse");let Vn=O.skeleton;Vn&&(Vn.boneTexture===null&&Vn.computeBoneTexture(),Dt.setValue(L,"boneTexture",Vn.boneTexture,A))}O.isBatchedMesh&&(Dt.setOptional(L,O,"batchingTexture"),Dt.setValue(L,"batchingTexture",O._matricesTexture,A),Dt.setOptional(L,O,"batchingIdTexture"),Dt.setValue(L,"batchingIdTexture",O._indirectTexture,A),Dt.setOptional(L,O,"batchingColorTexture"),O._colorsTexture!==null&&Dt.setValue(L,"batchingColorTexture",O._colorsTexture,A));let eo=q.morphAttributes;if((eo.position!==void 0||eo.normal!==void 0||eo.color!==void 0)&&de.update(O,q,ei),(Hn||We.receiveShadow!==O.receiveShadow)&&(We.receiveShadow=O.receiveShadow,Dt.setValue(L,"receiveShadow",O.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(fi.envMap.value=Ge,fi.flipEnvMap.value=Ge.isCubeTexture&&Ge.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&F.environment!==null&&(fi.envMapIntensity.value=F.environmentIntensity),Hn&&(Dt.setValue(L,"toneMappingExposure",x.toneMappingExposure),We.needsLights&&F0(fi,Qr),ye&&Y.fog===!0&&Ee.refreshFogUniforms(fi,ye),Ee.refreshMaterialUniforms(fi,Y,z,$,p.state.transmissionRenderTarget[w.id]),Mr.upload(L,yd(We),fi,A)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Mr.upload(L,yd(We),fi,A),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&Dt.setValue(L,"center",O.center),Dt.setValue(L,"modelViewMatrix",O.modelViewMatrix),Dt.setValue(L,"normalMatrix",O.normalMatrix),Dt.setValue(L,"modelMatrix",O.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){let Vn=Y.uniformsGroups;for(let Yi=0,Zi=Vn.length;Yi<Zi;Yi++){let bd=Vn[Yi];B.update(bd,ei),B.bind(bd,ei)}}return ei}function F0(w,F){w.ambientLightColor.needsUpdate=F,w.lightProbe.needsUpdate=F,w.directionalLights.needsUpdate=F,w.directionalLightShadows.needsUpdate=F,w.pointLights.needsUpdate=F,w.pointLightShadows.needsUpdate=F,w.spotLights.needsUpdate=F,w.spotLightShadows.needsUpdate=F,w.rectAreaLights.needsUpdate=F,w.hemisphereLights.needsUpdate=F}function O0(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(w,F,q){pe.get(w.texture).__webglTexture=F,pe.get(w.depthTexture).__webglTexture=q;let Y=pe.get(w);Y.__hasExternalTextures=!0,Y.__autoAllocateDepthBuffer=q===void 0,Y.__autoAllocateDepthBuffer||W.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,F){let q=pe.get(w);q.__webglFramebuffer=F,q.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(w,F=0,q=0){R=w,T=F,S=q;let Y=!0,O=null,ye=!1,Pe=!1;if(w){let Ge=pe.get(w);if(Ge.__useDefaultFramebuffer!==void 0)j.bindFramebuffer(L.FRAMEBUFFER,null),Y=!1;else if(Ge.__webglFramebuffer===void 0)A.setupRenderTarget(w);else if(Ge.__hasExternalTextures)A.rebindTextures(w,pe.get(w.texture).__webglTexture,pe.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let Ve=w.depthTexture;if(Ge.__boundDepthTexture!==Ve){if(Ve!==null&&pe.has(Ve)&&(w.width!==Ve.image.width||w.height!==Ve.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(w)}}let Qe=w.texture;(Qe.isData3DTexture||Qe.isDataArrayTexture||Qe.isCompressedArrayTexture)&&(Pe=!0);let st=pe.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(st[F])?O=st[F][q]:O=st[F],ye=!0):w.samples>0&&A.useMultisampledRTT(w)===!1?O=pe.get(w).__webglMultisampledFramebuffer:Array.isArray(st)?O=st[q]:O=st,P.copy(w.viewport),k.copy(w.scissor),U=w.scissorTest}else P.copy(me).multiplyScalar(z).floor(),k.copy(Ie).multiplyScalar(z).floor(),U=Ke;if(j.bindFramebuffer(L.FRAMEBUFFER,O)&&Y&&j.drawBuffers(w,O),j.viewport(P),j.scissor(k),j.setScissorTest(U),ye){let Ge=pe.get(w.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ge.__webglTexture,q)}else if(Pe){let Ge=pe.get(w.texture),Qe=F||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ge.__webglTexture,q||0,Qe)}M=-1},this.readRenderTargetPixels=function(w,F,q,Y,O,ye,Pe){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ze=pe.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Pe!==void 0&&(ze=ze[Pe]),ze){j.bindFramebuffer(L.FRAMEBUFFER,ze);try{let Ge=w.texture,Qe=Ge.format,st=Ge.type;if(!X.textureFormatReadable(Qe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!X.textureTypeReadable(st)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=w.width-Y&&q>=0&&q<=w.height-O&&L.readPixels(F,q,Y,O,Le.convert(Qe),Le.convert(st),ye)}finally{let Ge=R!==null?pe.get(R).__webglFramebuffer:null;j.bindFramebuffer(L.FRAMEBUFFER,Ge)}}},this.readRenderTargetPixelsAsync=async function(w,F,q,Y,O,ye,Pe){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ze=pe.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Pe!==void 0&&(ze=ze[Pe]),ze){let Ge=w.texture,Qe=Ge.format,st=Ge.type;if(!X.textureFormatReadable(Qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!X.textureTypeReadable(st))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=w.width-Y&&q>=0&&q<=w.height-O){j.bindFramebuffer(L.FRAMEBUFFER,ze);let Ve=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Ve),L.bufferData(L.PIXEL_PACK_BUFFER,ye.byteLength,L.STREAM_READ),L.readPixels(F,q,Y,O,Le.convert(Qe),Le.convert(st),0);let vt=R!==null?pe.get(R).__webglFramebuffer:null;j.bindFramebuffer(L.FRAMEBUFFER,vt);let Ct=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await zm(L,Ct,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Ve),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ye),L.deleteBuffer(Ve),L.deleteSync(Ct),ye}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,F=null,q=0){w.isTexture!==!0&&(co("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,w=arguments[1]);let Y=Math.pow(2,-q),O=Math.floor(w.image.width*Y),ye=Math.floor(w.image.height*Y),Pe=F!==null?F.x:0,ze=F!==null?F.y:0;A.setTexture2D(w,0),L.copyTexSubImage2D(L.TEXTURE_2D,q,0,0,Pe,ze,O,ye),j.unbindTexture()},this.copyTextureToTexture=function(w,F,q=null,Y=null,O=0){w.isTexture!==!0&&(co("WebGLRenderer: copyTextureToTexture function signature has changed."),Y=arguments[0]||null,w=arguments[1],F=arguments[2],O=arguments[3]||0,q=null);let ye,Pe,ze,Ge,Qe,st,Ve,vt,Ct,Lt=w.isCompressedTexture?w.mipmaps[O]:w.image;q!==null?(ye=q.max.x-q.min.x,Pe=q.max.y-q.min.y,ze=q.isBox3?q.max.z-q.min.z:1,Ge=q.min.x,Qe=q.min.y,st=q.isBox3?q.min.z:0):(ye=Lt.width,Pe=Lt.height,ze=Lt.depth||1,Ge=0,Qe=0,st=0),Y!==null?(Ve=Y.x,vt=Y.y,Ct=Y.z):(Ve=0,vt=0,Ct=0);let Dn=Le.convert(F.format),Mt=Le.convert(F.type),We;F.isData3DTexture?(A.setTexture3D(F,0),We=L.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(A.setTexture2DArray(F,0),We=L.TEXTURE_2D_ARRAY):(A.setTexture2D(F,0),We=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,F.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,F.unpackAlignment);let Ti=L.getParameter(L.UNPACK_ROW_LENGTH),Et=L.getParameter(L.UNPACK_IMAGE_HEIGHT),ei=L.getParameter(L.UNPACK_SKIP_PIXELS),er=L.getParameter(L.UNPACK_SKIP_ROWS),Hn=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,Lt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Lt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ge),L.pixelStorei(L.UNPACK_SKIP_ROWS,Qe),L.pixelStorei(L.UNPACK_SKIP_IMAGES,st);let Qr=w.isDataArrayTexture||w.isData3DTexture,Dt=F.isDataArrayTexture||F.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){let fi=pe.get(w),eo=pe.get(F),Vn=pe.get(fi.__renderTarget),Yi=pe.get(eo.__renderTarget);j.bindFramebuffer(L.READ_FRAMEBUFFER,Vn.__webglFramebuffer),j.bindFramebuffer(L.DRAW_FRAMEBUFFER,Yi.__webglFramebuffer);for(let Zi=0;Zi<ze;Zi++)Qr&&L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,pe.get(w).__webglTexture,O,st+Zi),w.isDepthTexture?(Dt&&L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,pe.get(F).__webglTexture,O,Ct+Zi),L.blitFramebuffer(Ge,Qe,ye,Pe,Ve,vt,ye,Pe,L.DEPTH_BUFFER_BIT,L.NEAREST)):Dt?L.copyTexSubImage3D(We,O,Ve,vt,Ct+Zi,Ge,Qe,ye,Pe):L.copyTexSubImage2D(We,O,Ve,vt,Ct+Zi,Ge,Qe,ye,Pe);j.bindFramebuffer(L.READ_FRAMEBUFFER,null),j.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Dt?w.isDataTexture||w.isData3DTexture?L.texSubImage3D(We,O,Ve,vt,Ct,ye,Pe,ze,Dn,Mt,Lt.data):F.isCompressedArrayTexture?L.compressedTexSubImage3D(We,O,Ve,vt,Ct,ye,Pe,ze,Dn,Lt.data):L.texSubImage3D(We,O,Ve,vt,Ct,ye,Pe,ze,Dn,Mt,Lt):w.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,O,Ve,vt,ye,Pe,Dn,Mt,Lt.data):w.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,O,Ve,vt,Lt.width,Lt.height,Dn,Lt.data):L.texSubImage2D(L.TEXTURE_2D,O,Ve,vt,ye,Pe,Dn,Mt,Lt);L.pixelStorei(L.UNPACK_ROW_LENGTH,Ti),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Et),L.pixelStorei(L.UNPACK_SKIP_PIXELS,ei),L.pixelStorei(L.UNPACK_SKIP_ROWS,er),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Hn),O===0&&F.generateMipmaps&&L.generateMipmap(We),j.unbindTexture()},this.copyTextureToTexture3D=function(w,F,q=null,Y=null,O=0){return w.isTexture!==!0&&(co("WebGLRenderer: copyTextureToTexture3D function signature has changed."),q=arguments[0]||null,Y=arguments[1]||null,w=arguments[2],F=arguments[3],O=arguments[4]||0),co('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,F,q,Y,O)},this.initRenderTarget=function(w){pe.get(w).__webglFramebuffer===void 0&&A.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?A.setTextureCube(w,0):w.isData3DTexture?A.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?A.setTexture2DArray(w,0):A.setTexture2D(w,0),j.unbindTexture()},this.resetState=function(){T=0,S=0,R=null,j.reset(),nt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ki}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorspace=dt._getDrawingBufferColorSpace(e),t.unpackColorSpace=dt._getUnpackColorSpace()}};var Ga=class i{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new ke(e),this.near=t,this.far=n}clone(){return new i(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},vi=class extends tn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new fn,this.environmentIntensity=1,this.environmentRotation=new fn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var Hh=class extends Rn{constructor(e=null,t=1,n=1,s,r,o,a,l,c=An,h=An,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var bo=class extends Ht{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},mr=new Je,Ef=new Je,ga=[],wf=new Hi,B1=new Je,ro=new D,oo=new Fi,ri=class extends D{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new bo(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,B1)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Hi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,mr),wf.copy(e.boundingBox).applyMatrix4(mr),this.boundingBox.union(wf)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Fi),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,mr),oo.copy(e.boundingSphere).applyMatrix4(mr),this.boundingSphere.union(oo)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){let n=this.matrixWorld,s=this.count;if(ro.geometry=this.geometry,ro.material=this.material,ro.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),oo.copy(this.boundingSphere),oo.applyMatrix4(n),e.ray.intersectsSphere(oo)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,mr),Ef.multiplyMatrices(n,mr),ro.matrixWorld=Ef,ro.raycast(e,ga);for(let o=0,a=ga.length;o<a;o++){let l=ga[o];l.instanceId=r,l.object=this,t.push(l)}ga.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new bo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Hh(new Float32Array(s*this.count),s,this.count,bu,mi));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*e;r[l]=a,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};var Fh=class extends gi{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Va=new C,Wa=new C,Sf=new Je,ao=new yo,va=new Fi,Lc=new C,Tf=new C,Oh=class extends tn{constructor(e=new xt,t=new Fh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Va.fromBufferAttribute(t,s-1),Wa.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Va.distanceTo(Wa);e.setAttribute("lineDistance",new Ye(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),va.copy(n.boundingSphere),va.applyMatrix4(s),va.radius+=r,e.ray.intersectsSphere(va)===!1)return;Sf.copy(s).invert(),ao.copy(e.ray).applyMatrix4(Sf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=c){let p=h.getX(v),y=h.getX(v+1),_=xa(this,e,ao,l,p,y);_&&t.push(_)}if(this.isLineLoop){let v=h.getX(m-1),g=h.getX(f),p=xa(this,e,ao,l,v,g);p&&t.push(p)}}else{let f=Math.max(0,o.start),m=Math.min(d.count,o.start+o.count);for(let v=f,g=m-1;v<g;v+=c){let p=xa(this,e,ao,l,v,v+1);p&&t.push(p)}if(this.isLineLoop){let v=xa(this,e,ao,l,m-1,f);v&&t.push(v)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function xa(i,e,t,n,s,r){let o=i.geometry.attributes.position;if(Va.fromBufferAttribute(o,s),Wa.fromBufferAttribute(o,r),t.distanceSqToSegment(Va,Wa,Lc,Tf)>n)return;Lc.applyMatrix4(i.matrixWorld);let l=e.ray.origin.distanceTo(Lc);if(!(l<e.near||l>e.far))return{distance:l,point:Tf.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,barycoord:null,object:i}}var Af=new C,Rf=new C,Xa=class extends Oh{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Af.fromBufferAttribute(t,s),Rf.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Af.distanceTo(Rf);e.setAttribute("lineDistance",new Ye(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var zh=class extends gi{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new ke(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Cf=new Je,Gh=new yo,ya=new Fi,_a=new C,qa=class extends tn{constructor(e=new xt,t=new zh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ya.copy(n.boundingSphere),ya.applyMatrix4(s),ya.radius+=r,e.ray.intersectsSphere(ya)===!1)return;Cf.copy(s).invert(),Gh.copy(e.ray).applyMatrix4(Cf);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let m=d,v=f;m<v;m++){let g=c.getX(m);_a.fromBufferAttribute(u,g),Pf(_a,g,l,s,e,t,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let m=d,v=f;m<v;m++)_a.fromBufferAttribute(u,m),Pf(_a,m,l,s,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Pf(i,e,t,n,s,r,o){let a=Gh.distanceSqToPoint(i);if(a<t){let l=new C;Gh.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Ya=class extends Rn{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=An,this.minFilter=An,this.generateMipmaps=!1,this.needsUpdate=!0}};var Pt=class extends Rn{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},qn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){let n=this.getLengths(),s=0,r=n.length,o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);let h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);let o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new ue:new C);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){let n=new C,s=[],r=[],o=[],a=new C,l=new Je;for(let f=0;f<=e;f++){let m=f/e;s[f]=this.getTangentAt(m,new C)}r[0]=new C,o[0]=new C;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();let m=Math.acos(en(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,m))}o[f].crossVectors(s[f],r[f])}if(t===!0){let f=Math.acos(en(r[0].dot(r[e]),-1,1));f/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(f=-f);for(let m=1;m<=e;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],f*m)),o[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Mo=class extends qn{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new ue){let n=t,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);let a=this.aStartAngle+e*r,l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Vh=class extends Mo{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Ru(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){let o=r*r,a=o*r;return i+e*r+t*o+n*a}}}var ba=new C,Dc=new Ru,kc=new Ru,Uc=new Ru,Wh=class extends qn{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new C){let n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(ba.subVectors(s[0],s[1]).add(s[0]),c=ba);let u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(ba.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=ba),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),m<1e-4&&(m=v),g<1e-4&&(g=v),Dc.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,m,v,g),kc.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,m,v,g),Uc.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,m,v,g)}else this.curveType==="catmullrom"&&(Dc.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),kc.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Uc.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Dc.calc(l),kc.calc(l),Uc.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new C().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function If(i,e,t,n,s){let r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function H1(i,e){let t=1-i;return t*t*e}function F1(i,e){return 2*(1-i)*i*e}function O1(i,e){return i*i*e}function mo(i,e,t,n){return H1(i,e)+F1(i,t)+O1(i,n)}function z1(i,e){let t=1-i;return t*t*t*e}function G1(i,e){let t=1-i;return 3*t*t*i*e}function V1(i,e){return 3*(1-i)*i*i*e}function W1(i,e){return i*i*i*e}function go(i,e,t,n,s){return z1(i,e)+G1(i,t)+V1(i,n)+W1(i,s)}var Za=class extends qn{constructor(e=new ue,t=new ue,n=new ue,s=new ue){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ue){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(go(e,s.x,r.x,o.x,a.x),go(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Xh=class extends qn{constructor(e=new C,t=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new C){let n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(go(e,s.x,r.x,o.x,a.x),go(e,s.y,r.y,o.y,a.y),go(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Ka=class extends qn{constructor(e=new ue,t=new ue){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ue){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ue){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},qh=class extends qn{constructor(e=new C,t=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new C){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new C){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},$a=class extends qn{constructor(e=new ue,t=new ue,n=new ue){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ue){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(mo(e,s.x,r.x,o.x),mo(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Yh=class extends qn{constructor(e=new C,t=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new C){let n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(mo(e,s.x,r.x,o.x),mo(e,s.y,r.y,o.y),mo(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Ja=class extends qn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ue){let n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(If(a,l.x,c.x,h.x,u.x),If(a,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let s=e.points[t];this.points.push(new ue().fromArray(s))}return this}},Zh=Object.freeze({__proto__:null,ArcCurve:Vh,CatmullRomCurve3:Wh,CubicBezierCurve:Za,CubicBezierCurve3:Xh,EllipseCurve:Mo,LineCurve:Ka,LineCurve3:qh,QuadraticBezierCurve:$a,QuadraticBezierCurve3:Yh,SplineCurve:Ja}),Kh=class extends qn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Zh[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let s=0,r=this.curves;s<r.length;s++){let o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let s=e.curves[t];this.curves.push(new Zh[s.type]().fromJSON(s))}return this}},Eo=class extends Kh{constructor(e){super(),this.type="Path",this.currentPoint=new ue,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new Ka(this.currentPoint.clone(),new ue(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){let r=new $a(this.currentPoint.clone(),new ue(e,t),new ue(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){let a=new Za(this.currentPoint.clone(),new ue(e,t),new ue(n,s),new ue(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),n=new Ja(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){let a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){let c=new Mo(e,t,n,s,r,o,a,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},wo=class i extends xt{constructor(e=[new ue(0,-.5),new ue(.5,0),new ue(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=en(s,0,Math.PI*2);let r=[],o=[],a=[],l=[],c=[],h=1/t,u=new C,d=new ue,f=new C,m=new C,v=new C,g=0,p=0;for(let y=0;y<=e.length-1;y++)switch(y){case 0:g=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,f.x=p*1,f.y=-g,f.z=p*0,v.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(v.x,v.y,v.z);break;default:g=e[y+1].x-e[y].x,p=e[y+1].y-e[y].y,f.x=p*1,f.y=-g,f.z=p*0,m.copy(f),f.x+=v.x,f.y+=v.y,f.z+=v.z,f.normalize(),l.push(f.x,f.y,f.z),v.copy(m)}for(let y=0;y<=t;y++){let _=n+y*h*s,x=Math.sin(_),I=Math.cos(_);for(let T=0;T<=e.length-1;T++){u.x=e[T].x*x,u.y=e[T].y,u.z=e[T].x*I,o.push(u.x,u.y,u.z),d.x=y/t,d.y=T/(e.length-1),a.push(d.x,d.y);let S=l[3*T+0]*x,R=l[3*T+1],M=l[3*T+0]*I;c.push(S,R,M)}}for(let y=0;y<t;y++)for(let _=0;_<e.length-1;_++){let x=_+y*e.length,I=x,T=x+e.length,S=x+e.length+1,R=x+1;r.push(I,T,R),r.push(S,R,T)}this.setIndex(r),this.setAttribute("position",new Ye(o,3)),this.setAttribute("uv",new Ye(a,2)),this.setAttribute("normal",new Ye(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.points,e.segments,e.phiStart,e.phiLength)}},Hs=class i extends wo{constructor(e=1,t=1,n=4,s=8){let r=new Eo;r.absarc(0,-t/2,e,Math.PI*1.5,0),r.absarc(0,t/2,e,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:n,radialSegments:s}}static fromJSON(e){return new i(e.radius,e.length,e.capSegments,e.radialSegments)}},kn=class i extends xt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);let r=[],o=[],a=[],l=[],c=new C,h=new ue;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*s;c.x=e*Math.cos(f),c.y=e*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Ye(o,3)),this.setAttribute("normal",new Ye(a,3)),this.setAttribute("uv",new Ye(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.segments,e.thetaStart,e.thetaLength)}},Xe=class i extends xt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,v=[],g=n/2,p=0;y(),o===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new Ye(u,3)),this.setAttribute("normal",new Ye(d,3)),this.setAttribute("uv",new Ye(f,2));function y(){let x=new C,I=new C,T=0,S=(t-e)/n;for(let R=0;R<=r;R++){let M=[],b=R/r,P=b*(t-e)+e;for(let k=0;k<=s;k++){let U=k/s,H=U*l+a,G=Math.sin(H),N=Math.cos(H);I.x=P*G,I.y=-b*n+g,I.z=P*N,u.push(I.x,I.y,I.z),x.set(G,S,N).normalize(),d.push(x.x,x.y,x.z),f.push(U,1-b),M.push(m++)}v.push(M)}for(let R=0;R<s;R++)for(let M=0;M<r;M++){let b=v[M][R],P=v[M+1][R],k=v[M+1][R+1],U=v[M][R+1];(e>0||M!==0)&&(h.push(b,P,U),T+=3),(t>0||M!==r-1)&&(h.push(P,k,U),T+=3)}c.addGroup(p,T,0),p+=T}function _(x){let I=m,T=new ue,S=new C,R=0,M=x===!0?e:t,b=x===!0?1:-1;for(let k=1;k<=s;k++)u.push(0,g*b,0),d.push(0,b,0),f.push(.5,.5),m++;let P=m;for(let k=0;k<=s;k++){let H=k/s*l+a,G=Math.cos(H),N=Math.sin(H);S.x=M*N,S.y=g*b,S.z=M*G,u.push(S.x,S.y,S.z),d.push(0,b,0),T.x=G*.5+.5,T.y=N*.5*b+.5,f.push(T.x,T.y),m++}for(let k=0;k<s;k++){let U=I+k,H=P+k;x===!0?h.push(H,H+1,U):h.push(H+1,H,U),R+=3}c.addGroup(p,R,x===!0?1:2),p+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Gn=class i extends Xe{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new i(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},$h=class i extends xt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new Ye(r,3)),this.setAttribute("normal",new Ye(r.slice(),3)),this.setAttribute("uv",new Ye(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(y){let _=new C,x=new C,I=new C;for(let T=0;T<t.length;T+=3)f(t[T+0],_),f(t[T+1],x),f(t[T+2],I),l(_,x,I,y)}function l(y,_,x,I){let T=I+1,S=[];for(let R=0;R<=T;R++){S[R]=[];let M=y.clone().lerp(x,R/T),b=_.clone().lerp(x,R/T),P=T-R;for(let k=0;k<=P;k++)k===0&&R===T?S[R][k]=M:S[R][k]=M.clone().lerp(b,k/P)}for(let R=0;R<T;R++)for(let M=0;M<2*(T-R)-1;M++){let b=Math.floor(M/2);M%2===0?(d(S[R][b+1]),d(S[R+1][b]),d(S[R][b])):(d(S[R][b+1]),d(S[R+1][b+1]),d(S[R+1][b]))}}function c(y){let _=new C;for(let x=0;x<r.length;x+=3)_.x=r[x+0],_.y=r[x+1],_.z=r[x+2],_.normalize().multiplyScalar(y),r[x+0]=_.x,r[x+1]=_.y,r[x+2]=_.z}function h(){let y=new C;for(let _=0;_<r.length;_+=3){y.x=r[_+0],y.y=r[_+1],y.z=r[_+2];let x=g(y)/2/Math.PI+.5,I=p(y)/Math.PI+.5;o.push(x,1-I)}m(),u()}function u(){for(let y=0;y<o.length;y+=6){let _=o[y+0],x=o[y+2],I=o[y+4],T=Math.max(_,x,I),S=Math.min(_,x,I);T>.9&&S<.1&&(_<.2&&(o[y+0]+=1),x<.2&&(o[y+2]+=1),I<.2&&(o[y+4]+=1))}}function d(y){r.push(y.x,y.y,y.z)}function f(y,_){let x=y*3;_.x=e[x+0],_.y=e[x+1],_.z=e[x+2]}function m(){let y=new C,_=new C,x=new C,I=new C,T=new ue,S=new ue,R=new ue;for(let M=0,b=0;M<r.length;M+=9,b+=6){y.set(r[M+0],r[M+1],r[M+2]),_.set(r[M+3],r[M+4],r[M+5]),x.set(r[M+6],r[M+7],r[M+8]),T.set(o[b+0],o[b+1]),S.set(o[b+2],o[b+3]),R.set(o[b+4],o[b+5]),I.copy(y).add(_).add(x).divideScalar(3);let P=g(I);v(T,b+0,y,P),v(S,b+2,_,P),v(R,b+4,x,P)}}function v(y,_,x,I){I<0&&y.x===1&&(o[_]=y.x-1),x.x===0&&x.z===0&&(o[_]=I/2/Math.PI+.5)}function g(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.vertices,e.indices,e.radius,e.details)}};var yn=class extends Eo{constructor(e){super(e),this.uuid=Gs(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let s=e.holes[t];this.holes.push(new Eo().fromJSON(s))}return this}},X1={triangulate:function(i,e,t=2){let n=e&&e.length,s=n?e[0]*t:i.length,r=rp(i,0,s,t,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,d,f;if(n&&(r=$1(i,e,r,t)),i.length>80*t){a=c=i[0],l=h=i[1];for(let m=t;m<s;m+=t)u=i[m],d=i[m+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-a,h-l),f=f!==0?32767/f:0}return So(r,o,t,a,l,f,0),o}};function rp(i,e,t,n,s){let r,o;if(s===a_(i,e,t,n)>0)for(r=e;r<t;r+=n)o=Lf(r,i[r],i[r+1],o);else for(r=t-n;r>=e;r-=n)o=Lf(r,i[r],i[r+1],o);return o&&rl(o,o.next)&&(Ao(o),o=o.next),o}function Fs(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(rl(t,t.next)||Bt(t.prev,t,t.next)===0)){if(Ao(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function So(i,e,t,n,s,r,o){if(!i)return;!o&&r&&t_(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?Y1(i,n,s,r):q1(i)){e.push(l.i/t|0),e.push(i.i/t|0),e.push(c.i/t|0),Ao(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Z1(Fs(i),e,t),So(i,e,t,n,s,r,2)):o===2&&K1(i,e,t,n,s,r):So(Fs(i),e,t,n,s,r,1);break}}}function q1(i){let e=i.prev,t=i,n=i.next;if(Bt(e,t,n)>=0)return!1;let s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,d=s>r?s>o?s:o:r>o?r:o,f=a>l?a>c?a:c:l>c?l:c,m=n.next;for(;m!==e;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&xr(s,a,r,l,o,c,m.x,m.y)&&Bt(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Y1(i,e,t,n){let s=i.prev,r=i,o=i.next;if(Bt(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,f=a<l?a<c?a:c:l<c?l:c,m=h<u?h<d?h:d:u<d?u:d,v=a>l?a>c?a:c:l>c?l:c,g=h>u?h>d?h:d:u>d?u:d,p=Jh(f,m,e,t,n),y=Jh(v,g,e,t,n),_=i.prevZ,x=i.nextZ;for(;_&&_.z>=p&&x&&x.z<=y;){if(_.x>=f&&_.x<=v&&_.y>=m&&_.y<=g&&_!==s&&_!==o&&xr(a,h,l,u,c,d,_.x,_.y)&&Bt(_.prev,_,_.next)>=0||(_=_.prevZ,x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&xr(a,h,l,u,c,d,x.x,x.y)&&Bt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;_&&_.z>=p;){if(_.x>=f&&_.x<=v&&_.y>=m&&_.y<=g&&_!==s&&_!==o&&xr(a,h,l,u,c,d,_.x,_.y)&&Bt(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;x&&x.z<=y;){if(x.x>=f&&x.x<=v&&x.y>=m&&x.y<=g&&x!==s&&x!==o&&xr(a,h,l,u,c,d,x.x,x.y)&&Bt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Z1(i,e,t){let n=i;do{let s=n.prev,r=n.next.next;!rl(s,r)&&op(s,n,n.next,r)&&To(s,r)&&To(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),Ao(n),Ao(n.next),n=i=r),n=n.next}while(n!==i);return Fs(n)}function K1(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&s_(o,a)){let l=ap(o,a);o=Fs(o,o.next),l=Fs(l,l.next),So(o,e,t,n,s,r,0),So(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function $1(i,e,t,n){let s=[],r,o,a,l,c;for(r=0,o=e.length;r<o;r++)a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=rp(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(i_(c));for(s.sort(J1),r=0;r<s.length;r++)t=j1(s[r],t);return t}function J1(i,e){return i.x-e.x}function j1(i,e){let t=Q1(i,e);if(!t)return e;let n=ap(t,i);return Fs(n,n.next),Fs(t,t.next)}function Q1(i,e){let t=e,n=-1/0,s,r=i.x,o=i.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){let d=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,s=t.x<t.next.x?t:t.next,d===r))return s}t=t.next}while(t!==e);if(!s)return null;let a=s,l=s.x,c=s.y,h=1/0,u;t=s;do r>=t.x&&t.x>=l&&r!==t.x&&xr(o<c?r:n,o,l,c,o<c?n:r,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(r-t.x),To(t,i)&&(u<h||u===h&&(t.x>s.x||t.x===s.x&&e_(s,t)))&&(s=t,h=u)),t=t.next;while(t!==a);return s}function e_(i,e){return Bt(i.prev,i,e.prev)<0&&Bt(e.next,i,i.next)<0}function t_(i,e,t,n){let s=i;do s.z===0&&(s.z=Jh(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,n_(s)}function n_(i){let e,t,n,s,r,o,a,l,c=1;do{for(t=i,i=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,c*=2}while(o>1);return i}function Jh(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function i_(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function xr(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function s_(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!r_(i,e)&&(To(i,e)&&To(e,i)&&o_(i,e)&&(Bt(i.prev,i,e.prev)||Bt(i,e.prev,e))||rl(i,e)&&Bt(i.prev,i,i.next)>0&&Bt(e.prev,e,e.next)>0)}function Bt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function rl(i,e){return i.x===e.x&&i.y===e.y}function op(i,e,t,n){let s=Ea(Bt(i,e,t)),r=Ea(Bt(i,e,n)),o=Ea(Bt(t,n,i)),a=Ea(Bt(t,n,e));return!!(s!==r&&o!==a||s===0&&Ma(i,t,e)||r===0&&Ma(i,n,e)||o===0&&Ma(t,i,n)||a===0&&Ma(t,e,n))}function Ma(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Ea(i){return i>0?1:i<0?-1:0}function r_(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&op(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function To(i,e){return Bt(i.prev,i,i.next)<0?Bt(i,e,i.next)>=0&&Bt(i,i.prev,e)>=0:Bt(i,e,i.prev)<0||Bt(i,i.next,e)<0}function o_(i,e){let t=i,n=!1,s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function ap(i,e){let t=new jh(i.i,i.x,i.y),n=new jh(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Lf(i,e,t,n){let s=new jh(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ao(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function jh(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function a_(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var ss=class i{static area(e){let t=e.length,n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return i.area(e)<0}static triangulateShape(e,t){let n=[],s=[],r=[];Df(e),kf(n,e);let o=e.length;t.forEach(Df);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,kf(n,t[l]);let a=X1.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Df(i){let e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function kf(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}var Yn=class i extends xt{constructor(e=new yn([new ue(.5,.5),new ue(-.5,.5),new ue(-.5,-.5),new ue(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,s=[],r=[];for(let a=0,l=e.length;a<l;a++){let c=e[a];o(c)}this.setAttribute("position",new Ye(s,3)),this.setAttribute("uv",new Ye(r,2)),this.computeVertexNormals();function o(a){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1,d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:f-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,y=t.UVGenerator!==void 0?t.UVGenerator:l_,_,x=!1,I,T,S,R;p&&(_=p.getSpacedPoints(h),x=!0,d=!1,I=p.computeFrenetFrames(h,!1),T=new C,S=new C,R=new C),d||(g=0,f=0,m=0,v=0);let M=a.extractPoints(c),b=M.shape,P=M.holes;if(!ss.isClockWise(b)){b=b.reverse();for(let se=0,he=P.length;se<he;se++){let L=P[se];ss.isClockWise(L)&&(P[se]=L.reverse())}}let U=ss.triangulateShape(b,P),H=b;for(let se=0,he=P.length;se<he;se++){let L=P[se];b=b.concat(L)}function G(se,he,L){return he||console.error("THREE.ExtrudeGeometry: vec does not exist"),se.clone().addScaledVector(he,L)}let N=b.length,$=U.length;function z(se,he,L){let Ne,W,X,j=se.x-he.x,xe=se.y-he.y,pe=L.x-se.x,A=L.y-se.y,E=j*j+xe*xe,V=j*A-xe*pe;if(Math.abs(V)>Number.EPSILON){let Q=Math.sqrt(E),re=Math.sqrt(pe*pe+A*A),te=he.x-xe/Q,He=he.y+j/Q,Ee=L.x-A/re,Re=L.y+pe/re,lt=((Ee-te)*A-(Re-He)*pe)/(j*A-xe*pe);Ne=te+j*lt-se.x,W=He+xe*lt-se.y;let ge=Ne*Ne+W*W;if(ge<=2)return new ue(Ne,W);X=Math.sqrt(ge/2)}else{let Q=!1;j>Number.EPSILON?pe>Number.EPSILON&&(Q=!0):j<-Number.EPSILON?pe<-Number.EPSILON&&(Q=!0):Math.sign(xe)===Math.sign(A)&&(Q=!0),Q?(Ne=-xe,W=j,X=Math.sqrt(E)):(Ne=j,W=xe,X=Math.sqrt(E/2))}return new ue(Ne/X,W/X)}let ne=[];for(let se=0,he=H.length,L=he-1,Ne=se+1;se<he;se++,L++,Ne++)L===he&&(L=0),Ne===he&&(Ne=0),ne[se]=z(H[se],H[L],H[Ne]);let le=[],me,Ie=ne.concat();for(let se=0,he=P.length;se<he;se++){let L=P[se];me=[];for(let Ne=0,W=L.length,X=W-1,j=Ne+1;Ne<W;Ne++,X++,j++)X===W&&(X=0),j===W&&(j=0),me[Ne]=z(L[Ne],L[X],L[j]);le.push(me),Ie=Ie.concat(me)}for(let se=0;se<g;se++){let he=se/g,L=f*Math.cos(he*Math.PI/2),Ne=m*Math.sin(he*Math.PI/2)+v;for(let W=0,X=H.length;W<X;W++){let j=G(H[W],ne[W],Ne);ce(j.x,j.y,-L)}for(let W=0,X=P.length;W<X;W++){let j=P[W];me=le[W];for(let xe=0,pe=j.length;xe<pe;xe++){let A=G(j[xe],me[xe],Ne);ce(A.x,A.y,-L)}}}let Ke=m+v;for(let se=0;se<N;se++){let he=d?G(b[se],Ie[se],Ke):b[se];x?(S.copy(I.normals[0]).multiplyScalar(he.x),T.copy(I.binormals[0]).multiplyScalar(he.y),R.copy(_[0]).add(S).add(T),ce(R.x,R.y,R.z)):ce(he.x,he.y,0)}for(let se=1;se<=h;se++)for(let he=0;he<N;he++){let L=d?G(b[he],Ie[he],Ke):b[he];x?(S.copy(I.normals[se]).multiplyScalar(L.x),T.copy(I.binormals[se]).multiplyScalar(L.y),R.copy(_[se]).add(S).add(T),ce(R.x,R.y,R.z)):ce(L.x,L.y,u/h*se)}for(let se=g-1;se>=0;se--){let he=se/g,L=f*Math.cos(he*Math.PI/2),Ne=m*Math.sin(he*Math.PI/2)+v;for(let W=0,X=H.length;W<X;W++){let j=G(H[W],ne[W],Ne);ce(j.x,j.y,u+L)}for(let W=0,X=P.length;W<X;W++){let j=P[W];me=le[W];for(let xe=0,pe=j.length;xe<pe;xe++){let A=G(j[xe],me[xe],Ne);x?ce(A.x,A.y+_[h-1].y,_[h-1].x+L):ce(A.x,A.y,u+L)}}}Z(),fe();function Z(){let se=s.length/3;if(d){let he=0,L=N*he;for(let Ne=0;Ne<$;Ne++){let W=U[Ne];be(W[2]+L,W[1]+L,W[0]+L)}he=h+g*2,L=N*he;for(let Ne=0;Ne<$;Ne++){let W=U[Ne];be(W[0]+L,W[1]+L,W[2]+L)}}else{for(let he=0;he<$;he++){let L=U[he];be(L[2],L[1],L[0])}for(let he=0;he<$;he++){let L=U[he];be(L[0]+N*h,L[1]+N*h,L[2]+N*h)}}n.addGroup(se,s.length/3-se,0)}function fe(){let se=s.length/3,he=0;ve(H,he),he+=H.length;for(let L=0,Ne=P.length;L<Ne;L++){let W=P[L];ve(W,he),he+=W.length}n.addGroup(se,s.length/3-se,1)}function ve(se,he){let L=se.length;for(;--L>=0;){let Ne=L,W=L-1;W<0&&(W=se.length-1);for(let X=0,j=h+g*2;X<j;X++){let xe=N*X,pe=N*(X+1),A=he+Ne+xe,E=he+W+xe,V=he+W+pe,Q=he+Ne+pe;Oe(A,E,V,Q)}}}function ce(se,he,L){l.push(se),l.push(he),l.push(L)}function be(se,he,L){qe(se),qe(he),qe(L);let Ne=s.length/3,W=y.generateTopUV(n,s,Ne-3,Ne-2,Ne-1);tt(W[0]),tt(W[1]),tt(W[2])}function Oe(se,he,L,Ne){qe(se),qe(he),qe(Ne),qe(he),qe(L),qe(Ne);let W=s.length/3,X=y.generateSideWallUV(n,s,W-6,W-3,W-2,W-1);tt(X[0]),tt(X[1]),tt(X[3]),tt(X[1]),tt(X[2]),tt(X[3])}function qe(se){s.push(l[se*3+0]),s.push(l[se*3+1]),s.push(l[se*3+2])}function tt(se){r.push(se.x),r.push(se.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return c_(t,n,e)}static fromJSON(e,t){let n=[];for(let r=0,o=e.shapes.length;r<o;r++){let a=t[e.shapes[r]];n.push(a)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Zh[s.type]().fromJSON(s)),new i(n,e.options)}},l_={generateTopUV:function(i,e,t,n,s){let r=e[t*3],o=e[t*3+1],a=e[n*3],l=e[n*3+1],c=e[s*3],h=e[s*3+1];return[new ue(r,o),new ue(a,l),new ue(c,h)]},generateSideWallUV:function(i,e,t,n,s,r){let o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],u=e[n*3+2],d=e[s*3],f=e[s*3+1],m=e[s*3+2],v=e[r*3],g=e[r*3+1],p=e[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new ue(o,1-l),new ue(c,1-u),new ue(d,1-m),new ue(v,1-p)]:[new ue(a,1-l),new ue(h,1-u),new ue(f,1-m),new ue(g,1-p)]}};function c_(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];t.shapes.push(r.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var Ro=class i extends $h{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new i(e.radius,e.detail)}};var ls=class i extends xt{constructor(e=new yn([new ue(0,.5),new ue(-.5,-.5),new ue(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let n=[],s=[],r=[],o=[],a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(a,l,h),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new Ye(s,3)),this.setAttribute("normal",new Ye(r,3)),this.setAttribute("uv",new Ye(o,2));function c(h){let u=s.length/3,d=h.extractPoints(t),f=d.shape,m=d.holes;ss.isClockWise(f)===!1&&(f=f.reverse());for(let g=0,p=m.length;g<p;g++){let y=m[g];ss.isClockWise(y)===!0&&(m[g]=y.reverse())}let v=ss.triangulateShape(f,m);for(let g=0,p=m.length;g<p;g++){let y=m[g];f=f.concat(y)}for(let g=0,p=f.length;g<p;g++){let y=f[g];s.push(y.x,y.y,0),r.push(0,0,1),o.push(y.x,y.y)}for(let g=0,p=v.length;g<p;g++){let y=v[g],_=y[0]+u,x=y[1]+u,I=y[2]+u;n.push(_,x,I),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return h_(t,e)}static fromJSON(e,t){let n=[];for(let s=0,r=e.shapes.length;s<r;s++){let o=t[e.shapes[s]];n.push(o)}return new i(n,e.curveSegments)}};function h_(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){let s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}var bt=class i extends xt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new C,d=new C,f=[],m=[],v=[],g=[];for(let p=0;p<=n;p++){let y=[],_=p/n,x=0;p===0&&o===0?x=.5/t:p===n&&l===Math.PI&&(x=-.5/t);for(let I=0;I<=t;I++){let T=I/t;u.x=-e*Math.cos(s+T*r)*Math.sin(o+_*a),u.y=e*Math.cos(o+_*a),u.z=e*Math.sin(s+T*r)*Math.sin(o+_*a),m.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),g.push(T+x,1-_),y.push(c++)}h.push(y)}for(let p=0;p<n;p++)for(let y=0;y<t;y++){let _=h[p][y+1],x=h[p][y],I=h[p+1][y],T=h[p+1][y+1];(p!==0||o>0)&&f.push(_,x,T),(p!==n-1||l<Math.PI)&&f.push(x,I,T)}this.setIndex(f),this.setAttribute("position",new Ye(m,3)),this.setAttribute("normal",new Ye(v,3)),this.setAttribute("uv",new Ye(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var Un=class i extends xt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new C,u=new C,d=new C;for(let f=0;f<=n;f++)for(let m=0;m<=s;m++){let v=m/s*r,g=f/n*Math.PI*2;u.x=(e+t*Math.cos(g))*Math.cos(v),u.y=(e+t*Math.cos(g))*Math.sin(v),u.z=t*Math.sin(g),a.push(u.x,u.y,u.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=s;m++){let v=(s+1)*f+m-1,g=(s+1)*(f-1)+m-1,p=(s+1)*(f-1)+m,y=(s+1)*f+m;o.push(v,g,y),o.push(g,p,y)}this.setIndex(o),this.setAttribute("position",new Ye(a,3)),this.setAttribute("normal",new Ye(l,3)),this.setAttribute("uv",new Ye(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new i(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}};var pt=class extends gi{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Su,this.normalScale=new ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},oi=class extends pt{static get type(){return"MeshPhysicalMaterial"}constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ue(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return en(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new ke(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new ke(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new ke(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var ja=class extends gi{static get type(){return"MeshLambertMaterial"}constructor(e){super(),this.isMeshLambertMaterial=!0,this.color=new ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Su,this.normalScale=new ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new fn,this.combine=gu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}};function wa(i,e,t){return!i||!t&&i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function u_(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Lr=class{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,s=t[n],r=t[n-1];n:{e:{let o;t:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break e}o=t.length;break t}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=t[--n-1],e>=r)break e}o=n,n=0;break t}break n}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Qh=class extends Lr{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Sd,endingEnd:Sd}}intervalChanged_(e,t,n){let s=this.parameterPositions,r=e-2,o=e+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Td:r=e,a=2*t-n;break;case Ad:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Td:o=e,l=2*n-t;break;case Ad:o=1,l=n+s[1]-s[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-t)/(s-t),v=m*m,g=v*m,p=-d*g+2*d*v-d*m,y=(1+d)*g+(-1.5-2*d)*v+(-.5+d)*m+1,_=(-1-f)*g+(1.5+f)*v+.5*m,x=f*g-f*v;for(let I=0;I!==a;++I)r[I]=p*o[h+I]+y*o[c+I]+_*o[l+I]+x*o[u+I];return r}},eu=class extends Lr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(s-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},tu=class extends Lr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}},ai=class{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=wa(t,this.TimeBufferType),this.values=wa(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:wa(e.times,Array),values:wa(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new tu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new eu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Qh(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case Pa:t=this.InterpolantFactoryMethodDiscrete;break;case bh:t=this.InterpolantFactoryMethodLinear;break;case rc:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Pa;case this.InterpolantFactoryMethodLinear:return bh;case this.InterpolantFactoryMethodSmooth:return rc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e}return this}trim(e,t){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(s!==void 0&&u_(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===rc,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(s)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let v=t[u+m];if(v!==t[d+m]||v!==t[f+m]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};ai.prototype.TimeBufferType=Float32Array;ai.prototype.ValueBufferType=Float32Array;ai.prototype.DefaultInterpolation=bh;var Os=class extends ai{constructor(e,t,n){super(e,t,n)}};Os.prototype.ValueTypeName="bool";Os.prototype.ValueBufferType=Array;Os.prototype.DefaultInterpolation=Pa;Os.prototype.InterpolantFactoryMethodLinear=void 0;Os.prototype.InterpolantFactoryMethodSmooth=void 0;var nu=class extends ai{};nu.prototype.ValueTypeName="color";var iu=class extends ai{};iu.prototype.ValueTypeName="number";var su=class extends Lr{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(s-t),c=e*a;for(let h=c+a;c!==h;c+=4)$t.slerpFlat(r,0,o,c-a,o,c,l);return r}},Qa=class extends ai{InterpolantFactoryMethodLinear(e){return new su(this.times,this.values,this.getValueSize(),e)}};Qa.prototype.ValueTypeName="quaternion";Qa.prototype.InterpolantFactoryMethodSmooth=void 0;var zs=class extends ai{constructor(e,t,n){super(e,t,n)}};zs.prototype.ValueTypeName="string";zs.prototype.ValueBufferType=Array;zs.prototype.DefaultInterpolation=Pa;zs.prototype.InterpolantFactoryMethodLinear=void 0;zs.prototype.InterpolantFactoryMethodSmooth=void 0;var ru=class extends ai{};ru.prototype.ValueTypeName="vector";var ou=class{constructor(e,t,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null}}},d_=new ou,au=class{constructor(e){this.manager=e!==void 0?e:d_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}};au.DEFAULT_MATERIAL_NAME="__DEFAULT";var Dr=class extends tn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ke(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}},kr=class extends Dr{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ke(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}},Nc=new Je,Uf=new C,Nf=new C,Co=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ue(512,512),this.map=null,this.mapPass=null,this.matrix=new Je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new _o,this._frameExtents=new ue(1,1),this._viewportCount=1,this._viewports=[new At(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;Uf.setFromMatrixPosition(e.matrixWorld),t.position.copy(Uf),Nf.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Nf),t.updateMatrixWorld(),Nc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Nc),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Nc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},lu=class extends Co{constructor(){super(new Kt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){let t=this.camera,n=Rr*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},el=class extends Dr{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.target=new tn,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new lu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Bf=new Je,lo=new C,Bc=new C,cu=class extends Co{constructor(){super(new Kt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ue(4,2),this._viewportCount=6,this._viewports=[new At(2,1,1,1),new At(0,1,1,1),new At(3,1,1,1),new At(1,1,1,1),new At(3,0,1,1),new At(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),lo.setFromMatrixPosition(e.matrixWorld),n.position.copy(lo),Bc.copy(n.position),Bc.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Bc),n.updateMatrixWorld(),s.makeTranslation(-lo.x,-lo.y,-lo.z),Bf.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bf)}},tl=class extends Dr{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new cu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},hu=class extends Co{constructor(){super(new Pr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ur=class extends Dr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(tn.DEFAULT_UP),this.updateMatrix(),this.target=new tn,this.shadow=new hu}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}};var Cu="\\[\\]\\.:\\/",f_=new RegExp("["+Cu+"]","g"),Pu="[^"+Cu+"]",p_="[^"+Cu.replace("\\.","")+"]",m_=/((?:WC+[\/:])*)/.source.replace("WC",Pu),g_=/(WCOD+)?/.source.replace("WCOD",p_),v_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Pu),x_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Pu),y_=new RegExp("^"+m_+g_+v_+x_+"$"),__=["material","materials","bones","map"],uu=class{constructor(e,t,n){let s=n||Ut.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Ut=class i{constructor(e,t,n){this.path=t,this.parsedPath=n||i.parseTrackName(t),this.node=i.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new i.Composite(e,t,n):new i(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(f_,"")}static parseTrackName(e){let t=y_.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);__.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,s=t.propertyName,r=t.propertyIndex;if(e||(e=i.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[s];if(o===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ut.Composite=uu;Ut.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ut.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ut.prototype.GetterByBindingType=[Ut.prototype._getValue_direct,Ut.prototype._getValue_array,Ut.prototype._getValue_arrayElement,Ut.prototype._getValue_toArray];Ut.prototype.SetterByBindingTypeAndVersioning=[[Ut.prototype._setValue_direct,Ut.prototype._setValue_direct_setNeedsUpdate,Ut.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ut.prototype._setValue_array,Ut.prototype._setValue_array_setNeedsUpdate,Ut.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ut.prototype._setValue_arrayElement,Ut.prototype._setValue_arrayElement_setNeedsUpdate,Ut.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ut.prototype._setValue_fromArray,Ut.prototype._setValue_fromArray_setNeedsUpdate,Ut.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Cb=new Float32Array(1);typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:du}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=du);var Oi={uCurve:{value:new ue(0,0)}},b_=`
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
`,Iu=1/700,lp="#define CURVE_K "+Iu.toFixed(8)+`
`,ol=lp+`
uniform vec2 uCurve;
vec4 curveWorld(vec4 w) {
  float d = w.z;
  float b = d * d / (1.0 + abs(d) * CURVE_K);
  w.x += uCurve.x * b;
  w.y += uCurve.y * b;
  return w;
}
`;function xi(i){return i.onBeforeCompile=e=>{e.uniforms.uCurve=Oi.uCurve,e.vertexShader=lp+`uniform vec2 uCurve;
`+e.vertexShader.replace("#include <project_vertex>",b_)},i.customProgramCacheKey=()=>"curved-world",i}var ae={std(i){return xi(new pt(i))},lambert(i){return xi(new ja(i))},basic(i){return xi(new ln(i))},phys(i){return xi(new oi(i))}};var Ze=(i,e,t)=>i<e?e:i>t?t:i,et=(i,e,t)=>i+(e-i)*t;var hs=(i,e,t)=>{let n=Ze((t-i)/(e-i),0,1);return n*n*(3-2*n)},Me=(i=0,e=1)=>i+Math.random()*(e-i),Fr=(i,e)=>Math.floor(Me(i,e+1)),je=i=>i[Math.floor(Math.random()*i.length)],mt=i=>Math.random()<i,Nn=(i,e,t,n)=>et(i,e,1-Math.exp(-t*n)),ku=i=>i<.5?2*i*i:1-Math.pow(-2*i+2,2)/2;function Po(i,e){let t=0;for(let s of i)t+=e(s);let n=Math.random()*t;for(let s of i)if(n-=e(s),n<=0)return s;return i[i.length-1]}function cp(i){let e=i.slice();for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}var Lu=new Map;function al(i,e){let t=i+":"+e;return Lu.has(t)||Lu.set(t,new Intl.NumberFormat("de-DE",{minimumFractionDigits:i,maximumFractionDigits:e})),Lu.get(t)}var rn=(i,e=0)=>al(e,e).format(i),yi=(i,e=2)=>al(e,e).format(i/1e3)+" km",Uu=(i,e=0)=>al(e,e).format(i)+"\xA0\u20AC",qt=i=>al(2,2).format(i)+"\xA0\u20AC";function Or(i){let e=Math.floor(i)%1440,t=Math.floor(e/60),n=e%60;return String(t).padStart(2,"0")+":"+String(n).padStart(2,"0")}function Io(i){let e=Math.max(0,Math.round(i));return Math.floor(e/60)+":"+String(e%60).padStart(2,"0")}function Bn(i){let e=i>>>0;return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function Du(i,e=0){let t=Math.floor(i),n=i-t,s=o=>{let a=Math.sin((o+e*101.3)*127.1)*43758.5453;return a-Math.floor(a)},r=n*n*(3-2*n);return et(s(t),s(t+1),r)*2-1}function us(i,e=0){return Du(i,e)*.6+Du(i*2.13,e+7)*.3+Du(i*4.7,e+13)*.1}var up=8;function dp(i){up=i}function pn(i,e){let t=document.createElement("canvas");return t.width=i,t.height=e,t}function _n(i,{repeat:e=!1,srgb:t=!0,aniso:n=!0}={}){let s=new Pt(i);return t&&(s.colorSpace=ht),e&&(s.wrapS=s.wrapT=Ni),n&&(s.anisotropy=up),s.needsUpdate=!0,s}function Bu(i,e,t,n,s,r=1,o=1){let a=Bn(r),l=i.getImageData(0,0,e,t),c=l.data;for(let h=0;h<t;h+=o)for(let u=0;u<e;u+=o){let d=(a()-.5)*s;for(let f=0;f<o&&h+f<t;f++)for(let m=0;m<o&&u+m<e;m++){let v=((h+f)*e+(u+m))*4;c[v]=n[0]+d,c[v+1]=n[1]+d,c[v+2]=n[2]+d,c[v+3]=255}}i.putImageData(l,0,0)}var Ue={laneWidth:3.75,lanes:4,left:-8.25,right:10.5,width:18.75,texLength:36,laneCenter:i=>-5.625+i*3.75};function fp(){let t=pn(512,1024),n=t.getContext("2d");Bu(n,512,1024,[88,89,92],26,7,1);let s=c=>(c-Ue.left)/Ue.width*512,r=c=>c/Ue.texLength*1024,o=Bn(42);for(let c=0;c<18;c++){let h=o()<.5?64:112;n.fillStyle=`rgba(${h},${h},${h+4},${.1+o()*.1})`;let u=o()*512,d=o()*1024;n.fillRect(u,d,20+o()*90,30+o()*160)}for(let c=0;c<4;c++){let h=Ue.laneCenter(c);for(let u of[-.85,.85]){let d=n.createLinearGradient(s(h+u-.4),0,s(h+u+.4),0);d.addColorStop(0,"rgba(40,40,44,0)"),d.addColorStop(.5,"rgba(40,40,44,0.32)"),d.addColorStop(1,"rgba(40,40,44,0)"),n.fillStyle=d,n.fillRect(s(h+u-.4),0,s(h+u+.4)-s(h+u-.4),1024)}}n.fillStyle="rgba(140,140,140,0.08)",n.fillRect(s(7.5),0,s(Ue.right)-s(7.5),1024);let a="#eceae2";n.fillStyle=a;for(let c=1;c<4;c++){let h=-7.5+c*3.75;for(let u=0;u<Ue.texLength;u+=18)n.fillRect(s(h-.075),r(u),s(h+.075)-s(h-.075),r(6))}n.fillRect(s(-7.5-.3),0,s(-7.5)-s(-7.8),1024),n.fillRect(s(7.5),0,s(7.8)-s(7.5),1024),n.fillRect(s(Ue.right-.35),0,s(Ue.right-.15)-s(Ue.right-.35),1024),n.globalAlpha=.25,pp(n,512,1024,3e3,"rgba(70,70,74,1)",13),n.globalAlpha=1;let l=_n(t,{repeat:!0});return l.repeat.set(1,1),l}function pp(i,e,t,n,s,r){let o=Bn(r);i.fillStyle=s;for(let a=0;a<n;a++)i.fillRect(o()*e,o()*t,1+o()*2,1+o()*2)}function mp(){let e=pn(1024,1024),t=e.getContext("2d"),n=Bn(99);t.fillStyle="#5f8a3a",t.fillRect(0,0,1024,1024);let s=["#6a9a3c","#7fae45","#5a8434","#c9b24a","#e1cf3a","#8a9a4a","#6f8f3c","#a08a52","#b6a35a","#4f7a30"],r=0;for(;r<1024;){let o=60+n()*180,a=0;for(;a<1024;){let l=80+n()*260;t.fillStyle=s[Math.floor(n()*s.length)],t.fillRect(a,r,l,o),t.strokeStyle="rgba(0,0,0,0.06)",t.lineWidth=2;let c=n()<.5;for(let h=0;h<(c?l:o);h+=7)t.beginPath(),c?(t.moveTo(a+h,r),t.lineTo(a+h,r+o)):(t.moveTo(a,r+h),t.lineTo(a+l,r+h)),t.stroke();a+=l}r+=o}t.strokeStyle="rgba(190,175,140,0.6)",t.lineWidth=5;for(let o=0;o<4;o++)t.beginPath(),t.moveTo(n()*1024,0),t.lineTo(n()*1024,1024),t.stroke();return t.globalAlpha=.18,pp(t,1024,1024,2e4,"rgba(30,50,20,1)",5),t.globalAlpha=1,_n(e,{repeat:!0})}function gp(){let e=pn(256,256),t=e.getContext("2d");return Bu(t,256,256,[92,128,58],34,3,2),_n(e,{repeat:!0})}function vp(){let i=pn(64,64),e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,64);return t.addColorStop(0,"#c9ccd0"),t.addColorStop(.18,"#8d9296"),t.addColorStop(.35,"#dfe2e5"),t.addColorStop(.5,"#9aa0a5"),t.addColorStop(.65,"#e2e4e6"),t.addColorStop(.82,"#8b9094"),t.addColorStop(1,"#bfc3c7"),e.fillStyle=t,e.fillRect(0,0,64,64),e.fillStyle="rgba(60,60,60,0.5)",e.fillRect(30,26,4,12),_n(i,{repeat:!0})}var Nu=new Map;function cl(i){if(Nu.has(i))return Nu.get(i);let e=pn(256,56),t=e.getContext("2d");t.fillStyle="#f5f5f0",t.fillRect(0,0,256,56),t.strokeStyle="#111",t.lineWidth=3,t.strokeRect(2,2,252,52),t.fillStyle="#1d3f9a",t.fillRect(3,3,26,50),t.fillStyle="#ffd400",t.beginPath(),t.arc(16,18,7,0,Math.PI*2),t.setLineDash([2,2]),t.strokeStyle="#ffd400",t.lineWidth=2,t.stroke(),t.setLineDash([]),t.fillStyle="#fff",t.font="bold 15px Arial",t.textAlign="center",t.fillText("D",16,47),t.fillStyle="#111",t.font='bold 38px "DIN Alternate", "Arial Narrow", Arial, sans-serif',t.textBaseline="middle",t.fillText(i,142,30);let n=_n(e);return Nu.set(i,n),n}function zr({w:i=512,h:e=512,bg:t=null,color:n="#f4f4f4"}={}){let s=pn(i,e),r=s.getContext("2d");t&&(r.fillStyle=t,r.fillRect(0,0,i,e)),r.fillStyle=n;let o=e*.5,a=[[.18,.1,.12],[.29,.07,.2],[.37,.06,.28],[.44,.08,.36],[.53,.06,.3],[.6,.07,.22],[.68,.06,.26],[.75,.08,.15]];for(let[c,h,u]of a)r.fillRect(i*c,o-e*u,i*h,e*u);return r.fillRect(i*.39,o-e*.36,i*.012,e*.08),r.fillRect(i*.15,o,i*.7,e*.025),r.font=`900 ${Math.round(e*.3)}px "Arial Black", Impact, sans-serif`,r.textAlign="center",r.textBaseline="top",r.fillText("LIVE",i/2,o+e*.05),_n(s)}function xp(){let i=pn(1024,64),e=i.getContext("2d");e.fillStyle="#3b2c22",e.fillRect(0,0,1024,64);let t=Bn(5);for(let n=0;n<90;n++){e.strokeStyle=`rgba(${20+t()*40},${15+t()*25},${10+t()*15},${.3+t()*.4})`,e.lineWidth=1+t()*2,e.beginPath();let s=t()*64;e.moveTo(0,s);for(let r=0;r<=1024;r+=64)e.lineTo(r,s+Math.sin(r*.01+n)*3+(t()-.5)*2);e.stroke()}return _n(i,{repeat:!0})}function hl(i=1){let t=pn(128,128),n=t.getContext("2d");return Bu(n,128,128,[200,200,200],70,i,1),_n(t,{repeat:!0,srgb:!1})}function yp(){let e=pn(256,256),t=e.getContext("2d");t.fillStyle="#1b1c1e",t.fillRect(0,0,256,256);let n=256/2,s=t.createRadialGradient(n,n,10,n,n,n);s.addColorStop(0,"#9da2a7"),s.addColorStop(.75,"#7c8186"),s.addColorStop(1,"#4b4f53"),t.fillStyle=s,t.beginPath(),t.arc(n,n,n*.92,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(30,30,30,0.6)",t.lineWidth=6;for(let r=0;r<5;r++){let o=r/5*Math.PI*2;t.beginPath(),t.moveTo(n+Math.cos(o)*30,n+Math.sin(o)*30),t.quadraticCurveTo(n+Math.cos(o+.5)*80,n+Math.sin(o+.5)*80,n+Math.cos(o+.9)*112,n+Math.sin(o+.9)*112),t.stroke()}return t.fillStyle="#2a2c2e",t.beginPath(),t.arc(n,n,20,0,Math.PI*2),t.fill(),_n(e)}function ul(){let e=pn(64,64),t=e.getContext("2d"),n=t.createRadialGradient(32,32,0,32,32,32);return n.addColorStop(0,"rgba(255,255,255,1)"),n.addColorStop(.5,"rgba(255,255,255,0.4)"),n.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=n,t.fillRect(0,0,64,64),_n(e,{aniso:!1})}var ll=null;function dl(){if(ll)return ll;let i=64,e=128,t=pn(i,e),n=t.getContext("2d"),s=n.createImageData(i,e);for(let r=0;r<e;r++)for(let o=0;o<i;o++){let a=Math.abs((o+.5)/i*2-1),l=Math.abs((r+.5)/e*2-1),c=Math.pow(Math.pow(a,5)+Math.pow(l,5),1/5),h=Math.min(1,Math.max(0,(1-c)/.42)),u=h*h*(3-2*h);s.data[(r*i+o)*4+3]=Math.round(u*255)}return n.putImageData(s,0,0),ll=_n(t,{aniso:!1,srgb:!1}),ll}function Gr(i,{w:e=512,h:t=256,bg:n="#1452a8",fg:s="#ffffff",border:r=!0,arrows:o=null}={}){let a=pn(e,t),l=a.getContext("2d");l.fillStyle=n,Ft(l,0,0,e,t,18),l.fill(),r&&(l.strokeStyle=s,l.lineWidth=7,Ft(l,10,10,e-20,t-20,12),l.stroke()),l.fillStyle=s,l.textBaseline="middle";let c=i.length,h=(t-40)/Math.max(1,c);return i.forEach((u,d)=>{let f=20+h*(d+.5),m=Math.min(h*.62,64);l.font=`bold ${m}px "DIN Alternate", "Arial Narrow", Arial, sans-serif`,typeof u=="string"?(l.textAlign="left",hp(l,u,34,f,e-68)):(l.textAlign="left",hp(l,u.left,34,f,e*.68),u.right&&(l.textAlign="right",l.fillText(u.right,e-34,f)))}),o&&(l.strokeStyle=s,l.lineWidth=9,o.forEach(u=>{let d=e*u;l.beginPath(),l.moveTo(d,t-26),l.lineTo(d,t-70),l.stroke(),l.beginPath(),l.moveTo(d-14,t-58),l.lineTo(d,t-76),l.lineTo(d+14,t-58),l.stroke()})),_n(a)}function hp(i,e,t,n,s){let r=parseFloat(i.font.match(/(\d+(\.\d+)?)px/)[1]);for(;i.measureText(e).width>s&&r>12;)r-=2,i.font=i.font.replace(/\d+(\.\d+)?px/,r+"px");i.fillText(e,t,n)}function Ft(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}function _p(i,e){let s=pn(512,320),r=s.getContext("2d");return r.fillStyle="#6b3d22",Ft(r,0,0,512,320,16),r.fill(),r.strokeStyle="#fff",r.lineWidth=6,Ft(r,10,10,492,300,10),r.stroke(),r.fillStyle="#fff",r.textAlign="center",r.textBaseline="middle",r.font="bold 44px Arial, sans-serif",Lo(r,i,512/2,320*.42,452),r.font="30px Arial, sans-serif",Lo(r,e,512/2,320*.72,452),_n(s)}function Lo(i,e,t,n,s){let r=parseFloat(i.font.match(/(\d+(\.\d+)?)px/)[1]);for(;i.measureText(e).width>s&&r>12;)r-=2,i.font=i.font.replace(/\d+(\.\d+)?px/,r+"px");i.fillText(e,t,n)}function bp(i){let t=pn(256,256),n=t.getContext("2d");if(n.clearRect(0,0,256,256),i==="ende"){n.fillStyle="#fff",n.beginPath(),n.arc(128,128,120,0,Math.PI*2),n.fill(),n.strokeStyle="#222",n.lineWidth=4,n.stroke(),n.save(),n.beginPath(),n.arc(128,128,116,0,Math.PI*2),n.clip(),n.strokeStyle="#333",n.lineWidth=8;for(let s=-5;s<=5;s++)n.beginPath(),n.moveTo(40+s*14,236),n.lineTo(236+s*14,40),n.stroke();n.restore()}else n.fillStyle="#d4141b",n.beginPath(),n.arc(128,128,122,0,Math.PI*2),n.fill(),n.fillStyle="#fff",n.beginPath(),n.arc(128,128,92,0,Math.PI*2),n.fill(),n.fillStyle="#111",n.font='bold 92px "DIN Alternate", Arial, sans-serif',n.textAlign="center",n.textBaseline="middle",n.fillText(String(i),128,134);return _n(t)}function Mp(i,e,t="#f2f2f2",n="#c8102e"){let o=pn(1024,256),a=o.getContext("2d");a.fillStyle=t,a.fillRect(0,0,1024,256);for(let l=0;l<1024;l+=64)a.fillStyle="rgba(0,0,0,0.05)",a.fillRect(l,0,6,256);return a.fillStyle=n,a.fillRect(0,222,1024,20),a.fillStyle=n,a.font='italic 900 92px "Arial Black", Arial, sans-serif',a.textAlign="center",a.textBaseline="middle",Lo(a,i,1024/2,256*.4,944),a.fillStyle="#333",a.font="bold 34px Arial, sans-serif",Lo(a,e,1024/2,256*.72,904),_n(o)}function Ep(i="Abstand halten!"){let n=pn(256,256),s=n.getContext("2d");s.fillStyle="#e9e9e4",s.fillRect(0,0,256,256),s.fillStyle="#c9c9c4",s.fillRect(256/2-2,0,4,256),s.strokeStyle="#9a9a96",s.lineWidth=6,s.strokeRect(6,6,244,244),s.fillStyle="#333",s.font="bold 22px Arial, sans-serif",s.textAlign="center",Lo(s,i,256/2,256*.3,226);for(let r=0;r<256;r+=32)s.fillStyle=r/32%2?"#d01818":"#ffffff",s.fillRect(r,230,32,18);return _n(n)}function wp(){let e=pn(64,64),t=e.getContext("2d"),n=t.createImageData(64,64);for(let s=0;s<64;s++)for(let r=0;r<64;r++){let o=(r-32+.5)/32,a=(s-64/2+.5)/(64/2),l=o*o+a*a,c=(s*64+r)*4;if(l<1){let h=Math.sqrt(1-l);n.data[c]=128+o*127*(1-h*.3),n.data[c+1]=128+a*127*(1-h*.3),n.data[c+2]=255*Math.min(1,h*1.6),n.data[c+3]=255*Math.min(1,(1-l)*4)}else n.data[c+3]=0}return t.putImageData(n,0,0),e}var ds=-9,li=i=>2*ds-i,Hu=140,Sp=1700;function M_(i=Hu,e=Sp){let t=[],n=i;for(;n>-e;)t.push(n),n-=2+Math.abs(n)*.018;return t.push(-e),t}var E_=M_();function Do(i,e=E_){let t=[],n=[],s=[],r=0;for(let a of i){let{a:l,b:c,uv:h}=a;for(let u=0;u<e.length;u++){let d=e[u];t.push(l[0],l[1],d,c[0],c[1],d);let f=h(l[0],l[1],d,0),m=h(c[0],c[1],d,1);n.push(f[0],f[1],m[0],m[1])}for(let u=0;u<e.length-1;u++){let d=r+u*2;a.flip?s.push(d,d+2,d+1,d+1,d+2,d+3):s.push(d,d+1,d+2,d+1,d+3,d+2)}r+=e.length*2}let o=new xt;return o.setAttribute("position",new Ye(t,3)),o.setAttribute("uv",new Ye(n,2)),o.setIndex(s),o.computeVertexNormals(),o}var fl=class{constructor(e){this.group=new we,this.group.name="Road",e.add(this.group),this.s=0,this.wet=0,this.roadTex=fp(),this.roadMat=ae.std({map:this.roadTex,roughness:.88,metalness:0,envMapIntensity:.6});let t=Ue.texLength,n=(N,$,z)=>[(N-Ue.left)/Ue.width,-z/t],s=(N,$,z)=>[(li(N)-Ue.left)/Ue.width,-z/t],r=Do([{a:[Ue.left,0],b:[Ue.right,0],uv:n},{a:[li(Ue.right),0],b:[li(Ue.left),0],uv:s}]);this.road=new D(r,this.roadMat),this.road.receiveShadow=!0,this.road.frustumCulled=!1,this.group.add(this.road),this.grassTex=gp(),this.grassTex.repeat.set(1,1),this.grassMat=ae.lambert({map:this.grassTex});let o=(N,$,z)=>[N/6,-z/6],a=Do([{a:[Ue.right,0],b:[Ue.right+3.2,.15],uv:o},{a:[Ue.right+3.2,.15],b:[36,.25],uv:o},{a:[li(Ue.left),0],b:[Ue.left,0],uv:o},{a:[-52,.25],b:[li(Ue.right)-3.2,.15],uv:o},{a:[li(Ue.right)-3.2,.15],b:[li(Ue.right),0],uv:o}]);this.verge=new D(a,this.grassMat),this.verge.receiveShadow=!0,this.verge.frustumCulled=!1,this.group.add(this.verge),this.fieldTex=mp(),this.fieldMat=ae.lambert({map:this.fieldTex});let l=(N,$,z)=>[N/160,-z/160],c=Do([{a:[36,.25],b:[420,.25],uv:l},{a:[420,.25],b:[2600,-6],uv:l},{a:[-420,.25],b:[-52,.25],uv:l},{a:[-2600,-6],b:[-420,.25],uv:l}]);this.ground=new D(c,this.fieldMat),this.ground.receiveShadow=!0,this.ground.frustumCulled=!1,this.group.add(this.ground),this.railTex=vp(),this.railMat=ae.std({map:this.railTex,metalness:.75,roughness:.38,envMapIntensity:.9,side:ft});let h=(N,$,z,ne)=>[-z/4,ne],u=[],d=(N,$)=>{u.push({a:[N,.52],b:[N,.84],uv:h,flip:$>0}),u.push({a:[N-.08*$,.84],b:[N,.84+.01],uv:h,flip:$<0})};d(ds+.16,1),d(ds-.16,-1),d(Ue.right+.55,-1),d(li(Ue.right)-.55,1),this.rails=new D(Do(u),this.railMat),this.rails.castShadow=!1,this.rails.receiveShadow=!0,this.rails.frustumCulled=!1,this.group.add(this.rails);let f=new Fe(.1,.8,.07);f.translate(0,.4,0);let m=ae.std({color:9343896,metalness:.6,roughness:.5});this.postSpacing=2;let v=[ds,Ue.right+.72,li(Ue.right)-.72],g=Math.floor(700/this.postSpacing);this.posts=new ri(f,m,g*v.length);let p=new Je,y=0;for(let N of v)for(let $=0;$<g;$++)p.makeTranslation(N,0,Hu*.5-$*this.postSpacing),this.posts.setMatrixAt(y++,p);this.posts.frustumCulled=!1,this.posts.castShadow=!0,this.group.add(this.posts),this.delinSpacing=50;let _=new we,x=new Fe(.12,1,.12);x.translate(0,.5,0);let I=new Fe(.125,.25,.125);I.translate(0,.82,0);let T=new $e(.05,.12);T.translate(0,.82,.064);let S=Math.ceil(Sp*.6/this.delinSpacing),R=ae.std({color:15921902,roughness:.6}),M=ae.std({color:1118481,roughness:.6}),b=ae.std({color:16752672,emissive:16742912,emissiveIntensity:.9}),P=new ri(x,R,S),k=new ri(I,M,S),U=new ri(T,b,S);for(let N=0;N<S;N++)p.makeTranslation(Ue.right+1.05,.12,Hu*.5-N*this.delinSpacing),P.setMatrixAt(N,p),k.setMatrixAt(N,p),U.setMatrixAt(N,p);for(let N of[P,k,U])N.frustumCulled=!1,_.add(N);this.delin=_,this.group.add(_),this.laneUniforms={uTime:{value:0},uS:{value:0},uOpacity:{value:0},uWarn:{value:0}};let H=new Xt({uniforms:{...this.laneUniforms,uCurve:{value:null}},vertexShader:ol+`
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
        }`,transparent:!0,depthWrite:!1,blending:os});H.uniforms.uCurve=Oi.uCurve;let G=Do([{a:[Ue.laneCenter(0)-1.8,.025],b:[Ue.laneCenter(0)+1.8,.025],uv:N=>[(N-(Ue.laneCenter(0)-1.8))/3.6,0]}]);this.lane=new D(G,H),this.lane.frustumCulled=!1,this.lane.renderOrder=1,this.lane.visible=!1,this.group.add(this.lane)}setWet(e){this.wet=e,this.roadMat.roughness=.88-e*.62,this.roadMat.color.setScalar(1-e*.42),this.roadMat.envMapIntensity=.6+e*.9,this.railMat.roughness=.38-e*.2,this.grassMat.color.setScalar(1-e*.25),this.fieldMat.color.setScalar(1-e*.28)}update(e,t,n,s,r=0){this.s=e,this.roadTex.offset.y=e/Ue.texLength%1,this.grassTex.offset.y=e/6%1,this.fieldTex.offset.y=e/160%1,this.railTex.offset.x=e/4%1,this.posts.position.z=e%this.postSpacing,this.delin.position.z=e%this.delinSpacing,this.laneUniforms.uTime.value=n,this.laneUniforms.uS.value=e%1120,this.laneUniforms.uOpacity.value=s,this.laneUniforms.uWarn.value=r,this.lane.visible=s>.001}};var w_=`
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`,S_=`
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
}`,pl=class{constructor(e,t,{shadows:n=!0,shadowSize:s=2048}={}){this.renderer=e,this.scene=t,this.overcast=0,this.sunDir=new C(.52,.6,.6).normalize(),this.fogClear=new ke(.66,.78,.92),this.fogRain=new ke(.43,.46,.5),this.fogColor=this.fogClear.clone(),this.uniforms={uSunDir:{value:this.sunDir},uOvercast:{value:0},uOffset:{value:new ue(0,0)},uFog:{value:this.fogColor}};let r=new Xt({uniforms:this.uniforms,vertexShader:w_,fragmentShader:S_,side:xn,depthWrite:!1,depthTest:!0,fog:!1});this.dome=new D(new bt(3e3,40,20),r),this.dome.frustumCulled=!1,this.dome.renderOrder=-10,t.add(this.dome),t.fog=new Ga(this.fogColor,140,1550),t.fog.color=this.fogColor,this.sun=new Ur(16773340,3),this.sun.castShadow=n,this.sun.shadow.mapSize.set(s,s);let o=this.sun.shadow.camera;o.left=-55,o.right=55,o.top=60,o.bottom=-60,o.near=10,o.far=400,o.updateProjectionMatrix(),this.sun.shadow.bias=-5e-4,this.sun.shadow.normalBias=.04,t.add(this.sun),t.add(this.sun.target),this.hemi=new kr(12901631,6253125,1.05),t.add(this.hemi),this.hills=this.buildHills(),t.add(this.hills),this.pmrem=new Ir(e),this.envScene=new vi;let a=new D(new bt(50,32,16),r);this.envScene.add(a),this.envGround=new D(new kn(48,24).rotateX(-Math.PI/2),new ln({color:new ke(.16,.17,.13)})),this.envGround.position.y=-2,this.envScene.add(this.envGround),this.envTarget=null,this.lastEnvOvercast=-1,this.updateEnv()}buildHills(){let n=[],s=[],r=[],o=new ke().setRGB(.3,.42,.33,ht),a=new ke().setRGB(.5,.6,.7,ht),l=d=>25+Math.max(0,us(d*.09,4)*.5+.5)*150+Math.max(0,us(d*.31,9))*40,c=48;for(let d=0;d<=320;d++){let f=d/320*Math.PI*2,m=Math.sin(f)*1950,v=-Math.cos(f)*1950,g=Math.max(0,(d-(320-c))/c),p=g>0?et(l(d),l(d-320),g*g*(3-2*g)):l(d);n.push(m,-40,v,m,p,v);let y=o.clone().lerp(a,.25),_=o.clone().lerp(a,.7+.2*Math.sin(d/320*Math.PI*6));if(s.push(y.r,y.g,y.b,_.r,_.g,_.b),d<320){let x=d*2;r.push(x,x+2,x+1,x+1,x+2,x+3)}}let h=new xt;h.setAttribute("position",new Ye(n,3)),h.setAttribute("color",new Ye(s,3)),h.setIndex(r),this.hillMat=new ln({vertexColors:!0,fog:!1,side:ft,transparent:!0,opacity:1});let u=new D(h,this.hillMat);return u.frustumCulled=!1,u.renderOrder=-5,u}updateEnv(){this.envTarget&&this.envTarget.dispose(),this.envTarget=this.pmrem.fromScene(this.envScene,.02,.1,100),this.scene.environment=this.envTarget.texture,this.lastEnvOvercast=this.overcast,this.onEnv&&this.onEnv(this.envTarget.texture)}setOvercast(e){this.overcast=Ze(e,0,1)}update(e,t,n,s){let r=this.overcast;this.uniforms.uOvercast.value=r;let o=this.uniforms.uOffset.value;o.x+=e*.004,o.y=-n*6e-4-s*.002,this.fogColor.copy(this.fogClear).lerp(this.fogRain,r);let a=this.scene.fog;a.near=et(140,18,r),a.far=et(1550,430,r),this.sun.intensity=et(3,.32,r),this.hemi.intensity=et(1.05,1.35,r),this.hemi.color.setRGB(et(.77,.6,r),et(.86,.64,r),et(1,.7,r)),this.hillMat.opacity=1-r,this.hillMat.color.setRGB(1,1,1).lerp(this.fogColor,.15+r*.6),this.hills.visible=r<.98,this.dome.position.copy(t.position);let l=h=>h*h/(1+h*Iu),c=Oi.uCurve.value;this.hills.position.set(t.position.x+c.x*l(1950)*.7,c.y*l(1950)*.8,0),this.sun.target.position.set(t.position.x*.5,0,-32),this.sun.position.copy(this.sun.target.position).addScaledVector(this.sunDir,200),this.envGround.material.color.setRGB(et(.16,.1,r),et(.17,.11,r),et(.13,.11,r)),Math.abs(r-this.lastEnvOvercast)>.12&&this.updateEnv()}};function It(i,e=!1){let t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},o={},a=i[0].morphTargetsRelative,l=new xt,c=0;for(let h=0;h<i.length;++h){let u=i[h],d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(a!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let f in u.morphAttributes){if(!s.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;o[f]===void 0&&(o[f]=[]),o[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(t){let h=0,u=[];for(let d=0;d<i.length;++d){let f=i[d].index;for(let m=0;m<f.count;++m)u.push(f.getX(m)+h);h+=i[d].attributes.position.count}l.setIndex(u)}for(let h in r){let u=Tp(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(let h in o){let u=o[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){let f=[];for(let v=0;v<o[h].length;++v)f.push(o[h][v][d]);let m=Tp(f);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}return l}function Tp(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){let h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}let o=new e(r),a=new Ht(o,t,n),l=0;for(let c=0;c<i.length;++c){let h=i[c];if(h.isInterleavedBufferAttribute){let u=l/t;for(let d=0,f=h.count;d<f;d++)for(let m=0;m<t;m++){let v=h.getComponent(d,m);a.setComponent(d+u,m,v)}}else o.set(h.array,l);l+=h.count*t}return s!==void 0&&(a.gpuType=s),a}function Cn(i){let e=i.length;return t=>{if(t<=i[0][0])return i[0][1];if(t>=i[e-1][0])return i[e-1][1];let n=0;for(;n<e-2&&t>i[n+1][0];)n++;let s=i[Math.max(0,n-1)],r=i[n],o=i[n+1],a=i[Math.min(e-1,n+2)],l=o[0]-r[0],c=(t-r[0])/l,h=(o[1]-s[1])/(o[0]-s[0]||1)*l,u=(a[1]-r[1])/(a[0]-r[0]||1)*l,d=c*c,f=d*c;return(2*f-3*d+1)*r[1]+(f-2*d+c)*h+(-2*f+3*d)*o[1]+(f-d)*u}}function ml(i,e,t=.4,n=.335){return s=>{let r=i(s);for(let o of e){let a=s-o;Math.abs(a)<t&&(r=Math.max(r,n+Math.sqrt(t*t-a*a)))}return r}}function gl(i,e=.5,t=.72){return(n,s,r)=>{let o=Math.abs(s);if(o<=e)return r;let a=Math.min(1,(o-e)/(t-e));return r+(i(n)-r)*a*a*(3-2*a)}}function fs({w:i,b:e,t,tw:n=.9,bw:s=.96,n:r=4,L:o=4.7,bx:a=null},l,c,h=new C){let u=2/r,d=Math.cos(c),f=Math.sin(c),m=Math.sign(d)*Math.pow(Math.abs(d),u),v=Math.sign(f)*Math.pow(Math.abs(f),u),g=e(l),p=Math.max(t(l),g+.002),y=g+(v+1)/2*(p-g);a&&(y=Math.max(y,Math.min(a(l,m,g),p)));let _=v>0?et(1,n,v):et(1,s,-v);return h.set(m*i(l)*_,y,l-o/2)}function Vs(i,e,{ns:t=6,nt:n=16,lift:s=.006,center:r=new C(0,.75,0)}={}){let o=[],a=[],l=new C,c=new C,h=new C,u=new C,d=.001;for(let p=0;p<=n;p++)for(let y=0;y<=t;y++){let[_,x]=e(y/t,p/n);i(_,x,l),i(_+d,x,c).sub(l),i(_,x+d,h).sub(l),u.crossVectors(c,h),u.lengthSq()<1e-14&&u.set(l.x,l.y-r.y,l.z-r.z),u.normalize(),u.x*l.x+u.y*(l.y-r.y)+u.z*(l.z-r.z)<0&&u.negate(),o.push(l.x+u.x*s,l.y+u.y*s,l.z+u.z*s)}for(let p=0;p<n;p++)for(let y=0;y<t;y++){let _=p*(t+1)+y,x=_+1,I=_+t+1,T=I+1;a.push(_,I,x,x,I,T)}let f=new xt;f.setAttribute("position",new Ye(o,3)),f.setIndex(a),f.computeVertexNormals();let m=new C().fromBufferAttribute(f.attributes.normal,Math.floor((t+1)*(n+1)/2)),v=new C().fromBufferAttribute(f.attributes.position,Math.floor((t+1)*(n+1)/2));if(m.x*v.x+m.y*(v.y-r.y)+m.z*(v.z-r.z)<0){let p=f.index.array;for(let y=0;y<p.length;y+=3){let _=p[y+1];p[y+1]=p[y+2],p[y+2]=_}f.computeVertexNormals()}let g=[];for(let p=0;p<=n;p++)for(let y=0;y<=t;y++)g.push(y/t,p/n);return f.setAttribute("uv",new Ye(g,2)),f}function _i({u0:i,u1:e,w:t,b:n,t:s,tw:r=.9,bw:o=.96,n:a=4,segs:l=80,ring:c=28,L:h=4.7,H:u=1.5,caps:d=!0,sampleEnds:f=.55,bx:m=null,capDome:v=0}){let g=[],p=[],y=[],_=[];for(let k=0;k<=l;k++){let U=k/l,H=(1-Math.cos(Math.PI*U))/2;_.push(i+(e-i)*et(U,H,f))}let x=2/a,I=[];for(let k=0;k<c;k++){let U=k/c*Math.PI*2-Math.PI/2,H=Math.cos(U),G=Math.sin(U);I.push([Math.sign(H)*Math.pow(Math.abs(H),x),Math.sign(G)*Math.pow(Math.abs(G),x)])}for(let k of _){let U=n(k),H=s(k),G=t(k),N=Math.max(H,U+.002);for(let[$,z]of I){let ne=U+(z+1)/2*(N-U);m&&(ne=Math.max(ne,Math.min(m(k,$,U),N)));let le=z>0?et(1,r,z):et(1,o,-z),me=$*G*le;g.push(me,ne,k-h/2),p.push(me<0?k/h:1-k/h,ne/u)}}for(let k=0;k<l;k++)for(let U=0;U<c;U++){let H=k*c+U,G=k*c+(U+1)%c,N=(k+1)*c+U,$=(k+1)*c+(U+1)%c;y.push(H,G,N,G,$,N)}let T=new xt;if(T.setAttribute("position",new Ye(g,3)),T.setAttribute("uv",new Ye(p,2)),T.setIndex(y),T.computeVertexNormals(),!d)return T;let S=Array.from(T.attributes.position.array),R=Array.from(T.attributes.normal.array),M=Array.from(T.attributes.uv.array),b=(k,U)=>{let H=S.length/3,G=0,N=0,$=S[k*c*3+2],z=U?-1:1;for(let le=0;le<c;le++){let me=(k*c+le)*3;if(G+=S[me],N+=S[me+1],S.push(S[me],S[me+1],S[me+2]),v>0){let Ie=R[me],Ke=R[me+1],Z=Math.hypot(Ie,Ke)||1,fe=Ie/Z*v,ve=Ke/Z*v,ce=z*(1-v*.55),be=Math.hypot(fe,ve,ce);R.push(fe/be,ve/be,ce/be)}else R.push(0,0,z);M.push(M[(k*c+le)*2],M[(k*c+le)*2+1])}S.push(G/c,N/c,$),R.push(0,0,U?-1:1),M.push(.5,.5);let ne=H+c;for(let le=0;le<c;le++){let me=H+le,Ie=H+(le+1)%c;U?y.push(ne,Ie,me):y.push(ne,me,Ie)}};b(0,!0),b(l,!1);let P=new xt;return P.setAttribute("position",new Ye(S,3)),P.setAttribute("normal",new Ye(R,3)),P.setAttribute("uv",new Ye(M,2)),P.setIndex(y),T.dispose(),P}function gt(i,e){let t=new ke(e),n=i.attributes.position.count,s=new Float32Array(n*3);for(let r=0;r<n;r++)s[r*3]=t.r,s[r*3+1]=t.g,s[r*3+2]=t.b;return i.setAttribute("color",new Ht(s,3)),i}function ko(i=1,e=-1){let t=d=>e<0?d:-d,n=-.118*i,s=.112*i,r=.062*i,o=.05*i,a=-.058*i,l=-.046*i,c=.055*i,h=.022*i,u=new yn;return u.moveTo(t(n+c),a),u.lineTo(t(s-h),l),u.quadraticCurveTo(t(s),l,t(s),l+h),u.lineTo(t(s),o-h),u.quadraticCurveTo(t(s),o,t(s-h),o),u.lineTo(t(n+c),r),u.quadraticCurveTo(t(n),r,t(n),r-c),u.lineTo(t(n),a+c),u.quadraticCurveTo(t(n),a,t(n+c),a),u}function vl(i=-1){let e=new Yn(ko(1,i),{depth:.07,bevelEnabled:!0,bevelThickness:.014,bevelSize:.011,bevelSegments:4,curveSegments:12});return e.translate(0,0,-.084),e}function Rt(i,e,t,n,s,r,o=0,a=0,l=0){let c=new Fe(i,e,t);return(o||a||l)&&c.applyMatrix4(new Je().makeRotationFromEuler(new fn(o,a,l))),c.translate(n,s,r),c}function Ap(i,e,t=20){let n=[],s=i*.62,r=e/2,o=Math.min(.045,e*.22);n.push(new ue(s,-r)),n.push(new ue(i-o,-r));for(let l=0;l<=4;l++){let c=-Math.PI/2+l/4*(Math.PI/2);n.push(new ue(i-o+Math.cos(c)*o,-r+o+Math.sin(c)*o))}for(let l=0;l<=4;l++){let c=l/4*(Math.PI/2);n.push(new ue(i-o+Math.cos(c)*o,r-o+Math.sin(c)*o))}n.push(new ue(s,r));let a=new wo(n,t);return a.rotateZ(Math.PI/2),a}function Uo(i,e,t,n,s=1,r=20){let o=new kn(i,r);return o.rotateY(s>0?Math.PI/2:-Math.PI/2),o.translate(e,t,n),o}var ps=null;function T_(){if(ps)return ps;let i=512,e=document.createElement("canvas");e.width=i,e.height=i;let t=e.getContext("2d");t.fillStyle="#123a8e",t.fillRect(0,0,i,i);let n=Bn(1887),s=22;for(let r=0;r<i/(s*.8)+2;r++)for(let o=0;o<i/(s*1.6)+2;o++){let a=o*s*1.6+r%2*s*.8,l=r*s*.8,c=n()<.16,h=t.createRadialGradient(a,l-s*.3,2,a,l,s);if(c)h.addColorStop(0,"#ffffff"),h.addColorStop(1,"#cfd8e6");else{let u=.85+n()*.3;h.addColorStop(0,`rgb(${40*u},${95*u},${200*u})`),h.addColorStop(1,`rgb(${14*u},${46*u},${130*u})`)}t.fillStyle=h,t.beginPath(),t.arc(a,l,s,0,Math.PI),t.fill(),t.strokeStyle="rgba(5,20,60,0.55)",t.lineWidth=2,t.beginPath(),t.arc(a,l,s,.1,Math.PI-.1),t.stroke()}return ps=new Pt(e),ps.colorSpace=ht,ps.wrapS=ps.wrapT=Ni,ps.repeat.set(2,1),ps}function xl({curved:i=!0}={}){let e=I=>i?xi(I):I,t=new we;t.name="Elsa";let n=e(new pt({map:T_(),roughness:.45,metalness:.15})),s=e(new pt({color:1920944,roughness:.5,side:ft})),r=e(new pt({color:16777215,roughness:.25})),o=e(new pt({color:723728,roughness:.2})),a=e(new pt({color:15909424,metalness:.9,roughness:.25,emissive:3811328,emissiveIntensity:.3})),l=e(new pt({color:14169162,roughness:.4})),c=e(new pt({color:15331062,roughness:.5})),h=new D(new bt(.3,32,24),n);h.scale.set(1,1.45,.8),h.position.y=.48,t.add(h);let u=new D(new bt(.3,24,14,Math.PI/2-.85,1.7,1.62,.98),c);u.scale.set(1.012,1.45*1.012,.8*1.012),u.position.y=.48,t.add(u);let d=new yn;d.moveTo(0,.12),d.quadraticCurveTo(-.12,.02,-.26,-.08),d.quadraticCurveTo(-.12,-.03,0,-.04),d.quadraticCurveTo(.12,-.03,.26,-.08),d.quadraticCurveTo(.12,.02,0,.12);let f=new D(new Yn(d,{depth:.05,bevelEnabled:!0,bevelSize:.015,bevelThickness:.015,bevelSegments:2}),s);f.position.set(0,.08,-.03),t.add(f);let m=new bt(.09,14,10);m.scale(.35,1,.7);let v=new D(m,s),g=new D(m,s);v.position.set(-.3,.42,.02),g.position.set(.3,.42,.02),v.rotation.z=.7,g.rotation.z=-.7,t.add(v,g);let p=new D(new Gn(.08,.22,3),s);p.scale.set(.3,1,1.4),p.position.set(0,.62,-.23),p.rotation.x=-.6,t.add(p);for(let I of[-1,1]){let T=new D(new bt(.085,20,14),r);T.position.set(I*.13,.7,.17);let S=new D(new bt(.045,16,12),o);S.position.set(I*.145,.7,.24);let R=new D(new bt(.014,8,6),r);R.position.set(I*.13+.02,.72,.28),t.add(T,S,R)}let y=new D(new Un(.07,.016,8,20,Math.PI),l);y.rotation.z=Math.PI,y.position.set(0,.56,.235),t.add(y);let _=new we;_.position.y=.9;let x=new D(new Xe(.15,.14,.07,24,1,!0),a);_.add(x);for(let I=0;I<6;I++){let T=I/6*Math.PI*2,S=new we;S.position.set(Math.sin(T)*.145,.035,Math.cos(T)*.145),S.rotation.y=T;let R=new D(new Gn(.028,.12,6),a);R.position.y=.06;let M=new D(new Gn(.018,.08,5),a);M.position.set(-.03,.04,0),M.rotation.z=.6;let b=M.clone();b.position.x=.03,b.rotation.z=-.6;let P=new D(new bt(.016,8,6),a);P.position.y=.125,S.add(R,M,b,P),_.add(S)}return t.add(_),t.traverse(I=>{I.isMesh&&(I.castShadow=!0)}),t.userData={finL:v,finR:g,crown:_,body:h},t}function yl(i,e,t=0){let n=i.userData;n.finL.rotation.z=.7+Math.sin(e*6)*.35,n.finR.rotation.z=-.7-Math.sin(e*6+1)*.2,i.rotation.z=Math.sin(e*2.2)*.04+t}var Zn=100,Pp=17,Ip=2,zi=Pp+Ip+1,Rp=["Gr\xFC\xDFe an Mini Adam!","Linke Spur freischalten: jetzt!","BrunnenTV Fanclub","Malte Malte Malte","Elsa \u2764","Ehrenmenschen-Br\xFCcke","Rechts fahren, Adam!","Wir streamen in Full HD","Live-Eskalationen immer woanders","Ringtennis-Verein gr\xFC\xDFt","Danke f\xFCr alles \u2764","Bimmel hurra!","Kanalpunkte-Wette l\xE4uft"],Cp=[["Burg Hauneck","Haunetal"],["Wartburg","Eisenach"],["Weser-Skywalk","Beverungen"],["Burg Ronneburg","Ronneburg"],["Elsa","Kassel gr\xFC\xDFt"],["Hochofenwerk Phoenix West","Dortmund"],["BrunnenTV-Studio","Herr Sch\xF6nnbrun"],["Megahub","Lehrte"],["Rh\xF6n","Starlink-Gebiet"],["Zissel","Kassel"],["Skyline","Frankfurt am Main"]],A_=["Kassel","Fulda","Frankfurt","Gifhorn","Hannover","W\xFCrzburg","G\xF6ttingen","Hamburg","Hanau","Siegen","Erlensee","Eisenach","Bad Hersfeld","Dortmund"];function R_(){let i=[],e=new Xe(.16,.24,2.4,6);e.translate(0,1.2,0),i.push(gt(e,4862756));let t=[[2.5,4,1.5],[2.05,3.5,3.4],[1.55,3,5.2],[1,2.5,6.8]];for(let[n,s,r]of t){let o=new Gn(n,s,8);o.translate(0,r+s/2,0),i.push(gt(o,2970928))}return It(i)}function C_(){let i=[],e=new Xe(.2,.3,3.2,6).toNonIndexed();e.translate(0,1.6,0),i.push(gt(e,5914672));let t=[[0,5,0,2.6],[1.3,4.3,.6,1.9],[-1.2,4.5,-.5,2],[.2,6.3,.3,1.7]];for(let[n,s,r,o]of t){let a=new Ro(o,1);a.translate(n,s,r),i.push(gt(a,5012020))}return It(i)}function P_(){let i=[];for(let[e,t,n,s]of[[0,.7,0,1],[.8,.55,.3,.75],[-.7,.5,-.2,.7]]){let r=new Ro(s,1);r.translate(e,t,n),i.push(gt(r,5603127))}return It(i)}function I_(){let i=new Fe(1,1,1);return i.translate(0,.5,0),gt(i,16777215)}function L_(){let i=[],t=(f,m,v,g)=>i.push(...f,...m,...v,...f,...v,...g),n=(f,m,v)=>i.push(...f,...m,...v),r=[-.56,1,-.56],o=[.5+.06,1,-.5-.06],a=[.5+.06,1,.5+.06],l=[-.5-.06,1,.5+.06],c=[0,1+.62,-.5-.06],h=[0,1+.62,.5+.06];t(a,o,c,h),t(r,l,h,c),n(l,a,h),n(o,r,c);let u=new xt;u.setAttribute("position",new Ye(i,3)),u.computeVertexNormals();let d=i.length/3;return u.setAttribute("uv",new Ye(new Float32Array(d*2),2)),gt(u,16777215)}var _l=[16777215,14741728,13164744,15794144,13691096,16774364],D_=[15854816,15327951,16184298,15063480,14275788,15720649,14471872],k_=[10698794,9124390,5978926,3816512,11883054,7023136],bl=class{constructor(e){this.track=new we,this.track.name="Scenery",e.add(this.track),this.slots=Array.from({length:zi},()=>({k:-1,items:[]})),this.requests=[],this.pools=new Map,this.animated=new Set,this.texCache=new Map,this.gantryInfo=()=>({target:"Kassel",km:42}),this.time=0,this.mats={concrete:ae.std({color:12433838,roughness:.92}),concreteDark:ae.std({color:9407620,roughness:.95}),steel:ae.std({color:10133928,metalness:.7,roughness:.4}),dark:ae.std({color:2763566,roughness:.7}),white:ae.std({color:15921903,roughness:.6}),orange:ae.std({color:15231762,roughness:.6}),grass:ae.lambert({color:6261306}),stone:ae.std({color:10985102,roughness:.95}),water:ae.std({color:10276863,roughness:.05,metalness:.2,transparent:!0,opacity:.55,envMapIntensity:1.5}),redRoof:ae.std({color:10698794,roughness:.8}),glassBlue:ae.std({color:6258595,metalness:.8,roughness:.15,envMapIntensity:1.2})},this.makeInstanced()}makeInstanced(){let e=ae.lambert({vertexColors:!0}),t={conifer:[R_(),90],decid:[C_(),60],bush:[P_(),50],house:[I_(),34],roof:[L_(),34]};this.inst={};let n=new Je().makeScale(0,0,0);for(let[s,[r,o]]of Object.entries(t)){let a=s==="house"?ae.lambert({vertexColors:!0}):e,l=new ri(r,a,o*zi);l.frustumCulled=!1,l.castShadow=!0,l.receiveShadow=s==="house"||s==="roof";for(let c=0;c<o*zi;c++)l.setMatrixAt(c,n),l.setColorAt(c,new ke(1,1,1));l.instanceMatrix.setUsage($f),this.track.add(l),this.inst[s]={mesh:l,cap:o}}}acquire(e,t){this.pools.has(e)||this.pools.set(e,[]);let n=this.pools.get(e),s=n.find(r=>!r.userData.active);return s||(s=t(),s.userData.type=e,n.push(s),this.track.add(s)),s.userData.active=!0,s.visible=!0,s}release(e){e.userData.active=!1,e.visible=!1,this.animated.delete(e),e.userData.onRelease&&e.userData.onRelease()}request(e,t,n={}){let s=Math.random().toString(36).slice(2),r={id:s,type:e,s:t,data:n,built:!1};this.requests.push(r);let o=Math.floor(t/Zn),a=this.slots[(o%zi+zi)%zi];return a.k===o&&this.placeRequest(a,r),s}cancel(e,t=!0){let n=this.requests.find(s=>s.id===e);if(n&&(this.requests=this.requests.filter(s=>s!==n),t&&n.built&&n.s>this.track.position.z+150))for(let s of this.slots){let r=s.items.findIndex(o=>o.userData.requestId===e);r>=0&&(this.release(s.items[r]),s.items.splice(r,1))}}reset(){for(let e of this.slots){for(let t of e.items)this.release(t);e.items=[],e.k=-1}this.requests=[]}update(e,t){this.time+=t,this.track.position.z=e;let n=Math.floor(e/Zn);for(let s=n-Ip;s<=n+Pp;s++){if(s<0)continue;let r=(s%zi+zi)%zi;this.slots[r].k!==s&&this.buildSlot(r,s)}for(let s of this.animated){let r=s.userData.animate;r&&r(this.time,t)}this.requests.length>40&&(this.requests=this.requests.filter(s=>s.s>e-500))}buildSlot(e,t){let n=this.slots[e];for(let p of n.items)this.release(p);n.items=[],n.k=t;let s=Bn(t*7919+17),r=t*Zn,o=-r,a={conifer:0,decid:0,bush:0,house:0,roof:0},l=new Je,c=new $t,h=new C,u=new C,d=new ke,f=new C(0,1,0),m=(p,y,_,x,I,T,S,R,M,b)=>{let P=this.inst[p],k=a[p];if(k>=P.cap)return!1;a[p]++,c.setFromAxisAngle(f,T),u.set(R??I,M??I,b??I),l.compose(h.set(y,_,x),c,u);let U=e*P.cap+k;return P.mesh.setMatrixAt(U,l),P.mesh.setColorAt(U,d.setHex(S)),!0},v=this.villageSide(t),g=this.villageSide(t-1)||this.villageSide(t+1);for(let p of[1,-1]){let y=p>0?11:23,_=hs(.05,.38,us(t/9,y)),x=p>0?17:34;if(v===p)continue;let I=Math.floor(_*46);for(let S=0;S<I;S++){let R=p*(x+4+Math.pow(s(),.7)*120),M=o-s()*Zn,b=.75+s()*.65;s()<.62?m("conifer",R,0,M,b,s()*6,_l[Math.floor(s()*_l.length)]):m("decid",R,0,M,b,s()*6,_l[Math.floor(s()*_l.length)])}let T=3+Math.floor(s()*6);for(let S=0;S<T;S++){let R=p*(x-1+s()*10),M=o-s()*Zn;s()<.55?m("bush",R,0,M,.7+s()*.9,s()*6,16777215):m("decid",R,0,M,.55+s()*.5,s()*6,16777215)}if(_<.3){let S=Math.floor(s()*5);for(let R=0;R<S;R++)m("decid",p*(60+s()*380),0,o-s()*Zn,.9+s()*.8,s()*6,16777215);if(s()<.22){let R=this.acquire("turbine",()=>this.makeTurbine());R.position.set(p*(180+s()*520),0,o-s()*Zn),R.rotation.y=(s()-.5)*.6,R.userData.phase=s()*6,this.animated.add(R),n.items.push(R)}}}if(v){let p=v,y=14+Math.floor(s()*14);for(let _=0;_<y;_++){let x=p*(42+s()*150),I=o-s()*Zn,T=8+s()*5,S=9+s()*6,R=5+s()*3.5,M=(s()<.5?0:Math.PI/2)+(s()-.5)*.3;m("house",x,0,I,1,M,je(D_),T,R,S),m("roof",x,0,I,1,M,je(k_),T,R,S)}if(s()<.8){let _=this.acquire("church",()=>this.makeChurch());_.position.set(p*(70+s()*60),0,o-50),_.rotation.y=s()*.5,n.items.push(_)}for(let _=0;_<8;_++)m("decid",p*(40+s()*160),0,o-s()*Zn,.7+s()*.5,s()*6,16777215)}if((v===1||g===1)&&t>2){let p=this.acquire("noisewall",()=>this.makeNoiseWall());p.position.set(Ue.right+2.1,0,o-Zn/2),n.items.push(p)}if(t%5===0&&t>0){let p=this.makeKmSign((r/1e3).toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:1}));p.position.set(Ue.right+1.2,0,o),n.items.push(p)}if(t%20===10){let p=this.acquire("notruf",()=>this.makeNotruf());p.position.set(Ue.right+1.4,0,o-30),n.items.push(p)}if(t%13===7){let p=this.acquire("gantry",()=>this.makeGantry());this.labelGantry(p,s,r+50),p.position.set(0,0,o-50),n.items.push(p)}else if(t%23===15){let p=this.acquire("bridge",()=>this.makeBridge());this.labelBridge(p,s),p.position.set(0,0,o-50),n.items.push(p)}else if(t%17===3){let[p,y]=Cp[Math.floor(s()*Cp.length)],_=this.acquire("brown",()=>this.makeBrownSign());_.userData.setText(p,y),_.position.set(Ue.right+3.4,0,o-40),n.items.push(_)}else if(t%29===11){let p=this.acquire("blueinfo",()=>this.makeBlueInfo());p.userData.setText(s()<.5?["Rastplatz","Sch\xE4ferborn  2 km"]:["Rastst\xE4tte","Bananensaft  1500 m"]),p.position.set(Ue.right+3.4,0,o-40),n.items.push(p)}for(let p of this.requests)!p.built&&p.s>=r&&p.s<r+Zn&&this.placeRequest(n,p);for(let p of Object.keys(this.inst)){let y=this.inst[p],_=new Je().makeScale(0,0,0);for(let x=a[p];x<y.cap;x++)y.mesh.setMatrixAt(e*y.cap+x,_);y.mesh.instanceMatrix.needsUpdate=!0,y.mesh.instanceColor&&(y.mesh.instanceColor.needsUpdate=!0)}}villageSide(e){return e<4?0:e%37===5||e%37===6?1:e%53===20||e%53===21?-1:0}placeRequest(e,t){t.built=!0;let n=-t.s,s=null;switch(t.type){case"brunnen":s=this.acquire("brunnen",()=>this.makeFountain()),s.position.set(Ue.right+9,0,n),this.animated.add(s);break;case"elsa":s=this.acquire("elsaStatue",()=>this.makeElsaStatue()),s.position.set(Ue.right+8,0,n),this.animated.add(s);break;case"burg":s=this.acquire("burg",()=>this.makeCastle()),s.position.set(160,0,n-60);break;case"skyline":s=this.acquire("skyline",()=>this.makeSkyline()),s.position.set(-75,0,n);break;case"sparkasse":s=this.acquire("sparkasse",()=>this.makeSparkasse()),s.userData.setColor(t.data.color||"#d5121e"),s.position.set(Ue.right+16,0,n);break;case"kiosk":s=this.acquire("kiosk",()=>this.makeKiosk()),s.userData.setText(t.data.title||"Currywurst",t.data.sub||"die richtige Bude"),s.position.set(Ue.right+10,0,n);break;case"charger":s=this.acquire("charger",()=>this.makeCharger()),s.position.set(Ue.right+11,0,n);break;case"ziel":s=this.acquire("ziel",()=>this.makeZiel()),s.userData.setText(t.data.title||"Ziel"),s.position.set(Ue.right+3.5,0,n);break;case"blitzer":s=this.acquire("blitzer",()=>this.makeBlitzer()),s.userData.flash.material.color.setScalar(1),s.position.set(Ue.right+1.6,0,n);break;case"speed":{s=this.acquire("speed:"+t.data.limit,()=>this.makeSpeedSign(t.data.limit)),s.position.set(0,0,n);break}default:return}s.userData.requestId=t.id,e.items.push(s)}canvasTex(e,t,n,s){if(this.texCache.has(e))return this.texCache.get(e);let r=document.createElement("canvas");r.width=t,r.height=n,s(r.getContext("2d"),t,n);let o=new Pt(r);if(o.colorSpace=ht,o.anisotropy=4,this.texCache.set(e,o),this.texCache.size>90){let a=this.texCache.keys().next().value;this.texCache.get(a).dispose(),this.texCache.delete(a)}return o}makeKmSign(e){let t=new we;this.kmGeo||(this.kmGeo={post:new Fe(.08,1.4,.08),board:new $e(.5,.38)});let n=new D(this.kmGeo.post,this.mats.steel);n.position.y=.7;let s=this.canvasTex("km:"+e,128,96,(o,a,l)=>{o.fillStyle="#fafaf5",o.fillRect(0,0,a,l),o.strokeStyle="#111",o.lineWidth=5,o.strokeRect(3,3,a-6,l-6),o.fillStyle="#111",o.font="bold 46px Arial, sans-serif",o.textAlign="center",o.textBaseline="middle",o.fillText(e,a/2,l/2+2)}),r=new D(this.kmGeo.board,ae.std({map:s,roughness:.6}));return r.position.set(0,1.35,.05),r.rotation.y=-.25,t.add(n,r),t.userData.active=!0,t.userData.onRelease=()=>{r.material.dispose(),this.track.remove(t)},this.track.add(t),t}makeNotruf(){let e=new we,t=new D(new Fe(.32,1.25,.28),this.mats.orange);t.position.y=.62;let n=new D(new $e(.22,.25),this.mats.white);return n.position.set(0,.95,.142),e.add(t,n),e}makeGantry(){let e=new we,t=this.mats.steel,n=ds-.4,s=Ue.right+1.6;for(let c of[n,s]){let h=new D(new Fe(.5,7.4,.5),t);h.position.set(c,3.7,0),h.castShadow=!0,e.add(h);let u=new D(new Fe(1.2,.5,1.2),this.mats.concrete);u.position.set(c,.25,0),e.add(u)}let r=s-n;for(let c of[6.3,7.2]){let h=new D(new Fe(r,.22,.22),t);h.position.set((n+s)/2,c,0),h.castShadow=!0,e.add(h)}for(let c=0;c<=12;c++){let h=n+r*c/12,u=new D(new Fe(.08,.9,.08),t);u.position.set(h,6.75,0),u.rotation.z=c%2?.7:-.7,e.add(u)}let o=new D(new $e(7.2,2.7),ae.std({roughness:.5}));o.position.set(-3.75,6.6,.2);let a=new D(new $e(7.2,2.7),ae.std({roughness:.5}));a.position.set(3.9,6.6,.2);let l=new D(new Fe(14.8,2.8,.12),this.mats.dark);return l.position.set(.07,6.6,.12),e.add(l,o,a),e.userData.panels=[o,a],e}relabelGantries(){let e=this.pools.get("gantry");if(!(!e||!this.gantryInfo))for(let t of e)t.userData.active&&t.userData.sSign!==void 0&&this.labelGantry(t,Math.random,t.userData.sSign,!0)}labelGantry(e,t,n,s=!1){e.userData.sSign=n;let r=this.gantryInfo(n),[o,a]=e.userData.panels,l=v=>v.toLocaleString("de-DE",{maximumFractionDigits:v<10?1:0})+" km",c=A_.filter(v=>!r||v!==r.target),h=je(c),u=je(c);for(;u===h;)u=je(c);let d=je(c);for(;d===h||d===u;)d=je(c);let f=r?Gr([{left:r.target,right:l(r.km)},{left:"Navi-Ziel",right:"\u2191"}],{w:768,h:288,arrows:null}):Gr([{left:d,right:l(3+Math.floor(t()*20))},{left:"Rastanlage",right:l(1+Math.floor(t()*9))}],{w:768,h:288,arrows:null}),m=Gr([{left:h,right:l(5+Math.floor(t()*60))},{left:u,right:l(30+Math.floor(t()*120))}],{w:768,h:288,arrows:null});for(let[v,g]of s?[[o,f]]:[[o,f],[a,m]])v.material.map&&v.material.map.dispose(),v.material.map=g,v.material.needsUpdate=!0}makeBridge(){let e=new we,t=this.mats.concrete,n=-58,s=42,r=new D(new Fe(s-n,1.1,11,20,1,1),t);r.position.set((n+s)/2,6.35,0),r.castShadow=!0,r.receiveShadow=!0,e.add(r);let o=new D(new $e(s-n,11),this.mats.concreteDark);o.rotation.x=Math.PI/2,o.position.set((n+s)/2,5.79,0),e.add(o);for(let l of[ds,Ue.right+3,-31.5])for(let c of[-3.2,3.2]){let h=new D(new Xe(.55,.6,5.8,12),t);h.position.set(l,2.9,c),h.castShadow=!0,e.add(h)}for(let l of[n+4,s-4]){let c=new D(new Fe(8,6,13),this.mats.grass);c.position.set(l,3,0),e.add(c)}for(let l of[-5.4,5.4]){let c=new D(new Fe(s-n,.1,.1),this.mats.steel);c.position.set((n+s)/2,7.95,l),e.add(c);for(let h=n;h<=s;h+=2.5){let u=new D(new Fe(.06,1,.06),this.mats.steel);u.position.set(h,7.4,l),e.add(u)}}let a=new D(new $e(9,1.5,8,1),ae.std({side:ft,roughness:.9}));return a.position.set(-1.5,6.9,5.6),e.add(a),e.userData.banner=a,e}labelBridge(e,t){let n=Rp[Math.floor(t()*Rp.length)],s=this.canvasTex("banner:"+n,1024,170,(r,o,a)=>{r.fillStyle="#fbfbf6",r.fillRect(0,0,o,a),r.fillStyle=["#c8102e","#1d4f9a","#111111","#2d7a32"][n.length%4],r.font='bold 92px "Comic Sans MS", "Marker Felt", "Segoe Print", Arial, sans-serif',r.textAlign="center",r.textBaseline="middle";let l=92;for(;r.measureText(n).width>o-60&&l>30;)l-=4,r.font=`bold ${l}px "Comic Sans MS", "Marker Felt", "Segoe Print", Arial, sans-serif`;r.fillText(n,o/2,a/2+4),r.strokeStyle="rgba(0,0,0,0.15)";for(let c=0;c<5;c++)r.beginPath(),r.moveTo(0,Math.random()*a),r.bezierCurveTo(o*.3,Math.random()*a,o*.7,Math.random()*a,o,Math.random()*a),r.stroke()});e.userData.banner.material.map=s,e.userData.banner.material.needsUpdate=!0,e.userData.banner.position.x=-12+t()*20}makeBrownSign(){let e=new we;for(let n of[-1.3,1.3]){let s=new D(new Fe(.1,3.8,.1),this.mats.steel);s.position.set(n,1.9,0),e.add(s)}let t=new D(new $e(3.4,2.1),ae.std({roughness:.6}));return t.position.set(0,2.75,.06),e.add(t),e.rotation.y=-.12,e.userData.setText=(n,s)=>{t.material.map=this.canvasTexFrom("brown:"+n,()=>_p(n,s)),t.material.needsUpdate=!0},e}canvasTexFrom(e,t){return this.texCache.has(e)||this.texCache.set(e,t()),this.texCache.get(e)}makeBlueInfo(){let e=new we;for(let n of[-1.3,1.3]){let s=new D(new Fe(.1,3.6,.1),this.mats.steel);s.position.set(n,1.8,0),e.add(s)}let t=new D(new $e(3.4,1.8),ae.std({roughness:.6}));return t.position.set(0,2.7,.06),e.add(t),e.rotation.y=-.12,e.userData.setText=n=>{t.material.map=this.canvasTexFrom("blue:"+n.join("|"),()=>Gr(n,{w:512,h:272})),t.material.needsUpdate=!0},e}makeSpeedSign(e){let t=new we,n=bp(e),s=ae.std({map:n,transparent:!0,alphaTest:.4,roughness:.5});for(let r of[Ue.right+1.3,ds]){let o=new D(new Xe(.04,.04,2.6,6),this.mats.steel);o.position.set(r,1.3,0);let a=new D(new $e(1,1),s);a.position.set(r,2.5,.05),t.add(o,a)}return t}makeBlitzer(){let e=new we,t=new D(new Fe(.55,2.7,.55),ae.std({color:10331048,metalness:.4,roughness:.5}));t.position.y=1.35;let n=new D(new $e(.36,.5),ae.std({color:1053720,metalness:.8,roughness:.1}));n.position.set(0,2.2,.28);let s=new D(new $e(.3,.2),ae.basic({color:16777215}));return s.position.set(0,1.75,.28),e.add(t,n,s),e.rotation.y=-.35,e.userData.flash=s,e}makeTurbine(){let e=new we,t=ae.std({color:15987957,roughness:.55}),n=new D(new Xe(1.2,2.4,92,12),t);n.position.y=46;let s=new D(new Fe(3.6,3.8,10),t);s.position.set(0,93,-1);let r=new we;r.position.set(0,93,4.4);let o=new D(new bt(2,12,10),t);o.scale.set(1,1,1.4),r.add(o);let a=new Fe(2.4,46,.5);a.translate(0,24,0);let l=a.attributes.position;for(let c=0;c<l.count;c++){let h=l.getY(c);l.setX(c,l.getX(c)*(1-h/50*.75))}a.computeVertexNormals();for(let c=0;c<3;c++){let h=new D(a,t);h.rotation.z=c/3*Math.PI*2,r.add(h)}return e.add(n,s,r),e.userData.animate=c=>{r.rotation.z=c*1.3+e.userData.phase},e}makeChurch(){let e=new we,t=ae.std({color:15525333,roughness:.9}),n=new D(new Fe(9,8,18),t);n.position.set(0,4,4);let s=new D(new Xe(.01,6.8,5,4,1),this.mats.redRoof);s.scale.set(1,1,2),s.rotation.y=Math.PI/4,s.position.set(0,10.5,4);let r=new D(new Fe(4.5,20,4.5),t);r.position.set(0,10,-7);let o=new D(new Gn(3.4,10,4),ae.std({color:4087378,roughness:.7}));o.rotation.y=Math.PI/4,o.position.set(0,25,-7);let a=new D(new kn(.9,16),ae.std({color:1710618}));return a.position.set(0,16,-4.74),e.add(n,s,r,o,a),e.traverse(l=>l.isMesh&&(l.castShadow=!0)),e}makeNoiseWall(){let e=this.canvasTexFrom("noisewall",()=>{let r=document.createElement("canvas");r.width=256,r.height=128;let o=r.getContext("2d");o.fillStyle="#7f8f84",o.fillRect(0,0,256,128);for(let l=0;l<128;l+=8)o.fillStyle=l%16?"rgba(0,0,0,0.08)":"rgba(255,255,255,0.06)",o.fillRect(0,l,256,4);o.fillStyle="#5b6168",o.fillRect(0,0,10,128);let a=new Pt(r);return a.colorSpace=ht,a.wrapS=a.wrapT=Ni,a.repeat.set(20,1),a.anisotropy=4,a}),t=ae.std({map:e,roughness:.8}),n=new D(new Fe(.3,4.2,Zn,1,1,25),t);n.position.y=2.1,n.castShadow=!0,n.receiveShadow=!0;let s=new we;return s.add(n),s}makeFountain(){let e=new we,t=new D(new Xe(3.4,3.6,.9,28,1,!0),this.mats.stone);t.position.y=.45;let n=new D(new Un(3.45,.18,8,32),this.mats.stone);n.rotation.x=Math.PI/2,n.position.y=.9;let s=new D(new kn(3.35,28),this.mats.water);s.rotation.x=-Math.PI/2,s.position.y=.75;let r=new D(new Xe(.35,.5,2.4,14),this.mats.stone);r.position.y=1.2;let o=new D(new Xe(1.4,.35,.5,20),this.mats.stone);o.position.y=2.5;let a=ae.std({color:14676479,transparent:!0,opacity:.55,roughness:.1,emissive:3364215,emissiveIntensity:.3}),l=new D(new Gn(.25,2.2,12,1,!0),a);l.position.y=3.8,l.rotation.x=Math.PI;let c=new D(new Xe(1.45,2.4,1.7,24,1,!0),a);c.position.y=1.65;let h=this.canvasTex("brunnentv",512,200,(f,m,v)=>{f.fillStyle="#3a1f63",Ft(f,0,0,m,v,24),f.fill(),f.fillStyle="#ffd84a",f.font="bold 84px Arial Black, Arial, sans-serif",f.textAlign="center",f.textBaseline="middle",f.fillText("BrunnenTV",m/2,v*.42),f.fillStyle="#ffffff",f.font="34px Arial, sans-serif",f.fillText("mit Herrn Sch\xF6nnbrun \u26F2",m/2,v*.78)}),u=new D(new $e(3.2,1.25),ae.std({map:h,roughness:.5}));u.position.set(-4.2,2.3,1.5),u.rotation.y=.5;let d=new D(new Fe(.12,1.8,.12),this.mats.steel);return d.position.set(-4.2,.9,1.4),e.add(t,n,s,r,o,l,c,u,d),e.userData.animate=f=>{l.scale.y=1+Math.sin(f*7)*.08,c.scale.x=c.scale.z=1+Math.sin(f*5)*.03},e}makeElsaStatue(){let e=new we,t=new D(new Xe(1.8,2.1,1.2,20),this.mats.stone);t.position.y=.6;let n=xl({curved:!0});n.scale.setScalar(4.2),n.position.y=1.2,n.rotation.y=-.6;let s=this.canvasTex("elsaSign",512,160,(o,a,l)=>{o.fillStyle="#1d3f9a",Ft(o,0,0,a,l,20),o.fill(),o.fillStyle="#f2c230",o.font="bold 66px Arial, sans-serif",o.textAlign="center",o.textBaseline="middle",o.fillText("\u{1F451} Elsa gr\xFC\xDFt!",a/2,l/2+3)}),r=new D(new $e(2.6,.8),ae.std({map:s}));return r.position.set(0,.7,2.12),e.add(t,n,r),e.userData.animate=o=>yl(n,o),e}makeCastle(){let e=new we,t=new D(new Gn(95,42,24,1),ae.lambert({color:6063680}));t.position.y=21;let n=ae.std({color:12036495,roughness:.95}),s=new D(new Fe(12,30,12),n);s.position.y=57;let r=new D(new Gn(9.5,12,4),this.mats.redRoof);r.rotation.y=Math.PI/4,r.position.y=78,e.add(t,s,r);for(let o=0;o<4;o++){let a=o/4*Math.PI*2+.4,l=new D(new Xe(3.5,3.8,20,12),n);l.position.set(Math.sin(a)*18,52,Math.cos(a)*18);let c=new D(new Gn(4.4,8,12),this.mats.redRoof);c.position.set(Math.sin(a)*18,66,Math.cos(a)*18),e.add(l,c);let h=(o+.5)/4*Math.PI*2+.4,u=new D(new Fe(24,12,2),n);u.position.set(Math.sin(h)*13.5,48,Math.cos(h)*13.5),u.rotation.y=h,e.add(u)}return e}makeSkyline(){let e=new we,t=Bn(69),n=[this.mats.glassBlue,ae.std({color:12174028,metalness:.5,roughness:.3}),ae.std({color:7305862,metalness:.6,roughness:.25})];for(let s=0;s<16;s++){let r=60+t()*190,o=18+t()*22,a=new D(new Fe(o,r,o),n[s%3]);if(a.position.set(-s*22-t()*8,r/2,-s*14-t()*40),e.add(a),s===7){let l=new D(new Xe(.6,1.2,50,6),this.mats.steel);l.position.set(a.position.x,r+25,a.position.z),e.add(l)}}return e}makeSparkasse(){let e=new we,t=new D(new Fe(14,7,10),ae.std({color:15328991,roughness:.85}));t.position.y=3.5;let n=new D(new $e(12,3),this.mats.glassBlue);n.position.set(0,2.2,5.01),n.rotation.y=0;let s=new D(new $e(8,1.6),ae.std({roughness:.5}));return s.position.set(0,6,5.03),e.add(t,n,s),e.rotation.y=-Math.PI/2+.25,e.userData.setColor=r=>{let o=this.canvasTex("spk:"+r,512,100,(a,l,c)=>{a.fillStyle="#ffffff",a.fillRect(0,0,l,c),a.fillStyle=r,a.font="bold 64px Arial, sans-serif",a.textAlign="center",a.textBaseline="middle",a.fillText("Sparkasse",l/2,c/2+3)});s.material.map=o,s.material.needsUpdate=!0},e}makeKiosk(){let e=new we,t=new D(new Fe(5,3,4),ae.std({color:15786160,roughness:.8}));t.position.y=1.5;let n=new D(new Fe(5.4,.2,1.6),ae.std({color:13770784,roughness:.7}));n.position.set(0,2.8,2.6),n.rotation.x=.25;let s=new D(new Xe(.12,.12,7,8),this.mats.steel);s.position.set(-3.6,3.5,1);let r=new D(new $e(3.2,1.8),ae.std({roughness:.5}));return r.position.set(-3.6,6.4,1.13),e.add(t,n,s,r),e.rotation.y=-.4,e.userData.setText=(o,a)=>{let l=this.canvasTex("kiosk:"+o+a,512,288,(c,h,u)=>{c.fillStyle="#fff4d0",Ft(c,0,0,h,u,26),c.fill(),c.strokeStyle="#d22020",c.lineWidth=12,Ft(c,8,8,h-16,u-16,20),c.stroke(),c.fillStyle="#b31515",c.font="bold 72px Arial Black, Arial, sans-serif",c.textAlign="center",c.textBaseline="middle",c.fillText(o,h/2,u*.4),c.fillStyle="#333",c.font="bold 38px Arial, sans-serif",c.fillText(a,h/2,u*.75)});r.material.map=l,r.material.needsUpdate=!0},e}makeCharger(){let e=new we,t=new D(new Fe(14,.4,6),ae.std({color:16053492,roughness:.6}));t.position.y=4.2,e.add(t);for(let s of[-6,6]){let r=new D(new Fe(.3,4.2,.3),this.mats.steel);r.position.set(s,2.1,0),e.add(r)}for(let s=0;s<5;s++){let r=new D(new Fe(.35,1.6,.35),ae.std({color:15921906,roughness:.4}));r.position.set(-5+s*2.5,.8,-1.5);let o=new D(new Fe(.36,.25,.36),ae.std({color:13638684,emissive:5242880}));o.position.set(-5+s*2.5,1.35,-1.5),e.add(r,o)}let n=new D(new Fe(13.6,.08,5.6),ae.basic({color:12575743}));return n.position.y=3.98,e.add(n),e.rotation.y=-.2,e}makeZiel(){let e=new we;for(let r of[-2.2,2.2]){let o=new D(new Xe(.08,.08,4.6,8),this.mats.steel);o.position.set(r,2.3,0),e.add(o)}let t=this.canvasTex("checker",256,64,(r,o,a)=>{for(let l=0;l<4;l++)for(let c=0;c<16;c++)r.fillStyle=(c+l)%2?"#111":"#fff",r.fillRect(c*16,l*16,16,16)}),n=new D(new $e(4.4,.9,10,1),ae.std({map:t,side:ft}));n.position.y=4.15;let s=new D(new $e(4.2,1.6),ae.std({roughness:.6}));return s.position.y=2.9,s.position.z=.05,e.add(n,s),e.rotation.y=-.15,e.userData.setText=r=>{s.material.map=this.canvasTexFrom("ziel:"+r,()=>Gr(["Ziel erreicht:",r],{w:512,h:196,bg:"#1d7a3a"})),s.material.needsUpdate=!0},e}flashBlitzer(e){let t=this.pools.get("blitzer")||[];for(let n of t)n.userData.active&&n.userData.flash.material.color.setScalar(e?30:1)}};var Xr={klein:{L:3.62,half:.83,H:1.5,belt:.93,hood:.78,ws:1.32,re:2.85,ce:3.48,rear:"hatch",axles:[.68,3],wr:.29,cl:.15,nose:.62,weight:8},kompakt:{L:4.26,half:.895,H:1.46,belt:.93,hood:1.05,ws:1.72,re:3.35,ce:4.12,rear:"hatch",axles:[.86,3.5],wr:.31,cl:.16,nose:.6,weight:22},limo:{L:4.78,half:.915,H:1.45,belt:.95,hood:1.32,ws:1.98,re:3.15,ce:3.88,rear:"sedan",axles:[.95,3.8],wr:.32,cl:.15,nose:.6,weight:15},kombi:{L:4.82,half:.915,H:1.5,belt:.95,hood:1.25,ws:1.92,re:4.5,ce:4.74,rear:"wagon",axles:[.95,3.75],wr:.32,cl:.16,nose:.6,weight:18},suv:{L:4.62,half:.94,H:1.68,belt:1.08,hood:1.12,ws:1.78,re:4.2,ce:4.5,rear:"wagon",axles:[.92,3.62],wr:.36,cl:.22,nose:.74,weight:14},sport:{L:4.5,half:.93,H:1.27,belt:.82,hood:1.62,ws:2.25,re:2.9,ce:4.05,rear:"hatch",axles:[1.12,3.62],wr:.33,cl:.12,nose:.48,weight:4},transporter:{L:5.9,half:1,H:2.5,belt:1.2,hood:.78,ws:1.42,re:5.85,ce:5.9,rear:"box",cargo:2.05,axles:[.95,4.6],wr:.36,cl:.2,nose:.78,weight:8},wohnmobil:{L:7,half:1.15,H:3,belt:1.3,hood:.8,ws:1.45,re:6.95,ce:7,rear:"box",cargo:1.9,alkoven:!0,axles:[1,4.9],wr:.38,cl:.22,nose:.8,weight:2}},U_=[[12106946,20],[1118740,20],[15659250,18],[5922662,18],[2310266,10],[10361627,6],[2968122,3],[12099706,2],[15254298,1],[13789470,1],[1929128,2]],Lp=["KS-EL 5A","GF-PO 110","FD-BR 1","SI-EG 3","F-SK 2017","MZ-RT 1369","B-AN 333","KS-ZF 33","HU-PA 42","F-AB 1234","DA-HD 1080","OF-RT 333","GF-MA 3","HH-MA 1","FD-VIP 3","K-OE 1337"],Sl=[["Pl\xFCsch-Logistik","Wir liefern Mini Adams in ganz Deutschland","#ffffff","#c8102e"],["Brunnenbau Sch\xF6nnbrun","Seit 1887 \u2013 Brunnen mit Gef\xFChl","#e8f1f8","#1d5fa8"],["Rettich-Express","Frisch vom Feld \u2013 13,69 \u20AC das Kilo","#f6f6ee","#3c8d2f"],["Pappkarton & S\xF6hne","Haufenweise Kartons seit 1972","#d8b98a","#5a3b1c"],["Elsa Fischtransporte","Kassel \xB7 frisch & k\xF6niglich","#ffffff","#1d3f9a"],["Bananensaft-Spedition","Gelb ist das neue Schnell","#fff6c0","#c79a00"],["Sprachstudio-Logistik","Wir bringen jede Durchsage an","#f0f0f0","#7a2ca0"],["Konfetti-Transporte","Vorsicht: Rutschgefahr beim \xD6ffnen","#ffffff","#e5307a"],["Ringtennis-Bedarf","Ringe, Netze, Leidenschaft","#eef6ff","#d45a00"],["Kanalpunkte-Kurier","Wetten, dass wir p\xFCnktlich sind?","#f4f4f4","#6c3fc4"],["Leitplanken-Lutz","Wir halten zusammen","#e6e6e6","#444444"],["Schnelle Pommes","Ohne R\xFCckfragen","#fff3d6","#d81e1e"]],Dp=["Abstand halten!","Wie fahre ich? 0800-BRUNNEN","Ladung: 33.333 Rettiche","Rechts fahren ist Ehrensache","Mein Wischer zuckt auch","Gr\xFC\xDFe an die Polizei Gifhorn","Nicht hupen, Fahrer tr\xE4umt von Elsa"],Ml=null;function ms(){return Ml||(Ml={body:new Map,glass:ae.std({color:1317410,metalness:.6,roughness:.08,envMapIntensity:1.4}),detail:ae.std({vertexColors:!0,roughness:.6,metalness:.15}),tail:ae.std({color:2753797,emissive:16711680,emissiveIntensity:.14,roughness:.3}),brake:ae.std({color:5245450,emissive:16711680,emissiveIntensity:.95,roughness:.3}),liner:ae.std({color:789517,roughness:.85,side:ft}),blink:ae.std({color:5583616,emissive:16753178,emissiveIntensity:3,roughness:.3}),blueOn:ae.std({color:662118,emissive:2250239,emissiveIntensity:5,roughness:.3}),blueOff:ae.std({color:1714790,emissive:660800,emissiveIntensity:.4,roughness:.3}),plates:new Map,trailers:new Map,ground:ae.basic({color:0,map:dl(),transparent:!0,opacity:.5,depthWrite:!1})},Ml)}var Fu=new Map;function N_(i,e){let t=i.toFixed(2)+"x"+e.toFixed(2);if(!Fu.has(t)){let n=new $e(i,e,1,Math.max(1,Math.ceil(e/2.5)));n.rotateX(-Math.PI/2),n.translate(0,.02,0),Fu.set(t,n)}return Fu.get(t)}function El(i,e=null){let t=ms(),n=i+(e?":"+e.uuid:"");return t.body.has(n)||t.body.set(n,ae.std({color:i,map:e,metalness:.45,roughness:.3,envMapIntensity:1.1})),t.body.get(n)}function kp(i){let e=ms();return e.plates.has(i)||e.plates.set(i,ae.std({map:cl(i),roughness:.6})),e.plates.get(i)}function Np(i){let e=ms();e.tail.emissiveIntensity=i?.3:.14,e.ground.opacity=i?.78:.5}var Wr=new Map,Ws=new C;function Up(i,e,t){let n=0,s=-1/0;for(let r=0;r<=48;r++){if(fs(i,e,-Math.PI/2+r/48*Math.PI,Ws),Ws.y>=t)return s===-1/0?Ws.x:et(n,Ws.x,(t-s)/Math.max(1e-6,Ws.y-s));n=Ws.x,s=Ws.y}return 0}function zu(i){if(Wr.has(i))return Wr.get(i);let e=Xr[i],{L:t,half:n,H:s,belt:r,hood:o,ws:a,re:l,ce:c,rear:h,axles:u,wr:d,cl:f,nose:m}=e,v=h==="box",g=[[0,m-.13],[.06,m],[.3,m+.06],[o,r]];h==="sedan"?g.push([c,r+.05],[t-.16,r+.06],[t,r-.1]):g.push([et(o,t,.6),r+.02],[t-.06,r-.02],[t,r-.14]);let p=Cn(g),y=Cn([[0,.36],[.08,f+.07],[.28,f],[t-.3,f],[t-.06,f+.1],[t,.4]]),_=ml(y,u,d+.07,d),x=Cn([[0,n-.22],[.1,n-.08],[.4,n-.02],[.9,n],[t-.9,n],[t-.3,n-.03],[t,n-.1]]),I={w:x,b:y,bx:gl(_,.5,.72),t:p,tw:.9,bw:.95,n:4.5,L:t},T=[_i({u0:0,u1:t,...I,segs:64,ring:24,H:s})],S=(X,j,xe)=>fs(I,X,j,xe),R=(X,j,xe,pe,A,E=.004)=>Vs(S,(V,Q)=>{let re=et(pe,A,V);return[et(j,xe,Q),X>0?re:Math.PI-re]},{ns:Math.max(6,Math.ceil(Math.abs(A-pe)/.08)),nt:8,lift:E}),M=h==="sedan"?r+.07:r+.12,b=v?e.cargo+.02:c,P=[[o-.02,r+.01],[et(o,a,.5),et(r,s,.56)],[a,s-.01]];v?P.push([b,s-.01]):P.push([(a+l)/2,s],[l,s-.015],[et(l,c,.5),et(s,M,.55)],[c,M]);let k=Cn(P),U=X=>x(X)-.06,H={w:U,b:X=>p(X)-.05,t:k,tw:v?.95:.8,bw:1,n:3.4,L:t},G=_i({u0:o-.02,u1:b,...H,segs:36,ring:22,H:s});if(v)T.push(_i({u0:e.cargo,u1:t,w:X=>x(X)+.01,b:()=>r-.06,t:Cn([[e.cargo,s-.02],[e.cargo+.3,s],[t,s]]),tw:.97,bw:1,n:7,segs:24,ring:24,L:t,H:s})),e.alkoven?T.push(_i({u0:.45,u1:e.cargo+.2,w:()=>n+.02,b:Cn([[.45,s-.45],[1.2,s-.7],[e.cargo+.2,s-.72]]),t:()=>s,tw:.98,bw:1,n:6,segs:16,ring:24,L:t,H:s})):T.push(_i({u0:a-.05,u1:e.cargo+.05,w:X=>U(X)*.95+.02,b:X=>k(X)-.07,t:X=>k(X)+.015,tw:.95,bw:1,n:5,segs:10,ring:20,L:t,H:s}));else{let X=(j,xe,pe)=>fs(H,j,xe,pe);T.push(Vs(X,(j,xe)=>[et(a-.03,l+.02,xe),et(.42,Math.PI-.42,j)],{ns:12,nt:16,lift:.006}))}let N=It(T),$=[],z=[],ne=X=>X-t/2;for(let X of u)for(let j of[-1,1]){let xe=n*.45,pe=new Xe(d+.065,d+.065,n-xe,14,1,!0,0,Math.PI);pe.rotateZ(Math.PI/2),pe.translate(j*(n+xe)/2,d,ne(X));let A=new kn(d+.065,14,0,Math.PI);A.rotateY(Math.PI/2),A.translate(j*xe,d,ne(X)),z.push(pe.toNonIndexed(),A.toNonIndexed());for(let V of[-1,1]){let Q=new $e(n-xe,d-f+.02);Q.translate(j*(n+xe)/2,(d+f-.02)/2,ne(X+V*(d+.06))),z.push(Q.toNonIndexed())}let E=new Xe(d,d,.22,16);E.rotateZ(Math.PI/2),E.translate(j*(n-.13),d,ne(X)),$.push(gt(E,1184274)),$.push(gt(Uo(d*.62,j*(n-.015),d,ne(X),j,14),10133414))}$.push(gt(R(1,0,.16,-Math.PI+.42,-.42,.004),1776413)),$.push(gt(R(1,t-.18,t,-Math.PI+.42,-.42,.004),1776413));let le=p(0),me=y(0);$.push(gt(Rt(x(0)*1.05,Math.max(.04,(le-me)*.55),.01,0,me+(le-me)*.45,ne(0)-.006),2237222));let Ie=o+.25,Ke=r+.035,Z=Math.max(Up(I,Ie,Ke),Up(H,Ie,Ke))-.02;for(let X of[-1,1])$.push(gt(R(X,.008,.17,.2,.8,.004),2896184)),$.push(gt(R(X,.02,.15,.3,.7,.007),15002868)),$.push(gt(Rt(.15,.085,.06,X*(n+.03),r+.07,ne(Ie),0,X*.12,0),1710620)),$.push(gt(Rt(n-.03-Z,.035,.05,X*(Z+n-.03)/2,Ke,ne(Ie)+.01),1710620));let fe=It($);for(let X of z)X.deleteAttribute("uv");let ve=It(z),ce=[],be=h==="box"?.85:p(t)-.1,Oe=x(t)-.26;for(let X of[-1,1])ce.push(Rt(.3,.12,.024,X*Oe,be,ne(t)+.004));let qe=It(ce),tt=h==="box"?be+.11:be-.1,se=x(t)-.18,he=X=>It([Rt(.1,.06,.024,X*se,tt,ne(t)+.006),R(X,.01,.12,.02,.18,.005),R(X,Math.min(u[0]+d+.12,o-.1),Math.min(u[0]+d+.2,o-.02),.3,.4,.005)]),L=new $e(.52,.112);L.translate(0,h==="box"?.55:Math.max(f+.32,r-.32),ne(t)+.012);let Ne=[Rt(.42,.08,.22,-.22,s+.05,ne((a+l)/2)),Rt(.42,.08,.22,.22,s+.05,ne((a+l)/2))],W={bodyGeo:N,glassGeo:G,detailGeo:fe,linerGeo:ve,tailGeo:qe,blinkL:he(-1),blinkR:he(1),plateGeo:L,lightbarGeo:Ne,bodyShape:I};return Wr.set(i,W),W}var Ou=16.5;function Bp(){if(Wr.has("lkw"))return Wr.get("lkw");let i=h=>h-Ou/2,e=_i({u0:0,u1:2.3,w:Cn([[0,1.18],[.12,1.24],[2.3,1.25]]),b:()=>.92,t:Cn([[0,3.35],[.2,3.62],[.8,3.75],[2.3,3.78]]),tw:.96,bw:1,n:8,segs:14,ring:28,L:Ou,H:4}),t=[];t.push(gt(Rt(2.2,1.05,.05,0,2.72,i(0)-.06,-.06),1581096));for(let h of[-1,1])t.push(gt(Rt(.04,.85,1,h*1.255,2.75,i(.75)),1581096));t.push(gt(Rt(2.3,.35,.12,0,.75,i(.05)),2763308)),t.push(gt(Rt(1.7,.9,.04,0,1.6,i(.01)),3093046)),t.push(gt(Rt(2.4,.12,.35,0,3.4,i(.05),.25),1973792)),t.push(gt(Rt(1,.45,5.2,0,.78,i(3.2)),2236964));for(let h of[-1,1]){let u=new Xe(.3,.3,1.2,12);u.rotateX(Math.PI/2),u.translate(h*.95,.75,i(3.2)),t.push(gt(u,12172996)),t.push(gt(Rt(.3,.12,.08,h*.85,1.25,i(.02)),15199989)),t.push(gt(Rt(.08,.55,.06,h*1.38,2.6,i(.55)),1710618));for(let d of[2.42,2.8])t.push(gt(Rt(.16,.035,.035,h*1.31,d,i(.55)),1710618));t.push(gt(Rt(.05,.4,9,h*1.24,.95,i(9.3)),10133670))}let n=[[1.35,.52,.32],[4.9,.52,.55],[13.3,.48,.5],[14.6,.48,.5],[15.9,.48,.5]];for(let[h,u,d]of n)for(let f of[-1,1]){let m=new Xe(u,u,d,16);m.rotateZ(Math.PI/2),m.translate(f*(1.25-d/2-.02),u,i(h)),t.push(gt(m,1184274)),t.push(gt(Uo(u*.6,f*1.24,u,i(h),f,14),9080726))}t.push(gt(Rt(2.4,.15,.12,0,.6,i(16.45)),10133670)),t.push(gt(Rt(2.4,.3,13.6,0,1.12,i(9.7)),2829358));let s=It(t),r=new Fe(2.55,2.75,13.6);r.translate(0,2.65,i(9.7));let o=It([Rt(.4,.14,.05,-.95,1.05,i(16.5)+.02),Rt(.4,.14,.05,.95,1.05,i(16.5)+.02)]),a=h=>It([Rt(.14,.12,.05,h*1.17,1.05,i(16.5)+.025),Rt(.12,.1,.05,h*1.05,1.25,i(0)-.02),Rt(.04,.08,.16,h*1.27,1.25,i(1.9))]),l=new $e(.52,.112);l.translate(0,1.12,i(16.5)+.03);let c={bodyGeo:e,detailGeo:s,trailerGeo:r,tailGeo:o,blinkL:a(-1),blinkR:a(1),plateGeo:l};return Wr.set("lkw",c),c}function Hp(i){let e=ms();if(!e.trailers.has(i)){let[t,n,s,r]=Sl[i],o=ae.std({map:Mp(t,n,s,r),roughness:.7}),a=ae.std({map:Ep(Dp[i%Dp.length]),roughness:.7}),l=ae.std({color:new ke(s),roughness:.75});e.trailers.set(i,[o,o,l,l,a,l])}return e.trailers.get(i)}var Vr=null;function Fp(){if(Vr)return Vr;let i=document.createElement("canvas");i.width=1024,i.height=256;let e=i.getContext("2d");e.fillStyle="#d9dde2",e.fillRect(0,0,1024,256);let t=n=>256-n/1.5*256;return e.fillStyle="#1b4ea3",e.fillRect(0,t(.86),1024,t(.42)-t(.86)),e.fillStyle="#d7e64a",e.fillRect(0,t(.88),1024,5),Vr=new Pt(i),Vr.colorSpace=ht,Vr.anisotropy=4,Vr}var wl=null;function Op(){if(wl)return wl;let i=document.createElement("canvas");i.width=1024,i.height=192;let e=i.getContext("2d");e.textAlign="center",e.textBaseline="middle",e.fillStyle="#ffffff",e.font="bold 118px Arial, sans-serif",e.fillText("POLIZEI",512,84),e.font="bold 40px Arial, sans-serif",e.fillText("Gifhorn",512,166);let t=new Pt(i);t.colorSpace=ht,t.anisotropy=4;let n=ae.std({map:t,transparent:!0,depthWrite:!1,roughness:.4}),s=zu("kombi").bodyShape,{n:r}={n:4.5},o=(l,c)=>{let h=s.b(l),u=s.t(l),d=Math.min(.995,Math.max(-.995,2*(c-h)/(u-h)-1));return Math.asin(Math.sign(d)*Math.pow(Math.abs(d),r/2))},a=[-1,1].map(l=>{let c=Vs((u,d,f)=>fs(s,u,d,f),(u,d)=>{let f=et(1.62,3.22,d),m=o(f,et(.47,.8,u));return[f,l>0?m:Math.PI-m]},{ns:4,nt:28,lift:.006}),h=c.attributes.uv;for(let u=0;u<h.count;u++){let d=h.getX(u),f=h.getY(u);h.setXY(u,l>0?1-f:f,d)}return c});return wl={mat:n,geo:It(a)},wl}var Tl=class{constructor(e,{color:t,plate:n,company:s}={}){let r=ms();this.kind=e,this.group=new we,this.brake=!1,this.blinkDir=0,this.police=e==="polizei";let o=e==="polizei"?"kombi":e;if(e==="lkw"){let a=Bp();this.length=Ou,this.width=2.55,this.height=4;let l=t??je([15921906,11540504,1920922,15250432,2236962,2976570,14343648]);this.cab=new D(a.bodyGeo,El(l)),this.details=new D(a.detailGeo,r.detail);let c=s??Math.floor(Math.random()*Sl.length);this.company=Sl[c][0],this.trailer=new D(a.trailerGeo,Hp(c)),this.tail=new D(a.tailGeo,r.tail),this.blinkL=new D(a.blinkL,r.blink),this.blinkR=new D(a.blinkR,r.blink),this.plate=new D(a.plateGeo,kp(n??je(Lp))),this.group.add(this.cab,this.details,this.trailer,this.tail,this.blinkL,this.blinkR,this.plate),this.trailer.castShadow=!0,this.cab.castShadow=!0}else{let a=zu(o),l=Xr[o];this.length=l.L,this.width=l.half*2+.12,this.height=l.H;let c;if(this.police?c=El(16777215,Fp()):e==="wohnmobil"?c=El(16053488):c=El(t??Po(U_,h=>h[1])[0]),this.body=new D(a.bodyGeo,c),this.body.castShadow=!0,this.glass=new D(a.glassGeo,r.glass),this.details=new D(a.detailGeo,r.detail),this.liners=new D(a.linerGeo,r.liner),this.tail=new D(a.tailGeo,r.tail),this.blinkL=new D(a.blinkL,r.blink),this.blinkR=new D(a.blinkR,r.blink),this.plate=new D(a.plateGeo,kp(n??(this.police?"GF-3333":je(Lp)))),this.group.add(this.body,this.glass,this.details,this.liners,this.tail,this.blinkL,this.blinkR,this.plate),this.police){this.bar=a.lightbarGeo.map(u=>new D(u,r.blueOff)),this.group.add(...this.bar);let h=Op();this.group.add(new D(h.geo,h.mat))}}this.blinkL.visible=!1,this.blinkR.visible=!1,this.ground=new D(N_(this.width+.2,this.length+.35),r.ground),this.ground.renderOrder=-1,this.group.add(this.ground)}setPoliceText(e){if(!this.police)return;if(!this.display){let r=document.createElement("canvas");r.width=512,r.height=96,this.displayCanvas=r,this.displayTex=new Pt(r),this.displayTex.colorSpace=ht;let o=Xr.kombi,a=ae.basic({map:this.displayTex,toneMapped:!1});this.display=new D(new $e(.9,.17),a),this.display.position.set(0,o.H-.25,o.L/2-.18),this.display.rotation.x=-.52,this.group.add(this.display)}let t=this.displayCanvas.getContext("2d");t.fillStyle="#050505",t.fillRect(0,0,512,96),t.fillStyle="#ffb21a",t.font='bold 54px "Courier New", monospace',t.textAlign="center",t.textBaseline="middle";let n=(e||"POLIZEI GIFHORN").toUpperCase(),s=54;for(;t.measureText(n).width>490&&s>20;)s-=4,t.font=`bold ${s}px "Courier New", monospace`;t.fillText(n,256,50),this.displayTex.needsUpdate=!0}setBrake(e){e!==this.brake&&(this.brake=e,this.tail.material=e?ms().brake:ms().tail)}setBlink(e){this.blinkDir=e,e||(this.blinkL.visible=!1,this.blinkR.visible=!1)}updateLights(e,t=!1){let n=Math.sin(e*Math.PI*2*1.45)>0;if(this.blinkDir&&(this.blinkL.visible=this.blinkDir<0&&n,this.blinkR.visible=this.blinkDir>0&&n),this.bar){let s=ms(),r=Math.floor(e*7)%4;this.bar[0].material=t&&(r===0||r===2)?s.blueOn:s.blueOff,this.bar[1].material=t&&(r===1||r===3)?s.blueOn:s.blueOff}}};function Gu(i=!0,e=.18){if(i&&Math.random()<e)return"lkw";let t=Object.keys(Xr);return Po(t,n=>Xr[n].weight)}function zp(){for(let i of Object.keys(Xr))zu(i);Bp();for(let i=0;i<Sl.length;i++)Hp(i);Fp(),Op()}var Vu=[[150,205],[128,160],[112,138],[95,120]],Gi=1/3.6,B_=1,Al=class{constructor(e,t){this.scene=e,this.rain=t,this.group=new we,this.group.name="Traffic",e.add(this.group),this.cars=[],this.oncoming=[],this.pool=new Map,this.difficulty=0,this.leftOpen=!1,this.grip=1,this.t=0,this.events=[],this.policeText=null}acquire(e,t){let n=this.pool.get(e)||[];this.pool.set(e,n);let s=n.find(r=>!r.inUse&&!t);return s||(s=new Tl(e,t),n.push(s),this.group.add(s.group)),s.inUse=!0,s.group.visible=!0,s.setBrake(!1),s.setBlink(0),s}releaseVehicle(e){e.inUse=!1,e.group.visible=!1}reset(){for(let e of this.cars)this.releaseVehicle(e.v);for(let e of this.oncoming)this.releaseVehicle(e.v);this.cars=[],this.oncoming=[],this.events=[],this.difficulty=0,this.leftOpen=!1}laneSpeed(e,t){if(t)return Me(e===2?86:80,e===2?92:89)*Gi;let[n,s]=Vu[e];return Me(n,s+this.difficulty*15)*Gi}spawn(e,t,{kind:n,speed:s,behavior:r="normal",opts:o}={}){let a=n||Gu(t>=2,t===3?.3:.22),l=a==="lkw";l&&t<2&&(t=2+Math.round(Math.random()));let c=this.acquire(a,o),h={id:B_++,v:c,kind:a,truck:l,lane:t,x:Ue.laneCenter(t),s:e,speed:s??this.laneSpeed(t,l),len:c.length,w:c.width,v0:0,change:null,decideIn:Me(.5,2.5),brake:!1,passed:!1,behavior:r,sirens:r==="polizei",careless:mt(.08+this.difficulty*.18),wobble:Math.random()*10};return h.v0=h.speed,r==="polizei"&&c.setPoliceText?.(this.policeText),this.cars.push(h),this.place(h,e),h}spawnOncoming(e,t=!0){let n=Math.floor(Math.random()*4),s=Gu(n>=2,.2),r=this.acquire(s);r.group.rotation.y=Math.PI;let o=s==="lkw",a=o?Me(80,89)*Gi:Me(Vu[n][0]-15,Vu[n][1])*Gi;this.oncoming.push({v:r,s:e+(t?Me(700,1300):Me(100,1200)),x:li(Ue.laneCenter(o?2+Math.round(Math.random()):n)),speed:a,len:r.length})}populate(e,t){this.reset();for(let n=0;n<18;n++){let s=Gp(this.leftOpen),r=e+40+n*45+Me(0,30);this.laneFree(s,r,30)&&this.spawn(r,s)}for(let n=0;n<10;n++)this.spawnOncoming(e,!1)}laneFree(e,t,n){for(let s of this.cars)if(No(s,e)&&Math.abs(s.s-t)<n+s.len)return!1;return!0}place(e,t){e.v.group.position.set(e.x,0,-(e.s-t))}update(e,t,n,s){this.t=t,this.events.length=0,this.difficulty=s.difficulty,this.leftOpen=s.leftOpen;let r=s.rain>.3;Np(r);let o=Math.round(et(15,32,this.difficulty));if(this.cars.length<o){let u=Gp(this.leftOpen),d=n.s+Me(620,950);this.laneFree(u,d,60)&&this.spawn(d,u)}if(n.speed<34&&mt(e*.35)&&this.cars.length<o+4){let u=this.leftOpen?1:mt(.6)?0:1,d=n.s-Me(150,190);this.laneFree(u,d,40)&&(this.spawn(d,u,{speed:Me(170,215)*Gi}).passed=!0)}let a=this.cars,l={s:n.s,x:n.x,speed:n.speed,len:n.len,w:n.w,isPlayer:!0};for(let u of a){if(u.decideIn-=e,!u.change&&u.decideIn<=0&&(u.decideIn=Me(.6,1.6),this.decide(u,a,l)),u.change){let y=u.change;if(y.t+=e,y.t<y.delay)u.v.setBlink(y.to<y.from?-1:1);else{let _=Ze((y.t-y.delay)/y.dur,0,1);u.x=et(Ue.laneCenter(y.from),Ue.laneCenter(y.to),hs(0,1,_)),_>=.5&&(u.lane=y.to),_>=1&&(u.change=null,u.v.setBlink(0))}}let d=this.leader(u,a,l),f=u.truck?1.7:1.25+(u.careless?-.4:0),m=u.truck?.6:1.6,v=2.8,g=3,p=m*(1-Math.pow(u.speed/Math.max(1,u.v0),4));if(d){let y=Math.max(.1,d.s-u.s-(d.len+u.len)/2),_=u.speed-d.speed,x=g+Math.max(0,u.speed*f+u.speed*_/(2*Math.sqrt(m*v)));p-=m*Math.pow(x/y,2),y<4&&_>0&&(p=Math.min(p,-9))}p=Ze(p,-10,m),u.speed=Math.max(0,u.speed+p*e),u.brake=p<-1.2,u.v.setBrake(u.brake||u.speed<3),u.s+=u.speed*e}for(let u=0;u<a.length;u++)for(let d=u+1;d<a.length;d++){let f=a[u],m=a[d];if(Math.abs(f.x-m.x)>(f.w+m.w)/2-.2)continue;let v=m.s-f.s,g=(f.len+m.len)/2+.5;if(Math.abs(v)<g){let p=v>0?f:m,y=v>0?m:f;p.s=y.s-g,p.speed=Math.min(p.speed,y.speed)}}for(let u of a){let d=Math.abs(u.x-n.x),f=u.s-n.s,m=(u.w+n.w)/2-d,v=(u.len+n.len)/2-Math.abs(f);if(m>.08&&v>.05&&(f<0&&m>.6&&u.speed>n.speed?(u.s=n.s-(u.len+n.len)/2-.4,u.speed=Math.min(u.speed,n.speed*.95)):(u.contactT=t,this.events.push({type:"crash",car:u,ds:f,dx:u.x-n.x,latOverlap:m,lonOverlap:v}))),!u.passed&&f<-(u.len+n.len)/2){u.passed=!0;let g=d-(u.w+n.w)/2,p=n.speed-u.speed,y=t-(u.contactT??-1e9)<2;g<.85&&g>-.05&&p>6&&!y&&this.events.push({type:"nearMiss",car:u,clearance:g,rel:p}),u.behavior==="polizei"&&this.events.push({type:"passPolice",car:u})}f>0&&(u.passed=!1)}let c=[];for(let u of a){let d=u.s-n.s;if(d<-240||d>1250){this.releaseVehicle(u.v);continue}if(c.push(u),this.place(u,n.s),u.v.group.rotation.y=u.change&&u.change.t>u.change.delay?u.change.to>u.change.from?-.035:.035:0,u.v.updateLights(t,u.sirens),r&&d>-10&&d<140){let f=-d+u.len/2;this.rain.emit(u.x,f,u.w,u.speed,u.truck?3:1)}}this.cars=c;let h=[];for(let u of this.oncoming){u.s-=u.speed*e;let d=u.s-n.s;if(d<-200){this.releaseVehicle(u.v),u.v.group.rotation.y=0;continue}u.v.group.position.set(u.x,0,-d),h.push(u)}for(this.oncoming=h;this.oncoming.length<11;)this.spawnOncoming(n.s,!0);return this.events}leader(e,t,n){let s=null,r=1/0,o=e.change&&e.change.t>=e.change.delay?[e.change.from,e.change.to]:[e.lane];for(let l of t){if(l===e)continue;let c=l.s-e.s;c<=0||c>220||c>=r||o.some(h=>No(l,h))&&(s=l,r=c)}let a=n.s-e.s;return a>0&&a<r&&o.some(l=>No(n,l))&&(s=n),s}decide(e,t,n){if(e.behavior==="elefant")return;let s=this.leader(e,t,n),r=e.truck?2:0;if(s&&e.lane>r&&s.s-e.s-(s.len+e.len)/2<70&&s.speed<e.v0-2.5){let a=e.lane-1;if(!(e.truck&&a<2)&&this.safe(e,a,t,n))return this.startChange(e,a)}if(e.lane<3&&!(e.truck&&e.lane>=3)){let o=e.lane===0&&this.leftOpen?.65:e.behavior==="schleicher"?.02:.25;if(mt(o)){let a=e.lane+1;if(this.laneClearAhead(e,a,t,n,90)&&this.safe(e,a,t,n))return this.startChange(e,a)}}if(e.careless&&mt(.04+this.difficulty*.12)){let o=e.lane+(mt(.5)?-1:1);o>=r&&o<=3&&this.safe(e,o,t,n,!0)&&this.startChange(e,o)}}laneClearAhead(e,t,n,s,r){for(let o of[...n,s]){if(o===e)continue;let a=o.s-e.s;if(a>-10&&a<r&&No(o,t))return!1}return!0}safe(e,t,n,s,r=!1){for(let o of[...n,s]){if(o===e||!No(o,t)&&!(o.change&&o.change.to===t))continue;let a=o.s-e.s,l=(o.len+e.len)/2;if(a>=0){if(a-l<Math.max(8,e.speed*(r?.3:.6)))return!1}else{let c=-a-l,h=o.speed-e.speed,u=o.isPlayer?r?6:14:8;if(c<u+Math.max(0,h)*(r?.6:2.2))return!1}}return!0}startChange(e,t){e.change={from:e.lane,to:t,t:0,delay:e.careless?Me(.15,.5):Me(.9,1.6),dur:e.truck?Me(4,5.5):Me(2.4,3.6)}}megafon(e){let t=0,n={s:e.s,x:e.x,speed:e.speed,len:e.len,w:e.w,isPlayer:!0};for(let s of this.cars){let r=s.s-e.s;if(r>0&&r<160&&Math.abs(s.x-e.x)<2.6&&!s.change&&s.behavior!=="elefant"){let a=[s.lane+1,s.lane-1].filter(l=>l>=(s.truck?2:0)&&l<=3&&this.safe(s,l,this.cars,n,!0)).sort((l,c)=>Math.abs(Ue.laneCenter(c)-e.x)-Math.abs(Ue.laneCenter(l)-e.x))[0];a!==void 0&&(s.change={from:s.lane,to:a,t:0,delay:.3,dur:1.8},s.decideIn=10+Me(0,5),t++)}}return t}elefantenrennen(e){let t=e+420;for(let r of this.cars)r.s>t-60&&r.s<t+60&&r.lane>=2&&(this.releaseVehicle(r.v),r.s=-1e9);this.cars=this.cars.filter(r=>r.s>-1e8);let n=this.spawn(t,3,{kind:"lkw",speed:84*Gi,behavior:"elefant"}),s=this.spawn(t+6,2,{kind:"lkw",speed:84.6*Gi,behavior:"elefant"});return setTimeout(()=>{s&&(s.behavior="normal")},26e3),[n,s]}police(e,t){this.policeText=t;let n=this.leftOpen?1:0,s=this.spawn(e-170,n,{kind:"polizei",speed:185*Gi,behavior:"polizei"});return s.v0=185*Gi,s.passed=!0,s}nearby(e,t=130){let n=[];for(let s of this.cars){let r=s.s-e.s;r>-25&&r<t&&n.push({dx:s.x,ds:r,len:s.len,w:s.w,kind:s.kind,brake:s.brake})}return n}};function No(i,e){let t=Ue.laneCenter(e),n=Math.max(i.x-i.w/2,t-1.875);return Math.min(i.x+i.w/2,t+1.875)-n>.35}function Gp(i){let e=Math.random();return i?e<.08?0:e<.32?1:e<.62?2:3:e<.17?0:e<.4?1:e<.66?2:3}var bi={skin:14263415,skinDark:13208418,black:1315862,shirt:1447448,hair:3811356,beard:2825492,pants:3421498,shoe:986896,white:16250352,mouth:7023141},Wu=null;function gs(i,e,{sheen:t=.9,rough:n=.95}={}){Wu||(Wu=hl(11));let s=new oi({color:i,roughness:n,metalness:0,sheen:t,sheenRoughness:.55,sheenColor:new ke(i).lerp(new ke(16777215),.35),bumpMap:Wu,bumpScale:.6});return e?xi(s):s}function Xs(i,e,t={}){let n=new pt({color:i,roughness:.4,metalness:0,...t});return e?xi(n):n}function Bo(i,e,t,n=10){return new D(new Hs(i,e,6,n),t)}function Pn(i,e,t=18,n=14){return new D(new bt(i,t,n),e)}function Vp({curved:i=!0}={}){let e=new we;e.name="MiniAdam";let t=gs(bi.skin,i),n=gs(bi.skinDark,i),s=gs(bi.shirt,i,{sheen:.6}),r=gs(bi.black,i,{sheen:.5}),o=gs(bi.hair,i,{sheen:1,rough:1}),a=gs(bi.beard,i,{sheen:1,rough:1}),l=gs(bi.pants,i,{sheen:.7}),c=gs(bi.shoe,i,{sheen:.4}),h=Xs(bi.white,i,{roughness:.25}),u=Xs(657930,i,{roughness:.15}),d=Xs(bi.mouth,i,{roughness:.6}),f=Xs(1710618,i,{roughness:.35,metalness:.4}),m=Xs(3947580,i,{roughness:.8,metalness:.3}),v=zr({w:256,h:256}),g=new pt({map:v,transparent:!0,roughness:.9,alphaTest:.2});i&&xi(g);let p=new we;p.name="body",e.add(p);let y=Bo(.15,.12,s,14);y.scale.set(1.08,1,.86),y.position.y=.43,p.add(y);let _=new D(new Xe(.163,.163,.16,20,1,!0,-.62,1.24),g);_.scale.set(1.08,1,.86),_.position.set(0,.45,0),_.rotation.y=0,p.add(_);let x=new Xe(.062,.07,.09,12),I=new D(x,s),T=new D(x,s),S=new we,R=new we;S.position.set(-.165,.53,0),R.position.set(.165,.53,0),p.add(S,R);for(let[W,X,j]of[[S,I,-1],[R,T,1]]){X.position.set(j*.015,-.03,0),X.rotation.z=j*.25,W.add(X);let xe=Bo(.045,.12,t);xe.position.set(j*.03,-.11,0),xe.rotation.z=j*.2,W.add(xe);let pe=new we;pe.position.set(j*.05,-.205,0);let A=Pn(.056,t);A.scale.set(1,.95,.85);let E=Pn(.024,t);E.position.set(-j*.03,.02,.035),pe.add(A,E),W.add(pe),W.userData.hand=pe}let M=new we,b=new D(new Xe(.016,.012,.13,12),f);b.position.y=-.02;let P=Pn(.03,m,14,10);P.position.y=.065,M.add(b,P),M.position.set(0,.02,.03),R.userData.hand.add(M);let k=new we;p.add(k);let U=new we,H=new we;U.position.set(-.075,.29,0),H.position.set(.075,.29,0),k.add(U,H);for(let W of[U,H]){let X=Bo(.072,.13,l);X.position.y=-.11,W.add(X);let j=Pn(.075,c);j.scale.set(1,.7,1.35),j.position.set(0,-.245,.03),W.add(j),W.userData.shoe=j,W.userData.thigh=X}let G=new we;G.position.y=.745,p.add(G);let N=Pn(.16,t,28,22);N.scale.set(1,.96,.95),G.add(N);for(let W of[-1,1]){let X=Pn(.035,t);X.scale.set(.6,1,.8),X.position.set(W*.158,-.005,-.01),G.add(X)}let $=[[0,0,-.13,.085],[-.08,-.02,-.12,.075],[.08,-.02,-.12,.075],[-.13,.01,-.06,.07],[.13,.01,-.06,.07],[-.145,-.04,0,.055],[.145,-.04,0,.055],[-.05,-.07,-.13,.07],[.05,-.07,-.13,.07],[0,.05,-.12,.08]];for(let[W,X,j,xe]of $){let pe=Pn(xe,o,12,10);pe.position.set(W,X,j),pe.scale.set(1,.9,.9),G.add(pe)}let z=new D(new bt(.168,26,16,Math.PI/2-1.35,2.7,Math.PI*.53,Math.PI*.4),a);z.scale.set(1,1,1),G.add(z);let ne=Pn(.075,a);ne.scale.set(1.25,.8,.9),ne.position.set(0,-.12,.08),G.add(ne);for(let W of[-1,1]){let X=Pn(.05,a,10,8);X.position.set(W*.13,-.05,.05),X.scale.set(.8,1.4,1),G.add(X)}let le=Bo(.022,.07,a,8);le.rotation.z=Math.PI/2,le.position.set(0,-.045,.152),G.add(le);let me=Pn(.026,d,12,8);me.scale.set(1.3,.55,.5),me.position.set(0,-.078,.15),G.add(me);let Ie=Pn(.043,n,16,12);Ie.scale.set(1.05,.95,.9),Ie.position.set(0,-.005,.165),G.add(Ie);let Ke=new we;G.add(Ke);for(let W of[-1,1]){let X=Pn(.034,h,16,12);X.scale.set(.9,1.1,.5),X.position.set(W*.055,.045,.142);let j=Pn(.016,u,12,10);j.position.set(W*.004,-.004,.158),j.scale.set(1,1.2,.5);let xe=Pn(.005,h,6,6);xe.position.set(W*.004+.006,.006,.166),Ke.add(X,j,xe)}for(let W of[-1,1]){let X=Bo(.011,.045,o,6);X.rotation.z=Math.PI/2+W*.18,X.position.set(W*.058,.098,.135),G.add(X)}let Z=new we;Z.position.y=.025,G.add(Z);let fe=new D(new bt(.172,26,14,0,Math.PI*2,0,Math.PI*.47),r);fe.scale.set(1,.9,1),Z.add(fe);let ve=new D(new Xe(.173,.173,.03,26,1,!0),r);ve.position.y=.005,Z.add(ve);let ce=new yn;ce.moveTo(-.15,0),ce.quadraticCurveTo(-.15,.16,0,.17),ce.quadraticCurveTo(.15,.16,.15,0),ce.lineTo(-.15,0);let be=new D(new Yn(ce,{depth:.012,bevelEnabled:!0,bevelThickness:.005,bevelSize:.006,bevelSegments:2}),r);be.rotation.x=Math.PI/2-.12,be.position.set(0,0,.12),Z.add(be);let Oe=Pn(.018,r,10,8);Oe.position.y=.155,Z.add(Oe);let qe=new D(new Xe(.176,.176,.1,20,1,!0,-.5,1),g);qe.position.y=.065,Z.add(qe);let tt=Xs(14155551,i,{roughness:.6,emissive:3820032,emissiveIntensity:.25}),se=Xs(14211288,i,{roughness:.2,metalness:.6}),he=new we,L=new D(new Xe(.168,.165,.2,18,1,!0),tt);L.scale.set(1.08,1,.88),L.position.y=.43,he.add(L);for(let W of[.38,.47]){let X=new D(new Xe(.17,.17,.022,18,1,!0),se);X.scale.set(1.08,1,.88),X.position.y=W,he.add(X)}he.visible=!1,p.add(he),e.traverse(W=>{W.isMesh&&(W.castShadow=!0,W.receiveShadow=!1)});let Ne={root:e,body:p,head:G,armL:S,armR:R,legL:U,legR:H,mic:M,vest:he,eyes:Ke,pose:"stand",setVest(W){he.visible=!!W},setPose(W){Ne.pose=W,M.visible=W!=="drive",W==="drive"?(U.rotation.x=-1.45,H.rotation.x=-1.45,U.position.y=H.position.y=.3,S.rotation.set(-1.15,0,.12),R.rotation.set(-1.15,0,-.12)):(U.rotation.x=H.rotation.x=0,S.rotation.set(0,0,.18),R.rotation.set(-1.9,.35,-.35))},animate(W,X={}){let j=X.wave||0,xe=X.steer||0;if(G.rotation.y=(X.look||0)*.6+Math.sin(W*.7)*.05,G.rotation.z=Math.sin(W*1.3)*.03-xe*.12,G.position.y=.745+Math.sin(W*2.2)*.004,Ne.pose==="drive"){if(S.rotation.z=.12+xe*.25,R.rotation.z=-.12+xe*.25,S.rotation.x=-1.15-xe*.12,R.rotation.x=-1.15+xe*.12,j>0){let pe=1-j;R.rotation.set(.2*j-1.15*pe,0,-.12*pe+(2.54+Math.sin(W*9)*.3)*j)}}else{S.rotation.z=.18+Math.sin(W*1.1)*.03,j>0&&S.rotation.set(-.3*j,0,.18+2.4*j+Math.sin(W*9)*.3*j);let pe=X.talk||0;R.rotation.x=-1.9+Math.sin(W*6)*.04*pe}}};return Ne.setPose("stand"),Ne}var Ho=new C;function Kn(i,e,t,n,s,r){let o=2*Math.PI*s/4,a=Math.max(r-2*s,0),l=Math.PI/4;Ho.copy(e),Ho[n]=0,Ho.normalize();let c=.5*o/(o+a),h=1-Ho.angleTo(i)/l;return Math.sign(Ho[t])===1?h*c:a/(o+a)+c+c*(1-h)}var vs=class extends Fe{constructor(e=1,t=1,n=1,s=2,r=.1){if(s=s*2+1,r=Math.min(e/2,t/2,n/2,r),super(1,1,1,s,s,s),s===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let a=new C,l=new C,c=new C(e,t,n).divideScalar(2).subScalar(r),h=this.attributes.position.array,u=this.attributes.normal.array,d=this.attributes.uv.array,f=h.length/6,m=new C,v=.5/s;for(let g=0,p=0;g<h.length;g+=3,p+=2)switch(a.fromArray(h,g),l.copy(a),l.x-=Math.sign(l.x)*v,l.y-=Math.sign(l.y)*v,l.z-=Math.sign(l.z)*v,l.normalize(),h[g+0]=c.x*Math.sign(a.x)+l.x*r,h[g+1]=c.y*Math.sign(a.y)+l.y*r,h[g+2]=c.z*Math.sign(a.z)+l.z*r,u[g+0]=l.x,u[g+1]=l.y,u[g+2]=l.z,Math.floor(g/f)){case 0:m.set(1,0,0),d[p+0]=Kn(m,l,"z","y",r,n),d[p+1]=1-Kn(m,l,"y","z",r,t);break;case 1:m.set(-1,0,0),d[p+0]=1-Kn(m,l,"z","y",r,n),d[p+1]=1-Kn(m,l,"y","z",r,t);break;case 2:m.set(0,1,0),d[p+0]=1-Kn(m,l,"x","z",r,e),d[p+1]=Kn(m,l,"z","x",r,n);break;case 3:m.set(0,-1,0),d[p+0]=1-Kn(m,l,"x","z",r,e),d[p+1]=1-Kn(m,l,"z","x",r,n);break;case 4:m.set(0,0,1),d[p+0]=1-Kn(m,l,"x","y",r,e),d[p+1]=1-Kn(m,l,"y","x",r,t);break;case 5:m.set(0,0,-1),d[p+0]=Kn(m,l,"x","y",r,e),d[p+1]=1-Kn(m,l,"y","x",r,t);break}}};var $n={length:4.69,width:1.85,height:1.443,wheelR:.335,frontAxleZ:.84-4.69/2,rearAxleZ:3.715-4.69/2,trackHalf:.79,plate:"F-LV 333"},CM=new C(-.37,1.2,.27),Zr=$n.length,Xp=[.84,3.715],qp=Cn([[0,.5],[.03,.56],[.1,.625],[.2,.675],[.45,.73],[.8,.79],[1.2,.86],[1.52,.92],[2.4,.965],[3.3,.995],[3.95,1.03],[4.25,1.05],[4.55,1.055],[4.64,1.04],[4.69,.95]]),Yp=Cn([[0,.31],[.06,.22],[.15,.18],[.5,.17],[4.3,.18],[4.6,.25],[4.69,.42]]),H_=ml(Yp,Xp,.405,.335),F_=Cn([[0,.6],[.08,.77],[.25,.86],[.6,.905],[1.2,.925],[3.6,.925],[4.3,.9],[4.6,.845],[4.69,.77]]),O_=Cn([[1.48,.93],[1.7,1.04],[2,1.2],[2.25,1.35],[2.5,1.415],[2.8,1.44],[3.1,1.44],[3.4,1.415],[3.7,1.3],[3.95,1.17],[4.15,1.075],[4.24,1.045]]),z_=Cn([[1.48,.8],[1.8,.84],[2.3,.8],[2.9,.74],[3.5,.7],[4,.63],[4.24,.57]]);function yt(i){return i-Zr/2}var Zp={w:F_,b:Yp,t:qp,tw:.9,bw:.94,n:4.6,L:Zr,bx:gl(H_,.48,.7)},G_=3.2,V_=.76,Kp={w:z_,b:i=>qp(i)-.05,t:O_,tw:V_,bw:1,n:G_,L:Zr},qu=(i,e,t)=>fs(Zp,i,e,t),Yu=(i,e,t)=>fs(Kp,i,e,t),Yt=(i,e,t)=>i+(e-i)*t,Yr=.34,qr=(i,e)=>i>0?e:Math.PI-e,W_=[[.05,1.24],[.085,1],[.13,.86],[.24,.8],[.4,.76]],X_=[[.03,1.2],[.025,.86],[.05,.54],[.16,.55],[.4,.7]];function Wp(i,e){let t=Math.min(i.length-1.000001,Math.max(0,e*(i.length-1))),n=Math.floor(t),s=t-n,r=i[Math.max(0,n-1)],o=i[n],a=i[n+1],l=i[Math.min(i.length-1,n+2)],c=h=>.5*(2*o[h]+(-r[h]+a[h])*s+(2*r[h]-5*o[h]+4*a[h]-l[h])*s*s+(-r[h]+3*o[h]-3*a[h]+l[h])*s*s*s);return[c(0),c(1)]}function q_(i,e){let t=Wp(W_,e),n=Wp(X_,e);return[Yt(n[0],t[0],i),Yt(n[1],t[1],i)]}function Y_(i,e){let t=0,n=Math.PI/2,s=new C,r=Math.abs(e);for(let o=0;o<30;o++){let a=(t+n)/2;qu(i,a,s),s.x>r?t=a:n=a}return qu(i,(t+n)/2,s).y}function Xu(i,e){let t=Yr,n=Math.PI/2,s=new C,r=Math.abs(e);for(let o=0;o<30;o++){let a=(t+n)/2;Yu(i,a,s),s.x>r?t=a:n=a}return Yu(i,(t+n)/2,s).y}function $p(){let i=new we;i.name="Tesla";let e=ae.phys({color:395016,metalness:.5,roughness:.34,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:1.25}),t=ae.phys({color:329740,metalness:.25,roughness:.04,transparent:!0,opacity:.74,envMapIntensity:2.6,depthWrite:!1}),n=ae.std({color:723724,roughness:.8,side:ft}),s=ae.std({color:1316118,roughness:.55}),r=ae.phys({color:197380,metalness:.3,roughness:.12,clearcoat:1,clearcoatRoughness:.08,side:ft}),o=ae.std({color:13162214,emissive:15397887,emissiveIntensity:1.1,roughness:.15,metalness:.2,side:ft}),a=ae.phys({color:11450047,metalness:1,roughness:.28,clearcoat:1,clearcoatRoughness:.04,side:ft}),l=ae.phys({color:790550,metalness:.5,roughness:.1,clearcoat:1,side:ft}),c=ae.std({color:3802373,emissive:16711680,emissiveIntensity:.2,roughness:.25,side:ft}),h=ae.std({color:1776414,roughness:.85}),u=ae.basic({color:8365256}),d=_i({u0:0,u1:Zr,...Zp,segs:150,ring:44,H:1.5,capDome:.8}),f=new D(d,e);f.castShadow=!0,i.add(f);let m=_i({u0:1.48,u1:4.24,...Kp,segs:70,ring:32,H:1.5}),v=new D(m,t);v.renderOrder=2,i.add(v);let g=[],p=(K,de)=>Vs(Yu,K,de);for(let K of[-1,1])g.push(p((de,ie)=>[Yt(Yt(1.5,2.25,ie),Yt(1.6,2.36,ie),de),qr(K,Yt(-.74,Yr+.04,ie))],{ns:2,nt:18,lift:.005})),g.push(p((de,ie)=>[Yt(2.76,2.88,de),qr(K,Yt(-.74,Yr+.04,ie))],{ns:2,nt:14,lift:.005})),g.push(p((de,ie)=>[Yt(Yt(4,3.62,ie),4.24,de),qr(K,Yt(-.74,Yr+.04,ie))],{ns:8,nt:14,lift:.005})),g.push(p((de,ie)=>[Yt(1.52,4.1,ie),qr(K,Yt(-.86,-.66,de))],{ns:2,nt:30,lift:.004}));g.push(p((K,de)=>[Yt(2.3,4.24,de),Yt(Yr,Math.PI-Yr,K)],{ns:18,nt:34,lift:.004}));let y=new D(It(g),r);y.castShadow=!0,i.add(y);let _=[];for(let K of Xp)for(let de of[-1,1]){let ie=new Xe(.405,.405,.5,22,1,!0,0,Math.PI);ie.rotateZ(Math.PI/2),ie.translate(de*.665,.335,yt(K));let Ae=new kn(.405,22,0,Math.PI);Ae.rotateY(Math.PI/2),Ae.translate(de*.415,.335,yt(K)),_.push(ie,Ae);for(let Le of[-1,1]){let nt=new $e(.5,.18);nt.translate(de*.665,.255,yt(K+Le*(.405-.012))),_.push(nt)}}i.add(new D(It(_.map(K=>K.index?K.toNonIndexed():K)),n));let x=(K,de,ie)=>{let Ae=new yn;Ae.moveTo(-K/2+ie,-de/2),Ae.lineTo(K/2-ie,-de/2),Ae.quadraticCurveTo(K/2,-de/2,K/2,-de/2+ie),Ae.lineTo(K/2,de/2-ie),Ae.quadraticCurveTo(K/2,de/2,K/2-ie,de/2),Ae.lineTo(-K/2+ie,de/2),Ae.quadraticCurveTo(-K/2,de/2,-K/2,de/2-ie),Ae.lineTo(-K/2,-de/2+ie),Ae.quadraticCurveTo(-K/2,-de/2,-K/2+ie,-de/2);let Le=new ls(Ae,6);return Le.deleteAttribute("uv"),Le},I=x(.8,.03,.015);I.rotateY(Math.PI),I.translate(0,.333,yt(0)-.003);let T=x(1.08,.07,.03);T.translate(0,.475,yt(Zr)+.003),i.add(new D(It([I,T]),s));let S=(K,de)=>Vs(qu,K,de),R=[],M=[],b=[],P=[];for(let K of[-1,1]){let de=(ie,Ae)=>{let[Le,nt]=q_(ie,Ae);return[Le,qr(K,nt)]};R.push(S(de,{ns:8,nt:24,lift:.004}));for(let[ie,Ae]of[[.34,.1],[.58,.11]])M.push(S((Le,nt)=>de(.4+.24*Le*Math.cos(nt*Math.PI*2),ie+Ae*Le*Math.sin(nt*Math.PI*2)),{ns:3,nt:18,lift:.006}));b.push(S((ie,Ae)=>de(Yt(.8,.94,ie),Yt(.08,.95,Ae)),{ns:2,nt:22,lift:.007})),P.push(S((ie,Ae)=>[Yt(4.4,4.672,Ae),qr(K,Yt(Yt(.5,.36,Ae),Yt(.78,1,Ae),ie))],{ns:6,nt:14,lift:.006}))}i.add(new D(It(R),a)),i.add(new D(It(M),l)),i.add(new D(It(b),o));let k=new D(It(P),c);i.add(k);let U=ae.std({map:cl($n.plate),roughness:.5}),H=new $e(.52,.112),G=new D(H,U);G.position.set(0,.415,yt(0)-.012),G.rotation.y=Math.PI;let N=new D(H,U);N.position.set(0,.62,yt(Zr)+.004),i.add(G,N);let $=new $e(.34,.34,8,8),z=$.attributes.position;for(let K=0;K<z.count;K++){let de=z.getX(K),ie=4.44-z.getY(K);z.setXYZ(K,de,Y_(ie,de)+.003,yt(ie))}$.computeVertexNormals();let ne=new D($,ae.std({map:zr({w:256,h:256}),transparent:!0,roughness:.4,alphaTest:.3,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));i.add(ne);let le=[],me=[],Ie=yt(1.8);for(let K of[-1,1]){let de=K*1,ie=1,Ae=vl(K);Ae.translate(de,ie,Ie),le.push(Ae),le.push(Rt(.1,.032,.045,K*.86,.968,Ie-.045,0,0,K*.22));let Le=new ls(ko(.9,K),10);Le.deleteAttribute("uv"),Le.translate(de,ie,Ie+.002),me.push(Le)}let Ke=It(le.map(K=>K.index?K.toNonIndexed():K));i.add(new D(Ke,e)),i.add(new D(It(me),ae.std({color:10465988,metalness:1,roughness:.06})));let Z=Ap($n.wheelR,.235,24),fe=ae.std({color:1118481,roughness:.9}),ve=ae.std({map:yp(),roughness:.45,metalness:.5}),ce=[];for(let K of[$n.frontAxleZ,$n.rearAxleZ])for(let de of[-1,1]){let ie=new we;ie.rotation.order="YXZ",ie.position.set(de*$n.trackHalf,$n.wheelR,K);let Ae=new D(Z,fe);Ae.castShadow=!0;let Le=new D(Uo($n.wheelR*.7,de*.119,0,0,de),ve);ie.add(Ae,Le),i.add(ie),ce.push(ie)}let be=(K,de,ie,Ae,Le,nt,B=0,Te=.03)=>{let J=new vs(K,de,ie,3,Math.min(Te,K/2-.001,de/2-.001,ie/2-.001));return B&&J.rotateX(B),J.translate(Ae,Le,nt),J},Oe=[];Oe.push(be(1.3,.18,.42,0,.79,yt(1.74),0,.05));for(let K of[-1,1])Oe.push(be(.5,.12,.5,K*.37,.5,yt(2.72),0,.04)),Oe.push(be(.5,.64,.12,K*.37,.86,yt(3),-.2,.05)),Oe.push(be(.27,.19,.1,K*.37,1.25,yt(3.07),-.1,.045));Oe.push(be(1.36,.16,.5,0,.5,yt(3.62),0,.04)),Oe.push(be(1.12,.55,.12,0,.82,yt(3.92),-.18,.05)),Oe.push(be(.22,.2,.8,0,.55,yt(2.6),0,.04));let qe=new D(It(Oe),h);i.add(qe);let tt=new D(new $e(.33,.2),u);tt.position.set(0,1,yt(1.93)),tt.rotation.x=-.2,i.add(tt);let se=new D(new Un(.17,.022,10,28),h);se.position.set(-.37,.9,yt(2.15)),se.rotation.x=-.35,i.add(se);let he=Vp({curved:!0});he.setPose("drive"),he.root.position.set(-.37,.4,yt(2.62)),he.root.rotation.y=Math.PI,i.add(he.root);let L=new D(new Xe(.2,.22,.07,18),ae.phys({color:11538987,roughness:.9,sheen:1,sheenColor:new ke(16737920)}));L.position.set(-.37,.59,yt(2.72)),i.add(L);let Ne=new D(new Xe(.18,.2,.07,18),ae.phys({color:1920928,roughness:.9,sheen:1,sheenColor:new ke(7842047)}));Ne.position.set(-.37,.655,yt(2.71)),i.add(Ne);let W=new el(16773597,0,2.2,.62,.6,1.5);W.position.set(-.37,1.24,yt(2.24)),W.target.position.set(-.37,.96,yt(2.66)),i.add(W,W.target);let X=ae.basic({color:0,map:dl(),transparent:!0,opacity:.55,depthWrite:!1}),j=new D(new $e(2.2,5.15),X);j.rotation.x=-Math.PI/2,j.position.set(0,.02,0),j.renderOrder=-1,i.add(j);let xe=[],pe=2.5,A=Xu(pe,0),E=new Xe(.05,.055,.012,20);E.translate(0,A+.004,yt(pe)),xe.push(E);let V=new Xe(.012,.016,.03,10);V.translate(0,A+.024,yt(pe)),xe.push(V),xe.push(be(.12,.068,.1,0,A+.07,yt(pe),0,.012));let Q=3.45;for(let K=0;K<3;K++){let de=-.18+K*.18,ie=Xu(Q,de),Ae=new Xe(.03,.034,.014,16);Ae.translate(de,ie+.005,yt(Q)),xe.push(Ae);let Le=new Xe(.005,.009,.17,8);Le.translate(0,.085,0),Le.rotateX(.22),Le.translate(de,ie+.01,yt(Q)),xe.push(Le);let nt=new bt(.009,8,6);nt.translate(0,.17,0),nt.rotateX(.22),nt.translate(de,ie+.01,yt(Q)),xe.push(nt)}i.add(new D(It(xe.map(K=>K.index?K.toNonIndexed():K)),s));let re=new D(new kn(.025,14),ae.std({color:2241348,metalness:.9,roughness:.1}));re.position.set(0,A+.07,yt(pe)-.051),re.rotation.y=Math.PI,i.add(re);let te=new D(new bt(.008,8,6),ae.basic({color:16720418}));te.position.set(.04,A+.092,yt(pe)-.048),i.add(te);let He=new we,Ee=ae.std({color:15921906,roughness:.5}),Re=new D(new Xe(.29,.27,.035,28),Ee);Re.rotation.x=-.35,Re.position.y=.16;let lt=new D(new Xe(.025,.03,.16,8),Ee);lt.position.y=.08,He.add(Re,lt),He.position.set(0,Xu(3.05,0),yt(3.05)),He.visible=!1,i.add(He),i.traverse(K=>{K.isMesh&&K!==v&&K!==j&&(K.castShadow=!0)});let ge=0,Be=!1;return{root:i,adam:he,glass:t,wheels:ce,cabinLight:W,recLed:te,setStarlink(K){He.visible=!!K},setGroundShade(K){X.opacity=.55+.3*Math.min(1,Math.max(0,K))},setVest(K){he.setVest(K)},setBrake(K){K!==Be&&(Be=K,c.emissiveIntensity=K?.95:.2)},update(K,de,ie,Ae){ge-=de*K/$n.wheelR;for(let Le=0;Le<ce.length;Le++)ce[Le].rotation.x=ge,Le<2&&(ce[Le].rotation.y=-ie*.35);te.visible=Math.sin(Ae*4)>-.2}}}var hn=256,Rl=class{constructor(){this.group=new we,this.group.name="NOMI",this.canvas=document.createElement("canvas"),this.canvas.width=hn,this.canvas.height=hn,this.ctx=this.canvas.getContext("2d"),this.tex=new Pt(this.canvas),this.tex.colorSpace=ht;let e=.066,t=new D(new Xe(.03,.042,.03,24),new pt({color:1381914,metalness:.6,roughness:.35}));t.position.y=.015,this.group.add(t),this.head=new we,this.head.position.y=.03+e*.92,this.group.add(this.head);let n=new D(new bt(e,40,28),new oi({color:460810,metalness:.3,roughness:.18,clearcoat:1,clearcoatRoughness:.08,envMapIntensity:1.6}));this.head.add(n);let s=.72,r=new bt(e*1.004,32,24,Math.PI/2-s,2*s,Math.PI/2-s,2*s),o=r.attributes.position,a=r.attributes.uv,l=e*Math.sin(s)*2;for(let h=0;h<o.count;h++)a.setXY(h,o.getX(h)/l+.5,o.getY(h)/l+.5);this.faceMat=new ln({map:this.tex,toneMapped:!1,transparent:!0});let c=new D(r,this.faceMat);this.head.add(c),this.ring=new D(new Un(.036,.003,8,32),new ln({color:6737151,toneMapped:!1,transparent:!0,opacity:.6})),this.ring.rotation.x=Math.PI/2,this.ring.position.y=.031,this.group.add(this.ring),this.mood="idle",this.moodTimer=0,this.talk=0,this.talkTimer=0,this.yaw=0,this.targetYaw=0,this.lookX=0,this.lookTarget=0,this.blink=0,this.nextBlink=2,this.idleYaw=-.06,this.bounce=0,this.lastDraw=-1,this.draw(0)}setMood(e,t=2.5){this.mood=e,this.moodTimer=t,this.bounce=1}speak(e=2.5){this.talkTimer=Math.max(this.talkTimer,e),this.bounce=1}glance(e,t=1.5){this.lookTarget=Ze(e,-1,1),this.glanceTimer=t}update(e,t,n){this.moodTimer>0&&(this.moodTimer-=e,this.moodTimer<=0&&(this.mood="idle")),this.glanceTimer>0&&(this.glanceTimer-=e,this.glanceTimer<=0&&(this.lookTarget=0)),this.talkTimer=Math.max(0,this.talkTimer-e),this.talk=Nn(this.talk,this.talkTimer>0?1:0,8,e),this.targetYaw=this.talkTimer>0?n:this.idleYaw+this.lookTarget*.7+Math.sin(t*.37)*.06,this.yaw=Nn(this.yaw,this.targetYaw,5,e),this.lookX=Nn(this.lookX,this.talkTimer>0?0:this.lookTarget,6,e),this.bounce=Math.max(0,this.bounce-e*2.2),this.head.rotation.y=this.yaw,this.head.rotation.x=-.24+Math.sin(t*9)*.03*this.talk-Math.sin(this.bounce*Math.PI)*.12,this.head.position.y=.03+.066*.92+Math.sin(this.bounce*Math.PI*2)*.006,this.ring.material.opacity=.35+.4*this.talk+.15*Math.sin(t*2),this.nextBlink-=e,this.nextBlink<=0&&(this.blink=1,this.nextBlink=2.5+Math.random()*4),this.blink=Math.max(0,this.blink-e*7),t-this.lastDraw>1/30&&(this.lastDraw=t,this.draw(t),this.tex.needsUpdate=!0)}draw(e){let t=this.ctx;t.clearRect(0,0,hn,hn);let n=t.createRadialGradient(hn*.42,hn*.36,10,hn/2,hn/2,hn*.5);n.addColorStop(0,"#16202a"),n.addColorStop(.7,"#06080b"),n.addColorStop(1,"#030405"),t.fillStyle=n,t.beginPath(),t.arc(hn/2,hn/2,hn*.49,0,Math.PI*2),t.fill();let s=this.mood,r=hn/2+this.lookX*34,o=hn/2+4+Math.sin(e*10)*4*this.talk,a=46;t.save(),t.shadowColor="rgba(160,220,255,0.9)",t.shadowBlur=14,t.strokeStyle="#ffffff",t.fillStyle="#ffffff",t.lineWidth=11,t.lineCap="round",t.lineJoin="round";let l=s==="idle"||s==="talk"?this.blink:0;for(let c of[-1,1]){let h=r+c*a;this.drawEye(t,s,h,o,c,l,e)}t.restore(),t.fillStyle="rgba(255,255,255,0.07)",t.beginPath(),t.ellipse(hn*.38,hn*.26,hn*.22,hn*.09,-.5,0,Math.PI*2),t.fill()}drawEye(e,t,n,s,r,o,a){let c=70;switch(t){case"happy":e.beginPath(),e.arc(n,s+12,24,Math.PI*1.1,Math.PI*1.9),e.stroke();return;case"love":this.heart(e,n,s,26+Math.sin(a*8)*3);return;case"dizzy":{e.beginPath();for(let h=0;h<Math.PI*5;h+=.2){let u=3+h*2.6,d=n+Math.cos(h+a*6*r)*u,f=s+Math.sin(h+a*6*r)*u;h===0?e.moveTo(d,f):e.lineTo(d,f)}e.lineWidth=7,e.stroke();return}case"surprised":e.beginPath(),e.arc(n,s,30,0,Math.PI*2),e.stroke(),e.beginPath(),e.arc(n,s,9,0,Math.PI*2),e.fill();return;case"sleep":e.beginPath(),e.moveTo(n-22,s+6),e.lineTo(n+22,s+6),e.stroke();return;case"worried":e.save(),e.translate(n,s),e.rotate(r*-.35),Zu(e,-38/2,-c/2+8,38,c-16,18),e.stroke(),e.restore();return;case"think":r<0?(e.beginPath(),e.moveTo(n-20,s),e.lineTo(n+20,s),e.stroke()):(Zu(e,n-38/2,s-c/2,38,c,18),e.stroke());return;case"wink":if(r>0){e.beginPath(),e.arc(n,s+12,22,Math.PI*1.1,Math.PI*1.9),e.stroke();return}break;default:break}c=Math.max(8,c*(1-o*.92)),Zu(e,n-38/2,s-c/2,38,c,Math.min(18,c/2)),e.stroke()}heart(e,t,n,s){e.beginPath(),e.moveTo(t,n+s*.9),e.bezierCurveTo(t-s*1.4,n-s*.1,t-s*.6,n-s*1.1,t,n-s*.35),e.bezierCurveTo(t+s*.6,n-s*1.1,t+s*1.4,n-s*.1,t,n+s*.9),e.fill()}};function Zu(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.arcTo(e+n,t,e+n,t+s,r),i.arcTo(e+n,t+s,e,t+s,r),i.arcTo(e,t+s,e,t,r),i.arcTo(e,t,e+n,t,r),i.closePath()}var bn=1024,Mn=640,Jt=372,Z_={bg:"#eceef0",panel:"#f4f5f6",text:"#1d1f22",sub:"#6b7078",lane:"#c3c7cc",car:"#9aa0a8",land:"#efece6",road:"#ffffff",roadCase:"#d4d0c8",hwy:"#ffd36a",hwyCase:"#d9a640",water:"#a9d3ec",park:"#cfe7c4",town:"#e2ddd5",route:"#2f6fe4",routeCase:"#1e4fb0",dock:"#1b1c1f",card:"rgba(32,34,38,0.92)"},K_={bg:"#141518",panel:"#1b1c20",text:"#f2f3f5",sub:"#9097a1",lane:"#4a4f57",car:"#6d737c",land:"#25272b",road:"#3a3d43",roadCase:"#2c2e33",hwy:"#8a6d2c",hwyCase:"#5d4a20",water:"#1d3550",park:"#233428",town:"#2f3136",route:"#4c8dff",routeCase:"#2a5fc0",dock:"#0c0d0f",card:"rgba(10,11,13,0.92)"};function In(i){return 900*us(i/3200,5)+260*us(i/950,8)}var Cl=class{constructor(){this.canvas=document.createElement("canvas"),this.canvas.width=bn,this.canvas.height=Mn,this.ctx=this.canvas.getContext("2d"),this.texture=new Pt(this.canvas),this.texture.colorSpace=ht,this.texture.anisotropy=8,this.zoom=.16,this.acc=0,this.spin=0,this.featureCache=new Map}update(e,t){this.acc+=e,this.spin+=e,!(this.acc<1/15)&&(this.acc=0,this.draw(t),this.texture.needsUpdate=!0)}draw(e){let t=this.ctx,n=e.dark?K_:Z_;this.T=n,t.save(),t.fillStyle=n.bg,t.fillRect(0,0,bn,Mn),this.drawMap(t,e,n),this.drawCarPanel(t,e,n),this.drawTopBar(t,e,n),this.drawDock(t,e,n),e.funkloch>0&&(t.fillStyle=`rgba(120,120,120,${.35*e.funkloch})`,t.fillRect(Jt,0,bn-Jt,Mn-64),t.fillStyle="#ffffff",t.font="bold 34px Arial, sans-serif",t.textAlign="center",t.fillText("Keine Verbindung",Jt+(bn-Jt)/2,300),t.font="24px Arial, sans-serif",t.fillText("Mobilfunk wird neu geb\xFCndelt \u2026",Jt+(bn-Jt)/2,340)),t.restore()}drawCarPanel(e,t,n){e.fillStyle=n.panel,e.fillRect(0,0,Jt,Mn),e.textBaseline="alphabetic",e.font='600 26px "Helvetica Neue", Arial, sans-serif',e.textAlign="left",["P","R","N","D"].forEach((x,I)=>{e.fillStyle=x==="D"?n.text:n.sub,e.font=(x==="D"?"700 28px":"500 24px")+' "Helvetica Neue", Arial, sans-serif',e.fillText(x,26+I*30,78)});let r=196,o=56;e.strokeStyle=n.text,e.lineWidth=3,Ft(e,r,o,60,26,5),e.stroke(),e.fillStyle=n.text,e.fillRect(r+60,o+8,5,10);let a=Ze(t.battery,0,100);e.fillStyle=a<15?"#e0301e":a<30?"#f0a020":"#34c759",e.fillRect(r+4,o+4,52*(a/100),18),e.fillStyle=n.text,e.font='600 26px "Helvetica Neue", Arial, sans-serif',e.fillText(Math.round(a)+" %",r+76,79),e.textAlign="center",e.font='600 104px "Helvetica Neue", Arial, sans-serif',e.fillStyle=n.text,e.fillText(String(Math.round(t.speedKmh)),Jt/2,196),e.font='500 26px "Helvetica Neue", Arial, sans-serif',e.fillStyle=n.sub,e.fillText("km/h",Jt/2,232),t.limit&&(e.save(),e.translate(Jt-58,150),e.fillStyle="#fff",e.beginPath(),e.arc(0,0,34,0,Math.PI*2),e.fill(),e.strokeStyle="#d4141b",e.lineWidth=8,e.stroke(),e.fillStyle="#111",e.font="bold 30px Arial, sans-serif",e.textBaseline="middle",e.fillText(String(t.limit),0,2),e.restore());let l=262,c=Mn-78,h=Jt/2,u=l,d=(x,I)=>{let S=1/(1+(Ze(I,-18,120)+18)/26),R=et(u+6,c,S*1.05);return[h+x*30*S,R,S]},f=t.playerX,m=[-7.5,-3.75,0,3.75,7.5];if(t.leftLane>0){e.fillStyle=`rgba(62,120,255,${.25+.15*Math.sin(this.spin*6)})`,e.beginPath();let x=d(-7.5-f,-18);e.moveTo(x[0],x[1]);for(let I=-18;I<=120;I+=6)x=d(-7.5-f,I),e.lineTo(x[0],x[1]);for(let I=120;I>=-18;I-=6)x=d(-3.75-f,I),e.lineTo(x[0],x[1]);e.fill()}if(m.forEach((x,I)=>{e.strokeStyle=n.lane,e.lineWidth=I===0||I===4?4:3,e.setLineDash(I===0||I===4?[]:[14,14]),e.beginPath();for(let T=-18;T<=120;T+=4){let S=d(x-f,T);T===-18?e.moveTo(S[0],S[1]):e.lineTo(S[0],S[1])}e.stroke()}),e.setLineDash([]),t.leftLane<=0){let x=d(-5.625-f,40);e.font=`${Math.round(30*x[2]+12)}px "Segoe UI Emoji", "Noto Color Emoji", sans-serif`,e.textAlign="center",e.fillText("\u{1F512}",x[0],x[1])}let v=(t.cars||[]).filter(x=>x.ds>-18&&x.ds<120).sort((x,I)=>I.ds-x.ds);for(let x of v){let I=d(x.dx-f,x.ds-x.len/2),T=d(x.dx-f,x.ds+x.len/2),S=x.w*30*I[2];e.fillStyle=x.kind==="polizei"?"#5c7ed6":n.car,Ft(e,I[0]-S/2,T[1],S,Math.max(4,I[1]-T[1]),Math.min(8,S/3)),e.fill(),x.brake&&(e.fillStyle="#ff3b30",e.fillRect(I[0]-S/2,I[1]-4,S,4))}let g=d(0,0),p=d(0,4.7),y=1.85*30*g[2];e.fillStyle="#111214",Ft(e,g[0]-y/2,p[1],y,g[1]-p[1],10),e.fill(),e.fillStyle="rgba(120,150,190,0.8)",Ft(e,g[0]-y*.36,p[1]+(g[1]-p[1])*.18,y*.72,(g[1]-p[1])*.28,6),e.fill();let _=e.createLinearGradient(0,Mn-128,0,Mn-112);_.addColorStop(0,n.panel+"00"),_.addColorStop(1,n.panel),e.fillStyle=_,e.fillRect(0,Mn-128,Jt,16),e.fillStyle=n.panel,e.fillRect(0,Mn-112,Jt,112),e.textAlign="center",e.font='600 24px "Helvetica Neue", Arial, sans-serif',t.leftLane>0?(e.fillStyle="#2f6fe4",e.fillText("Linke Spur frei \xB7 "+Math.ceil(t.leftLane)+" s",Jt/2,Mn-86)):(e.fillStyle=n.sub,e.fillText("Rechtsfahrgebot aktiv",Jt/2,Mn-86))}features(e){if(this.featureCache.has(e))return this.featureCache.get(e);let t=Bn(e*977+3),n=e*600,s={roads:[],towns:[],parks:[],water:null,exit:null};if(t()<.55){let o=n+t()*600,a=(t()-.5)*1.2;s.roads.push({s:o,a,len:1500+t()*2500}),t()<.6&&(s.exit=o)}if(t()<.35){let o=t()<.5?-1:1;s.towns.push({s:n+t()*600,x:o*(300+t()*900),r:120+t()*220,seed:e})}let r=Math.floor(t()*3);for(let o=0;o<r;o++)s.parks.push({s:n+t()*600,x:(t()<.5?-1:1)*(200+t()*1400),r:150+t()*400,k:t()});return t()<.12&&(s.water={s:n+t()*600,a:(t()-.5)*.8}),this.featureCache.set(e,s),this.featureCache.size>80&&this.featureCache.delete(this.featureCache.keys().next().value),s}drawMap(e,t,n){let s=t.navi||{},r=Jt,o=bn-Jt,a=Mn-64;e.save(),e.beginPath(),e.rect(r,0,o,a),e.clip(),e.fillStyle=n.land,e.fillRect(r,0,o,a);let l=t.s,c=Math.max(0,s.remaining??3e3),h=Ze(330/Math.max(c+250,400),.07,.42);this.zoom=et(this.zoom,h,.08);let u=this.zoom,d=r+o/2,f=a*.8,m=In(l),v=(In(l+25)-In(l-25))/50,g=Math.atan(v),p=(R,M)=>{let b=R-m,P=-(M-l),k=Math.cos(-g),U=Math.sin(-g);return[d+(b*k-P*U)*u,f+(b*U+P*k)*u]},y=l-a*.25/u-600,_=l+a*.9/u+600,x=Math.floor(y/600),I=Math.floor(_/600);for(let R=x;R<=I;R++){let M=this.features(R);for(let b of M.parks){let[P,k]=p(In(b.s)+b.x,b.s);e.fillStyle=n.park,e.beginPath(),e.ellipse(P,k,b.r*u,b.r*u*(.6+b.k*.6),b.k*3,0,Math.PI*2),e.fill()}if(M.water){e.strokeStyle=n.water,e.lineWidth=Math.max(5,60*u),e.beginPath();let b=M.water.s,P=M.water.a;for(let k=-6;k<=6;k++){let U=In(b)+k*400,H=b+k*400*Math.tan(P)+Math.sin(k)*80,[G,N]=p(U,H);k===-6?e.moveTo(G,N):e.lineTo(G,N)}e.stroke()}for(let b of M.towns){let P=Bn(b.seed),[k,U]=p(In(b.s)+b.x,b.s),H=b.r*u;e.save(),e.fillStyle=n.town,e.beginPath(),e.arc(k,U,H,0,Math.PI*2),e.fill(),e.clip(),e.strokeStyle=n.road,e.lineWidth=2.5,e.lineCap="round";let G=P()*Math.PI;for(let N=0;N<2;N++){let $=G+N*(Math.PI/2+(P()-.5)*.5),z=Math.cos($),ne=Math.sin($);for(let le=-2;le<=2;le++){if(P()<.25)continue;let me=(le+(P()-.5)*.5)*H*.36,Ie=H*(.45+P()*.75),Ke=(P()-.5)*H*.7,Z=k-ne*me+z*Ke,fe=U+z*me+ne*Ke;e.beginPath(),e.moveTo(Z-z*Ie/2,fe-ne*Ie/2),e.lineTo(Z+z*Ie/2,fe+ne*Ie/2),e.stroke()}}e.restore()}}for(let R=x;R<=I;R++){let M=this.features(R);for(let b of M.roads){let P=In(b.s),k=p(P-Math.cos(b.a)*b.len,b.s-Math.sin(b.a)*b.len),U=p(P+Math.cos(b.a)*b.len,b.s+Math.sin(b.a)*b.len);e.strokeStyle=n.roadCase,e.lineWidth=9,e.beginPath(),e.moveTo(k[0],k[1]),e.lineTo(U[0],U[1]),e.stroke(),e.strokeStyle=n.road,e.lineWidth=6,e.stroke()}}let T=[];for(let R=y;R<=_;R+=40/Math.max(u,.05))T.push(p(In(R),R));let S=(R,M,b)=>{e.strokeStyle=M,e.lineWidth=b,e.lineJoin="round",e.lineCap="round",e.beginPath(),R.forEach((P,k)=>k?e.lineTo(P[0],P[1]):e.moveTo(P[0],P[1])),e.stroke()};if(S(T,n.hwyCase,17),S(T,n.hwy,12),s.target&&!s.arrived){let R=s.recalc||0,M=l+c,b=s.side||1,P=[];if(s.wende&&s.wendeS>l){for(let k=l;k<=s.wendeS;k+=30)P.push(p(In(k)+6,k));for(let k=0;k<=8;k++){let U=k/8*Math.PI;P.push(p(In(s.wendeS)+6-(1-Math.cos(U))*70,s.wendeS+Math.sin(U)*120))}for(let k=s.wendeS;k>=l-900;k-=30)P.push(p(In(k)-134,k))}else{let k=Math.max(l,M-260);for(let G=l;G<=k;G+=Math.max(20,12/u))P.push(p(In(G),G));let U=In(k),H=In(M)+b*520;for(let G=1;G<=10;G++){let N=G/10;P.push(p(et(U,H,N*N),et(k,M+120,N)))}}if(R<1&&(e.globalAlpha=1-R,S(P,n.routeCase,15),S(P,n.route,10),e.globalAlpha=1),!s.wende){let[k,U]=p(In(M)+b*520,M+120);k>r-40&&k<bn+40&&U>-40&&U<a+40&&(e.fillStyle="#e8352b",e.beginPath(),e.arc(k,U-26,15,Math.PI,0),e.lineTo(k,U),e.closePath(),e.fill(),e.fillStyle="#fff",e.beginPath(),e.arc(k,U-26,6,0,Math.PI*2),e.fill())}}if(e.save(),e.translate(d,f),e.fillStyle="rgba(47,111,228,0.18)",e.beginPath(),e.arc(0,0,34,0,Math.PI*2),e.fill(),e.fillStyle="#ffffff",e.beginPath(),e.moveTo(0,-24),e.lineTo(17,18),e.lineTo(0,8),e.lineTo(-17,18),e.closePath(),e.fill(),e.fillStyle="#2f6fe4",e.beginPath(),e.moveTo(0,-18),e.lineTo(12,13),e.lineTo(0,5),e.lineTo(-12,13),e.closePath(),e.fill(),e.restore(),s.recalc>0&&(e.fillStyle=`rgba(255,255,255,${.5*s.recalc})`,e.fillRect(r,0,o,a),e.save(),e.translate(d,a*.45),e.strokeStyle="#2f6fe4",e.lineWidth=8,e.lineCap="round",e.beginPath(),e.arc(0,0,34,this.spin*6,this.spin*6+4.2),e.stroke(),e.restore(),e.fillStyle="#1d1f22",e.font='bold 32px "Helvetica Neue", Arial, sans-serif',e.textAlign="center",e.fillText("Route wird neu berechnet \u2026",d,a*.45+80)),s.target){e.fillStyle=n.card,Ft(e,r+18,70,o-36,118,16),e.fill(),e.fillStyle="#ffffff",e.textAlign="left",e.font='bold 30px "Helvetica Neue", Arial, sans-serif';let R=s.arrived?"Ziel erreicht":s.wende&&s.wendeS>l?"Bitte wenden":c>400?"A7 folgen":"Ausfahrt nehmen",M=s.wende&&s.wendeS>l?s.wendeS-l:Math.max(0,c-260);e.fillText(this.arrowFor(R)+"  "+R,r+38,112),e.font='600 28px "Helvetica Neue", Arial, sans-serif',e.textAlign="right",s.arrived||e.fillText(Jp(M),bn-36,112),e.textAlign="left",e.font='26px "Helvetica Neue", Arial, sans-serif';let b=s.arrived?"":Jp(c)+(s.eta?" \xB7 "+s.eta:""),P=e.measureText(b).width;e.fillStyle="#c9d6ff",Ku(e,(s.arrived?"\u23F3 ":"\u{1F3C1} ")+s.target,r+38,160,bn-36-P-26-(r+38),20),e.font='26px "Helvetica Neue", Arial, sans-serif',e.textAlign="right",e.fillStyle="#ffffff",e.fillText(b,bn-36,160),e.fillStyle="rgba(200,16,46,0.94)",Ft(e,r+18,a-74,o-36,56,14),e.fill(),e.fillStyle="#ffffff",e.textAlign="left",e.font='bold 24px "Helvetica Neue", Arial, sans-serif',Ku(e,"\u{1F4E1} Ferngesteuert von "+(s.bidder||"\u2014"),r+34,a-38,o-210),e.textAlign="right",e.font='bold 26px "Helvetica Neue", Arial, sans-serif',e.fillText(s.bid||"",bn-36,a-38)}e.restore()}arrowFor(e){return e==="Ziel erreicht"?"\u2713":e==="Bitte wenden"?"\u21B6":e==="Ausfahrt nehmen"?"\u2197":"\u2191"}drawTopBar(e,t,n){e.fillStyle=t.dark?"rgba(20,21,24,0.85)":"rgba(244,245,246,0.88)",e.fillRect(Jt,0,bn-Jt,50),e.fillStyle=n.text,e.font='600 24px "Helvetica Neue", Arial, sans-serif',e.textAlign="left",e.textBaseline="middle",e.fillText("\u{1F464} Mini Adam",Jt+20,26),e.textAlign="right",e.fillText(t.clock+"   "+t.temp+" \xB0C   "+(t.funkloch>0?"Kein Netz":"LTE \u2582\u2584\u2586\u2588"),bn-18,26),e.textBaseline="alphabetic"}drawDock(e,t,n){e.fillStyle=n.dock,e.fillRect(0,Mn-64,bn,64),e.fillStyle="#e6e8eb",e.font='30px "Segoe UI Emoji", "Noto Color Emoji", sans-serif',e.textAlign="center",e.textBaseline="middle",["\u{1F697}","\u2744\uFE0F","\u{1F3B5}","\u{1F4DE}","\u{1F4E1}","\u{1F327}\uFE0F","\u2699\uFE0F"].forEach((r,o)=>e.fillText(r,70+o*90,Mn-32)),e.font='600 26px "Helvetica Neue", Arial, sans-serif',e.fillStyle="#e6e8eb",e.textAlign="right",e.fillText("21,0 \xB0",bn-26,Mn-32),t.wiperOn&&(e.textAlign="left",e.fillStyle="#4c8dff",e.font='600 22px "Helvetica Neue", Arial, sans-serif',Ku(e,"Wischer: Auto (Beta)",656,Mn-32,bn-130-656,14)),e.textAlign="center",e.textBaseline="alphabetic"}};function Jp(i){return i>=1e3?rn(i/1e3,i>=1e4?0:1)+" km":Math.max(0,Math.round(i/10)*10)+" m"}function Ku(i,e,t,n,s,r=14){let o=parseFloat(i.font.match(/(\d+)px/)[1]);for(;i.measureText(e).width>s&&o>r;)o-=2,i.font=i.font.replace(/\d+px/,o+"px");if(i.measureText(e).width>s){let a=e;for(;a.length>4&&i.measureText(a+"\u2026").width>s;)a=a.slice(0,-1);e=a.trimEnd()+"\u2026"}i.fillText(e,t,n)}var $_=new C(-.37,1.2,.27),J_=-.12,xs=(()=>{let i=new C(0,.9,-.88),e=new C(0,1.38,-.095),t=e.clone().sub(i),n=t.length();t.normalize();let s=new C(1,0,0),r=new C().crossVectors(t,s).normalize();return{base:i,top:e,U:t,X:s,N:r,length:n,halfBase:.74,halfTop:.63}})(),Kr=[{pivot:new C(-.64,.884,-.905),length:.62,max:1.55},{pivot:new C(.06,.884,-.905),length:.56,max:1.75}];function jp(i){return new oi({color:i,roughness:.95,sheen:1,sheenRoughness:.5,sheenColor:new ke(i).lerp(new ke(16777215),.35),bumpMap:hl(5),bumpScale:.5})}function Pl(i,e,t,n,s,r=0){let o=new C().subVectors(e,i),a=o.length(),l=.5,c=new Hs(l,Math.max(.001,a/Math.max(t,n)-2*l),6,16);c.scale(t,Math.max(t,n),n),c.translate(0,a/2,0),r&&c.rotateY(r);let h=new D(c,s);return h.position.copy(i),h.quaternion.setFromUnitVectors(new C(0,1,0),o.normalize()),h}function j_(){let i=document.createElement("canvas");i.width=1024,i.height=300;let e=i.getContext("2d"),t=i.width,n=i.height;e.fillStyle="#1c1d20",e.fillRect(0,0,t,n),e.globalCompositeOperation="destination-out",e.beginPath();let s=n*.12,r=n*.88;e.moveTo(t*.2,s),e.lineTo(t*.8,s),e.quadraticCurveTo(t*.88,s,t*.9,s+n*.18),e.lineTo(t*.95,r),e.lineTo(t*.05,r),e.lineTo(t*.1,s+n*.18),e.quadraticCurveTo(t*.12,s,t*.2,s),e.closePath(),e.fill(),e.globalCompositeOperation="source-over",e.fillStyle="#2a2b2f";for(let a of[.24,.5,.76]){let l=t*(a===.5?.085:.11);Q_(e,t*a-l/2,n*.7,l,n*.4,26),e.fill()}e.fillStyle="#141517",e.fillRect(0,n*.9,t,n*.1);let o=new Pt(i);return o.colorSpace=ht,o.anisotropy=4,o}function Q_(i,e,t,n,s,r){i.beginPath(),i.moveTo(e+r,t),i.lineTo(e+n-r,t),i.quadraticCurveTo(e+n,t,e+n,t+r),i.lineTo(e+n,t+s-r),i.quadraticCurveTo(e+n,t+s,e+n-r,t+s),i.lineTo(e+r,t+s),i.quadraticCurveTo(e,t+s,e,t+s-r),i.lineTo(e,t+r),i.quadraticCurveTo(e,t,e+r,t),i.closePath()}var Il=class{constructor(){this.scene=new vi,this.root=new we,this.root.name="Cockpit",this.scene.add(this.root),this.hemi=new kr(13163775,4208428,1.25),this.scene.add(this.hemi),this.sun=new Ur(16773340,2),this.scene.add(this.sun),this.scene.add(this.sun.target),this.fill=new tl(16774376,.25,2.5,1.2),this.fill.position.set(-.2,1.25,.1),this.root.add(this.fill);let e={dashTop:new pt({color:1908257,roughness:.86}),dash:new pt({color:1579292,roughness:.62}),vent:new pt({color:328966,roughness:.9}),wood:new pt({map:xp(),roughness:.42,color:14271664}),pillar:new pt({color:2500394,roughness:.95}),door:new pt({color:1776671,roughness:.68}),chrome:new pt({color:12172738,metalness:1,roughness:.22}),rim:new pt({color:1250069,roughness:.52}),spoke:new pt({color:2829360,metalness:.55,roughness:.32}),black:new pt({color:723724,roughness:.3,metalness:.2}),skin:jp(14263415),sleeve:jp(1447448),wiper:new pt({color:1315860,roughness:.6,metalness:.4})};this.M=e,this.buildDash(e),this.buildPillars(e),this.buildDoor(e),this.buildWheel(e),this.buildScreen(e),this.buildMirrors(e),this.buildWipers(e),this.buildExtras(e),this.nomi=new Rl,this.nomi.group.position.set(-.27,.911,-.53),this.nomi.group.scale.setScalar(1.1),this.root.add(this.nomi.group),this.steer=0,this.wheelAngle=0,this.elsaWobble=0,this.elsaVel=0,this.headOffset=new C,this.shake=0}buildDash(e){let t=new yn,n=[[-.92,.882],[-.86,.9],[-.5,.913],[-.455,.905],[-.42,.875],[-.405,.85],[-.405,.8],[-.43,.793],[-.43,.776],[-.395,.77],[-.335,.62],[-.35,.42],[-.92,.42]];t.moveTo(n[0][0],n[0][1]);for(let h=1;h<n.length;h++)t.lineTo(n[h][0],n[h][1]);t.closePath();let s=1.6,r=new Yn(t,{depth:s,bevelEnabled:!1,curveSegments:4});r.rotateY(-Math.PI/2),r.translate(s/2,0,0);let o=new D(r,e.dashTop);this.root.add(o);let a=new Fe(1.5,.05,.012),l=new D(a,e.wood);l.position.set(.02,.826,-.399),this.root.add(l);let c=new D(new Fe(1.52,.014,.02),e.vent);c.position.set(.02,.785,-.425),this.root.add(c);for(let h of[-.62,.62]){let u=new D(new Fe(.18,.004,.08),e.vent);u.position.set(h,.912,-.78),this.root.add(u)}}buildPillars(e){let t=xs;for(let r of[-1,1]){let o=new C(r*.765,t.base.y-.07,t.base.z-.03),a=new C(r*.64,t.top.y+.015,t.top.z+0);this.root.add(Pl(o,a,.085,.06,e.pillar));let l=new C(r*.68,t.top.y+.035,.8);this.root.add(Pl(a,l,.08,.07,e.pillar))}let n=new D(new vs(1.34,.06,.12,3,.025),e.pillar);n.position.set(0,t.top.y+.02,t.top.z+.03),this.root.add(n),this.root.add(Pl(new C(-.79,.99,.34),new C(-.665,1.405,.3),.09,.07,e.pillar));let s=new D(new Fe(1.5,.11,.012),e.vent);s.quaternion.setFromRotationMatrix(new Je().makeBasis(t.X,t.U,t.N)),s.position.copy(t.base).addScaledVector(t.U,-.01).addScaledVector(t.N,.007),this.root.add(s)}buildDoor(e){let t=new we,n=new D(new Fe(.07,.56,1.35),e.door);n.position.set(-.8,.7,-.08),t.add(n);let s=new D(new vs(.075,.06,1.3,3,.025),e.dash);s.position.set(-.775,.975,-.06),t.add(s);let r=new D(new Fe(.1,.05,.4),e.dashTop);r.position.set(-.73,.76,.15),t.add(r);let o=new D(new Fe(.012,.04,.8),e.wood);o.position.set(-.762,.9,-.1),t.add(o);let a=new D(new Fe(.012,.018,.04),e.black);a.position.set(-.76,.86,-.32),t.add(a),this.root.add(t)}buildWheel(e){let t=new we;t.position.set(-.37,.865,-.2),t.rotation.x=-.5,this.root.add(t);let n=new we;t.add(n),this.wheel=n;let s=.17,r=new Un(s,.023,14,56);r.scale(1,.94,1.15),n.add(new D(r,e.rim));for(let f of[-1,1]){let m=new D(new Fe(.12,.034,.02),e.spoke);m.position.set(f*.115,-.01,-.005),n.add(m);let v=new D(new Xe(.012,.012,.01,16),e.black);v.rotation.x=Math.PI/2,v.position.set(f*.11,-.01,.009),n.add(v)}let o=new D(new Fe(.035,.11,.02),e.spoke);o.position.set(0,-.1,-.005),n.add(o);let a=new Xe(.065,.07,.04,28);a.rotateX(Math.PI/2),a.scale(1.25,.85,1);let l=new D(a,e.rim);l.position.set(0,-.008,-.01),n.add(l);let c=new D(new $e(.075,.075),new pt({map:zr({w:256,h:256}),transparent:!0,roughness:.4,alphaTest:.2}));c.position.set(0,-.004,.011),n.add(c);let h=new D(new Xe(.035,.045,.24,14),e.dash);h.rotation.x=Math.PI/2,h.position.set(0,-.01,-.13),t.add(h);for(let f of[-1,1]){let m=new D(new Xe(.007,.006,.14,8),e.black);m.rotation.z=f*(Math.PI/2-.25),m.position.set(f*.09,0,-.08),t.add(m)}this.hands=[];for(let f of[-1,1]){let m=f*1.32,v=new we;v.position.set(Math.sin(m)*s,Math.cos(m)*s,.012),v.rotation.z=-m;let g=new D(new bt(.048,18,14),e.skin);g.scale.set(1.05,.85,.85),g.position.set(0,.005,.014);let p=new D(new bt(.019,12,10),e.skin);p.position.set(-f*.03,-.012,.035);let y=new D(new bt(.04,14,10),e.skin);y.scale.set(1,.7,.6),y.position.set(0,.01,-.025),v.add(g,p,y),n.add(v),this.hands.push(v)}this.arms=[];let u=new Hs(.036,1,6,14),d=new Xe(.052,.058,1,16,1,!0);for(let f of[-1,1]){let m=new D(u,e.sleeve),v=new D(d,e.sleeve);this.root.add(m,v),this.arms.push({arm:m,sleeve:v,shoulder:new C(-.37+f*.25,.84,.3)})}}buildScreen(e){this.screen=new Cl;let t=new we;t.position.set(0,1.03,-.465),t.rotation.x=-.16;let n=new D(new Fe(.352,.226,.018),e.black);n.position.z=-.01;let s=new D(new $e(.336,.21),new ln({map:this.screen.texture,toneMapped:!1}));s.position.z=5e-4;let r=new D(new Fe(.06,.08,.03),e.dash);r.position.set(0,-.13,-.03),t.add(n,s,r),this.root.add(t),this.displayMat=s.material}buildMirrors(e){let s=new yn,r=.03;s.moveTo(-.245/2+r,-.072/2),s.lineTo(.245/2-r,-.072/2),s.quadraticCurveTo(.245/2,-.072/2,.245/2,-.072/2+r),s.lineTo(.245/2,.072/2-r),s.quadraticCurveTo(.245/2,.072/2,.245/2-r,.072/2),s.lineTo(-.245/2+r,.072/2),s.quadraticCurveTo(-.245/2,.072/2,-.245/2,.072/2-r),s.lineTo(-.245/2,-.072/2+r),s.quadraticCurveTo(-.245/2,-.072/2,-.245/2+r,-.072/2);let o=new ls(s,6),a=o.attributes.uv,l=o.attributes.position;for(let ve=0;ve<a.count;ve++)a.setXY(ve,1-(l.getX(ve)/.245+.5),l.getY(ve)/.072+.5);this.mirrorMat=new ln({color:16777215});let c=new we;c.position.set(-.08,1.235,-.225),c.rotation.set(-.06,-.18,0);let h=new D(o,this.mirrorMat);h.position.z=.021;let u=new Yn(s,{depth:.022,bevelEnabled:!0,bevelSize:.006,bevelThickness:.006,bevelSegments:2});u.translate(0,0,-.012);let d=new D(u,e.black),f=o.clone(),m=f.attributes.uv;for(let ve=0;ve<m.count;ve++)m.setXY(ve,l.getX(ve)/.245+.5,l.getY(ve)/.072+.5);this.mirrorFrame=new D(f,new ln({map:j_(),transparent:!0,depthWrite:!1})),this.mirrorFrame.position.z=.0215,c.add(d,h,this.mirrorFrame),this.root.add(c);let v=xs,g=new Je().makeBasis(v.X,v.U,v.N.clone().negate()).setPosition(v.base),p=new yn,y=-.07,_=.048,x=.088,I=.85,T=.95;p.moveTo(y-_+.025,I),p.lineTo(y+_-.025,I),p.quadraticCurveTo(y+_,I,y+_+.003,I+.025),p.lineTo(y+x,T),p.lineTo(y-x,T),p.lineTo(y-_-.003,I+.025),p.quadraticCurveTo(y-_,I,y-_+.025,I);let S=new Yn(p,{depth:.014,bevelEnabled:!0,bevelSize:.006,bevelThickness:.006,bevelSegments:2,curveSegments:6});S.translate(0,0,.007),S.applyMatrix4(g);let R=new D(S,e.dash),M=(ve,ce,be)=>new C(ve,ce,be).applyMatrix4(g),b=M(-.08,.862,.024),P=new C(-.08,1.258,-.243),k=P.clone().sub(b),U=new Xe(.008,.011,k.length(),10);U.translate(0,k.length()/2,0);let H=new D(U,e.black);H.position.copy(b),H.quaternion.setFromUnitVectors(new C(0,1,0),k.normalize());let G=new D(new bt(.013,12,8),e.black);G.position.copy(P),this.root.add(R,H,G),this.mirrorHousing={toGlass:g,onGlass:M};let N=new we;N.position.set(-1,1.045,-.6),N.rotation.y=.62;let $=new oi({color:329223,metalness:.5,roughness:.3,clearcoat:1}),z=new D(vl(-1),$),ne=new ls(ko(.9,-1),12);ne.computeBoundingBox();let le=ne.boundingBox,me=ne.attributes.uv,Ie=ne.attributes.position;for(let ve=0;ve<me.count;ve++){let ce=(Ie.getX(ve)-le.min.x)/(le.max.x-le.min.x),be=(Ie.getY(ve)-le.min.y)/(le.max.y-le.min.y);me.setXY(ve,1-ce*.34,.03+be*.6)}this.sideMirrorMat=new ln({color:16777215});let Ke=new D(ne,this.sideMirrorMat);Ke.position.z=.002,N.add(z,Ke),N.updateMatrix();let Z=new C(.095,-.028,-.05).applyMatrix4(N.matrix),fe=Pl(new C(-.79,.99,-.66),Z,.05,.035,$);this.root.add(N,fe)}setMirrorTexture(e){this.mirrorMat.map=e,this.mirrorMat.needsUpdate=!0,this.sideMirrorMat.map=e,this.sideMirrorMat.needsUpdate=!0,this.mirrorFrame.visible=!0}setTrunkView(e){this.mirrorMat.map=e,this.mirrorMat.needsUpdate=!0,this.mirrorFrame.visible=!1}buildWipers(e){let t=xs,n=new Je().makeBasis(t.X,t.U,t.N.clone().negate()),s=new $t().setFromRotationMatrix(n);this.wiperObjs=Kr.map(r=>{let o=new we;o.position.copy(r.pivot).addScaledVector(t.N,.02),o.quaternion.copy(s);let a=new we;o.add(a);let l=new D(new Fe(r.length,.016,.012),e.wiper);l.position.set(r.length/2,0,-.012);let c=new D(new Fe(r.length*.92,.022,.008),e.wiper);return c.position.set(r.length*.52,.01,-.001),a.add(l,c),this.root.add(o),a})}buildExtras(e){let t=new we;t.position.copy(this.mirrorHousing.onGlass(-.098,.9,.049));let n=new D(new vs(.06,.044,.036,2,.006),e.black),s=new D(new Xe(.013,.013,.012,16),new pt({color:1714746,metalness:.9,roughness:.1}));s.rotation.x=Math.PI/2,s.position.z=-.022,this.recLed=new D(new bt(.0055,10,8),new ln({color:16719904,toneMapped:!1})),this.recLed.position.set(.019,-.008,.0175);let r=new D(new Fe(.03,.02,.03),e.black);r.position.set(0,.026,-.004),t.add(n,s,this.recLed,r),this.root.add(t),this.elsa=xl({curved:!1}),this.elsa.scale.setScalar(.11),this.elsaSpring=new we,this.elsaSpring.position.set(-.6,.913,-.68),this.elsaSpring.rotation.y=.5;let o=new D(new Xe(.018,.022,.012,16),e.black);this.elsaSpring.add(o,this.elsa),this.elsa.position.y=.008,this.elsaSpring.visible=!1,this.root.add(this.elsaSpring);let a=new $e(.012,.008);this.confetti=new ri(a,new pt({side:ft,roughness:.6}),400),this.confetti.count=0,this.confetti.frustumCulled=!1,this.root.add(this.confetti)}addConfetti(e=40){let t=xs,n=new Je().makeBasis(t.X,t.U,t.N.clone().negate()),s=new $t().setFromRotationMatrix(n),r=new Je,o=new $t,a=new $t,l=[16726891,16765503,3919532,5934574,16747586,11828479,16777215],c=new ke;for(let h=0;h<e&&this.confetti.count<400;h++){let u=Math.random()*t.length*.9+.03,d=t.halfBase+(t.halfTop-t.halfBase)*(u/t.length)-.05,f=(Math.random()*2-1)*d,m=t.base.clone().addScaledVector(t.U,u);m.x=f,m.addScaledVector(t.N,-.006),a.setFromAxisAngle(new C(0,0,1),Math.random()*Math.PI),o.copy(s).multiply(a),r.compose(m,o,new C(1,1,1).multiplyScalar(.7+Math.random()*.8));let v=this.confetti.count++;this.confetti.setMatrixAt(v,r),this.confetti.setColorAt(v,c.setHex(l[v%l.length]))}this.confetti.instanceMatrix.needsUpdate=!0,this.confetti.instanceColor&&(this.confetti.instanceColor.needsUpdate=!0)}clearConfetti(){this.confetti.count=0}setElsa(e){this.elsaSpring.visible=!!e}placeCamera(e,t,n,s,r,o){let a=Math.min(1,s/60)*.0025+this.shake*.03;this.headOffset.x=Nn(this.headOffset.x,Ze(-r*.006,-.05,.05),4,o);let l=this.headOffset.x+(Math.sin(n*37)*.5+Math.sin(n*23)*.5)*a,c=(Math.sin(n*29)+Math.sin(n*13.3))*.5*a+Math.sin(n*1.4)*.003,h=$_.clone().add(new C(l,c,0));h.applyMatrix4(t),e.position.copy(h);let u=new $t().setFromRotationMatrix(t),d=new fn(J_+c*2,this.headOffset.x*.6+Math.sin(n*.31)*.004,-r*.0025+l*2,"YXZ");e.quaternion.copy(u).multiply(new $t().setFromEuler(d))}update(e){let{dt:t,t:n}=e;this.wheelAngle=Nn(this.wheelAngle,e.steer*1.25,10,t),this.wheel.rotation.z=-this.wheelAngle,this.root.updateMatrixWorld(!0);let s=new Je().copy(this.root.matrixWorld).invert(),r=new C,o=new C;if(this.arms.forEach((l,c)=>{this.hands[c].getWorldPosition(r),r.applyMatrix4(s),o.subVectors(r,l.shoulder);let h=o.length();o.normalize();let u=new $t().setFromUnitVectors(new C(0,1,0),o);l.arm.position.copy(l.shoulder).addScaledVector(o,h/2-.01),l.arm.quaternion.copy(u),l.arm.scale.set(1,(h-.04)/1.086,1),l.sleeve.position.copy(l.shoulder).addScaledVector(o,.08),l.sleeve.quaternion.copy(u),l.sleeve.scale.set(1,.22,1)}),e.wiperAngles&&(this.wiperObjs[0].rotation.z=e.wiperAngles[0],this.wiperObjs[1].rotation.z=e.wiperAngles[1]),this.elsaSpring.visible){let h=-60*this.elsaWobble-3.5*this.elsaVel-(e.latAcc||0)*.9;this.elsaVel+=h*t,this.elsaWobble+=this.elsaVel*t,this.elsaWobble=Ze(this.elsaWobble,-.6,.6),this.elsa.rotation.z=this.elsaWobble,yl(this.elsa,n,this.elsaWobble)}this.recLed.visible=Math.sin(n*3.5)>-.3;let a=e.overcast||0;e.sunDir&&(this.sun.position.copy(this.root.position).addScaledVector(e.sunDir,10),this.sun.target.position.copy(this.root.position)),this.sun.intensity=2.1*(1-a*.85),this.hemi.intensity=1.2-a*.25,this.nomi.update(t,n,-.16),this.screen.update(t,e.screen)}};var qs=640,ys=360,Ys=160,Zs=90,Ll=class{constructor(){this.canvas=document.createElement("canvas"),this.canvas.width=qs,this.canvas.height=ys,this.ctx=this.canvas.getContext("2d"),this.texture=new Pt(this.canvas),this.texture.generateMipmaps=!1,this.texture.minFilter=zn,this.film=document.createElement("canvas"),this.film.width=Ys,this.film.height=Zs,this.fctx=this.film.getContext("2d"),this.fctx.fillStyle="#000",this.fctx.fillRect(0,0,Ys,Zs),this.filmTex=new Pt(this.film),this.filmTex.generateMipmaps=!1,this.filmTex.minFilter=zn,this.sprite=wp(),this.drops=[],this.intensity=0,this.firmware=0,this.enabled=!0,this.wiper={angle:0,mode:"park",t:0,dur:0,amp:0,queue:0,pause:0,prevAngle:0},this.autoTimer=2.5,this.onEvent=null,this.tmp=new C,this.camPos=new C,this.twitches=0,this.wipes=0,this.dirty=!0,this.filmAcc=0,this.dryFor=0}setRain(e){this.intensity=Ze(e,0,1)}setFirmware(e){this.firmware=e}get angles(){let e=this.wiper.angle;return[e*(Kr[0].max/2.15),e*(Kr[1].max/2.15)]}manual(){if(this.wiper.mode!=="park")return null;let e=[.18,.42,.62,.82][this.firmware]??.18;return mt(e)?(this.startSweep(),"wipe"):(this.startTwitch(1+Math.floor(Math.random()*2)),"twitch")}startTwitch(e=1){this.wiper.mode="twitch",this.wiper.t=0,this.wiper.dur=Me(.18,.3),this.wiper.amp=Me(.28,.66),this.wiper.queue=e-1,this.twitches++,this.onEvent&&this.onEvent("twitch")}startSweep(){this.wiper.mode="sweep",this.wiper.t=0,this.wiper.dur=1,this.wiper.amp=2.15,this.wipes++,this.onEvent&&this.onEvent("wipe")}update(e,{speed:t,camera:n,carMatrix:s}){let r=this.wiper;r.prevAngle=r.angle;let o=r.mode==="sweep";if(n.updateMatrixWorld(),this.intensity>.05&&r.mode==="park"&&(this.autoTimer-=e,this.autoTimer<=0)){this.autoTimer=Me(1.4,3.8)/(.6+this.intensity*.6);let u=[0,.18,.36,.55][this.firmware]??0;mt(u)?this.startSweep():this.startTwitch(1+Math.floor(Math.random()*3))}if(r.mode==="twitch"){r.t+=e;let u=r.t/r.dur;r.angle=u<1?r.amp*Math.sin(Math.PI*u)*(1-.3*u):0,u>=1&&(r.angle=0,r.queue>0?(r.queue--,r.mode="pause",r.pause=Me(.08,.25)):r.mode="park")}else if(r.mode==="pause")r.pause-=e,r.pause<=0&&(r.mode="twitch",r.t=0,r.dur=Me(.15,.28),r.amp=Me(.2,.55),this.twitches++,this.onEvent&&this.onEvent("twitch"));else if(r.mode==="sweep"){r.t+=e;let u=r.t/r.dur;r.angle=u<1?r.amp*Math.sin(Math.PI*Math.min(1,u))**.8:0,u>=1&&(r.angle=0,r.mode="park")}let a=xs;if(this.intensity>0){let d=this.intensity*(22+t*1.3)*e;for(;d>0;){if(Math.random()<d){let f=Math.random()*a.length,m=et(a.halfBase,a.halfTop,f/a.length),v=Math.random()<.08;this.drops.push({x:(Math.random()*2-1)*m,u:f,r:v?Me(.006,.011):Me(.0022,.0058),life:0})}d-=1}}let l=Math.max(0,t-14)*.0055;for(let u of this.drops){u.life+=e;let d=Ze((u.r-.003)/.006,0,1);u.u+=(l*d-(1-Math.min(1,t/14))*.02*d)*e,u.x+=Math.sin(u.life*3+u.r*1e3)*.002*d*e*(t/30)}this.drops=this.drops.filter(u=>u.u>-.02&&u.u<a.length+.02&&!(this.intensity<.01&&u.life>6));let c=Math.min(r.prevAngle,r.angle),h=Math.max(r.prevAngle,r.angle);if(h>.01&&h-c>1e-4){let u=!(o||r.mode==="sweep");for(let d=0;d<Kr.length;d++){let f=Kr[d],m=f.max/2.15,v=c*m-.04,g=h*m+.04,p=f.pivot.x,y=this.pivotU(f.pivot);this.drops=this.drops.filter(_=>{let x=_.x-p,I=_.u-y,T=Math.hypot(x,I);if(T<.06||T>f.length+.015)return!0;let S=Math.atan2(I,x);return!(S>=v&&S<=g)}),this.paintFilm(n,s,f,c*m,h*m,u)}}if(this.drops.length>520&&this.drops.splice(0,this.drops.length-520),this.filmAcc+=e,this.dryFor+=e,this.filmAcc>=.2){let u=this.filmAcc;this.filmAcc=0,this.fctx.globalCompositeOperation="source-over",this.intensity<=0&&this.dryFor>12?this.fctx.fillStyle="#000":this.fctx.fillStyle=`rgba(0,0,0,${1-Math.exp(-.35*u)})`,this.fctx.fillRect(0,0,Ys,Zs),this.intensity>0&&(this.fctx.fillStyle=`rgba(255,255,255,${u*.05*this.intensity})`,this.fctx.fillRect(0,0,Ys,Zs)),this.filmTex.needsUpdate=!0}this.draw(n,s)}pivotU(e){let t=xs;return this.tmp.copy(e).sub(t.base).dot(t.U)}glassToScreen(e,t,n,s,r){let o=xs;this.tmp.copy(o.base).addScaledVector(o.U,t),this.tmp.x=e,this.tmp.applyMatrix4(s);let a=this.tmp.distanceTo(n.position);return this.tmp.project(n),r.x=(this.tmp.x*.5+.5)*qs,r.y=(.5-this.tmp.y*.5)*ys,r.z=this.tmp.z,r.d=a,r}paintFilm(e,t,n,s,r,o){let a=this.pivotU(n.pivot),l=[],c={x:0,y:0},h=6;for(let d=0;d<=h;d++){let f=s+(r-s)*d/h;this.glassToScreen(n.pivot.x+Math.cos(f)*n.length,a+Math.sin(f)*n.length,e,t,c),l.push([c.x*(Ys/qs),c.y*(Zs/ys)])}this.glassToScreen(n.pivot.x,a,e,t,c);let u=this.fctx;u.beginPath(),u.moveTo(c.x*(Ys/qs),c.y*(Zs/ys));for(let d of l)u.lineTo(d[0],d[1]);u.closePath(),o?(this.dryFor=0,u.globalCompositeOperation="lighter",u.fillStyle=`rgba(255,255,255,${.06+this.intensity*.12})`,u.fill()):(u.globalCompositeOperation="destination-out",u.fillStyle="rgba(0,0,0,0.85)",u.fill(),u.globalCompositeOperation="source-over",u.fillStyle="#000",u.fill()),u.globalCompositeOperation="source-over"}draw(e,t){let n=this.ctx;if(n.clearRect(0,0,qs,ys),!this.enabled||this.drops.length===0){this.texture.needsUpdate=!0;return}let s=ys/2/Math.tan(Br.degToRad(e.fov)/2),r=qs/ys/e.aspect,o={x:0,y:0,z:0,d:1};for(let a of this.drops){if(this.glassToScreen(a.x,a.u,e,t,o),o.z>1)continue;let l=Math.max(1.2,a.r/o.d*s*2.3),c=1+Math.min(2.2,a.life<.4?0:a.r>.004?.35:0);n.drawImage(this.sprite,o.x-l*r,o.y-l*c,l*2*r,l*2*c)}this.texture.needsUpdate=!0}clear(){this.drops=[],this.fctx.fillStyle="#000",this.fctx.fillRect(0,0,Ys,Zs),this.filmTex.needsUpdate=!0,this.ctx.clearRect(0,0,qs,ys),this.texture.needsUpdate=!0}};function Qp(i,e){return new Xt({uniforms:{tScene:{value:i},tDrops:{value:e.texture},tFilm:{value:e.filmTex},uDrops:{value:1},uRain:{value:0},uTexel:{value:new ue(1/1280,1/720)},uFlash:{value:0},uFlashColor:{value:new ke(1,1,1)},uFade:{value:0},uGreen:{value:0},uGlitch:{value:0},uTime:{value:0},uVignette:{value:.35},uSat:{value:1.08},uPost:{value:1}},vertexShader:`
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
      uniform float uPost;
      varying vec2 vUv;
      void main() {
        vec2 uv = vUv;
        if (uGlitch > 0.0 && uPost > 0.5) {
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
        if (uPost > 0.5) {
          col = mix(col, uFlashColor * 4.0, clamp(uFlash, 0.0, 1.0));
          vec2 vc = vUv - 0.5;
          col *= 1.0 - dot(vc, vc) * uVignette;
        }
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        if (uPost > 0.5) {
          float g = dot(gl_FragColor.rgb, vec3(0.3, 0.6, 0.1));
          gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.08, 1.0, 0.25) * (0.3 + g), uGreen * 0.65);
          gl_FragColor.rgb *= 1.0 - uFade;
        }
      }`,depthTest:!1,depthWrite:!1})}var Dl=class{constructor(e,t=2600){let n=new Float32Array(t*2*3),s=new Float32Array(t*2);for(let f=0;f<t;f++){let m=Math.random()*60-30,v=Math.random()*24,g=Math.random()*70-55;for(let p=0;p<2;p++)n[(f*2+p)*3]=m,n[(f*2+p)*3+1]=v,n[(f*2+p)*3+2]=g,s[f*2+p]=p}let r=new xt;r.setAttribute("position",new Ht(n,3)),r.setAttribute("aEnd",new Ht(s,1)),this.uniforms={uTime:{value:0},uSpeed:{value:0},uS:{value:0},uCam:{value:new C},uOpacity:{value:0}};let o=new Xt({uniforms:this.uniforms,vertexShader:`
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
        void main() { gl_FragColor = vec4(vec3(0.75, 0.8, 0.88), uOpacity * vA * 0.5); }`,transparent:!0,depthWrite:!1});this.lines=new Xa(r,o),this.lines.frustumCulled=!1,this.lines.visible=!1,e.add(this.lines),this.maxSpray=700;let a=new Float32Array(this.maxSpray*3),l=new Float32Array(this.maxSpray),c=new Float32Array(this.maxSpray),h=new xt;h.setAttribute("position",new Ht(a,3)),h.setAttribute("aAlpha",new Ht(l,1)),h.setAttribute("aSize",new Ht(c,1)),this.sprayData=[],this.sprayGeo=h;let u=new Xt({uniforms:{tDot:{value:ul()},uCurve:Oi.uCurve,uH:{value:720}},vertexShader:ol+`
        attribute float aAlpha;
        attribute float aSize;
        uniform float uH;
        varying float vA;
        varying float vCut;
        void main() {
          vec4 w = curveWorld(modelMatrix * vec4(position, 1.0));
          vec4 mv = viewMatrix * w;
          gl_Position = projectionMatrix * mv;
          // Gr\xF6\xDFe in Metern: gleich gro\xDF bei jeder Bildh\xF6he und jedem Blickwinkel (auch im R\xFCckspiegel)
          float px = aSize * 0.52 * uH * projectionMatrix[1][1] / max(1.0, -mv.z);
          gl_PointSize = px;
          // Die Fahrbahn schneidet den Punkt unten gerade ab: dort vorher weich ausblenden
          vec4 g = projectionMatrix * viewMatrix * curveWorld(modelMatrix * vec4(position.x, 0.0, position.z, 1.0));
          float below = (gl_Position.y / gl_Position.w - g.y / g.w) * 0.5 * uH;
          vCut = 0.5 + below / max(px, 1.0);
          vA = aAlpha;
        }`,fragmentShader:`
        uniform sampler2D tDot;
        varying float vA;
        varying float vCut;
        void main() {
          float a = texture2D(tDot, gl_PointCoord).a;
          a *= 1.0 - smoothstep(vCut - 0.22, vCut, gl_PointCoord.y);
          gl_FragColor = vec4(vec3(0.82, 0.85, 0.9), a * vA);
        }`,transparent:!0,depthWrite:!1});this.spray=new qa(h,u),this.spray.frustumCulled=!1;let d=new ue;this.spray.onBeforeRender=(f,m,v,g,p)=>{let y=f.getRenderTarget();p.uniforms.uH.value=y?y.height:f.getDrawingBufferSize(d).y},e.add(this.spray),this.intensity=0}setPixelScale(e){this.spray.material.uniforms.uH.value=e}emit(e,t,n,s,r=1){if(this.intensity<.15)return;let o=Math.round(r*this.intensity*2);for(let a=0;a<o&&this.sprayData.length<this.maxSpray;a++)this.sprayData.push({x:e+(Math.random()-.5)*n,y:.25+Math.random()*.3,z:t,vx:(Math.random()-.5)*1.2,vy:.6+Math.random()*1.4,vz:s*.9,life:0,max:.8+Math.random()*.8,size:1.2+Math.random()*1.6})}update(e,t,{speed:n,s,camX:r,intensity:o}){this.intensity=o;let a=this.uniforms;a.uTime.value=t,a.uSpeed.value=n,a.uS.value=s%70,a.uCam.value.x=r,a.uOpacity.value=o,this.lines.visible=o>.02;let l=this.sprayGeo.attributes.position.array,c=this.sprayGeo.attributes.aAlpha.array,h=this.sprayGeo.attributes.aSize.array,u=0,d=[];for(let f of this.sprayData)f.life+=e,!(f.life>f.max)&&(f.x+=f.vx*e,f.y+=f.vy*e,f.vy-=.8*e,f.z+=(n-f.vz*Math.exp(-f.life*2))*e,f.size+=e*2.2,d.push(f),l[u*3]=f.x,l[u*3+1]=f.y,l[u*3+2]=f.z,c[u]=.32*(1-f.life/f.max)*this.intensity,h[u]=f.size,u++);this.sprayData=d,this.sprayGeo.setDrawRange(0,u),this.sprayGeo.attributes.position.needsUpdate=!0,this.sprayGeo.attributes.aAlpha.needsUpdate=!0,this.sprayGeo.attributes.aSize.needsUpdate=!0,this.spray.visible=u>0}};var kl=class{constructor(){this.ctx=null,this.enabled=!0,this.volume=.8,this.ready=!1,this.duck=1}suspend(){this.ctx&&this.ctx.state==="running"&&this.ctx.suspend().catch(()=>{})}resume(){this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}let e=window.AudioContext||window.webkitAudioContext;if(!e)return;let t=new e;this.ctx=t,this.master=t.createGain(),this.master.gain.value=this.enabled?this.volume:0;let n=t.createDynamicsCompressor();n.threshold.value=-14,n.ratio.value=4,this.master.connect(n).connect(t.destination),this.sfx=t.createGain(),this.sfx.connect(this.master),this.amb=t.createGain(),this.amb.connect(this.master);let s=t.sampleRate*2,r=t.createBuffer(1,s,t.sampleRate),o=r.getChannelData(0);for(let m=0;m<s;m++)o[m]=Math.random()*2-1;this.noiseBuf=r;let a=()=>{let m=t.createBufferSource();return m.buffer=r,m.loop=!0,m.start(),m};this.motor=t.createGain(),this.motor.gain.value=0;let l=t.createBiquadFilter();l.type="bandpass",l.Q.value=2,this.motorFilter=l,this.oscA=t.createOscillator(),this.oscA.type="sawtooth",this.oscB=t.createOscillator(),this.oscB.type="sine",this.oscA.connect(l),this.oscB.connect(l),l.connect(this.motor).connect(this.amb),this.oscA.start(),this.oscB.start(),this.whine=t.createOscillator(),this.whine.type="sine",this.whineGain=t.createGain(),this.whineGain.gain.value=0,this.whine.connect(this.whineGain).connect(this.amb),this.whine.start();let c=a();this.roadFilter=t.createBiquadFilter(),this.roadFilter.type="lowpass",this.roadGain=t.createGain(),this.roadGain.gain.value=0,c.connect(this.roadFilter).connect(this.roadGain).connect(this.amb);let h=a();this.windFilter=t.createBiquadFilter(),this.windFilter.type="bandpass",this.windFilter.frequency.value=700,this.windFilter.Q.value=.6,this.windGain=t.createGain(),this.windGain.gain.value=0,h.connect(this.windFilter).connect(this.windGain).connect(this.amb);let u=a(),d=t.createBiquadFilter();d.type="highpass",d.frequency.value=1800,this.rainGain=t.createGain(),this.rainGain.gain.value=0,u.connect(d).connect(this.rainGain).connect(this.amb),this.siren=t.createOscillator(),this.siren.type="triangle",this.sirenGain=t.createGain(),this.sirenGain.gain.value=0;let f=t.createBiquadFilter();f.type="lowpass",f.frequency.value=2200,this.siren.connect(f).connect(this.sirenGain).connect(this.sfx),this.siren.start(),this.ready=!0,this.rainTick=0}setEnabled(e){this.enabled=e,this.master&&this.master.gain.setTargetAtTime(e?this.volume:0,this.ctx.currentTime,.05)}update(e,{speed:t,throttle:n,rain:s,sirenLevel:r,inCabin:o=!0,paused:a=!1}){if(!this.ready)return;let l=this.ctx.currentTime,c=a?0:t,h=o?1:.7,u=this.duck;this.oscA.frequency.setTargetAtTime(60+c*7.5,l,.05),this.oscB.frequency.setTargetAtTime(120+c*15,l,.05),this.motorFilter.frequency.setTargetAtTime(300+c*30,l,.05),this.motor.gain.setTargetAtTime(a?0:(.012+n*.03+c*4e-4)*h*u,l,.08),this.whine.frequency.setTargetAtTime(500+c*48,l,.05),this.whineGain.gain.setTargetAtTime(a?0:(.0025+n*.006)*Math.min(1,c/8)*u,l,.08),this.roadFilter.frequency.setTargetAtTime(200+c*22,l,.1),this.roadGain.gain.setTargetAtTime(a?0:Ze(c/60,0,1)*.11*h*u,l,.1),this.windGain.gain.setTargetAtTime(a?0:Ze((c/65)**2,0,1)*.08*u,l,.1),this.windFilter.frequency.setTargetAtTime(500+c*14,l,.1),this.rainGain.gain.setTargetAtTime(a?0:s*.05*(.7+c/120),l,.3),!a&&s>.1&&(this.rainTick-=e,this.rainTick<=0&&(this.rainTick=.02+Math.random()*.12/s,this.tick(2e3+Math.random()*3e3,.012*s)));let d=l%1.4<.7;this.siren.frequency.setTargetAtTime(d?440:587,l,.01),this.sirenGain.gain.setTargetAtTime(a?0:r*.05,l,.1)}env(e,t,n,s,r){e.gain.setValueAtTime(1e-4,t),e.gain.exponentialRampToValueAtTime(s,t+n),e.gain.exponentialRampToValueAtTime(1e-4,t+n+r)}tone(e,t=.2,n="sine",s=.15,r=0,o=null){if(!this.ready)return;let a=this.ctx,l=a.currentTime+r,c=a.createOscillator();c.type=n,c.frequency.setValueAtTime(e,l),o&&c.frequency.exponentialRampToValueAtTime(o,l+t);let h=a.createGain();this.env(h,l,.008,s,t),c.connect(h).connect(this.sfx),c.start(l),c.stop(l+t+.05)}noiseBurst(e,t,{type:n="lowpass",freq:s=1e3,q:r=.7,when:o=0,slideTo:a=null}={}){if(!this.ready)return;let l=this.ctx,c=l.currentTime+o,h=l.createBufferSource();h.buffer=this.noiseBuf;let u=l.createBiquadFilter();u.type=n,u.frequency.setValueAtTime(s,c),a&&u.frequency.exponentialRampToValueAtTime(a,c+e),u.Q.value=r;let d=l.createGain();this.env(d,c,.01,t,e),h.connect(u).connect(d).connect(this.sfx),h.start(c,Math.random()),h.stop(c+e+.05)}tick(e,t){this.tone(e,.03,"sine",t)}nomiChime(){this.tone(1318.5,.35,"sine",.09),this.tone(987.8,.5,"sine",.08,.14),this.tone(2637,.2,"sine",.02,0)}naviAlert(){this.tone(880,.12,"sine",.1),this.tone(1174.7,.18,"sine",.1,.13)}pling(){this.tone(1567.98,.25,"triangle",.08),this.tone(2093,.4,"sine",.06,.06)}coin(){this.tone(987.8,.08,"square",.04),this.tone(1318.5,.3,"square",.04,.07)}chime(){[523.25,659.25,783.99,1046.5].forEach((e,t)=>this.tone(e,.25,"triangle",.07,t*.07))}bad(){this.tone(330,.25,"sawtooth",.05,0,180)}crash(){this.tone(70,.5,"sine",.5,0,30),this.noiseBurst(.45,.4,{freq:1800,slideTo:300}),this.noiseBurst(.25,.18,{type:"bandpass",freq:3500,q:3,when:.03})}scrape(){this.noiseBurst(.35,.12,{type:"bandpass",freq:2600,q:6})}whoosh(){this.noiseBurst(.5,.18,{type:"bandpass",freq:400,slideTo:2500,q:1.5})}wiperTwitch(){this.tone(75,.12,"sawtooth",.05),this.noiseBurst(.08,.03,{type:"bandpass",freq:900,q:4})}wiperSweep(){this.tone(70,.9,"sawtooth",.035),this.tone(1400,.35,"sine",.012,.2,1800)}horn(){this.tone(415,.45,"square",.06),this.tone(523,.45,"square",.05)}blinker(){this.tone(2400,.02,"square",.03)}flash(){this.noiseBurst(.05,.15,{type:"highpass",freq:3e3}),this.tone(3200,.6,"sine",.02,.05,6e3)}megafon(){this.tone(900,.4,"square",.04,0,1300)}click(){this.tone(1200,.04,"square",.02)}jingle(){[523.25,659.25,783.99,1046.5,987.77,1046.5].forEach((t,n)=>this.tone(t,.22,"triangle",.06,n*.12))}brunnenJingle(){[392,523.25,659.25,523.25,784].forEach((e,t)=>this.tone(e,.3,"sine",.07,t*.16)),this.noiseBurst(1.2,.03,{type:"highpass",freq:4e3,when:.1})}record(){[659.25,783.99,987.77,1318.5].forEach((e,t)=>this.tone(e,.35,"triangle",.08,t*.1))}confetti(){this.noiseBurst(.15,.3,{type:"lowpass",freq:600});for(let e=0;e<8;e++)this.tone(1500+Math.random()*2500,.05,"sine",.02,.1+e*.04)}};var t0="Mini Adam",n0="Tesla-Navi ferngesteuert",i0="Live-Eskalationen immer woanders!",$u=[{name:"Tesla Supercharger Erlensee",short:"Supercharger Erlensee",note:"Hier begann am 30.01.2021 das allererste Navi-Experiment.",km:[1.6,3.2]},{name:"Hochofenwerk Phoenix West, Dortmund",short:"Phoenix West",note:"Ziel des ersten Navi-Streams (429,16 km).",km:[2.2,4]},{name:"Burg Hauneck, Haunetal",note:"Das erste Ziel, das 2022 wirklich erreicht wurde.",km:[1.8,3.4]},{name:"Megahub Lehrte",note:"G\xFCterbahnhof. Der Chat war erleichtert.",km:[1.8,3.6]},{name:"Arnhem (Niederlande)",note:"Kurz mal Ausland.",km:[2.5,4.6]},{name:"Gifhorn, Supermarkt-Parkplatz",note:"Historisch bedeutsam. Polizei Gifhorn gr\xFC\xDFt.",km:[2,3.8],special:"gifhorn"},{name:"Liberec (Tschechien)",note:"Ziemlich weit. Wird bestimmt gleich \xFCberboten.",km:[6,8.5]},{name:"Wartburg, Eisenach",note:"Dort gibt es einen Automaten mit 0-Euro-Geldscheinen.",km:[1.8,3.5]},{name:"Drive-In: Pommes ohne R\xFCckfragen",note:"Die legend\xE4re Drive-In-Wette.",km:[1.4,2.6],special:"pommes"},{name:"Malte in Norderstedt abholen",short:"Malte abholen",note:"Die Bahn f\xE4llt mal wieder aus.",km:[2.6,4.8],special:"malte"},{name:"Burg Ronneburg",note:"Burgen gehen immer.",km:[1.6,3]},{name:"Rastplatz Sch\xE4ferborn Ost",short:"Sch\xE4ferborn Ost",note:"Endstation der dritten Navi-Runde.",km:[1.4,2.8]},{name:"Weser-Skywalk, Beverungen",note:"Aussicht mit Wackelfaktor.",km:[2,3.6]},{name:"Ionity-Ladestation Kirchheim",short:"Ionity Kirchheim",note:"Strom tanken mit Stil.",km:[1.5,3],special:"charger"},{name:"Tesla Supercharger Mogendorf",short:"Supercharger Mogendorf",note:"Hier endete die 723-km-Tour 2021.",km:[1.8,3.2],special:"charger"},{name:"K\xF6ln",note:"Wo genau? Egal, Hauptsache K\xF6ln.",km:[2.2,4]},{name:"Siegen",note:"Wurde schon oft gespendet. Setzt sich fast nie durch.",km:[2,3.5],special:"siegen",weight:.25},{name:"Bispingen",note:"Schnee im Sommer.",km:[2.4,4.2]},{name:"Sizilien (wegen Monte)",note:"Ein ganz normaler Ostersamstag.",km:[8,11]},{name:"Gardasee",note:"Die Oster-Tour l\xE4sst gr\xFC\xDFen.",km:[5,7]},{name:"Burg Staufen",note:"Silvester-Feeling.",km:[2.2,3.8]},{name:"Kassel \u2013 Elsa besuchen",note:"Spirit-Animal von SkylineTV LIVE.",km:[2,3.8],special:"elsa"},{name:"Fulda",note:"Startort der VIP-Edition.",km:[1.6,3]},{name:"Frankfurt am Main \u2013 Skyline",note:"Heimat von SkylineTV.",km:[2.4,4.4]},{name:"Bad Soden-Salm\xFCnster (Popcorn an der Lades\xE4ule)",note:"Haushaltsger\xE4te an der E-S\xE4ule testen.",km:[1.6,3],special:"charger"},{name:"Bischofsheim in der Rh\xF6n (Starlink)",note:"Erster Starlink-IRL-Stream der Welt.",km:[2.2,3.8]},{name:"Dortmund \u2013 die richtige Currywurstbude",note:"Diesmal ganz sicher die richtige.",km:[1.8,3.2],special:"bude"},{name:"Ein sehr sch\xF6ner Brunnen",note:"F\xFCr eine neue Folge BrunnenTV.",km:[1.4,2.8],special:"brunnen"},{name:"Meister Propper abholen",note:"Er ist ganz bestimmt gleich da.",km:[1.6,3],special:"propper"},{name:"Sparkasse (Farbe pr\xFCfen)",note:"Der Wissenschaftliche Dienst braucht Daten.",km:[1.4,2.6],special:"sparkasse"}],s0=["rot","blau","wei\xDF","rot (wie immer)","\xFCberraschend orange"],eb=["Ebbelwoi","Handk\xE4s","Brunnen","Schnitzel","Navi","Pl\xFCsch","Rettich","Elsa","Sparkassen","Blinker","Wischer","Kassel","Fulda","Gifhorn","Mainz","Rasthof","Akku","Supercharger","Dampfcola","Bananensaft","Kanalpunkte","Pommes","Funkloch","Drohnen","Starlink","Spurwechsel","Autobahn","Leitplanken","Ortsspenden","Rahmen","FullHD","Konfetti","Megafon","Ringtennis","Pandam\xFCtzen"],tb=["_FFM","77","_HD","3000","333","_Fan","fahrer","freund","hesse","_LIVE","42","_93","k\xF6nig","prinzessin","opa","tante","kumpel","_VIP","2017","liebe","meister","_on_tour","1337","xd"];function Vi(){return je(eb)+je(tb)}function r0(i){let e=0;for(let t=0;t<i.length;t++)e=(e*31+i.charCodeAt(t))%360;return`hsl(${e}, 75%, 68%)`}var Ul={james:{name:"James",icon:"\u{1F4B6}",role:"Finanz-Bot"},claudia:{name:"Claudia",icon:"\u2699\uFE0F",role:"Aktions-Bot"},victoria:{name:"Victoria",icon:"\u{1F3C6}",role:"Sieges-B\xF6ttin"},hugo:{name:"Hugo",icon:"\u23F0",role:"Hilfs-Bot"},nora:{name:"Nora",icon:"\u{1F5A5}\uFE0F",role:"Server-Bot"}},St={ambient:["Gr\xFC\xDFe aus {city}! \u{1F44B}","Hallo Mini Adam \u2764","Ist das Bild wirklich Full HD?","Wo seid ihr gerade?","Welche Farbe hat die Sparkasse hier?","Gibt es in {city} einen Ringtennis-Verein?","Rechts fahren, Adam! \u{1F605}","Sch\xF6ne Landschaft heute","Wie viel Akku noch?","Wann kommt Meister Propper?","Malte Malte Malte Malte Malte","Erz\xE4hl mal die Raab-Story!","Das Bild ist so scharf \u{1F60D}","Elsa \u2764\u{1F41F}","BrunnenTV wann?","Bananensaft-Pause? \u{1F34C}","Kappandram\xE4\xDFige Zusammenfassung bitte, bin grad erst rein","Wir sind auf der Autobahn und streamen in Full HD! \u{1F3B6}","Wohin fahren wir eigentlich?","Das Navi-Ziel \xE4ndert sich eh gleich wieder","Gr\xFC\xDFe ans Sprachstudio!","Danke an alle Ehrenmenschen \u{1F64F}","Tic Tac jemand?","Pandam\xFCtze aufsetzen!","Ich biete 1 Cent mehr \u{1F911}","Was ist eigentlich im Kofferraum?","Gr\xFC\xDFe an die Polizei Gifhorn \u{1F46E}","Ist das die A7?","Sch\xF6ner Tesla \u{1F5A4}","Der Wischer ist auch nur ein Mensch","Nils wei\xDF bestimmt, wann wir das letzte Mal hier waren","Bester Stream der Woche","Die Pl\xFCsch-H\xE4nde am Lenkrad \u{1F602}","Gleich kommt bestimmt ein Brunnen","Tesla-Taxi spielen wann?","Erster! (nicht)","Falsche Bude? \u{1F602}","Wer hat das Navi so eingestellt","Adam, schreib mal eine Zahl in den Chat","Was l\xE4uft da im Radio?","Live-Eskalationen immer woanders \u{1F525}"],leftLane:["LINKS IST FREI!!! \u2B05\uFE0F","Endlich linke Spur \u{1F680}","Gib ihm!","Eine Minute Freiheit!","Danke f\xFCr die Freischaltung!","\u2B05\uFE0F\u2B05\uFE0F\u2B05\uFE0F","Jetzt aber links!","Linke Spur, Baby!"],leftLaneEnd:["Und wieder rechts \u{1F605}","Rechtsfahrgebot!","War sch\xF6n, solange es ging","Nochmal freischalten!"],naviChanged:["Wer war das? \u{1F602}","Nicht schon wieder!","\xDCberboten! \u{1F911}","Navi ferngesteuert \u{1F525}","Wendeman\xF6ver incoming","Das Navi wei\xDF auch nicht mehr weiter","Ich biete 1 Cent mehr","Klassiker","Jetzt aber wirklich!","NEIN \u{1F602}"],naviReached:["ANGEKOMMEN! \u{1F389}","Geschafft!!!","Und jetzt?","Gibt es hier eine Sparkasse?","Wo ist der Guide?","Ziel erreicht \u{1F3C1}"],crash:["Rezeption!","Uff \u{1F648}","Das gibt \xC4rger","Polizei Gifhorn ist unterwegs \u{1F693}","Blechschaden!","Hoffentlich hat das keiner gesehen","Eskalation! \u{1F602}","Das war die falsche Spur"],nearMiss:["WAS WAR DAS \u{1F631}","Knapp!!!","Millimeterarbeit","CLIP!","Clip it!","Puh\u2026","Mutig!"],rainStart:["Regen \u{1F327}","Jetzt wird es spannend","Wischer.exe reagiert nicht","Auto-Wischer (Beta) \u{1F602}","Der Herr mit den Schirmen freut sich","Ab jetzt gibt es Regenzulage!"],wiper:["Der Wischer zuckt wieder \u{1F602}","Der Wischer wischt nicht, der winkt nur","Software-Update wann?","Das ist kein Bug, das ist ein Feature","Wischer-Firmware 0.1 Beta","Mach doch einfach manuell!","Der Wischer ist sch\xFCchtern"],police:["POLIZEI GIFHORN \u{1F693}","Polizei Gifhorn kommt!","Benehmen jetzt!","Ganz ruhig bleiben\u2026","\u{1F46E}\u{1F46E}\u{1F46E}"],funkloch:["F","F","F","Ton f","/cam2","F","Bild weg?","F"],funklochBack:["\u2714\uFE0F","\u2714\uFE0F","\u2714\uFE0F Bild ist wieder da","Da ist es wieder \u2714\uFE0F"],frog:["\u{1F438}","\u{1F438}\u{1F438}","Frosch!","\u{1F438} HDMI-Kabel?"],blitzer:["\u{1F4F8}","L\xE4cheln! \u{1F4F8}","Das Foto kommt in einen Rahmen","Tsch\xFCss, du Betr\xFCger!","Teures Selfie"],elefant:["Elefantenrennen \u{1F418}\u{1F418}","Das dauert\u2026","\xDCberholverbot wann?","Die stehen ja fast"],trunk:["Kofferraum auf! \u{1F602}","Was ist da drin?","Bitspende-Eskalation","Konfetti im Kofferraum?"],brunnen:["BRUNNENTV!!!","Herr Sch\xF6nnbrun!","Brunnen gesichtet! \u26F2","Neue Folge BrunnenTV!"],elsa:["ELSA!!! \u2764\u{1F41F}","Elsa \u2764","Spirit-Animal gesichtet!","\u{1F451}\u{1F41F}"],record:["REKORD!!! \u{1F389}","Neuer Zuschauerrekord!","Diesmal ohne Viewer-Bots \u{1F916}","Hype!"],banana:["\u{1F34C}\u{1F34C}\u{1F34C}","Bananensaft-Power!","Lecker \u{1F34C}"],koriander:["B\xE4h, Koriander \u{1F922}","Nicht der Koriander!","Wer hat da Koriander bestellt?"],shoulder:["Standstreifen?! \u{1F631}","Polizei Gifhorn!!","Das ist keine Fahrspur!"],fiveJobs:["Job erledigt \u2705","Weiter so!","Noch ein Job weniger"],rahmen:["Sch\xF6ner Rahmen \u{1F602}","Ich sehe nichts mehr","Bestes Geld ever","Danke f\xFCr den Rahmen!"],zahl:()=>mt(.75)?nb():String(Fr(10,9999))};function nb(){let i=Fr(2,4),e="";for(let t=0;t<i;t++)e+=mt(.62)?"3":String(Fr(0,9));return e.includes("3")||(e="3"+e.slice(1)),e}function Ju(i,e={}){return i.replace(/\{(\w+)\}/g,(t,n)=>e[n]!==void 0?e[n]:je(ib))}var ib=["Fulda","Kassel","Gifhorn","Mainz","K\xF6ln","Siegen","Hanau","Darmstadt","Bielefeld","Buxtehude","Konstanz","Augsburg","Bremen","N\xFCrnberg","Hamburg","L\xFCbeck","Trier","Erlensee"];function o0(i){return i>=100?"ALTER!":i>=50?"Mittelalter":i>=33?"Drittel-Alter":i>=25?"Viertel-Alter":i>=20?"F\xFCnftel-Alter":i>=10?"Zehntel-Alter":null}var Ks={kassandra:{label:"Fr\xE4ulein Kassandra",pitch:1.35,rate:1},weronika:{label:"Weronika",pitch:1.1,rate:.95},karla:{label:"Karla",pitch:1,rate:1.05},william:{label:"Br\xFCll-William",pitch:.55,rate:1.12},board:{label:"NOMI",pitch:1.18,rate:1.04},schoennbrun:{label:"Herr Sch\xF6nnbrun",pitch:.45,rate:.82}},a0=[{voice:"kassandra",text:"Treffen sich zwei Unterhosen. Fragt die eine: Warst du im Urlaub? Du bist so braun."},{voice:"karla",text:"Hallo Mini Adam, liebe Gr\xFC\xDFe aus {city}. Dachs gr\xFC\xDFt Efeu."},{voice:"william",text:"Mini Adam, bitte einmal hupen! Bimmel hurra!"},{voice:"weronika",text:"Hier spricht Meister Propper. Ich bin in f\xFCnf Minuten da."},{voice:"karla",text:"Gr\xFC\xDFe an das Sprachstudio und an alle Ehrenmenschen!"},{voice:"weronika",text:"Mini Adam, wann gibt es endlich eine neue Folge BrunnenTV?"},{voice:"kassandra",text:"Liebe Gr\xFC\xDFe an Elsa!"},{voice:"karla",text:"Gibt es in {city} eigentlich einen Ringtennis-Verein?"},{voice:"weronika",text:"Welche Farbe hat die Sparkasse in {city}?"},{voice:"william",text:"Mini Adam, erz\xE4hl doch mal die Raab-Story!"},{voice:"karla",text:"Wir sind auf der Autobahn und streamen in Full HD!"},{voice:"william",text:"Ich biete einen Cent mehr. Neues Ziel: {city}."},{voice:"kassandra",text:"Bitte rechts fahren. Mit freundlichen Gr\xFC\xDFen, die Polizei Gifhorn."},{voice:"weronika",text:"Mini Adam, du f\xE4hrst besser als jedes Navi."},{voice:"karla",text:"Hallo Mini Adam! Schreib mal eine Zahl in den Chat. Aber bitte ohne Drei."},{voice:"william",text:"Kappandram\xE4\xDFige Zusammenfassung bitte! Ich war beim Schwimmunterricht."}],l0=[{voice:"karla",text:"Guten Tag, hier ist der Herr mit den Schirmen. Ich w\xFCrde meine Schirme gerne heute noch abholen."},{voice:"weronika",text:"Mini Adam, dein Scheibenwischer winkt mir gerade zu. Ich winke zur\xFCck!"},{voice:"kassandra",text:"Achtung, Achtung. Der automatische Scheibenwischer befindet sich weiterhin in der Beta-Phase."}],Jn={leftLane:"Die linke Fahrspur ist freigeschaltet.",leftLaneEnd:"Die linke Fahrspur ist wieder gesperrt. Bitte rechts fahren.",naviChanged:"Das Navi-Ziel wurde ge\xE4ndert.",arrived:"Sie haben Ihr Ziel erreicht.",rain:"Regen erkannt. Automatische Scheibenwischer aktiviert.",lowBattery:"Akku schwach. Bitte bald laden.",veryLowBattery:"Akku fast leer. Die Stream-Technik schaltet gleich ab.",elefant:"Achtung. Elefantenrennen voraus.",blitzer:"Hinweis: Tempolimit. Station\xE4rer Blitzer voraus.",shoulder:"Hinweis: Der Standstreifen ist keine Fahrspur.",funkloch:"Verbindung schwach. Mobilfunk wird neu geb\xFCndelt."},c0=[{id:"rosen",name:"Rosenrahmen",price:12,dur:9},{id:"rettich",name:"Rettichrahmen",price:13.69,dur:9},{id:"pommes",name:"Pommes-Rahmen",price:5,dur:7},{id:"pappkarton",name:"Pappkartonhaufen",price:10,dur:8},{id:"haelfte",name:"Bildh\xE4lfte abdecken",price:10,dur:3.5},{id:"elsa",name:"Elsa auf den Bildschirm zaubern",price:2.9,dur:6},{id:"burger",name:"Burger-Rahmen",price:14,dur:8},{id:"candy",name:"Candy-Rahmen",price:10,dur:8},{id:"lego",name:"Lego-Rahmen",price:12,dur:8},{id:"briefmarken",name:"Briefmarken-Rahmen",price:10.01,dur:8},{id:"chips",name:"Chipsrahmen",price:5,dur:7},{id:"keinerechte",name:"Keine-Rechte-Bildrahmen",price:10,dur:7},{id:"kuerbis",name:"K\xFCrbis im Stream",price:4.9,dur:6}],e0=[{km:0,job:"Brownietester",src:"19.03.2020, Ersatzstream im Homeoffice"},{km:1,job:"Briefmarkenautomatenbef\xFCller",src:"26.03.2020, Ersatzstream im Homeoffice"},{km:2,job:"Plumpsklo-Ingenieur",src:"20.09.2018, M\xFCnster"},{km:3,job:"baut k\xFCnstliche Maulwurfstunnel",src:"02.01.2020, Cuxhaven"},{km:4,job:"Bildumdreher im Frankfurter Kunstmuseum",src:"05.03.2020, Werne"},{km:5,job:"Krokodilw\xE4chter im Frankfurter Zoo",src:"26.05.2019, Fulda"},{km:6.5,job:"Qualit\xE4tssicherung f\xFCr Schilder (pr\xFCft die Druckaufl\xF6sung)",src:"30.03.2017, M\xFCnchen"},{km:8,job:"wartet Schornsteine in Wolkenkratzern",src:"13.12.2019, Salzburg"},{km:10,job:"richtet WLAN in Flugzeugen ein",src:"25.07.2019, Karlsruhe"},{km:12,job:"schreibt die Algorithmen f\xFCr die roten und orangenen Bereiche bei Google Maps",src:"23.05.2019, Freising"},{km:15,job:"macht statistische Modelle f\xFCr die Endzeit der Benzintankstellen",src:"07.10.2022, Golfen im Park"},{km:20,job:"Teilchenbeschleuniger",src:"06.02.2021, Tesla-Navi ferngesteuert"}];function h0(i){let e=e0[0];for(let t of e0)i>=t.km&&(e=t);return e}var u0=[{id:"left20",text:"20 Sekunden auf der freigeschalteten linken Spur",goal:20,stat:"leftLaneTime"},{id:"navi1",text:"Ein Navi-Ziel erreichen",goal:1,stat:"naviReached"},{id:"near3",text:"3\xD7 haarscharf \xFCberholen",goal:3,stat:"nearMisses"},{id:"speed200",text:"200 km/h fahren",goal:200,stat:"maxSpeedKmh"},{id:"banana2",text:"2\xD7 Bananensaft einsammeln",goal:2,stat:"bananas"},{id:"clean5",text:"5 km ohne Blechschaden",goal:5e3,stat:"cleanDistance"},{id:"changes3",text:"3 Navi-\xC4nderungen \xFCberstehen",goal:3,stat:"naviChanges"},{id:"viewers1000",text:"1.000 Zuschauer erreichen",goal:1e3,stat:"maxViewers"},{id:"charge2",text:"2 Lade-Ringe einsammeln",goal:2,stat:"charges"},{id:"dist8",text:"8 km Strecke schaffen",goal:8e3,stat:"distance"},{id:"blitzfrei",text:"An einem Blitzer vorbei, ohne geblitzt zu werden",goal:1,stat:"blitzerClean"},{id:"rain1",text:"1 km im Regen fahren",goal:1e3,stat:"rainDistance"}],Fo=[{id:"boost",icon:"\u26A1",name:"Beschleunigungs-Boost",cat:"Leistung",prices:[300,700,1500],desc:"Over-the-Air-Update f\xFCr mehr Bums. Zieht los wie der Chat bei einer Ortsspende.",effect:i=>`Beschleunigung +${i*20} %`},{id:"vmax",icon:"\u{1F3C1}",name:"Tempo-Freischaltung",cat:"Leistung",prices:[400,900,1900],desc:"Hebt die Software-Drossel auf. Stufe 3 ist der Performance-Modus.",effect:i=>`H\xF6chstgeschwindigkeit ${[200,215,233,261][i]} km/h`},{id:"akku",icon:"\u{1F50B}",name:"Akku-Puffer",cat:"Akku",prices:[350,800,1600],desc:"Mehr nutzbare kWh. Offiziell bleibt es nat\xFCrlich beim 75-kWh-Akku.",effect:i=>`${75+i*4} kWh nutzbar`},{id:"encoder",icon:"\u{1F4E1}",name:"Stream-Technik-Update",cat:"Akku",prices:[300,700,1400],desc:"Telekom, Vodafone und O\u2082 werden effizienter geb\xFCndelt. Die Technik im Kofferraum frisst weniger Strom.",effect:i=>`Stromverbrauch der Stream-Technik \u2212${i*15} %`},{id:"reifen",icon:"\u{1F6DE}",name:"Sportreifen",cat:"Fahrwerk",prices:[350,900],desc:"Mehr Grip f\xFCr schnelle Spurwechsel, auch bei Regen.",effect:i=>`Spurwechsel +${i*12} %, besserer Nassgrip`},{id:"polster",icon:"\u{1F9F8}",name:"Pl\xFCsch-Polster",cat:"Fahrwerk",prices:[500,1300],desc:"Rundum-Polsterung aus original Mini-Adam-Pl\xFCsch. Steckt einen Rempler mehr weg.",effect:i=>`${3+i} Karosserie-Punkte`},{id:"wischer",icon:"\u{1F327}\uFE0F",name:"Wischer-Firmware (Beta)",cat:"Sicht",prices:[250,600,1200],desc:"Der automatische Wischer wischt jetzt manchmal. Manchmal. Zucken bleibt Kult.",effect:i=>["Version 0.1 Beta: zuckt nur","Version 11.1 Beta: wischt ab und zu","Version 11.2 Beta: wischt \xF6fter","Version 12 (immer noch Beta)"][i]},{id:"megafon",icon:"\u{1F4E2}",name:"Megafon",cat:"Spa\xDF",prices:[450],desc:"Wie in Gifhorn: Mit einer Megafon-Durchsage macht der Verkehr vor dir Platz. Taste H.",effect:()=>"Autos vor dir wechseln die Spur"},{id:"starlink",icon:"\u{1F6F0}\uFE0F",name:"Starlink-Sch\xFCssel",cat:"Spa\xDF",prices:[1100],desc:"Wie beim ersten Starlink-IRL-Stream der Welt: keine Funkl\xF6cher, mehr Zuschauer, mehr Spenden.",effect:()=>"Keine Funkl\xF6cher, +25 % Zuschauer, +20 % Spenden"},{id:"linksspur",icon:"\u2B05\uFE0F",name:"Linke-Spur-Sammelaktion",cat:"Spa\xDF",prices:[400,1e3],desc:"Die Community sammelt flei\xDFiger: Die linke Spur wird \xF6fter freigeschaltet und zahlt besser.",effect:i=>`Linke-Spur-Bonus +${i*25} %, h\xE4ufiger`},{id:"elsa",icon:"\u{1F451}",name:"Wackel-Elsa",cat:"Deko",prices:[120],desc:"Das Spirit-Animal von SkylineTV LIVE als Wackelfigur f\xFCrs Armaturenbrett.",effect:()=>"Wackelt bei jeder Kurve mit"},{id:"weste",icon:"\u{1F9BA}",name:"Warnweste",cat:"Deko",prices:[90],desc:"F\xFCr Mini Adam. Bringt nichts, sieht aber sehr professionell aus.",effect:()=>"Sichtbar beim Drohnenflug"},{id:"konfetti",icon:"\u{1F389}",name:"Konfetti-Kanone",cat:"Deko",prices:[200],desc:"Knallt bei jedem erreichten Ziel. Ein paar Schnipsel kleben danach an der Scheibe \u2013 wie 2022.",effect:()=>"Konfetti bei Navi-Zielen"}],Nl=Object.fromEntries(Fo.map(i=>[i.id,i.prices.length])),d0=[["Fahrer","Mini Adam"],["Kamera","station\xE4r"],["Drohne","die Drohne"],["Sprachstudio","das Sprachstudio"],["Scheibenwischer","Auto-Wischer (Beta)"],["Navigation","ferngesteuert vom Chat"]];function f0(i=1,e=30){let t=Me(i,e);return mt(.15)?13.69:mt(.1)?3.33:Math.round(t*100)/100}var Bl=class{constructor(){if(this.supported=typeof window<"u"&&"speechSynthesis"in window&&typeof SpeechSynthesisUtterance<"u",this.enabled=!0,this.voices=[],this.queue=[],this.busy=!1,this.current=null,this.supported){let e=()=>{let t=window.speechSynthesis.getVoices();this.voices=t.filter(n=>/^de(-|_|$)/i.test(n.lang))};e(),window.speechSynthesis.onvoiceschanged=e}}pickVoice(e){if(!this.voices.length)return null;let t={board:[/Google Deutsch/i,/Anna/i,/Hedda/i,/Katja/i,/Petra/i,/Helena/i],kassandra:[/Anna/i,/Google Deutsch/i,/Katja/i,/Hedda/i],weronika:[/Hedda/i,/Petra/i,/Google Deutsch/i],karla:[/Katja/i,/Google Deutsch/i,/Anna/i],william:[/Stefan/i,/Markus/i,/Yannick/i,/Conrad/i,/Google Deutsch/i],schoennbrun:[/Stefan/i,/Markus/i,/Yannick/i,/Conrad/i]}[e]||[];for(let n of t){let s=this.voices.find(r=>n.test(r.name));if(s)return s}return this.voices[0]}estimate(e,t=1){return Math.max(1.2,e.length/14/t)}say(e,t="board",n={}){let s=Ks[t]||Ks.board,r=this.estimate(e,s.rate),o={text:e,voiceKey:t,opts:n,dur:r};if(n.priority)this.queue=this.queue.filter(a=>a.opts.priority),this.current&&!this.current.opts.priority&&this.cancelCurrent(),this.queue.unshift(o);else{if(this.queue.length>2)return r;this.queue.push(o)}return this.pump(),r}cancelCurrent(){if(this.supported)try{window.speechSynthesis.cancel()}catch{}this.current?.timer&&clearTimeout(this.current.timer);let e=this.current;this.current=null,this.busy=!1,e?.opts.onEnd?.()}pump(){if(this.busy||!this.queue.length)return;let e=this.queue.shift();this.busy=!0,this.current=e;let t=Ks[e.voiceKey]||Ks.board;e.opts.onStart?.(e.dur);let n=()=>{this.current===e&&(e.timer&&clearTimeout(e.timer),this.current=null,this.busy=!1,e.opts.onEnd?.(),setTimeout(()=>this.pump(),250))};if(this.supported&&this.enabled&&this.voices.length)try{let s=new SpeechSynthesisUtterance(e.text);s.lang="de-DE";let r=this.pickVoice(e.voiceKey);r&&(s.voice=r),s.pitch=t.pitch,s.rate=t.rate,s.volume=1,s.onend=n,s.onerror=n,window.speechSynthesis.speak(s),e.timer=setTimeout(n,(e.dur+4)*1e3);return}catch{}e.timer=setTimeout(n,e.dur*1e3)}stopAll(){this.queue=[],this.cancelCurrent()}pause(e){if(this.supported)try{e?window.speechSynthesis.pause():window.speechSynthesis.resume()}catch{}}};var Hl=class{constructor(){this.keys=new Set,this.pressed=new Set,this.touch={left:!1,right:!1,gas:!1,brake:!1},this.steer=0,this.throttle=0,this.brake=0,this.anyKey=!1,this.lastDevice="keyboard";let e={ArrowLeft:"left",KeyA:"left",ArrowRight:"right",KeyD:"right",ArrowUp:"gas",KeyW:"gas",ArrowDown:"brake",KeyS:"brake",Space:"horn",KeyE:"wiper",KeyH:"megafon",Escape:"pause",KeyP:"pause",KeyV:"camera",KeyM:"mute",Enter:"confirm",KeyC:"chat"};this.map=e,window.addEventListener("keydown",t=>{let n=e[t.code];if(!(t.target&&/input|textarea|select/i.test(t.target.tagName))&&(this.anyKey=!0,this.lastDevice="keyboard",n)){this.keys.has(n)||this.pressed.add(n),this.keys.add(n);let s=t.target&&t.target.tagName==="BUTTON"&&t.target.offsetParent!==null;["left","right","gas","brake","horn"].includes(n)&&!s&&t.preventDefault()}}),window.addEventListener("keyup",t=>{let n=e[t.code];n&&this.keys.delete(n)}),window.addEventListener("blur",()=>this.keys.clear()),this.padPrev={}}bindTouch(e,t){let n=r=>{r.preventDefault(),this.lastDevice="touch",t in this.touch?this.touch[t]=!0:this.pressed.add(t)},s=r=>{r.preventDefault(),t in this.touch&&(this.touch[t]=!1)};e.addEventListener("pointerdown",n),e.addEventListener("pointerup",s),e.addEventListener("pointercancel",s),e.addEventListener("pointerleave",s)}poll(){let e=0,t=0,n=0;(this.keys.has("left")||this.touch.left)&&(e-=1),(this.keys.has("right")||this.touch.right)&&(e+=1),(this.keys.has("gas")||this.touch.gas)&&(t=1),(this.keys.has("brake")||this.touch.brake)&&(n=1);let s=navigator.getGamepads?navigator.getGamepads():[];for(let r of s){if(!r)continue;let o=r.axes[0]||0;Math.abs(o)>.15&&(e=o,this.lastDevice="gamepad");let a=r.buttons[7]?.value||0,l=r.buttons[6]?.value||0;a>.05&&(t=Math.max(t,a)),l>.05&&(n=Math.max(n,l)),r.buttons[12]?.pressed&&(t=1),r.buttons[13]?.pressed&&(n=1);let c=(h,u)=>{let d=r.index+":"+h,f=!!r.buttons[h]?.pressed;f&&!this.padPrev[d]&&(this.pressed.add(u),this.anyKey=!0),this.padPrev[d]=f};c(0,"horn"),c(2,"wiper"),c(3,"megafon"),c(9,"pause"),c(1,"camera")}this.steer=Math.max(-1,Math.min(1,e)),this.throttle=t,this.brake=n}take(e){return this.pressed.has(e)?(this.pressed.delete(e),!0):!1}endFrame(){this.pressed.clear(),this.anyKey=!1}};var ju="mini-adam-tesla-navi-v1",$s={wallet:0,upgrades:{},best:{distance:0,earned:0,viewers:0},stats:{runs:0,totalKm:0,naviReached:0,crashes:0,leftLaneEuro:0},settings:{sound:!0,speech:!0,chat:!0,quality:"auto",volume:.8},seenIntro:!1};function p0(){try{let i=localStorage.getItem(ju);if(!i)return structuredClone($s);let e=JSON.parse(i);return{...structuredClone($s),...e,best:{...$s.best,...e.best||{}},stats:{...$s.stats,...e.stats||{}},settings:{...$s.settings,...e.settings||{}},upgrades:{...e.upgrades||{}}}}catch{return structuredClone($s)}}function Js(i){try{return localStorage.setItem(ju,JSON.stringify(i)),!0}catch{return!1}}function m0(){try{localStorage.removeItem(ju)}catch{}return structuredClone($s)}var Fl=1/3.6,sb=[200,215,233,261],Qu=-7.8,g0=10,rb=7.9,Ol=class{constructor(){this.reset({})}reset(e={}){let t=n=>e[n]||0;this.upgrades=e,this.vmaxBase=sb[Math.min(3,t("vmax"))]*Fl,this.accelMul=1+.2*t("boost"),this.capacity=75+4*t("akku"),this.streamDrain=.1*(1-.15*t("encoder")),this.latMul=1+.12*t("reifen"),this.wetGrip=.66+.13*t("reifen"),this.maxHits=3+t("polster"),this.s=0,this.x=Ue.laneCenter(3),this.vx=0,this.speed=95*Fl,this.yaw=0,this.latAcc=0,this.steer=0,this.throttle=0,this.braking=0,this.battery=100,this.hits=0,this.cooldown=0,this.len=$n.length,this.w=$n.width,this.shoulderTime=0,this.scrapeCooldown=0,this.sugar=0,this.wobble=0,this.limiter=0,this.empty=!1,this.events=[]}get kmh(){return this.speed*3.6}get vmax(){return this.vmaxBase*(this.sugar>0?1.08:1)}get lane(){return Ze(Math.round((this.x+5.625)/3.75),0,3)}get inLeftLane(){return this.x<-3.75-.35}get onShoulder(){return this.x>rb}update(e,t,n={}){this.events.length=0;let s=n.wet||0,r=1-s*(1-this.wetGrip);this.cooldown=Math.max(0,this.cooldown-e),this.scrapeCooldown=Math.max(0,this.scrapeCooldown-e),this.sugar=Math.max(0,this.sugar-e),this.wobble=Math.max(0,this.wobble-e);let o=this.speed/55,a=.25*o*o*(.4+.6*Math.max(this.throttle,.35)),l=(this.streamDrain+a)*(75/this.capacity);this.battery=Math.max(0,this.battery-l*e),this.empty=this.battery<=0;let c=this.empty?0:Ze(t.throttle,0,1),h=Ze(t.brake,0,1);this.throttle=Nn(this.throttle,c,8,e),this.braking=h;let u=this.speed,d=this.vmax,f=0;if(c>.02&&u<d){let _=Ze(u/d,0,1);f+=c*5.4*this.accelMul*Math.max(.12,1-Math.pow(_,2.6))}h>.02&&(f-=h*9.5*(1-s*.18)),c<=.02&&h<=.02&&(f-=.12+11e-5*u*u+(this.empty?1.4:0)),u>d&&(f=Math.min(f,-1.5)),this.speed=Math.max(0,u+f*e),u<=d&&this.speed>d&&(this.speed=d);let m=Ze(t.steer,-1,1);this.wobble>0&&(m+=Math.sin(this.wobble*9)*.35),this.steer=Nn(this.steer,m,14,e);let v=Ze(this.speed/12,0,1),g=4.3*this.latMul*r*v,p;if(Math.abs(m)>.08)p=m*g;else{let _=Ue.laneCenter(this.lane);p=Ze((_-this.x)*2,-1.9,1.9)*v}let y=this.vx;if(this.vx=Nn(this.vx,p,8.5*r,e),this.latAcc=(this.vx-y)/Math.max(e,1e-4),this.x+=this.vx*e,this.x<Qu||this.x>g0){let _=this.x<Qu?-1:1;this.x=_<0?Qu:g0;let x=Math.abs(this.vx)>1.2;this.vx=-_*Math.min(1.5,Math.abs(this.vx)*.4),this.scrapeCooldown<=0&&(this.scrapeCooldown=.6,this.speed*=x?.9:.97,this.events.push({type:"rail",side:_,hard:x}))}this.onShoulder&&this.speed>5?this.shoulderTime+=e:this.shoulderTime=Math.max(0,this.shoulderTime-e*2),this.yaw=Ze(Math.atan2(this.vx,Math.max(this.speed,4)),-.22,.22),this.s+=this.speed*e}collide(e){let t=this.cooldown<=0,n=e.car,s=e.lonOverlap>e.latOverlap*1.6;if(!s&&e.ds>0)this.s=n.s-(n.len+this.len)/2-.35,t?(this.speed=Math.max(0,Math.min(this.speed,n.speed)-4),n.speed+=2.5):this.speed=Math.min(this.speed,n.speed);else if(!s&&e.ds<0)t?(this.speed+=2,n.speed=Math.max(0,this.speed-4)):n.speed=Math.min(n.speed,this.speed),n.s=this.s-(n.len+this.len)/2-.4;else{let r=e.dx>0?-1:1;t?(this.x+=r*(e.latOverlap+.12),this.vx=r*3.2,this.speed*=.93,n.speed*=.97):(this.x+=r*(e.latOverlap+.05),this.vx=r*Math.max(1.5,this.vx*r))}return t?(this.hits++,this.cooldown=1.6,!0):!1}charge(e){this.battery=Math.min(100,this.battery+e),this.empty=!1}};function ed(i){if(!i)return"";if(i.short)return i.short;let e=i.name.split(/[,(–:]/)[0].trim();return e.length>24?e.slice(0,23)+"\u2026":e}var ob={rot:"#d5121e",blau:"#1d5fbf",wei\u00DF:"#f2f2f2","rot (wie immer)":"#d5121e","\xFCberraschend orange":"#f07a12"},zl=class{constructor(e){this.scenery=e,this.requests=[],this.reset(0)}reset(e){for(let t of this.requests)this.scenery.cancel(t);this.requests=[],this.bid=.01,this.changes=0,this.history=[],this.set(e,$u[0],"Mini Adam",{first:!0})}pickTarget(){let e=this.target;return Po($u.filter(t=>t!==e),t=>t.weight??1)}overbid(e,t){let n=mt(.18)?Math.floor(Me(2,12)):1;this.bid=Math.round((this.bid+n*.01)*100)/100,this.changes++;let s=this.pickTarget();return this.set(e,s,t),s}set(e,t,n,{first:s=!1}={}){for(let r of this.requests)this.scenery.cancel(r,!this.arrived);this.requests=[],this.target=t,this.bidder=n,this.km=Me(t.km[0],t.km[1]),this.startS=e,this.targetS=e+this.km*1e3,this.recalc=s?0:1,this.wende=!s&&mt(.28),this.wendeS=e+Me(380,820),this.arrived=!1,this.side=mt(.5)?1:-1,this.sparkColor=je(s0),this.history.push({name:t.name,bidder:n,bid:this.bid}),this.history.length>12&&this.history.shift(),this.placeLandmarks()}placeLandmarks(){let e=this.target,t=this.targetS,n=(s,r,o)=>this.requests.push(this.scenery.request(s,r,o));switch(n("ziel",t,{title:ed(e)}),e.special){case"brunnen":n("brunnen",t-70);break;case"elsa":n("elsa",t-70);break;case"sparkasse":n("sparkasse",t-90,{color:ob[this.sparkColor]||"#d5121e"});break;case"pommes":n("kiosk",t-80,{title:"Drive-In",sub:"Pommes ohne R\xFCckfragen"});break;case"bude":n("kiosk",t-80,{title:"Currywurst",sub:"die richtige Bude (wirklich!)"});break;case"charger":n("charger",t-80);break;default:break}/Burg|Wartburg/.test(e.name)&&n("burg",t-40),/Frankfurt/.test(e.name)&&n("skyline",t+300)}get remaining(){return Math.max(0,this.targetS-this._s)}update(e,t){this._s=t;let n=[];return this.recalc=Math.max(0,this.recalc-e/2.4),this.wende&&t>this.wendeS&&(this.wende=!1,this.recalc=.8,n.push({type:"wendeIgnored"})),!this.arrived&&t>=this.targetS&&(this.arrived=!0,n.push({type:"arrived",target:this.target,km:this.km})),n}screen(e,t,n){let s=Math.max(0,this.targetS-e),r=t+s/Ze(n,20,70)*.5;return{target:this.arrived?"Warte auf das n\xE4chste Gebot \u2026":this.target.name,arrived:this.arrived,remaining:s,recalc:this.recalc,side:this.side,wende:this.wende,wendeS:this.wendeS,eta:this.arrived?"":"Ankunft "+Or(r),bidder:this.bidder,bid:qt(this.bid)}}};var ab=["POLIZEI GIFHORN","GUTE FAHRT, ADAM!","GIFHORN GR\xDCSST","BITTE L\xC4CHELN"],Gl=class{constructor(e){Object.assign(this,e),this.player=new Ol,this.navi=new zl(this.scenery),this.scenery.gantryInfo=(t=this.player.s)=>{let n=(this.navi.targetS-t)/1e3;return n<.2?null:{target:ed(this.navi.target),km:n}},this.running=!1,this.over=null}start(e){this.save=e;let t=e.upgrades||{};this.up=t;let n=this.player;n.reset(t),this.t=0,this.money=0,this.breakdown={},this.over=null,this.running=!0,this.queue=[],this._greeted=!1,this._introChime=!1,this.clock=18*60,this.viewers=240,this.hype=0,this.peakViewers=240,this.recordShown=!1,this.lastHorn=-99,this.megafonCd=0,this.leftTick=0,this.chatT=1.5,this.donationT=Me(6,10),this.stats={leftLaneTime:0,naviReached:0,nearMisses:0,maxSpeedKmh:0,bananas:0,cleanDistance:0,naviChanges:0,maxViewers:0,charges:0,distance:0,blitzerClean:0,rainDistance:0,crashes:0,koriander:0,fines:0,wipes:0,twitches:0,photos:0},this.jobs=cp(u0).slice(0,5).map(r=>({...r,done:!1,progress:0})),this.allJobsPaid=!1;let s=t.linksspur||0;this.left={open:!1,timer:0,next:Me(22,30),warned:!1,glow:0,rg:0,grace:0,bonusMul:1+.25*s,freq:1-.14*s,earned:0},this.weather={level:0,target:0,active:!1,dur:0,cool:0,announced:!1,regenzulage:!1},this.T={bid:Me(38,52),durchsage:Me(28,40),rahmen:Me(70,100),funkloch:Me(110,170),frog:Me(160,260),trunk:Me(120,200),numbers:Me(80,130),police:Me(200,300),wiperChat:0},this.S={blitzer:Me(3e3,3800),elefant:Me(3200,4200),landmark:Me(1400,2e3),charge:Me(700,1e3),banana:Me(1100,1500),koriander:Me(2200,2800)},this.blitzer=null,this.landmark=null,this.funkloch=0,this.policeCar=null,this.shoulderWarned=!1,this.batteryWarned=0,this.lastHugo=0,this.scenery.reset(),this.navi.reset(0),this.traffic.reset(),this.traffic.populate(0,n.speed),this.pickups.reset(),this.speech.stopAll(),this.windshield.clear(),this.windshield.setRain(0),this.windshield.setFirmware(t.wischer||0),this.windshield.onEvent=r=>this.onWiper(r),this.cockpit.clearConfetti(),this.cockpit.setElsa(!!t.elsa),this.ui.reset?.(),this.ui.jobs(this.jobs),this.bot("hugo","Der Stream l\xE4uft! Viel Spa\xDF beim Zuschauen."),this.later(1.2,()=>this.chat("Hallo Mini Adam \u2764")),this.later(2,()=>this.chat("Wohin fahren wir heute?")),this.later(3.2,()=>this.bot("james",`Startgebot: ${qt(this.navi.bid)} \u2013 Ziel: ${this.navi.target.name}`))}startDemo(){this.running=!1,this.over=null,this.demoT=0,this.player.reset({}),this.player.x=1.875,this.player.speed=118*Fl,this.weather={level:0,target:0,active:!1,dur:0,cool:0,announced:!1,regenzulage:!1},this.left={open:!1,timer:0,glow:0},this.sirenLevel=0,this.windshield.setRain(0),this.windshield.clear(),this.scenery.reset(),this.navi.reset(0),this.traffic.reset(),this.traffic.populate(0,this.player.speed),this.pickups.reset()}demo(e,t){this.demoT+=e;let n=this.player;n.update(e,t,{wet:0}),n.battery=100,n.hits=0,this.navi.update(e,n.s),this.navi.arrived&&this.navi.overbid(n.s,"Demo"),this.traffic.update(e,this.demoT,n,{difficulty:.15,leftOpen:!1,rain:0})}later(e,t){this.queue.push({at:this.t+e,fn:t})}chat(e,t=Vi(),n={}){this.ui.chat&&this.ui.chat({name:t,text:Ju(e),...n})}bot(e,t){let n=Ul[e];this.ui.chat({name:n.name,text:t,bot:e,icon:n.icon})}burst(e,t=3,n=2.5){let s=typeof e=="function"?null:e;for(let r=0;r<t;r++)this.later(Me(.1,n),()=>this.chat(s?je(s):e()))}say(e,t="talk",{priority:n=!0}={}){this.audio.nomiChime();let s=this.cockpit.nomi;s.setMood(t,3.2);let r=()=>{let o=this.speech.say(e,"board",{priority:n,onStart:a=>s.speak(a)});this.ui.nomi(e,o+.8)};this.running?this.later(.35,r):r()}earn(e,t,{mult:n=!0,silent:s=!1}={}){if(e<=0)return 0;let r=n&&this.weather.regenzulage?1.5:1,o=e*r;return this.money+=o,this.breakdown[t]=(this.breakdown[t]||0)+o,s||this.ui.money(o,t),o}fine(e,t){let n=Math.min(this.money,e);this.money-=n,this.breakdown[t]=(this.breakdown[t]||0)-n,this.stats.fines+=n,n>0&&this.ui.money(-n,t),this.audio.bad()}donate(e,t,n){let s=this.earn(t*(this.up.starlink?1.2:1),"Spenden",{silent:!0});this.bot("james",`${e} hat ${qt(t)} ${n?"f\xFCr \xBB"+n+"\xAB ":""}gespendet!`),this.ui.money(s,"Spende"),this.audio.pling();let r=o0(t);return r&&this.later(.6,()=>this.chat(r+(t>=33?" \u{1F631}":""))),this.hype+=s*2,s}update(e,t,n){if(!this.running)return;this.t+=e;let s=this.player,r=this.stats,o=this.weather;if(this.queue.length){let h=this.t,u=this.queue.filter(d=>d.at<=h);if(u.length){this.queue=this.queue.filter(d=>d.at>h);for(let d of u)d.fn()}}let a=s.s;s.update(e,t,{wet:o.level});let l=s.s-a;for(let h of s.events)h.type==="rail"&&(this.audio.scrape(),this.fx.shake(h.hard?.5:.2),h.hard&&mt(.4)&&this.chat(je(["Leitplanke! \u{1F62C}","Uff, die Leitplanke","Kratz kratz"])));r.distance=s.s,r.maxSpeedKmh=Math.max(r.maxSpeedKmh,s.kmh),r.cleanDistance+=l,o.level>.3&&(r.rainDistance+=l),this.clock+=e*.5,this.megafonCd=Math.max(0,this.megafonCd-e),t.horn&&this.honk(),t.wiper&&this.manualWiper(),t.megafon&&this.useMegafon();let c=this.traffic.update(e,this.t,s,{difficulty:Ze(s.s/16e3,0,1),leftOpen:this.left.open,rain:o.level});for(let h of c)h.type==="crash"?this.onCrash(h):h.type==="nearMiss"?this.onNearMiss(h):h.type==="passPolice"&&this.chat(je(["Polizei \xFCberholt?! Mutig! \u{1F605}","Tsch\xFCss Polizei Gifhorn \u{1F44B}","Das gibt einen Eintrag ins Fahrtenbuch"]));this.over||(this.sirenLevel=0,this.policeCar&&(this.traffic.cars.includes(this.policeCar)?this.sirenLevel=Ze(1-Math.abs(this.policeCar.s-s.s)/260,0,1):this.policeCar=null),this.updateLeftLane(e),this.updateWeather(e,l),this.updateNavi(e),this.updateEvents(e),this.updatePickups(e,n),this.updateViewers(e),this.updateChat(e),this.updateJobs(),s.shoulderTime>1.2&&!this.shoulderWarned&&(this.shoulderWarned=!0,this.say(Jn.shoulder,"worried"),this.burst(St.shoulder,2,1.5)),s.shoulderTime>4.5&&(s.shoulderTime=0,this.fine(10,"Verwarngeld"),this.ui.toast("\u{1F693} Standstreifen: 10\xA0\u20AC Verwarngeld","bad"),this.callPolice("STANDSTREIFEN? NEIN!")),s.shoulderTime<=0&&(this.shoulderWarned=!1),s.battery>30?this.batteryWarned=0:s.battery>12&&this.batteryWarned>1&&(this.batteryWarned=1),s.battery<20&&this.batteryWarned<1&&(this.batteryWarned=1,this.say(Jn.lowBattery,"worried"),this.chat(je(["Akku! \u{1F50B}","Wo ist der n\xE4chste Supercharger?","Lade-Ringe einsammeln!"]))),s.battery<7&&this.batteryWarned<2&&(this.batteryWarned=2,this.say(Jn.veryLowBattery,"worried")),s.empty&&s.speed<1.5&&this.end("akku"))}updateLeftLane(e){let t=this.left,n=this.player;if(!t.open)t.next-=e,t.next<=0&&this.openLeftLane();else{if(t.timer-=e,n.inLeftLane){let s=1.25*(.45+.55*Ze(n.speed/50,0,1.3))*t.bonusMul,r=this.earn(s*e,"Linke Spur",{silent:!0});t.earned+=r,this.leftTick+=r,this.stats.leftLaneTime+=e,this.leftTick>=1&&(this.ui.money(this.leftTick,"Linke Spur"),this.leftTick=0)}t.timer<=10&&!t.warned&&(t.warned=!0,this.ui.banner("\u23F3 Linke Spur: noch 10 Sekunden",2.5)),t.timer<=0&&this.closeLeftLane()}t.glow=Nn(t.glow,t.open?1:0,3,e),t.grace=Math.max(0,t.grace-e),!t.open&&n.inLeftLane&&t.grace<=0?(t.rg+=e,t.rg>7&&!t.rgWarned&&(t.rgWarned=!0,this.ui.toast("\u26A0\uFE0F Rechtsfahrgebot! Die linke Spur ist gesperrt.","bad"),this.callPolice("BITTE RECHTS FAHREN"),this.burst(["Rechts fahren! \u{1F605}","Rechtsfahrgebot!","Polizei Gifhorn kommt\u2026"],2,1.5)),t.rg>15&&(t.rg=0,t.rgWarned=!1,this.fine(10,"Verwarngeld"),this.ui.toast("\u{1F693} Rechtsfahrgebot missachtet: 10\xA0\u20AC Verwarngeld","bad"))):(t.rg=Math.max(0,t.rg-e*2),t.rg<=0&&(t.rgWarned=!1))}openLeftLane(){let e=this.left;e.open=!0,e.timer=60,e.warned=!1;let t=Vi();this.say(Jn.leftLane,"happy"),this.audio.chime(),this.later(.2,()=>this.donate(t,je([3.33,5,2.5,10,4.2]),"Linke Spur freischalten")),this.burst(St.leftLane,3,3),this.ui.banner("\u2B05\uFE0F Linke Spur freigeschaltet!",4,"Eine Minute Bonusguthaben auf der ganz linken Spur"),this.hype+=40}closeLeftLane(){let e=this.left;e.open=!1,e.next=Me(45,70)*e.freq,e.grace=5,this.say(Jn.leftLaneEnd,"idle"),e.earned>.5&&this.ui.toast(`\u2B05\uFE0F Linke Spur: ${qt(e.earned)} Bonusguthaben`,"good"),e.earned=0,this.burst(St.leftLaneEnd,2,2.5)}updateWeather(e,t){let n=this.weather,s=this.player;if(n.active)n.dur-=e,n.dur<=0&&(n.active=!1,n.target=0,n.cool=Me(60,100),this.later(8,()=>this.chat(je(["Endlich trocken \u2600\uFE0F","Regen vorbei!","Der Wischer hat sich erholt"]))));else{n.cool-=e;let o=s.s>=4e3&&this.stats.cleanDistance>=2500;n.cool<=0&&(o||s.s>=7500)&&(n.active=!0,n.target=Me(.6,1),n.dur=Me(95,150),n.announced=!1)}let r=n.target>n.level?.07:.05;n.level+=Ze(n.target-n.level,-r*e,r*e),n.active&&!n.announced&&n.level>.12&&(n.announced=!0,this.say(Jn.rain,"worried"),this.burst(St.rainStart,3,4),this.later(4,()=>this.ui.banner("\u{1F327}\uFE0F Regenzulage!",4,"Solange es regnet, gibt es 1,5-fach Guthaben")),this.audio.whoosh()),n.regenzulage=n.level>.3,this.windshield.setRain(n.level)}onWiper(e){e==="twitch"?(this.audio.wiperTwitch(),this.stats.twitches++):(this.audio.wiperSweep(),this.stats.wipes++),this.running&&e==="twitch"&&this.T.wiperChat<=0&&this.weather.level>.2&&mt(.3)&&(this.T.wiperChat=14,this.chat(je(St.wiper)))}manualWiper(){let e=this.windshield.manual();e==="wipe"?this.ui.toast("\u{1F327}\uFE0F Wisch! Klare Sicht.","info"):e==="twitch"&&(this.ui.toast("\u{1F327}\uFE0F Der Wischer zuckt nur \u2026","info"),mt(.4)&&this.chat(je(St.wiper)))}updateNavi(e){let t=this.player;if(this.T.bid<=0)if(this.T.bid=Me(36,72),mt(.16)){let n=Vi();this.navi.bid=Math.round((this.navi.bid+.01)*100)/100,this.bot("james",`${n} bietet ${qt(this.navi.bid)} \u2013 neues Ziel: Siegen`),this.chat(je(["SIEGEN!","Siegen? \u{1F440}","Diesmal Siegen!"])),this.later(2.2,()=>this.changeNavi(!0))}else this.changeNavi(!1);for(let n of this.navi.update(e,t.s))n.type==="wendeIgnored"?(this.say("Route wird neu berechnet.","think",{priority:!1}),mt(.6)&&this.chat(je(["Wenden auf der Autobahn? \u{1F602}","Bitte wenden\u2026 nein!","Das Navi gibt nicht auf"]))):n.type==="arrived"&&this.onArrive(n)}changeNavi(e){let t=this.player,n=Vi(),s=this.navi.overbid(t.s,n);this.scenery.relabelGantries(),this.stats.naviChanges++,this.bot("james",`${n} bietet ${qt(this.navi.bid)} \u2013 neues Ziel: ${s.name}`),e&&this.later(.8,()=>this.chat(je(["Siegen wurde \xFCberboten. Wie immer \u{1F602}","Nicht schon wieder Siegen verpasst","Klassiker"]))),this.say(Jn.naviChanged,"think"),this.audio.naviAlert(),this.burst(St.naviChanged,2,3),s.special==="siegen"&&this.later(1.4,()=>this.chat("SIEGEN SETZT SICH DURCH?! \u{1F631}")),this.navi.wende&&this.later(3.5,()=>this.ui.toast("\u21A9\uFE0F Navi: \u201EBitte wenden\u201C \u2013 auf der Autobahn?","info")),this.ui.toast(`\u{1F4CD} Neues Navi-Ziel: ${s.name} (${rn(this.navi.km,1)} km)`,"info",s.note),this.hype+=25}onArrive(e){let t=this.player,n=e.target;this.stats.naviReached++;let s=Math.round(20+e.km*14);switch(n.special==="siegen"&&(s*=2),this.say(Jn.arrived,"love"),this.audio.jingle(),this.earn(s,"Navi-Ziele"),this.ui.banner(`\u{1F3C1} Ziel erreicht: ${n.name}`,4),this.burst(St.naviReached,4,3),this.hype+=120,this.up.konfetti&&(this.cockpit.addConfetti(70),this.audio.confetti(),this.later(1,()=>this.chat("KONFETTI! \u{1F389}"))),n.special){case"charger":t.charge(35),this.ui.toast("\u{1F50C} Schnell geladen: +35 % Akku","good"),this.stats.charges++;break;case"gifhorn":this.later(1.5,()=>this.callPolice("GIFHORN GR\xDCSST!"));break;case"brunnen":this.later(1.2,()=>this.speech.say("Ein sehr sch\xF6ner Brunnen. Vielen Dank.","schoennbrun")),this.audio.brunnenJingle(),this.burst(St.brunnen,3,2);break;case"elsa":this.burst(St.elsa,3,2);break;case"propper":this.later(4.5,()=>this.say("Meister Propper ist leider noch nicht da.","worried",{priority:!1})),this.later(6,()=>this.chat(je(["Wie immer \u{1F602}","Er ist bestimmt gleich da","F\xFCnf Minuten noch!"])));break;case"malte":this.burst(["Malte Malte Malte Malte","MALTE!","MaLTE","Malte ist eingestiegen \u2714\uFE0F"],5,3);break;case"siegen":this.burst(["SIEGEN!!! Es ist tats\xE4chlich passiert \u{1F631}","Geschichte wurde geschrieben","Doppelter Bonus f\xFCr Siegen!"],3,2);break;case"sparkasse":this.later(1.5,()=>this.ui.chat({name:"Wissenschaftlicher Dienst",text:`\u{1F52C} Ergebnis: Die Sparkasse ist ${this.navi.sparkColor}.`,bot:"claudia",icon:"\u{1F52C}"}));break;case"pommes":this.earn(10,"Navi-Ziele"),this.burst(["Pommes ohne R\xFCckfragen \u{1F35F}","Mit Mayo!","Keine R\xFCckfragen!"],3,2);break;case"bude":this.burst(["Diesmal die richtige Bude! \u{1F32D}","Falsche Bude? \u{1F602}","Currywurst!"],3,2);break;default:break}this.T.bid=Math.min(this.T.bid,Me(6,10))}updateEvents(e){let t=this.player,n=this.T;for(let r of Object.keys(n))n[r]-=e;if(n.durchsage<=0){n.durchsage=Me(48,85);let r=this.weather.level>.3&&mt(.5)?l0:a0,o=je(r),a=Ju(o.text),l=Vi();this.donate(l,3,"Sprachdurchsage"),this.later(1.2,()=>{let c=this.speech.say(a,o.voice);this.ui.durchsage(Ks[o.voice].label,a,c+1,l)})}if(n.rahmen<=0&&t.s>1e3){n.rahmen=Me(75,130);let r=je(c0),o=Vi();this.donate(o,r.price,r.name),this.ui.rahmen(r,o),this.later(2,()=>this.chat(je(St.rahmen)))}if(this.funkloch>0&&(this.funkloch-=e,this.funkloch<=0&&(this.ui.funkloch(!1),this.burst(St.funklochBack,3,1.5),this.later(1.2,()=>this.bot("nora","Verbindung zum Streaming-Server steht wieder. Weiter geht\u2019s!")))),n.funkloch<=0&&t.s>1500&&(n.funkloch=Me(120,220),this.up.starlink?mt(.5)&&this.chat(je(["Starlink sei Dank: kein Funkloch \u{1F6F0}\uFE0F","Bild bleibt stabil \u2714\uFE0F","Starlink \u{1F525}"])):(this.funkloch=Me(2.2,3.2),this.fx.glitch(this.funkloch),this.ui.funkloch(!0),this.burst(St.funkloch,5,1.6),mt(.5)&&this.later(.5,()=>this.say(Jn.funkloch,"worried",{priority:!1})))),n.frog<=0&&(n.frog=Me(170,300),this.fx.green(1.4),this.burst(St.frog,4,1.5)),n.trunk<=0&&t.s>2e3){n.trunk=Me(140,220);let r=Vi();this.donate(r,5,"Kofferraum \xF6ffnen"),this.fx.trunk(7),this.burst(St.trunk,3,2.5)}if(n.numbers<=0){n.numbers=Me(90,150),this.bot("claudia","Kanalpunkte-Aktion: Mini Adam m\xF6chte eine Zahl im Chat sehen!");let r=[];for(let a=0;a<Fr(6,9);a++)r.push(St.zahl());r.forEach((a,l)=>this.later(.6+l*Me(.2,.45),()=>this.chat(a)));let o=r.find((a,l)=>r.indexOf(a)!==l);o&&this.later(4.5,()=>this.chat(`Synchron mit ${o}! \u{1F91D}`))}if(n.police<=0&&t.s>2500&&(n.police=Me(220,340),this.callPolice(je(ab))),!this.blitzer&&t.s>this.S.blitzer){let r=t.s;this.blitzer={limitS:r+520,camS:r+1120,endS:r+1300,announced:!1,checked:!1},this.scenery.request("speed",this.blitzer.limitS,{limit:120}),this.scenery.request("blitzer",this.blitzer.camS),this.scenery.request("speed",this.blitzer.endS,{limit:"ende"})}if(this.blitzer){let r=this.blitzer;if(!r.announced&&t.s>r.limitS-180&&(r.announced=!0,this.say(Jn.blitzer,"wink")),!r.checked&&t.s>r.camS)if(r.checked=!0,t.kmh>126){this.fx.flash(1),this.audio.flash(),this.scenery.flashBlitzer(!0),this.later(.15,()=>this.scenery.flashBlitzer(!1)),this.stats.photos++;let o=Math.round(t.kmh),a=Or(this.clock);this.later(.6,()=>{this.fine(15,"Bu\xDFgeld"),this.ui.photo(o,a)}),this.burst(St.blitzer,3,2),this.cockpit.nomi.setMood("surprised",2)}else this.stats.blitzerClean++,this.earn(5,"Vorbildlich"),this.ui.toast("\u{1F4F8} Nicht geblitzt \u2013 vorbildlich!","good");t.s>r.endS+50&&(this.blitzer=null,this.S.blitzer=t.s+Me(2600,4200))}if(t.s>this.S.elefant&&(this.S.elefant=t.s+Me(3200,5200),this.traffic.elefantenrennen(t.s),this.say(Jn.elefant,"worried",{priority:!1}),this.later(3,()=>this.burst(St.elefant,3,3))),!this.landmark&&t.s>this.S.landmark){let r=mt(.55)?"brunnen":"elsa",o=t.s+1500;this.landmark={type:r,s:o,seen:!1,greeted:!1},this.scenery.request(r,o)}if(this.landmark){let r=this.landmark,o=r.s-t.s;!r.seen&&o<260&&(r.seen=!0,this.burst(r.type==="brunnen"?St.brunnen:St.elsa,3,2),this.ui.toast(r.type==="brunnen"?"\u26F2 Ein Brunnen! Hupen f\xFCr BrunnenTV (Leertaste)":"\u{1F451} Elsa! Hupen zum Gr\xFC\xDFen (Leertaste)","info")),!r.greeted&&o<220&&o>-40&&this.t-this.lastHorn<.3&&(r.greeted=!0,r.type==="brunnen"?(this.earn(10,"BrunnenTV"),this.audio.brunnenJingle(),this.later(.5,()=>this.speech.say("Ein sehr sch\xF6ner Brunnen.","schoennbrun")),this.ui.toast("\u26F2 BrunnenTV-Bonus!","good")):(this.earn(10,"Elsa-Gru\xDF"),this.cockpit.nomi.setMood("love",2.5),this.ui.toast("\u{1F451} Elsa winkt zur\xFCck!","good")),this.hype+=60),o<-80&&(this.landmark=null,this.S.landmark=t.s+Me(2400,3800))}let s=Math.floor(this.clock/60)%24;s!==this.lastHugo&&this.t>5&&(this.lastHugo=s,s===21?this.bot("hugo","21 Uhr: Ortsspenden-Schluss! \u2026 Verl\xE4ngerung um 5 Minuten \u{1F609}"):s===22?this.bot("hugo","Eigentlich w\xE4re jetzt Sendeschluss. Wir fahren einfach weiter!"):s>=19?this.bot("hugo",`Es ist ${s} Uhr. Sendezeit l\xE4uft.`):s===0?this.bot("hugo","Mitternacht! Der Stream l\xE4uft einfach weiter. \u{1F319}"):s<6&&this.bot("hugo",`Es ist ${s} Uhr nachts. Sendezeit l\xE4uft immer noch.`))}callPolice(e){this.policeCar||(this.policeCar=this.traffic.police(this.player.s,e),this.burst(St.police,3,2.5),this.later(1,()=>this.cockpit.nomi.setMood("worried",2.5)))}updatePickups(e,t){let n=this.player,s=this.S;n.s>s.charge&&(s.charge=n.s+Me(900,1500),this.pickups.spawnAhead("charge",n.s,this.traffic)),n.s>s.banana&&(s.banana=n.s+Me(1200,1900),this.pickups.spawnAhead("banana",n.s,this.traffic)),n.s>s.koriander&&(s.koriander=n.s+Me(1300,2300),this.pickups.spawnAhead("koriander",n.s,this.traffic));for(let r of this.pickups.update(e,this.t,n,t))r.type==="charge"?(n.charge(12),this.stats.charges++,this.audio.chime(),this.ui.toast("\u26A1 Lade-Ring: +12 % Akku","good")):r.type==="banana"?(this.stats.bananas++,n.sugar=6,this.audio.coin(),this.earn(15,"Bananensaft"),this.ui.toast("\u{1F34C} Bananensaft! Zuckerschub","good"),mt(.7)&&this.chat(je(St.banana))):(this.stats.koriander++,n.wobble=2.2,this.fine(5,"Koriander"),this.ui.toast("\u{1F33F} Koriander \u2026 b\xE4h!","bad"),this.cockpit.nomi.setMood("dizzy",2.5),this.burst(St.koriander,2,1.5))}updateViewers(e){let t=this.player,n=t.s/1e3;this.hype*=Math.exp(-e*.04);let s=220+95*n+25*Math.sin(this.t/23)+this.hype;this.up.starlink&&(s*=1.25),this.funkloch>0&&(s*=.8),this.viewers=Nn(this.viewers,s,.4,e),this.peakViewers=Math.max(this.peakViewers,this.viewers),this.stats.maxViewers=this.peakViewers;let r=Math.max(500,this.save.best.viewers||0);if(!this.recordShown&&this.viewers>r&&t.s>1500&&(this.recordShown=!0,this.bot("victoria",`Neuer Zuschauerrekord: ${rn(Math.round(this.viewers))} Zuschauer!`),this.audio.record(),this.burst(St.record,4,2.5),this.ui.banner("\u{1F3C6} Neuer Zuschauerrekord!",3.5),this.up.konfetti&&this.cockpit.addConfetti(30)),this.donationT-=e,this.donationT<=0){this.donationT=Me(8,17)*Ze(500/Math.max(this.viewers,1),.5,1.5);let o=Vi(),a=f0(1,22);this.donate(o,a),mt(.35)&&this.later(.9,()=>this.chat(je(["Danke!","Ehrenmensch \u{1F64F}","Bimmel hurra!","F\xFCnftel-Alter","\u2764"])))}}updateChat(e){this.chatT-=e,this.chatT<=0&&(this.chatT=Me(1.3,3.4)*Ze(600/Math.max(this.viewers,1),.6,1.4),this.chat(je(St.ambient)))}updateJobs(){let e=this.stats,t=!1;for(let n of this.jobs){if(n.done)continue;let s=e[n.stat]||0,r=Ze(s/n.goal,0,1);Math.abs(r-n.progress)>.01&&(n.progress=r,t=!0),s>=n.goal-.5&&(n.done=!0,n.progress=1,t=!0,this.earn(25,"Jobs",{mult:!1}),this.ui.toast(`\u2705 Job erledigt: ${n.text}`,"good"),this.audio.chime(),this.chat(je(St.fiveJobs)))}t&&this.ui.jobs(this.jobs),!this.allJobsPaid&&this.jobs.every(n=>n.done)&&(this.allJobsPaid=!0,this.earn(100,"Jobs",{mult:!1}),this.bot("victoria","You had 5 Jobs \u2013 und alle erledigt! 100\xA0\u20AC Bonus!"),this.audio.record(),this.ui.banner("\u{1F3C6} Alle 5 Jobs erledigt!",4))}honk(){this.audio.horn(),this.lastHorn=this.t,mt(.12)&&this.chat(je(["Bimmel hurra! \u{1F4EF}","HUP HUP","Hupkonzert!"]))}useMegafon(){if(!this.up.megafon){this.ui.toast("\u{1F4E2} Das Megafon gibt es im Tesla-Shop","info");return}if(this.megafonCd>0){this.ui.toast(`\u{1F4E2} Megafon l\xE4dt noch (${Math.ceil(this.megafonCd)} s)`,"info");return}this.megafonCd=15,this.audio.megafon();let e=this.traffic.megafon(this.player);this.speech.say("Achtung, Achtung! Bitte machen Sie die Spur frei!","william"),this.ui.toast(e?`\u{1F4E2} ${e} Fahrzeug${e>1?"e machen":" macht"} Platz`:"\u{1F4E2} Durchsage!","info"),this.chat(je(["Wie in Gifhorn \u{1F4E2}","MEGAFON \u{1F602}","Platz da!"]))}onCrash(e){let t=this.player;if(!t.collide(e))return;this.stats.crashes++,this.stats.cleanDistance=0,this.audio.crash(),this.fx.shake(1),this.cockpit.nomi.setMood("dizzy",3);let n=t.maxHits-t.hits;if(this.ui.damage(t.hits,t.maxHits),e.car.behavior==="polizei"&&this.chat("Ausgerechnet die Polizei Gifhorn \u{1F631}"),this.burst(St.crash,3,2),n<=0){this.end("werkstatt");return}this.ui.toast(n===1?"\u{1F9F8} Rempler! Nur noch ein Karosserie-Punkt!":`\u{1F9F8} Rempler! Noch ${n} Karosserie-Punkte`,"bad")}onNearMiss(e){this.stats.nearMisses++,this.earn(3,"Haarscharf"),this.hype+=15,mt(.5)&&this.chat(je(St.nearMiss))}end(e){if(this.over)return;this.running=!1;let t=this.player,n=t.s/1e3;this.over={reason:e,distance:t.s,money:Math.max(0,Math.round(this.money*100)/100),breakdown:{...this.breakdown},jobs:this.jobs.map(s=>({text:s.text,done:s.done})),stats:{...this.stats},peakViewers:Math.round(this.peakViewers),beruf:h0(n),time:this.t,clock:Or(this.clock),naviHistory:this.navi.history.slice(-5)},this.speech.stopAll(),e==="akku"?this.say("Akku leer. Die Stream-Technik verabschiedet sich.","sleep"):e==="werkstatt"&&this.say("Bitte einen Werkstatttermin vereinbaren.","dizzy")}screenState(){let e=this.player,t=this.weather,n=this.blitzer&&e.s>this.blitzer.limitS&&e.s<this.blitzer.endS?120:null;return{dark:t.level>.45,battery:e.battery,speedKmh:e.kmh,limit:n,playerX:e.x,leftLane:this.left.open?this.left.timer:0,cars:this.traffic.nearby(e,125),s:e.s,navi:this.navi.screen(e.s,this.clock,e.speed),clock:Or(this.clock),temp:Math.round(17-t.level*6),funkloch:this.funkloch>0?1:0,wiperOn:t.level>.05}}};function td(i,e,t){let n=document.createElement("canvas");n.width=i,n.height=e,t(n.getContext("2d"),i,e);let s=new Pt(n);return s.colorSpace=ht,s.anisotropy=4,s}function lb(){return td(256,384,(i,e,t)=>{i.translate(e/2,0),i.beginPath(),i.moveTo(-26,40),i.lineTo(26,40),i.lineTo(26,92),i.quadraticCurveTo(84,120,84,180),i.lineTo(84,340),i.quadraticCurveTo(84,370,54,370),i.lineTo(-54,370),i.quadraticCurveTo(-84,370,-84,340),i.lineTo(-84,180),i.quadraticCurveTo(-84,120,-26,92),i.closePath(),i.fillStyle="rgba(255,255,255,0.9)",i.fill(),i.lineWidth=8,i.strokeStyle="#3a2a10",i.stroke(),i.save(),i.clip();let n=i.createLinearGradient(-84,0,84,0);n.addColorStop(0,"#f2c419"),n.addColorStop(.5,"#ffe45c"),n.addColorStop(1,"#e8b30e"),i.fillStyle=n,i.fillRect(-90,150,180,230),i.restore(),i.fillStyle="#2e7d32",Ft(i,-32,14,64,32,8),i.fill(),i.fillStyle="#ffffff",Ft(i,-70,205,140,110,14),i.fill(),i.strokeStyle="#3a2a10",i.lineWidth=5,i.stroke(),i.beginPath(),i.moveTo(-44,228),i.quadraticCurveTo(-30,292,46,270),i.quadraticCurveTo(-6,270,-26,226),i.closePath(),i.fillStyle="#ffd21f",i.fill(),i.strokeStyle="#6b4a00",i.lineWidth=4,i.stroke(),i.fillStyle="#3a2a10",i.font="bold 22px Arial, sans-serif",i.textAlign="center",i.fillText("BANANENSAFT",0,306),i.fillStyle="rgba(255,255,255,0.55)",Ft(i,-70,140,14,190,7),i.fill()})}function cb(){return td(320,320,(i,e,t)=>{i.translate(e/2,t/2+30),i.strokeStyle="#4f8a2b",i.lineWidth=7,i.lineCap="round";let n=[];for(let r=0;r<7;r++){let o=-Math.PI/2+(r-3)*.32,a=95+r%3*18,l=Math.cos(o)*a,c=Math.sin(o)*a;i.beginPath(),i.moveTo(0,110),i.quadraticCurveTo(l*.3,20,l,c),i.stroke(),n.push([l,c])}let s=(r,o,a,l)=>{i.save(),i.translate(r,o),i.rotate(l),i.beginPath();for(let c=0;c<=12;c++){let h=c/12*Math.PI*2,u=a*(c%2?.62:1);i.lineTo(Math.cos(h)*u,Math.sin(h)*u*.9)}i.closePath(),i.fillStyle="#3f9b2f",i.fill(),i.strokeStyle="#215c18",i.lineWidth=4,i.stroke(),i.restore()};n.forEach(([r,o],a)=>{s(r,o,34,a),s(r*.7+18,o*.7,22,a+1)}),i.fillStyle="#c62828",Ft(i,-46,82,92,34,8),i.fill(),i.fillStyle="#fff",i.font="bold 20px Arial, sans-serif",i.textAlign="center",i.fillText("KORIANDER",0,106)})}function hb(){return td(256,256,(i,e,t)=>{i.translate(e/2,t/2),i.beginPath(),i.moveTo(18,-110),i.lineTo(-62,14),i.lineTo(-8,14),i.lineTo(-24,110),i.lineTo(62,-22),i.lineTo(8,-22),i.closePath(),i.fillStyle="#eaffef",i.shadowColor="#4dff9a",i.shadowBlur=24,i.fill(),i.shadowBlur=0,i.lineWidth=6,i.strokeStyle="#1faa5a",i.stroke()})}var Vl=class{constructor(e){this.group=new we,this.group.name="Pickups",e.add(this.group),this.items=[],this.pool={charge:[],banana:[],koriander:[]};let t=ul();this.mats={ring:ae.basic({color:new ke(.25,2.2,.9),toneMapped:!0}),bolt:ae.basic({map:hb(),transparent:!0,depthWrite:!1,side:ft}),bottle:ae.basic({map:lb(),transparent:!0,alphaTest:.05,side:ft}),koriander:ae.basic({map:cb(),transparent:!0,alphaTest:.05,side:ft}),glowG:ae.basic({map:t,color:5635993,transparent:!0,depthWrite:!1,blending:os,opacity:.8}),glowY:ae.basic({map:t,color:16765773,transparent:!0,depthWrite:!1,blending:os,opacity:.6}),glowR:ae.basic({map:t,color:16736320,transparent:!0,depthWrite:!1,blending:os,opacity:.35})},this.geo={ring:new Un(.95,.09,10,40),plane:new $e(1,1)}}make(e){let t=new we,n=this.mats;if(e==="charge"){let s=new D(this.geo.ring,n.ring);s.position.y=1.15;let r=new D(this.geo.plane,n.bolt);r.scale.setScalar(1.1),r.position.y=1.15;let o=new D(this.geo.plane,n.glowG);o.scale.setScalar(3.2),o.position.y=1.15,t.add(o,s,r),t.userData.spin=s,t.userData.face=[r,o]}else if(e==="banana"){let s=new D(this.geo.plane,n.bottle);s.scale.set(.95,1.42,1),s.position.y=.95;let r=new D(this.geo.plane,n.glowY);r.scale.setScalar(2.6),r.position.y=.95,t.add(r,s),t.userData.face=[s,r]}else{let s=new D(this.geo.plane,n.koriander);s.scale.setScalar(1.35),s.position.y=.85;let r=new D(this.geo.plane,n.glowR);r.scale.setScalar(2.4),r.position.y=.85,t.add(r,s),t.userData.face=[s,r]}return this.group.add(t),t}spawn(e,t,n){let s=this.pool[e],r=s.find(a=>!a.userData.inUse);r||(r=this.make(e),s.push(r)),r.userData.inUse=!0,r.visible=!0,r.scale.setScalar(1);let o={type:e,s:t,x:Ue.laneCenter(n),lane:n,obj:r,taken:!1,fade:0,phase:Math.random()*6};return this.items.push(o),o}spawnAhead(e,t,n,s=650){let r=t+s+Me(0,120),o=[0,1,2,3].filter(a=>n.laneFree(a,r,26));return o.length?this.spawn(e,r,je(o)):null}reset(){for(let e of this.items)e.obj.visible=!1,e.obj.userData.inUse=!1;this.items=[]}update(e,t,n,s,r=!0){let o=[],a=[];for(let l of this.items){let c=l.s-n.s;if(c<-30||l.taken&&l.fade>.4){l.obj.visible=!1,l.obj.userData.inUse=!1;continue}a.push(l);let h=l.obj;h.position.set(l.x,Math.sin(t*2.2+l.phase)*.08,-c),h.userData.spin&&(h.userData.spin.rotation.y=t*1.8+l.phase);let u=Math.atan2(s.position.x-l.x,s.position.z+c);for(let d of h.userData.face)d.rotation.y=u;l.taken?(l.fade+=e,h.scale.setScalar(1+l.fade*3),h.position.y+=l.fade*4):r&&Math.abs(c)<2.7&&Math.abs(l.x-n.x)<1.55&&(l.taken=!0,o.push(l))}return this.items=a,o}};function _e(i,e,t,n){let s=document.createElement(i);return e&&(s.className=e),n!==void 0&&(s.textContent=n),t&&t.appendChild(s),s}var ub={rosen:"\u{1F339}",pommes:"\u{1F35F}",burger:"\u{1F354}",candy:"\u{1F36C}",chips:"\u{1F954}",kuerbis:"\u{1F383}"},Wl=class{constructor(e){this.root=e,this.hud=_e("div","hud hidden",e),this.hud.id="hud";let t=_e("div","hud-info",this.hud);this.infoEl=t;let n=_e("div","live-row",t);this.liveBadge=_e("span","live-badge",n,"\u25CF LIVE"),this.viewersEl=_e("span","viewers",n,"\u{1F441} 0"),this.timeEl=_e("span","streamtime",n,"0:00");let s=_e("div","stat-rows",t),r=(u,d)=>{let f=_e("div","stat",s);_e("span","stat-icon",f,u);let m=_e("span","stat-val",f,"");return d&&_e("span","stat-label",f,d),m};this.distEl=r("\u{1F4CF}",""),this.recordEl=_e("span","stat-sub",this.distEl.parentNode,""),this.speedEl=r("\u{1F697}",""),this.moneyRow=r("\u{1F4B6}","Guthaben");let o=this.moneyRow.parentNode;this.moneySlot=_e("span","money-slot",o),this.moneySlot.appendChild(o.querySelector(".stat-label")),this.moneyPops=_e("span","money-pops",this.moneySlot),this.batteryEl=r("\u{1F50B}",""),this.batteryBar=_e("span","battery-bar",this.batteryEl.parentNode),this.batteryFill=_e("span","battery-fill",this.batteryBar),this.damageEl=r("\u{1F9F8}",""),this.jobsEl=_e("div","jobs-mini",t),this.zulageEl=_e("div","zulage hidden",t,"\u{1F327}\uFE0F Regenzulage \xD71,5"),this.leftLaneEl=_e("div","leftlane hidden",this.hud),this.leftLaneText=_e("div","leftlane-text",this.leftLaneEl,"");let a=_e("div","leftlane-bar",this.leftLaneEl);this.leftLaneFill=_e("div","leftlane-fill",a),this.naviEl=_e("div","navi-line",this.hud,"");let l=_e("div","center-stack",this.hud);this.nomiEl=_e("div","nomi-sub hidden",l);let c=_e("span","nomi-eyes",this.nomiEl);_e("i","",c),_e("i","",c),this.nomiText=_e("span","nomi-text",this.nomiEl,""),this.bannerEl=_e("div","banner hidden",l,""),this.toastsEl=_e("div","toasts",l),this.chatEl=_e("div","chat",this.hud);let h=_e("div","chat-head",this.chatEl);if(_e("span","",h,"Live-Chat"),this.chatCount=_e("span","chat-count",h,""),this.chatList=_e("div","chat-list",this.chatEl),this.durchsageEl=_e("div","durchsage hidden",this.hud),this.funklochEl=_e("div","funkloch hidden",this.hud),_e("div","funkloch-icon",this.funklochEl,"\u{1F4E1}"),_e("div","funkloch-text",this.funklochEl,"Verbindung verloren \u2013 Telekom, Vodafone und O\u2082 werden neu geb\xFCndelt \u2026"),this.photoEl=_e("div","photo hidden",this.hud),this.rahmenEl=_e("div","rahmen-layer",this.hud),this.cameraHint=_e("div","camera-hint hidden",this.hud,""),this.chatOn=!0,this.lastHud=0,this.toasts=[],this.bannerT=0,this.nomiT=0,this.durchsageT=0,this.photoT=0,this.rahmenList=[],this.photos=[],this.moneyShown=0,typeof ResizeObserver<"u"){let u=new ResizeObserver(()=>this.layout());u.observe(t),u.observe(this.chatEl)}window.addEventListener("resize",()=>this.layout())}layout(){let e=this.infoEl.getBoundingClientRect();if(!e.width)return;let t=window.innerWidth,n=this.chatOn&&this.chatEl.getBoundingClientRect(),s=Math.max(e.right,n&&n.width?t-n.left:0)+14,r=t-2*s,o=14,a=r<240;if(a){let c=n&&n.width?n.top+(parseFloat(getComputedStyle(this.chatEl).maxHeight)||n.height):0;o=Math.max(e.bottom,c)+10,r=t-28}let l=this.hud.style;l.setProperty("--mid",Math.round(r)+"px"),l.setProperty("--top",Math.round(o)+"px"),this.hud.classList.toggle("hud-narrow",a)}show(e){this.hud.classList.toggle("hidden",!e)}setChat(e){this.chatOn=e,this.chatEl.classList.toggle("hidden",!e),this.layout()}reset(){this.chatList.textContent="",this.toastsEl.textContent="",this.rahmenEl.textContent="",this.clearMoneyPop(),this.toasts=[],this.rahmenList=[],this.photos=[],this.bannerEl.classList.add("hidden"),this.nomiEl.classList.add("hidden"),this.durchsageEl.classList.add("hidden"),this.photoEl.classList.add("hidden"),this.funkloch(!1),this.bannerT=this.nomiT=this.durchsageT=this.photoT=0}chat({name:e,text:t,bot:n,icon:s}){let r=_e("div","msg"+(n?" bot bot-"+n:""),this.chatList);if(n){_e("span","bot-icon",r,s||Ul[n]?.icon||"\u{1F916}");let o=_e("span","name",r,e);o.style.color="#ffd76a",r.append(" "),_e("span","bot-tag",r,"BOT")}else{let o=_e("span","name",r,e);o.style.color=r0(e)}for(r.append(" "),_e("span","text",r,t);this.chatList.childElementCount>36;)this.chatList.firstElementChild.remove();this.chatList.scrollTop=this.chatList.scrollHeight}toast(e,t="info",n=""){let s=_e("div","toast toast-"+t,this.toastsEl,e);for(n&&_e("div","toast-sub",s,n),this.toasts.push({el:s,t:n?5:3.6});this.toasts.length>4;)this.toasts.shift().el.remove()}banner(e,t=3,n=""){this.bannerEl.textContent=e,n&&_e("div","banner-sub",this.bannerEl,n),this.bannerEl.classList.remove("hidden"),this.bannerEl.classList.remove("pop"),this.bannerEl.offsetWidth,this.bannerEl.classList.add("pop"),this.bannerT=t}nomi(e,t=3){this.nomiText.textContent=e,this.nomiEl.classList.remove("hidden"),this.nomiT=Math.max(2.2,t)}money(e,t){this.moneyPops.textContent="";let n=_e("span","money-pop "+(e>=0?"plus":"minus"),this.moneyPops,(e>=0?"+":"\u2212")+qt(Math.abs(e)));t&&(_e("small","",n,t),n.offsetWidth>this.moneySlot.clientWidth&&n.lastChild.remove()),this.moneySlot.classList.add("popping"),clearTimeout(this.moneyTimer),this.moneyTimer=setTimeout(()=>this.clearMoneyPop(),1900)}clearMoneyPop(){clearTimeout(this.moneyTimer),this.moneyPops.textContent="",this.moneySlot.classList.remove("popping")}durchsage(e,t,n,s){this.durchsageEl.textContent="";let r=_e("div","durchsage-head",this.durchsageEl,`\u{1F399}\uFE0F Sprachdurchsage von ${s} \xB7 Stimme: ${e}`);r.title=e,_e("div","durchsage-text",this.durchsageEl,"\xBB"+t+"\xAB"),this.durchsageEl.classList.remove("hidden"),this.durchsageT=Ze(n,3,14)}funkloch(e){this.funklochEl.classList.toggle("hidden",!e),this.liveBadge.classList.toggle("offline",e),this.liveBadge.textContent=e?"\u25CF OFFLINE":"\u25CF LIVE"}damage(e,t){this.damageEl.parentNode.classList.remove("shake"),this.damageEl.offsetWidth,this.damageEl.parentNode.classList.add("shake")}jobs(e){this.jobsEl.textContent="",_e("span","jobs-title",this.jobsEl,"You had 5 Jobs");for(let t of e){let n=_e("div","job"+(t.done?" done":""),this.jobsEl);if(_e("span","job-box",n,t.done?"\u2714":""),_e("span","job-text",n,t.text),!t.done&&t.progress>0){let s=_e("span","job-bar",n);_e("span","job-fill",s).style.width=Math.round(t.progress*100)+"%"}}}rahmen(e,t){let n=_e("div","rahmen rahmen-"+e.id,this.rahmenEl),s=_e("div","rahmen-caption",n,`${e.name} \xB7 ${qt(e.price)} von ${t}`);s.title=e.name;let r=ub[e.id];if(r){for(let a of["top","bottom","left","right"]){let l=_e("div","strip strip-"+a,n);for(let c=0;c<22;c++)_e("span","",l,r)}e.id==="kuerbis"&&n.classList.add("corner-only")}else if(e.id==="pappkarton"){let o=_e("div","boxes",n);for(let a=0;a<26;a++){let l=_e("span","box",o,"");l.style.left=a%13*7.8+(a>=13?3.5:0)+"%",l.style.bottom=(a>=13?11:0)+Math.random()*2+"%",l.style.transform=`rotate(${(Math.random()-.5)*16}deg)`,l.style.animationDelay=(a*.05).toFixed(2)+"s"}}else if(e.id==="haelfte"){let o=Math.random()<.5?"left":"right";_e("div","half half-"+o,n,"Bildh\xE4lfte abgedeckt")}else if(e.id==="elsa")_e("div","elsa-fly",n,"");else if(e.id==="lego")for(let o of["top","bottom","left","right"]){let a=_e("div","strip lego strip-"+o,n);for(let l=0;l<18;l++)_e("span","brick b"+l%4,a,"")}else if(e.id==="briefmarken")_e("div","stamp-frame",n,"");else if(e.id==="keinerechte")for(let o of["top","bottom","left","right"]){let a=_e("div","strip norights strip-"+o,n),l=o==="top"||o==="bottom"?6:3;for(let c=0;c<l;c++)_e("span","",a,"\xA9 Keine Rechte")}else if(e.id==="rettich")for(let o of["top","bottom","left","right"]){let a=_e("div","strip strip-"+o,n);for(let l=0;l<16;l++)_e("span","rettich",a,"")}this.rahmenList.push({el:n,t:e.dur})}photo(e,t,n){if(this.photoEl.textContent="",e){let s=_e("img","",this.photoEl);s.src=e,s.alt="Blitzerfoto",this.photos.push({url:e,kmh:t,clock:n})}_e("div","photo-cap",this.photoEl,`\u{1F4F8} ${t} km/h \xB7 ${n} Uhr`),_e("div","photo-sub",this.photoEl,"Das Foto kommt in einen Rahmen."),this.photoEl.classList.remove("hidden"),this.photoT=6}cameraLabel(e){this.cameraHint.textContent=e,this.cameraHint.classList.remove("hidden"),clearTimeout(this.camTimer),this.camTimer=setTimeout(()=>this.cameraHint.classList.add("hidden"),1600)}update(e,t){for(let c of this.toasts)c.t-=e;for(;this.toasts.length&&this.toasts[0].t<=0;)this.toasts.shift().el.remove();this.bannerT>0&&(this.bannerT-=e,this.bannerT<=0&&this.bannerEl.classList.add("hidden")),this.nomiT>0&&(this.nomiT-=e,this.nomiT<=0&&this.nomiEl.classList.add("hidden")),this.durchsageT>0&&(this.durchsageT-=e,this.durchsageT<=0&&this.durchsageEl.classList.add("hidden")),this.photoT>0&&(this.photoT-=e,this.photoT<=0&&this.photoEl.classList.add("hidden"));for(let c of this.rahmenList)c.t-=e,c.t<.6&&c.el.classList.add("out"),c.t<=0&&c.el.remove();if(this.rahmenList=this.rahmenList.filter(c=>c.t>0),this.lastHud-=e,this.lastHud>0||!t)return;this.lastHud=.1;let n=t.player;this.viewersEl.textContent="\u{1F441} "+rn(Math.round(t.viewers)),this.timeEl.textContent=Io(t.t),this.distEl.textContent=yi(n.s);let s=t.save.best.distance||0;this.recordEl.textContent=n.s>s&&s>0?"\u{1F3C6} neuer Rekord!":s>0?"Rekord "+yi(s):"",this.recordEl.classList.toggle("record",n.s>s&&s>0),this.speedEl.textContent=Math.round(n.kmh)+" km/h",this.moneyRow.textContent=qt(t.money),this.batteryEl.textContent=Math.round(n.battery)+" %",this.batteryFill.style.width=Ze(n.battery,0,100)+"%",this.batteryFill.className="battery-fill"+(n.battery<15?" low":n.battery<30?" mid":"");let r=Math.max(0,n.maxHits-n.hits);this.damageEl.textContent="\u2665".repeat(r)+"\u2661".repeat(Math.max(0,n.maxHits-r)),this.damageEl.title="Karosserie-Punkte",this.zulageEl.classList.toggle("hidden",!t.weather.regenzulage);let o=t.left;if(this.leftLaneEl.classList.toggle("hidden",!o.open),this.hud.classList.toggle("lane-on",o.open),o.open){let c=n.inLeftLane;this.leftLaneText.textContent=(c?"\u2B05\uFE0F Linke Spur: Bonus l\xE4uft! ":"\u2B05\uFE0F Linke Spur frei! ")+Math.ceil(o.timer)+" s",this.leftLaneEl.classList.toggle("active",c),this.leftLaneEl.classList.toggle("warn",o.timer<10),this.leftLaneFill.style.width=Ze(o.timer/60,0,1)*100+"%"}let a=t.navi,l=Math.max(0,a.targetS-n.s);this.naviEl.textContent=a.arrived?"\u{1F4CD} Ziel erreicht \u2013 warte auf das n\xE4chste Gebot \u2026":`\u{1F4CD} ${a.target.name} \xB7 ${yi(l,l<1e4?1:0)} \xB7 Gebot ${qt(a.bid)} von ${a.bidder}`,this.chatCount.textContent=rn(Math.round(t.viewers))+" Zuschauer"}};function ee(i,e,t,n){let s=document.createElement(i);return e&&(s.className=e),n!==void 0&&(s.textContent=n),t&&t.appendChild(s),s}function jt(i,e,t,n=""){let s=ee("button","btn "+n,i,e);return s.type="button",s.dataset.action=t,s}var v0={akku:{title:"Akku leer",sub:"Die Stream-Technik im Kofferraum hat den letzten Strom bekommen."},werkstatt:{title:"Ab in die Werkstatt",sub:"Zu viele Rempler \u2013 der Tesla braucht eine kleine Pause. Mini Adam winkt trotzdem in die Kamera."},quit:{title:"Stream beendet",sub:"Mini Adam hat den Stream vorzeitig beendet."}},x0=["Linke Spur","Navi-Ziele","Spenden","Jobs","Bananensaft","Haarscharf","BrunnenTV","Elsa-Gru\xDF","Vorbildlich","Bu\xDFgeld","Verwarngeld","Koriander"],Xl=class{constructor(e,t){this.root=ee("div","screens",e),this.h=t,this.screens={},this.current=null,this.stack=[];for(let n of["title","pause","over","shop","about","controls","settings"]){let s=ee("section","screen screen-"+n+" hidden",this.root);this.screens[n]=s}this.root.addEventListener("click",n=>{let s=n.target.closest("[data-action]");!s||s.disabled||(this.h.click?.(),this.action(s.dataset.action,s))}),window.addEventListener("keydown",n=>this.onKey(n))}get open(){return!!this.current}show(e,t){this.current&&this.current!==e&&this.screens[this.current].classList.add("hidden"),this.current=e,this.data=t;let n=this.screens[e];this["render_"+e](n,t),n.classList.remove("hidden"),this.root.classList.add("active"),this.root.classList.toggle("dim",e!=="title"),requestAnimationFrame(()=>{(n.querySelector(".btn.primary:not([disabled])")||n.querySelector(".btn:not([disabled])"))?.focus({preventScroll:!0})})}push(e,t){this.current&&this.stack.push({name:this.current,data:this.data}),this.show(e,t)}back(){let e=this.stack.pop();e?this.show(e.name,e.name==="title"||e.name==="pause"||e.name==="over"?this.refreshData(e):e.data):this.h.back?.(this.current)}refresh(e){if(this.current!==e)return;let t=this.screens[e],n=document.activeElement,s=n&&t.contains(n)&&n.dataset?n.dataset.key?`[data-key="${n.dataset.key}"]`:n.dataset.value?`[data-value="${n.dataset.value}"]`:null:null,r=t.querySelector(".card")?.scrollTop||0;this["render_"+e](t,this.h.dataFor?this.h.dataFor(e,this.data):this.data);let o=t.querySelector(".card");o&&(o.style.animation="none",o.scrollTop=r),s&&t.querySelector(s)?.focus({preventScroll:!0})}refreshData(e){return this.h.dataFor?this.h.dataFor(e.name,e.data):e.data}hide(){this.current&&this.screens[this.current].classList.add("hidden"),this.current=null,this.stack=[],this.root.classList.remove("active","dim")}action(e,t){switch(e){case"back":this.back();break;case"shop":case"about":case"controls":case"settings":this.push(e,this.h.dataFor?this.h.dataFor(e):null);break;case"buy":{let n=t.dataset.id;if(this.h.buy(n)){let s=this.screens.shop.querySelector(".card")?.scrollTop||0;this.render_shop(this.screens.shop,this.h.dataFor("shop"));let r=this.screens.shop.querySelector(".card");r&&(r.style.animation="none",r.scrollTop=s);let o=this.screens.shop.querySelector(`[data-id="${n}"]`),a=o&&!o.disabled?o:this.screens.shop.querySelector(".btn.back");a?.focus({preventScroll:!0}),a?.scrollIntoView({block:"nearest"})}break}case"toggle":{this.h.setting(t.dataset.key,t.dataset.on!=="1"),this.render_settings(this.screens.settings,this.h.dataFor("settings")),this.screens.settings.querySelector(`[data-key="${t.dataset.key}"]`)?.focus({preventScroll:!0});break}case"quality":this.h.setting("quality",t.dataset.value),this.render_settings(this.screens.settings,this.h.dataFor("settings")),this.screens.settings.querySelector(`[data-value="${t.dataset.value}"]`)?.focus({preventScroll:!0});break;case"reset":t.dataset.confirm==="1"?(this.h.resetSave(),this.render_settings(this.screens.settings,this.h.dataFor("settings"))):(t.dataset.confirm="1",t.textContent="Wirklich alles l\xF6schen? Nochmal klicken",t.classList.add("danger"));break;default:this.h.action?.(e,t)}}onKey(e){if(!this.current||e.target&&/input/i.test(e.target.tagName)&&e.target.type!=="range"&&e.code!=="Escape")return;let t=this.screens[this.current],n=[...t.querySelectorAll(".btn:not([disabled]), input[type=range]")],s=n.indexOf(document.activeElement);if(e.code==="ArrowDown"||e.code==="ArrowRight"||e.code==="KeyS"||e.code==="KeyD"){if(e.target.type==="range"&&(e.code==="ArrowRight"||e.code==="KeyD"))return;e.preventDefault(),n[(s+1+n.length)%n.length]?.focus()}else if(e.code==="ArrowUp"||e.code==="ArrowLeft"||e.code==="KeyW"||e.code==="KeyA"){if(e.target.type==="range"&&(e.code==="ArrowLeft"||e.code==="KeyA"))return;e.preventDefault(),n[(s-1+n.length)%n.length]?.focus()}else if(e.code==="Escape"||e.code==="Backspace"||e.code==="KeyP"&&this.current==="pause")e.preventDefault(),this.current==="pause"?this.h.action("resume"):this.current!=="title"&&this.current!=="over"&&this.back();else if(e.code==="Enter"||e.code==="Space"){if(document.activeElement&&n.includes(document.activeElement))return;e.preventDefault(),(t.querySelector(".btn.primary:not([disabled])")||n[0])?.click()}}pad(e,t,n){if(!this.current)return;let r=[...this.screens[this.current].querySelectorAll(".btn:not([disabled])")],o=r.indexOf(document.activeElement);e&&r[(o+e+r.length)%r.length]?.focus(),t&&(document.activeElement&&r.includes(document.activeElement)?document.activeElement:r[0])?.click(),n&&(this.current==="pause"?this.h.action("resume"):this.current!=="title"&&this.current!=="over"&&this.back())}render_title(e,t){e.textContent="";let n=ee("div","title-card",e),s=ee("div","title-logo",n);ee("span","title-live",s,"\u25CF LIVE"),ee("h1","",n,t0),ee("h2","",n,n0),ee("p","tagline",n,i0);let r=ee("div","menu",n);jt(r,"\u25B6  Losfahren","start","primary"),jt(r,"\u{1F6D2}  Tesla-Shop","shop"),jt(r,"\u{1F3AE}  Steuerung","controls"),jt(r,"\u2699\uFE0F  Einstellungen","settings"),jt(r,"\u2139\uFE0F  \xDCber das Spiel","about");let o=ee("div","title-stats",n);ee("span","",o,"\u{1F4B6} "+qt(t.wallet)+" Guthaben"),ee("span","",o,"\u{1F3C6} Rekord "+yi(t.best.distance||0)),ee("span","",o,"\u{1F6E3}\uFE0F "+yi((t.stats.totalKm||0)*1e3,1)+" gesamt"),ee("div","title-hint",e,"Enter: Losfahren \xB7 Pfeiltasten oder WASD: fahren \xB7 Esc: Pause")}render_pause(e,t){e.textContent="";let n=ee("div","card pause-card",e);ee("h2","",n,"\u23F8 Pause"),ee("p","sub",n,"Kappandram\xE4\xDFige Zusammenfassung f\xFCr alle, die gerade erst reingekommen sind:");let s=ee("div","summary-grid",n),r=(l,c)=>{let h=ee("div","sum",s);ee("span","k",h,l),ee("span","v",h,c)};r("Strecke",yi(t.player.s)),r("Guthaben dieser Fahrt",qt(t.money)),r("Navi-Ziel",t.navi.target.name),r("Navi-\xC4nderungen",rn(t.stats.naviChanges)),r("Zuschauer",rn(Math.round(t.viewers))),r("Sendezeit",Io(t.t));let o=ee("div","job-list",n);ee("h3","",o,"You had 5 Jobs");for(let l of t.jobs){let c=ee("div","job"+(l.done?" done":""),o);ee("span","job-box",c,l.done?"\u2714":""),ee("span","",c,l.text)}let a=ee("div","menu row",n);jt(a,"\u25B6 Weiterfahren","resume","primary"),jt(a,"\u21BB Neustart","restart"),jt(a,"\u2699\uFE0F Einstellungen","settings"),jt(a,"\u23F9 Stream beenden","quit")}render_over(e,t){e.textContent="";let n=ee("div","card over-card",e),s=v0[t.reason]||v0.quit;ee("div","abspann-tag",n,"ABSPANN"),ee("h2","",n,s.title),ee("p","sub",n,s.sub);let r=ee("div","over-big",n),o=ee("div","over-dist",r);ee("span","num",o,yi(t.distance)),ee("span","lbl",o,t.newRecord?"\u{1F3C6} Neuer Rekord!":"Rekord: "+yi(t.best));let a=ee("div","over-money",r);ee("span","num",a,"+"+qt(t.money)),ee("span","lbl",a,"Guthaben \xB7 jetzt "+qt(t.wallet));let l=ee("div","menu row over-menu",n);jt(l,"\u21BB Nochmal fahren","restart","primary"),jt(l,"\u{1F6D2} Tesla-Shop","shop"),jt(l,"\u{1F3E0} Hauptmen\xFC","menu");let c=ee("div","over-cols",n),h=ee("div","over-col",c);ee("h3","",h,"Abrechnung");let u=Object.keys(t.breakdown).sort((p,y)=>{let _=x0.indexOf(p),x=x0.indexOf(y);return(_<0?99:_)-(x<0?99:x)});for(let p of u){let y=t.breakdown[p];if(Math.abs(y)<.005)continue;let _=ee("div","bd"+(y<0?" minus":""),h);ee("span","",_,p),ee("span","",_,(y<0?"\u2212":"+")+qt(Math.abs(y)))}ee("h3","",h,"You had 5 Jobs");for(let p of t.jobs){let y=ee("div","job"+(p.done?" done":""),h);ee("span","job-box",y,p.done?"\u2714":""),ee("span","",y,p.text)}let d=ee("div","over-col",c);ee("h3","",d,"Statistik");let f=t.stats,m=(p,y)=>{let _=ee("div","bd",d);ee("span","",_,p),ee("span","",_,y)};m("Navi-Ziele erreicht",rn(f.naviReached)),m("Navi-\xC4nderungen",rn(f.naviChanges)),m("Haarscharf \xFCberholt",rn(f.nearMisses)),m("Rempler",rn(f.crashes)),m("H\xF6chstgeschwindigkeit",rn(Math.round(f.maxSpeedKmh))+" km/h"),m("Zuschauer-Spitze",rn(t.peakViewers)),m("Wischer: gezuckt / gewischt",rn(f.twitches)+" / "+rn(f.wipes)),m("Sendezeit",Io(t.time)+" (bis "+t.clock+" Uhr)");let v=ee("div","beruf",d);if(ee("div","beruf-k",v,"Erlogene Berufsbezeichnung des Tages"),ee("div","beruf-v",v,"Mini Adam, "+t.beruf.job),ee("div","beruf-src",v,"(aus dem Stream vom "+t.beruf.src+")"),t.photos&&t.photos.length){ee("h3","",d,"Blitzerfotos");let p=ee("div","over-photos",d);for(let y of t.photos.slice(-3)){let _=ee("figure","",p),x=ee("img","",_);x.src=y.url,x.alt="Blitzerfoto",ee("figcaption","",_,y.kmh+" km/h")}}let g=ee("div","crew",n);for(let[p,y]of d0){let _=ee("div","crew-row",g);ee("span","k",_,p),ee("span","v",_,y)}}render_shop(e,t){e.textContent="";let n=ee("div","card shop-card",e),s=ee("div","shop-head",n);ee("h2","",s,"\u{1F6D2} Tesla-Shop"),ee("div","wallet",s,"\u{1F4B6} "+qt(t.wallet)),ee("p","sub",n,"Upgrades f\xFCr den schwarzen Model 3 Long Range AWD. Bezahlt wird mit Bonusguthaben aus dem Live-Bereich.");let r=ee("div","shop-grid",n);for(let a of Fo){let l=t.upgrades[a.id]||0,c=Nl[a.id],h=ee("div","shop-item"+(l>=c?" maxed":""),r),u=ee("div","shop-top",h);ee("span","shop-icon",u,a.icon);let d=ee("div","shop-title",u);ee("div","shop-name",d,a.name),ee("div","shop-cat",d,a.cat);let f=ee("div","pips",h);for(let v=0;v<c;v++)ee("span","pip"+(v<l?" on":""),f);ee("p","shop-desc",h,a.desc);let m=ee("div","shop-eff",h);if(l>0&&ee("div","now",m,"Aktuell: "+a.effect(l)),l<c&&ee("div","next",m,(l>0?"N\xE4chste Stufe: ":"Bringt: ")+a.effect(l+1)),l<c){let v=a.prices[l],g=t.wallet>=v,p=jt(h,g?"Kaufen \xB7 "+Uu(v):Uu(v)+" \xB7 fehlt noch "+qt(v-t.wallet),"buy",g?"buy":"buy poor");p.dataset.id=a.id,g||(p.disabled=!0)}else ee("div","maxed-tag",h,"Ausgebaut \u2714")}let o=ee("div","menu row",n);jt(o,"\u2190 Zur\xFCck","back","back primary")}render_controls(e){e.textContent="";let t=ee("div","card",e);ee("h2","",t,"\u{1F3AE} Steuerung");let n=ee("div","controls-grid",t),s=[["Lenken","\u2190 \u2192 oder A D","Linker Stick","\u25C0 \u25B6"],["Strom geben","\u2191 oder W","RT oder Steuerkreuz \u2191","Strom"],["Bremsen","\u2193 oder S","LT oder Steuerkreuz \u2193","Bremse"],["Hupen (Brunnen & Elsa gr\xFC\xDFen)","Leertaste","A","\u{1F4EF}"],["Scheibenwischer von Hand","E","X","\u{1F327}\uFE0F"],["Megafon (aus dem Shop)","H","Y","\u{1F4E2}"],["Kamera (Cockpit / Drohne)","V","B","\u{1F3A5}"],["Chat ein/aus","C","\u2013","\u2013"],["Ton aus","M","\u2013","\u2013"],["Pause","Esc oder P","Start","\u23F8"]],r=ee("div","crow head",n);for(let l of["Aktion","Tastatur","Gamepad","Touch"])ee("span","",r,l);for(let l of s){let c=ee("div","crow",n);for(let h of l)ee("span","",c,h)}let o=ee("div","tips",t);ee("h3","",o,"Tipps");for(let l of["Wenn NOMI sagt \u201EDie linke Fahrspur ist freigeschaltet.\u201C, gibt es auf der ganz linken Spur Bonusguthaben \u2013 eine Minute lang.","Danach gilt wieder das Rechtsfahrgebot. Sonst kommt die Polizei Gifhorn.","Das Navi-Ziel \xE4ndert sich st\xE4ndig \u2013 jeder neue Zuschauer bietet einen Cent mehr. Erreichte Ziele bringen Guthaben.","Lade-Ringe f\xFCllen den Akku. Bananensaft ist super, Koriander leider nicht.","Wer gut f\xE4hrt, bekommt Regen \u2013 mit Regenzulage. Der automatische Wischer ist allerdings noch in der Beta."])ee("p","",o,"\u2022 "+l);let a=ee("div","menu row",t);jt(a,"\u2190 Zur\xFCck","back","primary")}render_settings(e,t){e.textContent="";let n=ee("div","card settings-card",e);ee("h2","",n,"\u2699\uFE0F Einstellungen");let s=ee("div","settings-list",n),r=(d,f,m)=>{let v=ee("div","set-row",s);ee("span","",v,f);let g=jt(v,m?"An":"Aus","toggle",m?"on":"off");g.dataset.key=d,g.dataset.on=m?"1":"0"};r("sound","Ger\xE4usche",t.sound),r("speech","Sprachausgabe (NOMI und Sprachdurchsagen)",t.speech),r("chat","Live-Chat anzeigen",t.chat);let o=ee("div","set-row",s);ee("span","",o,"Lautst\xE4rke");let a=ee("input","range",o);a.type="range",a.min="0",a.max="1",a.step="0.05",a.value=String(t.volume),a.addEventListener("input",()=>this.h.setting("volume",parseFloat(a.value)));let l=ee("div","set-row",s);ee("span","",l,"Grafik");let c=ee("div","seg",l);for(let[d,f]of[["auto","Automatisch"],["hoch","Hoch"],["mittel","Mittel"],["niedrig","Niedrig"]]){let m=jt(c,f,"quality",t.quality===d?"on":"off");m.dataset.value=d}t.speechSupported||ee("p","note",n,"Hinweis: Dieser Browser hat keine deutsche Sprachausgabe \u2013 NOMI spricht dann nur per Untertitel.");let h=ee("div","set-row",s);ee("span","",h,"Spielstand"),jt(h,"Spielstand zur\xFCcksetzen","reset","off");let u=ee("div","menu row",n);jt(u,"\u2190 Zur\xFCck","back","primary")}render_about(e){e.textContent="";let t=ee("div","card about-card",e);ee("h2","",t,"\u2139\uFE0F \xDCber das Spiel");let n=a=>ee("p","",t,a);n("\u201EMini Adam \u2013 Tesla-Navi ferngesteuert\u201C ist ein liebevolles, nicht-kommerzielles Fan-Spiel rund um SkylineTV LIVE. Mini Adam \u2013 der Pl\xFCsch-Adam mit Kappe, Bart und LIVE-Shirt \u2013 f\xE4hrt den schwarzen Tesla Model 3 Long Range AWD mit 75-kWh-Akku \xFCber die Autobahn, w\xE4hrend der Chat das Navi fernsteuert."),n("Fast alle Witze stammen aus dem SkylineTV LIVE Wiki: die freigeschaltete linke Spur, das Navi-Bieten mit einem Cent mehr, BrunnenTV mit Herrn Sch\xF6nnbrun, Elsa, die Polizei Gifhorn, Meister Propper (kommt gleich), Malte, die Sparkassen-Farbe, Rahmen aus dem Live-Bereich, Sprachdurchsagen von Fr\xE4ulein Kassandra und Br\xFCll-William, Bananensaft statt Koriander, \u201EYou had 5 Jobs\u201C und die erlogenen Berufsbezeichnungen im Abspann."),n("NOMI ist der Boardcomputer auf dem Armaturenbrett. Alle Grafiken, Ger\xE4usche und Stimmen entstehen direkt im Browser \u2013 ohne Bilder- oder Tondateien.");let s=ee("a","link",t,"SkylineTV LIVE Wiki \xF6ffnen");s.href="https://skylinetv.live/wiki/index.php?title=Hauptseite",s.target="_blank",s.rel="noopener";let r=ee("div","tribute",t);ee("span","heart",r,"\u{1F5A4}"),ee("span","",r,"In Erinnerung an Adam Wolke \u2013 danke f\xFCr die Live-Eskalationen.");let o=ee("div","menu row",t);jt(o,"\u2190 Zur\xFCck","back","primary")}};var Oo={hoch:{pr:1.5,msaa:4,shadows:!0,shadowSize:2048,mirrorEvery:1},mittel:{pr:1,msaa:4,shadows:!0,shadowSize:1024,mirrorEvery:2},niedrig:{pr:.75,msaa:0,shadows:!1,shadowSize:1024,mirrorEvery:3}},ld=/[?&]debug/.test(location.search),ec=document.getElementById("app"),id=document.getElementById("loading"),ot=p0(),Qt=ot.settings;function w0(){let i=Qt.quality;return i==="auto"?{...Oo.hoch,pr:Math.min(window.devicePixelRatio||1,1.25),auto:!0}:{...Oo[i]||Oo.mittel,pr:Math.min(window.devicePixelRatio||1,(Oo[i]||Oo.mittel).pr)}}var un=w0(),ut;try{ut=new za({antialias:!0,powerPreference:"high-performance"})}catch(i){throw id.innerHTML='<div class="load-card"><h1>Mini Adam</h1><p>WebGL konnte nicht gestartet werden. Bitte eine aktuelle Version von Google Chrome verwenden und die Hardware-Beschleunigung einschalten.</p></div>',i}var Wi=un.pr;ut.setPixelRatio(Wi);ut.setSize(window.innerWidth,window.innerHeight);ut.toneMapping=vu;ut.toneMappingExposure=1;ut.outputColorSpace=ht;ut.shadowMap.enabled=un.shadows;ut.shadowMap.type=fu;ut.shadowMap.autoUpdate=!1;ut.domElement.id="view";ec.prepend(ut.domElement);dp(ut.capabilities.getMaxAnisotropy());var di=new vi,_t=new Kt(58,window.innerWidth/window.innerHeight,.25,3200),$r=new Kt(58,window.innerWidth/window.innerHeight,.012,20),nd=new Kt(21,.245/.072,.6,700),zo=new Kt(24,16/9,.2,900),Ms=new pl(ut,di,{shadows:un.shadows,shadowSize:un.shadowSize}),sd=new fl(di),cd=new bl(di),tc=new Dl(di),Qs=new Al(di,tc),S0=new Vl(di);zp();var wn=$p();di.add(wn.root);var kt=new Il;kt.scene.environment=Ms.envTarget.texture;Ms.onEnv=i=>{kt.scene.environment=i};var jr=new Ll,qi=new ue;function T0(){return ut.getDrawingBufferSize(qi),qi}T0();var Vo=new Xn(qi.x,qi.y,{type:cs,samples:un.msaa,depthBuffer:!0}),hd=new Xn(768,226,{type:cs,samples:4,depthBuffer:!0});kt.setMirrorTexture(hd.texture);var A0=Qp(Vo.texture,jr),R0=new vi,C0=new D(new $e(2,2),A0);C0.frustumCulled=!1;R0.add(C0);var P0=new Pr(-1,1,1,-1,0,1),Wt=A0.uniforms,I0=new vi,Go=new ue,_s=null,rd=new Xt({uniforms:{tScreen:{value:null},uCopy:{value:0},uFade:Wt.uFade,uFlash:Wt.uFlash,uFlashColor:Wt.uFlashColor,uVignette:Wt.uVignette,uGreen:Wt.uGreen,uGlitch:Wt.uGlitch,uTime:Wt.uTime},vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`
    uniform sampler2D tScreen;
    uniform float uCopy;
    uniform float uFade;
    uniform float uFlash;
    uniform vec3 uFlashColor;
    uniform float uVignette;
    uniform float uGreen;
    uniform float uGlitch;
    uniform float uTime;
    varying vec2 vUv;
    void main() {
      vec2 vc = vUv - 0.5;
      // gleiche Vignette wie im Weltbild (dort vor, hier nach der sRGB-Kodierung)
      float vig = pow(max(0.0, 1.0 - dot(vc, vc) * uVignette), 0.4545);
      float f = clamp(uFlash, 0.0, 1.0);
      float k = 1.0 - clamp(uFade, 0.0, 1.0);
      vec3 flash = min(uFlashColor * 4.0, vec3(1.0)) * f;
      if (uCopy > 0.5) {
        vec2 uv = vUv;
        if (uGlitch > 0.0) {
          float band = floor(uv.y * 30.0) + floor(uTime * 24.0);
          float r = fract(sin(band * 91.7) * 4375.85);
          uv.x += (r - 0.5) * 0.08 * uGlitch * step(0.6, r);
        }
        vec3 c = texture2D(tScreen, uv).rgb;
        float g = dot(c, vec3(0.3, 0.6, 0.1));
        c = mix(c, vec3(0.08, 1.0, 0.25) * (0.3 + g), uGreen * 0.65);
        gl_FragColor = vec4((c * vig * (1.0 - f) + flash) * k, 1.0);
      } else {
        // vormultipliziert: Bild * (1 - a) + Farbe
        gl_FragColor = vec4(flash * k, 1.0 - vig * (1.0 - f) * k);
      }
    }`,transparent:!0,depthTest:!1,depthWrite:!1,blending:pu,blendSrc:mu,blendDst:vo}),L0=new D(new $e(2,2),rd);L0.frustumCulled=!1;I0.add(L0);var db=(()=>{let i=document.createElement("canvas");i.width=512,i.height=192;let e=i.getContext("2d"),t=e.createLinearGradient(0,0,0,192);t.addColorStop(0,"#2a2c30"),t.addColorStop(1,"#141517"),e.fillStyle=t,e.fillRect(0,0,512,192),e.fillStyle="#0c0c0d",e.fillRect(0,0,512,34);let n=(r,o,a,l,c,h)=>{e.fillStyle=c,Ft(e,r,o,a,l,8),e.fill(),e.fillStyle="#e8e8e8",e.font="bold 15px Arial, sans-serif",e.textAlign="center",e.fillText(h,r+a/2,o+l/2+5)};n(24,70,120,84,"#3b3f46","Akku-Pack"),n(160,92,96,62,"#20242a","Router"),n(272,60,92,94,"#5a2a2a","KONFETTI"),n(380,84,110,70,"#1e3550","LTE \xD73"),e.strokeStyle="#d4a21a",e.lineWidth=3;for(let r=0;r<4;r++)e.beginPath(),e.moveTo(140+r*8,120),e.bezierCurveTo(180,175-r*6,330,178,380,120+r*6),e.stroke();e.fillStyle="#ff4d4d",e.font="bold 18px Arial, sans-serif",e.textAlign="left",e.fillText("\u25CF REC  Kofferraum offen",18,24);let s=new Pt(i);return s.colorSpace=ht,s.repeat.x=-1,s.offset.x=1,s})(),nc=document.createElement("canvas");nc.width=360;nc.height=270;var js=nc.getContext("2d"),dn=new kl;dn.enabled=Qt.sound;dn.volume=Qt.volume;var Es=new Bl;Es.enabled=Qt.speech;var on=new Hl,Nt=new Wl(ec);Nt.setChat(Qt.chat);var ud=document.createElement("div");ud.className="touch";for(let[i,e,t]of[["left","\u25C0","t-left"],["right","\u25B6","t-right"],["brake","Bremse","t-brake"],["gas","Strom","t-gas"],["horn","\u{1F4EF}","t-small t-horn"],["wiper","\u{1F327}\uFE0F","t-small t-wiper"],["megafon","\u{1F4E2}","t-small t-megafon"],["camera","\u{1F3A5}","t-small t-camera"],["pause","\u23F8","t-small t-pause"]]){let n=document.createElement("button");n.type="button",n.className=t,n.textContent=e,ud.appendChild(n),on.bindTouch(n,i)}ec.appendChild(ud);var Zl=null,zt={flash:0,glitch:0,green:0,trunk:0,fade:0,fadeTarget:0},fb={flash:(i=1)=>{zt.flash=Math.max(zt.flash,i)},glitch:i=>{zt.glitch=Math.max(zt.glitch,i)},green:i=>{zt.green=Math.max(zt.green,i)},shake:i=>{kt.shake=Math.max(kt.shake,i)},trunk:i=>{zt.trunk=i,kt.setTrunkView(db),kt.mirrorMat.needsUpdate=!0}},pb={reset:()=>Nt.reset(),chat:i=>Nt.chat(i),toast:(i,e,t)=>Nt.toast(i,e,t),banner:(i,e,t)=>Nt.banner(i,e,t),nomi:(i,e)=>Nt.nomi(i,e),money:(i,e)=>Nt.money(i,e),durchsage:(i,e,t,n)=>Nt.durchsage(i,e,t,n),rahmen:(i,e)=>Nt.rahmen(i,e),funkloch:i=>Nt.funkloch(i),damage:(i,e)=>Nt.damage(i,e),jobs:i=>Nt.jobs(i),photo:(i,e)=>{Zl={kmh:i,clock:e}}},ct=new Gl({traffic:Qs,scenery:cd,road:sd,sky:Ms,rain:tc,windshield:jr,cockpit:kt,audio:dn,speech:Es,ui:pb,fx:fb,pickups:S0}),Gt="loading",Xi="cockpit",Vt=0,wi=!1,$l=null,od=!1,Ln=new Xl(ec,{click:()=>{dn.init(),dn.click()},action:i=>{i==="start"||i==="restart"?D0():i==="resume"?k0():i==="quit"?(wi=!1,Ln.hide(),ct.end("quit")):i==="menu"&&mb()},back:()=>{},dataFor:(i,e)=>i==="shop"?{wallet:ot.wallet,upgrades:ot.upgrades}:i==="settings"?{...Qt,speechSupported:Es.supported}:i==="title"?ot:i==="pause"?ct:i==="over"&&$l?{...$l,wallet:ot.wallet}:e,buy:i=>{let e=Fo.find(s=>s.id===i),t=ot.upgrades[i]||0;if(!e||t>=Nl[i])return!1;let n=e.prices[t];return ot.wallet<n?(dn.bad(),!1):(ot.wallet=Math.round((ot.wallet-n)*100)/100,ot.upgrades[i]=t+1,Js(ot),dn.coin(),Wo(),!0)},setting:(i,e)=>{Qt[i]=e,ot.settings=Qt,Js(ot),Jl(i)},resetSave:()=>{let i=m0();for(let e of Object.keys(ot))delete ot[e];Object.assign(ot,i),Qt=ot.settings,Js(ot),Wo(),Jl()}});function Wo(){let i=ot.upgrades;wn.setStarlink(!!i.starlink),wn.setVest(!!i.weste),kt.setElsa(!!i.elsa)}function Jl(i){if(dn.enabled=Qt.sound,dn.volume=Qt.volume,dn.setEnabled(Qt.sound),Es.enabled=Qt.speech,Qt.speech||Es.stopAll(),Nt.setChat(Qt.chat),!i||i==="quality"){let e=un;un=w0(),Wi=un.pr,e.shadows!==un.shadows&&(ut.shadowMap.enabled=un.shadows,Ms.sun.castShadow=un.shadows,di.traverse(n=>{n.material&&(Array.isArray(n.material)?n.material:[n.material]).forEach(s=>s.needsUpdate=!0)}));let t=Ms.sun.shadow;t.mapSize.x!==un.shadowSize&&(t.mapSize.set(un.shadowSize,un.shadowSize),t.map&&(t.map.dispose(),t.map=null)),Vo.samples=un.msaa,Vo.dispose(),qo()}}function mb(){Gt="title",Vt=0,wi=!1,kt.shake=0,Xi="cockpit",Nt.show(!1),Es.stopAll(),ct.startDemo(),Wo(),Ln.hide(),Ln.show("title",ot)}function D0(){dn.init(),Ln.hide(),wi=!1,ct.start(ot),Wo(),Gt="intro",Vt=0,od=!1,Xi="cockpit",Nt.show(!1),zt.fade=1,kt.shake=0,on.endFrame()}function k0(){wi=!1,Ln.hide(),Es.pause(!1),on.pressed.clear(),on.keys.clear()}function dd(){Gt!=="drive"||wi||(wi=!0,Es.pause(!0),Ln.show("pause",ct))}function gb(){let i=ct.over,e=i.distance/1e3,t=ot.best.distance||0,n=i.distance>t&&i.distance>50;ot.wallet=Math.round((ot.wallet+i.money)*100)/100,ot.best.distance=Math.max(t,i.distance),ot.best.earned=Math.max(ot.best.earned||0,i.money),ot.best.viewers=Math.max(ot.best.viewers||0,i.peakViewers),ot.stats.runs++,ot.stats.totalKm+=e,ot.stats.naviReached+=i.stats.naviReached,ot.stats.crashes+=i.stats.crashes,ot.stats.leftLaneEuro+=i.breakdown["Linke Spur"]||0,Js(ot),$l={...i,newRecord:n,best:ot.best.distance,wallet:ot.wallet,photos:Nt.photos.slice()}}var hi={lane:2,cool:0};function y0(i,e,t=!0){let n=ct.player;hi.cool-=i;let s=null,r=1/0;for(let h of Qs.cars){let u=h.s-n.s;u>0&&u<70&&Math.abs(h.x-n.x)<2.3&&u<r&&(s=h,r=u)}if(t&&s&&r<55&&hi.cool<=0){let h=f=>f>=1&&f<=3&&Qs.cars.every(m=>Math.abs(m.x-Ue.laneCenter(f))>2.4||m.s-n.s<-22||m.s-n.s>48),u=n.lane,d=[u-1,u+1].filter(h);d.length&&(hi.lane=d[0],hi.cool=3)}if(hi.cool<=-8&&hi.lane<3){let h=hi.lane+1;Qs.cars.every(u=>Math.abs(u.x-Ue.laneCenter(h))>2.4||u.s-n.s<-22||u.s-n.s>60)&&(hi.lane=h,hi.cool=3)}let o=Ue.laneCenter(hi.lane)-n.x,a=Math.abs(o)>.25?Ze(o*.9,-1,1):0,l=n.kmh<e?.6:0,c=0;return s&&r<40&&s.speed<n.speed&&(l=0,c=Ze((n.speed-s.speed)/8+(40-r)/40,0,1)),{steer:a,throttle:l,brake:c,horn:!1,wiper:!1,megafon:!1}}var ui=new Je,ql=new C,Yl=new $t,_0=new fn,vb=new C(1,1,1),xb=new C,Xo=new C,Mi={pos:new C(0,4,10),look:new C(0,1,-10),init:!1};function Jr(){let i=ct.player;ql.set(i.x,0,0),_0.set(0,-i.yaw,Ze(i.latAcc*.0025,-.03,.03),"YXZ"),Yl.setFromEuler(_0),ui.compose(ql,Yl,vb),wn.root.position.copy(ql),wn.root.quaternion.copy(Yl),kt.root.position.copy(ql),kt.root.quaternion.copy(Yl)}function jl(i){let e=window.innerWidth/window.innerHeight,t=Br.degToRad(86),n=Math.max(Br.degToRad(i),2*Math.atan(Math.tan(t/2)/e));_t.fov=Ze(Br.radToDeg(n),50,78),_t.aspect=e,_t.view&&(_t.view.enabled=!1),_t.updateProjectionMatrix()}var Ei={x:0,y:0};function yb(i){let e=window.innerWidth,t=window.innerHeight,n=0,s=0,r=Gt==="title"?document.querySelector(".screen-title:not(.hidden) .title-card"):null,o=r&&r.getBoundingClientRect();o&&o.width&&(e-o.right>e*.3?n=(o.right+e)/2-e/2:t-o.bottom>=o.top&&t-o.bottom>110?s=(o.bottom+t)/2-t/2:o.top>110&&(s=o.top/2-t/2));let a=1-Math.exp(-i*4);Ei.x+=(n-Ei.x)*a,Ei.y+=(s-Ei.y)*a,Math.abs(Ei.x)+Math.abs(Ei.y)>.5&&_t.setViewOffset(e,t,-Ei.x,-Ei.y,e,t)}function Ql(i){return xb.copy(i).applyMatrix4(ui)}function Kl(i,e){let t=ct.player,n,s;if(e==="orbit"){let o=Vt*.16+.9;n=new C(Math.sin(o)*8.5,2.4+Math.sin(Vt*.3)*.6,Math.cos(o)*8.5),s=new C(0,.9,0)}else n=new C(-t.vx*.25,3.3,9.2),s=new C(0,1,-14);n.applyMatrix4(ui),s.applyMatrix4(ui),Mi.init||(Mi.pos.copy(n),Mi.look.copy(s),Mi.init=!0);let r=1-Math.exp(-i*(e==="orbit"?3:6));Mi.pos.lerp(n,r),Mi.look.lerp(s,r),_t.position.copy(Mi.pos),kt.shake>0&&(_t.position.y+=Math.sin(Vt*60)*kt.shake*.08),_t.lookAt(Mi.look),jl(50),e==="orbit"?yb(i):Ei.x=Ei.y=0}var bs=[{t:0,pos:[-6.2,2.4,-9.5],look:[-.25,.95,0]},{t:2.4,pos:[-2.7,1.55,-3.4],look:[-.37,1.12,.22]},{t:4.6,pos:[-1.72,1.26,.2],look:[-.37,1.16,.28]}],jn=4.85,fd=6.3;function _b(i){let e=bs[0],t=bs[bs.length-1];for(let s=0;s<bs.length-1;s++)if(i>=bs[s].t&&i<=bs[s+1].t){e=bs[s],t=bs[s+1];break}if(i>t.t)return{pos:new C(...t.pos),look:new C(...t.look)};let n=ku(Ze((i-e.t)/(t.t-e.t),0,1));return{pos:new C().fromArray(e.pos).lerp(new C().fromArray(t.pos),n),look:new C().fromArray(e.look).lerp(new C().fromArray(t.look),n)}}function bb(i){let e=Vt;if(e<jn){let{pos:n,look:s}=_b(e);return n.applyMatrix4(ui),s.applyMatrix4(ui),_t.position.copy(n),_t.lookAt(s),jl(44),"outside"}kt.placeCamera(_t,ui,e,ct.player.speed,0,i);let t=ku(Ze((e-jn)/(fd-jn),0,1));return _t.rotateOnWorldAxis(Xo.set(0,1,0),(1-t)*1.05),jl(58),"inside"}function qo(){ut.setPixelRatio(Wi),ut.setSize(window.innerWidth,window.innerHeight),T0(),Vo.setSize(qi.x,qi.y),Wt.uTexel.value.set(1/qi.x,1/qi.y),_t.aspect=window.innerWidth/window.innerHeight,_t.updateProjectionMatrix(),tc.setPixelScale(qi.y)}window.addEventListener("resize",qo);qo();var ci={acc:0,n:0,cool:3};function Mb(i){if(!un.auto||Gt==="loading"||(ci.acc+=i,ci.n++,ci.cool-=i,ci.n<40))return;let e=ci.acc/ci.n;if(ci.acc=0,ci.n=0,ci.cool>0)return;let t=Math.min(window.devicePixelRatio||1,1.5);e>1/45&&Wi>.55?(Wi=Math.max(.55,Wi-.12),ci.cool=1.5,qo()):e<1/75&&Wi<t&&(Wi=Math.min(t,Wi+.06),ci.cool=3,qo())}var b0=0;function U0(i,{cockpitOn:e,drops:t}){wn.root.visible=!e,ut.shadowMap.needsUpdate=un.shadows,ut.setRenderTarget(Vo),ut.render(di,i),ut.setRenderTarget(null),Wt.uDrops.value=t?1:0,Wt.uPost.value=e?0:1,ut.render(R0,P0)}function Eb(i){b0++,i&&b0%un.mirrorEvery===0&&(nd.position.copy(Ql(Xo.set(0,1.32,.9))),nd.lookAt(Ql(Xo.set(0,1.05,40))),wn.root.visible=!1,ut.setRenderTarget(hd),ut.render(di,nd)),Zl&&(Sb(Zl),Zl=null),U0(_t,{cockpitOn:i,drops:i}),i&&($r.position.copy(_t.position),$r.quaternion.copy(_t.quaternion),$r.fov=_t.fov,$r.aspect=_t.aspect,$r.updateProjectionMatrix(),ut.autoClear=!1,ut.clearDepth(),ut.render(kt.scene,$r),wb(),ut.autoClear=!0)}function wb(){let i=Wt.uGreen.value>.001||Wt.uGlitch.value>.001;i&&(ut.getDrawingBufferSize(Go),(!_s||_s.image.width!==Go.x||_s.image.height!==Go.y)&&(_s&&_s.dispose(),_s=new Ya(Go.x,Go.y),rd.uniforms.tScreen.value=_s),ut.copyFramebufferToTexture(_s)),rd.uniforms.uCopy.value=i?1:0,ut.render(I0,P0)}function Sb({kmh:i,clock:e}){zo.aspect=4/3,zo.updateProjectionMatrix(),zo.position.copy(Ql(Xo.set(2.6,1.55,-10.5))),zo.lookAt(Ql(Xo.set(-.3,1.05,-.3)));let t=wn.cabinLight.intensity;wn.cabinLight.intensity=5;let n=Wt.uFlash.value;Wt.uFlash.value=.01,U0(zo,{cockpitOn:!1,drops:!1}),Wt.uFlash.value=n,wn.cabinLight.intensity=t,js.drawImage(ut.domElement,0,0,ut.domElement.width,ut.domElement.height,0,0,360,270),js.fillStyle="rgba(0,0,0,0.55)",js.fillRect(0,238,360,32),js.fillStyle="#ffd21f",js.font='bold 17px "Courier New", monospace',js.textAlign="left",js.fillText(`${i} km/h   ${e}   ERLAUBT 120`,10,260);let s=null;try{s=nc.toDataURL("image/jpeg",.82)}catch{s=null}Nt.photo(s,i,e)}var ad=performance.now(),En=0,M0={prev:{}};function Tb(i){let e=navigator.getGamepads?navigator.getGamepads():[];for(let t of e){if(!t)continue;let n=l=>!!t.buttons[l]?.pressed,s=t.axes[1]||0,r={up:n(12)||s<-.6,down:n(13)||s>.6,a:n(0),b:n(1),start:n(9)},o=l=>r[l]&&!M0.prev[l],a=0;o("up")&&(a=-1),o("down")&&(a=1),i&&(a||o("a")||o("b")||o("start"))&&Ln.pad(a,o("a")||o("start")&&Ln.current!=="pause",o("b")||o("start")&&Ln.current==="pause"),M0.prev=r;return}}function N0(i){requestAnimationFrame(N0);let e=(i-ad)/1e3;ad=i,!(ld&&window.__MA&&window.__MA.frozen)&&(e>0||(e=1/60),e=Math.min(e,1/20),B0(e),Mb(e))}function B0(i,{render:e=!0}={}){En+=i,Vt+=i,on.poll(),Tb(Ln.open);let t=ct.player,n=null,s=!1,r=0,o=0;switch(on.take("mute")&&(Qt.sound=!Qt.sound,Jl("sound"),Js(ot),Nt.toast(Qt.sound?"\u{1F50A} Ton an":"\u{1F507} Ton aus","info"),Ln.refresh("settings")),on.take("chat")&&(Qt.chat=!Qt.chat,Jl("chat"),Js(ot),Ln.refresh("settings")),Gt){case"title":{n=y0(i,118),ct.demo(i,n),Jr(),Kl(i,"orbit"),r=Math.max(0,Math.sin(En*.5))>.85?1:0,o=Math.sin(En*.4)*.6;break}case"intro":{Vt>.3&&(on.anyKey||on.take("confirm"))&&(od=!0),od&&Vt<jn-.25&&(Vt=jn-.25),n=y0(i,100,!1),hi.lane=3,ct.update(i,n,_t),Jr(),s=bb(i)==="inside",r=hs(1.4,2.4,Vt)*(1-hs(4.2,4.7,Vt)),o=hs(1,2.6,Vt)*1;let u=Vt;zt.fade=u<.6?1-u/.6:u>jn-.25&&u<jn?(u-(jn-.25))/.25:u>=jn&&u<jn+.35?1-(u-jn)/.35:0,!ct._greeted&&u>=jn&&(ct._greeted=!0,dn.whoosh(),ct.say("Hallo Mini Adam! Der Stream l\xE4uft. Gute Fahrt!","happy")),u>.4&&!ct._introChime&&(ct._introChime=!0,dn.nomiChime()),Vt>=fd&&(Gt="drive",Vt=0,Nt.show(!0),Nt.toast("Tipp: \u2190 \u2192 lenken \xB7 \u2191 Strom \xB7 \u2193 Bremse \xB7 V Kamera","info"));break}case"drive":{if(wi){Jr(),Xi==="cockpit"&&kt.placeCamera(_t,ui,En,0,0,0),s=Xi==="cockpit";break}if(on.take("pause")){dd();break}on.take("camera")&&(Xi=Xi==="cockpit"?"drone":"cockpit",Mi.init=!1,Nt.cameraLabel(Xi==="cockpit"?"\u{1F3A5} Cockpit":"\u{1F3A5} Drohne")),n={steer:on.steer,throttle:on.throttle,brake:on.brake,horn:on.take("horn"),wiper:on.take("wiper"),megafon:on.take("megafon")},ct.update(i,n,_t),Jr(),Xi==="cockpit"?(kt.placeCamera(_t,ui,En,t.speed,t.latAcc,i),jl(58),s=!0):Kl(i,"follow"),ct.over&&(Gt="ending",Vt=0,Mi.init=!1,gb());break}case"ending":case"over":{let h={steer:0,throttle:0,brake:.5,horn:!1,wiper:!1,megafon:!1};t.update(i,h,{wet:ct.weather.level}),Qs.update(i,En,t,{difficulty:.2,leftOpen:!1,rain:ct.weather.level}),S0.update(i,En,t,_t,!1),Jr(),Kl(i,"orbit"),r=Vt>1?1:0,o=Math.sin(Vt*.5)*.8,Gt==="ending"&&Vt>2.6&&(Gt="over",Nt.show(!1),Ln.show("over",$l));break}default:break}let a=t.s,l=ct.weather?ct.weather.level:0,c=wi;if(!c){let h=Oi.uCurve.value;h.x=125e-6*(.62*Math.sin(a/1900+1.3)+.38*Math.sin(a/740+.4)),h.y=45e-6*Math.sin(a/1300+2.1)*(.5+.5*Math.sin(a/3100));let u=ct.left||{glow:0};sd.update(a,i,En,u.glow||0,u.open&&u.timer<10?1:0),sd.setWet(l),cd.update(a,i),Ms.setOvercast(l*.95),tc.update(i,En,{speed:t.speed,s:a,camX:_t.position.x,intensity:l}),wn.update(i,t.speed,t.steer,En),wn.setBrake(t.braking>.1||t.speed<1),wn.adam.animate(En,{steer:t.steer,wave:r,look:o}),wn.cabinLight.intensity=s?0:Gt==="title"||Gt==="intro"||Gt==="ending"||Gt==="over"?3.2:.9,wn.setGroundShade(l),jr.update(i,{speed:t.speed,camera:_t,carMatrix:ui}),kt.update({dt:i,t:En,steer:t.steer,latAcc:t.latAcc,wiperAngles:jr.angles,sunDir:Ms.sunDir,overcast:l,screen:ct.screenState?Ab():null}),zt.trunk>0&&(zt.trunk-=i,zt.trunk<=0&&kt.setMirrorTexture(hd.texture))}Ms.update(c?0:i,_t,a,En),dn.update(i,{speed:t.speed,throttle:t.throttle,rain:l,sirenLevel:ct.sirenLevel||0,inCabin:s,paused:c||Gt==="over"}),kt.shake=Math.max(0,kt.shake-i*1.6),zt.flash=Math.max(0,zt.flash-i*3.5),zt.glitch=Math.max(0,zt.glitch-i),zt.green=Math.max(0,zt.green-i),Wt.uTime.value=En,Wt.uRain.value=l,Wt.uFlash.value=zt.flash,Wt.uGlitch.value=zt.glitch>0?.6+.4*Math.sin(En*40):0,Wt.uGreen.value=zt.green>0?Math.sin(En*26)>.2?1:.15:0,Wt.uFade.value=Gt==="intro"?Ze(zt.fade,0,1):0,Wt.uSat.value=1.08-l*.25,ld&&window.__MA&&window.__MA.camHook&&window.__MA.camHook(_t,ui),document.body.classList.toggle("playing",Gt==="drive"&&!wi),e&&Eb(s),Nt.update(wi?0:i,Gt==="drive"||Gt==="intro"?ct:null),on.endFrame()}function Ab(){try{return ct.running||ct.over?ct.screenState():E0()}catch{return E0()}}function E0(){let i=ct.player;return{dark:!1,battery:100,speedKmh:i.kmh,limit:null,playerX:i.x,leftLane:0,cars:Qs.nearby(i,125),s:i.s,navi:ct.navi.screen(i.s,18*60,i.speed),clock:"18:00",temp:17,funkloch:0,wiperOn:!1}}window.addEventListener("pointerdown",()=>dn.init());window.addEventListener("keydown",()=>dn.init());document.addEventListener("visibilitychange",()=>{document.hidden?(dd(),dn.suspend()):dn.resume()});function Rb(){Wo(),ct.startDemo(),Jr(),Kl(.016,"orbit");try{ut.compile(di,_t),ut.compile(kt.scene,_t)}catch{}Gt="title",Ln.show("title",ot),id.classList.add("done"),setTimeout(()=>id.remove(),800),requestAnimationFrame(i=>{ad=i,N0(i)})}ld&&(window.__MA={game:ct,traffic:Qs,scenery:cd,cockpit:kt,windshield:jr,tesla:wn,ui:Nt,menus:Ln,input:on,renderer:ut,camera:_t,save:ot,get state(){return Gt},set view(i){Xi=i},start:()=>D0(),skipIntro:()=>{Vt=fd},step:(i,e=1/30)=>{let t=Math.round(i/e);for(let n=0;n<t;n++)B0(e,{render:n===t-1})},setState:(i,e=0)=>{Gt=i,Vt=e},rain:i=>{ct.weather.active=i>0,ct.weather.target=i,ct.weather.level=i,ct.weather.dur=999,jr.setRain(i)},pause:()=>dd(),resume:()=>k0()});Rb();})();
