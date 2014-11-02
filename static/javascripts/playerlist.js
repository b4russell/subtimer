(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['playerlist'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"player"
    + escapeExpression(((helper = (helper = helpers.running || (depth0 != null ? depth0.running : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"running","hash":{},"data":data}) : helper)))
    + "\" id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" base=\""
    + escapeExpression(((helper = (helper = helpers.base || (depth0 != null ? depth0.base : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"base","hash":{},"data":data}) : helper)))
    + "\" runstart=\""
    + escapeExpression(((helper = (helper = helpers.runstart || (depth0 != null ? depth0.runstart : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"runstart","hash":{},"data":data}) : helper)))
    + "\">\n<div class=\"edit button delete\"> Delete </div>\n  <div class=\"timebar\"> </div>\n  <div class=\"clock\">\n      00:00\n  </div>\n    <div class=\"name\">\n      "
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\n  </div>\n  <div class=\"clear\"></div>\n</div>\n";
},"useData":true});
})();