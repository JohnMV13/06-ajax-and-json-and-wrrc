'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

/* REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article. */
Article.all = [];

// COMMENT: Why isn't this method written as an arrow function?
// There is a (this) inside the function so an arrow can't reference it.
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);


  // COMMENT: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // The question mark and colon represent a conditional ternary operator. It looks at the publishedOn property of each article. If a date exists the published status will be something like "published 5 days ago". If a date doesn't exist the published status will be "(draft)""
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

/* REVIEW: There are some other functions that also relate to all articles across theb oard, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles. */

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// COMMENT: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// This is different from previous labs in that we had the blog articles.js file ran first which created a raw data object. That object was sorted at the bottom of articles.js then each of the articles were constructed and pushed into a generic array called Articles. Now when loadAll is called, data is pulled from localStorage, the objects are sorted by date, then constructed, then pushed into an array that relates to all Article objects.

Article.loadAll = articleData => {
  // console.log(articleData[0]);
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)));
  // console.log(articleData[0]);
  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)));
  // console.log(Article.all);
}

// REVIEW: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  if (localStorage.rawData) {
    // REVIEW: When rawData is already in localStorage we can load it with the .loadAll function above and then render the index page (using the proper method on the articleView object).

    //TODO: This function takes in an argument. What do we pass in?



    $.getJSON('./data/hackerIpsum.json')




    Article.loadAll();




    //TODO: What method do we call to render the index page?

    // COMMENT: How is this different from the way we rendered the index page previously? What the benefits of calling the method here?
    // PUT YOUR RESPONSE HERE

  } else {
    // TODO: When we don't already have the rawData, we need to retrieve the JSON file from the server with AJAX (which jQuery method is best for this?), cache it in localStorage so we can skip the server call next time, then load all the data into Article.all with the .loadAll function above, and then render the index page.
    // The jQuery method $.getJSON and .then() are the best for this.
    $.getJSON('./data/hackerIpsum.json').then(function(data, status, xhr) {
      // What to do with data when success
      // console.log(data);
      Article.loadAll(data);
    }, function(err) {
      // What to do when error happens
      console.log(err);
    });

    

    // COMMENT: Discuss the sequence of execution in this 'else' conditional. Why are these functions executed in this order?
    // The first thing that happens is we use jQuery's $.getJSON method to reference the file location. Then we chain the .then() function that requires two function parameters - the first being the success function and the second being the fail function. If the file is found the first function is run. If the file cannot be found the second function is run.
  }
}
