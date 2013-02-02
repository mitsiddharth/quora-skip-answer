(function ($) {
	
	var ansHashTags = {};
	var ansHashIndex = {};

	var answer_header_selector = ".answer_header_text";
	var answer_div_selector = ".row .pagedlist_item";
	var answer_anchor_tag_selector = "a[name*='answer_']";
	var answer_content_selector = ".answer_content";
  var suggest_edits_selector = ".suggested_edits,edit,inline_editor_edit";

	var nAnswers = 0;	

	$(document).ready(function() {
		if(isAnswerPage()){
			initialize();
		}
		return;
	});

 	var getNextUrl = function(element) {
    	var currentUrl = $(element).parents(answer_div_selector).find(answer_anchor_tag_selector).attr('name');
    	return ansHashIndex[ansHashTags[currentUrl] + 1];
	};
  
  var getPreviousUrl = function(element) {
    var currentUrl = $(element).parents(answer_div_selector).find(answer_anchor_tag_selector).attr('name');
    return ansHashIndex[ansHashTags[currentUrl] - 1];
  };

  var mouseOverHandler = function(e, left_coord) {
    var top_coord = e.pageY;
    var nextUrl = '#' + getNextUrl(e.srcElement);
    if(nextUrl != '#undefined') {
      var skipButton = createSkipButton(left_coord - 50, top_coord, nextUrl);
      skipButton.appendTo(document.body);
    }

    var previousUrl = '#' + getPreviousUrl(e.srcElement);
    if(previousUrl != '#undefined') {
      var previousButton = createPreviousButton(left_coord - 50 - $('#skipButton').width(), top_coord, previousUrl);
      previousButton.appendTo(document.body);
    }
  };

 	var activate_mouseover_events = function() {
      var suggested_edits_elements = $(suggest_edits_selector);
    	var answer_elements = $(answer_content_selector);
    	var left_coord = $(suggested_edits_elements[0]).position().left;

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

  var createButton = function(text, id, x_coord, y_coord) {
    button = $('<div id="' + id + '" class="topic_list_item">' +
        '  <a href="#" class="topic_name">'+
        '    <span class="name_text">'+
              text +
        '    </span>'+
        '  </a>'+
        '</div>');
    button.css({'left':x_coord, 'top':y_coord, 'position':'absolute', 'margin': '5px'});
    return button;
  }

  var createPreviousButton = function(x_coord, y_coord, previousUrl) {
    var previousButton = $('#previousButton');
    if (previousButton.length == 0) {
      previousButton = createButton('Prev', 'previousButton', x_coord, y_coord);
    } else {
      previousButton.css({'left':x_coord, 'top':y_coord});
    }
    previousButton.find('a').attr('href', previousUrl);
    return previousButton;
  };

  var createSkipButton = function(x_coord, y_coord, nextUrl) {
    var skipButton = $('#skipButton');
    if (skipButton.length == 0) {
      skipButton = createButton('Skip', 'skipButton', x_coord, y_coord);
    } else {
      skipButton.css({'left':x_coord, 'top':y_coord});
    }
    skipButton.find('a').attr('href', nextUrl);
    return skipButton;
  };

  var registerDomInsertEvent = function() {
    $(document).bind('DOMNodeInserted', function(e) {
      var element = e.target;
      if($(element).attr('class') == 'pagedlist_item') {
        populateAnswerHash(); 
        activate_mouseover_events();
      }
    });
  };

  var registerEvents = function() {
    activate_mouseover_events();
    //registerDomInsertEvent();
  }

  var animationEvent = function(e) {
      if(e.originalEvent.animationName == 'nodeInserted') {
        populateAnswerHash();
        activate_mouseover_events();
    }
  }

  $(document).bind('webkitAnimationStart', function(e) {
    animationEvent(e);
  });
})(jQuery);
