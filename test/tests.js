test( "test new instances are picked up by collection", function() {
    Backbone.connect('http://localhost:6001/') //creates a new hoodie at Backbone.hoodie

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

    var tasks = new TaskCollection();

    var aTask = new Task({
      name: 'Test is picked up by collection'
    });

    aTask.save();

    // Uncomment this and it will pass.
    //tasks.fetch();

    ok(tasks.get(aTask.get('id')));
});