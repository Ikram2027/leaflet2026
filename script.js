// Configuration carte et fond de carte
var map = L.map('map', {
center: [48.114, -1.676],
zoom: 12 });
var baselayers = {
 
 
OrthRM:L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?',
{layers: 'raster:ortho2021', attribution : 'Rennes Métropole'}),
 
CartoDB_VoyagerNoLabels
: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
subdomains: 'abcd',
maxZoom: 20
}),
 
OpenStreetMap_Mapnik
: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}),
 
Stadia_StamenTonerDark
: L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.{ext}', {
minZoom: 0,
maxZoom: 20,
attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
ext: 'png'
}),
 
Esri_WorldGrayCanvas
: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
maxZoom: 16
})};
baselayers.Stadia_StamenTonerDark.addTo(map);



// Ajouter l'echelle cartographique
L.control.scale().addTo(map);

// Contenu popup SIGAT
var popupSIGAT = '<h1>Université Rennes 2 </h1> <br> <img src="https://static9.depositphotos.com/1593313/1089/v/450/depositphotos_10890854-stock-illustration-university-building.jpg" width="350px"> <iframe width="300" height="315" src="https://www.youtube.com/embed/mrV8kK5t0V8?si=r9Ndh__WBjpQpb3p" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
// Dimenions des popups SIGAT
var customOptions = {'maxWidth': '400', 'className' : 'custom'}

// Picto des marqueur SIGAT

var PictoSIGAT = L.icon({
iconUrl:'https://pbs.twimg.com/profile_images/1443962339129241602/RKD897Ry_400x400.jpg',
iconSize: [30, 30] });

// Ajout marqueur
var Rennes2 = L.marker([48.119, -1.7013],{icon: PictoSIGAT}).bindPopup(popupSIGAT,customOptions);


// Ajouter des marqueurs Maison

var Maison = L.icon({
iconUrl:'https://e7.pngegg.com/pngimages/703/597/png-clipart-logo-house-home-house-angle-building-thumbnail.png',
iconSize: [20, 20] });


var Maison = L.marker([48.1225, -1.7044], {icon: Maison});


// Ajouter WMS
var Traffic = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {
layers: 'trp_rout:v_rva_trafic_fcd',
format: 'image/png',transparent: true}).addTo(map);

// Ajouter Batiments 
var Batiments = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {
layers: 'ref_cad:batiment',
format: 'image/png',transparent: true});

// Ajouter etablissement sante 
var etabsante = L.tileLayer.wms('https://public.sig.rennesmetropole.fr/geoserver/ows?', {
layers: 'eq_sante:etablissement_sante',
format: 'image/png',transparent: true});

// Ajout des Stations de vélos
var url = 'https://raw.githubusercontent.com/mastersigat/data/main/velostar.geojson';
$.getJSON(url, function (geojson) {
var velos = L.geoJson(geojson,{
// Transformer les marqueurs en point
pointToLayer: function (geoJsonPoint, latlng) {
return L.circleMarker(latlng);
},
// Modifier la symbologie des points
style: function (geoJsonFeature) {
return {
fillColor: '#FF0000',
radius: 6,
fillOpacity: 0.7,
stroke: false};
},
}).addTo(map);
  
  
// Ajout Popup
velos.bindPopup(function(velos) {console.log(velos.feature.properties);
return "<h2> Station : "+velos.feature.properties.nom+"</h2>"+"<hr><h3>"
+velos.feature.properties.nombreemplacementstheorique+ "&nbsp; vélos</h3>" ;
});
});

// Déclarer les couches à afficher
var couches = {
"Traffic en temps réel" : Traffic,
"Batiments" : Batiments,
"Etablissement_sante" : etabsante,
 "Salle SIGAT" : Rennes2,
 "Maison" : Maison
}


// Ajouter le controleur de couches
L.control.layers(baselayers,couches,{position: 'topleft', collapsed : false}).addTo(map);