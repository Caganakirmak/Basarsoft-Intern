"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4651],{73902:function(e,t,n){var s=n(52401),o=n(41564),a=n(96256);const c=new s.A({sources:[{url:"https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/B04.tif",max:1e4},{url:"https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/B08.tif",max:1e4}]}),i=new a.A({style:{color:["interpolate",["linear"],["/",["-",["band",2],["band",1]],["+",["band",2],["band",1]]],-.2,[191,191,191],-.1,[219,219,219],0,[255,255,224],.025,[255,250,204],.05,[237,232,181],.075,[222,217,156],.1,[204,199,130],.125,[189,184,107],.15,[176,194,97],.175,[163,204,89],.2,[145,191,82],.25,[128,179,71],.3,[112,163,64],.35,[97,150,54],.4,[79,138,46],.45,[64,125,36],.5,[48,110,28],.55,[33,97,18],.6,[15,84,10],.65,[0,69,0]]},source:c}),l=new o.A({target:"map",layers:[i],view:c.getView()}),u=document.getElementById("output");l.on(["pointermove","click"],(function(e){const t=i.getData(e.pixel);if(!t)return;const n=t[0],s=t[1],o=(s-n)/(s+n);u.textContent=o.toFixed(2)}))}},function(e){var t;t=73902,e(e.s=t)}]);
//# sourceMappingURL=cog-math.js.map