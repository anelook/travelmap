travelmap
=========

A solution to store marks to the places a person has visited. Uses HERE platform to build a map, HTML5 to store data and Flickr images.


Idea

The goal of the web page is to store and display a list of places a person has visited. Just click on the link "Add more places" and enter the name of the city or country. In case your browser allows geolocation, the first place is already preselected for you.


How it works

The data is stored in the local storage of the browser. Note, that this feature is only available in the latest versions of the browsers. 
When page is loaded, we request the current location of the user bz using browser geolocation feature. If information retrieved successfully, a mark to this place is added to the map


Existing issues

The solution is still raw, so minor (and probably major) bugs are present. 
It uses a responsive design and was tested in the latest versions of IE, Chrome, Firefox and Chrome mobile. I need to mention, that IE often has issues retrieving information about maps and images.
Due to time limitations, I haven't checked iOS, as well as older browsers, which do not support some HTML5 features.

Further improvements

There are several things, which I would like to improve further.
First of all, it is error handling and giving the user a more graceful feedback, when a city was not found or when his browser does not support some features.
Secondly, rewriting the removal method and avoid the unnecessary refresh of all markers. 
After this, making the images clickable and provide information bubbles. 
Last, but not the least is code refactoring and better coverage of the methods with unittests. 
And a lot of other issues and ideas.
