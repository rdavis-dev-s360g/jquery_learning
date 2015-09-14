/* http://keith-wood.name/selectors.html
   Selectors for jQuery v1.0.0.
   Written by Keith Wood (kbwood{at}iinet.com.au) December 2010.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */

(function($) { // Hide scope, no $ conflict

var usesCreatePseudo = !!$.expr.createPseudo; // jQuery 1.8+
var usesPOS = !!$.expr.match.POS; // jQuery 1.8-

function allText(element) {
	return element.textContent || element.innerText || $.text([element]) || '';
}

/* Exact match of content. */
if (usesCreatePseudo) {
	$.expr.pseudos.content = $.expr.createPseudo(function(text) {
		return function(element) {
			return allText(element) == text;
		};
	});
}
else {
	$.expr.filters.content = function(element, i, match) {
		return allText(element) == match[3];
	};
}

/* Regular expression match of content. */
if (usesCreatePseudo) {
	$.expr.pseudos.matches = $.expr.createPseudo(function(text) {
		return function(element) {
			var flags = (text[0] || '') == '~' ? 'i' : '';
			return new RegExp(text.substring(flags ? 1 : 0), flags).test(allText(element));
		};
	});
}
else {
	$.expr.filters.matches = function(element, i, match) {
		var flags = (match[3][0] || '') == '~' ? 'i' : '';
		return new RegExp(match[3].substring(flags ? 1 : 0), flags).test(allText(element));
	};
}

/* All lists. */
$.expr.filters.list = function(element) {
	return /^(ol|ul)$/i.test(element.nodeName);
};

/* Emphasised text. */
$.expr.filters.emphasis = function(element) {
	return /^(b|em|i|strong)$/i.test(element.nodeName);
};

/* Foreign language elements. */
var defaultLanguage = new RegExp(
	'^' + (navigator.language || navigator.userLanguage).substring(0, 2), 'i');
if (usesCreatePseudo) {
	$.expr.pseudos.foreign = $.expr.createPseudo(function(language) {
		return function(element) {
			var lang = $(element).attr('lang');
			return !!lang && (!language ? !defaultLanguage.test(lang) :
				new RegExp('^' + language.substring(0, 2), 'i').test(lang));
		};
	});
}
else {
	$.expr.filters.foreign = function(element, i, match) {
		var lang = $(element).attr('lang');
		return !!lang && (!match[3] ? !defaultLanguage.test(lang) :
			new RegExp('^' + match[3].substring(0, 2), 'i').test(lang));
	};
}

// Custom selectors
$.extend($.expr[":"], {
	// http://docs.jquery.com/Plugins/Validation/blank
	blank: function(a) {return !$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/filled
	filled: function(a) {return !!$.trim("" + a.value);},
	// http://docs.jquery.com/Plugins/Validation/unchecked
	unchecked: function(a) {return !a.checked;}
});

/* Middle elements. */
if (usesCreatePseudo) {
	if (usesPOS) {
		$.expr.match.POS = new RegExp($.expr.match.POS.source.replace(/odd/, 'odd|middle'), 'ig');
	}
	$.expr.setFilters.middle = function(elements, argument, not) {
		var firstLast = [elements.shift(), elements.pop()];
		return not ? firstLast : elements;
	};
}
else {
	$.expr.match.POS = new RegExp($.expr.match.POS.source.replace(/odd/, 'odd|middle'));
	$.expr.leftMatch.POS = new RegExp($.expr.leftMatch.POS.source.replace(/odd/, 'odd|middle'));
	$.expr.setFilters.middle = function(element, i, match, list) {
		return i > 0 && i < list.length - 1;
	};
}

/* Allow index from end of list. */
if (usesCreatePseudo) {
	var usesCreatePositional = false;
	for (var name in $.expr.setFilters.eq) {
		usesCreatePositional = !!name;
	}
	if (!usesCreatePositional) { // jQuery 1.8.0-1.8.1
		$.expr.match.POS = new RegExp($.expr.match.POS.source.replace(/\\d\*/, '-?\\d*'), 'ig');
		$.expr.setFilters.eq = function(elements, argument, not) {
			argument = parseInt(argument, 10);
			argument = (argument < 0 ? elements.length + argument : argument);
			var element = elements.splice(argument, 1);
			return not ? elements : element;
		};
	}
	else { // jQuery 1.8.2+
		function createPositionalPseudo(fn) {
			return $.expr.createPseudo(function(argument) {
				argument = +argument;
				return $.expr.createPseudo(function(seed, matches) {
					var j,
						matchIndexes = fn([], seed.length, argument),
						i = matchIndexes.length;

					// Match elements found at the specified indexes
					while (i--) {
						if (seed[(j = matchIndexes[i])]) {
							seed[j] = !(matches[j] = seed[j]);
						}
					}
				});
			});
		}
		$.expr.filters.eq = createPositionalPseudo(function(matchIndexes, length, argument) {
			return [argument < 0 ? argument + length : argument];
		});
	}
}
else {
	$.expr.match.POS = new RegExp($.expr.match.POS.source.replace(/\\d\*/, '-?\\d*'));
	$.expr.leftMatch.POS = new RegExp($.expr.leftMatch.POS.source.replace(/\\d\*/, '-?\\d*'));
	$.expr.setFilters.eq = function(element, i, match, list) {
		var index = parseInt(match[3], 10);
		index = (index < 0 ? list.length + index : index);
		return index === i;
	};
}

})(jQuery);
