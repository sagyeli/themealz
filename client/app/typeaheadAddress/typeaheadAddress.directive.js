'use strict';

angular.module('themealzApp')
	.directive('typeaheadAddress', function () {
		return {
		  restrict: 'A',
		  link: function (scope, element, attrs) {
			var addresses = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				remote: {
					url: 'http://nominatim.openstreetmap.org/search.php?q=%QUERY&format=json',
					wildcard: '%QUERY'
				}
			});

			element.typeahead(null, {
				name: 'best-pictures',
				display: 'display_name',
				source: addresses
			}).bind('typeahead:selected', function(obj, selected, name) {
				$('.typeahead-lat').val(selected.lat).trigger('input');
				$('.typeahead-lng').val(selected.lon).trigger('input');
			}).off('blur');
		  }
		};
	});