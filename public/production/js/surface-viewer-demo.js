/*
 * Copyright (C) 2011 McGill University
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* brainbrowser v1.3.0 */
$(function(){"use strict";function a(){e.show()}function b(){e.hide()}var c=0,d="",e=$("#loading");return BrainBrowser.utils.webglEnabled()?(BrainBrowser.SurfaceViewer.start("brainbrowser",function(f){var g=$('<select id="color-map-select"></select>').change(function(){f.loadColorMapFromURL($(this).val())});BrainBrowser.config.surface_viewer.color_maps.forEach(function(a){g.append('<option value="'+a.url+'">'+a.name+"</option>")}),$("#color-map-box").append(g),f.clamped=!0,f.flip=!1,f.addEventListener("error",b),f.addEventListener("loadcolormap",function(a){var b=a.createCanvasWithScale(0,100,null),c=document.getElementById("color-bar");b.id="spectrum-canvas",c?$(c).html(b):$('<div id="color-bar"></div>').html(b).appendTo("#data-range-box")}),f.addEventListener("displaymodel",function(a){var b,c,d=a.children,e=$("#shapes").children().length;d.length-e>0&&d.slice(e).forEach(function(a,d){c=$('<div id="shape_'+d+'" class="shape">'+"<h4>Shape "+(d+1+e)+"</h4>"+"Name: "+a.name+"<br />"+"Opacity: "+"</div>"),b=$('<div class="opacity-slider slider" data-shape-name="'+a.name+'"></div>'),b.slider({value:100,min:-1,max:101,slide:function(a){var b=a.target,c=$(b).attr("data-shape-name"),d=$(b).slider("value");d=Math.min(100,Math.max(0,d))/100,f.setTransparency(c,d)}}),b.appendTo(c),c.appendTo("#shapes")})}),f.addEventListener("clearscreen",function(){$("#shapes").html(""),$("#data-range-box").hide(),$("#color-map-box").hide()}),f.addEventListener("rangechange",function(a){var b=f.color_map.createCanvasWithScale(a.rangeMin,a.rangeMax,null);b.id="spectrum-canvas",$("#color-bar").html(b)}),f.addEventListener("loadintensitydata",function(a){var c,d,g=$("#data-range"),h='<div id="data-range-multiple"><ul>',i="",j=Array.isArray(a)?a:[a];for(g.html(""),c=0,d=j.length;d>c;c++)h+='<li><a href="#data-file'+c+'">'+j[c].filename+"</a></li>",i+='<div id="data-file'+c+'" class="box range-controls">',i+='Min: <input class="range-box" id="data-range-min" type="text" name="range_min" size="5" >',i+='<div id="range-slider'+c+'" data-blend-index="'+c+'" class="slider"></div>',i+='Max: <input class="range-box" id="data-range-max" type="text" name="range_max" size="5">',i+='<input type="checkbox" class="button" id="fix_range"><label for="fix_range">Fix Range</label>',i+='<input type="checkbox" class="button" id="clamp_range" checked="true"><label for="clamp_range">Clamp range</label>',i+='<input type="checkbox" class="button" id="flip_range"><label for="flip_range">Flip Colors</label>',i+="</div>";h+="</ul>",g.html(h+i+"</div>"),$("#data-range-box").show(),$("#color-map-box").show(),g.find("#data-range-multiple").tabs(),g.find(".range-controls").each(function(a,c){function d(){var a=parseFloat(n.val()),c=parseFloat(o.val());e.show(),p.slider("values",0,a),p.slider("values",1,c),f.rangeChange(a,c,g.find("#clamp_range").is(":checked"),{complete:b})}var g=$(c),h=j[a],i=BrainBrowser.utils.min(h.values),k=BrainBrowser.utils.max(h.values),l=h.rangeMin,m=h.rangeMax,n=g.find("#data-range-min"),o=g.find("#data-range-max"),p=g.find(".slider");p.slider({range:!0,min:l,max:m,values:[l,m],step:(m-l)/100,slide:function(a,c){var d=c.values[0],g=c.values[1];n.val(d),o.val(g),e.show(),h.rangeMin=d,h.rangeMax=g,f.model_data.color_data=h,f.rangeChange(d,g,f.clamped,{complete:b})}}),p.slider("values",0,parseFloat(l)),p.slider("values",1,parseFloat(m)),n.val(i),o.val(k),$("#data-range-min").change(d),$("#data-range-max").change(d),$("#fix_range").click(function(){f.fixRange=$(this).is(":checked")}),$("#clamp_range").change(function(a){var b=parseFloat(n.val()),c=parseFloat(o.val());$(a.target).is(":checked")?f.rangeChange(b,c,!0):f.rangeChange(b,c,!1)}),$("#flip_range").change(function(){f.flip=$(this).is(":checked"),e.show(),f.updateColors(f.model_data.color_data,{min:l,max:m,color_map:f.color_map,flip:f.flip,clamped:f.clamped,complete:b})}),f.triggerEvent("rangechange",h)})}),f.addEventListener("blendcolormaps",function(){var a=$("#blend-box");a.html("Blend Ratio: "),$('<span id="blend_value">0.5</span>').appendTo(a),$('<div class="blend_slider" id="blend_slider" width="100px" + height="10"></div>').slider({min:.1,max:.99,value:.5,step:.01,slide:function(){f.blend($(this).slider("value"))}}).appendTo(a)}),f.render(),f.loadColorMapFromURL(BrainBrowser.config.surface_viewer.color_maps[0].url),$("#clearshapes").click(function(){f.clearScreen(),c=0,d="",e.hide()}),$("#range-slider").slider({range:!0,min:-50,max:50,value:[-10,10],slider:function(a,b){var c=parseFloat(b.values[0]),d=parseFloat(b.values[1]);f.rangeChange(c,d,$("#clamp_range").is(":checked"))},step:.1}),$(".range-box").keypress(function(a){"13"===a.keyCode&&f.rangeChange(parseFloat($("#data-range-min").val(),10),parseFloat($("#data-range-max").val(),10))}),$("#examples").click(function(a){function g(a){return function(){return a!==c}}c++;var h,i,j=$(a.target).attr("data-example-name");if(d!==j){d=j,e.show(),f.clearScreen();var k={basic:function(){f.loadModelFromURL("/models/surf_reg_model_both.obj",{format:"MNIObject",complete:b,cancel:g(c),parse:{split:!0}})},punkdti:function(){f.loadModelFromURL("/models/dti.obj",{format:"MNIObject",renderDepth:999,complete:b,cancel:g(c)}),f.loadModelFromURL("/models/left_color.obj",{format:"MNIObject",cancel:g(c)}),f.loadModelFromURL("/models/right_color.obj",{format:"MNIObject",cancel:g(c)})},realct:function(){f.loadModelFromURL("/models/realct.obj",{format:"MNIObject",parse:{split:!0},complete:function(){f.loadIntensityDataFromURL("/models/realct.txt",{name:"Cortical Thickness",complete:b,cancel:g(c)})},cancel:g(c)})},car:function(){f.loadModelFromURL("/models/car.obj",{format:"WavefrontObj",complete:b,cancel:g(c)}),f.setCamera(0,0,100),h=new THREE.Matrix4,h.makeRotationX(-.25*Math.PI),i=new THREE.Matrix4,i.makeRotationY(.4*Math.PI),f.model.applyMatrix(i.multiply(h))},plane:function(){f.loadModelFromURL("/models/dlr_bigger.streamlines.obj",{format:"MNIObject",cancel:g(c)}),f.loadModelFromURL("/models/dlr.model.obj",{format:"MNIObject",complete:b,cancel:g(c)}),f.setCamera(0,0,75),h=new THREE.Matrix4,h.makeRotationX(-.25*Math.PI),i=new THREE.Matrix4,i.makeRotationY(.4*Math.PI),f.model.applyMatrix(i.multiply(h))},mouse:function(){f.loadModelFromURL("/models/mouse_surf.obj",{format:"MNIObject",complete:function(){f.loadIntensityDataFromURL("/models/mouse_alzheimer_map.txt",{name:"Cortical Amyloid Burden, Tg AD Mouse, 18 Months Old",shape:"mouse_surf.obj",min:0,max:.25,complete:b,cancel:g(c)})},cancel:g(c)}),f.loadModelFromURL("/models/mouse_brain_outline.obj",{format:"MNIObject",complete:function(){$(".opacity-slider[data-shape-name='mouse_brain_outline.obj']").slider("value",50),f.setTransparency("mouse_brain_outline.obj",.5)},cancel:g(c)}),f.setCamera(0,0,40)}};return k.hasOwnProperty(j)&&k[j](),!1}}),$("#obj_file_format").change(function(){var a=$("#obj_file_format").closest("#obj_file_select").find("#obj_file_format option:selected").val();$("#format_hint").html(BrainBrowser.config.surface_viewer.filetypes[a].format_hint||"")}),$("#obj_file_submit").click(function(){var c=$("#obj_file_format").closest("#obj_file_select").find("#obj_file_format option:selected").val();return f.loadModelFromFile(document.getElementById("objfile"),{format:c,beforeLoad:a,complete:b}),!1}),$(".datafile").change(function(){var a=parseInt(this.id.slice(-1),10);f.loadIntensityDataFromFile(this,{blend_index:a-1})}),$("#color-map").change(function(){f.loadColorMapFromFile(document.getElementById("color-map"))}),$("a.example[data-example-name=realct]").click()}),void 0):($("#brainbrowser").html(BrainBrowser.utils.webGLErrorMessage()),void 0)});