#HereInPittsburgh 
###A Craigslist for Chinese folks in Pittsburgh
[hereinpittsburgh.com](https://hereinpittsburgh.herokuapp.com/)

[See Details](https://www.zihanx.com/hereinpittsburgh)



</br>
##Motivation
In Pittsburgh, even across the country, group chats in WeChat is the first choice for local Chinese, especially Chinese students to sell second-hand stuff, sublease apartments, and post events. I personally have more than 10 groups to do so. Since WeChat Group is not designed to be the Chinese version of Craigslist, the bad user experience sometimes drive us crazy. For example, invitation is explicitly required for users to post and get access to the information in a group (normally with a limitation of 500 users). Also, the posts in group chats tend to be messy and tedious.  To solve the listed and other existed problems, I came up with the idea of HereInPittsburgh.

HereInPittsburgh is an independently developed website. It's a Craigslist for Chinese folks in Pittsburgh. Hopefully it can smooth people's life in Pittsburgh, helping users get rid of the tedious and inefficient WeChat groups.

##Technical Approach
![](https://s3.amazonaws.com/hereinpittsburgh/zihanx.com/hip_tech1.png)

![](https://s3.amazonaws.com/hereinpittsburgh/zihanx.com/hip_tech2.png)

* Independently developed a dynamic website for Chinese in Pittsburgh to sell second-hand stuff, sublease apartments, and post events. Helping them to get rid of inefficient WeChat groups.

Back End:  

* Created Node.js servers (Express) with RESTful APIs to handle HTTP requests and responses.  
* Built NoSQL databases (based on MongoDB) to manage user data and posts’ information.  
* Deployed server side on Heroku; Hosted databases on mLab; Stored images on Amozon S3.  
* Implemented image uploading/resizing/deleting with multer.js and imagemagick.js.  
* Supported user authentication strategies with passport.js.

Front End:  

* Designed a responsive website utilizing AJAX technology and UI library Semantic-ui/jQuery.  
* Integrated Google Maps API to improve user experience of address displaying and searching.  

In Progress:

* Explore Pittsburgh: A Yelp-like guide for people new to Pittsburgh, with popular spots (including food, grocery, shopping, library, entertainment) marked on a map.



