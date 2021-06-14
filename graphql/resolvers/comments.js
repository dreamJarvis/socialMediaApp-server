const { UserInputError, AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Mutation: {
    // add comments to the particular post of post ID
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context); // user authentication performed
            
      if(body.trim() === ''){
        throw new UserInputError('Empty comment', { 
          errors: {
            body: 'Comment body can\'t be empty'
          }
        });
      }   

      // finding the post and adding comment to it
      const post = await Post.findById(postId);
      if(post){
        post.comments.unshift({
          body, 
          username,
          createdAt: new Date().toISOString()
        });
        await post.save();
        return post;
      }
      else throw new UserInputError('Post not found');
    },

    // delete comment of commentId of post with postId
    deleteComment: async (_, {postId, commentId}, context) => {
      const { username } = checkAuth(context);
      const post = await Post.findById(postId);

      if(post){
        const commentIndex = post.comments.findIndex((comment) => comment.id === commentId);  

        if(post.comments[commentIndex].username === username){
          post.comments.splice(commentIndex, 1);
          await post.save(post);
          return post;
        }else{
          throw new AuthenticationError('Action not permitted');
        }
      }else{
        throw new UserInputError('Post not found');
      }
    },

    // add/remove likes on a post
    async likePost(_, { postId }, context ){
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if(post){
        // find the post wich current user have posted
        if(post.likes.find(like => like.username === username)){  
          // post is already liked, unlike it
          post.likes = post.likes.filter(like => like.username !== username);   
        }else {
          // Not liked post, like it
          post.likes.push({
            username: username,
            createdAt: new Date().toISOString()
          });
        }
        await post.save();
        return post;
      }else throw new UserInputError('post not found!');
    }
  }
}