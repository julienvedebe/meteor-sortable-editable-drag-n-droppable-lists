Items = new Meteor.Collection('items');

Items.before.insert(function (userId, doc) {
  var position, highestItem;
  highestItem = Items.findOne({},
                     { sort: { position: -1 },
                     limit: 1});

  if (typeof highestItem !== "undefined" && highestItem !== null) {
    position = highestItem.position;
  } else {
    position = 0;
  }

  doc.position = position + 1;
});

if (Meteor.isClient) {
  Template.items.items = function () {
    return Items.find({}, {sort: {'position': 1}});
  }

  Template.items.events({
    focusout: function (e) {
      Items.update({ _id: this._id }, { $set: { body: e.target.innerText }});
    },
    'click input': function () {
      Items.insert({ body: 'Click to edit' });
    }
  });

  Template.items.rendered = function () {
    $('ul').sortable({
      handle: '.handle',
      stop: function (event, ui) {
        _.each( $(event.target).children('li'), function(item, index, list) {
          Items.update({
            _id: item.getAttribute('data-item-id')
          }, {
            $set: {
              position: index + 1
            }
          });
        });
      }
    });
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // if (Items.find().count() === 0) {
    //   _.each(
    //     ['One', 'Two', 'Three'], function (body, index) {
    //       Items.insert({ body: body, position: index + 1 });
    //     }
    //   );
    // }
  });
}
