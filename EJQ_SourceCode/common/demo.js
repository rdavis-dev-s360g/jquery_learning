/* Common JavaScript for jQuery demonstration pages. */
$(function () {
	$('<div id="header-links"><a href="../index.html">' +
		'<img src="../common/homePage.png" alt="Home page" title="Home page"></a></div>').
		insertBefore('h1');
	$('#download').append(' <img src="../common/download.png" alt="" style="">');
	// Stripe tables
	$('table').each(function() {
		$('tr:odd', this).addClass('ui-state-highlight');
	});
	// Initialise tabs
	if ($.fn.tabs) {
		$('#tabs').tabs($.fn.tabs.tabProps);
	}
	// Execute example script tags
	$('code.jsdemo').each(function () {
		$(this).removeClass('jsdemo').addClass('js').hide().
			wrap('<div class="showCode ui-state-highlight"></div>').
			before('<a href="#" class="showCode">Show code</a>').
			text('\n' + $(this).text());
		eval($(this).text().replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
	});
	$('code.css').each(function () {
		$(this).hide().wrap('<div class="showCode ui-state-highlight"></div>').
			before('<a href="#" class="showCode">Show CSS</a><br>');
	});
	$('code.htmldemo').each(function () {
		$(this).removeClass('htmldemo').addClass('html').
			hide().wrap('<div class="showCode ui-state-highlight"></div>').
			before('<a href="#" class="showCode">Show HTML</a><br>');
	});
	$('a.showCode').click(function() {
		var show = $(this).text().match(/^Show.*/);
		if (show) {
			$(this).text($(this).text().replace(/Show/, 'Hide')).
				parent().css('width', 'auto').find('code').show();
		}
		else {
			$(this).text($(this).text().replace(/Hide/, 'Show')).
				parent().css('width', '80px').find('code').hide();
		}
		return false;
	});
	// Code highlighting
	if ($.fn.chili && $.browser && !$.browser.msie) {
		$('code').chili({recipeFolder: '../common/'});
	}
});

function jumpTo(tab, id) {
	var index = $('#' + tab).index() - 1;
	$('#tabs').tabs('option', {active: index, selected: index});
	setTimeout(function() { scrollTo(0, $('a[name="' + id + '"]').offset().top); }, 100);
	return false;
}
