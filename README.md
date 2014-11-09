# backbone-hoodie adapter
[![Build Status](https://travis-ci.org/hoodiehq/backbone-hoodie.svg)](https://travis-ci.org/hoodiehq/backbone-hoodie)

Use this adapter to maintain sync between your local Backbone.Collections and the local and remote hoodie datastores.

## Usage

```javascript
Backbone.connect('https://yourapp.hood.ie') //creates a new hoodie at Backbone.hoodie

var Task = Backbone.Model.extend({
  // models must have a type. maps to type in hoodie store.
  type: 'task',
  defaults: {
    name: 'New Task'
  }
});

var TaskCollection = Backbone.Collection.extend({
  // if a collection has a model, the adapter will keep the collection
  // up to date with all the models in the local store, as well as remote events
  model: Task 
})

var task = new Task({
  name: 'laundry'
});

// task will be saved into the hoodie store
task.save();

var tasks = new TaskCollection();

// upon initialization, tasks will fetch() all Task models from the datastore.
// it'll find t and insert t in tasks.

task2 = new Task({
  name: 'groceries'
});

task2.save();
// task2 will be saved into the hoodie store
// and will also be inserted into tasks

task.destroy();
// task will be deleted from the store
// and will be removed from tasks
```

## Tests

The test are using PhantomJS Karma, Mocha, Sinon, Chai.

Install the dependencies:

    npm install -g phantomjs
    npm install -g grunt-cli
    npm install

Run the tests via Grunt:

    grunt test
