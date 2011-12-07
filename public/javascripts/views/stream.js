$(function() {
  App.Views.Stream = Backbone.View.extend({

    el: $("#main_stream"),

    template: _.template($('#stream-element-template').html()),

    events: {
      "click #paginate": "loadMore"
    },

    initialize: function(){
      _.bindAll(this, "appendPost", "collectionFetched", "addAvatars");

      this.collection = new App.Collections.Stream;
      this.collection.bind("add", this.appendPost);
      this.loadMore();
    },

    appendPost: function(model) {
      var post = $(this.template($.extend(
        model.toJSON(),
        App.currentUser()
      )));

      $(this.el).append(post);

      // NOTE: this should be moved out to an after stream rendered callback
      $("time", post).timeago();
      $("label", post).inFieldLabels();

      Diaspora.BaseWidget.instantiate("StreamElement", post);
    },

    collectionFetched: function() {
      $("#loading").addClass("hidden");

      $(this.el).append($("<a>", {
        href: this.collection.url(),
        id: "paginate",
        'class': "paginate"
      }).text('more'));
    },

    loadMore: function(evt) {
      if(evt) {
        evt.preventDefault();
      }

      $("#loading").removeClass("hidden");
      this.$("#paginate").remove();

      this.collection.fetch({
        add: true,
        success: this.collectionFetched
      });
    },

    // NOTE: this should be moved out to a template probably?
    addAvatars: function() {
      _.each(_.uniq(this.collection.models), function(post) {
        var author = post.attributes.author;

        $("#selected_aspect_contacts .content").prepend($("<a>", {
          href: "/people/" + author.id,
          title: author.name
        }).html($("<img />", {
            'class': "avatar",
            'src': author.avatar.small,
            'data-person-id': author.id
          })));
      })
    }
  });

  if(window.useBackbone) {
    window.stream = new App.Views.Stream;
  }
});
