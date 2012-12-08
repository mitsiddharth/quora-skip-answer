(function ($) {
	QSA = {};
	
	var ansHashTags = {};
	var ansHashIndex = {};

	var answer_header_selector = ".answer_header_text";
	var answer_div_selector = ".row .pagedlist_item";
	var answer_anchor_tag_selector = "[name*='answer_']";
		
	var nAnswers = 0;	

	$(document).ready(function() {
		if(isAnswerPage()){
			initialize();
		}
		return;
	});

	
	var isAnswerPage = function () {
		return ($(answer_header_selector).length > 0);
	}

	var getNumberOfAnswers = function() {
		var answerText = $(answer_header_selector).text();
		var ansCount = answerText.substring(0,
								answerText.indexOf("Answers")-1) - 0;
		return ansCount;
	}

	var initialize = function (){
		nAnswers = getNumberOfAnswers();
		// Scan through all the answers
		// and collect the hastags
		populateAnswerHash();
	}
	
	var populateAnswerHash = function() {
		$(answer_anchor_tag_selector,answer_div_selector).each(function(index) {
			var attrName = $(this).attr("name");
			ansHashTags[attrName] = index;
			ansHashIndex[index] = attrName;
		});
	
	}



})(jQuery);
