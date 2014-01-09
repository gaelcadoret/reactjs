/** @jsx React.DOM */
// The above declaration must remain intact at the top of the script.
// Your code here

// tutorial4.js
var CommentList = React.createClass({displayName: 'CommentList',

    render: function() {

        var commentNodes = this.props.data.map(function (comment) {
            return Comment( {author:comment.author}, comment.text);
        });

        return (
            React.DOM.div( {className:"commentList"}, 
                commentNodes
            )
        );
    }
});

var Header = React.createClass({displayName: 'Header',

    render: function() {

        return (
            React.DOM.div( {className:"logo"}, 
                React.DOM.img( {src:"img/logo.png"} )
            )
        )

    }
});

var CommentForm = React.createClass({displayName: 'CommentForm',
  
    handleSubmit: function() {
        var author = this.refs.author.getDOMNode().value.trim();
        var text = this.refs.text.getDOMNode().value.trim();
        this.props.onCommentSubmit({author: author, text: text});

        if (!text || !author) { return false; }

        // TODO: send request to the server
        this.refs.author.getDOMNode().value = '';
        this.refs.text.getDOMNode().value = '';
        return false;
    },

    render: function() {

        return (
          React.DOM.form( {className:"commentForm"}, 
            React.DOM.input( {type:"text", placeholder:"Your name",  ref:"author"} ),
            React.DOM.input( {type:"text", placeholder:"Say something...", ref:"text"} ),
            React.DOM.input( {type:"submit", value:"Post"} )
          )
        );
    }
});

// tutorial3.js
var CommentBox = React.createClass({displayName: 'CommentBox',
  
    handleCommentSubmit: function(comment) {

        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});

        $.ajax({
            url: this.props.url,
            type: 'POST',
            data: comment,

            success: function(data) {
                this.setState({data: data});
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {data: []};
    },

    loadCommentsFromServer: function() {

        $.ajax({
          url: 'comments.json',
          dataType: 'json',

          success: function(data) {
            this.setState({data: data});
          }.bind(this),

          error: function(xhr, status, err) {
            console.error("comments.json", status, err.toString());
          }.bind(this)

        });

    },

    componentWillMount: function() {
        this.loadCommentsFromServer();
        //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    render: function() {
        return (
          React.DOM.div( {className:"commentBox"}, 
            React.DOM.h1(null, "Comments"),
            CommentList( {data:this.state.data} ),
            CommentForm( {onCommentSubmit:this.handleCommentSubmit} )
          )
        );
    }
});

var converter = new Showdown.converter();

// tutorial5.js
var Comment = React.createClass({displayName: 'Comment',

    render: function() {
        var rawMarkup = converter.makeHtml(this.props.children.toString());
        return (
          React.DOM.div( {className:"comment"}, 
            React.DOM.h2( {className:"commentAuthor"}, 
              this.props.author
            ),
            React.DOM.span( {dangerouslySetInnerHTML:{__html: rawMarkup}} )
          )
        );
    }
});


React.renderComponent(
    Header(null ),
    document.getElementById('header')
);

React.renderComponent(
    CommentBox( {url:"comments.json", pollInterval:2000} ),
  document.getElementById('content')
);