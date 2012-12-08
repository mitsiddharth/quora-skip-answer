(function ($) {
	
	var ansHashTags = {};
	var ansHashIndex = {};

	var answer_header_selector = ".answer_header_text";
	var answer_div_selector = ".row .pagedlist_item";
	var answer_anchor_tag_selector = "a[name*='answer_']";
	var answer_text_selector = ".answer_text";

	var nAnswers = 0;	

	$(document).ready(function() {
		if(isAnswerPage()){
			initialize();
		}
		return;
	});

 	var getTargetUrl = function(element) {
    	var currentUrl = $(element).parents(answer_div_selector).find(answer_anchor_tag_selector).attr('name');
    	return ansHashIndex[ansHashTags[currentUrl] + 1];
	};

  var mouseOverHandler = function(e, left_coord) {
    var top_coord = e.pageY;
    var nextUrl = '#' + getTargetUrl(e.srcElement);
    var skipButton = createSkipButton(left_coord - 50, top_coord, nextUrl);
    skipButton.appendTo(document.body);
  };

 	var activate_mouseover_events = function() {
    	var answer_elements = $(answer_text_selector);
    	var left_coord = answer_elements.offset().left;

      answer_elements.unbind('mouseover');

    	answer_elements.bind('mouseover', function(e) {
        mouseOverHandler(e, left_coord);
    	});
  	};

	var isAnswerPage = function () {
		return ($(answer_header_selector).length > 0);
	};

	var getNumberOfAnswers = function() {
		var answerText = $(answer_header_selector).text();
		var ansCount = answerText.substring(0,
								answerText.indexOf("Answers")-1) - 0;
		return ansCount;
	};

	var initialize = function (){
		nAnswers = getNumberOfAnswers();
		// Scan through all the answers
		// and collect the hastags
		populateAnswerHash();
    registerEvents();
	};
	
	var populateAnswerHash = function() {
		$(answer_anchor_tag_selector,answer_div_selector).each(function(index) {
			var attrName = $(this).attr("name");
			ansHashTags[attrName] = index;
			ansHashIndex[index] = attrName;
		});
	
	};

  var createSkipButton = function(x_coord, y_coord, nextUrl) {
    var skipButton = $('#skipButton');
    if (skipButton.length == 0) {
      skipButton = $('<div id="skipButton"><a href="#">SKIP</a></div>');
      skipButton.css({'left':x_coord, 'top':y_coord, 'position':'absolute', 'width':'50px', 'background-color':'#003333'});
    } else {
      skipButton.css({'left':x_coord, 'top':y_coord});
    }
    skipButton.find('a').attr('href', nextUrl);
    return skipButton;
  };

  var registerDomInsertEvent = function() {
    $(document).bind('DOMNodeInserted', function(e) {
      var element = e.target;
      console.log(element);
      if($(element).attr('class') == 'pagedlist_item') {
        populateAnswerHash(); 
        activate_mouseover_events();
      }
    });
  };

  var registerEvents = function() {
    activate_mouseover_events();
    registerDomInsertEvent();
  }

})(jQuery);
