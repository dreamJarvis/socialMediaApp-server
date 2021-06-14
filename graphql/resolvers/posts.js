const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');
const { AuthenticationError } = require('apollo-server');

module.exports = {
    Query: {
    async getPosts(){
      try {
        const post = await Post.find().sort({createdAt: -1});
        return post;
      }catch (err){
        throw new Error(err.message);
      }
    },
      
    async getPost(_, { postId }){
      try {
        const post = await Post.findById(postId);
        if(post){
          return post;
        }else{
          throw new Error('Post not found !');
        }
      }catch(err){
        throw new Error(err);
      }
    }
	},

    //** Post mutations
  Mutation : {
    // Creating post's
    async createPost(_, { body }, context){
      const user = checkAuth(context);    // it already confirms if the user accessing the id is the admin or not

      if(body.trim() === ''){
        throw new Error('Post body must not be empty');
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      
      const post = await newPost.save();

      // listening if the post has been created
      context.pubsub.publish('NEW_POST', {
        newPost: post
      });
      
      return post;
    },

    // deleting post's
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);
      try{
        const post = await Post.findById(postId);
        if(user.username === post.username){
          await post.delete();
          return 'Post deleted successfully';
        }else{
          throw new AuthenticationError('Action not permitted');
        }
      }catch(err){
        throw new Error(err);
      }
    }
  },

  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    }
  }
}