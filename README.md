WD Boilerplate
============
This is Joe Wegner's boilerplate Angular/Node/API web development boilerplate

Technology
----------

- [AngularJS](http://angularjs.org) on the frontend.  The power of AngularJS data-binds gives WD Boilerplate a real-time feel, so the user has instant feedback.
- [Node.js](http://nodejs.org) on the backend.  I built a wonderful [API module](https://github.com/josephwegner/simple-api) for Node.js, so it's just quickest for me to put everything on Node.
- [MongoDB](http://www.mongodb.org/)/[Mongoose.js](http://mongoosejs.com/) for storage.  I like working in JSON-based document storage, and [Heroku](http://www.heroku.com) has some nice Mongo Addons.

Development
-----------

You'll need three things installd for development:

- Node.js
- Foreman (not required, but it makes things easier)
- MongoDB

To run your development version, go to the root directory and run:

`foreman start -f Procfile.local`

It should now be running on http://localhost:3333

Who
---

[Joe Wegner](http://www.twitter.com/Joe_Wegner) from [WegnerDesign](http://www.wegnerdesign.com)