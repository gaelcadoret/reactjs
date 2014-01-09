/** @jsx React.DOM */
// The above declaration must remain intact at the top of the script.
// Your code here

// tutorial4.js
var CommentList = React.createClass({

    render: function() {

        var commentNodes = this.props.data.map(function (comment) {
            return <Comment author={comment.author}>{comment.text}</Comment>;
        });

        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var Header = React.createClass({

    render: function() {

        return (
            <div className="logo">
                <img src="img/logo.png" />
            </div>
        )

    }
});

var CommentForm = React.createClass({
  
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
          <form className="commentForm">
            <input type="text" placeholder="Your name"  ref="author" />
            <input type="text" placeholder="Say something..." ref="text" />
            <input type="submit" value="Post" />
          </form>
        );
    }
});

// tutorial3.js
var CommentBox = React.createClass({
  
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
          <div className="commentBox">
            <h1>Comments</h1>
            <CommentList data={this.state.data} />
            <CommentForm onCommentSubmit={this.handleCommentSubmit} />
          </div>
        );
    }
});

var converter = new Showdown.converter();

// tutorial5.js
var Comment = React.createClass({

    render: function() {
        var rawMarkup = converter.makeHtml(this.props.children.toString());
        return (
          <div className="comment">
            <h2 className="commentAuthor">
              {this.props.author}
            </h2>
            <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
          </div>
        );
    }
});


React.renderComponent(
    <Header />,
    document.getElementById('header')
);

React.renderComponent(
    <CommentBox url="comments.json" pollInterval={2000} />,
  document.getElementById('content')
);